// repo-heatmap: /heatmap counts the files git tracks in the session's folder, by top-level
// folder and by kind, and draws one colored bar per folder. It reads git's list only: it
// never walks the disk, and it makes no model calls.
import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { Counts, Kind, Row, View } from '../types'

const PANE = 'repo-heatmap'
const MAX_ROWS = 15
const NAME_WIDTH = 24
const TOP_LEVEL = '(top level)'

const KINDS: Kind[] = ['code', 'tests', 'docs', 'design', 'data', 'config', 'other']
const COLORS: Record<Kind, string> = {
  code: '#4e9be6',
  tests: '#3fb57d',
  docs: '#e0b341',
  design: '#d46ad6',
  data: '#e07a3f',
  config: '#9a8fcf',
  other: '#8a8a8a',
}

// How a path is sorted into a kind: see kindOf for the order the rules are tried in.
const TEST_FOLDERS = new Set(['test', 'tests', '__tests__', 'spec', 'specs', 'e2e'])
const DESIGN = new Set(['svg', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'ico', 'fig', 'sketch', 'psd', 'xd'])
const CONFIG = new Set(['toml', 'ini', 'cfg', 'conf', 'lock', 'properties', 'env'])
const CONFIG_NAMES = new Set([
  'package.json', 'package-lock.json', 'tsconfig.json', 'jsconfig.json', 'pnpm-lock.yaml',
  'docker-compose.yml', 'docker-compose.yaml', 'dockerfile', 'makefile', 'gemfile',
  'requirements.txt', 'go.mod', 'go.sum',
])
const DATA = new Set(['json', 'jsonl', 'csv', 'tsv', 'sql', 'db', 'sqlite', 'yaml', 'yml', 'xml', 'parquet'])
const DOCS = new Set(['md', 'mdx', 'markdown', 'txt', 'rst', 'adoc', 'pdf'])
const DOC_NAMES = new Set(['readme', 'license', 'licence', 'changelog', 'contributing', 'authors', 'notice', 'copying'])
const CODE = new Set([
  'ts', 'tsx', 'js', 'jsx', 'mjs', 'cjs', 'mts', 'cts', 'py', 'rb', 'go', 'rs', 'java', 'kt', 'kts',
  'swift', 'c', 'h', 'cc', 'cpp', 'hpp', 'cs', 'php', 'sh', 'bash', 'zsh', 'ps1', 'css', 'scss',
  'sass', 'less', 'html', 'htm', 'vue', 'svelte', 'lua', 'r', 'scala', 'dart', 'm', 'mm', 'pl',
  'ex', 'exs', 'erl', 'clj', 'hs', 'ml', 'groovy',
])

const view = atom({ plugin: 'repo-heatmap', key: 'view' } as const, {
  status: 'idle',
  folder: '',
  rows: [],
  totals: emptyCounts(),
  rowCount: 0,
  isCut: false,
  error: '',
} as View)

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'heatmap',
      description: "Show how this repository's files spread across folders and kinds",
    })

    return next(e)
  })

  on('command.run', { command: 'heatmap' }, async $ => {
    void $.ui.open({ id: PANE, title: 'Repo heatmap' })
    void refresh($)

    return { text: 'Repo heatmap opened.' }
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Button, Text } = $.ui.resolve(e)
    const current = await read($, view)

    return (
      <Box flexDirection="column">
        <Box gap={1}>
          <Button
            key="refresh"
            label={current.status === 'reading' ? 'Reading…' : 'Refresh'}
            onPress={() => void refresh($)}
          />
          <Text dimColor wrap="truncate-start">
            {current.folder}
          </Text>
        </Box>
        {current.status === 'idle' && <Text dimColor>Press Refresh to count this repository's files.</Text>}
        {current.status === 'reading' && <Text dimColor>Running git ls-files…</Text>}
        {current.status === 'not-repo' && (
          <Text>
            This folder is not in a git repository, so there is no file list to count. Repo heatmap reads
            git's list of files and does not walk the disk.
          </Text>
        )}
        {current.status === 'failed' && <Text color="error">git ls-files failed: {current.error || 'no output'}</Text>}
        {current.status === 'ready' && chart(current, e.props.bodyColumns, Box, Text)}
      </Box>
    )
  })
}

/** Runs git ls-files in the session's folder and stores the counts. One run at a time. */
async function refresh($: EngineInterface): Promise<void> {
  if ((await read($, view)).status === 'reading') {
    return
  }

  const folder = await $.session.cwd()
  await update($, view, (v): View => ({ ...v, status: 'reading', folder, error: '' }))

  try {
    // -z ends each path with a NUL byte and leaves odd names unquoted. LC_ALL=C keeps
    // git's messages in English, so "not a git repository" can be recognised.
    const run = await $.process.run(['git', 'ls-files', '-z'], { cwd: folder, env: { LC_ALL: 'C' }, timeoutMs: 60_000 })
    if (run.exitCode !== 0) {
      const isRepo = !/not a git repository/i.test(run.stderr)
      const error = run.stderr.trim().slice(0, 300)
      await update($, view, (v): View => ({ ...v, status: isRepo ? 'failed' : 'not-repo', error }))
      return
    }

    const paths = run.stdout.split('\0').filter(path => path !== '')
    if (run.isStdoutTruncated) {
      paths.pop() // the last name may be cut in half
    }
    await update($, view, (v): View => ({ ...v, status: 'ready', ...summarize(paths), isCut: run.isStdoutTruncated }))
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    await update($, view, (v): View => ({ ...v, status: 'failed', error: message }))
  }
}

