# diagram-pane: how it works

Lesson 0026, Diagram pane (tier 3): [0026-diagram-pane.html](../../teach/lessons/0026-diagram-pane.html)

Diagram pane is a side pane that pins each mermaid chart or ASCII box diagram in Claude's replies. It also keeps a small map of the files and steps in the work, and a cheap check decides when to redraw it.

For your mission, which asks you to say why each hook and call is used, this mod is the clearest example here of one that calls the model and keeps state, so it shows where a call goes and where the saved state lives.

## How it was built

1. 1. Open the pane and register the command and tools (lines 70 to 90)
2. 2. Pin diagrams and count turns (lines 93 to 109)
3. 3. Ask Haiku whether the work changed shape (lines 249 to 263)
4. 4. Fork the session to draw the map (lines 271 to 278)
5. 5. Save the map in the store (lines 339 to 347)
6. 6. Let Claude read and change the pane (lines 135 to 146)

The lesson walks through each step with the code from this folder, then shows how to use the mod and checks what you learned.
