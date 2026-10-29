export type PlainView = {
  /** waiting: nothing rewritten yet; busy: a rewrite runs; ready: text holds one; failed: the last call gave no text. */
  mode: 'waiting' | 'busy' | 'ready' | 'failed'
  /** The rewrite as Markdown, ending with its Next steps list; empty until one is ready. */
  text: string
}

declare module 'claude-code' {
  interface PluginState {
    'plain-english': { view: PlainView }
  }
}
