# ctx-handoff: how it works

Lesson 0013, Handoff (tier 2): [0013-handoff.html](../../teach/lessons/0013-handoff.html)

ctx-handoff is a toolkit for long sessions. This lesson follows its handoff. With auto_handoff on, at 600,000 tokens it waits for Claude and its subagents to finish, has a fork write a summary, clears the chat, and sends the summary as the first message of the fresh conversation. auto_handoff is off by default, so Claude Code's own compact takes over unless you turn it on or run /handoff now.

The same plugin keeps the prompt cache warm while you are away, keeps project notes, and nudges Claude when it repeats a failure or says it is done without checking. The guide covers those parts.

## How it was built

1. 1. Declare the hook module
2. 2. Set the threshold
3. 3. Decide at each stop
4. 4. Ask a fork for the summary
5. 5. Tell the fresh chat what happened
6. 6. Clear, then submit
7. 7. Keep the cache warm while you are away

The lesson walks through each step with the code from this folder, then shows how to use the mod and checks what you learned.
