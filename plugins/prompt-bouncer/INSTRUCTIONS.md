# prompt-bouncer: instructions

Bounces vague prompts before Claude sees them, and suggests the project's own term

## Install

```bash
claude plugin marketplace add coherentsolutionstrainingcenter/claude-code-mods
claude plugin install prompt-bouncer@waraxe-claude-mods
```

Then open a new chat. Mods load when a chat starts.

## Use

The commands, settings and limits are in [README.md](README.md).

## Before you rely on it

- Requires Claude Code 2.1.287 or later, with mods turned on for your account.
- Check it first: `claude plugin validate plugins/prompt-bouncer` lists the events it hooks and the calls it makes.
- Mods run with your permissions and are not sandboxed.

## Remove

```bash
claude plugin uninstall prompt-bouncer@waraxe-claude-mods
```

Source: Ray Amjad, MIT, from https://github.com/ray-amjad/claude-code-mods. Licence: [LICENSE](LICENSE).
