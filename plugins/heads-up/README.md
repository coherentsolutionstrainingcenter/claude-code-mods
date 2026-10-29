# heads-up

## What it does

After a long turn, heads-up looks for up to two things you might miss and shows them in a band above the prompt, with a **Dismiss** button. It looks for four kinds of missed fact or skipped step:

- a tool call that failed, which the reply does not mention
- files changed beyond what you asked for
- code changed, and no test or build ran afterwards
- a risky step taken (a force push, a hard reset, deleted files, a migration, a publish or deploy)

When nothing is worth flagging, it shows nothing.

It is our own small version of the built-in You Should Know (`cc-plugin-you-should-know@builtin`), which ships inside Claude Code and cannot be shipped in this marketplace. It is not assumption-check: assumption-check lists the guesses Claude made; heads-up is about facts in the tool results and steps that were skipped.

## Install

```bash
claude plugin marketplace add <org>/waraxe-claude-mods
claude plugin install heads-up@waraxe-claude-mods
```

## Use

It is off until you turn it on:

- `/heads-up on` turns it on. It stays on in later sessions until you turn it off.
- `/heads-up off` turns it off and clears the band.
- `/heads-up` says whether it is on.

A turn is checked only when all of these hold: it ran in the main conversation (not a subagent), it ended with an answer (not interrupted), it is past the third prompt of the session, the reply is at least 300 characters, and Claude used at least one tool. The band clears when the next turn starts, or when you press Dismiss. There are no settings.

## Cost

One Haiku call per checked turn, in the background, so the prompt comes back at once and the band appears a few seconds later. The call sends up to about 17,000 characters (the request, the turn's tool calls and the reply, each cut to a limit), about 4,500 input tokens at most, and asks for at most 250 output tokens. Nothing is sent while it is off, in the first three prompts, or for a turn that used no tools.

## Limits

- Haiku can miss something or flag something harmless. Read a flag as a hint to check, not a verdict.
- It sees only the main conversation's tool calls, the first 60 of a turn. Inside a subagent it sees only the Agent call and its answer.
- Outputs are cut: a failure's first 300 characters, a Bash run's last 200. The request is cut at 2,000 characters and the reply at 6,000.
- The prompt count starts when the session starts, so a resumed session counts from zero. It is kept for the session through a plugin reload.
- The band (`AbovePrompt`) is drawn on the terminal and the desktop app only, so VS Code and mobile show nothing.
- The built-in You Should Know watches while a task runs; heads-up looks once, after the turn ends.

## How it works

`tool.call` logs each main-loop call after it runs (`await next(e)`): the tool, its command or file, whether it failed, and a short output. `prompt.submit` counts your prompts in `$.state`. `turn.start` clears the log and the band. `turn.complete` checks the conditions, then runs `$.model.complete` with Haiku in the background and writes at most two flags to `$.state`. A `ui.render` hook on `AbovePrompt` draws them above whatever other mods draw there. Running the check after `next(e)` in the background, and keeping other mods' bands below, follow the approach of next-steps by Hamza Zafar (MIT) in this repository; the code here is written fresh.

The lesson walks through the code: [teach/lessons/0024-you-should-know.html](../../teach/lessons/0024-you-should-know.html).