/** The legend with each kind's count, one bar per row, and the total line. */
function chart(current: View, columns: number, Box: any, Text: any) {
  const total = sumOf(current.totals)
  if (total === 0) {
    return <Text dimColor>git tracks no files in this folder yet.</Text>
  }

  const max = current.rows[0]?.total ?? 1 // the rows come biggest first
  const nameWidth = Math.min(NAME_WIDTH, Math.max(...current.rows.map(row => row.folder.length)))
  const countWidth = String(max).length
  const barWidth = Math.max(8, columns - nameWidth - countWidth - 2)
  const hidden = current.rowCount - current.rows.length

  return (
    <Box flexDirection="column">
      <Text>
        {KINDS.filter(kind => current.totals[kind] > 0).map(kind => (
          <Text color={COLORS[kind]}>
            █ {kind} {current.totals[kind]}{'  '}
          </Text>
        ))}
      </Text>
      {current.rows.map(row => (
        <Text>
          {fit(row.folder, nameWidth)} {String(row.total).padStart(countWidth)}{' '}
          {barCells(row.counts, max, barWidth).map(segment => (
            <Text color={COLORS[segment.kind]}>{'█'.repeat(segment.cells)}</Text>
          ))}
        </Text>
      ))}
      <Text>
        Total: {total} {total === 1 ? 'file' : 'files'}
        {hidden > 0 ? ` · ${hidden} smaller ${hidden === 1 ? 'folder is' : 'folders are'} not shown` : ''}
      </Text>
      {current.isCut && <Text color="warning">git's list passed 4 MiB and was cut, so these counts are partial.</Text>}
    </Box>
  )
}

// Helpers below use neither $ nor JSX, so they can be checked on their own.

/** Groups the paths by top-level folder and kind, biggest folder first, and keeps the first 15. */
function summarize(paths: readonly string[]): { rows: Row[]; totals: Counts; rowCount: number } {
  const byFolder = new Map<string, Counts>()
  const totals = emptyCounts()
  for (const path of paths) {
    const slash = path.indexOf('/')
    const folder = slash === -1 ? TOP_LEVEL : path.slice(0, slash + 1)
    const counts = byFolder.get(folder) ?? emptyCounts()
    const kind = kindOf(path)
    counts[kind] += 1
    totals[kind] += 1
    byFolder.set(folder, counts)
  }

  const rows = [...byFolder]
    .map(([folder, counts]) => ({ folder, counts, total: sumOf(counts) }))
    .sort((a, b) => b.total - a.total || a.folder.localeCompare(b.folder))

  return { rows: rows.slice(0, MAX_ROWS), totals, rowCount: rows.length }
}

/** The kind of one path. The rules are tried in this order, and the first that matches wins. */
function kindOf(path: string): Kind {
  const parts = path.toLowerCase().split('/')
  const name = parts[parts.length - 1] ?? ''
  const dot = name.lastIndexOf('.')
  const ext = dot > 0 ? name.slice(dot + 1) : ''

  if (
    parts.slice(0, -1).some(part => TEST_FOLDERS.has(part)) ||
    /[._-](test|spec)\.[a-z0-9]+$/.test(name) ||
    /^test_.+\.py$/.test(name)
  ) {
    return 'tests'
  }
  if (DESIGN.has(ext)) {
    return 'design'
  }
  if (
    parts.some(part => part.startsWith('.')) || // dotfiles and hidden folders: .github, .gitignore
    CONFIG.has(ext) ||
    CONFIG_NAMES.has(name) ||
    /^tsconfig\..+\.json$/.test(name) ||
    /\.config\.[cm]?[jt]s$/.test(name)
  ) {
    return 'config'
  }
  if (DATA.has(ext)) {
    return 'data'
  }
  if (DOCS.has(ext) || DOC_NAMES.has(name)) {
    return 'docs'
  }
  if (CODE.has(ext)) {
    return 'code'
  }

  return 'other'
}

/**
 * Splits one bar into colored runs, a run per kind. Each run ends where the running total
 * lands, so the rounding never adds up to more than the bar. A folder with files always
 * shows at least one cell.
 */
function barCells(counts: Counts, max: number, width: number): { kind: Kind; cells: number }[] {
  let sum = 0
  let drawn = 0
  const segments = KINDS.map(kind => {
    sum += counts[kind]
    const end = Math.round((sum / max) * width)
    const cells = end - drawn
    drawn = end
    return { kind, cells }
  })

  if (drawn === 0 && sum > 0) {
    const biggest = KINDS.reduce((best, kind) => (counts[kind] > counts[best] ? kind : best))
    return [{ kind: biggest, cells: 1 }]
  }

  return segments.filter(segment => segment.cells > 0)
}

/** A folder name cut or padded to the width of the name column. */
function fit(name: string, width: number): string {
  return name.length > width ? `${name.slice(0, width - 1)}…` : name.padEnd(width)
}

function sumOf(counts: Counts): number {
  return KINDS.reduce((sum, kind) => sum + counts[kind], 0)
}

function emptyCounts(): Counts {
  return { code: 0, tests: 0, docs: 0, design: 0, data: 0, config: 0, other: 0 }
}
