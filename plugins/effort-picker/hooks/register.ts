import type { EngineInterface, ModelEffort, Register } from 'claude-code'

// effort-picker: picks the reasoning effort for one message from its words, and sends that
// message's model requests with it. It never changes the model: a switch mid-chat makes
// Claude reread the whole chat.

type Mode = 'on' | 'off' | 'tip'
type Pick = { level: ModelEffort; why: string }
type Rule = Pick & { test: (said: string) => boolean }

// A pick that waits for its turn to start, found again by the text the turn begins with.
type Waiting = { text: string; pick: Pick; mode: Mode }
// The pick of the turn that answers the message.
type Bound = { turnId: string; pick: Pick; mode: Mode }

const MODES: readonly Mode[] = ['on', 'off', 'tip']
const RANK: Record<ModelEffort, number> = { low: 0, medium: 1, high: 2, xhigh: 3, max: 4 }

// Where a prompt the person wrote comes from: the prompt box, the Remote Control bridge, an SDK host.
const PERSON: ReadonlySet<string> = new Set(['composer', 'bridge', 'sdk'])

// Rule 1: a long job handed off, or an ask to go all out.
const ALL_OUT = /\bgo(ing)? all[- ]out\b/i
const SECURITY_AUDIT = /\bsecurity (audit|review)\b|\baudit\b.{0,40}\bsecurity\b/i
const HANDED_OFF = /\bovernight\b|\bend[- ]to[- ]end\b|\bthe (whole|entire) \w+/i

