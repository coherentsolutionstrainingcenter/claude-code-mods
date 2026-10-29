export type Kind = 'code' | 'tests' | 'docs' | 'design' | 'data' | 'config' | 'other'

/** Files of each kind. */
export type Counts = Record<Kind, number>

/** One bar: a top-level folder (or the files at the top level) and its files by kind. */
export type Row = { folder: string; total: number; counts: Counts }

/** What the pane draws from. */
export type View = {
  status: 'idle' | 'reading' | 'ready' | 'not-repo' | 'failed'
  /** The session's folder, where git ls-files ran. */
  folder: string
  /** The biggest folders first, at most 15. */
  rows: Row[]
  /** Every file by kind, the rows not shown included. */
  totals: Counts
  /** How many rows there were in all, before the cut to 15. */
  rowCount: number
  /** True when git's list passed 4 MiB and was cut, so the counts are partial. */
  isCut: boolean
  error: string
}

declare module 'claude-code' {
  interface PluginState {
    'repo-heatmap': { view: View }
  }
}
