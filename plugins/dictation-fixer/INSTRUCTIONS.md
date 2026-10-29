# dictation-fixer: instructions

Tidies long messages that look dictated, then asks whether to send the cleaned version or the text as typed

## Install

```bash
claude plugin marketplace add <org>/waraxe-claude-mods
claude plugin install dictation-fixer@waraxe-claude-mods
```

Then open a new chat. Mods load when a chat starts.

## Use

The commands, settings and limits are in [README.md](README.md).

## Before you rely on it

- Requires Claude Code 2.1.287 or later, with mods turned on for your account.
- Check it first: `claude plugin validate plugins/dictation-fixer` lists the events it hooks and the calls it makes.
- Mods run with your permissions and are not sandboxed.

## Remove

```bash
claude plugin uninstall dictation-fixer@waraxe-claude-mods
```

Source: Igor Waraxe, MIT, built for this marketplace. Licence: [LICENSE](LICENSE).
