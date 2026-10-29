# test-fail-magnet: how it works

Lesson 0021, Test-fail magnet (tier 3): [0021-test-fail-magnet.html](../../teach/lessons/0021-test-fail-magnet.html)

test-fail-magnet watches the Bash tool that Claude uses. When Claude runs a known test command, the mod reads the printed output and keeps up to ten failing lines in a Failing tests pane. Fix sends those lines to Claude as a prompt, and Dismiss clears them.

It matters for your mission because MISSION.md asks you to name each mod's hook events and API calls and say why, and this mod uses one hook, one atom and one pane.

## How it was built

1. 1. Recognise a test run by its command
2. 2. Read the output in a tool.call hook
3. 3. Pick the failing lines in failures()
4. 4. Hold the list in an atom and draw the pane

The lesson walks through each step with the code from this folder, then shows how to use the mod and checks what you learned.
