# replay-theater: instructions

Replay Theater: step through the file edits Claude made in the last turn, one diff at a time.

## Install

```bash
claude plugin marketplace add <org>/waraxe-claude-mods
claude plugin install replay-theater@waraxe-claude-mods
```

Then open a new chat. Mods load when a chat starts.

## Use

The commands, settings and limits are in [README.md](README.md).

## Before you rely on it

- Requires Claude Code 2.1.287 or later, with mods turned on for your account.
- Check it first: `claude plugin validate plugins/replay-theater` lists the events it hooks and the calls it makes.
- Mods run with your permissions and are not sandboxed.

## Remove

```bash
claude plugin uninstall replay-theater@waraxe-claude-mods
```

Source: Anthropic (Claude Code DevRel), Apache-2.0, from https://github.com/anthropics/claude-code-playground/tree/main/claude-code/mods. Licence: [LICENSE](LICENSE).
