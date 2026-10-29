# test-fail-magnet

Keeps failing tests in view. After a test run that Claude starts with its Bash tool, the mod reads the output and opens a Failing tests pane with up to ten failing lines. Fix sends those lines to Claude with "Fix the failing tests and run them again:". Dismiss clears the list. A run with no failing lines clears it too.

**Runners.** The command decides the run. These are read: `npm`, `pnpm` or `yarn test` (also `run test`), `npx jest`, `npx vitest`, `pytest`, `go test` and `cargo test`. The lines picked are jest and vitest lines with ✕, × or FAIL; pytest lines starting with FAILED; Go lines with `--- FAIL:`; and Cargo test lines ending in FAILED. Other runners, such as `swift test`, `rspec`, `mvn test` and `gradle test`, are not recognised, so their runs leave the list alone.

**Use.** Ask Claude to run your tests. The pane opens when the output shows failing test lines. The exit status of the run is not checked. It may wait, undrawn, for a terminal at least 144 columns wide.

**Limits and privacy.** Test output can contain secrets. The mod shows only the matching lines, cut to 160 characters, never raw output. A matching line can still carry a secret, such as an assertion message, and Fix sends those lines to the model. Runs in your own terminal are not seen. Matching is by command text, so `grep "npm test"` counts as a run. Background runs are skipped. A run that fails before any test runs, such as a compile error, prints no matching lines and clears the list.

**Cost.** Detection and the pane make no model calls. Fix sends one normal prompt, which costs tokens like any message.
