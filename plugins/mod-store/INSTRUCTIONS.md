# mod-store: instructions

/mods: browse, search and install community Claude Code mods from a pane, with what each one can access shown before you install

## Install

```bash
claude plugin marketplace add coherentsolutionstrainingcenter/claude-code-mods
claude plugin install mod-store@waraxe-claude-mods
```

Then open a new chat. Mods load when a chat starts.

## Use

The commands, settings and limits are in [README.md](README.md).

## Before you rely on it

- Requires Claude Code 2.1.287 or later, with mods turned on for your account.
- Check it first: `claude plugin validate plugins/mod-store` lists the events it hooks and the calls it makes.
- Mods run with your permissions and are not sandboxed.

## Remove

```bash
claude plugin uninstall mod-store@waraxe-claude-mods
```

Source: hellosverre, MIT, from https://github.com/hellosverre/mod-store. Licence: [LICENSE](LICENSE).
