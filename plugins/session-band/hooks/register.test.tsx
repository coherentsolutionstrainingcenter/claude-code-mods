import { expect, mock, test } from 'claude-code/testing'

const BAND = {
  component: 'AbovePrompt',
  props: { hasSurvey: false, isWorking: false, maxRows: 10, bodyColumns: 120 } as never,
} as const

test('the session row keeps the bands drawn beneath it', async ($, on) => {
  // Each hook here stands for what sits beneath the plugin: the engine, and another mod's band.
  mock.clock(on, { now: Date.parse('2026-10-30T10:00:00Z') })
  on('session.usage', () => ({ value: { cost: { usd: 1.5 } } }) as never)
  on('turn.start', () => ({ turnId: 't1' }) as never)
  on('ui.render', ($, e) => $.ui.resolve(e).Text({ children: 'beneath band' }))

  await $.turn.start({ turnId: 't1' } as never)

  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ plugin: 'session-band', surface, ...BAND })
    expect(await ui.find({ key: 'hide' })).toBeDefined()
    expect((await ui.find({ type: 'Text', text: /beneath band/ }))?.text).toBe('beneath band')
    await ui.unmount()
  }
})

test('the session row leaves out Claude Code’s placeholder when nothing is drawn beneath it', async ($, on) => {
  mock.clock(on, { now: Date.parse('2026-10-30T10:00:00Z') })
  on('session.usage', () => ({ value: { cost: { usd: 1.5 } } }) as never)
  on('turn.start', () => ({ turnId: 't1' }) as never)
  // With no band beneath, next(e) answers Claude Code's own drawing of the band.
  on('ui.render', () => ({ type: 'engine', ref: 0 }) as never)

  await $.turn.start({ turnId: 't1' } as never)

  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ plugin: 'session-band', surface, ...BAND })
    expect(await ui.find({ key: 'hide' })).toBeDefined()
    expect(JSON.stringify(await ui.drawn())).not.toContain('"engine"')
    await ui.unmount()
  }
})
