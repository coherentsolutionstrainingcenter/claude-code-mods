# mission-control: instructions

/mission opens a live map of the main agent, its subagents and every tool call, plus a code map of the files they touch.

## Install

```bash
claude plugin marketplace add <org>/waraxe-claude-mods
claude plugin install mission-control@waraxe-claude-mods
```

Then open a new chat. Mods load when a chat starts.

## Use

The commands, settings and limits are in [README.md](README.md).

## Before you rely on it

- Requires Claude Code 2.1.287 or later, with mods turned on for your account.
- Check it first: `claude plugin validate plugins/mission-control` lists the events it hooks and the calls it makes.
- Mods run with your permissions and are not sandboxed.

## Remove

```bash
claude plugin uninstall mission-control@waraxe-claude-mods
```

Source: Hamza Zafar, MIT, from https://github.com/hamzafer/claude-code-mods. Licence: [LICENSE](LICENSE).
