# Changelog

## 2026-10-29

### Created
- Marketplace `waraxe-claude-mods` (version 0.1.0), with `.claude-plugin/marketplace.json` and a README with install lines.
- `plugins/collision-guard` 0.1.0, copied from `benai-mods/plugins/collision-guard`.
- `plugins/assumption-check` 0.1.0, copied from `benai-mods/plugins/assumption-check`.
- MIT `LICENSE`, copyright Igor Waraxe.

### Notes
- Both plugins now have `author` and `license` fields, which `benai-mods` copies do not.
- The `benai-mods` copies are unchanged and still installed.
- Not yet pushed to GitHub. The install lines use `<owner>/<repo>` as a placeholder.

## 2026-10-29, later

### Added
- `plugins/today-report` 0.1.0: Today's Report. The pane totals tasks, estimated time saved and value, and tokens in and out, by day, week, month and year. Opens with `/today-report`. Minutes per task and hourly rate are user settings.
- `plugins/today-report/scripts/aggregate.py` reads every `~/.claude/projects/**/*.jsonl` log by streaming, and caches each file's totals in `~/.claude/today-report/cache.json` by path, size and mtime. It prints no prompt or reply text. It stops after 420 seconds and the next run carries on.
- Registered in `.claude-plugin/marketplace.json`. The README lists it.

### Notes
- A task is one typed prompt. Skill text, tool results and slash commands are not counted. Image prompts count.
- Tokens are summed from each request's `usage` once, by its request ID.
- Time saved is an estimate (tasks × minutes per task) and is not measured.
- Checked: 1,770 logs, about 8 GB, aggregated in about 12 s. For the latest day, the task count matched a separate count, except for one image prompt that the separate count left out.
- Not run in a live session.

## 2026-10-29, evening

### Added
- Six mods, each validated and registered in `.claude-plugin/marketplace.json`: `delete-backup`, `test-fail-magnet`, `mod-doctor`, `dictation-fixer`, `time-lapse` and `narrator`, all 0.1.0.
- `teach/`: a course with 43 lessons, one per mod or mod family, an index (`teach/index.html`), an API cheat sheet and a catalogue of all 109 reviewed mods (`teach/reference/`). It also holds the workspace files `MISSION.md`, `RESOURCES.md`, `NOTES.md` and `FAMILIES.md`.
- `teach/reference/engine/`: a local copy of the engine's API types, notes and examples, so the course links survive restarts. It is git-ignored.
- `docs/MODS-FINAL-SYNTHESIS.md`: the review that ranks every mod.
- README rewritten to explain all nine mods, with install lines, costs and needs.

### Fixed after review
- delete-backup follows `cd` across calls, and refuses a command when it cannot tell which files would be deleted. It now also sees an `rm` after `then`, `do` or `else`, treats a `cd` inside a branch as unknown, and refuses a target list cut at 4 MiB. Checked with Node against real bash, 7 cases.
- assumption-check: each finished reply now replaces the list, so guesses from an earlier reply no longer stay on screen.
- dictation-fixer checks only typed (composer) prompts and never changes a message that contains a code fence.
- narrator cuts its 240 characters at a whole word.
- test-fail-magnet recognises only runners whose failures it can read.
- time-lapse writes its log without holding up tool calls.
- README wording corrected for time-lapse (cost, length counting), test-fail-magnet (when the pane opens) and narrator (setting persists).

### Moved here from benai-mods
- The teaching workspace and the synthesis.
- collision-guard and assumption-check are now installed from this marketplace. Their old copies in `benai-mods` went to the Trash, after a check that they were byte-identical to these.
- History from the `benai-mods` changelog on 2026-10-29: installed Secret Box, Aside, Blast Radius and Effort Picker; enabled You Should Know; built collision-guard and assumption-check.

### Notes
- No mod has run in a live session. `claude plugin validate` checks structure and declared calls, not behaviour.
- Course pages link local sources with `file:///` paths, so they work on this Mac only. Cloned sources link to GitHub.
- The nine original course mods stay in `benai-mods`, because they are installed from there and are Ben AI's code.

