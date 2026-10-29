// daily-challenge: one small Claude Code exercise a day, in a pane that /challenge opens.
// The pick, the streak and the done days are worked out here. The mod makes no model calls;
// "Coach me" sends an ordinary prompt, which starts a normal turn.
import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { Progress, View } from '../types'

type Challenge = { title: string; how: string }

const PANE = 'daily-challenge'
const STORE_KEY = 'progress'
const DAY_MS = 86_400_000

// Held by the host for the session: a press writes it and the pane redraws from it.
const view = atom({ plugin: 'daily-challenge', key: 'view' } as const, {
  today: '',
  progress: { shift: 0, doneDays: [] },
} as View)

// The challenges, in order. Today's is picked by the date, moved on by each Skip.
const CHALLENGES: Challenge[] = [
  { title: 'Explain a file you have never read', how: 'Pick a file in this project you have not opened yet. Ask Claude what it does, what calls it, and what would break without it.' },
  { title: 'Search three folders at once', how: 'Ask Claude to use subagents to search three folders in parallel for one name or idea, then compare what each one found.' },
  { title: 'Plan before you change', how: 'Switch to plan mode with Shift+Tab, ask for a small change, and read the plan before any file is edited.' },
  { title: 'Write the test first', how: 'Ask Claude to write a failing test for one small behaviour, run it to see it fail, and only then make it pass.' },
  { title: 'Point at an exact file', how: 'Type @ and part of a file name in your prompt, so Claude reads exactly that file. Then ask one question about it.' },
  { title: 'Review your own diff', how: 'Before you commit, ask Claude to review your uncommitted changes for bugs, missing tests and leftover debug code.' },
  { title: 'Teach Claude one project rule', how: 'Add one line to CLAUDE.md, such as how to run the tests, and check that Claude follows it in your next prompt.' },
  { title: 'Compact with a note', how: 'In a long conversation, run /compact with a short note on what to keep. Then ask Claude what it still knows.' },
  { title: 'Write a commit message that says why', how: 'Ask Claude for a commit message for your staged changes, then edit it until it explains why the change was made.' },
  { title: 'Rename something everywhere', how: 'Ask Claude to rename one function or variable everywhere it is used, then run the tests to show nothing broke.' },
  { title: 'Trace an error to its line', how: 'Paste an error message or a stack trace and ask Claude to find the line that caused it and explain why.' },
  { title: 'Show Claude a picture', how: 'Paste a screenshot of a screen or an error into the prompt, and ask Claude what it shows and what to fix.' },
  { title: 'Save a prompt as a command', how: 'Take a prompt you type often and save it as a Markdown file in .claude/commands. Then run it as a slash command.' },
  { title: 'Ask for three options', how: 'Ask Claude for three ways to solve one small problem, with one trade-off each. Choose one before any code is written.' },
  { title: 'Read the history of a file', how: "Ask Claude to read one file's git log and tell you why it changed the way it did." },
  { title: 'Undo with rewind', how: 'Let Claude make a small change you do not want, then press Esc twice (or run /rewind) to go back to before it.' },
  { title: 'Find what the code does not handle', how: 'Pick one function and ask Claude to list the inputs or edge cases it does not handle yet.' },
  { title: 'Check the README', how: "Ask Claude to compare the README's setup steps with the code and list any step that looks wrong or missing." },
  { title: 'Shorten a long function', how: 'Ask Claude to make one long function shorter without changing what it does, and run the tests afterwards.' },
  { title: 'Allow a command you trust', how: 'Run /permissions and allow one safe command you approve every time, such as your test command.' },
  { title: 'Run a shell command yourself', how: 'Start a prompt with ! to run a command such as git status yourself, then ask Claude about its output.' },
  { title: 'Ask what could break', how: 'Before a change, ask Claude what could break because of it, and how you would notice.' },
  { title: 'Get three facts from a data file', how: 'Point Claude at a CSV or JSON file and ask for three facts about what it holds, with the numbers.' },
  { title: 'Comment the why', how: 'Ask Claude to add one short comment that explains why a tricky block of code exists, not what it does.' },
  { title: 'Draw how two parts connect', how: 'Ask Claude to draw a small Mermaid diagram of how two modules in this project talk to each other.' },
  { title: 'Look inside the context window', how: "Run /context and see what fills Claude's context right now: files, tools, instructions or messages." },
  { title: 'Resume an earlier session', how: 'Run /resume, or start Claude with claude --continue, and pick up a past conversation where you left it.' },
  { title: 'Get quizzed on your code', how: 'Ask Claude to quiz you with three questions about a part of the code you worked on this week.' },
  { title: 'Split a big task', how: 'Give Claude a task that feels too big, and ask it to break the task into a checklist of small steps you can check.' },
  { title: 'Find dead code', how: 'Ask Claude to find one function, file or dependency that nothing uses any more, and to show the proof before removing it.' },
]

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'challenge',
      description: "Open today's Claude Code challenge, with a coach and a streak",
    })

    return next(e)
  })

  on('command.run', { command: 'challenge' }, async $ => {
    const current = await change($, progress => progress)
    void $.ui.open({ id: PANE, title: 'Daily challenge' })

    return { text: `Today's challenge: ${pick(current)[1].title}` }
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Button, Text } = $.ui.resolve(e)
    const current = await read($, view)
    if (current.today === '') {
      return <Text dimColor>Run /challenge to load today's challenge.</Text>
    }

    const [index, challenge] = pick(current)
    const { doneDays } = current.progress
    const isDone = doneDays.includes(current.today)
    const streak = streakOf(doneDays, current.today)

    return (
      <Box flexDirection="column">
        <Text dimColor>
          {current.today} · challenge {index + 1} of {CHALLENGES.length}
        </Text>
        <Text weight="bold">{challenge.title}</Text>
        <Text>{challenge.how}</Text>
        <Text>
          Streak: {streak} {streak === 1 ? 'day' : 'days'} · {doneDays.length} done in all ·{' '}
          {isDone ? 'today is done' : 'today is not done yet'}
        </Text>
        <Box gap={1}>
          <Button key="coach" label="Coach me" variant="primary" onPress={() => coach($, challenge)} />
          <Button key="done" label={isDone ? 'Done ✓' : 'Done'} onPress={() => change($, markDone)} />
          <Button key="skip" label="Skip" onPress={() => change($, skip)} />
        </Box>
      </Box>
    )
  })
}

