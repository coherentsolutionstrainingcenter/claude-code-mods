# Claude Code mods: resources

## Knowledge

- [Plugin API types, Claude Code build 2.1.308](reference/engine/types/claude-code.d.ts)
  The engine's own type file for the hook API: every event, every `$` noun, and every element. Use for: checking what an event carries and what a call returns. Grep it by name; it is about 22,000 lines.
- [Plugin authoring reference](reference/engine/reference.md)
  The long form of the hook model, with `$.state` contracts, `userConfig` and testing. Use for: how a mod is laid out and loaded.
- [Plugin authoring examples](reference/engine/examples/)
  Short complete modules: a tool-call guard, a pane, a band, and a test. Use for: the smallest working shape of each pattern.
- [Aside investigation notes](https://github.com/JayDoubleu/aside/tree/main/docs/investigation)
  Measured answers to how mods behave: what a fork costs, and what the engine hides from the model. Use for: cost and visibility questions.
- Plugin manifests and CLI: `claude plugin --help`, `claude plugin validate <folder>`.
  The validator prints the events a mod hooks and the calls it makes. Use for: checking any mod before install.

## Wisdom (Communities)

- Local: none recorded yet. Add one here if you start sharing the marketplace and want feedback.

## Gaps

- No official web documentation was confirmed for the mod marketplace format. The local type file and the CLI are the sources of truth until one is found.
- No public source exists for Assumption Check or Collision Guard, which we built from their descriptions.
