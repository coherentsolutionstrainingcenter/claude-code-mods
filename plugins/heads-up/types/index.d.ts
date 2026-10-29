declare module 'claude-code' {
  interface PluginState {
    'heads-up': {
      /** What the band shows: at most two short lines, [] when there is nothing to flag. */
      flags: string[]
      /** How many prompts the person has sent in this session. */
      prompts: number
    }
  }
}
