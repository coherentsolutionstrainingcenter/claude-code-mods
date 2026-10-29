# effort-picker: instructions

Picks the reasoning effort for each message you send, for that message only, from its words, and never switches the model

## Install

```bash
claude plugin marketplace add <org>/waraxe-claude-mods
claude plugin install effort-picker@waraxe-claude-mods
```

Then open a new chat. Mods load when a chat starts.

## Use

The commands, settings and limits are in [README.md](README.md).

## Before you rely on it

- Requires Claude Code 2.1.287 or later, with mods turned on for your account.
- Check it first: `claude plugin validate plugins/effort-picker` lists the events it hooks and the calls it makes.
- Mods run with your permissions and are not sandboxed.

## Remove

```bash
claude plugin uninstall effort-picker@waraxe-claude-mods
```

Source: Igor Waraxe, MIT, built for this marketplace. Licence: [LICENSE](LICENSE).
