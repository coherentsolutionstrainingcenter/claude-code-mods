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

## 2026-10-30, user-level setup

### Changed (in `~/.claude`, not in this repository)
- prismantis theme set to `github-light` in `~/.claude/settings.json` (`pluginConfigs."prismantis@waraxe-claude-mods".options.theme`). The default dark theme drew dark text on a dark reply fill in the desktop app's light mode.
- Installed `session-band@waraxe-claude-mods` 0.2.0 at user scope, ahead of the rest of tier 6. It brings back an always-on prompt cache countdown above the prompt. That countdown had come from `cache-clock@benai-mods`, which stays installed but disabled; cache-tax shows its row only while `/keepwarm` is armed.
- `settings.json` and `installed_plugins.json` were backed up to the session scratchpad before each change.
- Re-enabled `mods@benai-mods` 0.3.0, the Ben AI Mods pane that lists the mods on this Mac. It had been disabled with the other replaced benai mods, and `/mods` then opened `mod-store@waraxe-claude-mods` instead. Both now register `/mods`. The pane's On/Off switch only works for mods that read its `switches.json` (the benai ones), so waraxe mods are turned on and off with `/plugin`.

### Not verified
- None of these changes has been seen in a new session yet. The mods read their settings when they load.
- Which `/mods` runs, or whether both open, while both plugins are enabled.

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

## 2026-10-30, Prismantis removed

### Removed
- Disabled and uninstalled `prismantis@waraxe-claude-mods` 0.37.1 at user scope, at the user's request. The uninstall also dropped its `enabledPlugins` entry and its `theme: github-light` option from `~/.claude/settings.json`, and its entry from `installed_plugins.json`.

### Notes
- `plugins/prismantis` stays in the repo and in `.claude-plugin/marketplace.json`, so it can be installed again.
- The cached copy in `~/.claude/plugins/cache/waraxe-claude-mods/prismantis/0.37.1` is marked orphaned, and Claude Code removes it later.
- Backups from before the change are in the session scratchpad.

## 2026-10-30, jev-skill-suggestion removed

### Removed
- Disabled and uninstalled `jev-skill-suggestion@waraxe-claude-mods` 0.2.1 at user scope, at the user's request. Its `enabledPlugins` entry and its `installed_plugins.json` entry are gone.
- Deleted `plugins/jev-skill-suggestion` and lesson `teach/lessons/0030-jev-skill-router.html`.
- Removed its entries from `.claude-plugin/marketplace.json`, `docs/plugins.json`, `README.md` (the mods table and the Needs list), `teach/index.html` and `teach/FAMILIES.md`, and its rows from `docs/BANNER-AND-OUTPUT-MODS.md`.
- The marketplace, README and course index now count 42 mods and 42 lessons.

### Changed
- Lesson 0029 now links forward to 0031, and 0031 links back to 0029.

### Notes
- Lesson numbers now skip 0030. The other lessons keep their numbers.
- `docs/MODS-FINAL-SYNTHESIS.md` and `teach/reference/mod-catalogue.html` still name Jev, because they review mods in general, not this marketplace.
- `claude plugin validate .` passes.
- Backups from before the change are in the session scratchpad.

## 2026-10-30, combined banner field list

### Added
- `docs/COMBINED-BANNER-FIELDS.md`: the fields one combined banner will show, status rows only: a session row, a plan row, a summary row and a heads-up line, each field with what it shows, the Claude Code data behind it, when it appears and its priority in a narrow window. It also covers the keep-warm button, the rules the banner follows, and what it leaves out and why.
- Decisions recorded in it: the summary row and heads-up are on; keep-warm is built in, with cache-tax's MIT code as a reference, and cache-tax stays enabled only for its cold-send guard; one press keeps the cache warm for 2 hours; Jev and the REC badge stay in their own mods; the activity row is dropped because mission-control's own row covers it.

### Not changed
- No code written, and no plugin disabled or changed.

## 2026-10-30, status-banner built

### Added
- `plugins/status-banner` 0.1.0: one banner above the prompt, built to the agreed field list in `docs/COMBINED-BANNER-FIELDS.md`. A plan row (5-hour and 7-day usage, the 5-hour reset, the spend limit), a session row right above the prompt (turn, tok/s, turn and session cost, cache countdown with a Keep warm button, context fill), a summary row (goal, next, waiting on you, from one Haiku call per turn) and a heads-up line after long turns. Each field drops in a narrow window by its agreed priority. Icons on the desktop, words and text bars on the terminal.
- Keep warm is built in: one press keeps the cache warm for 2 hours with a `$.model.fork` ping 50 minutes after the last request (on a 1-hour cache) and shows the last ping's cost. It stops when the window ends, on a second press, after three failed pings in a row, when a ping finds the cache already cold, or on `/clear` or compaction.
- Plugin options: `keepWarmHours` (2), `cacheLifetime` (`1h` or `5m`), `summaryRow` (on), `headsUp` (on).
- Kept from the mods it replaces: the 90% plan toast (usage-meter) and the 10 and 5 minute cache warnings (session-band, without its macOS notifier app).
- Registered in `.claude-plugin/marketplace.json` as tier 3.
- Code taken from session-band (JohnnyVizz), usage-meter and where-am-i (Hamza Zafar) and cache-tax (Karan Bansal), all MIT, credited in its README and LICENSE.

