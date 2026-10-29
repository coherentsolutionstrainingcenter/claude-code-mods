# assumption-check: how it works

Lesson 0007, Assumption check (tier 2): [0007-assumption-check.html](../../teach/lessons/0007-assumption-check.html)

assumption-check reads Claude's last reply and lists up to five guesses that the reply made and you did not state, such as a default value or a file picked without asking. It checks only replies of 300 characters or more, and it asks Haiku for the list, so each check costs one small model call. You mark each guess Right or Wrong, and Send wrong to Claude submits the wrong ones as a new prompt.

It matters for your mission because it is the one place in this pair where a hook makes a model call, so you must be able to say when that call happens and what it costs.

## How it was built

1. 1. Declare the state type
2. 2. Set the limits and the state atom
3. 3. Register the command and the pane
4. 4. Remember the request and check the reply
5. 5. Ask for a JSON list and read the answer safely
6. 6. Draw the pane
7. 7. Send the wrong ones back

The lesson walks through each step with the code from this folder, then shows how to use the mod and checks what you learned.
