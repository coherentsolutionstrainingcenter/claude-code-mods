# human-in-the-loop: how it works

Lesson 0025, Human in the loop (tier 3): [0025-human-in-the-loop.html](../../teach/lessons/0025-human-in-the-loop.html)

Human in the loop gives Claude a tool called assign_task. When Claude needs something only you can do, it files a task. The task waits in a My tasks pane under the prompt, and your answer goes back to Claude as a message.

For your mission, which asks you to name the hook events and calls a mod uses, this mod is a clear example of a function-hook mod that adds its own tools, a pane and a turn-end hook, all in its main module, register.tsx.

## How it was built

1. 1. Register the tools and the command (lines 327 to 336)
2. 2. Guard the assign call (lines 389 to 398)
3. 3. Hold answers until Claude is free (lines 549 to 573)
4. 4. Draw the pane (lines 746 to 753)

The lesson walks through each step with the code from this folder, then shows how to use the mod and checks what you learned.
