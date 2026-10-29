# jev-skill-suggestion: how it works

Lesson 0030, Jev skill router (tier 4): [0030-jev-skill-router.html](../../teach/lessons/0030-jev-skill-router.html)

jev-skill-suggestion is one hook module of 456 lines. After you stop typing for 600 ms, it asks TypeSafe's Jev API to rank your skills against the draft, in two requests at most. Then it applies one of three modes: observe, block or steer. In block and steer mode, it refuses Skill tool calls that do not fit the mode.

It matters for your mission because it sends your draft text to an outside service, and you must be able to point to the hook that does that.

## How it was built

1. 1. Read the key and the saved settings at start
2. 2. Score the draft after a pause
3. 3. Ask Jev one question per skill
4. 4. Rank every skill and check the gate
5. 5. Re-read the top three
6. 6. Hide the skill list in block and steer
7. 7. Refuse Skill calls that break the mode

The lesson walks through each step with the code from this folder, then shows how to use the mod and checks what you learned.