/** Sends a prompt that asks Claude to walk the person through the challenge. */
function coach($: EngineInterface, challenge: Challenge): void {
  void $.prompt.submit({
    text: [
      "Coach me through today's Claude Code challenge, step by step.",
      '',
      `Challenge: ${challenge.title}`,
      challenge.how,
      '',
      'Give me one short step at a time: say exactly what to type or do, and why it helps.',
      'Use this project for the example. Wait for my reply before you give the next step.',
      'When I finish, tell me in one line what I practised.',
    ].join('\n'),
  })
}

/**
 * Reads the progress from the store, applies one change, writes it back, and hands the
 * pane the result. The store is read each time, so two open sessions do not undo each other.
 */
async function change($: EngineInterface, edit: (progress: Progress, today: string) => Progress): Promise<View> {
  const today = dayKey(await $.clock.now())
  const progress = edit(parseProgress(await $.store.get(STORE_KEY)), today)
  await $.store.set(STORE_KEY, progress)
  const current = { today, progress }
  await update($, view, () => current)

  return current
}

// Helpers below use neither $ nor JSX, so they can be checked on their own.

function markDone(progress: Progress, today: string): Progress {
  if (progress.doneDays.includes(today)) {
    return progress
  }

  return { ...progress, doneDays: [...progress.doneDays, today].sort() }
}

/** Skip moves the whole list on by one, so today shows what would have been tomorrow's. */
function skip(progress: Progress): Progress {
  return { ...progress, shift: progress.shift + 1 }
}

/** Today's place in the list and its challenge: the day number plus the skips, wrapped around. */
function pick(current: View): [number, Challenge] {
  const count = CHALLENGES.length
  const index = (((dayNumber(current.today) + current.progress.shift) % count) + count) % count

  return [index, CHALLENGES[index]!]
}

/** Days done in a row, ending today, or ending yesterday while today is still open. */
function streakOf(doneDays: readonly string[], today: string): number {
  const done = new Set(doneDays)
  let day = done.has(today) ? dayNumber(today) : dayNumber(today) - 1
  let streak = 0
  while (done.has(dayKeyOf(day))) {
    streak += 1
    day -= 1
  }

  return streak
}

/** The local calendar day of a moment, as YYYY-MM-DD. */
function dayKey(ms: number): string {
  const date = new Date(ms)
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    .map(part => String(part).padStart(2, '0'))
    .join('-')
}

/** Whole days from 1970-01-01 to a YYYY-MM-DD day. UTC, so a clock change cannot skew it. */
function dayNumber(key: string): number {
  const [year = 1970, month = 1, day = 1] = key.split('-').map(Number)
  return Math.round(Date.UTC(year, month - 1, day) / DAY_MS)
}

function dayKeyOf(day: number): string {
  return new Date(day * DAY_MS).toISOString().slice(0, 10)
}

/** The store holds JSON from disk, so keep only what has the right shape. */
function parseProgress(raw: unknown): Progress {
  const value = (raw ?? {}) as { shift?: unknown; doneDays?: unknown }
  const shift = typeof value.shift === 'number' && Number.isInteger(value.shift) ? value.shift : 0
  const doneDays = Array.isArray(value.doneDays)
    ? value.doneDays.filter((day): day is string => typeof day === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(day))
    : []

  return { shift, doneDays }
}
