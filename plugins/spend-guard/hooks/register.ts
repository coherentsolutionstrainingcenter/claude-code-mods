import type { EngineInterface, Register, ToolCallInput } from 'claude-code'

// Shell commands that publish or deploy. Each is matched anywhere in a Bash
// command, so `cd app && npm publish` is held too.
const PUBLISH_COMMANDS = [
  /\b(npm|pnpm|yarn)(\s+npm)?\s+publish\b/,
  /\btwine\s+upload\b/,
  /\bdocker\s+(image\s+)?push\b/,
  /\bgh\s+release\s+create\b/,
  /\bvercel\b[^;&|\n]*\s--prod\b/,
]

// A word in an MCP tool's own name that means the call spends or publishes.
const PAID_TOOL = /(^|_)(publish|deploy|post|send|charge|generate_image|generate_video)(_|$)/

const MAIN_BRANCHES = ['main', 'master']

// The keys tool.call carries beside a tool's own arguments.
const ENVELOPE = ['tool', 'tool_use_id', 'agentId', 'requestMeta']

type Tally = { day: string; count: number }

export const register: Register = (on, options) => {
  const extra = String(options.extraPatterns ?? '')
    .toLowerCase()
    .split(',')
    .map(p => p.trim())
    .filter(p => p !== '')

  on('tool.call', async ($, e, next) => {
    const what = await describeRisk($, e, extra)
    if (what === undefined) {
      return next(e)
    }

    const day = localDay(await $.clock.now())
    const tally = (await $.store.get('approvals')) as Tally | undefined
    const count = tally?.day === day ? tally.count : 0

    // A dismissed dialog, or a run with no one to ask, rejects: that counts as Cancel.
    const choice = await $.ui
      .ask(
        [
          'This call may cost money or publish something.',
          what,
          'Check: right account? right file? right destination?',
          `Approved today: ${count}. Proceed?`,
        ].join('\n'),
        { options: ['Proceed', 'Cancel'], header: 'Spend guard' },
      )
      .catch(() => 'Cancel')

    if (choice !== 'Proceed') {
      return {
        deny: `spend-guard held this call: the person did not approve it. Do not retry unless they ask. (${what})`,
      }
    }

    const approved: Tally = { day, count: count + 1 }
    await $.store.set('approvals', approved).catch(() => undefined)

    return next(e)
  }).catch(($, e, next) =>
    // A guard that fails holds the call rather than letting it through.
    next.called
      ? next(e)
      : { deny: 'spend-guard could not check this call, so it held it. Ask the person before you try again.' },
  )
}

// What the call is about to do, as the question shows it; undefined lets it through unasked.
async function describeRisk($: EngineInterface, e: ToolCallInput, extra: string[]): Promise<string | undefined> {
  if (e.tool === 'Bash') {
    const command = e.command.toLowerCase()
    const isHeld =
      PUBLISH_COMMANDS.some(re => re.test(command)) ||
      extra.some(p => command.includes(p)) ||
      (await pushesToMain($, e.command))

    return isHeld ? `Bash: ${clip(e.command)}` : undefined
  }

  const name = e.tool.toLowerCase()
  const ownName = e.tool.startsWith('mcp__') ? e.tool.split('__').slice(2).join('_') : undefined
  const isHeld = (ownName !== undefined && PAID_TOOL.test(words(ownName))) || extra.some(p => name.includes(p))
  if (!isHeld) {
    return undefined
  }

  const args = Object.fromEntries(Object.entries(e).filter(([key]) => !ENVELOPE.includes(key)))

  return `${e.tool}: ${clip(JSON.stringify(args))}`
}

// "createPost", "create-post" and "create_post" all read as "create_post".
function words(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
}

// True when a `git push` in the command goes to main or master: a refspec names
// it, or a bare push (or HEAD) runs while main or master is checked out.
async function pushesToMain($: EngineInterface, command: string): Promise<boolean> {
  for (const part of command.split(/&&|\|\||[;|\n]/)) {
    const push = part.match(/^\s*(?:\w+=\S*\s+)*git((?:\s+-[cC]\s+\S+)*)\s+push\b(.*)$/)
    if (push === null) {
      continue
    }

    const args = (push[2] ?? '').trim().split(/\s+/).filter(a => a !== '')
    if (args.includes('--all') || args.includes('--mirror')) {
      return true
    }

    // The first word that is not an option is the remote; the rest are refspecs.
    const refspecs = args.filter(a => !a.startsWith('-')).slice(1)
    const targets = refspecs.map(r =>
      (r.split(':').pop() ?? '')
        .replace(/['"]/g, '')
        .replace(/^\+/, '')
        .replace(/^refs\/heads\//, ''),
    )
    if (targets.some(t => MAIN_BRANCHES.includes(t))) {
      return true
    }

    if (refspecs.length === 0 || targets.includes('HEAD')) {
      const dir = push[1]?.match(/-C\s+(\S+)/)?.[1]
      if (MAIN_BRANCHES.includes(await currentBranch($, dir))) {
        return true
      }
    }
  }

  return false
}

// The checked-out branch, or '' when git cannot say (no repository, a detached HEAD).
async function currentBranch($: EngineInterface, dir: string | undefined): Promise<string> {
  const run = await $.process
    .run(['git', 'branch', '--show-current'], { cwd: dir, timeoutMs: 5000 })
    .catch(() => undefined)

  return run?.exitCode === 0 ? run.stdout.trim() : ''
}

// The local calendar day, so the count starts again at midnight.
function localDay(ms: number): string {
  const d = new Date(ms)

  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

function clip(text: string): string {
  return text.length > 300 ? `${text.slice(0, 300)}...` : text
}
