# session-band: instructions

Band above the prompt: turn number, output speed, turn and session cost, prompt cache countdown and context fill; notifies before the cache expires.

## Install

```bash
claude plugin marketplace add <org>/waraxe-claude-mods
claude plugin install session-band@waraxe-claude-mods
```

Then open a new chat. Mods load when a chat starts.

## Use

The commands, settings and limits are in [README.md](README.md).

## Before you rely on it

- Requires Claude Code 2.1.287 or later, with mods turned on for your account.
- Check it first: `claude plugin validate plugins/session-band` lists the events it hooks and the calls it makes.
- Mods run with your permissions and are not sandboxed.

## Remove

```bash
claude plugin uninstall session-band@waraxe-claude-mods
```

Source: JohnnyVizz, MIT, from https://github.com/JohnnyVizz/claude-kit. Licence: [LICENSE](LICENSE).
