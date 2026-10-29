import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { Audit, Check, Flag, Installed, View } from '../types'

const PANE = 'mod-doctor'
const LIST_CHARS = 200

const view = atom(
  { plugin: 'mod-doctor', key: 'view' } as const,
  { status: 'idle', error: '', audit: null } as View,
)

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'mod-doctor',
      description: 'Mod doctor: audits the installed mods with the plugin validator',
    })

    return next(e)
  })

  on('command.run', { command: 'mod-doctor' }, async $ => {
    void $.ui.open({ id: PANE, title: 'Mod doctor' })
    void audit($)

    return { text: 'Mod doctor opened.' }
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Button, Text } = $.ui.resolve(e)
    const current = await read($, view)

    return (
      <Box flexDirection="column">
        <Box>
          <Button
            key="refresh"
            label={current.status === 'reading' ? 'Auditing…' : 'Refresh'}
            onPress={() => void audit($)}
          />
        </Box>
        {body(current, Box, Text)}
      </Box>
    )
  })
}

/** Lists the plugins, validates each enabled one with a folder, and stores the findings. One run at a time. */
async function audit($: EngineInterface): Promise<void> {
  const current = await read($, view)
  if (current.status === 'reading') {
    return
  }
  await update($, view, v => ({ ...v, status: 'reading', error: '' }))

  try {
    const listed = await $.process.run(['claude', 'plugin', 'list'], { timeoutMs: 60000 })
    if (listed.exitCode !== 0) {
      throw new Error(listed.stderr.trim().slice(0, 300) || `exit code ${listed.exitCode}`)
    }

    const installed = parseList(listed.stdout)
    const checks: Check[] = []
    for (const plugin of installed) {
      if (plugin.enabled && plugin.folder !== null) {
        checks.push(await validateOne($, plugin.id, plugin.version, plugin.folder))
      }
    }

    const result: Audit = {
      at: Date.now(),
      installed: installed.length,
      enabled: installed.filter(plugin => plugin.enabled).length,
      disabled: installed.filter(plugin => !plugin.enabled).map(plugin => plugin.id),
      noFolder: installed.filter(plugin => plugin.enabled && plugin.folder === null).map(plugin => plugin.id),
      checks,
      flags: flagsFor(installed, checks),
    }
    await update($, view, v => ({ ...v, status: 'ready', audit: result }))
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    await update($, view, v => ({ ...v, status: 'failed', error: message }))
  }
}

/** Runs the validator on one plugin folder. A run that cannot finish gives no verdict. */
async function validateOne($: EngineInterface, id: string, version: string, folder: string): Promise<Check> {
  try {
    // The folder goes in as one argument, so no shell reads it.
    const run = await $.process.run(['claude', 'plugin', 'validate', folder], { timeoutMs: 60000 })
    const text = run.stdout + run.stderr

    return { id, version, ...parseValidate(text), ...declared(text) }
  } catch (error) {
    const problem = error instanceof Error ? error.message : String(error)
    return { id, version, verdict: 'unknown', warnings: 0, errors: 0, problem, hooks: [], calls: [] }
  }
}

function body(current: View, Box: any, Text: any) {
  if (current.status === 'idle') {
    return <Text dimColor>Press Refresh to audit the installed mods.</Text>
  }
  if (current.status === 'reading') {
    return <Text dimColor>Listing the plugins and validating each enabled one. This takes a few seconds.</Text>
  }
  if (current.status === 'failed' || current.audit === null) {
    return <Text color="red">Could not run the audit: {current.error || 'no output'}</Text>
  }

  const audit = current.audit
  return (
    <Box flexDirection="column">
      <Text>
        {audit.installed} installed · {audit.enabled} enabled · {audit.checks.length} validated · checked{' '}
        {new Date(audit.at).toLocaleTimeString()}
      </Text>
      {audit.flags.length === 0 && <Text>No flags.</Text>}
      {audit.flags.map((flag, i) => (
        <Text key={`flag${i}`} color={flag.severity === 'fail' ? 'red' : 'yellow'}>
          {flag.text}
        </Text>
      ))}
      {audit.checks.length === 0 && <Text dimColor>No enabled plugin has a folder to validate.</Text>}
      {audit.checks.map(check => (
        <Box key={check.id} flexDirection="column">
          <Text color={check.verdict === 'passed' ? undefined : 'red'}>
            {check.verdict === 'passed' ? '✔' : check.verdict === 'failed' ? '✘' : '?'} {check.id}  {check.version}{' '}
            {verdictText(check)}
          </Text>
          <Text dimColor>
            {'  '}hooks: {clip(check.hooks.join(', ') || 'none', LIST_CHARS)}
          </Text>
          <Text dimColor>
            {'  '}calls ({check.calls.length}): {clip(check.calls.join(', ') || 'none', LIST_CHARS)}
          </Text>
        </Box>
      ))}
      <Text dimColor>
        Not validated, no folder (built-in or synced): {audit.noFolder.join(', ') || 'none'}
      </Text>
      <Text dimColor>Not enabled, not validated: {audit.disabled.join(', ') || 'none'}</Text>
      <Text dimColor>
        The validator checks structure and the declared calls, not behaviour. A pass does not show that a mod works.
      </Text>
    </Box>
  )
}

