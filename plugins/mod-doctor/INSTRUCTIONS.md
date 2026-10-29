# mod-doctor: instructions

Mod doctor audits your installed mods with the plugin validator and flags failed checks, shared tool.call hooks and duplicate names

## Install

```bash
claude plugin marketplace add <org>/waraxe-claude-mods
claude plugin install mod-doctor@waraxe-claude-mods
```

Then open a new chat. Mods load when a chat starts.

## Use

The commands, settings and limits are in [README.md](README.md).

## Before you rely on it

- Requires Claude Code 2.1.287 or later, with mods turned on for your account.
- Needs the claude command on the PATH.
- Check it first: `claude plugin validate plugins/mod-doctor` lists the events it hooks and the calls it makes.
- Mods run with your permissions and are not sandboxed.

## Remove

```bash
claude plugin uninstall mod-doctor@waraxe-claude-mods
```

Source: Igor Waraxe, MIT, built for this marketplace. Licence: [LICENSE](LICENSE).
