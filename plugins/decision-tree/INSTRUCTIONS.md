# decision-tree: instructions

When Claude ends a reply with a question, explains the choice in a side pane and lets you explore any option, or your own, in a real forked session

## Install

```bash
claude plugin marketplace add <org>/waraxe-claude-mods
claude plugin install decision-tree@waraxe-claude-mods
```

Then open a new chat. Mods load when a chat starts.

## Use

The commands, settings and limits are in [README.md](README.md).

## Before you rely on it

- Requires Claude Code 2.1.287 or later, with mods turned on for your account.
- Check it first: `claude plugin validate plugins/decision-tree` lists the events it hooks and the calls it makes.
- Mods run with your permissions and are not sandboxed.

## Remove

```bash
claude plugin uninstall decision-tree@waraxe-claude-mods
```

Source: Ray Amjad, MIT, from https://github.com/ray-amjad/claude-code-mods. Licence: [LICENSE](LICENSE).
