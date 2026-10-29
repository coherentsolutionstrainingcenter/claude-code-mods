# prismantis: how it works

Lesson 0029, Prismantis (tier 4): [0029-prismantis.html](../../teach/lessons/0029-prismantis.html)

Prismantis is one mod with a hook module of 856 lines. It registers its own drawing for assistant replies, user prompts, tool rows and command output. When it has nothing to draw, it passes the event on with next(e), so Claude Code's own drawing or another mod can take over.

It matters for your mission because it uses ten different event names and also exposes an API to other mods, which is the case you must explain when you list a mod's hooks and calls.

## How it was built

1. 1. Add the placeholder and read the options
2. 2. Draw tool calls as one line
3. 3. Handle the /prismantis command
4. 4. Draw assistant replies
5. 5. Let other mods draw Markdown
6. 6. Declare the types for other mods

The lesson walks through each step with the code from this folder, then shows how to use the mod and checks what you learned.
