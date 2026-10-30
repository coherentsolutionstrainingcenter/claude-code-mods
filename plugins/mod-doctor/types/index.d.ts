/** One row of `claude plugin list`. */
export type Installed = {
  /** name@marketplace, as the list prints it. */
  id: string
  version: string
  /** True when the list says enabled or loaded. */
  enabled: boolean
  /** The "Read from:" folder; null for built-in and synced plugins. */
  folder: string | null
}

/** What `claude plugin validate` and the plugin's hooks module declare. */
export type Check = {
  id: string
  version: string
  verdict: 'passed' | 'failed' | 'unknown'
  warnings: number
  errors: number
  /** The first error, or why there is no verdict. */
  problem: string
  /** Hook events with their matchers, as the validator prints them. */
  hooks: string[]
  /** Calls the module makes, without the "(via ...)" notes. */
  calls: string[]
  /** True when a band hook in its source draws without keeping the bands beneath it. */
  dropsBands: boolean
}

export type Flag = {
  text: string
  severity: 'fail' | 'note'
}

export type Audit = {
  at: number
  installed: number
  enabled: number
  disabled: string[]
  noFolder: string[]
  checks: Check[]
  flags: Flag[]
}

export type View = {
  status: 'idle' | 'reading' | 'ready' | 'failed'
  error: string
  audit: Audit | null
}

declare module 'claude-code' {
  interface PluginState {
    'mod-doctor': { view: View }
  }
}
