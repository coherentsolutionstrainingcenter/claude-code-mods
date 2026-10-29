import type { EngineInterface, Register } from 'claude-code'

// A turn plays back in at most two seconds, and at least a short while so a quick one stays visible.
const MAX_TURN_MS = 2000
const MIN_TURN_MS = 400

// One line of the session log. No text is kept: a prompt keeps only its length.
type TimeEvent =
  | { at: number; kind: 'prompt'; length: number }
  | { at: number; kind: 'tool'; tool: string }
  | { at: number; kind: 'turn'; tools: string[]; durationMs: number }

// A turn runs to its turn event. A trailing run with none is still open.
type Turn = { events: TimeEvent[]; durationMs?: number }

// Each append reads and rewrites the whole file, so appends run one after another.
let queue: Promise<void> = Promise.resolve()
// Tool names used since the main loop last finished a turn.
let tools: string[] = []

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'time-lapse',
      description: 'Time-lapse: an animated HTML replay of this session',
    })

    return next(e)
  })

  on('prompt.submit', async ($, e, next) => {
    void record($, { at: await $.clock.now(), kind: 'prompt', length: e.text.length })

    return next(e)
  })

  on('tool.call', async ($, e, next) => {
    tools.push(e.tool)
    void record($, { at: await $.clock.now(), kind: 'tool', tool: e.tool })

    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    // A subagent's turn ends inside the main turn that spawned it, so only the main loop closes one.
    if (e.agentId === undefined) {
      const used = tools
      tools = []
      void record($, { at: await $.clock.now(), kind: 'turn', tools: used, durationMs: e.durationMs })
    }

    return next(e)
  })

  on('command.run', { command: 'time-lapse' }, async $ => {
    const id = await $.session.id()
    const events = await readLog($, id)
    if (events.length === 0) {
      return { text: 'Nothing recorded for this session yet. Send a prompt, then run /time-lapse again.' }
    }

    const page = await sessionFile($, id, 'html')
    await $.fs.write(page, renderPage(id, events))
    const opened = await $.process.run(['open', page]).then(run => run.exitCode === 0, () => false)

    return { text: opened ? `Time-lapse opened: ${page}` : `Time-lapse written to ${page}. Open it in a browser.` }
  })
}

/** Adds one event to this session's log. A failed write drops that event and nothing else. */
function record($: EngineInterface, event: TimeEvent): Promise<void> {
  queue = queue
    .then(async () => {
      const id = await $.session.id()
      const events = await readLog($, id)
      events.push(event)
      await $.fs.write(await sessionFile($, id, 'json'), JSON.stringify(events))
    })
    .catch(() => {})

  return queue
}

async function readLog($: EngineInterface, id: string): Promise<TimeEvent[]> {
  const path = await sessionFile($, id, 'json')
  if (!(await $.fs.exists(path))) {
    return []
  }

  // A log that will not parse is left alone: the next append fails rather than overwrite it.
  const list: unknown = JSON.parse(await $.fs.read(path))
  if (!Array.isArray(list)) {
    throw new Error(`${path} is not a time-lapse log`)
  }

  return list as TimeEvent[]
}

/** ~/.claude/time-lapse/<session id>.<ext>, where both the log and the page live. */
async function sessionFile($: EngineInterface, id: string, ext: 'json' | 'html'): Promise<string> {
  const home = await $.env.get('HOME')
  if (home === undefined) {
    throw new Error('HOME is not set')
  }

  return `${home}/.claude/time-lapse/${id}.${ext}`
}

/** Splits the log into turns, each ending at its turn event. */
function groupTurns(events: TimeEvent[]): Turn[] {
  const turns: Turn[] = []
  let current: TimeEvent[] = []
  for (const event of events) {
    current.push(event)
    if (event.kind === 'turn') {
      turns.push({ events: current, durationMs: event.durationMs })
      current = []
    }
  }
  if (current.length > 0) {
    turns.push({ events: current })
  }

  return turns
}

/** How long a turn plays: its real length, kept between the floor and the cap. */
function slotOf(turn: Turn): number {
  if (turn.durationMs === undefined) {
    return MAX_TURN_MS
  }

  return Math.min(MAX_TURN_MS, Math.max(MIN_TURN_MS, turn.durationMs))
}