function verdictText(check: Check): string {
  if (check.verdict === 'unknown') {
    return 'no verdict'
  }
  if (check.verdict === 'failed') {
    return `failed, ${count(check.errors, 'error')}`
  }
  return check.warnings === 0 ? 'passed' : `passed, ${count(check.warnings, 'warning')}`
}

function count(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? '' : 's'}`
}

function clip(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text
}

/** Plain-words flags: failed checks, plugins that hook tool.call, and one name enabled under two marketplaces. */
function flagsFor(installed: Installed[], checks: Check[]): Flag[] {
  const flags: Flag[] = []

  for (const check of checks) {
    if (check.verdict !== 'passed') {
      const reason = check.problem ? `: ${check.problem}` : ''
      flags.push({ text: `${check.id} did not pass validation${reason}`, severity: 'fail' })
    }
  }

  const hookers = checks
    .filter(check => check.hooks.some(hook => hook.split('{')[0] === 'tool.call'))
    .map(check => check.id)
  if (hookers.length >= 2) {
    flags.push({
      text: `${hookers.length} enabled plugins hook tool.call, and their order matters: ${hookers.join(', ')}`,
      severity: 'note',
    })
  }

  const byName = new Map<string, string[]>()
  for (const plugin of installed.filter(p => p.enabled)) {
    const name = plugin.id.split('@')[0]
    byName.set(name, [...(byName.get(name) ?? []), plugin.id])
  }
  for (const [name, ids] of byName) {
    if (ids.length >= 2) {
      flags.push({
        text: `${name} is enabled under ${ids.length} marketplaces: ${ids.join(', ')}`,
        severity: 'note',
      })
    }
  }

  return flags
}

/** Reads the rows of `claude plugin list`. Only a "Read from:" line gives a folder. */
function parseList(text: string): Installed[] {
  const rows: Installed[] = []
  let row: Installed | null = null

  for (const line of text.split('\n')) {
    const head = line.match(/^\s*❯ (\S+)\s*$/)
    if (head) {
      row = { id: head[1], version: '', enabled: false, folder: null }
      rows.push(row)
      continue
    }

    const field = line.match(/^\s+(Version|Read from|Status):\s*(.*?)\s*$/)
    if (row === null || field === null) {
      continue
    }
    if (field[1] === 'Version') {
      row.version = field[2]
    } else if (field[1] === 'Read from') {
      row.folder = field[2]
    } else {
      row.enabled = /\b(enabled|loaded)\b/.test(field[2])
    }
  }

  return rows
}

/** Reads the verdict, the counts and the first error of one `claude plugin validate` run. */
function parseValidate(text: string): Pick<Check, 'verdict' | 'warnings' | 'errors' | 'problem'> {
  // Match the words after the status symbol, not the symbol itself.
  const verdict = /^[^\w\n]*Validation failed\s*$/m.test(text)
    ? 'failed'
    : /^[^\w\n]*Validation passed/m.test(text)
      ? 'passed'
      : 'unknown'
  const warnings = Number(text.match(/^[^\w\n]*Found (\d+) warnings?:/m)?.[1] ?? 0)
  const errors = Number(text.match(/^[^\w\n]*Found (\d+) errors?:/m)?.[1] ?? 0)
  // The directory's own findings are left out: they do not change the verdict.
  const problem =
    text.match(/^[^\w\n]*Found \d+ errors?:[\s\S]*?^\s*❯ (.+)$/m)?.[1] ??
    (verdict === 'unknown' ? 'no verdict from the validator' : '')

  return { verdict, warnings, errors, problem }
}

/** The hook events and calls the validator lists for each hooks module. */
function declared(text: string): Pick<Check, 'hooks' | 'calls'> {
  const hooks: string[] = []
  const calls: string[] = []

  for (const line of text.split('\n')) {
    const hookList = line.match(/^\s*❯ .*? hooks: (.+)$/)?.[1]
    if (hookList !== undefined) {
      hooks.push(...splitTop(hookList))
    }

    const callList = line.match(/^\s*❯ .*? calls: (.+)$/)?.[1]
    if (callList !== undefined) {
      // Drop the "(via ...)" notes first: they hold commas of their own.
      const names = callList.replace(/\s*\([^)]*\)/g, '')
      calls.push(...names.split(',').map(call => call.trim()).filter(call => call !== ''))
    }
  }

  return { hooks, calls: [...new Set(calls)] }
}

/** Splits on commas outside braces, so a matcher such as ui.press{plugin=x, element=y} stays whole. */
function splitTop(list: string): string[] {
  const parts: string[] = []
  let depth = 0
  let part = ''

  for (const ch of list) {
    if (ch === '{') {
      depth += 1
    } else if (ch === '}') {
      depth -= 1
    }

    if (ch === ',' && depth === 0) {
      parts.push(part.trim())
      part = ''
    } else {
      part += ch
    }
  }
  parts.push(part.trim())

  return parts.filter(p => p !== '')
}
