# terminal-pet

## What it does

A small text pet lives in the band above the prompt and "eats" the files Claude reads. Each file Claude reads in this session is one meal. The pet's face and words change with its mood:

| Mood | When | Frames |
| --- | --- | --- |
| eating | for 4 seconds after each file Claude reads | `(^O^)` `(^-^)` |
| hungry | fewer than 8 files eaten, or 15 minutes since the last one | `(°o°)` `(°O°)` |
| full | 8 or more files eaten, the last one less than 15 minutes ago | `(^_^)` `(-_^)` |
| sleepy | 10 minutes with no meal and no turn, while Claude is not working | `(-_-) z` `(-_-) zZ` |

Beside the face it says what the pet is doing, for example `Pip is eating register.ts · 3 files eaten`.

## Install

```bash
claude plugin marketplace add coherentsolutionstrainingcenter/claude-code-mods
claude plugin install terminal-pet@waraxe-claude-mods
```

## Use

- The pet is on by default.
- `/pet off` hides it, and `/pet on` brings it back.
- `/pet name <name>` renames it (up to 20 characters). The default name is Pip.
- `/pet` on its own says whether the pet is on and how many files it has eaten this session.
- The on/off setting and the name are kept in the plugin's store, so they carry over to new sessions. The meal count starts at 0 in each session.

## Cost

No model calls. A one-second timer runs while the pet is on. It redraws the band once a second while the pet eats, and once every 3 seconds otherwise.

## Limits

- The band above the prompt exists only in the terminal and in the desktop app. The VS Code extension and the mobile app draw no band, so the pet does not show there (the meal count still runs).
- Only the Read tool counts. Files Claude sees through Grep, Bash (`cat`), or an @-mention in your prompt are not meals. Reads made by subagents do count.
- A read that fails or that you deny is not counted.
- If another mod also draws the band above the prompt, only one of them shows.

## How it works

`session.start` registers `/pet`, loads the setting and the name from `$.store`, and starts a one-second `$.clock.every` timer. A `tool.call` hook on Read lets the read run with `next(e)`, then adds a meal to a `$.state` atom when the read succeeded. A `turn.complete` hook notes the time, so the pet knows how long it has been idle. The timer writes a "beat" atom only when the picture should change, and the `ui.render` hook on `AbovePrompt` reads the atoms, works out the mood, and draws one line: the face and its caption.

Lesson: [teach/lessons/0041-cosmetic-mods.html](../../teach/lessons/0041-cosmetic-mods.html)
