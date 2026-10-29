# today-report: how it works

Lesson 0032, Today's report (tier 4): [0032-today-report.html](../../teach/lessons/0032-today-report.html)

today-report is a Claude Code mod with one slash command, /today-report. It opens a pane that totals your past work from the session logs in ~/.claude/projects: tasks, estimated hours saved, value at your hourly rate, and tokens.

Your mission in MISSION.md says you must be able to name the hook events and API calls each mod uses, and this mod is a small, complete example to study.

## How it was built

1. 1. Read the logs with a script
2. 2. Stream the records and count tasks
3. 3. Cache each log by path, size and mtime
4. 4. Hold the state in an atom and refresh through a process call
5. 5. Group days into periods, with weeks starting on Monday

The lesson walks through each step with the code from this folder, then shows how to use the mod and checks what you learned.
