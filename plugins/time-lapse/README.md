# time-lapse

Time-lapse records your session as it runs and replays it as an animated HTML page. Run `/time-lapse` and the replay opens in your browser with `open`, the macOS command. Each turn plays in order in at most two seconds, with Play and Pause buttons. The replay is an HTML page, not a video, because no video encoder is guaranteed to be installed.

It records three kinds of event, each with a timestamp: each prompt, as its length (counted in UTF-16 units, so an emoji counts as two); each tool call, as its tool name; and each finished turn, as the tool names it used and how long it took. Events go to `~/.claude/time-lapse/<session id>.json`. No prompt or reply text is stored. Tool arguments, file paths and command output are never read into the log.

Limits: recording starts when the plugin loads, so earlier activity is missing. Subagent tool calls count toward the main turn that spawned them. Playback compresses time, so it shows order and rhythm, not exact timing. Each event rewrites the session file, and past about 4 MB (tens of thousands of events) the file can no longer be read and recording stops for that session.

Cost: no model calls. Each event reads and rewrites the whole session file, so the cost grows with the length of the session.
