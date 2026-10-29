# where-am-i: how it works

Lesson 0017, Session monitor (tier 3): [0017-session-monitor.html](../../teach/lessons/0017-session-monitor.html)

where-am-i draws a band above the prompt. The first line is the session's goal. The second says what Claude is doing now and the next step. A yellow third line says what is waiting on you, when something is. After each turn in the main conversation, Haiku rewrites the recap from your last message, the tools Claude used and Claude's reply. /where gives a longer recap in a few bullets.

It covers this session only. The session monitor idea (2c), which would show every open chat as waiting, working or done, is video only, so there is no code to ship for it.

## How it was built

1. 1. Declare the hook module
2. 2. Keep the recap in host state
3. 3. Watch Claude's tool calls
4. 4. Label a call in plain words
5. 5. Summarize when the turn ends
6. 6. Ask Haiku for the recap
7. 7. Draw the band

The lesson walks through each step with the code from this folder, then shows how to use the mod and checks what you learned.
