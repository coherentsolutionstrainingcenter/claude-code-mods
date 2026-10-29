/** What the store keeps under `progress`: how many times Skip was pressed, and every day marked done. */
export type Progress = { shift: number; doneDays: string[] }

/** What the pane draws from: today's local date as YYYY-MM-DD, and the progress read with it. */
export type View = { today: string; progress: Progress }

declare module 'claude-code' {
  interface PluginState {
    'daily-challenge': { view: View }
  }
}