## 2026-10-29, night: one marketplace, 43 plugins

### Decisions (asked and answered)
- Build working plugins for the lessons that had no code. Ship licensed alternatives where the best version has no licence. Include the MIT GitHub repositories with their licences. Keep 43 lessons.

### Added
- `docs/plugins.json`: the map of all 43 lessons to their plugins, in tier order, with source, author and licence. It is the source of truth.
- 25 plugins copied unchanged from their authors, each with its own LICENSE:
  - Anthropic (Apache-2.0): blast-radius, replay-theater.
  - Nate Herk (MIT): recording-mode.
  - Ray Amjad (MIT): secret-box, prompt-bouncer, diagram-pane, decision-tree, jev-skill-suggestion.
  - Hamza Zafar (MIT): where-am-i, usage-meter, mission-control, next-steps, snake.
  - JohnnyVizz (MIT): savvy-progress, session-band.
  - Others (MIT): reflect-mod, mod-store, aside, cache-tax, ctx-handoff, prompt-queue, human-in-the-loop, prismantis, skins, terminal-browser.
- 9 plugins built here (MIT), each with its lesson rewritten: effort-picker, model-router, spend-guard, heads-up, plain-english, design-picker, daily-challenge, repo-heatmap and terminal-pet.
- 10 lessons rewritten to teach the licensed plugin that now ships: reflect and memory, mods manager, prompt shaping, handoff, screen privacy, session monitor, usage display, work panel, work inventory, and panels and toys. The unlicensed versions stay in their Variants tables as "not shipped".
- In every plugin folder: `INSTRUCTIONS.md` (install, use, remove) and `EXPLANATION.md` (how it works, linked to its lesson). Every folder also has a LICENSE. Our own nine mods got a copy of the MIT licence.
- READMEs for six copied mods that had none (Hamza Zafar's five, and Nate Herk's recording-mode), taken unchanged from their authors' docs and credited.
- `scripts/generate.py`: regenerates the nav, the shipped-plugin boxes, the plugin docs, the marketplace file, `FAMILIES.md`, the index and the README from `docs/plugins.json`.

### Changed
- Lessons renumbered into tier order, 0001 Delete guard to 0043 Panels and toys. Every cross-link was rewritten, and each lesson now has a box naming the plugin it ships and its install line.
- `.claude-plugin/marketplace.json` lists all 43 plugins in tier order, version 1.0.0.
- README rewritten for the internal organization: install from the private repository, the 43 plugins, their needs and credits.
- One line in prompt-bouncer's README now names this marketplace in its configure command (MIT allows the change).
- Removed the upstream maintainers' instructions from two copied plugins: `ctx-handoff/CLAUDE.md`, plus `prismantis/AGENTS.md` and `prismantis/.claude/`. They are development notes for those projects, not part of the plugins. Claude Code would read them as instructions in any session working in this repository. Both plugins still validate.

### Checked
- `claude plugin validate`: the marketplace and all 43 plugins pass.
- All 43 installed and enabled in an isolated test config (`CLAUDE_CONFIG_DIR`). The real Claude setup was not touched.
- All 561 local links in the course resolve. Every lesson's number, nav and shipped plugin agree.
- Secret scan: one hit, in reflect-mod's test file. It is AWS's published example key (`AKIAIOSFODNN7EXAMPLE`), not a real key.
- design-picker's CSS cleaning was reviewed: colours must be hex, declarations that could load or run anything are dropped, and every value is escaped.

### Not done or not verified
- No plugin has run in a live session. Validation checks structure and declared calls, not behaviour.
- Not committed, and no GitHub repository has been created.
- Known limits: model-router also replaces a subagent type's own model; design-picker can hold the choice dialog for up to about 25 seconds; terminal-browser needs Zenbu's app; jev-skill-suggestion needs a TypeSafe Jev key.
