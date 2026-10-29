# model-router: instructions

Picks haiku, sonnet or opus for each subagent Claude starts without naming a model, from one small Haiku call, and never changes the main chat's model

## Install

```bash
claude plugin marketplace add <org>/waraxe-claude-mods
claude plugin install model-router@waraxe-claude-mods
```

Then open a new chat. Mods load when a chat starts.

## Use

The commands, settings and limits are in [README.md](README.md).

## Before you rely on it

- Requires Claude Code 2.1.287 or later, with mods turned on for your account.
- Check it first: `claude plugin validate plugins/model-router` lists the events it hooks and the calls it makes.
- Mods run with your permissions and are not sandboxed.

## Remove

```bash
claude plugin uninstall model-router@waraxe-claude-mods
```

Source: Igor Waraxe, MIT, built for this marketplace. Licence: [LICENSE](LICENSE).
