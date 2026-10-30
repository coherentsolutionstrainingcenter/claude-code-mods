# terminal-pet: instructions

A small text pet in the band above the prompt that eats the files Claude reads, with /pet on, /pet off and /pet name

## Install

```bash
claude plugin marketplace add coherentsolutionstrainingcenter/claude-code-mods
claude plugin install terminal-pet@waraxe-claude-mods
```

Then open a new chat. Mods load when a chat starts.

## Use

The commands, settings and limits are in [README.md](README.md).

## Before you rely on it

- Requires Claude Code 2.1.287 or later, with mods turned on for your account.
- Check it first: `claude plugin validate plugins/terminal-pet` lists the events it hooks and the calls it makes.
- Mods run with your permissions and are not sandboxed.

## Remove

```bash
claude plugin uninstall terminal-pet@waraxe-claude-mods
```

Source: Igor Waraxe, MIT, built for this marketplace. Licence: [LICENSE](LICENSE).
