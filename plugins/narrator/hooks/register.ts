import type { EngineInterface, Register } from 'claude-code'

// The last characters of a reply that are read aloud.
const SPOKEN_CHARS = 240

// Set once, when say fails, so the toast shows one time.
let warned = false

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'narrator',
      description: 'Read the end of each finished reply aloud (off by default)',
      argumentHint: 'on | off | status',
    })

    return next(e)
  })

  on('command.run', { command: 'narrator' }, async ($, e) => {
    const arg = e.args.trim()
    if (arg === 'on' || arg === 'off') {
      await $.store.set('enabled', arg === 'on')
      return { text: `Narrator is ${arg}.` }
    }

    const state = (await $.store.get('enabled')) === true ? 'on' : 'off'
    return { text: `Narrator is ${state}. Use /narrator on, /narrator off or /narrator status.` }
  })

  on('turn.complete', async ($, e, next) => {
    // Subagent replies, interrupted turns and replies with no words are not read.
    if (e.agentId !== undefined || e.isAborted || (await $.store.get('enabled')) !== true) {
      return next(e)
    }

    const words = tail(speakable(e.answer))
    if (words !== '') {
      speak($, words)
    }

    return next(e)
  })
}

/** Starts say without waiting: the turn goes on while the voice reads. */
function speak($: EngineInterface, words: string): void {
  // Two minutes: a long enough read that the default 30 s never cuts speech short.
  void $.process
    .run(['say', '--', words], { timeoutMs: 120000 })
    .then(run => {
      if (run.exitCode !== 0) {
        warn($)
      }
    })
    .catch(() => warn($))
}

function warn($: EngineInterface): void {
  if (warned) {
    return
  }

  warned = true
  $.ui.toast('Narrator could not run macOS say, so replies are not read aloud here.')
}

/** The words of a Markdown reply: code, links, URLs and marks go, the text stays. */
function speakable(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?(```|$)/g, ' ')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*)\]\[[^\]]*\]/g, '$1')
    .replace(/^ *\[[^\]]+\]:.*$/gm, '')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/<\/?[a-zA-Z][^>]*>/g, ' ')
    .replace(/`+/g, '')
    .replace(/^[ \t|:-]{3,}$/gm, ' ')
    .replace(/^[ \t]{0,3}#{1,6}[ \t]+/gm, '')
    .replace(/^[ \t]*>+[ \t]?/gm, '')
    .replace(/^[ \t]*(?:[-*+]|\d+[.)])[ \t]+/gm, '')
    .replace(/\*+|~~/g, '')
    .replace(/(^|\s)_+|_+(?=\s|$)/g, '$1')
    .replace(/\|/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** The last characters of the words, from the first whole word: the part read aloud. */
function tail(words: string): string {
  const chars = Array.from(words)
  if (chars.length <= SPOKEN_CHARS) {
    return words
  }

  // The cut can start mid-word: drop that partial word.
  const cut = chars.slice(-SPOKEN_CHARS)
  const space = cut.indexOf(' ')

  return (space === -1 ? cut : cut.slice(space + 1)).join('').trim()
}