function renderPage(id: string, events: TimeEvent[]): string {
  const turns = groupTurns(events)
  let clock = 0
  const sections = turns.map((turn, n) => {
    const start = clock
    const step = slotOf(turn) / turn.events.length
    clock += slotOf(turn)

    const chips = turn.events.map((event, i) => chip(event, start + i * step)).join('')
    const calls = turn.events.filter(event => event.kind === 'tool').length
    const title = turn.durationMs === undefined ? 'Unfinished turn' : `Turn ${n + 1}`

    return `<section class="turn" style="animation-delay:${Math.round(start)}ms"><h2>${title} · ${calls} tool ${calls === 1 ? 'call' : 'calls'}</h2><ol>${chips}</ol></section>`
  })

  const count = (kind: TimeEvent['kind']) => events.filter(event => event.kind === kind).length
  const closed = turns.filter(turn => turn.durationMs !== undefined).length

  return [
    '<!doctype html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<title>Time-lapse ${esc(id)}</title>`,
    `<style>${STYLE}</style>`,
    '</head>',
    '<body>',
    '<main>',
    '<header>',
    '<div>',
    '<h1>Session time-lapse</h1>',
    `<p class="meta">Prompts ${count('prompt')} · Tool calls ${count('tool')} · Turns ${closed} · Replay runs ${formatMs(clock)}</p>`,
    '</div>',
    '<button id="toggle" type="button">Pause</button>',
    '</header>',
    sections.join('\n'),
    '<p class="meta">Only prompt lengths, tool names and turn times are recorded. No prompt or reply text is stored.</p>',
    '</main>',
    `<script>${SCRIPT}</script>`,
    '</body>',
    '</html>',
  ].join('\n')
}

function chip(event: TimeEvent, at: number): string {
  const style = `animation-delay:${Math.round(at)}ms`
  if (event.kind === 'prompt') {
    return `<li class="chip prompt" style="${style}">Prompt, ${event.length} characters</li>`
  }
  if (event.kind === 'tool') {
    return `<li class="chip tool" style="${style}">${esc(event.tool)}</li>`
  }

  return `<li class="chip done" style="${style}">Done, ${formatMs(event.durationMs)}</li>`
}

function formatMs(ms: number): string {
  const seconds = ms / 1000
  if (seconds < 60) {
    return `${seconds.toFixed(1)} s`
  }

  return `${Math.floor(seconds / 60)} min ${Math.floor(seconds % 60)} s`
}

function esc(text: string): string {
  return text.replace(/[&<>"']/g, char => `&#${char.charCodeAt(0)};`)
}

const STYLE = `
:root { color-scheme: light dark; --bg: #faf9f6; --fg: #1f1e1c; --muted: #6e6a63; --line: #e3dfd7; --card: #ffffff; --prompt: #2f6f6a; --tool: #6b5b95; --done: #9a6b1f; }
@media (prefers-color-scheme: dark) {
  :root { --bg: #161513; --fg: #f2efe9; --muted: #9c978d; --line: #3a3834; --card: #1f1e1b; --prompt: #6fb8b0; --tool: #a895d6; --done: #e0b25c; }
}
body { margin: 0; background: var(--bg); color: var(--fg); font: 15px/1.5 -apple-system, system-ui, sans-serif; }
main { max-width: 720px; margin: 0 auto; padding: 24px 16px 48px; }
header { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; }
h1 { margin: 0; font-size: 20px; }
.meta { margin: 4px 0 0; color: var(--muted); font-size: 13px; }
button { font: inherit; padding: 6px 14px; border: 1px solid var(--line); border-radius: 6px; background: var(--card); color: var(--fg); cursor: pointer; }
.turn { opacity: 0; animation: rise 0.35s ease forwards; background: var(--card); border: 1px solid var(--line); border-radius: 10px; padding: 12px 14px; margin: 12px 0; }
.turn h2 { margin: 0 0 8px; font-size: 13px; font-weight: 600; color: var(--muted); }
.turn ol { display: flex; flex-wrap: wrap; gap: 6px; margin: 0; padding: 0; list-style: none; }
.chip { opacity: 0; animation: pop 0.25s ease forwards; padding: 2px 10px; border: 1px solid currentColor; border-radius: 999px; font-size: 13px; }
.chip.prompt { color: var(--prompt); }
.chip.tool { color: var(--tool); }
.chip.done { color: var(--done); }
body.paused * { animation-play-state: paused; }
@keyframes rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
@keyframes pop { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: none; } }
`

const SCRIPT = `
const button = document.getElementById('toggle');
button.addEventListener('click', () => {
  const paused = document.body.classList.toggle('paused');
  button.textContent = paused ? 'Play' : 'Pause';
});
`
