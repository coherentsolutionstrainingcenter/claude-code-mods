# collision-guard: instructions

Asks before Edit or Write changes a file that another chat edited in the last 30 minutes, with Proceed and Cancel

## Install

```bash
claude plugin marketplace add <org>/waraxe-claude-mods
claude plugin install collision-guard@waraxe-claude-mods
```

Then open a new chat. Mods load when a chat starts.

## Use

The commands, settings and limits are in [README.md](README.md).

## Before you rely on it

- Requires Claude Code 2.1.287 or later, with mods turned on for your account.
- Check it first: `claude plugin validate plugins/collision-guard` lists the events it hooks and the calls it makes.
- Mods run with your permissions and are not sandboxed.

## Remove

```bash
claude plugin uninstall collision-guard@waraxe-claude-mods
```

Source: Igor Waraxe, MIT, built for this marketplace. Licence: [LICENSE](LICENSE).
