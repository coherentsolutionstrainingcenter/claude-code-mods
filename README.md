# waraxe-claude-mods

Our internal Claude Code marketplace: 42 mods you can install, and a course that explains how each one is built. Shared inside our GitHub organization only.

The repository is [coherentsolutionstrainingcenter/claude-code-mods](https://github.com/coherentsolutionstrainingcenter/claude-code-mods). The marketplace inside it is named `waraxe-claude-mods`, so you add the repository once and then install each mod as `<plugin>@waraxe-claude-mods`.

- **Mods:** `plugins/`, one folder per mod. Each holds a README, a LICENSE, `INSTRUCTIONS.md` (install and use) and `EXPLANATION.md` (how it works, with a link to its lesson).
- **Course:** open `teach/index.html`. There are 42 lessons, one per mod, ordered by tier so the most useful mods come first.
- **Review:** `docs/MODS-FINAL-SYNTHESIS.md` ranks the 109 mods found in the videos and guides. `docs/plugins.json` maps every lesson to its plugin and source.

## Install

The repository is private to the organization. Members need read access and git credentials on their machine (`gh auth login`, or an SSH key).

```bash
claude plugin marketplace add coherentsolutionstrainingcenter/claude-code-mods
claude plugin install <plugin>@waraxe-claude-mods
```

Then open a new chat. Mods need Claude Code 2.1.287 or later, with mods turned on for your account. To update: `claude plugin marketplace update waraxe-claude-mods`, then `claude plugin update <plugin>@waraxe-claude-mods`.

**"Repository not found"?** Git is using a GitHub account outside the organization. GitHub answers "not found" for a private repository you can't see. Run `gh auth status` to see your accounts, then `gh auth switch --user <your organization account>` and add the marketplace again.

## The 42 mods, in tier order

| No. | Plugin | What it does | Tier | Author | Licence | Lesson |
|---|---|---|---|---|---|---|
| 0001 | `blast-radius` | Holds risky shell commands (rm -rf, git reset --hard, git clean, force push, migrations) and shows what they would change, with Proceed and Cancel buttons. | 1 | Anthropic (Claude Code DevRel) | Apache-2.0 | [Delete guard](teach/lessons/0001-delete-guard.html) |
| 0002 | `delete-backup` | Copies the files an rm is about to delete into a backup folder first, so /undo-delete can put the newest deletion back | 1 | Igor Waraxe | MIT | [Delete backup](teach/lessons/0002-delete-backup.html) |
| 0003 | `reflect-mod` | claude-reflect as a Claude Code mod: a model check on each short prompt finds reusable corrections (any language); a band above the prompt saves them to CLAUDE.md on one press | 1 | Bayram Annakov | MIT | [Reflect and memory](teach/lessons/0003-reflect-and-memory.html) |
| 0004 | `mod-store` | /mods: browse, search and install community Claude Code mods from a pane, with what each one can access shown before you install | 1 | hellosverre | MIT | [Mods manager](teach/lessons/0004-mods-manager.html) |
| 0005 | `mod-doctor` | Mod doctor audits your installed mods with the plugin validator and flags failed checks, shared tool.call hooks and duplicate names | 1 | Igor Waraxe | MIT | [Mod doctor](teach/lessons/0005-mod-doctor.html) |
| 0006 | `effort-picker` | Picks the reasoning effort for each message you send, for that message only, from its words, and never switches the model | 2 | Igor Waraxe | MIT | [Effort picker](teach/lessons/0006-effort-picker.html) |
| 0007 | `assumption-check` | After a reply, lists the small guesses Claude made. Mark each Right or Wrong, and send the wrong ones back to Claude | 2 | Igor Waraxe | MIT | [Assumption check](teach/lessons/0007-assumption-check.html) |
| 0008 | `secret-box` | Claude can use a secret without seeing it: a masked box saves keys to .env and gives Claude a placeholder, every key a tool prints comes back as a placeholder, and committing .env is refused | 2 | Ray Amjad | MIT | [Secret handling](teach/lessons/0008-secret-handling.html) |
| 0009 | `aside` | Read-only side chat: /aside opens a pane beside the transcript where you ask about the session so far; answers come from a tool-less fork of the session's own transcript and nothing is written back into the main thread. | 2 | JayDoubleu | MIT | [Side questions](teach/lessons/0009-side-questions.html) |
| 0010 | `prompt-bouncer` | Bounces vague prompts before Claude sees them, and suggests the project's own term | 2 | Ray Amjad | MIT | [Prompt shaping](teach/lessons/0010-prompt-shaping.html) |
| 0011 | `dictation-fixer` | Tidies long messages that look dictated, then asks whether to send the cleaned version or the text as typed | 2 | Igor Waraxe | MIT | [Dictation fixer](teach/lessons/0011-dictation-fixer.html) |
| 0012 | `cache-tax` | A Claude Code mod that keeps the one-hour prompt cache warm during breaks and stops a cold send once with its estimated rewrite cost. Warming uses model requests and costs tokens. Requires Claude Code 2.1.287+. | 2 | karanb192 | MIT | [Cache guard](teach/lessons/0012-cache-guard.html) |
| 0013 | `ctx-handoff` | Turns what you teach Claude into project notes, catches its usual slips, keeps the cache warm while you're away, and picks long sessions back up | 2 | cablate | MIT | [Handoff](teach/lessons/0013-handoff.html) |
| 0014 | `replay-theater` | Replay Theater: step through the file edits Claude made in the last turn, one diff at a time. | 2 | Anthropic (Claude Code DevRel) | Apache-2.0 | [Replay](teach/lessons/0014-replay.html) |
| 0015 | `recording-mode` | /rec before you record: masks keys, personal details, and business figures on screen and keeps private files closed (/rec strict, /rec off, /rec config) | 2 | Nate Herk | MIT | [Screen privacy](teach/lessons/0015-screen-privacy.html) |
| 0016 | `collision-guard` | Asks before Edit or Write changes a file that another chat edited in the last 30 minutes, with Proceed and Cancel | 3 | Igor Waraxe | MIT | [Collision guard](teach/lessons/0016-collision-guard.html) |
| 0017 | `where-am-i` | A live recap above the prompt: goal, doing now, waiting on you, next. /where for a longer one. | 3 | Hamza Zafar | MIT | [Session monitor](teach/lessons/0017-session-monitor.html) |
| 0018 | `usage-meter` | Your plan's 5-hour and 7-day usage as small bars above the prompt, with the reset countdown and the session's cost. | 3 | Hamza Zafar | MIT | [Usage display](teach/lessons/0018-usage-display.html) |
| 0019 | `savvy-progress` | Progress bar above the prompt for /savvy-flow, plus an agents panel (/agents-info): running, finished and planned subagents with model, task progress, context, cost and time. | 3 | JohnnyVizz | MIT | [Work panel](teach/lessons/0019-work-panel.html) |
| 0020 | `mission-control` | /mission opens a live map of the main agent, its subagents and every tool call, plus a code map of the files they touch. | 3 | Hamza Zafar | MIT | [Work inventory](teach/lessons/0020-work-inventory.html) |
| 0021 | `test-fail-magnet` | Keeps the failing tests from your last test run in a Failing tests pane, with Fix to send them to Claude and Dismiss to clear them | 3 | Igor Waraxe | MIT | [Test-fail magnet](teach/lessons/0021-test-fail-magnet.html) |
| 0022 | `prompt-queue` | A prompt typed while Claude is working is held in a stack above the prompt instead of landing in the running turn, and sent once the turn ends. Reorder the stack, edit a row in place, send one first, remove one, flush the lot. Needs function hooks (early access) and an interactive terminal. | 3 | galElmalah | MIT | [Park and queue](teach/lessons/0022-park-and-queue.html) |
| 0023 | `spend-guard` | Asks Proceed or Cancel, with a short checklist, before a command or MCP tool that costs money or publishes runs | 3 | Igor Waraxe | MIT | [Spend and publish guard](teach/lessons/0023-spend-and-publish-guard.html) |
| 0024 | `heads-up` | After a long turn, one Haiku call flags up to two things you might miss, in a band above the prompt. Off until /heads-up on | 3 | Igor Waraxe | MIT | [You Should Know](teach/lessons/0024-you-should-know.html) |
| 0025 | `human-in-the-loop` | Claude assigns you the tasks only you can do. They wait in a My tasks pane, counted under the prompt, until you answer or reject them, so nothing Claude needs from you gets lost in the chat. | 3 | tzafrir | MIT | [Human in the loop](teach/lessons/0025-human-in-the-loop.html) |
| 0026 | `diagram-pane` | A side pane that pins every diagram Claude draws, keeps a live map of the work, and lets you go into boxes and change them | 3 | Ray Amjad | MIT | [Diagram pane](teach/lessons/0026-diagram-pane.html) |
| 0027 | `decision-tree` | When Claude ends a reply with a question, explains the choice in a side pane and lets you explore any option, or your own, in a real forked session | 4 | Ray Amjad | MIT | [Decision tree](teach/lessons/0027-decision-tree.html) |
| 0028 | `plain-english` | While on, rewrites each long reply in plain language with a short Next steps list, in a side pane, and leaves Claude's reply unchanged | 4 | Igor Waraxe | MIT | [Plain English](teach/lessons/0028-plain-english.html) |
| 0029 | `prismantis` | Colorful, themeable rendering for Claude Code replies: tables, headings, code, numbers, paths and links. | 4 | NahumLitvin | MIT | [Prismantis](teach/lessons/0029-prismantis.html) |
| 0031 | `terminal-browser` | A browser running directly inside claude code. Preview websites, view HTML documents, and let your agent control the built in browser. | 4 | Zenbu Labs | MIT | [Terminal browser](teach/lessons/0031-terminal-browser.html) |
| 0032 | `today-report` | Today's Report: totals your Claude Code tasks, the time they would have taken you, and tokens by day, week, month and year, from your session logs | 4 | Igor Waraxe | MIT | [Today's report](teach/lessons/0032-today-report.html) |
| 0033 | `skins` | Skins for Claude Code: tool rows that open onto their input and answer, highlighted code, diff, table, math, Mermaid and shell cards, links, folding, a usage band, a calm mode and fifteen themes. /skin swaps them live. | 5 | hellosverre | MIT | [Claude Skins](teach/lessons/0033-claude-skins.html) |
| 0034 | `next-steps` | After each turn, 2 or 3 likely next prompts above the prompt. Press 1, 2 or 3 in an empty prompt to draft one, 0 to dismiss. | 5 | Hamza Zafar | MIT | [Next steps](teach/lessons/0034-next-steps.html) |
| 0035 | `repo-heatmap` | A /heatmap pane that counts this repository's tracked files by top-level folder and kind, from git ls-files, as rows of colored bars | 5 | Igor Waraxe | MIT | [Repo heatmap](teach/lessons/0035-repo-heatmap.html) |
| 0036 | `design-picker` | When Claude asks you to choose a design style, opens a page in your browser that shows each option as a styled card, then shows the normal question | 5 | Igor Waraxe | MIT | [Design picker](teach/lessons/0036-design-picker.html) |
| 0037 | `daily-challenge` | One small Claude Code challenge each day in a /challenge pane, with Coach me, Done and Skip buttons and a streak | 5 | Igor Waraxe | MIT | [Daily challenge](teach/lessons/0037-daily-challenge.html) |
| 0038 | `model-router` | Picks haiku, sonnet or opus for each subagent Claude starts without naming a model, from one small Haiku call, and never changes the main chat's model | 5 | Igor Waraxe | MIT | [Model router](teach/lessons/0038-model-router.html) |
| 0039 | `narrator` | Reads the last 240 characters of each finished reply aloud with macOS say, off by default and switched with /narrator on and /narrator off | 5 | Igor Waraxe | MIT | [Narrator](teach/lessons/0039-narrator.html) |
| 0040 | `time-lapse` | Time-lapse: records your session's prompts, tool calls and turn times, and replays them as an animated HTML page | 5 | Igor Waraxe | MIT | [Time-lapse](teach/lessons/0040-time-lapse.html) |
| 0041 | `terminal-pet` | A small text pet in the band above the prompt that eats the files Claude reads, with /pet on, /pet off and /pet name | 6 | Igor Waraxe | MIT | [Cosmetic mods](teach/lessons/0041-cosmetic-mods.html) |
| 0042 | `snake` | Snake in a pane while Claude works, paused when it's done. Opt-in, so nothing opens until /snake. | 6 | Hamza Zafar | MIT | [Games and waiting](teach/lessons/0042-games-and-waiting.html) |
| 0043 | `session-band` | Band above the prompt: turn number, output speed, turn and session cost, prompt cache countdown and context fill; notifies before the cache expires. | 6 | JohnnyVizz | MIT | [Panels and toys](teach/lessons/0043-panels-and-toys.html) |

