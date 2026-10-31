import { describe, expect, mock, test } from 'claude-code/testing'
import type { ModelCompleteResult, On } from 'claude-code'
import type { Engine, MockClock } from 'claude-code/testing'

const START = Date.parse('2026-10-31T10:00:00Z')
const USAGE = { input_tokens: 1, output_tokens: 1, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 }
const DONE = '{"topic":"spoken alerts","done":"Built the spoken alerts mod and its tests."}'

// The engine beneath the mod: a project folder, Haiku's reply, and a log of every clip and utterance.
function world(on: On, over: { haiku?: string | null; missingVoice?: string } = {}) {
  const w = { heard: [] as string[], prompts: [] as string[] }
  on('session.repo', () => ({ value: null }))
  on('session.cwd', () => ({ value: '/Users/me/waraxe-claude-mods' }))
  on('model.complete', (_$, e) => {
    w.prompts.push(e.prompt)
    const value: ModelCompleteResult =
      over.haiku === null
        ? { isAnswered: false, reason: 'api-error', status: 529, error: 'overloaded', usage: USAGE }
        : { isAnswered: true, text: over.haiku ?? DONE, usage: USAGE }
    return { value }
  })
  on('audio.play', (_$, e) => {
    w.heard.push(`play ${'asset' in e.clip ? e.clip.asset : '?'}`)
    return { value: undefined }
  })
  on('audio.speak', (_$, e) => {
    if (e.voice !== undefined && e.voice === over.missingVoice) return { deny: `voice ${e.voice} is not installed` }
    w.heard.push(`${e.voice ?? 'default'}: ${e.text}`)
    return { value: { via: 'system' as const } }
  })
  on('tool.call', () => ({ result: {}, text: 'ok' }) as never)
  for (const event of ['classic.SessionStart', 'classic.UserPromptSubmit', 'classic.PermissionRequest', 'classic.Notification'] as const) on(event, () => ({}))
  on('turn.start', (_$, e) => ({ turnId: e.turnId }))
  on('turn.complete', (_$, e) => ({ text: e.answer }))
  return w
}

async function turn($: Engine, id: string, answer = 'I built the mod. All tests pass.', more: { agentId?: string; isAborted?: boolean; reason?: 'answer' | 'error' } = {}) {
  await $.turn.start({ turnId: id, text: 'go', ...(more.agentId ? { agentId: more.agentId } : {}) })
  await $.turn.complete({
    turnId: id,
    answer,
    durationMs: 2000,
    isAborted: more.isAborted ?? false,
    reason: more.isAborted ? 'aborted' : (more.reason ?? 'answer'),
    ...(more.agentId ? { agentId: more.agentId } : {}),
  } as never)
}

const titled = ($: Engine) => $.classic.UserPromptSubmit({ prompt: 'go', session_title: 'Spoken alerts mod' } as never)

const dialog = (options: Array<{ label: string; description: string }>) => ({
  tool: 'AskUserQuestion' as const,
  questions: [{ question: 'Which voices should the alerts use?', header: 'Voice', multiSelect: false, options }],
})

async function settled(clock: MockClock) {
  await clock.settle()
  await clock.settle()
}

