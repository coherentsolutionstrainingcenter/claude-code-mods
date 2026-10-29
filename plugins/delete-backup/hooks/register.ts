import type { EngineInterface, FsEntry, Register } from 'claude-code'

// Backups live under the user's Claude Code folder, one folder per Bash call that deletes.
const BACKUP_ROOT = '.claude/delete-backup'

// Words that can move the shell's folder in ways this mod does not follow. Seeing one makes the folder unknown.
const FOLDER_WORDS = new Set(['pushd', 'popd', 'source', '.', 'eval', 'exec', 'builtin', 'command'])

// Shell words that come before the command that runs, so `then rm x` is an rm. A clause after one may not run.
const KEYWORDS = new Set(['if', 'then', 'else', 'elif', 'while', 'until', 'do', '!', 'time'])

// Expands ~ and globs, and prints the NUL-separated paths that exist. The targets come in as $@,
// so they never become part of the script text.
const RESOLVE = [
  'shopt -s nullglob',
  'for t in "$@"; do',
  '  case "$t" in "~") t=$HOME ;; "~/"*) t="$HOME/${t#"~/"}" ;; esac',
  '  IFS=',
  '  for p in $t; do',
  '    case "$p" in /*) ;; *) p="$PWD/$p" ;; esac',
  '    case "$p" in */.|*/..) continue ;; esac',
  "    if [ -e \"$p\" ] || [ -L \"$p\" ]; then printf '%s\\0' \"$p\"; fi",
  '  done',
  'done',
].join('\n')

// Runs cd the way the shell does, and prints the physical folder it ends in.
const CD = [
  'unset CDPATH',
  'case "$1" in "~") d=$HOME ;; "~/"*) d="$HOME/${1#"~/"}" ;; *) d=$1 ;; esac',
  'cd -- "$d" && pwd -P',
].join('\n')

type Token = { kind: 'word'; text: string } | { kind: 'op'; text: string } | { kind: 'subst' }

// Where the shell may be: its folder (undefined when unknown), and how the last command it ran exited.
type Status = 'ok' | 'fail' | 'unknown'
type State = { folder: string | undefined; status: Status }

// One rm: its raw targets, and every folder the shell may be in when it runs.
type Job = { targets: string[]; folders: (string | undefined)[]; subst: boolean }

type Walk = { jobs: Job[]; folder: string | undefined; grouped: boolean; cdMinus: boolean }

type Item = { original: string; backup: string }
type Manifest = { time: string; command: string; items: Item[] }

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'undo-delete',
      description: 'Restores the newest rm backup to its original paths',
    })

    return next(e)
  })

  on('tool.call', { tool: 'Bash' }, async ($, e, next) => {
    const tokens = tokenize(e.command)
    if (!tokens.some(t => t.kind === 'word' && (t.text === 'rm' || t.text === 'cd' || FOLDER_WORDS.has(t.text)))) {
      return next(e)
    }

    // The folder the Bash shell is in is kept per session, so a cd in one call holds for the next.
    const key = `folder:${await $.session.id()}:${e.agentId ?? 'main'}`
    let walk: Walk
    try {
      const stored = (await $.store.get(key)) as { folder: string | null } | undefined
      const start = stored === undefined ? await $.session.cwd() : (stored.folder ?? undefined)
      walk = await follow($, tokens, start)
      const held = holdReason(walk)
      if (held !== undefined) {
        return { deny: held }
      }
      await backUp($, walk.jobs, e.command)
    } catch (error) {
      return { deny: `delete-backup held this command: ${reason(error)}. Nothing was deleted.` }
    }

    const ran = await next(e)
    if (ran.deny === undefined) {
      await $.store.set(key, { folder: walk.folder ?? null })
    }
    return ran
  }).catch(($, e, next) => (next.called ? next(e) : { deny: 'delete-backup: its guard failed, so the command was not run.' }))

  on('command.run', { command: 'undo-delete' }, async $ => ({ text: await restore($) }))
}

