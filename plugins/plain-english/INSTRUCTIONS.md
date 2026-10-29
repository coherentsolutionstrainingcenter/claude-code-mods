# plain-english: instructions

While on, rewrites each long reply in plain language with a short Next steps list, in a side pane, and leaves Claude's reply unchanged

## Install

```bash
claude plugin marketplace add <org>/waraxe-claude-mods
claude plugin install plain-english@waraxe-claude-mods
```

Then open a new chat. Mods load when a chat starts.

## Use

The commands, settings and limits are in [README.md](README.md).

## Before you rely on it

- Requires Claude Code 2.1.287 or later, with mods turned on for your account.
- Check it first: `claude plugin validate plugins/plain-english` lists the events it hooks and the calls it makes.
- Mods run with your permissions and are not sandboxed.

## Remove

```bash
claude plugin uninstall plain-english@waraxe-claude-mods
```

Source: Igor Waraxe, MIT, built for this marketplace. Licence: [LICENSE](LICENSE).
