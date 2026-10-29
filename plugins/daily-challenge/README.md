# daily-challenge

## What it does

One small Claude Code challenge each day. `/challenge` opens a pane with today's challenge, picked by the date from a built-in list of 30 short exercises, such as "Explain a file you have never read" or "Search three folders at once". The pane shows your streak and has three buttons:

- **Coach me** sends a prompt that asks Claude to walk you through the challenge one step at a time.
- **Done** marks today complete.
- **Skip** moves to tomorrow's challenge.

## Install

```bash
claude plugin marketplace add <org>/waraxe-claude-mods
claude plugin install daily-challenge@waraxe-claude-mods
```

## Use

- `/challenge` opens the pane and prints the title of today's challenge in the transcript.
- **Coach me**, **Done** and **Skip** are the pane's buttons. Done reads `Done ✓` once today is marked.
- There are no settings. Your progress (the number of skips and the days you marked done) is kept in the plugin's store under the key `progress`, so it carries over between sessions.

## Cost

The mod makes no model calls. **Coach me** sends one ordinary prompt, so it costs one normal turn, the same as typing the prompt yourself. **Done** and **Skip** write a small JSON value to the plugin store.

## Limits

- A day is your computer's local calendar day. An open pane does not roll over at midnight by itself: run `/challenge` again or press a button.
- **Skip** moves the whole list on by one, so tomorrow you get the challenge after the one you skipped to. A skip does not count as done, and it does not break the streak.
- The streak counts the days you pressed **Done** in a row, ending today, or yesterday while today is still open. Nothing checks that you did the challenge.
- The 30 challenges are fixed in `hooks/register.tsx` (the `CHALLENGES` list). Edit the list to change them.
- **Coach me** queues its prompt. If Claude is in the middle of a turn, the prompt starts when that turn ends.
- The progress lives in the plugin store on this machine only.

## How it works

`session.start` registers `/challenge`. The `command.run` hook reads the progress from `$.store`, works out today's date, writes both to a `$.state` atom, and opens the pane with `$.ui.open`. The pane's `ui.render` hook picks the challenge from the day number plus the skips, counts the streak, and draws the buttons. Coach me calls `$.prompt.submit`; Done and Skip change the progress, save it to `$.store`, and update the atom, which redraws the pane.

Lesson: [teach/lessons/0037-daily-challenge.html](../../teach/lessons/0037-daily-challenge.html)
