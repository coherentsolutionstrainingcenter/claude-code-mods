# effort-picker

## What it does

effort-picker sets the reasoning effort for each message you send, for that message only. It reads your words and checks four rules in order, stopping at the first match:

1. A long job you hand off ("overnight", "end to end", "the whole ...") gets **xhigh**. "Go all out" or a security audit gets **max**.
2. A message where a hidden mistake could cost you gets **high**: money, a client or customer, publishing or deploying, something hard to undo (a migration, production, a force push), or something broken.
3. A quick back-and-forth gets **low**: a short question, or a small tweak such as a rename or a typo.
4. Anything else keeps your own level.

A dim line in the transcript says what was picked and why, for example `Effort picker: high for this message, up from medium: money is involved.` It never switches the model, because a switch in the middle of a chat makes Claude reread the whole chat.

## Install

```bash
claude plugin marketplace add <org>/waraxe-claude-mods
claude plugin install effort-picker@waraxe-claude-mods
```

## Use

- `/effort-picker on` sets the effort for each message. This is the default.
- `/effort-picker tip` only suggests: the line says which level would suit the message, and the level stays as it is.
- `/effort-picker off` stops it. Every message keeps your own level.
- `/effort-picker` with nothing after it says which mode is on.
- Start a message with `go:` and the picker leaves it alone.

The mode is saved in the mod's own store, so it holds across sessions. There are no settings.

## Cost

The mod makes no model calls. It reads only your words. A higher level makes Claude think longer and uses more of your plan; a lower level uses less. The mod does not measure how much.

## Limits

- The rules are English word patterns. A message with none of the words keeps your level. A word can also match by accident: "the whole" in a short question gets xhigh, and "error" in a short question gets high, because rule 2 comes before rule 3.
- A level you set to xhigh or max is never lowered. Any other level can go up or down.
- Only the main chat's requests change. Subagents keep their own effort.
- Only messages you type are picked: from the prompt box, Remote Control or an SDK host. Slash commands, hidden (meta) prompts and prompts from plugins are left alone.
- A pick is matched to its turn by the message's text. A message typed while Claude works is picked only if it starts a turn of its own. A pick also starts over when the mod reloads, and the message then keeps your level.
- A model that takes no effort setting, or an effort set as a number budget, is left alone. The engine may lower a level the model does not support.
- Tip mode only shows the suggestion. It has no button to apply it.

## How it works

`prompt.submit` picks a level from the words and holds it. `turn.start` matches the pick to the turn that answers the message. `turn.step` runs for each model request of that turn and passes on a copy with `next({ ...e, effort })`, so only that request carries the new level and your saved setting is never written. The lesson walks through the code: [teach/lessons/0006-effort-picker.html](../../teach/lessons/0006-effort-picker.html).

Written by Igor Waraxe. MIT licence, see [LICENSE](LICENSE).
