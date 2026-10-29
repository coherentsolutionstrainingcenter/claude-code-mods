# spend-guard

## What it does

Adds one approval step before anything that costs money or publishes. When Claude is about to run such a call, spend-guard stops it and asks **Proceed** or **Cancel**. The question shows the command or tool, a short checklist (right account? right file? right destination?) and how many calls you have approved today. Cancel refuses the call and tells Claude not to retry. A dismissed dialog counts as Cancel, and so does a run with no one to ask (`claude -p`).

It holds, by default:

- Bash commands: `npm publish`, `pnpm publish`, `yarn publish` (and `yarn npm publish`), `twine upload`, `docker push`, `gh release create`, `vercel --prod`, and `git push` to `main` or `master` (named in the command, or a bare `git push` while `main` or `master` is checked out, or `--all` / `--mirror`).
- MCP tools whose own name holds one of these words: `publish`, `deploy`, `post`, `send`, `charge`, `generate_image`, `generate_video` (for example `mcp__gmail__send_message`, `mcp__social__createPost`).

## Install

```bash
claude plugin marketplace add <org>/waraxe-claude-mods
claude plugin install spend-guard@waraxe-claude-mods
```

## Use

There is no command. The guard runs on every tool call and asks only for the calls above.

One setting, **Your own patterns** (`extraPatterns`), set with `/plugin configure spend-guard` or `/config`: comma-separated text to hold as well. Each entry is matched, ignoring case, inside a Bash command and inside every tool name. Example: `fly deploy, stripe, mcp__replicate`.

## Cost

No model calls and no tokens. A held call does one store read, and an approved one a store write. A bare `git push` runs `git branch --show-current` once to learn the branch.

## Limits

- It matches text. A command that only mentions a pattern (a commit message that says "npm publish") asks too. A publish hidden in a script (`npm run release`, `make deploy`) is not seen unless you add a pattern for it.
- For a bare `git push`, it reads the branch in the session's folder, or in the folder `git -C <dir>` names. After `cd other && git push` it reads the session's folder, not `other`.
- An option that takes a separate value (`git push -o ci.skip origin`) can be read as the remote, so that push may not be held.
- MCP tools are matched by whole words in their own name. `mcp__postgres__query` and `list_posts` are not held; a sending tool with another name needs your own pattern.
- No balance check. The credit saver idea checked the balance first, but no API reaches an arbitrary service's balance, so spend-guard does not pretend to.
- `$.ui.ask` takes option labels only, so the checklist sits in the question text and the options carry no descriptions.
- The count is today's Proceed presses on this machine, across sessions. It starts again at local midnight. It counts approvals, not successful runs.
- Typing exactly `Proceed` under "Other" counts as Proceed.
- Claude Code's own permission prompt still comes after a Proceed when the tool is not already allowed.
- If the guard itself fails, it holds the call (a `.catch` on the hook denies it).

## How it works

One `tool.call` hook. It decides whether the call is a spend or a publish; if not, it calls `next(e)` and the tool runs untouched. If so, it reads today's count from `$.store`, asks with `$.ui.ask`, returns `{ deny }` on anything but Proceed, and on Proceed writes the new count and calls `next(e)`. The ask-then-deny shape is the same one collision-guard in this repository uses.

The lesson walks through the code: [teach/lessons/0023-spend-and-publish-guard.html](../../teach/lessons/0023-spend-and-publish-guard.html).
