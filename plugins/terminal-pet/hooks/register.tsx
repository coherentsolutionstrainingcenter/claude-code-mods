// terminal-pet: a small text pet in the band above the prompt that "eats" the files Claude reads.
// A tool.call hook on Read counts the meals; a one-second clock moves the frames along.
// It makes no model calls.
import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { Mood, Pet, PetSettings } from '../types'

const DEFAULT_NAME = 'Pip'
const MAX_NAME = 20
const EAT_MS = 4_000 // a meal shows as eating this long
const FULL_AT = 8 // files eaten before the pet is full
const DIGEST_MS = 15 * 60_000 // a full pet is hungry again this long after its last meal
const SLEEP_MS = 10 * 60_000 // idle this long, while Claude is not working, and it gets sleepy

// Two frames per mood, swapped on each beat. Plain characters, one cell each.
const FRAMES: Record<Mood, [string, string]> = {
  hungry: ['(°o°)', '(°O°)'],
  eating: ['(^O^)', '(^-^)'],
  full: ['(^_^)', '(-_^)'],
  sleepy: ['(-_-) z', '(-_-) zZ'],
}
// Theme keys, so the colors follow the person's theme.
const COLORS: Record<Mood, string> = { hungry: 'warning', eating: 'success', full: 'claude', sleepy: 'inactive' }

// Session values the band draws from. The settings are copied to $.store as well.
const pet = atom({ plugin: 'terminal-pet', key: 'pet' } as const, {
  meals: 0,
  lastMealAt: 0,
  lastFile: '',
  lastActiveAt: 0,
} as Pet)
const settings = atom({ plugin: 'terminal-pet', key: 'settings' } as const, {
  isOn: true,
  name: DEFAULT_NAME,
} as PetSettings)
const beat = atom({ plugin: 'terminal-pet', key: 'beat' } as const, 0)

let lastBeat = -1

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'pet',
      description: 'The pet above the prompt that eats the files Claude reads',
      argumentHint: '[on|off|name <name>]',
    })
    const saved = await loadSettings($)
    await update($, settings, () => saved)
    const now = await $.clock.now()
    await update($, pet, p => ({ ...p, lastActiveAt: now }))
    $.clock.every(1000, () => void tick($))

    return next(e)
  })

  // Each Read that succeeds is one meal. The count is per session.
  on('tool.call', { tool: 'Read' }, async ($, e, next) => {
    const ran = await next(e)
    if (ran.deny === undefined && ran.isError !== true) {
      const now = await $.clock.now()
      const file = e.file_path.split(/[\\/]/).pop() || e.file_path
      await update($, pet, p => ({ meals: p.meals + 1, lastMealAt: now, lastFile: file, lastActiveAt: now }))
    }

    return ran
  }).catch(($, e, next) => next(e))

  on('turn.complete', async ($, e, next) => {
    const now = await $.clock.now()
    await update($, pet, p => ({ ...p, lastActiveAt: now }))

    return next(e)
  })

  on('command.run', { command: 'pet' }, async ($, e) => {
    const [word = '', ...rest] = e.args.trim().split(/\s+/)
    const current = await read($, settings)

    if (word === 'on' || word === 'off') {
      await save($, { ...current, isOn: word === 'on' })
      return { text: word === 'on' ? `${current.name} is back above the prompt.` : `${current.name} is hidden. /pet on brings it back.` }
    }
    if (word === 'name') {
      const name = cleanName(rest.join(' '))
      if (name === '') {
        return { text: `Usage: /pet name <name>, up to ${MAX_NAME} characters.` }
      }
      await save($, { ...current, name })
      return { text: `Your pet is now called ${name}.` }
    }
    if (word === '') {
      const { meals } = await read($, pet)
      return {
        text: `${current.name} is ${current.isOn ? 'on' : 'off'} and has eaten ${plural(meals, 'file')} this session. Use /pet on, /pet off or /pet name <name>.`,
      }
    }

    return { text: 'Usage: /pet on, /pet off or /pet name <name>.' }
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const prefs = await read($, settings)
    if (!prefs.isOn || e.props.hasSurvey) {
      return next(e)
    }

    const state = await read($, pet)
    const frame = (await read($, beat)) % 2 === 0 ? 0 : 1
    const mood = moodOf(state, await $.clock.now(), e.props.isWorking)
    // The bands beneath draw above the pet, so their rows stay.
    const rest = await next(e)
    // Claude Code's own placeholder ({ type: 'engine' }) is never nested: the desktop drops a band that nests it.
    const below = rest && rest.type !== 'engine' ? rest : null
    const { Box, Text } = $.ui.resolve(e)

    const band = (
      <Box>
        <Text color={COLORS[mood]}>{FRAMES[mood][frame].padEnd(10)}</Text>
        <Text dimColor wrap="truncate">
          {caption(mood, prefs.name, state)}
        </Text>
      </Box>
    )

    return below ? (
      <Box flexDirection="column">
        {below}
        {band}
      </Box>
    ) : (
      band
    )
  })
}

/** Runs each second. It writes the beat only when it changes, and each write redraws the band. */
async function tick($: EngineInterface): Promise<void> {
  if (!(await read($, settings)).isOn) {
    return
  }

  const value = beatAt(await read($, pet), await $.clock.now())
  if (value !== lastBeat) {
    lastBeat = value
    await update($, beat, () => value)
  }
}

async function loadSettings($: EngineInterface): Promise<PetSettings> {
  const isOn = await $.store.get('isOn')
  const stored = await $.store.get('name')
  const name = typeof stored === 'string' ? cleanName(stored) : ''

  return { isOn: isOn !== false, name: name || DEFAULT_NAME }
}

async function save($: EngineInterface, value: PetSettings): Promise<void> {
  await $.store.set('isOn', value.isOn)
  await $.store.set('name', value.name)
  await update($, settings, () => value)
}

// Helpers below use neither $ nor JSX, so they can be checked on their own.

/** Eating right after a meal; sleepy when idle; full after enough meals; hungry otherwise. */
function moodOf(state: Pet, now: number, isWorking: boolean): Mood {
  if (now - state.lastMealAt < EAT_MS) {
    return 'eating'
  }
  if (!isWorking && now - state.lastActiveAt >= SLEEP_MS) {
    return 'sleepy'
  }
  if (state.meals >= FULL_AT && now - state.lastMealAt < DIGEST_MS) {
    return 'full'
  }

  return 'hungry'
}

/** A number that changes when the picture should: every second while eating, every 3 seconds otherwise. */
function beatAt(state: Pet, now: number): number {
  return now - state.lastMealAt < EAT_MS ? Math.floor(now / 1000) : Math.floor(now / 3000)
}

function caption(mood: Mood, name: string, state: Pet): string {
  const eaten = `${plural(state.meals, 'file')} eaten`
  if (mood === 'eating') {
    return `${name} is eating ${state.lastFile} · ${eaten}`
  }
  if (mood === 'full') {
    return `${name} is full · ${eaten}`
  }
  if (mood === 'sleepy') {
    return `${name} is sleepy · ${eaten}`
  }

  return state.meals === 0 ? `${name} is hungry · ask Claude to read a file` : `${name} is hungry · ${eaten}`
}

/** Drops control characters and keeps the first 20 characters. */
function cleanName(raw: string): string {
  return Array.from(raw.replace(/[\u0000-\u001f\u007f]/g, '').trim())
    .slice(0, MAX_NAME)
    .join('')
    .trim()
}

function plural(count: number, word: string): string {
  return `${count} ${count === 1 ? word : `${word}s`}`
}
