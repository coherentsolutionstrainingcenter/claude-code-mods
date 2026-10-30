# blast-radius: instructions

Holds risky shell commands (rm -rf, git reset --hard, git clean, force push, migrations) and shows what they would change, with Proceed and Cancel buttons.

## Install

```bash
claude plugin marketplace add coherentsolutionstrainingcenter/claude-code-mods
claude plugin install blast-radius@waraxe-claude-mods
```

Then open a new chat. Mods load when a chat starts.

## Use

The commands, settings and limits are in [README.md](README.md).

## Before you rely on it

- Requires Claude Code 2.1.287 or later, with mods turned on for your account.
- Check it first: `claude plugin validate plugins/blast-radius` lists the events it hooks and the calls it makes.
- Mods run with your permissions and are not sandboxed.

## Remove

```bash
claude plugin uninstall blast-radius@waraxe-claude-mods
```

Source: Anthropic (Claude Code DevRel), Apache-2.0, from https://github.com/anthropics/claude-code-playground/tree/main/claude-code/mods. Licence: [LICENSE](LICENSE).