/** Splits a command into words and operators, outside quotes. A $( or a backtick is marked wherever it appears. */
function tokenize(command: string): Token[] {
  const out: Token[] = []
  let word = ''
  let inWord = false
  let quote: '"' | "'" | undefined

  const endWord = () => {
    if (inWord) {
      out.push({ kind: 'word', text: word })
    }
    word = ''
    inWord = false
  }

  for (let i = 0; i < command.length; i++) {
    const c = command[i]
    const next = command[i + 1]
    if (c === '`' || (c === '$' && next === '(')) {
      out.push({ kind: 'subst' })
    }

    if (quote === "'") {
      if (c === "'") quote = undefined
      else word += c
      continue
    }
    if (c === '\\' && i + 1 < command.length && (quote === undefined || '"\\$`'.includes(next))) {
      word += command[++i]
      inWord = true
      continue
    }
    if (quote === '"') {
      if (c === '"') quote = undefined
      else word += c
      continue
    }
    if (c === '"' || c === "'") {
      quote = c
      inWord = true
      continue
    }
    if (c === ' ' || c === '\t') {
      endWord()
      continue
    }

    let op: string | undefined
    if (c === '\n' || c === ';') op = ';'
    else if (c === '&' && next === '&') op = '&&'
    else if (c === '|' && next === '|') op = '||'
    else if (c === '|') op = '|'
    else if (c === '&' && next !== '>' && command[i - 1] !== '>' && command[i - 1] !== '<') op = '&'
    else if (c === '(' || c === ')') op = c
    else if ((c === '{' || c === '}') && !inWord && (next === undefined || /[\s;&|()]/.test(next))) op = c

    if (op !== undefined) {
      endWord()
      out.push({ kind: 'op', text: op })
      if (op === '&&' || op === '||') i++
      continue
    }

    word += c
    inWord = true
  }
  endWord()
  return out
}

/**
 * Walks the command in order and works out every folder the shell may be in at each rm. A cd that may not
 * run, or runs after a command that may fail, is followed through each case, so the rm lists all of them.
 */
async function follow($: EngineInterface, tokens: Token[], start: string | undefined): Promise<Walk> {
  // A pipeline or background job runs in a subshell, so a cd in it does not move the shell.
  const piped = tokens.some(t => t.kind === 'op' && (t.text === '|' || t.text === '&'))
  const grouped = tokens.some(t => t.kind === 'op' && ['(', ')', '{', '}'].includes(t.text))
  const jobs: Job[] = []
  const frames: { skip: State[]; run: State[] }[] = []
  let cdMinus = false
  // Set once a keyword is seen: a later cd may sit in a branch that does not run.
  let branched = false
  let states: State[] = [{ folder: start, status: 'ok' }]
  let op = ';'
  let words: string[] = []
  let subst = false

  const applyUnit = async (s: State, args: string[]): Promise<State> => {
    const head = args[0]
    if (head === 'cd') {
      const target = cdTarget(args)
      if (target === '-') {
        cdMinus = true
        return { folder: undefined, status: 'unknown' }
      }
      if (target === undefined || piped || branched) {
        return { folder: undefined, status: 'unknown' }
      }
      return enter($, s.folder, target)
    }
    if (FOLDER_WORDS.has(head)) {
      return { folder: undefined, status: 'unknown' }
    }
    return { folder: s.folder, status: 'unknown' }
  }

  const finish = async () => {
    let args = words
    while (args.length > 0 && (KEYWORDS.has(args[0]) || args[0] === 'sudo')) {
      if (KEYWORDS.has(args[0])) {
        branched = true
      }
      args = args.slice(1)
    }
    const marked = subst
    words = []
    subst = false
    if (args.length === 0) {
      return
    }

    const { run, skip } = split(states, op)
    if (args[0] === 'rm') {
      const targets = operands(args.slice(1))
      if (targets.length > 0 && run.length > 0) {
        jobs.push({ targets, folders: [...new Set(run.map(s => s.folder))], subst: marked })
      }
    }
    const after: State[] = [...skip]
    for (const s of run) {
      after.push(await applyUnit(s, args))
    }
    states = merge(after)
  }

  for (const token of tokens) {
    if (token.kind === 'word') {
      words.push(token.text)
      continue
    }
    if (token.kind === 'subst') {
      subst = true
      continue
    }

    switch (token.text) {
      case '(': {
        await finish()
        const { run, skip } = split(states, op)
        frames.push({ skip, run })
        states = run
        op = ';'
        break
      }
      case ')': {
        await finish()
        const frame = frames.pop()
        if (frame !== undefined) {
          // A subshell's cd does not leave it: each state it ran in keeps its folder, with an unknown status.
          states = merge([...frame.skip, ...frame.run.map(s => ({ folder: s.folder, status: 'unknown' as Status }))])
        }
        break
      }
      case '{':
      case '}':
        await finish()
        break
      default:
        await finish()
        op = token.text
    }
  }
  await finish()

  const folders = new Set(states.map(s => s.folder))
  return { jobs, folder: folders.size === 1 ? [...folders][0] : undefined, grouped, cdMinus }
}

