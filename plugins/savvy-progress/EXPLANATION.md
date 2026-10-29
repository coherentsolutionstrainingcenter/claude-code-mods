# savvy-progress: how it works

Lesson 0019, Work panel (tier 3): [0019-work-panel.html](../../teach/lessons/0019-work-panel.html)

The README says the plugin was made for the savvy-flow skill and is useful with any subagents. The bar shows the flow's title, its phase, accepted tasks out of planned ones, and a button with the crew size that opens the panel. The panel lists every subagent of the session, with model, effort, task progress, context, estimated cost and time. The savvy-flow skill itself is not in this marketplace.

It serves your mission because it uses seven hook events, two tools of its own and a prompt change, and each one has a reason you can name.

## How it was built

1. 1. Keep the flow, the runs and the panel in atoms
2. 2. Register the two tools and the command
3. 3. Take flow reports from the main session only
4. 4. Brief each savvy worker and add a row for every subagent
5. 5. Count each model request of a subagent
6. 6. Estimate the cost from a price table
7. 7. Draw the bar above the prompt

The lesson walks through each step with the code from this folder, then shows how to use the mod and checks what you learned.
