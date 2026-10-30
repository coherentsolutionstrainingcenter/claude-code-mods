# savvy-progress: instructions

Progress bar above the prompt for /savvy-flow, plus an agents panel (/agents-info): running, finished and planned subagents with model, task progress, context, cost and time.

## Install

```bash
claude plugin marketplace add coherentsolutionstrainingcenter/claude-code-mods
claude plugin install savvy-progress@waraxe-claude-mods
```

Then open a new chat. Mods load when a chat starts.

## Use

The commands, settings and limits are in [README.md](README.md).

## Before you rely on it

- Requires Claude Code 2.1.287 or later, with mods turned on for your account.
- Check it first: `claude plugin validate plugins/savvy-progress` lists the events it hooks and the calls it makes.
- Mods run with your permissions and are not sandboxed.

## Remove

```bash
claude plugin uninstall savvy-progress@waraxe-claude-mods
```

Source: JohnnyVizz, MIT, from https://github.com/JohnnyVizz/claude-kit. Licence: [LICENSE](LICENSE).
