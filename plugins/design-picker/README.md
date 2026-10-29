# design-picker

## What it does

When Claude asks you to choose between design styles, design-picker shows you what each one looks like. It watches Claude's question dialog (the AskUserQuestion tool). When the question or its options mention a design word (style, theme, palette, colour or color, font, typography, layout, look, design or UI), it makes one Haiku call for the styles. It then writes one page with a card per option, side by side, and opens it in your browser. Each card shows the style's colours, its type, a sample heading and a sample button. After that the normal question dialog appears, unchanged, and you choose there.

## Install

```bash
claude plugin marketplace add <org>/waraxe-claude-mods
claude plugin install design-picker@waraxe-claude-mods
```

## Use

There is nothing to switch on. When Claude asks a design question, the page opens and then the dialog appears.

- `/design-picker last` opens the newest page again.

Pages are saved in `~/.claude/design-picker/`, one file per question, named by the time, such as `2026-10-29T17-30-05-123Z.html`. There are no settings.

## Cost

One Haiku call for each design question Claude asks. The call sends the question, the option labels and their descriptions plus about 250 tokens of instructions, can return up to 1,500 tokens, and stops after 25 seconds. Questions without a design word make no call.

## Limits

- It opens the page with the macOS `open` command. On another system the page is still written, but you open it yourself.
- The dialog waits for the page. It appears only after the Haiku call and the file write finish, which usually takes a few seconds and at most about 25.
- It fails open. If the call fails, the answer is not usable JSON, or the file cannot be written, no page opens and the dialog appears as normal. No message is shown.
- Only the first question in the dialog that mentions a design word gets cards.
- The word match is simple. A question such as "Does this look right?" also counts as a design question and makes a call.
- Only Claude's own questions count. A question another mod asks through `$.ui.ask` is left alone.
- The page is a static file. It cannot answer the dialog for you: you still pick in Claude Code.
- The cards show the style as the model imagines it. They use only fonts installed on your Mac, because the page loads no web fonts.
- Old pages are not deleted. Remove them from `~/.claude/design-picker/` when you like.

## How it works

One hooks module, `hooks/register.ts`. A `tool.call` hook matches the `AskUserQuestion` tool and checks that the model raised the call (`next.origin.plugin` is `engine`). If a question mentions a design word, it asks Haiku through `$.model.complete` for CSS declarations for each option: the card, its heading, its text, its button, and a few palette colours. Only the CSS comes from the model. The mod builds the HTML itself, escapes every option text, drops any declaration with `url(`, `@import`, `expression(`, a brace, an angle bracket or a backslash, and keeps only hex colours for the swatches. The page also carries a Content Security Policy that lets it load and run nothing. The page is saved with `$.fs.write`, opened with `$.process.run(['open', path])`, and then the hook returns `next(e)` with the call unchanged. A `.catch` on the hook also returns `next(e)`, so a failing hook never blocks the dialog.

The lesson explains each step: [teach/lessons/0036-design-picker.html](../../teach/lessons/0036-design-picker.html).

## License

MIT. Copyright (c) 2026 Igor Waraxe. See [LICENSE](LICENSE).
