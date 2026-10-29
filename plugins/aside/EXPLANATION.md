# aside: how it works

Lesson 0009, Side questions (tier 2): [0009-side-questions.html](../../teach/lessons/0009-side-questions.html)

Aside adds /aside, which opens a pane beside the transcript. You ask a question about the session so far, and a tool-less fork of the session's own transcript answers it. The side chat cannot call tools, edit files or submit prompts, and nothing from it goes back into the main thread.

This matters for your mission because it is the clearest example in this set of a mod that is read-only by design. Its validator output lists every hook and call it makes, so you can check that claim yourself.

## How it was built

1. 1. Keep a small host object, and register the command
2. 2. Ask a fork of the transcript
3. 3. Answer from the transcript text when no turn has finished
4. 4. Put the side chat's own history into each prompt
5. 5. Draw each exchange with function calls
6. 6. Take the input and the presses in hooks, not in closures

The lesson walks through each step with the code from this folder, then shows how to use the mod and checks what you learned.
