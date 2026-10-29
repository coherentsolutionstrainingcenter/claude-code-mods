# prompt-queue: how it works

Lesson 0022, Park and queue (tier 3): [0022-park-and-queue.html](../../teach/lessons/0022-park-and-queue.html)

Park and queue catches a message typed while Claude is working. The best version, claude-queue, does this with a /q command and a band above the prompt box that lists the held messages. You can reorder, edit or drop them while the turn runs.

For your mission, which asks you to name the hook events and calls a mod uses, this mod is a good full read: it uses nine events and nine calls, all in one file.

## How it was built

1. 1. Register /q as an immediate command (lines 387 to 399)
2. 2. Hold the text on a stack (lines 531 to 537)
3. 3. Drain the stack when the turn ends (lines 409 to 427)
4. 4. Wait out the gap, then submit (lines 121 to 141)
5. 5. Steer a message into the running turn (lines 437 to 460)
6. 6. Draw the band and keep a backstop (lines 540 to 548)

The lesson walks through each step with the code from this folder, then shows how to use the mod and checks what you learned.
