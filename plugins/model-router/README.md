# model-router

## What it does

model-router picks the model for each subagent Claude starts. When Claude calls the Agent tool without naming a model, the mod sends the task's short description to Haiku in one small call, which sorts it as simple, standard or hard. The subagent then runs on haiku, sonnet or opus. The main chat's model never changes.

Each pick shows one dim line in the transcript, for example `Model router: "Refactor auth module" is hard, so this subagent runs on opus.`

## Install

```bash
claude plugin marketplace add coherentsolutionstrainingcenter/claude-code-mods
claude plugin install model-router@waraxe-claude-mods
```

## Use

The router is off until you turn it on.

- `/model-router on` starts picking a model for each new subagent.
- `/model-router off` stops it. Subagents run on the model Claude or their agent type names.
- `/model-router status` says whether it is on, and how many subagents went to each model since the mod loaded.

The on or off switch is saved in the mod's own store, so it holds across sessions. There are no settings.

## Cost

Each subagent the router picks for costs one Haiku call: a fixed classifier prompt, the few words of the description, and a one-word answer. The types do not give a token count. The call runs through your own Claude Code session and plan, so it goes to Anthropic and nowhere else. The model it picks matters more: a simple task on haiku costs less than on opus, and a hard task sent to opus from a Sonnet chat costs more than Sonnet would.

## Limits

- Only spawns with no model are routed. A model Claude names stays. Forks, resumed agents, teammates and workflow agents are left alone.
- The pick replaces an agent type's own model too (the `model` in its definition), because the API does not show a type's own model to the hook.
- A setting that forces one model on every subagent outranks the pick.
- The classifier sees only the short description (3 to 5 words), not the full prompt, so it can misjudge a task.
- If the Haiku call fails, or names no label, the spawn goes on unchanged. The reason goes to the debug log (`claude --debug`).
- A plugin's own `$.agent.spawn` that names no model is routed too.
- Each routed spawn waits for the Haiku call before the subagent starts.

## How it works

An `agent.spawn` hook reads what is about to start. If no model is named, it calls `$.model.classify` with the labels simple, standard and hard and `{ model: 'haiku' }`, maps the label to a model, and passes on `next({ ...e, model })`, which sets the model for that subagent alone. The lesson walks through the code: [teach/lessons/0038-model-router.html](../../teach/lessons/0038-model-router.html).

Written by Igor Waraxe. MIT licence, see [LICENSE](LICENSE).
