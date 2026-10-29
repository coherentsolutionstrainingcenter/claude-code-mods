# diagram-pane: instructions

A side pane that pins every diagram Claude draws, keeps a live map of the work, and lets you go into boxes and change them

## Install

```bash
claude plugin marketplace add <org>/waraxe-claude-mods
claude plugin install diagram-pane@waraxe-claude-mods
```

Then open a new chat. Mods load when a chat starts.

## Use

The commands, settings and limits are in [README.md](README.md).

## Before you rely on it

- Requires Claude Code 2.1.287 or later, with mods turned on for your account.
- Check it first: `claude plugin validate plugins/diagram-pane` lists the events it hooks and the calls it makes.
- Mods run with your permissions and are not sandboxed.

## Remove

```bash
claude plugin uninstall diagram-pane@waraxe-claude-mods
```

Source: Ray Amjad, MIT, from https://github.com/ray-amjad/claude-code-mods. Licence: [LICENSE](LICENSE).
