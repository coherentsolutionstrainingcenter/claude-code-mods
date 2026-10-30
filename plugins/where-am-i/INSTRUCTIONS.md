# where-am-i: instructions

A live recap above the prompt: goal, doing now, waiting on you, next. /where for a longer one.

## Install

```bash
claude plugin marketplace add coherentsolutionstrainingcenter/claude-code-mods
claude plugin install where-am-i@waraxe-claude-mods
```

Then open a new chat. Mods load when a chat starts.

## Use

The commands, settings and limits are in [README.md](README.md).

## Before you rely on it

- Requires Claude Code 2.1.287 or later, with mods turned on for your account.
- Check it first: `claude plugin validate plugins/where-am-i` lists the events it hooks and the calls it makes.
- Mods run with your permissions and are not sandboxed.

## Remove

```bash
claude plugin uninstall where-am-i@waraxe-claude-mods
```

Source: Hamza Zafar, MIT, from https://github.com/hamzafer/claude-code-mods. Licence: [LICENSE](LICENSE).
