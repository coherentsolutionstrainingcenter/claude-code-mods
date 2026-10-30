import { expect, mock, test } from 'claude-code/testing'
import type { Engine } from 'claude-code/testing'
import type { On } from 'claude-code'

const BAND = {
  component: 'AbovePrompt',
  props: { hasSurvey: false, isWorking: true, maxRows: 20, bodyColumns: 100 } as never,
} as const

// Holds a risky command with no room for a pane, so its card goes in the band, and answers
// `beneath` for what the hooks beneath draw. Resolves once the hold loop is waiting.
async function holdInBand($: Engine, on: On, beneath: (e: never) => unknown) {
  let sleeping = () => {}
  const isSleeping = new Promise<void>(resolve => {
    sleeping = resolve
  })
  let release = () => {}
  const hold = new Promise<void>(resolve => {
    release = resolve
  })
  mock.clock(on, { now: 1000 })
  on('session.cwd', () => ({ value: '/repo' }) as never)
  on('process.run', async (_, e) => {
    // The hold loop sleeps between looks: keep it there until the band has been read.
    if (e.argv[0] === 'sleep') {
      sleeping()
      await hold
    }
    return { value: { exitCode: 0, stdout: '', stderr: '' } } as never
  })
  on('ui.open', () => ({ value: { isPlaced: false } }) as never)
  on('tool.call', () => ({ result: {} }) as never)
  on('ui.render', ($, e) => beneath($.ui.resolve(e) as never) as never)

  const call = $.tool.call({ tool: 'Bash', command: 'git reset --hard' } as never)
  await isSleeping
  return { call, release }
}

test('the held command card keeps the bands drawn beneath it', async ($, on) => {
  // Each hook here stands for what sits beneath the plugin: the engine, and another mod's band.
  const { call, release } = await holdInBand($, on, (ui: { Text: (p: object) => unknown }) =>
    ui.Text({ children: 'beneath band' }),
  )

  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ plugin: 'blast-radius', surface, ...BAND })
    expect(await ui.find({ key: 'cancel' })).toBeDefined()
    expect((await ui.find({ type: 'Text', text: /beneath band/ }))?.text).toBe('beneath band')
    if (surface === 'desktop') {
      await ui.press({ key: 'cancel' })
    }
    await ui.unmount()
  }

  release()
  expect(String(((await call) as { deny?: string }).deny)).toContain('the user pressed Cancel')
})

test('the held command card leaves out Claude Code’s placeholder when nothing is drawn beneath it', async ($, on) => {
  // With no band beneath, next(e) answers Claude Code's own drawing of the band.
  const { call, release } = await holdInBand($, on, () => ({ type: 'engine', ref: 0 }))

  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ plugin: 'blast-radius', surface, ...BAND })
    expect(await ui.find({ key: 'cancel' })).toBeDefined()
    expect(JSON.stringify(await ui.drawn())).not.toContain('"engine"')
    if (surface === 'desktop') {
      await ui.press({ key: 'cancel' })
    }
    await ui.unmount()
  }

  release()
  await call
})
