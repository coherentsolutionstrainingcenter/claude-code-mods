# mod-doctor: how it works

Lesson 0005, Mod doctor (tier 1): [0005-mod-doctor.html](../../teach/lessons/0005-mod-doctor.html)

Mod doctor adds a pane that you open with /mod-doctor. The pane reads your installed plugins from claude plugin list, then runs claude plugin validate on each enabled one that has a folder. It shows each verdict with the hook events and calls the plugin declares, and it raises three plain flags.

Your MISSION.md asks you to name the hook events and calls each mod uses and to check a change with claude plugin validate, and this pane gives you both for every installed mod at once.

## How it was built

1. 1. List the plugins
2. 2. Validate each enabled plugin
3. 3. The flags
4. 4. The pane and the Refresh button

The lesson walks through each step with the code from this folder, then shows how to use the mod and checks what you learned.
