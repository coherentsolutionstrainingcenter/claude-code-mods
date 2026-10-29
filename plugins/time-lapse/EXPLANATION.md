# time-lapse: how it works

Lesson 0040, Time-lapse (tier 5): [0040-time-lapse.html](../../teach/lessons/0040-time-lapse.html)

time-lapse watches a Claude Code session as it runs and logs each prompt, each tool call and each finished turn. When you run /time-lapse, it turns that log into an animated page you can play and pause in a browser. The whole mod is one TypeScript file, hooks/register.ts, and it makes no model calls.

It matters for your mission in MISSION.md, which asks you to name the hook events and API calls a mod uses and say why, and this one uses five hooks and eight calls in one file.

## How it was built

1. 1. Record events through hooks
2. 2. Keep one log file per session
3. 3. Split the log into turns
4. 4. Render one self-contained HTML page

The lesson walks through each step with the code from this folder, then shows how to use the mod and checks what you learned.