/** The states in which the next unit runs, and those in which it is skipped, given the operator before it. */
function split(states: State[], op: string): { run: State[]; skip: State[] } {
  if (op !== '&&' && op !== '||') {
    return { run: states, skip: [] }
  }

  // After && the unit runs when the last command succeeded; after || when it failed.
  const runsWhen: Status = op === '&&' ? 'ok' : 'fail'
  const skipWhen: Status = op === '&&' ? 'fail' : 'ok'
  const run: State[] = []
  const skip: State[] = []
  for (const s of states) {
    if (s.status === runsWhen) {
      run.push(s)
    } else if (s.status === skipWhen) {
      skip.push(s)
    } else {
      run.push({ folder: s.folder, status: runsWhen })
      skip.push({ folder: s.folder, status: skipWhen })
    }
  }
  return { run, skip }
}

/** Drops repeated states. Past a few, the folder is treated as unknown. */
function merge(states: State[]): State[] {
  const unique = new Map<string, State>()
  for (const s of states) {
    unique.set(JSON.stringify([s.folder ?? null, s.status]), s)
  }
  const out = [...unique.values()]
  return out.length > 16 ? [{ folder: undefined, status: 'unknown' }] : out
}

/** The reason this command must not run, or undefined. Only a command with an rm can be held. */
function holdReason(walk: Walk): string | undefined {
  for (const job of walk.jobs) {
    const why = jobWhy(job, walk)
    if (why !== undefined) {
      return `delete-backup held this command: ${why}. delete-backup cannot tell which files would be deleted, so nothing was deleted.`
    }
  }
  return undefined
}

function jobWhy(job: Job, walk: Walk): string | undefined {
  if (walk.grouped) return 'the command has a subshell or grouping'
  if (walk.cdMinus) return 'the command has cd -'
  if (job.subst) return 'the rm has a $( or a backtick'
  if (job.targets.some(target => target.includes('$'))) return 'an rm target has a $'
  if (job.folders.length > 1) return 'the rm may run in more than one folder'
  if (job.folders[0] === undefined) return 'the working folder is unknown (run cd with an absolute path to set it)'
  return undefined
}

