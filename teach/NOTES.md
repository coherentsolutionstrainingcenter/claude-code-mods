# Teaching notes

## Workspace conventions
- Lessons: `lessons/NNNN-<family>.html`, 43 of them, one per plugin, numbered in tier order (tier 1 first). `docs/plugins.json` is the source of truth for the order, the plugin each lesson ships and its source and licence.
- After changing `docs/plugins.json`, run `python3 scripts/generate.py`. It rebuilds each lesson's nav and "In this marketplace" box, each plugin's INSTRUCTIONS.md and EXPLANATION.md, the marketplace file, `FAMILIES.md`, the index and the root README.
- Shared stylesheet: `assets/lesson.css`. Every lesson links it with `../assets/lesson.css`.
- Reference: `reference/` holds the cheat sheet, the catalogue and a local copy of the engine's API types (`reference/engine/`, not committed).
- Each lesson has these parts, in order: metadata, what it is, variants, how it was built (code and explanation), how to use it. Then two self-check questions, links to the sources, and a reminder to ask follow-up questions in chat.
- Code in lessons is copied from the shipped plugin's own files. Escape `<`, `>` and `&` in code blocks.
- Each lesson teaches the plugin that ships. Variants with no licence, or a second plugin for the same family, stay in the Variants table as "not shipped".
- `reference/mod-catalogue.html` lists every mod ID with its description and source. Variant rows link to it as `#m<ID>`.
- The workspace lives in `waraxe-claude-mods/teach/`. Run `/teach` from that folder in later sessions.

## User preferences
- Wants everything created for the mods kept in `waraxe-claude-mods` (moved from `benai-mods` on 2026-10-29).
- Wants a page for every mod in the tiers, including the toys.
- Wants one repository, `waraxe-claude-mods`, shared inside the GitHub organization only, with one working, licensed plugin per lesson. Mods with no licence are not copied (decided 2026-10-29).

## Open questions for the user
- The mission in `MISSION.md` was inferred from the request. Confirm it.
