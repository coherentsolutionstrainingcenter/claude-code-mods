# usage-meter

By Hamza Zafar, MIT, from [https://github.com/hamzafer/claude-code-mods](https://github.com/hamzafer/claude-code-mods). This README is the mod's own section of the upstream `docs/mods.md`, copied unchanged below.

Install it from this marketplace with `claude plugin install usage-meter@waraxe-claude-mods`. See INSTRUCTIONS.md and EXPLANATION.md in this folder.

---

Shows your Claude Code plan usage and session cost.

![usage-meter: five-hour and weekly Claude usage with reset times above the Claude Code prompt](../images/usage-meter.png)

- One line: your plan's 5-hour and 7-day usage as small bars, when the 5-hour window resets, and what the session has cost
- Reads the same figures as the status line and updates as your usage changes
- A window past its reset time hides until the next reading
- Green under 75%, yellow from 75%, red from 90%, plus one toast per window each time it passes 90%
- Without a subscription it shows only the cost
- Narrow terminals drop the 7d part first, then the cost
