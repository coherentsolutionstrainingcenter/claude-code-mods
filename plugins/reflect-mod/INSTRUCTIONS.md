# reflect-mod: instructions

claude-reflect as a Claude Code mod: a model check on each short prompt finds reusable corrections (any language); a band above the prompt saves them to CLAUDE.md on one press

## Install

```bash
claude plugin marketplace add <org>/waraxe-claude-mods
claude plugin install reflect-mod@waraxe-claude-mods
```

Then open a new chat. Mods load when a chat starts.

## Use

The commands, settings and limits are in [README.md](README.md).

## Before you rely on it

- Requires Claude Code 2.1.287 or later, with mods turned on for your account.
- Check it first: `claude plugin validate plugins/reflect-mod` lists the events it hooks and the calls it makes.
- Mods run with your permissions and are not sandboxed.

## Remove

```bash
claude plugin uninstall reflect-mod@waraxe-claude-mods
```

Source: Bayram Annakov, MIT, from https://github.com/BayramAnnakov/claude-reflect. Licence: [LICENSE](LICENSE).
