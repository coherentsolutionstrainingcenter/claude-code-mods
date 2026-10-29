# where-am-i

By Hamza Zafar, MIT, from [https://github.com/hamzafer/claude-code-mods](https://github.com/hamzafer/claude-code-mods). This README is the mod's own section of the upstream `docs/mods.md`, copied unchanged below.

Install it from this marketplace with `claude plugin install where-am-i@waraxe-claude-mods`. See INSTRUCTIONS.md and EXPLANATION.md in this folder.

---

Shows the session goal, what Claude Code is doing now and what waits on you.

![where-am-i: goal, current step and next step above the Claude Code prompt](../images/where-am-i.png)

- Makes one Haiku call after each turn to write the summary
- `/where` gives a few bullets instead
- A Bash call with no description shows as its program (`running git push`), never the whole command line, so a token in it stays off the screen and out of the summary
