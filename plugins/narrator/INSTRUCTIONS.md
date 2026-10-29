# narrator: instructions

Reads the last 240 characters of each finished reply aloud with macOS say, off by default and switched with /narrator on and /narrator off

## Install

```bash
claude plugin marketplace add <org>/waraxe-claude-mods
claude plugin install narrator@waraxe-claude-mods
```

Then open a new chat. Mods load when a chat starts.

## Use

The commands, settings and limits are in [README.md](README.md).

## Before you rely on it

- Requires Claude Code 2.1.287 or later, with mods turned on for your account.
- Needs macOS (say).
- Check it first: `claude plugin validate plugins/narrator` lists the events it hooks and the calls it makes.
- Mods run with your permissions and are not sandboxed.

## Remove

```bash
claude plugin uninstall narrator@waraxe-claude-mods
```

Source: Igor Waraxe, MIT, built for this marketplace. Licence: [LICENSE](LICENSE).