describe('work ending', () => {
  test('a soft chime, then the project, the thread and what was done', async ($, on) => {
    const clock = mock.clock(on, { now: START })
    const w = world(on)
    await titled($)
    await turn($, 't1')
    await settled(clock)

    expect(w.heard).toEqual(['play sounds/done.wav', 'Samantha: Done in waraxe claude mods, thread Spoken alerts mod. Built the spoken alerts mod and its tests.'])
    // Haiku read the reply it summarizes.
    expect(w.prompts[0]).toContain('I built the mod. All tests pass.')
  })

  test('with no title from the engine, Haiku’s topic names the thread', async ($, on) => {
    const clock = mock.clock(on, { now: START })
    const w = world(on)
    await turn($, 't1')
    await settled(clock)
    expect(w.heard[1]).toBe('Samantha: Done in waraxe claude mods, thread spoken alerts. Built the spoken alerts mod and its tests.')
  })

  test('with Haiku down, the reply’s first sentence says what was done', async ($, on) => {
    const clock = mock.clock(on, { now: START })
    const w = world(on, { haiku: null })
    await titled($)
    await turn($, 't1', '**Fixed** the `band` rows. Then I ran the tests.')
    await settled(clock)
    expect(w.heard[1]).toBe('Samantha: Done in waraxe claude mods, thread Spoken alerts mod. Fixed the band rows.')
  })

  test('a turn that ends in an error says so', async ($, on) => {
    const clock = mock.clock(on, { now: START })
    const w = world(on)
    await titled($)
    await turn($, 't1', '', { reason: 'error' })
    await settled(clock)
    expect(w.heard).toEqual(['play sounds/done.wav', 'Samantha: waraxe claude mods, thread Spoken alerts mod stopped with an error.'])
  })

  test('a subagent’s turn and an interrupted turn stay silent', async ($, on) => {
    const clock = mock.clock(on, { now: START })
    const w = world(on)
    await turn($, 'a', 'Report.', { agentId: 'agent-1' })
    await turn($, 't2', '', { isAborted: true })
    await settled(clock)
    expect(w.heard).toEqual([])
  })
})

