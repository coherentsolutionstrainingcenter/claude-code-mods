# next-steps: how it works

Lesson 0034, Next steps (tier 5): [0034-next-steps.html](../../teach/lessons/0034-next-steps.html)

Next Steps asks Claude's small model, Haiku, for follow-up prompts after each finished answer. The prompts appear as a band above the prompt box. In an empty box, a digit puts the chosen prompt in as a draft, and nothing is sent until you press Enter.

It matters for your mission because a short entry file shows the whole loop: an event, a model call, and a band drawn above the prompt.

## How it was built

1. 1. Declare the plugin and its two settings
2. 2. Keep the list in two atoms
3. 3. Clear the list when a new prompt or turn starts
4. 4. Ask the model after a finished answer
5. 5. Call Haiku with the recent transcript
6. 6. Clean the reply into at most three lines
7. 7. Fill the box when a digit is typed
8. 8. Draw the band above the prompt

The lesson walks through each step with the code from this folder, then shows how to use the mod and checks what you learned.
