// Speaks two alerts out loud with the Mac's own voices, so a session can be followed away from the
// screen. When a turn's work ends: a soft chime, then the project, the thread and what was done.
// When Claude asks something (a question dialog, a permission prompt, the desktop's next-step box,
// a task assigned to you): a bright chime twice, then a second voice says the question and the
// recommended option.
import type { EngineInterface, PromptOrigin, Register } from 'claude-code'
import { dialogLines, firstAction, firstSentence, forSpeech, orList, parseDone, permissionLine, spokenName } from './speech'

type Kind = { sound: string; voice: string }
const DONE: Kind = { sound: 'sounds/done.wav', voice: 'Samantha' }
const QUESTION: Kind = { sound: 'sounds/question.wav', voice: 'Daniel' }

// A permission prompt or a dialog may also raise a notification: one heard this soon after a
// question alert is the same ask.
const SAME_ASK_MS = 30_000

const mem = {
  title: '', // the thread's title as the engine names it
  topic: '', // Haiku's name for the thread while the engine gives none
  asked: '', // the person's latest request
  recap: '', // the next-step box's recap this turn
  ask: null as null | { ask: string; pick: string | null },
  askedAt: -Infinity,
  queue: Promise.resolve(),
}

async function say($: EngineInterface, text: string, voice: string) {
  // A voice this Mac does not have: the default voice instead.
  await $.audio.speak(text, { voice }).catch(() => $.audio.speak(text).catch(() => {}))
}

// One alert after another, so a chime never plays over the words of the alert before it.
function enqueue($: EngineInterface, kind: Kind, lines: readonly string[]) {
  mem.queue = mem.queue
    .then(async () => {
      await $.audio.play({ asset: kind.sound }).catch(() => {})
      for (const line of lines) if (line.trim() !== '') await say($, line, kind.voice)
    })
    .catch(() => {})
}

async function ask($: EngineInterface, lines: (at: string) => readonly string[]) {
  mem.askedAt = await $.clock.now()
  enqueue($, QUESTION, lines(await where($)))
}

// The project (the main repository's folder, also in a worktree) and the thread.
async function where($: EngineInterface) {
  const repo = await $.session.repo().catch(() => null)
  const path = repo?.root ?? (await $.session.cwd().catch(() => ''))
  const project = spokenName(path.split('/').filter(Boolean).pop() ?? '') || 'this project'
  const thread = mem.title || mem.topic
  return thread ? `${project}, thread ${thread}` : project
}

async function whatWasDone($: EngineInterface, answer: string) {
  const r = await $.model
    .complete({
      model: 'haiku',
      maxTokens: 150,
      timeoutMs: 15000,
      system:
        'You tell a developer, out loud, what a coding assistant just finished. Plain spoken English: no markdown, ' +
        'no file paths, no code, no em dashes. Reply with JSON only: {"topic","done"}. "done": one sentence of at ' +
        'most 20 words, past tense, saying what was accomplished, found or answered, without naming the assistant. ' +
        '"topic": the subject of the conversation in 2 to 5 words.',
      prompt: [
        `<request>${mem.asked.slice(0, 1500)}</request>`,
        mem.recap ? `<recap>${mem.recap.slice(0, 600)}</recap>` : '',
        `<reply>${answer.slice(0, 4000)}</reply>`,
        'Write the JSON now.',
      ]
        .filter(Boolean)
        .join('\n\n'),
    })
    .catch(() => null)
  const parsed = r?.isAnswered ? parseDone(r.text) : null
  if (parsed?.topic && !mem.topic) mem.topic = parsed.topic
  return parsed?.done ?? (mem.recap ? forSpeech(mem.recap, 240) : firstSentence(answer))
}

const ENDED: Record<string, string> = { error: 'stopped with an error', refusal: 'stopped without an answer' }

export const register: Register = on => {
  on('classic.SessionStart', async ($, e, next) => {
    if (e.source === 'clear') mem.topic = ''
    if (e.session_title) mem.title = forSpeech(e.session_title, 80)
    return next(e)
  })

  on('classic.UserPromptSubmit', async ($, e, next) => {
    if (e.session_title) mem.title = forSpeech(e.session_title, 80)
    return next(e)
  })

  on('prompt.submit', async ($, e, next) => {
    if (e.command === undefined && e.isMeta !== true && isPerson(e.origin)) mem.asked = e.text
    return next(e)
  })

  on('turn.start', async ($, e, next) => {
    if (e.agentId === undefined) {
      mem.recap = ''
      mem.ask = null
    }
    return next(e)
  })

  on('tool.call', { tool: 'AskUserQuestion' }, async ($, e, next) => {
    const questions = e.questions
    void ask($, at => dialogLines(at, questions)).catch(() => {})
    return next(e)
  })

  // The next-step box: its recap feeds the summary, its question is spoken once the turn ends.
  on('tool.call', { tool: 'mcp__ccd_turn__wrap_up' }, async ($, e, next) => {
    if (e.agentId === undefined) {
      if (typeof e.recap === 'string') mem.recap = e.recap
      if (typeof e.ask === 'string' && e.ask.trim() !== '') mem.ask = { ask: forSpeech(e.ask, 200), pick: firstAction(e.actions) }
    }
    return next(e)
  })

  on('tool.call', { tool: 'mcp__human-in-the-loop__assign_task' }, async ($, e, next) => {
    const title = typeof e.title === 'string' ? forSpeech(e.title, 160) : ''
    const options = Array.isArray(e.options) ? e.options.filter((o): o is string => typeof o === 'string').map(o => forSpeech(o, 60)) : []
    if (title) void ask($, at => [`${at} assigned you a task.`, `${title}.${options.length > 0 ? ` Options: ${orList(options)}.` : ''}`]).catch(() => {})
    return next(e)
  })

  on('classic.PermissionRequest', async ($, e, next) => {
    // The question dialog speaks for itself.
    if (e.tool_name !== 'AskUserQuestion') void ask($, at => [`${at} needs your permission.`, permissionLine(e.tool_name, e.tool_input)]).catch(() => {})
    return next(e)
  })

  // Where no permission request was heard (or for an MCP server's own question), the notification says it.
  on('classic.Notification', async ($, e, next) => {
    const result = await next(e)
    const isRecent = (await $.clock.now()) - mem.askedAt < SAME_ASK_MS
    if (!isRecent && e.notification_type === 'permission_prompt') {
      void ask($, at => [`${at} needs your permission.`, forSpeech(e.message, 200)]).catch(() => {})
    } else if (!isRecent && e.notification_type === 'elicitation_dialog') {
      void ask($, at => [`Question from ${at}.`, forSpeech(e.message, 300)]).catch(() => {})
    }
    return result
  })

  on('turn.complete', async ($, e, next) => {
    const result = await next(e)
    if (e.agentId !== undefined || e.isAborted) return result
    const pending = mem.ask
    const { answer, reason } = e
    // In the background, so the prompt comes back at once.
    void (async () => {
      const done = reason === 'answer' ? await whatWasDone($, answer) : ''
      const at = await where($)
      enqueue($, DONE, [reason === 'answer' ? `Done in ${at}. ${done}` : `${at} ${ENDED[reason] ?? 'stopped'}.`])
      if (pending) {
        mem.askedAt = await $.clock.now()
        enqueue($, QUESTION, [`${at} asks: ${pending.ask}`, pending.pick ? `Recommended: ${pending.pick}.` : ''])
      }
    })().catch(() => {})
    return result
  })
}

function isPerson(origin: PromptOrigin): boolean {
  return origin.kind === 'composer' || origin.kind === 'bridge' || origin.kind === 'sdk'
}