## Needs beyond Claude Code

- `mod-doctor` needs the claude command on the PATH.
- `terminal-browser` needs the terminal-browser app from Zenbu Labs.
- `today-report` needs python3.
- `repo-heatmap` needs git.
- `narrator` needs macOS (say).

## Where the mods come from

- **Built here** (MIT, Igor Waraxe): 18 mods, including 9 built from descriptions in the videos.
- **Copied with their licences**, unchanged, from their authors' repositories. Each folder keeps its LICENSE:
- Anthropic (Claude Code DevRel): https://github.com/anthropics/claude-code-playground/tree/main/claude-code/mods
- Bayram Annakov: https://github.com/BayramAnnakov/claude-reflect
- Hamza Zafar: https://github.com/hamzafer/claude-code-mods
- JayDoubleu: https://github.com/JayDoubleu/aside
- JohnnyVizz: https://github.com/JohnnyVizz/claude-kit
- NahumLitvin: https://github.com/NahumLitvin/prismantis
- Nate Herk: https://github.com/nateherkai/claude-code-mods
- Ray Amjad: https://github.com/ray-amjad/claude-code-mods
- Zenbu Labs: https://github.com/zenbu-labs/terminal-browser
- cablate: https://github.com/cablate/ctx-handoff-mod
- galElmalah: https://github.com/galElmalah/claude-mods
- hellosverre: https://github.com/hellosverre/claude-skins
- hellosverre: https://github.com/hellosverre/mod-store
- karanb192: https://github.com/karanb192/cache-tax
- tzafrir: https://github.com/tzafrir/human-in-the-loop

The review also used five local folders: `benai-mods` (Ben AI), `claude-code-playground-mods` (Anthropic), `claude-mods-starter-pack` (RocketLauncher), `nateherk-claude-code-mods` (Nate Herk) and `wearenocode-claude-mods` (WeAreNoCode). Mods with no licence, from Ben AI, WeAreNoCode, the starter pack and the Pokémon mod, are not copied. Their lessons teach a licensed or newly built mod instead, and keep the unlicensed one as a variant.

## Safety

Mods run with your permissions and are not sandboxed. Read a mod's code, or run `claude plugin validate plugins/<plugin>`, before you install it. Every mod here passes validation. Validation checks structure and the declared calls, not behaviour.

## License

Each mod has its own licence in its folder. Everything else in this repository is MIT. See [LICENSE](LICENSE).
