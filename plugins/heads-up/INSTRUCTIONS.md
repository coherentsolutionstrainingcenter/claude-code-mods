# heads-up: instructions

After a long turn, one Haiku call flags up to two things you might miss, in a band above the prompt. Off until /heads-up on

## Install

```bash
claude plugin marketplace add coherentsolutionstrainingcenter/claude-code-mods
claude plugin install heads-up@waraxe-claude-mods
```

Then open a new chat. Mods load when a chat starts.

## Use

The commands, settings and limits are in [README.md](README.md).

## Before you rely on it

- Requires Claude Code 2.1.287 or later, with mods turned on for your account.
- Check it first: `claude plugin validate plugins/heads-up` lists the events it hooks and the calls it makes.
- Mods run with your permissions and are not sandboxed.

## Remove

```bash
claude plugin uninstall heads-up@waraxe-claude-mods
```

Source: Igor Waraxe, MIT, built for this marketplace. Licence: [LICENSE](LICENSE).
