export type Assumption = {
  /** The guess, in one short line. */
  text: string
  /** open until the person presses Right or Wrong. */
  verdict: 'open' | 'right' | 'wrong'
}

declare module 'claude-code' {
  interface PluginState {
    'assumption-check': { items: Assumption[] }
  }
}
