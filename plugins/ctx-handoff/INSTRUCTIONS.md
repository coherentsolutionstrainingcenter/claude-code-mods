# ctx-handoff: instructions

Turns what you teach Claude into project notes, catches its usual slips, keeps the cache warm while you're away, and picks long sessions back up

## Install

```bash
claude plugin marketplace add <org>/waraxe-claude-mods
claude plugin install ctx-handoff@waraxe-claude-mods
```

Then open a new chat. Mods load when a chat starts.

## Use

The commands, settings and limits are in [README.md](README.md).

## Before you rely on it

- Requires Claude Code 2.1.287 or later, with mods turned on for your account.
- Check it first: `claude plugin validate plugins/ctx-handoff` lists the events it hooks and the calls it makes.
- Mods run with your permissions and are not sandboxed.

## Remove

```bash
claude plugin uninstall ctx-handoff@waraxe-claude-mods
```

Source: cablate, MIT, from https://github.com/cablate/ctx-handoff-mod. Licence: [LICENSE](LICENSE).
