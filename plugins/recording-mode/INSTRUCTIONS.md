# recording-mode: instructions

/rec before you record: masks keys, personal details, and business figures on screen and keeps private files closed (/rec strict, /rec off, /rec config)

## Install

```bash
claude plugin marketplace add coherentsolutionstrainingcenter/claude-code-mods
claude plugin install recording-mode@waraxe-claude-mods
```

Then open a new chat. Mods load when a chat starts.

## Use

The commands, settings and limits are in [README.md](README.md).

## Before you rely on it

- Requires Claude Code 2.1.287 or later, with mods turned on for your account.
- Check it first: `claude plugin validate plugins/recording-mode` lists the events it hooks and the calls it makes.
- Mods run with your permissions and are not sandboxed.

## Remove

```bash
claude plugin uninstall recording-mode@waraxe-claude-mods
```

Source: Nate Herk, MIT, from https://github.com/nateherkai/claude-code-mods. Licence: [LICENSE](LICENSE).
