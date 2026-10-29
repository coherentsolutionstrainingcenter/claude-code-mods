# session-band: how it works

Lesson 0043, Panels and toys (tier 6): [0043-panels-and-toys.html](../../teach/lessons/0043-panels-and-toys.html)

session-band draws one row above the prompt. It shows the turn number, the output speed of the last response in tokens per second, the cost of the last turn and of the session, how long the 1-hour prompt cache has left since the last answer, and how full the context is. The band gets an amber frame 20 minutes before the cache expires and a red one at 10. At 10 and 5 minutes left, it sends a warning.

It serves your mission because it reads the session's own figures from three turn events and draws them without any model call, so each hook has one clear job.

## How it was built

1. 1. Keep the figures in atoms
2. 2. Mark the start of each turn
3. 3. Time the output speed
4. 4. Restart the cache countdown when the main turn ends
5. 5. Count down and warn at 10 and 5 minutes
6. 6. Send the warning
7. 7. Draw the band to fit the width

The lesson walks through each step with the code from this folder, then shows how to use the mod and checks what you learned.
