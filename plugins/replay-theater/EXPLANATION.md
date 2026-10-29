# replay-theater: how it works

Lesson 0014, Replay (tier 2): [0014-replay.html](../../teach/lessons/0014-replay.html)

Replay Theater records each file edit that Claude makes in a turn: the file, and the text before and after. When the turn ends, a hint appears above the prompt, and /replay opens a pane that shows one edit at a time, with a red and green diff. It only watches: the README says it never blocks, changes or delays an edit.

It matters for your mission because it shows which hook events and API calls a mod uses to record work and draw a pane, so you can point to them and say why.

## How it was built

1. 1. Declare the hook module
2. 2. Record each edit, then let it run
3. 3. Group the edits by turn
4. 4. Register the /replay command
5. 5. Open the pane, and hide the band first
6. 6. Draw the pane with buttons

The lesson walks through each step with the code from this folder, then shows how to use the mod and checks what you learned.
