# Banner and chat-output mods

Every plugin in this repository that changes the banner above the prompt or the output in the chat. This is the starting point for one combined banner. Nothing listed here has been disabled or changed for this list.

- **Read on:** 2026-10-30, from each plugin's `claude plugin validate` report and its hook source. All 43 plugins were checked. jev-skill-suggestion has since been removed from the repository.
- **On now:** from `~/.claude/settings.json`. "Not installed" means the plugin has no entry there.
- **Draws on:** Claude Code raises the banner on the terminal and the desktop app only, not in VS Code or on mobile.
- **Left out:** side panes (the panels you switch between). They stay as they are.

| | Count | On now |
|---|---|---|
| Banner above the prompt | 18 | 14 |
| Redraw the chat | 5 | 3 |
| Change what Claude writes | 8 | 7 |
| Add lines to the chat | 6 | 5 |

Some plugins appear in more than one list.

## 1. Banner above the prompt

| Mod | Shows | When it appears | Draws on | Data it uses | On now | Author · licence · upstream |
|---|---|---|---|---|---|---|
| session-band | Turn number, output speed (tok/s), last-turn and session cost, 1-hour prompt cache countdown, context fill. Amber frame 20 min before the cache expires, red at 10. | After the first answer in a chat. `×` or `/session_data` hides it. | terminal, desktop (icons on desktop) | Turn start and end; streamed reply chunks (`turn.step`) for speed; `$.session.usage` for cost; clock for the countdown; session files for context fill | on | JohnnyVizz · MIT · [JohnnyVizz/claude-kit](https://github.com/JohnnyVizz/claude-kit) |
| usage-meter | 5-hour and 7-day plan usage as small bars, the 5-hour reset time, session cost | Whenever Claude Code has a usage reading | terminal, desktop | `session.measure` (rate limits, cost); `$.session.usage`; clock | on | Hamza Zafar · MIT · [hamzafer/claude-code-mods](https://github.com/hamzafer/claude-code-mods) |
| where-am-i | Session goal, what Claude is doing now, what comes next, what waits on you | After the first turn, refreshed after each turn | terminal, desktop | Prompts, tool calls, turn start and end, the transcript, one Haiku call per turn | on | Hamza Zafar · MIT · [hamzafer/claude-code-mods](https://github.com/hamzafer/claude-code-mods) |
| mission-control | One summary line of the turn's tool calls, agents and files | While Claude works, and 30 s after a turn | terminal, desktop | Tool calls, agent spawns, turn start and end, clock | on | Hamza Zafar · MIT · [hamzafer/claude-code-mods](https://github.com/hamzafer/claude-code-mods) |
| heads-up | Up to two things you might miss after a long turn (a failed tool call, extra files changed, no test run, a risky step), with Dismiss | After a long turn, only when it finds something | terminal, desktop | Tool calls and results, turn start and end, one model call | on | Igor Waraxe · MIT · built here |
| replay-theater | "Replay: N edits" with a Replay button; the replay view itself when no pane fits | After a turn that edited files | terminal, desktop | Edit, Write and MultiEdit calls, turn start and end, file reads | on | Anthropic (Claude Code DevRel) · Apache-2.0 · [claude-code-playground](https://github.com/anthropics/claude-code-playground/tree/main/claude-code/mods) |
| blast-radius | A card for a held risky command (rm, git reset/clean, force push, migrations) with Proceed and Cancel | Only while it holds a command and no pane fits | terminal, desktop | Bash calls, git and shell measurements, the session folder | on | Anthropic (Claude Code DevRel) · Apache-2.0 · [claude-code-playground](https://github.com/anthropics/claude-code-playground/tree/main/claude-code/mods) |
| cache-tax | Keep-warm row: warm or cold, time left, next ping | Only while `/keepwarm` is on | terminal, desktop (icon on desktop) | Streamed requests and cache tokens (`turn.step`), turn end, `$.session.usage`, background pings (`$.model.fork`), clock, theme | on | karanb192 · MIT · [karanb192/cache-tax](https://github.com/karanb192/cache-tax) |
| ctx-handoff | Its notes and handoff panel | Only while you open the panel | terminal, desktop | Prompts, tool calls, streamed turns, the transcript, model calls for summaries, its notes files | on | cablate · MIT · [cablate/ctx-handoff-mod](https://github.com/cablate/ctx-handoff-mod) |
| reflect-mod | A correction to save as a CLAUDE.md rule, with buttons | After you correct Claude | terminal, desktop | Prompts, turn end, the transcript, one model call, CLAUDE.md files | on | Bayram Annakov · MIT · [BayramAnnakov/claude-reflect](https://github.com/BayramAnnakov/claude-reflect) |
| prompt-queue | The prompts you queued, with buttons | While prompts are queued | terminal only | Prompts, tool calls, turn start and end, the prompt box | on | galElmalah · MIT · [galElmalah/claude-mods](https://github.com/galElmalah/claude-mods) |
| recording-mode | A "● REC" badge | While `/rec` is on | terminal, desktop (SVG badge on desktop) | Prompts, tool calls, `.env` files, clock | on | Nate Herk · MIT · [nateherkai/claude-code-mods](https://github.com/nateherkai/claude-code-mods) |
| secret-box | The masked box where you paste a secret | Only when Claude asks for a secret and no pane fits | terminal, desktop | Its `request_secret` tool, `.env`, tool calls | on | Ray Amjad · MIT · [ray-amjad/claude-code-mods](https://github.com/ray-amjad/claude-code-mods) |
| next-steps | Two or three suggested next prompts, picked with digit keys | After each turn, while the prompt box is empty | terminal, desktop | Prompt edits, prompts, turn start and end, the transcript, one model call | not installed | Hamza Zafar · MIT · [hamzafer/claude-code-mods](https://github.com/hamzafer/claude-code-mods) |
| savvy-progress | A progress bar for a multi-step flow | While a flow Claude reports is running | terminal, desktop | Tool calls, agent spawns, streamed turns, its own progress tool | not installed | JohnnyVizz · MIT · [JohnnyVizz/claude-kit](https://github.com/JohnnyVizz/claude-kit) |
| skins | A live usage band: 5-hour and 7-day meters, optional countdowns | Whenever a skin is active | terminal, desktop | `session.measure`, `$.session.usage`, clock | not installed | hellosverre · MIT · [hellosverre/claude-skins](https://github.com/hellosverre/claude-skins) |
| terminal-pet | A small pet that eats the files Claude reads | While `/pet on` | terminal, desktop | Read calls, turn end, clock | not installed | Igor Waraxe · MIT · built here |

human-in-the-loop also hooks the banner, but only to read whether a turn is running. It draws nothing there.

## 2. Chat output

### 2a. Redraw the chat

| Mod | What it redraws | When | Draws on | Data it uses | On now | Author · licence · upstream |
|---|---|---|---|---|---|---|
| prismantis | Replies (colored markdown, tables, Mermaid charts, `figure` pictures), your messages, tool calls and results, tool groups, command output, notices, turn duration | Always | terminal, desktop (maths and some link features on the terminal only) | The transcript, its theme setting | on | NahumLitvin · MIT · [NahumLitvin/prismantis](https://github.com/NahumLitvin/prismantis) |
| recording-mode | Masks API keys, `.env` values and personal data in your messages, tool calls and tool results; marks the session mode | While `/rec` is on | terminal, desktop | `.env` files, its masking rules | on | Nate Herk · MIT · [nateherkai/claude-code-mods](https://github.com/nateherkai/claude-code-mods) |
| human-in-the-loop | Draws its own task tool calls as task cards | When Claude hands you a task | terminal, desktop | Its task store | on | tzafrir · MIT · [tzafrir/human-in-the-loop](https://github.com/tzafrir/human-in-the-loop) |
| skins | Replies, tool rows with icons and timings, edits as diff cards, your messages, the spinner, the question dialog, command output, turn duration | While a skin is active | terminal, desktop | The transcript, usage, its skin files | not installed | hellosverre · MIT · [hellosverre/claude-skins](https://github.com/hellosverre/claude-skins) |
| snake | The spinner becomes Snake (or reels) while Claude works | After `/snake` or `/reels` | terminal, desktop | Turn start and end | not installed | Hamza Zafar · MIT · [hamzafer/claude-code-mods](https://github.com/hamzafer/claude-code-mods) |

prismantis and skins both redraw replies and tool rows, so only one of them should be on.

### 2b. Change what Claude writes

These add to or change Claude's instructions, so they change the replies themselves, not how they are drawn.

| Mod | What it changes | When | On now | Author · licence |
|---|---|---|---|---|
| prismantis | Adds drawing guidance to each prompt: use tables, Mermaid charts and `figure` blocks | Each prompt | on | NahumLitvin · MIT |
| human-in-the-loop | Adds a system-prompt section on handing tasks to you, and a digest of your answers to the next prompt | Always; the digest after you answer | on | tzafrir · MIT |
| reflect-mod | Adds "rules the user saved this session" to the system prompt | After you save a rule | on | Bayram Annakov · MIT |
| ctx-handoff | Adds this workspace's notes and last progress at the start of each chat | Each new chat | on | cablate · MIT |
| recording-mode | Adds a note telling Claude to leave out names, amounts and other private data | While `/rec` is on | on | Nate Herk · MIT |
| secret-box | Replaces secrets with placeholders in what Claude reads: context, attachments and tool output | Always | on | Ray Amjad · MIT |
| skins | Adds chart and diagram hints to the system prompt | While its charts and hints are on | not installed | hellosverre · MIT |

### 2c. Add lines to the chat

Dim notice lines in the transcript, in normal use. Other plugins write such lines only when something fails.

| Mod | Lines it adds | On now |
|---|---|---|
| cache-tax | Cold-cache warnings and what a cold write cost | on |
| ctx-handoff | A handoff was saved or failed | on |
| effort-picker | One line when it changes a request's effort | on |
| prompt-queue | A queued prompt went into the running turn | on |
| secret-box | Notices about secrets it stored or masked | on |
| model-router | Which model a subagent runs on | not installed |

## 3. Near the prompt, not the banner

For reference, since the combined banner may take some of this over:

- **Status line under the prompt:** ctx-handoff ("N more messages until notes update"), cache-tax, human-in-the-loop, plain-english ("Plain English on"), prompt-bouncer.
- **Session mode label:** recording-mode.

## 4. Other marketplaces

Enabled now and outside this repository, one more plugin touches the banner:

- **helper-desk@benai-mods:** the task bar above the prompt ("Tasks 2/4", "Now: …"), plus a system-prompt section that tells Claude to keep its plan with helper-desk's tool.

## 5. Notes for the combined banner

**The rule that keeps bands together.** Each band hook must call `next(e)` once and keep what it returns. Five mods broke this and were fixed in commit `12a9397`: replay-theater, session-band, blast-radius, prompt-queue and terminal-pet. One still breaks it: secret-box, but only while its secret box is drawn in the band. mod-doctor flags this case.

**Claude Code's own placeholder.** When no band sits beneath a hook, `next(e)` returns Claude Code's placeholder element (`{ type: 'engine' }`). A comment in savvy-progress says the desktop drops a band that nests it. savvy-progress, helper-desk and the five mods fixed in `12a9397` now leave it out (fixed the same day, after this list was first written). The other band mods still nest it: usage-meter, where-am-i, heads-up, mission-control, cache-tax, recording-mode, reflect-mod and next-steps. While one of them is the lowest band that draws, for example at the start of a chat before session-band shows, the desktop may still drop the banner. The test kit accepts the nested placeholder, so only the app can confirm this.

**Data Claude Code provides**, from what these mods read:

- Plan usage and reset times: `session.measure`, `$.session.usage`
- Cost: `$.session.usage`
- Output speed: streamed reply chunks in `turn.step`
- Turns, tool calls and results, agent spawns: `turn.start`, `turn.complete`, `tool.call`, `agent.spawn`
- The transcript: `$.session.messages`
- The draft prompt: `prompt.edit`
- Summaries: `$.model.complete` (a small model call per turn)
- Time and countdowns: `$.clock`

**What a combined mod costs.** A combined banner is our code to build and maintain. The plugins it replaces stop bringing their upstream fixes. The upstreams behind the banner mods are:

- JohnnyVizz/claude-kit (session-band, savvy-progress)
- hamzafer/claude-code-mods (usage-meter, where-am-i, mission-control, next-steps)
- karanb192/cache-tax
- ray-amjad/claude-code-mods (secret-box)
- anthropics/claude-code-playground (replay-theater, blast-radius)
- cablate/ctx-handoff-mod
- BayramAnnakov/claude-reflect
- galElmalah/claude-mods
- nateherkai/claude-code-mods
- hellosverre/claude-skins

heads-up and terminal-pet were built here.
