# cache-tax: instructions

A Claude Code mod that keeps the one-hour prompt cache warm during breaks and stops a cold send once with its estimated rewrite cost. Warming uses model requests and costs tokens. Requires Claude Code 2.1.287+.

## Install

```bash
claude plugin marketplace add coherentsolutionstrainingcenter/claude-code-mods
claude plugin install cache-tax@waraxe-claude-mods
```

Then open a new chat. Mods load when a chat starts.

## Use

The commands, settings and limits are in [README.md](README.md).

## Before you rely on it

- Requires Claude Code 2.1.287 or later, with mods turned on for your account.
- Check it first: `claude plugin validate plugins/cache-tax` lists the events it hooks and the calls it makes.
- Mods run with your permissions and are not sandboxed.

## Remove

```bash
claude plugin uninstall cache-tax@waraxe-claude-mods
```

Source: karanb192, MIT, from https://github.com/karanb192/cache-tax. Licence: [LICENSE](LICENSE).
