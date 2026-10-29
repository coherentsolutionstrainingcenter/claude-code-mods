import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { Failing } from '../types'

const PANE = 'test-fail-magnet'
const SHOWN = 10
const LINE_MAX = 160

const failing = atom({ plugin: 'test-fail-magnet', key: 'failing' } as const, [] as Failing)

// Test runs by command, each with the pattern that finds a failing line in its output.
const RUNNERS: { run: RegExp; lines: RegExp }[] = [
  { run: /\b(npm|pnpm|yarn)\s+(run\s+)?test\b|\bnpx\s+(jest|vitest)\b/, lines: /[✕×]|^FAIL / },
  { run: /\bpytest\b/, lines: /^FAILED / },
  { run: /\bgo\s+test\b/, lines: /--- FAIL:/ },
  { run: /\bcargo\s+test\b/, lines: /^test .* \.\.\. FAILED$/ },
]

export const register: Register = on => {
  on('tool.call', { tool: 'Bash' }, async ($, e, next) => {
    const lines = RUNNERS.find(runner => runner.run.test(e.command))?.lines
    // A background run returns before its output exists, so it must not clear the list.
    if (lines === undefined || e.run_in_background === true) {
      return next(e)
    }

    const ran = await next(e)
    if (ran.deny !== undefined) {
      return ran
    }

    const found = failures(ran.text ?? '', lines)
    await update($, failing, () => found)
    if (found.length > 0) {
      void $.ui.open({ id: PANE, title: 'Failing tests' })
    }

    return ran
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Button, Text } = $.ui.resolve(e)
    const list = await read($, failing)

    if (list.length === 0) {
      return (
        <Box>
          <Text dimColor>No failing tests in the last test run.</Text>
        </Box>
      )
    }

    return (
      <Box flexDirection="column">
        {list.map((line, i) => (
          <Text key={`f${i}`} color="red">
            {line}
          </Text>
        ))}
        <Box>
          <Button
            key="fix"
            label="Fix"
            onPress={() =>
              void $.prompt.submit({
                text: `Fix the failing tests and run them again:\n${list.map(line => `- ${line}`).join('\n')}`,
              })
            }
          />
          <Button key="dismiss" label="Dismiss" onPress={() => void update($, failing, () => [])} />
        </Box>
      </Box>
    )
  })
}

/** The matching lines, trimmed and cut, without repeats: at most SHOWN of them. */
function failures(text: string, lines: RegExp): Failing {
  const hits = text
    .split('\n')
    .map(line => line.trim())
    .filter(line => lines.test(line))

  return [...new Set(hits)].slice(0, SHOWN).map(line => line.slice(0, LINE_MAX))
}
