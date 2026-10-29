# Mission: Understanding and sharing the Claude Code mods I built

_Inferred from the request on 2026-10-29. Confirm or correct it before the next session._

## Why
I am publishing a Claude Code mod marketplace on GitHub. Before others install these mods, I need to be able to explain what each one does, how it is built, and how to use it, and to change one safely when it breaks.

## Success looks like
- I can point to the hook events and API calls each mod uses, and say why.
- I can change one mod's behaviour and check the change with `claude plugin validate`.
- I can write an install line and a usage note for each mod in the README without guessing.

## Constraints
- Lessons stay short enough to finish in one sitting.
- Lessons are written for someone who reads TypeScript, but is new to the mod API.

## Out of scope
- Writing mods in languages other than TypeScript.
- Submitting to Claude's plugin directory.
