import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { Assumption } from '../types'

const PANE = 'assumption-check'
const items = atom({ plugin: 'assumption-check', key: 'items' } as const, [] as Assumption[])

// A reply shorter than this rarely carries a guess, so it skips the model call.
const MIN_REPLY = 300
const MAX_GUESSES = 5

export const register: Register = on => {
  let asked = ''

  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'assumptions',
      description: 'Show the guesses Claude made in the last reply',
    })

    return next(e)
  })

  on('command.run', { command: 'assumptions' }, async $ => {
    await $.ui.open({ id: PANE, title: 'Assumptions' })

    return { text: 'Assumptions pane opened.' }
  })

  on('prompt.submit', ($, e, next) => {
    asked = e.text

    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    if (e.agentId !== undefined || e.isAborted) {
      return next(e)
    }

    // Each finished reply replaces the list, so guesses never carry over from an earlier reply.
    const reply =
      e.answer.length < MIN_REPLY
        ? undefined
        : await $.model
            .complete({ model: 'haiku', prompt: guessPrompt(asked, e.answer), maxTokens: 300, timeoutMs: 20000 })
            .catch(() => undefined)
    const found = reply?.isAnswered ? parseGuesses(reply.text) : []

    await update($, items, () => found.map(text => ({ text, verdict: 'open' as const })))
    if (found.length > 0) {
      void $.ui.open({ id: PANE, title: 'Assumptions' })
    }

    return next(e)
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Button, Text } = $.ui.resolve(e)
    const list = await read($, items)

    if (list.length === 0) {
      return (
        <Box>
          <Text dimColor>No guesses in the last reply.</Text>
        </Box>
      )
    }

    const wrong = list.filter(a => a.verdict === 'wrong')

    return (
      <Box flexDirection="column">
        {list.map((a, i) => (
          <Box key={`g${i}`}>
            <Text dimColor={a.verdict !== 'open'}>
              {a.verdict === 'wrong' ? 'wrong: ' : a.verdict === 'right' ? 'right: ' : ''}
              {a.text}
            </Text>
            <Button
              key="right"
              label="Right"
              onPress={() => update($, items, current => mark(current, i, 'right'))}
            />
            <Button
              key="wrong"
              label="Wrong"
              onPress={() => update($, items, current => mark(current, i, 'wrong'))}
            />
          </Box>
        ))}
        {wrong.length > 0 && (
          <Button
            key="send"
            label={`Send ${wrong.length} wrong to Claude`}
            onPress={() => {
              void $.prompt.submit({
                text: `These guesses in your last reply were wrong. Redo the affected part without them:\n${wrong.map(a => `- ${a.text}`).join('\n')}`,
              })
              void update($, items, () => [])
            }}
          />
        )}
      </Box>
    )
  })
}

function mark(list: Assumption[], i: number, verdict: Assumption['verdict']): Assumption[] {
  return list.map((a, n) => (n === i ? { ...a, verdict } : a))
}

// The request and the reply are data here: the model only lists guesses.
function guessPrompt(asked: string, reply: string): string {
  return [
    'A person asked Claude something, and Claude replied. List up to five guesses the reply made that the person did not state: a reading of what they meant, a default value, or a file or name picked without asking.',
    'Answer with only a JSON array of short strings, each under 15 words. Answer [] when there are none.',
    '',
    `Request: ${asked.slice(0, 2000)}`,
    `Reply: ${reply.slice(0, 8000)}`,
  ].join('\n')
}

function parseGuesses(text: string): string[] {
  const json = text.match(/\[[\s\S]*\]/)?.[0] ?? '[]'

  try {
    const list: unknown = JSON.parse(json)
    if (!Array.isArray(list)) {
      return []
    }

    return list
      .filter((g): g is string => typeof g === 'string' && g.trim() !== '')
      .slice(0, MAX_GUESSES)
  } catch {
    return []
  }
}
