# terminal-browser: how it works

Lesson 0031, Terminal browser (tier 4): [0031-terminal-browser.html](../../teach/lessons/0031-terminal-browser.html)

terminal-browser is a plugin with one hook module, hooks/register.tsx. It starts a local bridge with the terminal-browser program, reads new frames from it, and draws them in a side pane named browser. It also adds the /browser command, and an open and close tool for Claude when you turn on the agentTool option. Other plugins can use the pane through $.browser.open and $.browser.close.

It matters for your mission because it calls a local program, talks to it over HTTP with a token, and offers an API to other plugins, so you must be able to name each call and say why it is there.

## How it was built

1. 1. Expose browser.open and browser.close
2. 2. Check the program and start the bridge
3. 3. Talk to the bridge over localhost with a token
4. 4. Watch for new frames and draw them
5. 5. Open the pane and point it at a page
6. 6. Register /browser and the optional tools
7. 7. Draw the pane and forward keys and scrolling

The lesson walks through each step with the code from this folder, then shows how to use the mod and checks what you learned.
