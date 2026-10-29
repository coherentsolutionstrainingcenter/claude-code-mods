# delete-backup: instructions

Copies the files an rm is about to delete into a backup folder first, so /undo-delete can put the newest deletion back

## Install

```bash
claude plugin marketplace add <org>/waraxe-claude-mods
claude plugin install delete-backup@waraxe-claude-mods
```

Then open a new chat. Mods load when a chat starts.

## Use

The commands, settings and limits are in [README.md](README.md).

## Before you rely on it

- Requires Claude Code 2.1.287 or later, with mods turned on for your account.
- Check it first: `claude plugin validate plugins/delete-backup` lists the events it hooks and the calls it makes.
- Mods run with your permissions and are not sandboxed.

## Remove

```bash
claude plugin uninstall delete-backup@waraxe-claude-mods
```

Source: Igor Waraxe, MIT, built for this marketplace. Licence: [LICENSE](LICENSE).
