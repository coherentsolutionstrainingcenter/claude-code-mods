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

## 2026-10-29, sharing

### Changed
- `.gitignore` now ignores `logs/`, where local tool-call hooks write their logs.
- Shared as the internal repo `coherentsolutionstrainingcenter/claude-code-mods`. Forking is off and `main` needs one approving review.
- Install lines now name the real repository. You add it once with `claude plugin marketplace add coherentsolutionstrainingcenter/claude-code-mods`, then install each mod as `<plugin>@waraxe-claude-mods` (the marketplace name). Updated in the README, every `INSTRUCTIONS.md`, our own READMEs and all lessons. Each lesson's "In this marketplace" box now has both lines. `scripts/generate.py` holds the path in one `REPO` constant.
- Removed 22 lesson sentences that said the repository path was not known yet.
- README: a "Repository not found" note. GitHub gives that answer for a private repository when git uses an account outside the organization.

### Checked
- Added the marketplace from GitHub and installed all 43 mods in an isolated config (`CLAUDE_CONFIG_DIR`), using the organization account: 43 installed and enabled. With the personal account active, GitHub answers "repository not found".
- `claude plugin validate`: the marketplace and all 43 plugins pass. All local links in the course resolve.

## 2026-10-30, today-report chart

### Changed
- `plugins/today-report` 0.2.0: the pane now draws a chart of tasks per day, week, month or year. Each column is stacked by task type (code changes, commands, research, delegated, conversation), oldest period on the left. Hovering a column or a segment shows its tasks, hours and value. The rows with the exact numbers stay below the chart.
- The terminal cannot draw an `Svg`, so there the pane shows one line of block-character bars instead.
- The colors are the first five slots of the dataviz reference palette, in light and dark versions. Its validator passes both modes. Three light colors are under 3:1 contrast, so the legend and the rows carry the numbers. Labels and gridlines are one mid gray, because the chart is drawn as an image whose color scheme may not match the pane's.
- Version 0.2.0 in `plugin.json` and `.claude-plugin/marketplace.json`.

### Added
- `plugins/today-report/hooks/register.test.tsx`: draws the pane from a two-day report on desktop, vscode, mobile and terminal.

### Checked
- `claude plugin validate` and `claude plugin test` (1 test) pass.
- The chart, drawn from the real logs (109 days) in headless Chrome on a white and a dark background, for all four periods.
- Type check: no errors in the new code. Three earlier errors remain in `refresh()`, where `status: 'reading'` and the like widen to `string` in the `update` calls.

### Not verified
- Not yet seen in the desktop app's pane.

## 2026-10-30, bands that hide other bands

### Fixed
- `plugins/replay-theater` 0.1.1: after a turn with edits, its "Replay: N edits" row replaced every band drawn beneath it, so the usage-meter, session-band and other rows vanished. The row now sits above what the hooks beneath drew. The in-band replay view, used only when no pane fits, still takes the band while it is open.

### Added
- `plugins/mod-doctor` 0.2.0 flags a band above the prompt that draws its own row without keeping the rows beneath it. It reads each band hook's source: a hook that returns its own tree and calls `next` only as `return next(e)` is flagged. A hook written some other way can slip past it.
- Tests: `plugins/replay-theater/hooks/replay-theater.test.ts` (fails on the old hook, passes on the new one) and `plugins/mod-doctor/hooks/register.test.ts` (4 cases).

### Fixed after the check
- The new check flagged four more mods that hid the bands beneath them while their own row showed. Each now keeps those rows: `session-band` 0.2.1 and `prompt-queue` 0.4.5 (terminal only) draw them above their own row, which stays right above the prompt; `blast-radius` 0.1.1 draws its held-command card above them; `terminal-pet` 0.1.1 draws them above the pet.
- A test for each: it draws another band beneath the mod and checks both rows show. Each test fails on the old hook and passes on the new one.
- The scan now flags no mod in this repo or in `benai-mods`.
- `prompt-queue`'s existing `tests/e2e` file still does not load under `claude plugin test` (it imports `bun:test`). That was so before.

### Checked
- `claude plugin validate` and `claude plugin test` pass for all six mods. Type checks show no new errors: mod-doctor keeps its 10, session-band its 4, prompt-queue and terminal-pet have none.
- Not yet seen in a live session.

## 2026-10-30, banner and chat-output list

### Added
- `docs/BANNER-AND-OUTPUT-MODS.md`: every plugin in this repository that draws the banner above the prompt (18), redraws the chat (5), changes what Claude writes (8) or adds lines to the chat (6). For each: what it shows, when, where it draws, the data it reads, whether it is on now, and its author, licence and upstream. A note covers helper-desk from benai-mods.

### Found
- secret-box still hides the bands beneath it while its secret box is drawn in the band. Not changed.
- savvy-progress notes that the desktop drops a band that nests Claude Code's placeholder element. The five band fixes in `12a9397` nest it when nothing sits beneath them, so the banner may vanish on the desktop. Not verified in the app, not changed.

### Not changed
- No plugin was disabled, changed or built for this list.

## 2026-10-30, band fixes leave out the placeholder

### Fixed
- The five band fixes from `12a9397` nested Claude Code's own placeholder element (`{ type: 'engine' }`) when no band sat beneath them. savvy-progress notes that the desktop drops a band that nests it, which could hide the whole banner. Each now leaves the placeholder out, as savvy-progress and helper-desk do: replay-theater 0.1.2, session-band 0.2.2, blast-radius 0.1.2, prompt-queue 0.4.6, terminal-pet 0.1.2.
- A second test in each mod draws the placeholder beneath it and checks that the drawn tree no longer holds it. Each fails on the `12a9397` code and passes now.
- `docs/BANNER-AND-OUTPUT-MODS.md` updated to match.

### Still open
- usage-meter, where-am-i, heads-up, mission-control, cache-tax, recording-mode, reflect-mod and next-steps still nest the placeholder. While one of them is the lowest band that draws, the desktop may drop the banner. Not changed.

### Checked
- `claude plugin test` passes for all five (prompt-queue's old `tests/e2e` file still does not load), `claude plugin validate` passes, and type checks show no new errors.
- Not yet seen in the desktop app.
