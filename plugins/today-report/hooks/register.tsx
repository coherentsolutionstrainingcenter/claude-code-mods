import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { DayTotals, Period, Report, View } from '../types'

const PANE = 'today-report'
const PERIODS: Period[] = ['day', 'week', 'month', 'year']
const ROWS: Record<Period, number> = { day: 14, week: 12, month: 12, year: 5 }

// The task types scripts/aggregate.py counts, in a fixed order with a light and a
// dark color each: a type keeps its color whichever types a period has.
const TYPES = [
  { name: 'code changes', light: '#2a78d6', dark: '#3987e5' },
  { name: 'commands', light: '#eb6834', dark: '#d95926' },
  { name: 'research', light: '#1baf7a', dark: '#199e70' },
  { name: 'delegated', light: '#eda100', dark: '#c98500' },
  { name: 'conversation', light: '#e87ba4', dark: '#d55181' },
]
// The chart is drawn as an image, whose color scheme need not match the pane's, so its
// labels and grid are one mid gray that reads on a light or a dark pane.
const CHART_CSS = `<style>
.s{fill:#898781}.n{font-variant-numeric:tabular-nums}.g{stroke:#898781;stroke-opacity:.25}.a{stroke:#898781;stroke-opacity:.6}
.h{fill:#898781;fill-opacity:0}.col:hover .h{fill-opacity:.12}
${TYPES.map((type, i) => `.c${i}{fill:${type.light}}`).join('')}
@media (prefers-color-scheme: dark){${TYPES.map((type, i) => `.c${i}{fill:${type.dark}}`).join('')}}
</style>`
const SPARKS = '▁▂▃▄▅▆▇█'

const view = atom(
  { plugin: 'today-report', key: 'view' } as const,
  {
    status: 'idle',
    period: 'day',
    report: null,
    error: '',
    minutesPerTask: 10,
    hourlyRate: 50,
  } as View,
)

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'today-report',
      description: "Today's Report: tasks, time saved and tokens by day, week, month and year",
    })

    return next(e)
  })

  on('command.run', { command: 'today-report' }, async $ => {
    void $.ui.open({ id: PANE, title: "Today's Report" })
    void refresh($)

    return { text: "Today's Report opened." }
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const ui = $.ui.resolve(e)
    const { Box, Button, Text } = ui
    // The terminal draws no Svg, so it gets a line of text bars instead of the chart.
    const Svg = e.surface !== 'terminal' && 'Svg' in ui ? ui.Svg : null
    const width = Math.max(240, Math.min(900, (e.props.bodyColumns || 60) * 8 - 8))
    const current = await read($, view)

    return (
      <Box flexDirection="column">
        <Box>
          {PERIODS.map(period => (
            <Button
              key={period}
              label={current.period === period ? `[${period}]` : period}
              onPress={() => update($, view, v => ({ ...v, period }))}
            />
          ))}
          <Button
            key="refresh"
            label={current.status === 'reading' ? 'Reading…' : 'Refresh'}
            onPress={() => void refresh($)}
          />
        </Box>
        {body(current, Box, Text, Svg, width)}
      </Box>
    )
  })
}

/** Runs the aggregator and stores what it prints. One run at a time. */
async function refresh($: EngineInterface): Promise<void> {
  const current = await read($, view)
  if (current.status === 'reading') {
    return
  }

  const settings = await $.config.list()
  const minutesPerTask = setting(settings, 'today-report.minutesPerTask', 10)
  const hourlyRate = setting(settings, 'today-report.hourlyRate', 50)
  await update($, view, v => ({ ...v, status: 'reading', error: '', minutesPerTask, hourlyRate }))

  try {
    const run = await $.process.run(['python3', `${$.plugin.root}/scripts/aggregate.py`], { timeoutMs: 600000 })
    if (run.exitCode !== 0) {
      throw new Error(run.stderr.trim().slice(0, 300) || `exit code ${run.exitCode}`)
    }

    const report = JSON.parse(run.stdout) as Report
    await update($, view, v => ({ ...v, status: 'ready', report }))
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    await update($, view, v => ({ ...v, status: 'failed', error: message }))
  }
}

function setting(rows: readonly { key: string; value: unknown }[], key: string, fallback: number): number {
  const value = rows.find(row => row.key === key)?.value
  return typeof value === 'number' ? value : fallback
}

