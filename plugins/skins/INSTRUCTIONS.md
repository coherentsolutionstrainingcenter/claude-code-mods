# skins: instructions

Skins for Claude Code: tool rows that open onto their input and answer, highlighted code, diff, table, math, Mermaid and shell cards, links, folding, a usage band, a calm mode and fifteen themes. /skin swaps them live.

## Install

```bash
claude plugin marketplace add coherentsolutionstrainingcenter/claude-code-mods
claude plugin install skins@waraxe-claude-mods
```

Then open a new chat. Mods load when a chat starts.

## Use

The commands, settings and limits are in [README.md](README.md).

## Before you rely on it

- Requires Claude Code 2.1.287 or later, with mods turned on for your account.
- Check it first: `claude plugin validate plugins/skins` lists the events it hooks and the calls it makes.
- Mods run with your permissions and are not sandboxed.

## Remove

```bash
claude plugin uninstall skins@waraxe-claude-mods
```

Source: hellosverre, MIT, from https://github.com/hellosverre/claude-skins. Licence: [LICENSE](LICENSE).
