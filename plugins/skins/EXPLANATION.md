# skins: how it works

Lesson 0033, Claude Skins (tier 5): [0033-claude-skins.html](../../teach/lessons/0033-claude-skins.html)

Claude Skins is a plugin named skins. It changes how Claude Code draws the transcript. Tool calls become rows with icons and timings, and edits become diff cards. Code, tables and Mermaid charts become cards too, and /skin switches between the 16 built-in skins while a session runs.

It matters for your mission because it draws over Claude Code's own rows, so it shows which hook events and API calls a large mod depends on, and why.

## How it was built

1. 1. Declare the plugin and its one module
2. 2. Add a markdown service for other mods
3. 3. Register the /skin command and the design tool
4. 4. Answer the design tool in a tool.call hook
5. 5. Draw the tool rows with ui.render
6. 6. Draw the usage band above the prompt

The lesson walks through each step with the code from this folder, then shows how to use the mod and checks what you learned.
