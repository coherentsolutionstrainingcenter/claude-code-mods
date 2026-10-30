# prismantis: instructions

Colorful, themeable rendering for Claude Code replies: tables, headings, code, numbers, paths and links.

## Install

```bash
claude plugin marketplace add coherentsolutionstrainingcenter/claude-code-mods
claude plugin install prismantis@waraxe-claude-mods
```

Then open a new chat. Mods load when a chat starts.

## Use

The commands, settings and limits are in [README.md](README.md).

## Before you rely on it

- Requires Claude Code 2.1.287 or later, with mods turned on for your account.
- Check it first: `claude plugin validate plugins/prismantis` lists the events it hooks and the calls it makes.
- Mods run with your permissions and are not sandboxed.

## Remove

```bash
claude plugin uninstall prismantis@waraxe-claude-mods
```

Source: NahumLitvin, MIT, from https://github.com/NahumLitvin/prismantis. Licence: [LICENSE](LICENSE).
