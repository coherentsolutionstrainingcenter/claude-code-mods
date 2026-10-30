import { expect, mock, test } from 'claude-code/testing'

const BAND = {
  component: 'AbovePrompt',
  props: { hasSurvey: false, isWorking: false, maxRows: 10, bodyColumns: 100 } as never,
} as const

test('the pet keeps the bands drawn beneath it', async ($, on) => {
  // Each hook here stands for what sits beneath the plugin: the engine, and another mod's band.
  mock.clock(on, { now: 1000 })
  on('ui.render', ($, e) => $.ui.resolve(e).Text({ children: 'beneath band' }))

  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ plugin: 'terminal-pet', surface, ...BAND })
    expect(await ui.find({ type: 'Text', text: /Pip/ })).toBeDefined()
    expect((await ui.find({ type: 'Text', text: /beneath band/ }))?.text).toBe('beneath band')
    await ui.unmount()
  }
})
