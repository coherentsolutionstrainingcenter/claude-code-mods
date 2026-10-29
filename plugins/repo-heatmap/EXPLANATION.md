# repo-heatmap: how it works

Lesson 0035, Repo heatmap (tier 5): [0035-repo-heatmap.html](../../teach/lessons/0035-repo-heatmap.html)

/heatmap runs git ls-files in the session's folder, groups the tracked files by top-level folder and by kind, and draws one colored bar per folder. The kinds are code, tests, docs, design (svg, png, jpg, fig, sketch), data (json, csv, sql, db, yaml), config and other. The biggest folders come first, up to 15 rows, with a legend of each kind's count above them and a total line below. Outside a git repository it says so and does not walk the disk. A Refresh button counts again. It makes no model calls.

Your mission asks you to say which hook events and API calls a mod uses and why, and this mod shows the plain pattern for running a host command from a pane: $.process.run, then a $.state atom the pane redraws from.

## How it was built

1. 1. Open the pane, then count
2. 2. Ask git for the file list
3. 3. Group the files by top-level folder
4. 4. Sort each file into a kind
5. 5. Split each bar into colored runs
6. 6. Draw one row per folder
7. 7. Refresh, one run at a time

The lesson walks through each step with the code from this folder, then shows how to use the mod and checks what you learned.
