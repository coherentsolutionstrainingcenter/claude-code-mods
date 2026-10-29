# aside: instructions

Read-only side chat: /aside opens a pane beside the transcript where you ask about the session so far; answers come from a tool-less fork of the session's own transcript and nothing is written back into the main thread.

## Install

```bash
claude plugin marketplace add <org>/waraxe-claude-mods
claude plugin install aside@waraxe-claude-mods
```

Then open a new chat. Mods load when a chat starts.

## Use

The commands, settings and limits are in [README.md](README.md).

## Before you rely on it

- Requires Claude Code 2.1.287 or later, with mods turned on for your account.
- Check it first: `claude plugin validate plugins/aside` lists the events it hooks and the calls it makes.
- Mods run with your permissions and are not sandboxed.

## Remove

```bash
claude plugin uninstall aside@waraxe-claude-mods
```

Source: JayDoubleu, MIT, from https://github.com/JayDoubleu/aside. Licence: [LICENSE](LICENSE).
