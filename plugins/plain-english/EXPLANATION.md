# plain-english: how it works

Lesson 0028, Plain English (tier 4): [0028-plain-english.html](../../teach/lessons/0028-plain-english.html)

plain-english is a reading aid for people who are not developers. It is off until you type /plain on. While it is on, each finished reply of 400 characters or more goes to Haiku once, and Haiku rewrites it in plain language: short sentences, no jargon, and any technical term explained. A short Next steps list follows. The rewrite appears in a side pane titled Plain English, and the status line under the prompt says Plain English on.

Claude's reply is never changed. The rewrite goes only to the pane, so it never reaches the chat and the model never reads it. The video's variant 18 put a summary into the chat itself. This build keeps the chat as Claude wrote it and puts the plain version beside it.

## How it was built

1. 1. Declare the state the pane draws
2. 2. Set the limits and the atom
3. 3. Register /plain and bring back the status line
4. 4. Switch it on and off
5. 5. Watch the end of each reply
6. 6. Make the one Haiku call
7. 7. Ask for plain words, then split off Next steps
8. 8. Draw the pane

The lesson walks through each step with the code from this folder, then shows how to use the mod and checks what you learned.
