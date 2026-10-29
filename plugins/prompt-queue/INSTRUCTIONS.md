# prompt-queue: instructions

A prompt typed while Claude is working is held in a stack above the prompt instead of landing in the running turn, and sent once the turn ends. Reorder the stack, edit a row in place, send one first, remove one, flush the lot. Needs function hooks (early access) and an interactive terminal.

## Install

```bash
claude plugin marketplace add <org>/waraxe-claude-mods
claude plugin install prompt-queue@waraxe-claude-mods
```

Then open a new chat. Mods load when a chat starts.

## Use

The commands, settings and limits are in [README.md](README.md).

## Before you rely on it

- Requires Claude Code 2.1.287 or later, with mods turned on for your account.
- Check it first: `claude plugin validate plugins/prompt-queue` lists the events it hooks and the calls it makes.
- Mods run with your permissions and are not sandboxed.

## Remove

```bash
claude plugin uninstall prompt-queue@waraxe-claude-mods
```

Source: galElmalah, MIT, from https://github.com/galElmalah/claude-mods. Licence: [LICENSE](LICENSE).
