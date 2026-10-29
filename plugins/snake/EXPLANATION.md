# snake: how it works

Lesson 0042, Games and waiting (tier 6): [0042-games-and-waiting.html](../../teach/lessons/0042-games-and-waiting.html)

Snake is a small game that runs in a pane while Claude works. It stays off until you type /snake, and it pauses when Claude's turn completes. The rules sit in snake.ts as plain functions, so the tests can run them without a pane.

It is a toy. It does not serve the mission and is included for completeness.

## How it was built

1. 1. Hold the game's values in host atoms
2. 2. Turn it on and off with /snake
3. 3. Play while a turn runs, and pause when it ends
4. 4. Keep the rules pure
5. 5. Run the clock and keys inside the pane
6. 6. Post the score back and save the best
7. 7. Test the rules without a pane

The lesson walks through each step with the code from this folder, then shows how to use the mod and checks what you learned.
