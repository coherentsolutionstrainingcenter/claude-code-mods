# plain-english

## What it does

A plain-language companion to Claude's replies. While it is on, each finished reply of 400 characters or more is rewritten by Haiku in plain language: short sentences, no jargon, and any technical term explained. A short "Next steps" list follows the rewrite. The result shows in a side pane titled "Plain English", and the status line under the prompt says "Plain English on".

Claude's own reply is never changed, and the rewrite is never sent to the main chat. Claude does not see it.

## Install

```bash
claude plugin marketplace add <org>/waraxe-claude-mods
claude plugin install plain-english@waraxe-claude-mods
```

## Use

- `/plain on` turns it on, opens the pane and shows the status line.
- `/plain off` turns it off, closes the pane and clears the status line.
- `/plain` on its own says whether it is on.

It is off until you turn it on. The on or off setting is kept between sessions, so the status line tells you when it is on in a new session. There are no other settings.

## Cost

While it is on, each main-loop reply of 400 characters or more makes one Haiku call. The call sends up to the first 12,000 characters of the reply plus about 150 tokens of instructions, can return up to 1,500 tokens, and stops after 60 seconds. Shorter replies, subagent reports, interrupted turns and replies that end in an error make no call. When it is off, it makes no calls at all.

## Limits

- The rewrite is a small model's reading of the reply. It can drop or blur a detail, so Claude's reply stays the one to trust.
- Only the first 12,000 characters of a long reply are rewritten.
- The model sees only the reply, not your question or earlier turns.
- Code blocks are left out of the rewrite.
- The rewrite runs in the background. While it runs, the pane shows the previous rewrite dimmed. A newer reply replaces an older rewrite, even if the older one finishes later.
- If the call fails or times out, the pane says so and shows nothing else. No retry is made.
- `/plain on` opens the pane at any width. When the mod opens it by itself after a reply, the terminal places it only when the window is wide enough: 144 columns, or 110 once you have opened it with `/plain on`. On a narrower window it waits until you widen it or run `/plain on` again.
- The last rewrite is kept for the session only. A new session starts with an empty pane.

## How it works

One hooks module, `hooks/register.tsx`. A `turn.complete` hook checks the finished reply: main loop, ended normally, 400 characters or more, and the mod turned on. It then starts one `$.model.complete` call to Haiku in the background and returns `next(e)` unchanged, so the reply and the turn are not held. The answer is split at its `NEXT STEPS` line, turned into Markdown, and written to a `$.state` atom. A `ui.render` hook on the `Pane` reads that atom and draws it with `Markdown`, so each write redraws the pane. `/plain` is a command registered in `session.start`; it keeps the on or off flag in `$.store` and sets the status line with `$.ui.status`.

The lesson explains each step: [teach/lessons/0028-plain-english.html](../../teach/lessons/0028-plain-english.html).

## License

MIT. Copyright (c) 2026 Igor Waraxe. See [LICENSE](LICENSE).
