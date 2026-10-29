# decision-tree: how it works

Lesson 0027, Decision tree (tier 4): [0027-decision-tree.html](../../teach/lessons/0027-decision-tree.html)

Decision tree is one hook module, hooks/register.jsx. After each reply, a regex and a small model call check whether Claude is asking you to choose. If it is, a model fork explains each option in a side pane, and you can explore any option in a forked session.

It matters for your mission because this one file uses several hook events and API calls, so it is a good test of whether you can name each call and say why it is there.

## How it was built

1. 1. Check the end of the reply with a regex
2. 2. Ask a small model to confirm the question
3. 3. Explain the choice with a fork
4. 4. Run the check when a turn ends
5. 5. Explore an option by forking at that question
6. 6. Draw one box per option
7. 7. Add the /explain command

The lesson walks through each step with the code from this folder, then shows how to use the mod and checks what you learned.