### Checked
- `claude plugin test plugins/status-banner`: 18 tests pass, covering each row's fields, a row drawn beneath it, the placeholder left out, the survey, the narrow-window drops, heads-up and its Dismiss, both options that turn rows off, and keep-warm's timing on the mocked clock.
- `claude plugin validate` passes for the plugin and the marketplace, and the type check shows no errors.
- Not yet seen in the desktop app or a terminal session.

### Not changed
- No plugin was disabled, changed or uninstalled. session-band, usage-meter, where-am-i and heads-up stay enabled until the user turns them off.
- `docs/plugins.json` does not list status-banner and it has no lesson, so `scripts/generate.py` would drop it from `.claude-plugin/marketplace.json`. The README's mods table and the marketplace's "42 mods" count do not include it.

### Installed
- `status-banner@waraxe-claude-mods` 0.1.0 installed at user scope, at the user's request. `claude plugin list` shows it enabled and read from `plugins/status-banner`. The only change to `~/.claude/settings.json` is its `enabledPlugins` entry.
- Its 4 options are not set, so the defaults apply: a 2-hour keep-warm window, a 1-hour cache, and the summary row and heads-up on.
- Backups of `settings.json` and `installed_plugins.json` from before the install are in the session scratchpad.

## 2026-10-30, four more bands leave out the placeholder

### Fixed
- mission-control 0.1.8, cache-tax 2.3.2, recording-mode 1.0.1 and reflect-mod 3.3.1 nested Claude Code's own placeholder element (`{ type: 'engine' }`) when no band sat beneath them, and the desktop drops a band that nests it. They stay enabled after the switch to status-banner, so each now leaves the placeholder out. mission-control does it at its `stackBands()` call, so its shared `bands.ts` stays as upstream ships it.
- A test in each draws the placeholder beneath the mod and checks the drawn tree no longer holds it. Each fails on the old code and passes now. recording-mode had no tests: its new file also checks that the REC badge keeps a band drawn beneath it.
- `docs/BANNER-AND-OUTPUT-MODS.md` updated: usage-meter, where-am-i, heads-up and next-steps still nest the placeholder.

### Checked
- `claude plugin test` passes for all four, existing tests included (mission-control 15, cache-tax 161, recording-mode 2, reflect-mod 11). `claude plugin validate` passes, and type checks show no new errors.
- Not yet seen in the desktop app.

## 2026-10-30, status-banner takes session-band's look; session-band uninstalled

### Changed
- `plugins/status-banner` 0.2.0: the plan and session rows now look like session-band's row, one size larger. Figures are bold (the turn number, tok/s, both costs, the cache countdown, context and plan percentages). Fields are spaced by gaps (3 cells wide, fewer when narrow) instead of ` · ` dots. Context fill sits at the row's right end. On the desktop, these rows use the `heading` text size (one step above body), 24px icons (were 16px) and session-band's 80px context bar, colored green, amber from 65%, red from 85%. The terminal has one text size and keeps its words and text bars.
- The summary and heads-up lines stay at body size so they still fit.
- Narrow-window widths now count heading text at about 1.3 cells per character on the desktop, the bigger icons and the gaps, so fields still drop by priority instead of overflowing.
- The README's layout example, field table and "Replacing the old bands" section match.
- Tok/s and cost were already in status-banner (same timing and cost source as session-band). The two showed the same figures twice because session-band was still enabled.

### Removed
- `session-band@waraxe-claude-mods` disabled and uninstalled at user scope, at the user's request. Its code stays in `plugins/session-band` and in the marketplace. Backups of `settings.json` and `installed_plugins.json` from before are in `~/.claude/backups/before-session-band-uninstall-*`.
- Left out of status-banner on purpose: session-band's `×` (it would hide the banner and its Keep warm button for the session) and its warning border.

### Checked
- `claude plugin test plugins/status-banner`: 19 tests pass. A new test checks the bold figures, the `heading` size, the 24px icons, the 80px context bar, the missing dots, and the summary row at body size. It fails on the old code, as do the two updated tests.
- `claude plugin validate` passes, and the type check shows no errors.
- `claude plugin list` shows status-banner enabled and read from `plugins/status-banner`, and session-band gone.
- Not yet seen in the desktop app: the 1.3 cells per character for heading text is an estimate.

### Not changed
- usage-meter and where-am-i stay enabled. Their rows still repeat the plan row and the goal row.

## 2026-10-30, status-banner 0.3.0: the 0.2.0 look reverted, session-band's look at its own size, plan row in two parts

