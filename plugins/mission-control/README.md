# mission-control

By Hamza Zafar, MIT, from [https://github.com/hamzafer/claude-code-mods](https://github.com/hamzafer/claude-code-mods). This README is the mod's own section of the upstream `docs/mods.md`, copied unchanged below.

Install it from this marketplace with `claude plugin install mission-control@waraxe-claude-mods`. See INSTRUCTIONS.md and EXPLANATION.md in this folder.

---

Shows every Claude Code subagent, tool call and touched file in a live pane.

![mission-control: Claude Code subagents and a code map of the files they edit](../images/mission-control.gif)

- Press `w` for Who, `c` for Code and `q` to close
- `/mission code` opens straight to the code map, `/mission who` to the agents
- Headless Chrome draws the code map as an image, in a throwaway profile. It uses the first of `/Applications/Google Chrome.app` (macOS), `google-chrome-stable`, `google-chrome`, `chromium-browser` or `chromium` in `/usr/bin` (Linux)
- The Code view runs on macOS and Linux and needs a terminal that shows images (Ghostty, kitty, iTerm2)
- On Windows, whose terminals show no images, the Code view lists the map as lines, and `b` opens the drawn map in your browser, which follows each change
- A file glows blue while Claude reads it, orange while it edits it, and turns green with a check once changed
- One Haiku call after each turn writes the line under each changed file
