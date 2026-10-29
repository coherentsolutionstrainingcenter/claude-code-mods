# dictation-fixer

Dictation Fixer checks a long message before it is sent. A message of 120 characters or more looks dictated when it has no sentence-ending punctuation, contains a filler word (um, uh, "you know"), or repeats a word straight away. Haiku then cleans only its punctuation, capitals, fillers and repeats. You see a dialog that shows the cleaned text, with Send cleaned and Send as typed. Nothing changes unless you choose Send cleaned. Slash commands, meta prompts and short messages go through untouched.

To use it, type or dictate a long message as normal and answer the dialog. Nothing needs configuring.

Only the prompts you type at the terminal are checked. Prompts from a phone or web client (the bridge), from another session, from a schedule or from `claude -p` go through untouched. A message that contains a code fence is never changed, because pasted code must not be reworded.

Limits: each message that looks dictated costs a Haiku call, including pasted text with no sentence-ending punctuation. The dialog shows at most 1,200 characters of the cleaned text. If the call fails or times out after 15 seconds, or the dialog is dismissed, the message is sent as typed.

Cost: one small Haiku call per dictated-looking message, billed to your account, at most 4,096 output tokens.
