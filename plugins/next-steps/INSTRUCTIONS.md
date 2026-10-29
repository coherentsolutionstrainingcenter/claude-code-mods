# next-steps: instructions

After each turn, 2 or 3 likely next prompts above the prompt. Press 1, 2 or 3 in an empty prompt to draft one, 0 to dismiss.

## Install

```bash
claude plugin marketplace add <org>/waraxe-claude-mods
claude plugin install next-steps@waraxe-claude-mods
```

Then open a new chat. Mods load when a chat starts.

## Use

The commands, settings and limits are in [README.md](README.md).

## Before you rely on it

- Requires Claude Code 2.1.287 or later, with mods turned on for your account.
- Check it first: `claude plugin validate plugins/next-steps` lists the events it hooks and the calls it makes.
- Mods run with your permissions and are not sandboxed.

## Remove

```bash
claude plugin uninstall next-steps@waraxe-claude-mods
```

Source: Hamza Zafar, MIT, from https://github.com/hamzafer/claude-code-mods. Licence: [LICENSE](LICENSE).
