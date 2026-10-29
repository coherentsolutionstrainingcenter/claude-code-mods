import type { AgentSpawnInput, EngineInterface, Register } from 'claude-code'

// model-router: when Claude starts a subagent without naming a model, one small Haiku call
// sorts the task's short description as simple, standard or hard, and that subagent alone
// runs on haiku, sonnet or opus. The main chat's model is never touched.

const LABELS = ['simple', 'standard', 'hard'] as const
type Label = (typeof LABELS)[number]
type Choice = 'haiku' | 'sonnet' | 'opus'

const MODEL_FOR: Record<Label, Choice> = { simple: 'haiku', standard: 'sonnet', hard: 'opus' }

/** The model for a label the classifier named; undefined for anything else. */
export function modelFor(label: string | undefined): Choice | undefined {
  const known = LABELS.find(one => one === label)

  return known === undefined ? undefined : MODEL_FOR[known]
}

/** A spawn the router may pick for: no model named, not a fork, a resume, a workflow agent or a teammate. */
export function isRoutable(e: Pick<AgentSpawnInput, 'model' | 'fork' | 'resume' | 'workflow' | 'isTeammate' | 'description'>): boolean {
  return (
    e.model === undefined &&
    !e.fork &&
    e.resume === undefined &&
    e.workflow === undefined &&
    e.isTeammate !== true &&
    e.description.trim() !== ''
  )
}

async function isOn($: EngineInterface): Promise<boolean> {
  return (await $.store.get('mode')) === 'on'
}

export const register: Register = on => {
  // What the router did since the module loaded, for /model-router status.
  const tally: Record<Choice | 'unchanged', number> = { haiku: 0, sonnet: 0, opus: 0, unchanged: 0 }

  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'model-router',
      description: 'Pick haiku, sonnet or opus for each subagent: on, off or status',
      argumentHint: 'on | off | status',
    })

    return next(e)
  })

  on('command.run', { command: 'model-router' }, async ($, e) => {
    const asked = e.args.trim().toLowerCase()
    if (asked === 'on' || asked === 'off') {
      await $.store.set('mode', asked)

      return {
        text:
          asked === 'on'
            ? 'Model router is on: each subagent started without a model gets haiku, sonnet or opus.'
            : 'Model router is off: subagents run on the model Claude or their type names.',
      }
    }
    if (asked === 'status' || asked === '') {
      const counts = `${tally.haiku} haiku, ${tally.sonnet} sonnet, ${tally.opus} opus, ${tally.unchanged} left unchanged`

      return { text: `Model router is ${(await isOn($)) ? 'on' : 'off'}. Since it loaded: ${counts}.` }
    }

    return { text: 'Use /model-router on, off or status.' }
  })

  on('agent.spawn', async ($, e, next) => {
    if (!isRoutable(e) || !(await isOn($))) return next(e)

    const text = `Task given to a coding subagent: ${e.description}`
    // A failed or empty answer leaves the call as Claude made it.
    const label = await $.model.classify(text, LABELS, { model: 'haiku' }).catch((error: unknown) => {
      $.ui.log(`model-router: the classifier failed (${String(error)})`, { to: 'debug' })

      return undefined
    })
    const model = modelFor(label)
    if (model === undefined) {
      tally.unchanged += 1

      return next(e)
    }

    tally[model] += 1
    $.ui.log(`Model router: "${e.description}" is ${label}, so this subagent runs on ${model}.`)

    // Only this spawn's model changes; the main chat keeps its own.
    return next({ ...e, model })
  })
}
