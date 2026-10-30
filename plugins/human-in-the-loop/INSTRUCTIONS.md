# human-in-the-loop: instructions

Claude assigns you the tasks only you can do. They wait in a My tasks pane, counted under the prompt, until you answer or reject them, so nothing Claude needs from you gets lost in the chat.

## Install

```bash
claude plugin marketplace add coherentsolutionstrainingcenter/claude-code-mods
claude plugin install human-in-the-loop@waraxe-claude-mods
```

Then open a new chat. Mods load when a chat starts.

## Use

The commands, settings and limits are in [README.md](README.md).

## Before you rely on it

- Requires Claude Code 2.1.287 or later, with mods turned on for your account.
- Check it first: `claude plugin validate plugins/human-in-the-loop` lists the events it hooks and the calls it makes.
- Mods run with your permissions and are not sandboxed.

## Remove

```bash
claude plugin uninstall human-in-the-loop@waraxe-claude-mods
```

Source: tzafrir, MIT, from https://github.com/tzafrir/human-in-the-loop. Licence: [LICENSE](LICENSE).
