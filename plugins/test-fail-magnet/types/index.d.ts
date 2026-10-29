/** The failing-test lines the last test run printed: at most ten, each cut to 160 characters. */
export type Failing = string[]

declare module 'claude-code' {
  interface PluginState {
    'test-fail-magnet': { failing: Failing }
  }
}
