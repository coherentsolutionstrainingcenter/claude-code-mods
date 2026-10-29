# collision-guard: how it works

Lesson 0016, Collision guard (tier 3): [0016-collision-guard.html](../../teach/lessons/0016-collision-guard.html)

collision-guard sits in front of Edit and Write. Before either tool changes a file, it checks whether another chat changed that same file in the last 30 minutes. If one did, it asks you to choose Proceed or Cancel, and Cancel refuses the edit.

It matters for your mission because it shows, in one short hook, the event, the calls and the refusal that you must be able to explain before you publish.

## How it was built

1. 1. Declare the hook module
2. 2. Pick the window and the tool
3. 3. Ask when another chat touched the file
4. 4. Record the touch after a good edit

The lesson walks through each step with the code from this folder, then shows how to use the mod and checks what you learned.
