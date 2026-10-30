import { expect, mock, test } from 'claude-code/testing'

test('the queue keeps the bands drawn beneath it', async ($, on) => {
  // Each hook here stands for what sits beneath the plugin: the engine, and another mod's band.
  mock.clock(on, { now: 1000 })
  on('turn.start', () => ({ turnId: 't1' }) as never)
  on('ui.render', ($, e) => $.ui.resolve(e).Text({ children: 'beneath band' }))

  await $.turn.start({ turnId: 't1' } as never)
  await $.command.run({ command: 'q', args: 'later please', presentation: { isFullscreen: false } } as never)

  const ui = await $.ui.mount({
    plugin: 'prompt-queue',
    surface: 'terminal',
    component: 'AbovePrompt',
    props: { hasSurvey: false, isWorking: true, maxRows: 10, bodyColumns: 100 } as never,
  })
  expect(await ui.find({ type: 'Text', text: /later please/ })).toBeDefined()
  expect((await ui.find({ type: 'Text', text: /beneath band/ }))?.text).toBe('beneath band')
  await ui.unmount()
})
