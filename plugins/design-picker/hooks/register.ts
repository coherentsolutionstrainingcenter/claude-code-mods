import type { EngineInterface, Register } from 'claude-code'

// A question or option with one of these words is a design choice.
const DESIGN_WORDS = /\b(?:styles?|themes?|palettes?|colou?rs?|fonts?|typography|layouts?|looks?|designs?|ui)\b/i
// A declaration with any of these could load a file, run code, or break out of its style attribute.
const BANNED = /url\s*\(|expression\s*\(|@import|image-set|image\s*\(|cross-fade|element\s*\(|javascript:|behavior|binding|[{}<>@\\]/i
const HEX = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i
const FOLDER = '.claude/design-picker'

type Option = { label: string; description?: string }
type Card = { card: string; heading: string; text: string; button: string; swatches: string[] }

const PLAIN: Card = { card: '', heading: '', text: '', button: '', swatches: [] }

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'design-picker',
      description: 'Reopen the newest design picker page in your browser',
      argumentHint: 'last',
    })

    return next(e)
  })

  on('command.run', { command: 'design-picker' }, async ($, e) => {
    if (e.args.trim() !== 'last') {
      return { text: 'Use /design-picker last to reopen the newest page.' }
    }

    const folder = await folderOf($)
    const entries = folder === undefined ? [] : await $.fs.list(folder).catch(() => [])
    // Names are times, so the last name in order is the newest page.
    const newest = entries
      .filter(entry => entry.kind === 'file' && entry.name.endsWith('.html'))
      .map(entry => entry.name)
      .sort()
      .at(-1)
    if (folder === undefined || newest === undefined) {
      return { text: 'No design picker page yet.' }
    }

    const path = `${folder}/${newest}`
    return (await show($, path)) ? { text: `Opened ${path}` } : { text: `Could not open ${path}. Open it in a browser yourself.` }
  })

  on('tool.call', { tool: 'AskUserQuestion' }, async ($, e, next) => {
    // Only the model's own question: a plugin's $.ui.ask comes through here too.
    const asked =
      next.origin.plugin === 'engine'
        ? e.questions.find(q => q.options.length >= 2 && DESIGN_WORDS.test(wordsOf(q)))
        : undefined

    if (asked !== undefined) {
      // Fails open: whatever goes wrong here, the dialog below still appears.
      await preview($, asked.question, asked.options).catch(() => undefined)
    }

    // The call goes on unchanged, so the normal dialog appears.
    return next(e)
  }).catch(($, e, next) => next(e)) // a hook that fails or runs out of time still lets the dialog through
}

/** One Haiku call for the styles, one page with a card per option, opened in the browser. */
async function preview($: EngineInterface, question: string, options: readonly Option[]): Promise<void> {
  const reply = await $.model.complete({
    model: 'haiku',
    prompt: stylePrompt(question, options),
    maxTokens: 1500,
    timeoutMs: 25000,
  })
  const cards = reply.isAnswered ? parseCards(reply.text, options.length) : undefined
  const folder = await folderOf($)
  if (cards === undefined || folder === undefined) {
    return
  }

  const stamp = new Date(await $.clock.now()).toISOString().replace(/[:.]/g, '-')
  const path = `${folder}/${stamp}.html`
  await $.fs.write(path, page(question, options, cards))
  await show($, path)
}

async function folderOf($: EngineInterface): Promise<string | undefined> {
  const home = await $.env.get('HOME')

  return home === undefined || home === '' ? undefined : `${home}/${FOLDER}`
}

/** macOS's open hands the page to the default browser. */
async function show($: EngineInterface, path: string): Promise<boolean> {
  const run = await $.process.run(['open', path], { timeoutMs: 10000 }).catch(() => undefined)

  return run?.exitCode === 0
}

function wordsOf(q: { question: string; header: string; options: readonly Option[] }): string {
  return [q.question, q.header, ...q.options.flatMap(o => [o.label, o.description ?? ''])].join(' ')
}

