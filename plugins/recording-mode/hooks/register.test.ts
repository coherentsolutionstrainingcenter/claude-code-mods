import { expect, mock, test } from 'claude-code/testing'
import type { On } from 'claude-code'

const BAND = {
  component: 'AbovePrompt',
  props: { hasSurvey: false, isWorking: false, maxRows: 10, bodyColumns: 100 } as never,
} as const

// Stands for the engine beneath the mod: no .env files, a home folder, and `beneath` for the band.
function engine(on: On, beneath: (ui: { Text: (props: object) => unknown }) => unknown) {
  const files: Record<string, string> = {}
  mock.clock(on, { now: 1000 })
  on('env.get', (_, e) => ({ value: e.name === 'HOME' ? '/home/u' : undefined }) as never)
  on('session.cwd', () => ({ value: '/repo' }) as never)
  on('session.start', (_, e) => ({ cwd: e.cwd }) as never)
  on('command.register', (_, e) => ({ value: { command: e.name } }) as never)
  on('fs.exists', (_, e) => ({ value: e.path in files }) as never)
  on('fs.read', (_, e) => ({ value: files[e.path] ?? '' }) as never)
  on('fs.write', (_, e) => ((files[e.path] = e.text), { value: undefined }) as never)
  on('ui.toast', () => ({ value: undefined }) as never)
  on('ui.render', ($, e) => beneath($.ui.resolve(e) as never) as never)
}

async function recordOn($: Parameters<Parameters<typeof test>[1]>[0]) {
  await $.session.start({ source: 'startup', cwd: '/repo', surface: 'terminal', isInteractive: true } as never)
  await $.command.run({ command: 'rec', args: '' } as never)
}

test('the REC badge keeps the bands drawn beneath it', async ($, on) => {
  engine(on, ui => ui.Text({ children: 'beneath band' }))
  await recordOn($)

  const ui = await $.ui.mount({ plugin: 'recording-mode', surface: 'terminal', ...BAND })
  expect(await ui.find({ type: 'Text', text: /● REC/ })).toBeDefined()
  expect((await ui.find({ type: 'Text', text: /beneath band/ }))?.text).toBe('beneath band')
  await ui.unmount()
})

test('the REC badge leaves out Claude Code’s placeholder when nothing is drawn beneath it', async ($, on) => {
  // With no band beneath, next(e) answers Claude Code's own drawing of the band.
  engine(on, () => ({ type: 'engine', ref: 0 }))
  await recordOn($)

  const ui = await $.ui.mount({ plugin: 'recording-mode', surface: 'terminal', ...BAND })
  expect(await ui.find({ type: 'Text', text: /● REC/ })).toBeDefined()
  expect(JSON.stringify(await ui.drawn())).not.toContain('"engine"')
  await ui.unmount()
})
