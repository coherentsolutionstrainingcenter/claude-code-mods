# reflect-mod: how it works

Lesson 0003, Reflect and memory (tier 1): [0003-reflect-and-memory.html](../../teach/lessons/0003-reflect-and-memory.html)

reflect-mod checks each short prompt you type with one Haiku call. The call decides if the prompt states a rule worth keeping, such as "no, use pnpm". If it does, a band above the prompt shows the rule. You press a button to save it to ./CLAUDE.md or ~/.claude/CLAUDE.md, to edit it, or to skip it. A saved rule also goes into this session's system prompt at once.

The same repository holds a Python plugin that queues corrections for a later /reflect review. The README says the mod does the review "at the moment you correct" instead. Only the mod is shipped here.

## How it was built

1. 1. Queue the prompt, and only run cheap checks
2. 2. Ask Haiku if the prompt is a rule
3. 3. Draw the band above the prompt
4. 4. Save one rule at a time, after reading the file again
5. 5. Write inside one marked section
6. 6. Use a saved rule in this session at once

The lesson walks through each step with the code from this folder, then shows how to use the mod and checks what you learned.
