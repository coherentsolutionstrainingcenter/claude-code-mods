import { expect, test } from 'claude-code/testing'

const TOKENS = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 }
const REPORT = {
  generatedAt: 0,
  files: 1,
  scanned: 1,
  stale: 0,
  pending: 0,
  failed: 0,
  days: {
    '2026-10-29': { tasks: 3, categories: { commands: 2, conversation: 1 }, models: {}, tokens: TOKENS },
    '2026-10-30': { tasks: 1, categories: { 'code changes': 1 }, models: {}, tokens: TOKENS },
  },
}

const PANE = {
  plugin: 'today-report',
  component: 'Pane',
  requestId: 'today-report',
  props: {
    title: "Today's Report",
    isFocused: false,
    bodyColumns: 60,
    placement: 'dock',
    scroll: { offset: 0, bodyRows: 40 },
    view: {},
  },
} as const

test('the report draws a chart, and text bars on the terminal', async ($, on) => {
  // Nothing sits beneath the plugin: each hook here stands for the engine.
  on('command.register', () => ({ value: { command: 'today-report' } }))
  on('ui.open', () => ({ value: { isPlaced: true } }))
  on('config.list', () => ({ value: [] }))
  on('process.run', () => ({ value: { exitCode: 0, stdout: JSON.stringify(REPORT), stderr: '' } }) as never)
  await $.command.run({ command: 'today-report', args: '' } as never)

  for (const surface of ['desktop', 'vscode', 'mobile'] as const) {
    const ui = await $.ui.mount({ ...PANE, surface })
    expect(await ui.find({ type: 'Text', text: /^Tasks per day$/ })).toBeDefined()
    const chart = (await ui.find({ type: 'Svg' })) as { props: { alt: string; source: string } } | undefined
    expect(chart?.props.alt).toBe('Tasks per day, 2026-10-29 to 2026-10-30: 3, 1')
    expect(chart?.props.source).toContain('2026-10-29: 3 tasks, 0.5 h, $25. commands: 2')
    await ui.unmount()
  }

  const ui = await $.ui.mount({ ...PANE, surface: 'terminal' })
  expect((await ui.findAll({ type: 'Svg' } as never)).length).toBe(0)
  expect((await ui.find({ type: 'Text', text: /oldest first/ }))?.text).toBe('Tasks per day, oldest first: █▃')
  await ui.unmount()
})
