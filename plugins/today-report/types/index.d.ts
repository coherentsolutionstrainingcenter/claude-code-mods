export type Period = 'day' | 'week' | 'month' | 'year'

/** Totals for one local day, as scripts/aggregate.py writes them. */
export type DayTotals = {
  tasks: number
  categories: Record<string, number>
  models: Record<string, number>
  tokens: { input: number; output: number; cacheRead: number; cacheWrite: number }
}

export type Report = {
  generatedAt: number
  files: number
  scanned: number
  stale: number
  pending: number
  failed: number
  days: Record<string, DayTotals>
}

export type View = {
  status: 'idle' | 'reading' | 'ready' | 'failed'
  period: Period
  report: Report | null
  error: string
  minutesPerTask: number
  hourlyRate: number
}

declare module 'claude-code' {
  interface PluginState {
    'today-report': { view: View }
  }
}
