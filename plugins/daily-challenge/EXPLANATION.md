# daily-challenge: how it works

Lesson 0037, Daily challenge (tier 5): [0037-daily-challenge.html](../../teach/lessons/0037-daily-challenge.html)

/challenge opens a pane with today's challenge. The mod picks it by the date from a built-in list of 30 short, practical exercises, such as "Explain a file you have never read" or "Search three folders at once". The pane shows your streak and has three buttons: Coach me asks Claude to walk you through the challenge step by step, Done marks today complete, and Skip moves to tomorrow's challenge. The mod itself makes no model calls.

Your mission asks you to name the hook events and API calls each mod uses, and this one is a small pane mod that uses a store, a session atom and a prompt call, so you can trace each one from start to end.

## How it was built

1. 1. Declare the pane's state
2. 2. Register /challenge when the session starts
3. 3. Pick today's challenge by the date
4. 4. Keep the progress in the store
5. 5. Draw the three buttons
6. 6. Coach me sends a prompt
7. 7. Count the streak

The lesson walks through each step with the code from this folder, then shows how to use the mod and checks what you learned.
