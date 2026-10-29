# next-steps

By Hamza Zafar, MIT, from [https://github.com/hamzafer/claude-code-mods](https://github.com/hamzafer/claude-code-mods). This README is the mod's own section of the upstream `docs/mods.md`, copied unchanged below.

Install it from this marketplace with `claude plugin install next-steps@waraxe-claude-mods`. See INSTRUCTIONS.md and EXPLANATION.md in this folder.

---

Suggests the prompts you'd likely send Claude Code next.

![next-steps: three numbered next prompts above the Claude Code prompt](../images/next-steps.png)

- After each turn, shows 2 or 3 short prompts you'd likely send next, like `next:  1 run the tests you just wrote  ·  2 open a draft PR  ·  0 dismiss`
- **Keys** (only while the prompt is empty): `1`, `2` or `3` puts that prompt in the box as a draft. Edit it or press Enter, nothing sends on its own. `0` hides the list
- Digits typed after other text, and pasted ones, go in as usual. To start a prompt with a digit while the list shows, press `0` first
- Hidden while Claude works or a survey is open
- The list clears when you send a prompt (slash commands too) or a new turn starts
- Makes one Haiku call after each turn. Skips it for short replies, and for a turn that ends while background agents still run
- where-am-i drops its own "next" part while the list shows, and restores it when the list clears
- Set `language` to get the suggestions in another language (e.g. `Korean`). Empty, the default, keeps English. File names, commands and code identifiers stay as they are, so a drafted prompt is still pasteable. Change it in `/config`, or in `settings.json` under `pluginConfigs["next-steps"].options`
- Set `layout` to `rows` to show one suggestion per row however wide the terminal is. `auto`, the default, puts the list on one row when it fits the band and one per row otherwise. A band too short for one per row still gets the one row, as with `auto`. Change it in `/config` or under the same `options`
