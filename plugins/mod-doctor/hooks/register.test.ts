import { expect, test } from 'claude-code/testing'

import { dropsBands } from './register'

test('a band hook that returns its own row and calls next only to pass is flagged', async () => {
  // The shape replay-theater had: its hint replaced every band beneath it.
  const source = `
  on("ui.render", { component: "AbovePrompt" }, ($, e, next) => {
    if (!state.replay.length) return next(e);
    const { Box } = $.ui.resolve(e);
    return Box({ children: [] });
  });`
  expect(dropsBands(source)).toBe(true)
})

test('a band hook that keeps what next drew is not flagged', async () => {
  const source = `
  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey) return next(e)
    const rest = await next(e)
    return rest ? Box({ children: [hint, rest] }) : hint
  })`
  expect(dropsBands(source)).toBe(false)
})

test('a band hook that only passes the band on is not flagged', async () => {
  const source = `
  on('ui.render', { component: 'AbovePrompt' }, ($, e, next) => {
    seen = e.props.isWorking
    return next(e)
  })`
  expect(dropsBands(source)).toBe(false)
})

test('hooks on other components are not read', async () => {
  const source = `
  on('ui.render', { component: 'Pane', requestId: 'x' }, async ($, e) => {
    return Box({ children: [] })
  })`
  expect(dropsBands(source)).toBe(false)
})
