# snake: instructions

Snake in a pane while Claude works, paused when it's done. Opt-in, so nothing opens until /snake.

## Install

```bash
claude plugin marketplace add coherentsolutionstrainingcenter/claude-code-mods
claude plugin install snake@waraxe-claude-mods
```

Then open a new chat. Mods load when a chat starts.

## Use

The commands, settings and limits are in [README.md](README.md).

## Before you rely on it

- Requires Claude Code 2.1.287 or later, with mods turned on for your account.
- Check it first: `claude plugin validate plugins/snake` lists the events it hooks and the calls it makes.
- Mods run with your permissions and are not sandboxed.

## Remove

```bash
claude plugin uninstall snake@waraxe-claude-mods
```

Source: Hamza Zafar, MIT, from https://github.com/hamzafer/claude-code-mods. Licence: [LICENSE](LICENSE).
