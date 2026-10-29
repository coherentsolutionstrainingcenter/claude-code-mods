# blast-radius: how it works

Lesson 0001, Delete guard (tier 1): [0001-delete-guard.html](../../teach/lessons/0001-delete-guard.html)

Blast Radius watches Claude's Bash calls. When a command is risky, such as rm -rf, git reset --hard, git clean, a force push or a database migration, it holds the call and works out what the command would change. A pane lists that change with two buttons: Proceed runs the command, and Cancel refuses it and tells Claude why.

It matters for your mission because it shows, in one file, three patterns you will need to explain in your README: holding a tool.call until a person answers, drawing in a Pane or the band above the prompt, and measuring with $.process.run.

## How it was built

1. 1. Hook Bash and classify the command
2. 2. Hold the call with short sleeps until a button is pressed
3. 3. Measure the blast radius with scripts that take paths as arguments
4. 4. Show the pane, or the band on a narrow terminal
5. 5. Refuse with a reason on cancel, timeout or error

The lesson walks through each step with the code from this folder, then shows how to use the mod and checks what you learned.
