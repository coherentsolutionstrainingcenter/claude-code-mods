# prompt-bouncer: how it works

Lesson 0010, Prompt shaping (tier 2): [0010-prompt-shaping.html](../../teach/lessons/0010-prompt-shaping.html)

Prompt Bouncer checks each prompt you type at prompt.submit, the moment you press Enter. If the prompt is vague, the mod drops it, a toast says why, and Claude Code puts the prompt back in the box for you to fix. The README's reason: a vague prompt costs a whole turn of Claude guessing. Quick mode, the default, uses a few patterns and no model. Project mode reads the project's own docs and asks Haiku if the prompt is specific and uses the project's terms. /force sends any prompt past it, and slash commands always pass.

Your mission asks you to name the hooks a mod uses and say why, and this mod is the plainest guard you will meet: one prompt.submit handler that returns { drop } or calls next(e), and lets the prompt through when anything breaks.

## How it was built

1. 1. Show the mode and register two commands
2. 2. Pass what it should not judge
3. 3. Quick mode: patterns, no model
4. 4. Project mode: Haiku reads the project's docs
5. 5. Bounce with { drop }, and fail open
6. 6. Send a prompt past the bouncer with /force

The lesson walks through each step with the code from this folder, then shows how to use the mod and checks what you learned.
