import { expect, test } from 'claude-code/testing'

const BAND = {
  component: 'AbovePrompt',
  props: { hasSurvey: false, isWorking: false, maxRows: 10, bodyColumns: 100 } as never,
} as const

test('the replay hint keeps the bands drawn beneath it', async ($, on) => {
  // Each hook here stands for what sits beneath the plugin: the engine, and another mod's band.
  on('session.cwd', () => ({ value: '/repo' }) as never)
  on('tool.call', () => ({ result: {} }) as never)
  on('turn.start', () => ({ turnId: 't1' }) as never)
  on('turn.complete', () => ({ text: '' }) as never)
  on('ui.render', ($, e) => {
    const { Text } = $.ui.resolve(e)
    return Text({ children: 'beneath band' })
  })

  await $.turn.start({ turnId: 't1' } as never)
  await $.tool.call({ tool: 'Edit', file_path: '/repo/a.txt', old_string: 'a', new_string: 'b' } as never)
  await $.turn.complete({ answer: 'ok', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer' } as never)

  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ plugin: 'replay-theater', surface, ...BAND })
    expect(await ui.find({ key: 'open-replay' })).toBeDefined()
    expect((await ui.find({ type: 'Text', text: /beneath band/ }))?.text).toBe('beneath band')
    await ui.unmount()
  }
})