// The question and options are data here: the model only styles them.
function stylePrompt(question: string, options: readonly Option[]): string {
  return [
    'Someone is choosing between design styles. For each numbered option, write CSS declarations that show that style: its colours, its type and its shapes.',
    'Answer with only a JSON array, one object per option, in the same order. Each object has these keys:',
    '"card": declarations for the card itself (background, color, font-family, border, border-radius, padding, box-shadow)',
    '"heading": declarations for its heading',
    '"text": declarations for its paragraph',
    '"button": declarations for its sample button',
    '"swatches": three to five colours of the palette, as hex strings such as "#1a2b3c"',
    'Write declarations only, separated by semicolons: no selectors, no braces, no url(), no @import, no images and no web fonts. Name only fonts a Mac has, with a generic family last.',
    '',
    `Question: ${question.slice(0, 500)}`,
    ...options.map((o, i) => `${i + 1}. ${o.label.slice(0, 200)}: ${(o.description ?? '').slice(0, 300)}`),
  ].join('\n')
}

/** The model's JSON array as one card per option; undefined when it holds none. */
function parseCards(text: string, count: number): Card[] | undefined {
  const json = text.match(/\[[\s\S]*\]/)?.[0]
  if (json === undefined) {
    return undefined
  }

  try {
    const list: unknown = JSON.parse(json)
    if (!Array.isArray(list) || list.length === 0) {
      return undefined
    }

    return Array.from({ length: count }, (_, i) => toCard(list[i]))
  } catch {
    return undefined
  }
}

function toCard(raw: unknown): Card {
  if (typeof raw !== 'object' || raw === null) {
    return PLAIN
  }

  const o = raw as Record<string, unknown>
  const swatches = Array.isArray(o.swatches)
    ? o.swatches
        .filter((c): c is string => typeof c === 'string' && HEX.test(c.trim()))
        .map(c => c.trim())
        .slice(0, 6)
    : []

  return { card: cleanCss(o.card), heading: cleanCss(o.heading), text: cleanCss(o.text), button: cleanCss(o.button), swatches }
}

/** Keeps plain "property: value" declarations, and drops any that could load or run something. */
function cleanCss(raw: unknown): string {
  if (typeof raw !== 'string') {
    return ''
  }

  return raw
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .split(';')
    .map(d => d.trim())
    .filter(d => /^-?[a-z][a-z-]*\s*:/i.test(d) && !BANNED.test(d))
    .slice(0, 24)
    .join('; ')
}

/** Escapes text for HTML, in an element or inside a quoted attribute. */
function esc(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

function page(question: string, options: readonly Option[], cards: readonly Card[]): string {
  const figures = options.map((o, i) => {
    const c = cards[i] ?? PLAIN
    const swatches = c.swatches.map(s => `<span style="background:${s}"></span>`).join('')

    return [
      '<figure>',
      `<div class="card" style="${esc(c.card)}">`,
      `<h2 style="${esc(c.heading)}">${esc(o.label)}</h2>`,
      `<p style="${esc(c.text)}">${esc(o.description ?? '')}</p>`,
      `<button type="button" style="${esc(c.button)}">Get started</button>`,
      `<div class="swatches">${swatches}</div>`,
      '</div>',
      `<figcaption>Option ${i + 1}: ${esc(o.label)}</figcaption>`,
      '</figure>',
    ].join('\n')
  })

  return [
    '<!doctype html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="utf-8">',
    // The page loads nothing and runs nothing, whatever the cards hold.
    `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'">`,
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    '<title>Design picker</title>',
    '<style>',
    'body{margin:0;padding:32px 24px;background:#f3f2ef;color:#1f1f1f;font:15px/1.5 -apple-system,BlinkMacSystemFont,"Helvetica Neue",sans-serif}',
    'h1{font-size:20px;margin:0 0 4px}',
    '.lede{color:#5c5c5c;margin:0 0 24px}',
    '.row{display:flex;flex-wrap:wrap;gap:20px;align-items:stretch}',
    'figure{margin:0;flex:1 1 240px;max-width:320px;display:flex;flex-direction:column}',
    '.card{flex:1;padding:24px;border-radius:12px;background:#fff;overflow:hidden}',
    '.card h2{margin:0 0 8px}',
    '.card p{margin:0 0 16px}',
    '.swatches{display:flex;gap:6px;margin-top:16px}',
    '.swatches span{width:28px;height:28px;border-radius:50%;border:1px solid rgba(0,0,0,.15)}',
    'figcaption{margin-top:8px;font-size:13px;color:#5c5c5c}',
    '</style>',
    '</head>',
    '<body>',
    `<h1>${esc(question)}</h1>`,
    '<p class="lede">Choose in Claude Code. This page only shows what each option looks like.</p>',
    '<div class="row">',
    ...figures,
    '</div>',
    '</body>',
    '</html>',
    '',
  ].join('\n')
}
