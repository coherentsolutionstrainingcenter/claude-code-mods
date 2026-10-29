# usage-meter: instructions

Your plan's 5-hour and 7-day usage as small bars above the prompt, with the reset countdown and the session's cost.

## Install

```bash
claude plugin marketplace add <org>/waraxe-claude-mods
claude plugin install usage-meter@waraxe-claude-mods
```

Then open a new chat. Mods load when a chat starts.

## Use

The commands, settings and limits are in [README.md](README.md).

## Before you rely on it

- Requires Claude Code 2.1.287 or later, with mods turned on for your account.
- Check it first: `claude plugin validate plugins/usage-meter` lists the events it hooks and the calls it makes.
- Mods run with your permissions and are not sandboxed.

## Remove

```bash
claude plugin uninstall usage-meter@waraxe-claude-mods
```

Source: Hamza Zafar, MIT, from https://github.com/hamzafer/claude-code-mods. Licence: [LICENSE](LICENSE).
