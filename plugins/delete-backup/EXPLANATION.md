# delete-backup: how it works

Lesson 0002, Delete backup (tier 1): [0002-delete-backup.html](../../teach/lessons/0002-delete-backup.html)

delete-backup is a Claude Code mod that watches Bash calls and adds one slash command, /undo-delete. Before a Bash command runs rm, it copies each target that exists into a time-stamped backup folder, and only then lets the command run. /undo-delete puts the newest complete backup back at its original paths, and it never writes over a path that is already in use.

It matters for your mission because MISSION.md asks you to point to the hook events and API calls each mod uses and say why, and this mod is small enough to trace all the way through.

## How it was built

1. 1. Hook Bash and read the command as tokens
2. 2. Follow the shell's folder across calls with $.store
3. 3. Find the targets that exist
4. 4. Copy each target before the rm runs
5. 5. Restore the newest backup with /undo-delete

The lesson walks through each step with the code from this folder, then shows how to use the mod and checks what you learned.
