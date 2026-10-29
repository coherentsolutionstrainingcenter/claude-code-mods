# usage-meter: how it works

Lesson 0018, Usage display (tier 3): [0018-usage-display.html](../../teach/lessons/0018-usage-display.html)

usage-meter draws one line above the prompt. It shows each rate-limit window of your plan as a five-cell bar with a percent, the time until the first window resets, and the session's cost in dollars. The bars turn yellow at 75% and red at 90%, and a toast warns once when a window passes 90%.

It serves your mission because it is short and uses only three hook events, so you can point to each one and say why it is there.

## How it was built

1. 1. Declare the module
2. 2. Keep the reading in atoms
3. 3. Take a reading at start and on every measurement
4. 4. Store the windows and warn past 90%
5. 5. Turn the snapshot into parts
6. 6. Drop parts until the line fits
7. 7. Draw the line and stack it with other bands

The lesson walks through each step with the code from this folder, then shows how to use the mod and checks what you learned.
