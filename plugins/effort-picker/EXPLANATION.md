# effort-picker: how it works

Lesson 0006, Effort picker (tier 2): [0006-effort-picker.html](../../teach/lessons/0006-effort-picker.html)

effort-picker reads each message you type and checks four rules in order, stopping at the first match. A long job you hand off ("overnight", "end to end", "the whole ...") gets xhigh, and "go all out" or a security audit gets max. A message where a hidden mistake could cost you gets high: money, a client, publishing, something hard to undo, or something broken. A short question or a small tweak gets low. Anything else keeps your own level.

The level holds for the model requests that answer that one message. A dim line in the transcript says what was picked and why, for example Effort picker: high for this message, up from medium: money is involved. The model never changes, because a switch in the middle of a chat makes Claude reread the whole chat.

## How it was built

1. 1. Pick a level from the words
2. 2. Hold the pick while the prompt enters
3. 3. Match the pick to its turn
4. 4. Never lower xhigh or max
5. 5. Send each request of the turn with the level
6. 6. One command, three modes

The lesson walks through each step with the code from this folder, then shows how to use the mod and checks what you learned.
