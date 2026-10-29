import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { DayTotals, Period, Report, View } from '../types'

const PANE = 'today-report'
const PERIODS: Period[] = ['day', 'week', 'month', 'year']
const ROWS: Record<Period, number> = { day: 14, week: 12, month: 12, year: 5 }

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
    const { Box, Button, Text } = $.ui.resolve(e)
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
        {body(current, Box, Text)}
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

function body(current: View, Box: any, Text: any) {
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
