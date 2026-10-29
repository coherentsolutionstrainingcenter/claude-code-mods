import { atom, read, update } from 'claude-code'
import type { EngineInterface, PromptOrigin, Register, ToolCallInput, ToolCallResult } from 'claude-code'

const flags = atom({ plugin: 'heads-up', key: 'flags' } as const, [] as string[])
const prompts = atom({ plugin: 'heads-up', key: 'prompts' } as const, 0)

// The first three prompts of a session are never checked, so a short chat costs nothing.
const QUIET_PROMPTS = 3
// A shorter reply rarely hides a missed step, so it skips the model call.
const MIN_REPLY = 300
const MAX_FLAGS = 2
// A long turn keeps its first tool calls; past this many, the rest are not sent.
const MAX_STEPS = 60

// One tool call of the turn, as the check reads it.
type Step = { tool: string; what: string; isFailed: boolean; output: string }

export const register: Register = on => {
  let isOn = false
  let asked = ''
  let steps: Step[] = []
  // The turn whose flags may still be shown: a newer turn makes an older check's answer stale.
  let latest = ''

  on('session.start', async ($, e, next) => {
    isOn = (await $.store.get('isOn')) === true
    await $.command.register({
      name: 'heads-up',
      description: 'Turn heads-up on or off: up to two things you might miss after a long turn',
      argumentHint: 'on|off',
    })

    return next(e)
  })

  on('command.run', { command: 'heads-up' }, async ($, e) => {
    const arg = e.args.trim().toLowerCase()
    if (arg === 'on' || arg === 'off') {
      isOn = arg === 'on'
      await $.store.set('isOn', isOn)
      await update($, flags, () => [])
    }

    return {
      text: isOn
        ? 'heads-up is on. From the fourth prompt, after a reply of 300 characters or more that used tools, one Haiku call looks for up to two things you might miss.'
        : 'heads-up is off. Turn it on with /heads-up on.',
    }
  })

  on('prompt.submit', async ($, e, next) => {
    if (e.command === undefined && e.isMeta !== true && isPerson(e.origin)) {
      asked = e.text
      await update($, prompts, n => n + 1)
    }

    return next(e)
  })

  // A new main-loop turn starts a new log, and the old flags no longer apply.
  on('turn.start', async ($, e, next) => {
    if (e.agentId === undefined) {
      steps = []
      latest = ''
      await update($, flags, () => [])
    }

    return next(e)
  })

  on('tool.call', async ($, e, next) => {
    const ran = await next(e)
    if (isOn && e.agentId === undefined && steps.length < MAX_STEPS) {
      steps.push(toStep(e, ran))
    }

    return ran
  })

  on('turn.complete', async ($, e, next) => {
    const done = await next(e)
    // reason 'answer' leaves out an interrupted turn, a refusal and an API error.
    if (!isOn || e.agentId !== undefined || e.reason !== 'answer' || e.answer.length < MIN_REPLY) {
      return done
    }
    if (steps.length === 0 || (await read($, prompts)) <= QUIET_PROMPTS) {
      return done
    }

    const turnId = e.turnId
    latest = turnId
    // In the background, so the prompt comes back at once (the approach of
    // next-steps by Hamza Zafar, MIT, in this repository; this code is new).
    void (async () => {
      const found = await findFlags($, asked, e.answer, steps)
      if (found.length > 0 && latest === turnId) {
        await update($, flags, () => found)
      }
    })().catch(() => undefined)

    return done
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    // What other mods and Claude Code draw here stays, below the flags.
    const rest = await next(e)
    const list = await read($, flags)
    if (e.props.hasSurvey || list.length === 0) {
      return rest
    }

    const { Box, Button, Text } = $.ui.resolve(e)

    return (
      <Box flexDirection="column">
        <Box flexDirection="column" paddingX={1}>
          {list.map(flag => (
            <Text>
              <Text color="warning" bold>
                heads-up{' '}
              </Text>
              {flag}
            </Text>
          ))}
          <Button key="dismiss" label="Dismiss" role="dismiss" onPress={() => update($, flags, () => [])} />
        </Box>
        {rest}
      </Box>
    )
  })
}

// One Haiku call over the turn; [] when it finds nothing, or fails.
async function findFlags($: EngineInterface, request: string, reply: string, log: Step[]): Promise<string[]> {
  const r = await $.model.complete({
    model: 'haiku',
    prompt: checkPrompt(request, reply, log),
    maxTokens: 250,
    timeoutMs: 20000,
  })

  return r.isAnswered ? parseFlags(r.text) : []
}

// The person's own prompts: typed, sent through the phone or web bridge, or from an SDK host.
function isPerson(origin: PromptOrigin): boolean {
  return origin.kind === 'composer' || origin.kind === 'bridge' || origin.kind === 'sdk'
}

function toStep(e: ToolCallInput, ran: ToolCallResult): Step {
  const input = e as unknown as Record<string, unknown>
  const what = input.command ?? input.file_path ?? input.notebook_path ?? input.pattern ?? input.url ?? input.description ?? ''
  const isFailed = ran.deny !== undefined || ran.isError === true
  const said = ran.deny ?? ran.text ?? ''

  return {
    tool: e.tool,
    what: String(what).slice(0, 200),
    isFailed,
    // A failure's text says why; the end of a Bash run says how it ended (a test summary).
    output: isFailed ? said.slice(0, 300) : e.tool === 'Bash' ? said.slice(-200) : '',
  }
}

// The request, the tool log and the reply are data here: the model only names what was missed.
function checkPrompt(request: string, reply: string, log: Step[]): string {
  const calls = log
    .map((s, i) => {
      const line = `${i + 1}. ${s.tool} ${s.what}${s.isFailed ? ' [FAILED]' : ''}`

      return s.output === '' ? line : `${line}\n   ${s.output.replace(/\s+/g, ' ')}`
    })
    .join('\n')

  return [
    'Claude just finished a turn of work. Name at most two facts the person might miss. Only these count:',
    '- a tool call that failed, was not fixed by a later call, and the reply does not mention it',
    '- files changed beyond what the request asked for',
    '- code changed, and no test or build ran after the change',
    '- a risky step taken: a force push, a hard reset, deleted files, a migration, a publish or deploy, a change outside the project',
    'Do not list guesses or assumptions the reply made, style advice, or anything the reply already tells the person.',
    'Answer with only a JSON array of at most two strings, each under 20 words, naming the file, command or tool. Answer [] when nothing is worth flagging.',
    '',
    `Request: ${request.slice(0, 2000)}`,
    `Tool calls this turn:\n${calls.slice(0, 8000)}`,
    `Reply: ${reply.slice(0, 6000)}`,
  ].join('\n')
}

function parseFlags(text: string): string[] {
  try {
    const list: unknown = JSON.parse(text.match(/\[[\s\S]*\]/)?.[0] ?? '[]')

    return Array.isArray(list)
      ? list.filter((f): f is string => typeof f === 'string' && f.trim() !== '').slice(0, MAX_FLAGS)
      : []
  } catch {
    return []
  }
}
