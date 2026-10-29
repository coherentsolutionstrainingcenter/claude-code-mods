# mission-control: how it works

Lesson 0020, Work inventory (tier 3): [0020-work-inventory.html](../../teach/lessons/0020-work-inventory.html)

mission-control opens a pane with two views of the current turn. Who is a tree of the main loop, its subagents and every tool call they make, live. Code is a drawn map of the files Claude reads and edits, with arrows for the imports between them, a glow on the file it touches now, and one line on each change. A band line above the prompt sums it up while Claude works.

It serves your mission because it shows how four events, turn.start, agent.spawn, tool.call and turn.complete, build one shared picture, and where a mod calls a model and runs a process.

## How it was built

1. 1. Keep the picture in atoms
2. 2. Register /mission and a clock
3. 3. Start a fresh tree each turn
4. 4. Hang each subagent on its parent
5. 5. Add each tool call, then mark how it ended
6. 6. Write one line per changed file with Haiku
7. 7. Draw the code map with headless Chrome

The lesson walks through each step with the code from this folder, then shows how to use the mod and checks what you learned.
