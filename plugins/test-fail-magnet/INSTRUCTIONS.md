# test-fail-magnet: instructions

Keeps the failing tests from your last test run in a Failing tests pane, with Fix to send them to Claude and Dismiss to clear them

## Install

```bash
claude plugin marketplace add coherentsolutionstrainingcenter/claude-code-mods
claude plugin install test-fail-magnet@waraxe-claude-mods
```

Then open a new chat. Mods load when a chat starts.

## Use

The commands, settings and limits are in [README.md](README.md).

## Before you rely on it

- Requires Claude Code 2.1.287 or later, with mods turned on for your account.
- Check it first: `claude plugin validate plugins/test-fail-magnet` lists the events it hooks and the calls it makes.
- Mods run with your permissions and are not sandboxed.

## Remove

```bash
claude plugin uninstall test-fail-magnet@waraxe-claude-mods
```

Source: Igor Waraxe, MIT, built for this marketplace. Licence: [LICENSE](LICENSE).
