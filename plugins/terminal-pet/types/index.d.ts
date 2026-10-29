export type Mood = 'hungry' | 'eating' | 'full' | 'sleepy'

/** This session's meals. Times are milliseconds since the epoch. */
export type Pet = {
  meals: number
  lastMealAt: number
  /** The name of the last file eaten, without its folder. */
  lastFile: string
  /** The last meal, the end of the last turn, or the session's start. */
  lastActiveAt: number
}

/** What /pet changes, copied to the store so it outlives the session. */
export type PetSettings = { isOn: boolean; name: string }

declare module 'claude-code' {
  interface PluginState {
    'terminal-pet': { pet: Pet; settings: PetSettings; beat: number }
  }
}
