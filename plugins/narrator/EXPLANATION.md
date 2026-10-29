# narrator: how it works

Lesson 0039, Narrator (tier 5): [0039-narrator.html](../../teach/lessons/0039-narrator.html)

Narrator adds a /narrator command with three arguments: on, off and status. When a reply finishes and narrator is on, it takes the reply's final text, strips the Markdown, keeps the last 240 characters, and starts macOS say. It does not wait for say to finish, and it makes no model calls.

This matters for your mission because it is the smaller of the two mods and uses no model call, so it is a clear first example of a hook that reacts to the end of a turn and starts an outside program.

## How it was built

1. 1. Register the command when the session starts
2. 2. Handle on, off and status
3. 3. Read the final reply when the turn ends
4. 4. Start say and do not wait for it
5. 5. Turn Markdown into words
6. 6. Keep the last 240 characters, from a whole word

The lesson walks through each step with the code from this folder, then shows how to use the mod and checks what you learned.
