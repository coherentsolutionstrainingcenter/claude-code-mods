# model-router: how it works

Lesson 0038, Model router (tier 5): [0038-model-router.html](../../teach/lessons/0038-model-router.html)

When Claude hands work to a subagent, it calls the Agent tool, and it often names no model. The subagent then runs on its type's model or the main chat's. model-router steps in at that moment. It sends the task's short description to Haiku, which sorts it as simple, standard or hard, and that one subagent runs on haiku, sonnet or opus. A dim line in the transcript names the label and the model. The main chat keeps its model, so nothing is reread.

The router is off until you type /model-router on.

## How it was built

1. 1. Map three labels to three models
2. 2. Route only plain spawns
3. 3. Ask Haiku once
4. 4. Set the model for this subagent only
5. 5. Off by default, with on, off and status

The lesson walks through each step with the code from this folder, then shows how to use the mod and checks what you learned.