describe('question alerts', () => {
  test('a question dialog: the bright chime, another voice, the question, then the recommended option', async ($, on) => {
    const clock = mock.clock(on, { now: START })
    const w = world(on)
    await titled($)
    await $.tool.call(dialog([{ label: 'Mac voices (Recommended)', description: 'Free' }, { label: 'OpenAI voices', description: 'Paid' }]))
    await settled(clock)

    expect(w.heard).toEqual([
      'play sounds/question.wav',
      'Daniel: Question from waraxe claude mods, thread Spoken alerts mod.',
      'Daniel: Which voices should the alerts use? Recommended: Mac voices.',
    ])
  })

  test('a dialog with no recommended option lists the options', async ($, on) => {
    const clock = mock.clock(on, { now: START })
    const w = world(on)
    await $.tool.call(dialog([{ label: 'Mac', description: '' }, { label: 'OpenAI', description: '' }, { label: 'None', description: '' }]))
    await settled(clock)
    expect(w.heard[2]).toBe('Daniel: Which voices should the alerts use? Options: Mac, OpenAI, or None.')
  })

  test('the next-step box: after the work alert, its question and its first button', async ($, on) => {
    const clock = mock.clock(on, { now: START })
    const w = world(on)
    await titled($)
    await $.turn.start({ turnId: 't1', text: 'go' })
    await $.tool.call({ tool: 'mcp__ccd_turn__wrap_up', recap: 'Pushed nothing yet.', ask: 'Push main to origin?', actions: [{ label: 'Push main' }, { label: 'Not now' }] } as never)
    await $.turn.complete({ turnId: 't1', answer: 'Committed.', durationMs: 2000, isAborted: false, reason: 'answer' })
    await settled(clock)

    expect(w.heard).toEqual([
      'play sounds/done.wav',
      'Samantha: Done in waraxe claude mods, thread Spoken alerts mod. Built the spoken alerts mod and its tests.',
      'play sounds/question.wav',
      'Daniel: waraxe claude mods, thread Spoken alerts mod asks: Push main to origin?',
      'Daniel: Recommended: Push main.',
    ])
    // The recap went to Haiku with the reply.
    expect(w.prompts[0]).toContain('Pushed nothing yet.')
  })

  test('a next-step button that runs an app action is named as the app labels it', async ($, on) => {
    const clock = mock.clock(on, { now: START })
    const w = world(on)
    await $.turn.start({ turnId: 't1', text: 'go' })
    await $.tool.call({ tool: 'mcp__ccd_turn__wrap_up', recap: 'Ready.', ask: 'Commit these changes?', actions: [{ action: 'commit' }] } as never)
    await $.turn.complete({ turnId: 't1', answer: 'Ready.', durationMs: 2000, isAborted: false, reason: 'answer' })
    await settled(clock)
    expect(w.heard.at(-1)).toBe('Daniel: Recommended: Commit.')
  })

  test('a next-step box with no question adds no question alert', async ($, on) => {
    const clock = mock.clock(on, { now: START })
    const w = world(on)
    await $.turn.start({ turnId: 't1', text: 'go' })
    await $.tool.call({ tool: 'mcp__ccd_turn__wrap_up', recap: 'Done.' } as never)
    await $.turn.complete({ turnId: 't1', answer: 'Done.', durationMs: 2000, isAborted: false, reason: 'answer' })
    await settled(clock)
    expect(w.heard.filter(h => h.includes('question'))).toEqual([])
  })

  test('a permission prompt says what Claude asks to do, and its notification is not spoken again', async ($, on) => {
    const clock = mock.clock(on, { now: START })
    const w = world(on)
    await titled($)
    await $.classic.PermissionRequest({ tool_name: 'Bash', tool_input: { command: 'npm test', description: 'Run the tests' } } as never)
    await $.classic.Notification({ message: 'Claude needs your permission to use Bash', notification_type: 'permission_prompt' } as never)
    await settled(clock)

    expect(w.heard).toEqual([
      'play sounds/question.wav',
      'Daniel: waraxe claude mods, thread Spoken alerts mod needs your permission.',
      'Daniel: Claude asks to run a command: Run the tests.',
    ])
  })

  test('a permission notification heard alone is spoken; an idle reminder is not', async ($, on) => {
    const clock = mock.clock(on, { now: START })
    const w = world(on)
    await $.classic.Notification({ message: 'Claude is waiting for your input', notification_type: 'idle_prompt' } as never)
    await $.classic.Notification({ message: 'Claude needs your permission to use Edit', notification_type: 'permission_prompt' } as never)
    await settled(clock)
    expect(w.heard).toEqual(['play sounds/question.wav', 'Daniel: waraxe claude mods needs your permission.', 'Daniel: Claude needs your permission to use Edit'])
  })

  test('a task assigned to you is spoken with its options', async ($, on) => {
    const clock = mock.clock(on, { now: START })
    const w = world(on)
    await $.tool.call({ tool: 'mcp__human-in-the-loop__assign_task', title: 'Pick a voice', why: 'Only you can.', kind: 'choose', options: ['Samantha', 'Daniel'] } as never)
    await settled(clock)
    expect(w.heard).toEqual(['play sounds/question.wav', 'Daniel: waraxe claude mods assigned you a task.', 'Daniel: Pick a voice. Options: Samantha, or Daniel.'])
  })
})

describe('both alerts', () => {
  test('sound different: another chime and another voice', async ($, on) => {
    const clock = mock.clock(on, { now: START })
    const w = world(on)
    await turn($, 't1')
    await $.tool.call(dialog([{ label: 'Yes (Recommended)', description: '' }, { label: 'No', description: '' }]))
    await settled(clock)
    const plays = w.heard.filter(h => h.startsWith('play '))
    const voices = new Set(w.heard.filter(h => !h.startsWith('play ')).map(h => h.split(':')[0]))
    expect(plays).toEqual(['play sounds/done.wav', 'play sounds/question.wav'])
    expect([...voices].sort()).toEqual(['Daniel', 'Samantha'])
  })

  test('a voice this Mac lacks falls back to the default voice', async ($, on) => {
    const clock = mock.clock(on, { now: START })
    const w = world(on, { missingVoice: 'Daniel' })
    await $.tool.call(dialog([{ label: 'Yes (Recommended)', description: '' }, { label: 'No', description: '' }]))
    await settled(clock)
    expect(w.heard).toEqual(['play sounds/question.wav', 'default: Question from waraxe claude mods.', 'default: Which voices should the alerts use? Recommended: Yes.'])
  })
})