/** Where a cd leaves the shell. A cd that fails leaves it where it was. Its folder is unknown when that cannot be worked out. */
async function enter($: EngineInterface, folder: string | undefined, target: string): Promise<State> {
  const absolute = target.startsWith('/') || target === '~' || target.startsWith('~/')
  if (/[$`]/.test(target) || (target.startsWith('~') && !absolute) || (folder === undefined && !absolute)) {
    return { folder: undefined, status: 'unknown' }
  }

  const cwd = folder ?? (await $.session.cwd())
  const ran = await $.process.run(['bash', '-c', CD, 'delete-backup', target], { cwd })
  return ran.exitCode === 0 ? { folder: ran.stdout.replace(/\n$/, ''), status: 'ok' } : { folder, status: 'fail' }
}

/** The operand of a cd: '-' for cd -, undefined when there are several, home when there is none. */
function cdTarget(args: string[]): string | undefined {
  const found = operands(args.slice(1))
  if (found.length === 0) return '~'
  if (found.length > 1) return undefined
  return found[0]
}

/** The arguments that are not options. Everything after -- is an operand. */
function operands(args: string[]): string[] {
  const out: string[] = []
  let endOfOptions = false
  for (const arg of args) {
    if (!endOfOptions && arg === '--') {
      endOfOptions = true
    } else if (endOfOptions || arg === '-' || !arg.startsWith('-')) {
      out.push(arg)
    }
  }
  return out
}

/** Copies the existing targets of every rm in the command into one new backup folder. Throws when a copy fails. */
async function backUp($: EngineInterface, jobs: Job[], command: string): Promise<void> {
  const all: string[] = []
  for (const job of jobs) {
    all.push(...(await existing($, job)))
  }
  const unique = [...new Set(all)]
  // A path inside another one comes back with it, so it is not copied twice.
  const found = unique.filter(path => !unique.some(other => path.startsWith(`${other}/`)))
  if (found.length === 0) {
    return
  }

  const now = await $.clock.now()
  const folder = `${await backupRoot($)}/${stamp(now)}`
  const made = await attempt($, ['mkdir', '-p', folder])
  if (made !== undefined) {
    throw new Error(`could not create ${folder}: ${made}`)
  }

  const items: Item[] = []
  for (const [index, original] of found.entries()) {
    const backup = `${index + 1}-${nameOf(original)}`
    const copied = await attempt($, ['cp', '-Rp', original, `${folder}/${backup}`])
    if (copied !== undefined) {
      throw new Error(`could not copy ${original}: ${copied}`)
    }
    items.push({ original, backup })
  }

  // The manifest comes last, so a folder without one is an incomplete backup that restore skips.
  const manifest: Manifest = { time: new Date(now).toISOString(), command, items }
  await $.fs.write(`${folder}/manifest.json`, `${JSON.stringify(manifest, null, 2)}\n`)
}

/** The paths among one rm's targets that exist, resolved in the folder the shell is in when it runs. */
async function existing($: EngineInterface, job: Job): Promise<string[]> {
  const ran = await $.process.run(['bash', '-c', RESOLVE, 'delete-backup', ...job.targets], { cwd: job.folders[0] })
  if (ran.exitCode !== 0) {
    throw new Error(`could not read the rm targets: ${ran.stderr.trim()}`)
  }
  // A cut list would leave some targets without a backup.
  if (ran.isStdoutTruncated) {
    throw new Error('the rm targets match too many paths to list')
  }
  return ran.stdout
    .split('\0')
    .filter(path => path !== '')
    .map(trimSlash)
}

/** Puts the newest complete backup back. Never writes over a path that exists, and removes the backup only once every item is back. */
async function restore($: EngineInterface): Promise<string> {
  const root = await backupRoot($)
  const name = await newestBackup($, root)
  if (name === undefined) {
    return 'No delete backup to restore.'
  }

  const folder = `${root}/${name}`
  const manifest = JSON.parse(await $.fs.read(`${folder}/manifest.json`)) as Manifest
  const restored: string[] = []
  const failed: string[] = []
  for (const item of manifest.items) {
    const problem = await putBack($, folder, item).catch(error => reason(error))
    if (problem === undefined) {
      restored.push(item.original)
    } else {
      failed.push(`${item.original}: ${problem}`)
    }
  }

  const lines = [`Restored ${restored.length} of ${manifest.items.length} item(s) from ${manifest.time}:`]
  lines.push(...restored.map(path => `  ${path}`))
  if (failed.length > 0) {
    lines.push(...failed.map(line => `Could not restore ${line}`), `The backup is kept at ${folder}.`)
  } else {
    // Only a folder this mod created is removed here.
    const gone = await attempt($, ['rm', '-r', folder])
    lines.push(gone === undefined ? 'The backup was removed.' : `Restored, but the backup could not be removed: ${gone}`)
  }
  return lines.join('\n')
}

/** Puts one item back at its original path. Returns why not, or undefined once it is back. */
async function putBack($: EngineInterface, folder: string, item: Item): Promise<string | undefined> {
  if ((await namesIn($, dirOf(item.original))).includes(nameOf(item.original))) {
    return 'a file is already at that path'
  }

  const made = await attempt($, ['mkdir', '-p', dirOf(item.original)])
  if (made !== undefined) {
    return made
  }
  return attempt($, ['cp', '-Rp', `${folder}/${item.backup}`, item.original])
}

/** The newest folder under the backup root that has a manifest, or undefined. Names are ISO times, so they sort by age. */
async function newestBackup($: EngineInterface, root: string): Promise<string | undefined> {
  const folders = (await entriesOf($, root))
    .filter(entry => entry.kind === 'dir')
    .map(entry => entry.name)
    .sort()
    .reverse()

  for (const name of folders) {
    if (await $.fs.exists(`${root}/${name}/manifest.json`)) {
      return name
    }
  }
  return undefined
}

async function backupRoot($: EngineInterface): Promise<string> {
  const home = await $.env.get('HOME')
  if (home === undefined || home === '') {
    throw new Error('HOME is not set')
  }
  return `${home}/${BACKUP_ROOT}`
}

/** Runs one command with no shell. Returns its last error line, or undefined when it succeeded. */
async function attempt($: EngineInterface, argv: string[]): Promise<string | undefined> {
  const ran = await $.process.run(argv, { timeoutMs: 600000 })
  if (ran.exitCode === 0) {
    return undefined
  }
  return ran.stderr.trim().split('\n').pop() || `exit code ${ran.exitCode}`
}

async function entriesOf($: EngineInterface, dir: string): Promise<FsEntry[]> {
  return $.fs.list(dir).catch(() => [])
}

async function namesIn($: EngineInterface, dir: string): Promise<string[]> {
  return (await entriesOf($, dir)).map(entry => entry.name)
}

/** A folder-safe ISO time, such as 2026-10-29T18-20-05-123Z. */
function stamp(ms: number): string {
  return new Date(ms).toISOString().replace(/[:.]/g, '-')
}

function nameOf(path: string): string {
  return path.slice(path.lastIndexOf('/') + 1)
}

function dirOf(path: string): string {
  return path.slice(0, path.lastIndexOf('/')) || '/'
}

function trimSlash(path: string): string {
  return path.replace(/(.)\/+$/, '$1')
}

function reason(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}
