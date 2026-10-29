# Claude Code mods: final synthesis

This closes the review of every video and guide in the clippings and course folders, plus the WeAreNoCode folder. Grades are preliminary: they come from transcripts and READMEs, and nothing was tested on this machine. Numbers match the working table. Where a video's mod was described but not built, it appears in section 4, not in the ranking.

## 1. Built mods, ranked

Each family is ranked by its best version. Within a family, variants are ordered by how much real value they add.

### Tier 1 (grade 8)

**1. Delete guard (21, Blast Radius).** Grade 8.
Order: 21 (shows the exact files, proceed or cancel; Anthropic sample) > 21a (asks for a reason and suggests a safer command; turn summary; 7) > 21b (backup before delete, for undo; 6; shown as an example in a video).

**2. Reflect and memory (5b, WeAreNoCode reflect; ours is 5, tied at 8).**
Order: 5b (choose the target: project CLAUDE.md, all projects, or one skill's SKILL.md; dated headings; a free check before any model call) > 5 (ours: project or vault) > 5a (claude-reflect; 7; broader capture, but a model call on every run; install only one reflect) > 5c (memory of facts, on "remember"; 6) > 5d (dream: merges and cleans memory; 5).

**3. Mods manager (9, ours; 9a is the discovery add-on).** Grade 8.
Order: 9 (manages what is installed) > 9a (Mod Store; finds mods and shows permissions before install; 6).

### Tier 2 (grade 7)

**4. Effort and model choice.** Grade 7.
Order: 23 Effort Picker (7; picks effort per message and never switches models) > 12b sub-agent model router (6) > 23a manual toolbar (6; you choose each time) > 12 OpenRouter router (4; needs a key and sends prompts to a third party) > 12a Auto Model (4; its creator paused it, because switching models mid-chat makes Claude reread the whole chat).

**5. Assumption check (16).** Grade 7. Standalone. Shows the small guesses Claude made; you mark each right or wrong, and wrong ones go back to Claude.

**6. Secret handling.** Grade 7.
Order: 33a Secret Box (7; secrets go into a pane and a local .env file that Claude can't read; Claude uses placeholders) > 33 secret redactor (7; the video's name and link did not match a repo, so unverified).

**7. Side questions (34, Aside).** Grade 7. Standalone. A read-only pane; answers never enter the main chat.

**8. Prompt shaping.** Grade 7.
Order: 1b WeAreNoCode brain dump (7; "send my words" fallback; timestamp checklist) > 1 ours (7; four-part brief; up to three questions) > 1c Prompt Upgrade (6; for short prompts: questions, then a detailed prompt) > 1d Prompt Bouncer (6; sends vague prompts back, using a project glossary) > 1a Prompt Enhancer (6; rewrites in the prompt bar and names skills; triggered by hand).

**9. Cache guard.** Grade 7.
Order: 3a cache-tax (7; holds a costly cold send and shows its cost; opt-in keep-warm) > 3 cache-clock (ours, 7; countdown and keep-warm) > 3k cache clock with auto handoff (6; handoff when under 5 minutes remain) > 3e Cache Keeper (6; adds limits and a handoff button) > 3j countdown with compaction (5; compaction loses detail).

**10. Handoff.** Grade 7.
Order: 4 ours (7; three triggers: 250k tokens, cache cold, manual) > 4a WeAreNoCode handoff (7; offers at 60% full; notes saved in the project) > 4d auto handoff (6; runs at a threshold you set) > 4c bookmarks (5; named save points, no new chat) > 4b context handoff (5; a summary in the same chat, closer to compaction).

**11. Replay and diff.** Grade 7.
Order: 8 ours (7; coverage known: Edit, Write, MultiEdit) > 8b WeAreNoCode replay (7; net change per file, keyboard controls; coverage not documented, so test it) > 8a built-in diff (5).

**12. Screen privacy.** Grade 7.
Order: 7 screen-share (7; covers emails, phones, money and names) > 7b recording mode (6; on and off toggle) > 7a hover-to-reveal (5; emails only).

### Tier 3 (grade 6)

**13. Session guard.** Grade 6.
Order: 2d.1 collision guard (6; asks before editing a file another chat touched in the last 30 minutes) > 2c session monitor (6; waiting, working, done) > 2c.1 session bar (6; the same as 2c, plus a jump) > 2d same-folder tracker (5) > 2d.2 message board (5; only useful for swarms).

**14. Usage display.** Grade 6.
Order: 3f usage meter (6; 5-hour and weekly limits, warm or cold status, holds a message to a cold, large chat) > 3i token meter (5) > 3g Context Bar (5) > 3d live breakdown (5) > 3h token weather (5) > 3b Minecraft HUD (5; reads an undocumented usage endpoint) > 3c terminal tracker (4).

**15. Work panel (progress and subagents).** Grade 6.
Order: 2 helper-desk (6; ours; taskbar and per-helper cards with cost) > 2a savvy-progress (6; works with any subagent; cost is an estimate) > 2h Flightdeck (6; adds limits and a permission grid) > 2j Agent Dock (6; sets team size and helper model per prompt) > 2f goal meter (6; for /goal runs only) > 2i clean view (6; hides noise, shows a checklist) > 2g team tracker (5; duplicate of helper-desk) > 2e agent side pane (5; lists idle agents too) > 2l swarm pane (5; built for 100-agent swarms) > 2e.1 agent flow (4; shows success or failure per agent) > 2k aquarium (4) > 2b vibe bar (3).

**16. Work inventory.** Grade 6.
Order: 6 chat-inventory (6; ours) > 6d Mission Control Plus (6; cost and guard lanes, export) > 6g flight recorder (6; request-by-request timeline) > 6b Filetree (5) > 6h output tray (5) > 6c Mission Control (5) > 6e Focus Deck (4) > 6a fake chat (4) > 6i receipt (3) > 6f tool counter (2).

**17. Park and queue.** Grade 6.
Order: 17a claude-queue (6; holds messages typed mid-turn and sends them in order) > 17 idea shelf (5; parks ideas across sessions).

**18. Spend and publish guards.** Grade 6.
Order: 28a credit saver (6; approval before any paid generation; balance check) > 31 publish lock (6; checklist before publishing) > 26 today's report (5) > 32 jobs radar (5) > 28 photo studio (4) > 30 local model status (3).

**19. You Should Know (built in).** Grade 6. Enable it; it uses a second agent, so it uses some plan usage.

**20. Human in the loop (25).** Grade 6. Standalone; your own tasks in a pane while Claude waits.

**21. Diagram pane (36).** Grade 6. Standalone; a picture of a long session.

### Tier 4 (grade 5)

Decision tree (37), Plain English (18), Prismantis (24), Jev skill router (38), terminal browser (22), today's report (26), and the sub-families already listed above at grade 5.

### Tier 5 (grade 4)

Claude Skins (20), Next Steps (13a, 13b), repo heatmap (35), design picker (15), daily challenge (27), OpenRouter router (12), Auto Model (12a), photo studio (28), focus deck (6e), fake chat (6a), context tracker (3c).

### Tier 6 (grade 3 or lower: toys and low value)

Breathing panel (29, 2), Road Trip (10c, 2), Snake (10b, 10d, 2), Doom lobby (10a, 2), tool counter (6f, 2), YouTube TV (11a, 1), waiting video (11, 1), Idle Art (14b, 1), Pokémon (14a, 1), pet (14c, 1), cosmetic mods (14, 1), local model status (30, 3), receipt (6i, 3), next-action suggestion (13, 3), vibe bar (2b, 3).

## 2. Overlapping mods: which order is actually better

The rule used: prefer the version that (a) gives you a decision, (b) makes the fewest model calls, and (c) has a documented source. The orders are inside section 1. The biggest decisions:

- **Reflect:** 5b over ours, because it can target one skill's file. Never run two reflect mods.
- **Cache:** cache-tax (3a) over ours, because it holds the costly cold send. Our cache-clock keeps the countdown.
- **Handoff:** ours (4) first, because it has three triggers; then 4a for its project-saved notes.
- **Progress panels:** helper-desk stays first because it is installed and has cost per helper. Agent Dock (2j) adds per-prompt control.
- **Session awareness:** collision guard (2d.1) comes first, because it is the only one that prevents an overwrite.

## 3. Best combined version per family

- **Delete guard:** pause on delete or force push; list the files (21); ask for a reason and suggest a safer command (21a); back up before a delete, so it can be undone (21b); end each turn with a summary. One mod.
- **Rules and memory:** one free check per message; a Haiku call only on correction-like messages; save target chosen by you: project CLAUDE.md, all projects, or one skill (5b); facts saved to a memory file only on "remember", with sources (5c); cleanup every 20 turns or before compaction (5d). Never run two reflect mods at once.
- **Effort and model:** Effort Picker sets effort per message (23); the sub-agent router sets helper models (12b); the manual toolbar overrides both (23a). No model switch mid-chat.
- **Prompt coach:** a long message is held; at most three questions, and only where two readings exist; four-part brief; "send my words" fallback; timestamp checklist (1b). A short prompt gets questions, then a detailed version (1c). Vague terms get glossary suggestions (1d). Skill names are listed (1a). One mod.
- **Cache guard:** countdown with a 5-minute warning (3); cold-send cost preview and hold, with opt-in keep-warm (3a); auto handoff under 5 minutes (3k); 5-hour and weekly limits (3f). Drop 3e and 3j.
- **Handoff:** three triggers (250k tokens, cache cold, manual) (4); an offer at 60% (4a); notes saved in `.claude/handoffs` (4a); bookmarks as named points (4c). Drop 4b.
- **Replay:** replay-theater (8) plus the net-per-file view (8b), once 8b's coverage is tested. Built-in diff (8a) as the fallback.
- **Privacy:** screen-share (7) with a record toggle (7b). Keep hover-to-reveal (7a) only if you want emails shown on demand.
- **Secrets:** Secret Box (33a) as the entry path; transcript redaction (33) as a backstop once its repo is confirmed.
- **Session guard:** collision guard (2d.1), session monitor (2c), and the session bar's jump (2c.1). Fold same-folder status (2d) in. Message board (2d.2) only for swarms.
- **Usage display:** usage meter (3f), with the breakdown (3g) on click. Drop 3i, 3b, 3h, 3c.
- **Work panel:** helper-desk (2) taskbar and cards; Agent Dock team size and helper model per prompt (2j); goal meter for /goal (2f); Flightdeck's limits row (2h) optional. Drop 2g, 2k, 2b, 2e.1; drop 2e and 2l unless you run swarms.
- **Work inventory:** chat-inventory (6), with the output tray (6h) for new files, Filetree (6b) for live highlighting, the flight recorder (6g) for diagnostics, and Mission Control Plus's cost and guard lanes (6d) if you run agents. Drop 6i, 6f, 6a, 6e.
- **Park and queue:** claude-queue (17a) for ordered messages during a turn; idea shelf (17) for ideas across sessions. Two different jobs; keep both if you park ideas.
- **Spend and publish guard:** credit saver (28a) and publish lock (31), combined into one approval step before any paid action or publish.

## 4. Ideas described but not built, best to not needed

| Rank | Idea | Source video | Why it matters | Verdict |
|---|---|---|---|---|
| 1 | Undo for deletions: back up before delete | Chase AI | The only way to recover a deletion; none of our mods do it | Build first |
| 2 | Deploy guard: no overwrite across chats | Julian Goldie (Focus Deck) | Prevents accidental overwrite of published content | Build if you deploy from Claude |
| 3 | Test-fail magnet: pin failing tests with a fix button | RocketLauncher | Keeps failing tests in view during coding | Build for coding work |
| 4 | Budget guard: switch to a cheaper model past a spend limit | RocketLauncher | Hard spend control | Build, with confirmation; pair with the router |
| 5 | Second-machine deploy check | Julian Goldie | Confirms content is live where it should be | Build for publishing |
| 6 | Guard rules per project, from one repo file | RocketLauncher | Makes guards project-specific | Build alongside the guard |
| 7 | Mod doctor: diagnose installed mods | Chase AI | Helps audit what is running | Useful; `claude plugin validate` covers part of it |
| 8 | Commit coach: conventional commit messages | RocketLauncher | Small time saver | Nice to have |
| 9 | Posting log: where content was posted | Julian Goldie | Record of publishing | Mostly covered by the publish lock |
| 10 | Account guard before publishing | Chase AI | Stops a publish from the wrong account | Fold into the publish lock |
| 11 | Dictation fixer | Chase AI | Cleans messy voice input | Only if you dictate a lot |
| 12 | Time-lapse recorder: session as a video | RocketLauncher | For content creators | Overlaps the flight recorder |
| 13 | Narrator: reads each turn's end aloud | RocketLauncher | Accessibility | Low priority |
| 14 | Project tracker | Chase AI | Project status | Overlaps the goal meter and work panel |
| 15 | Demo rehearsal helper | Chase AI | Niche | Skip |
| 16 | Fast compaction via a classifier | Julian Goldie | Compaction | Overlaps the cache countdown's compaction |
| 17 | Multi-provider API switcher | Julian Goldie | Switches providers | Overlaps the router; skip |
| 18 | Lookup across records | Jack Roberts | Too vague to build | Skip |

Already built, so not counted as ideas: a prompt linter (Prompt Bouncer, 1d), a cross-session inbox (message board, 2d.2), a conversation diagram (diagram pane, 36), a session output shelf (output tray, 6h), a productivity timer (Focus Deck, 6e), and a browser that Claude can control (terminal browser, 22). The account guard is partly built (publish lock, 31).

## 5. Recommended final set

Add, in priority order:
1. Blast Radius (21), grade 8. Fills the delete-safety gap.
2. Collision guard (2d.1), grade 6. Fills the gap that our same-folder tracker doesn't cover. No public repo was named, so build it from the video's description.
3. Effort Picker (23), grade 7. Chooses effort per message.
4. Aside (34), grade 7. Side questions without touching the main chat.
5. Assumption check (16), grade 7. No public repo; build it from the description.
6. Secret Box (33a), grade 7. Verify the repo before installing.

Enable: You Should Know (19, built in): `/plugin enable cc-plugin-you-should-know@builtin`.

Optional: usage meter (3f), grade 6; human in the loop (25), grade 6.

Consider a swap: reflect 5b in place of ours (5), for skill-file targeting. Do not run both.

Keep installed: brain-dump, helper-desk, cache-clock, handoff, chat-inventory, screen-share, replay-theater, mods.

## 6. Caveats

- Grades are preliminary; none of these mods were tested here.
- Unverified: the video's secret-redactor name (its repo link returned a 404); replay 8b's tool coverage; claude-queue and aside, whose claims come from their fetched pages.
- Compatibility claims conflict across sources (desktop app and VS Code support).
- Assumption check and collision guard are not publicly released in the sources, so you would build them from a prompt.
- Several videos promote the creator's own products (a sandbox, a course, an app). Discount verdicts accordingly.
- Every mod runs with your permissions. Run `claude plugin validate` on any mod before installing it.
