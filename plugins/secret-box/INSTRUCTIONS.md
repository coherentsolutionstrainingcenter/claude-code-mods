# secret-box: instructions

Claude can use a secret without seeing it: a masked box saves keys to .env and gives Claude a placeholder, every key a tool prints comes back as a placeholder, and committing .env is refused

## Install

```bash
claude plugin marketplace add coherentsolutionstrainingcenter/claude-code-mods
claude plugin install secret-box@waraxe-claude-mods
```

Then open a new chat. Mods load when a chat starts.

## Use

The commands, settings and limits are in [README.md](README.md).

## Before you rely on it

- Requires Claude Code 2.1.287 or later, with mods turned on for your account.
- Check it first: `claude plugin validate plugins/secret-box` lists the events it hooks and the calls it makes.
- Mods run with your permissions and are not sandboxed.

## Remove

```bash
claude plugin uninstall secret-box@waraxe-claude-mods
```

Source: Ray Amjad, MIT, from https://github.com/ray-amjad/claude-code-mods. Licence: [LICENSE](LICENSE).