// Rule 2: a hidden mistake could cost you.
const MONEY = /\$\s?\d|\b(money|prices?|pricing|invoices?|payments?|billing|refunds?|payroll|tax(es)?|bank)\b/i
const CLIENT = /\b(clients?|customers?)\b(?![- ]side)/i
const PUBLISHING = /\b(publish\w*|deploy\w*|release|go(ing)? live|launch)\b/i
const HARD_TO_UNDO =
  /\b(migrat(e|es|ed|ing|ion|ions)|production|prod|force[- ]push\w*|drop (table|database)|rm -rf|irreversibl[ey]|permanent(ly)?)\b|\b(can'?t|cannot) be undone\b|\bhard to undo\b/i
const BROKEN = /\b(broken|breaks|crash\w*|bugs?|fail(s|ed|ing|ures?)?|errors?|regression|not working|(doesn'?t|does not|won'?t) work)\b/i

// Rule 3: a quick back-and-forth.
const WH_QUESTION = /^(what|why|how|where|when|which|who)\b/i
const TWEAK = /\b(rename|typo|tweak|reword|small (change|fix)|quick (change|fix)|minor|one[- ]liner)\b/i

// Checked in order; the first match wins. No match is rule 4: the person's own level stays.
const RULES: readonly Rule[] = [
  { level: 'max', why: 'you asked to go all out', test: said => ALL_OUT.test(said) },
  { level: 'max', why: 'a security audit', test: said => SECURITY_AUDIT.test(said) },
  { level: 'xhigh', why: 'a long job handed off', test: said => HANDED_OFF.test(said) },
  { level: 'high', why: 'money is involved', test: said => MONEY.test(said) },
  { level: 'high', why: 'a client will see it', test: said => CLIENT.test(said) },
  { level: 'high', why: 'it gets published', test: said => PUBLISHING.test(said) },
  { level: 'high', why: 'it is hard to undo', test: said => HARD_TO_UNDO.test(said) },
  { level: 'high', why: 'something is broken', test: said => BROKEN.test(said) },
  { level: 'low', why: 'a short question', test: said => said.length <= 140 && (said.endsWith('?') || WH_QUESTION.test(said)) },
  { level: 'low', why: 'a small tweak', test: said => said.length <= 200 && TWEAK.test(said) },
]

/** The level a message asks for, and why; null leaves the person's own level. */
export function pickFor(text: string): Pick | null {
  const said = text.trim()
  const rule = said === '' ? undefined : RULES.find(one => one.test(said))

  return rule === undefined ? null : { level: rule.level, why: rule.why }
}

/** The level to send instead of `from`, or undefined to keep `from`. */
export function levelFor(from: ModelEffort, pick: ModelEffort): ModelEffort | undefined {
  if (pick === from) return undefined
  // A level the person set to xhigh or max is never lowered.
  if (RANK[from] >= RANK.xhigh && RANK[pick] < RANK[from]) return undefined

  return pick
}

/** The one line the transcript shows for a pick. */
export function lineFor(mode: Mode, from: ModelEffort, to: ModelEffort, why: string): string {
  if (mode === 'tip') return `Effort picker tip: ${to} would suit this message (${why}). It stays at ${from}.`
  const way = RANK[to] > RANK[from] ? 'up' : 'down'

  return `Effort picker: ${to} for this message, ${way} from ${from}: ${why}.`
}

function isMode(value: unknown): value is Mode {
  return MODES.includes(value as Mode)
}

async function modeOf($: EngineInterface): Promise<Mode> {
  const saved = await $.store.get('mode')

  return isMode(saved) ? saved : 'on'
}

const SAID: Record<Mode, string> = {
  on: 'Effort picker is on: it sets the effort for each message you send, for that message only.',
  off: 'Effort picker is off: every message keeps your own effort level.',
  tip: 'Effort picker is in tip mode: it says which level would suit a message, and changes nothing.',
}

export const register: Register = on => {
  // Both start over when the module reloads; a pick lost that way leaves the person's level.
  let waiting: Waiting[] = []
  let bound: Bound | null = null

  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'effort-picker',
      description: 'Effort for each message: on, off or tip (suggest only)',
      argumentHint: 'on | off | tip',
    })

    return next(e)
  })

  on('command.run', { command: 'effort-picker' }, async ($, e) => {
    const asked = e.args.trim().toLowerCase()
    if (isMode(asked)) {
      await $.store.set('mode', asked)

      return { text: SAID[asked] }
    }

    return { text: `${SAID[await modeOf($)]} Use /effort-picker on, off or tip.` }
  })

  on('prompt.submit', async ($, e, next) => {
    const isLeftAlone =
      !PERSON.has(e.origin.kind) || e.command !== undefined || e.isMeta === true || /^\s*go:/i.test(e.text)
    const mode = isLeftAlone ? 'off' : await modeOf($)
    const pick = mode === 'off' ? null : pickFor(e.text)
    if (pick === null) return next(e)

    const entry: Waiting = { text: e.text, pick, mode }
    waiting = [...waiting.slice(-4), entry]
    const result = await next(e)
    // A dropped prompt starts no turn; one a hook beneath rewrote starts its turn with the new text.
    waiting =
      result.drop !== undefined
        ? waiting.filter(one => one !== entry)
        : waiting.map(one => (one === entry ? { ...one, text: result.text } : one))

    return result
  })

  on('turn.start', async ($, e, next) => {
    if (e.agentId === undefined) {
      const match = waiting.find(one => one.text === e.text)
      waiting = waiting.filter(one => one !== match)
      bound = match === undefined ? null : { turnId: e.turnId, pick: match.pick, mode: match.mode }
    }

    return next(e)
  })

  // Each model request of the turn: the main chat's alone, never a subagent's.
  on('turn.step', async function* ($, e, next) {
    const now = bound
    if (e.agentId !== undefined || now === null || now.turnId !== e.turnId || typeof e.effort !== 'string') {
      return yield* next(e)
    }

    const to = levelFor(e.effort, now.pick.level)
    if (to === undefined) return yield* next(e)
    if (e.index === 0) $.ui.log(lineFor(now.mode, e.effort, to, now.pick.why))

    // Only this request carries the new level; the saved setting is never written.
    return yield* next(now.mode === 'on' ? { ...e, effort: to } : e)
  })
}
