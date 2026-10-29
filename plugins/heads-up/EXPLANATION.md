# heads-up: how it works

Lesson 0024, You Should Know (tier 3): [0024-you-should-know.html](../../teach/lessons/0024-you-should-know.html)

You Should Know (mod 19) is a side agent built into Claude Code. It watches your back while Claude works on a longer task and shows what you might miss above the prompt. It ships inside Claude Code as cc-plugin-you-should-know@builtin, its code is not on disk, and so it cannot go into this marketplace. heads-up is a small version we can ship and read: when a main-loop turn ends with a long reply, it asks Haiku once about four kinds of missed fact or skipped step, and shows at most two.

For your mission, this mod shows how several events work together: a counter, a log, a model call and a band, each in its own hook, so you can name every event it uses and say why.

## How it was built

1. 1. Declare the values the band reads
2. 2. Register the switch
3. 3. Count the person's prompts
4. 4. Log the turn's tool calls
5. 5. Decide whether the turn is worth a call
6. 6. Ask Haiku in the background
7. 7. Draw the band with Dismiss

The lesson walks through each step with the code from this folder, then shows how to use the mod and checks what you learned.