function body(current: View, Box: any, Text: any, Svg: any, width: number) {
  if (current.status === 'idle') {
    return <Text dimColor>Press Refresh to read your session logs.</Text>
  }
  if (current.status === 'reading') {
    return <Text dimColor>Reading session logs. The first run takes a little while.</Text>
  }
  if (current.status === 'failed' || current.report === null) {
    return <Text color="red">Could not read the logs: {current.error || 'no output'}</Text>
  }

  const report = current.report
  const rows = totalsFor(report.days, current.period)
  const all = rows.reduce((sum, [, data]) => add(sum, data), empty())
  const hours = (all.tasks * current.minutesPerTask) / 60

  return (
    <Box flexDirection="column">
      <Text>
        Total: {all.tasks} tasks, about {hours.toFixed(1)} h saved, ${Math.round(hours * current.hourlyRate)}
      </Text>
      {rows.length === 0 && <Text dimColor>No Claude Code sessions found in ~/.claude/projects.</Text>}
      {rows.length > 0 &&
        (Svg ? (
          <Box flexDirection="column">
            <Text bold>Tasks per {current.period}</Text>
            <Svg {...chart(rows, current, width)} width={width} isInteractive />
          </Box>
        ) : (
          <Text>
            Tasks per {current.period}, oldest first: {spark(rows)}
          </Text>
        ))}
      {rows.map(([label, data]) => (
        <Box key={label} flexDirection="column">
          <Text>
            {label}  {data.tasks} tasks · {((data.tasks * current.minutesPerTask) / 60).toFixed(1)} h · $
            {Math.round((data.tasks * current.minutesPerTask * current.hourlyRate) / 60)} · out {compact(data.tokens.output)} · in{' '}
            {compact(data.tokens.input + data.tokens.cacheRead + data.tokens.cacheWrite)}
          </Text>
          <Text dimColor>
            {'  '}
            {top(data.categories) ?? 'no tasks'} · {top(data.models) ?? ''}
          </Text>
        </Box>
      ))}
      <Text dimColor>
        Estimate: {current.minutesPerTask} min per task at ${current.hourlyRate}/h (set in /plugin configure today-report).
        Tokens come from your logs.
      </Text>
      {(report.stale > 0 || report.pending > 0) && (
        <Text color="yellow">
          {report.pending + report.stale} log files were not read this run. Press Refresh to read the rest.
        </Text>
      )}
    </Box>
  )
}

/**
 * A column per period, oldest on the left, stacked by task type. Hovering a column
 * or a segment names its totals; the rows below the chart hold the same numbers.
 */
