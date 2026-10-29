# repo-heatmap: instructions

A /heatmap pane that counts this repository's tracked files by top-level folder and kind, from git ls-files, as rows of colored bars

## Install

```bash
claude plugin marketplace add <org>/waraxe-claude-mods
claude plugin install repo-heatmap@waraxe-claude-mods
```

Then open a new chat. Mods load when a chat starts.

## Use

The commands, settings and limits are in [README.md](README.md).

## Before you rely on it

- Requires Claude Code 2.1.287 or later, with mods turned on for your account.
- Needs git.
- Check it first: `claude plugin validate plugins/repo-heatmap` lists the events it hooks and the calls it makes.
- Mods run with your permissions and are not sandboxed.

## Remove

```bash
claude plugin uninstall repo-heatmap@waraxe-claude-mods
```

Source: Igor Waraxe, MIT, built for this marketplace. Licence: [LICENSE](LICENSE).
