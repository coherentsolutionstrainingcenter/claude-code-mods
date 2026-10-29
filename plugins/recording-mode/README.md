# recording-mode

By Nate Herk, MIT, from [https://github.com/nateherkai/claude-code-mods](https://github.com/nateherkai/claude-code-mods). This README is the mod's own section of the upstream `README.md`, copied unchanged below.

Install it from this marketplace with `claude plugin install recording-mode@waraxe-claude-mods`. See INSTRUCTIONS.md and EXPLANATION.md in this folder.

---

Run `/rec` before you hit record. It applies to every open chat within 3 seconds, and `/rec off` turns it off everywhere.

- **Masks on screen:** API keys and tokens, every value in a `.env` file in the project folder or its parents, emails, names, phone numbers, street addresses, card, account, and ID numbers, money, and figures next to business words (revenue, margin, payroll, and so on). `/rec strict` also masks every large figure and percentage.
- **Hides whole results** from mail, chat, task, calendar, file, CRM, and finance tools. Claude still gets the real result; only the screen changes.
- **Keeps files closed:** `.env` files, credentials, SSH and cloud keys, Claude's memory folder, and finance documents (payroll, invoices, contracts, budgets, forecasts, tax files). Finance tools like QuickBooks stay closed too. Claude is told it can't open them while recording.
- **Tells Claude:** each prompt carries a hidden note to keep names, figures, and internal plans out of its replies.
- **A red ● REC** shows above the prompt and in the footer while it's on.

### Make it yours with `/rec config`

`/rec config` creates `~/.claude/mods-data/recording-mode/config.json`:

```json
{
  "keepNames": ["Your Name"],
  "names": ["A Teammate", "A Client"],
  "privatePaths": ["clients/", "finance/", "my-private-notes.md"],
  "businessTools": [],
  "closedTools": []
}
```

- **keepNames:** your own name (and your brand), shown even while recording.
- **names:** people whose names are always masked. Names in emails and contact fields are picked up on their own.
- **privatePaths:** folders or file names Claude may not open while recording. Any part of a path matches, in any case.
- **businessTools:** extra tool or command names whose results draw as hidden.
- **closedTools:** extra tool names Claude may not call while recording.

Save the file and run `/rec` again.

**Limits:** it changes what is drawn on screen and what Claude may open, not what is stored. Pattern masking can't catch everything written in plain words, so watch your footage before you publish. The chat titles in the Desktop app's sidebar can't be masked by a mod.
