# jev-skill-suggestion: instructions

Scores every skill against your prompt with TypeSafe Jev as you type; observe, block or steer skill loading

## Install

```bash
claude plugin marketplace add <org>/waraxe-claude-mods
claude plugin install jev-skill-suggestion@waraxe-claude-mods
```

Then open a new chat. Mods load when a chat starts.

## Use

The commands, settings and limits are in [README.md](README.md).

## Before you rely on it

- Requires Claude Code 2.1.287 or later, with mods turned on for your account.
- Needs a TypeSafe Jev API key.
- Check it first: `claude plugin validate plugins/jev-skill-suggestion` lists the events it hooks and the calls it makes.
- Mods run with your permissions and are not sandboxed.

## Remove

```bash
claude plugin uninstall jev-skill-suggestion@waraxe-claude-mods
```

Source: Ray Amjad, MIT, from https://github.com/ray-amjad/claude-code-mods. Licence: [LICENSE](LICENSE).