function chart(rows: [string, DayTotals][], current: View, W: number): { source: string; alt: string; height: number } {
  const bars = [...rows].reverse()
  const textWidth = (text: string) => text.length * 6.2

  // The legend flows left to right and wraps at the width.
  const legend: string[] = []
  let x = 0
  let y = 12
  TYPES.forEach((type, i) => {
    const w = 14 + textWidth(type.name)
    if (x > 0 && x + w > W) {
      x = 0
      y += 18
    }
    legend.push(`<rect class="c${i}" x="${x}" y="${y - 9}" width="10" height="10" rx="2"/>`)
    legend.push(`<text class="s" x="${x + 14}" y="${y}">${type.name}</text>`)
    x += w + 14
  })

  const left = 36
  const top = y + 18
  const base = top + 150
  const height = base + 22
  const max = Math.max(1, ...bars.map(([, data]) => data.tasks))
  const step = niceStep(max / 4)
  const yMax = Math.ceil(max / step) * step
  const scale = (n: number) => (n / yMax) * (base - top)

  const grid: string[] = []
  for (let value = 0; value <= yMax; value += step) {
    const gy = px(base - scale(value))
    grid.push(`<line class="${value === 0 ? 'a' : 'g'}" x1="${left}" x2="${W}" y1="${gy}" y2="${gy}"/>`)
    grid.push(`<text class="s n" x="${left - 6}" y="${gy + 4}" text-anchor="end">${value}</text>`)
  }

  const slot = (W - left) / bars.length
  const barW = Math.min(36, slot * 0.6)
  const short = (label: string) => label.replace('week of ', '').replace(/^\d{4}-(\d\d-\d\d)$/, '$1')
  // Label every n-th column, counted back from the newest, so labels never overlap.
  const every = Math.ceil((Math.max(...bars.map(([label]) => textWidth(short(label)))) + 8) / slot)

  const columns = bars.map(([label, data], i) => {
    const cx = left + slot * i + slot / 2
    const bx = px(cx - barW / 2)
    const hours = (data.tasks * current.minutesPerTask) / 60
    const tip = `${label}: ${data.tasks} tasks, ${hours.toFixed(1)} h, $${Math.round(hours * current.hourlyRate)}`
    const shown = TYPES.map((type, k) => ({ type, k, n: data.categories[type.name] ?? 0 })).filter(({ n }) => n > 0)
    const parts = [`<rect class="h" x="${px(left + slot * i)}" y="${top}" width="${px(slot)}" height="${base - top}"><title>${tip}</title></rect>`]

    let below = 0
    shown.forEach(({ type, k, n }, j) => {
      const yTop = px(base - scale(below + n))
      // A 2px gap separates each segment from the one beneath it.
      const h = px(scale(n) - (j > 0 ? 2 : 0))
      below += n
      if (h <= 0) {
        return
      }
      const shape = j === shown.length - 1 ? roundedTop(bx, yTop, px(barW), h) : `<rect x="${bx}" y="${yTop}" width="${px(barW)}" height="${h}"/>`
      parts.push(`<g class="c${k}"><title>${tip}. ${type.name}: ${n}</title>${shape}</g>`)
    })

    if ((bars.length - 1 - i) % every === 0) {
      parts.push(`<text class="s n" x="${px(cx)}" y="${base + 16}" text-anchor="middle">${short(label)}</text>`)
    }
    return `<g class="col">${parts.join('')}</g>`
  })

  const source = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${height}" viewBox="0 0 ${W} ${height}" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="11">
${CHART_CSS}
${legend.join('')}
${grid.join('')}
${columns.join('')}
</svg>`
  const alt = `Tasks per ${current.period}, ${bars[0]?.[0]} to ${rows[0]?.[0]}: ${bars.map(([, data]) => data.tasks).join(', ')}`

  return { source, alt, height }
}

/** A bar with its top corners rounded, anchored to the baseline. */
function roundedTop(x: number, y: number, w: number, h: number): string {
  const r = px(Math.min(4, h, w / 2))
  return `<path d="M${x} ${px(y + h)}V${px(y + r)}Q${x} ${y} ${px(x + r)} ${y}H${px(x + w - r)}Q${px(x + w)} ${y} ${px(x + w)} ${px(y + r)}V${px(y + h)}Z"/>`
}

/** The axis step: 1, 2 or 5 times a power of ten, at least `raw`. */
function niceStep(raw: number): number {
  const power = 10 ** Math.floor(Math.log10(Math.max(raw, 1)))
  return ([1, 2, 5, 10].find(unit => unit * power >= raw) ?? 10) * power
}

function px(n: number): number {
  return Math.round(n * 10) / 10
}

/** Tasks per period as one line of block characters, oldest first, for the terminal. */
function spark(rows: [string, DayTotals][]): string {
  const counts = rows.map(([, data]) => data.tasks).reverse()
  const max = Math.max(1, ...counts)
  return counts.map(n => SPARKS[Math.round((n / max) * (SPARKS.length - 1))]).join('')
}

/** Groups the days into the periods shown, newest first, and keeps the latest few. */
function totalsFor(days: Record<string, DayTotals>, period: Period): [string, DayTotals][] {
  const buckets: Record<string, DayTotals> = {}
  for (const [day, data] of Object.entries(days)) {
    const key = periodKey(day, period)
    if (!buckets[key]) {
      buckets[key] = empty()
    }
    buckets[key] = add(buckets[key], data)
  }

  return Object.entries(buckets)
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .slice(0, ROWS[period])
    .map(([key, data]) => [period === 'week' ? `week of ${key}` : key, data])
}

function periodKey(day: string, period: Period): string {
  if (period === 'day') {
    return day
  }
  if (period === 'month') {
    return day.slice(0, 7)
  }
  if (period === 'year') {
    return day.slice(0, 4)
  }

  // A week starts on Monday, so step back to the Monday on or before the day.
  const start = new Date(`${day}T00:00:00`)
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7))
  return [start.getFullYear(), start.getMonth() + 1, start.getDate()]
    .map(part => String(part).padStart(2, '0'))
    .join('-')
}

function empty(): DayTotals {
  return { tasks: 0, categories: {}, models: {}, tokens: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } }
}

function add(into: DayTotals, more: DayTotals): DayTotals {
  const merged = empty()
  merged.tasks = into.tasks + more.tasks
  for (const source of [into, more]) {
    for (const [name, count] of Object.entries(source.categories)) {
      merged.categories[name] = (merged.categories[name] ?? 0) + count
    }
    for (const [name, count] of Object.entries(source.models)) {
      merged.models[name] = (merged.models[name] ?? 0) + count
    }
    merged.tokens.input += source.tokens.input
    merged.tokens.output += source.tokens.output
    merged.tokens.cacheRead += source.tokens.cacheRead
    merged.tokens.cacheWrite += source.tokens.cacheWrite
  }
  return merged
}

function top(counts: Record<string, number>): string | undefined {
  const best = Object.entries(counts)
    .filter(([name]) => name !== 'unknown')
    .sort(([, a], [, b]) => b - a)[0]
  return best ? `${best[0]} (${best[1]})` : undefined
}

function compact(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`
  return String(n)
}
