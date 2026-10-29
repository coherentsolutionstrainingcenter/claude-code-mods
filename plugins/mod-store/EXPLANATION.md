# mod-store: how it works

Lesson 0004, Mods manager (tier 1): [0004-mods-manager.html](../../teach/lessons/0004-mods-manager.html)

Mod Store is an app store for Claude Code mods, inside Claude Code. /mods opens a side pane. You search, filter and sort the catalogue from mods.aidojo.si. Every mod gets an access badge, from green Display only to red Network. Install shows the exact command and the mod's access, and waits for you to confirm. The mod also gives Claude two tools, search_mods and show_mod, so you can ask Claude to find a mod. Claude cannot install anything: you press Install yourself.

Your mission is to explain each mod before other people install it, and Mod Store does the same in code: a mod's page shows what it can access before Install runs anything.

## How it was built

1. 1. Register the command and two tools
2. 2. Fetch the catalogue in ranges
3. 3. Keep a slim copy for six hours
4. 4. Search, filter and sort
5. 5. Answer Claude's search
6. 6. Ask before you install
7. 7. Run the install command

The lesson walks through each step with the code from this folder, then shows how to use the mod and checks what you learned.
