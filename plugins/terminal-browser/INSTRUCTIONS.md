# terminal-browser: instructions

A browser running directly inside claude code. Preview websites, view HTML documents, and let your agent control the built in browser.

## Install

```bash
claude plugin marketplace add coherentsolutionstrainingcenter/claude-code-mods
claude plugin install terminal-browser@waraxe-claude-mods
```

Then open a new chat. Mods load when a chat starts.

## Use

The commands, settings and limits are in [README.md](README.md).

## Before you rely on it

- Requires Claude Code 2.1.287 or later, with mods turned on for your account.
- Needs the terminal-browser app from Zenbu Labs.
- Check it first: `claude plugin validate plugins/terminal-browser` lists the events it hooks and the calls it makes.
- Mods run with your permissions and are not sandboxed.

## Remove

```bash
claude plugin uninstall terminal-browser@waraxe-claude-mods
```

Source: Zenbu Labs, MIT, from https://github.com/zenbu-labs/terminal-browser. Licence: [LICENSE](LICENSE).