### Reverted
- status-banner 0.2.0 (above) went back to 0.1.0 at the user's request: "definitely worse". Its `heading` text was counted at 1.3 columns a character, so in the user's desktop window (about 70 columns) the banner thought it was narrow. It dropped Turn, tok/s, the turn cost, the reset time and the bars while there was room. The 0.2.0 files are kept in the session scratchpad.

### Changed
- `plugins/status-banner` 0.3.0, session row: session-band's look at session-band's own text size, chosen by the user. Bold figures, 22px icons, gaps instead of ` · ` dots, context fill at the right end with session-band's 80px bar (green, amber from 65%, red from 85%) when wide.
- Plan row: each window gets an equal part of the row, 5-hour left and 7-day right, at the user's request. Each bar is stretched to fill its part: on the desktop at 8 pixels a column (helper-desk's measure), on the terminal a text bar to the cell. Below 6 cells for a bar, the row lists its fields one after another as before.
- Widths are now counted from measurements, not guesses. Desktop text counts about 0.9 of a column per character (measured on session-band's row in the user's screenshot), a Button its label plus 2.5. Before dropping anything, the banner tightens the gaps and shortens Keep warm's label while it is on to `◷ 1h59`. A 72-column desktop band keeps every session field, Keep warm on or off.
- The session row and the plan row each pick the widest stage that fits, and fields of one priority still drop together in both.
- `textBar` takes a cell count.
- README updated: the layout example, the field table and the narrow-window rules.

### Fixed during the work
- Three windows (5h, 7d and spend limit) made each part `33.333333333333336%` wide, which the engine refuses, so nothing was drawn. Parts are now whole percents (`33%`), and a test checks it.

### Disabled
- `usage-meter@waraxe-claude-mods` disabled (not uninstalled) at the user's request: its row repeated the 5-hour and 7-day usage. A backup of `settings.json` from before is in `~/.claude/backups/before-usage-meter-disable-*`.
- where-am-i stays enabled: the user does not see its goal row repeated.

### Checked
- `claude plugin test plugins/status-banner`: 21 tests pass. New tests check session-band's look at body size, every field in a 72-column desktop band with Keep warm on and off, the two stretched plan parts on the desktop (140 and 72 columns) and the terminal, and whole-percent parts for three windows. They fail on 0.1.0.
- `claude plugin validate` passes, and the type check shows no errors.
- Seen in the desktop app after `/reload-plugins`, and the user said "much better". Every session field shows with Keep warm on (`◷ 1h44`). The plan row shows its 5h and 7d parts with stretched bars, and neither usage-meter's nor session-band's row appears.

## 2026-10-30, where-am-i disabled

### Disabled
- `where-am-i@waraxe-claude-mods` disabled (not uninstalled) at the user's request. Its "◆ Goal / now / next" row repeated status-banner's goal row, which stays, and each made its own Haiku call per turn. Its "now:" line is not replaced: mission-control's "Now:" row shows the same. A backup of `settings.json` from before is in `~/.claude/backups/before-where-am-i-disable-*`.
- The status-banner README's "Replacing the old bands" section now lists only heads-up as still to disable.

### Not changed
- heads-up stays enabled. After a long turn, its flags can appear beside status-banner's own heads-up line.

## 2026-10-30, heads-up disabled

### Disabled
- `heads-up@waraxe-claude-mods` disabled (not uninstalled) at the user's request. After a long turn its flags repeated status-banner's heads-up line, and each made its own Haiku call. A backup of `settings.json` from before is in `~/.claude/backups/before-heads-up-disable-*`.
- All four bands status-banner replaces are now off: session-band uninstalled, and usage-meter, where-am-i and heads-up disabled. mission-control and cache-tax stay enabled, as planned.
- The status-banner README's "Replacing the old bands" section now says this.

## 2026-10-30, status-banner's goal label in teal with a diamond

### Changed
- `plugins/status-banner` 0.3.0: the summary row's label is now `◆ Goal: ` in bold theme cyan, which the desktop draws as teal. It is where-am-i's label, at the user's request, now that where-am-i is disabled. The rest of the row is unchanged.
- The countdown test now has a 60-second limit, like the keep-warm tests. It runs 61 minutes of mocked clock in about 2.4 s, with the same time on 0.1.0, and once hit the 5-second default on a busy machine.
- README: the layout example and the summary field's row show the new label.

### Checked
- `claude plugin test plugins/status-banner`: 21 tests pass. The goal-row test now checks the teal `◆ Goal: ` label, and that check fails on the old code. `claude plugin validate` passes, and the type check shows no errors.
- Seen in the desktop app after `/reload-plugins`: the user confirmed the teal `◆ Goal:` looks right. The reload loaded 49 plugins, 2 fewer now that where-am-i and heads-up are disabled.

## 2026-10-30, today-report default hourly rate

### Changed
- `plugins/today-report`: the `hourlyRate` option now defaults to $32 an hour instead of $50, as the user set it. The version is unchanged. It changes the value estimate for anyone who has not set the option.
