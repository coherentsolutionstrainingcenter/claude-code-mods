# narrator

Narrator reads the end of each finished reply aloud with the macOS `say` voice. It is off until you turn it on: `/narrator on` and `/narrator off` switch it, and `/narrator status` reports the state. The setting is kept between sessions. When a reply finishes, it speaks the last 240 characters of the visible text. Code blocks, links, URLs and Markdown marks are left out. Prompts and tool output are never read, and subagent replies and interrupted turns are skipped.

It works only on macOS. Elsewhere one toast says `say` is missing, and nothing else changes. A reply that finishes while the previous one is still being read will overlap it. The 240-character cut starts at a whole word, so a long reply may be read from its second or later sentence. It makes no model calls, so it costs nothing beyond the local voice.
