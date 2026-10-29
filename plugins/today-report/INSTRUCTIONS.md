# today-report: instructions

Today's Report: totals your Claude Code tasks, the time they would have taken you, and tokens by day, week, month and year, from your session logs

## Install

```bash
claude plugin marketplace add <org>/waraxe-claude-mods
claude plugin install today-report@waraxe-claude-mods
```

Then open a new chat. Mods load when a chat starts.

## Use

The commands, settings and limits are in [README.md](README.md).

## Before you rely on it

- Requires Claude Code 2.1.287 or later, with mods turned on for your account.
- Needs python3.
- Check it first: `claude plugin validate plugins/today-report` lists the events it hooks and the calls it makes.
- Mods run with your permissions and are not sandboxed.

## Remove

```bash
claude plugin uninstall today-report@waraxe-claude-mods
```

Source: Igor Waraxe, MIT, built for this marketplace. Licence: [LICENSE](LICENSE).
