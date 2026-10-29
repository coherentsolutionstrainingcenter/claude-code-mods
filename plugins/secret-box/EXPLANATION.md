# secret-box: how it works

Lesson 0008, Secret handling (tier 2): [0008-secret-handling.html](../../teach/lessons/0008-secret-handling.html)

Secret Box lets Claude ask for a key without seeing it. Claude calls request_secret, a masked box opens, and you paste the key. The mod writes it to .env and gives Claude only a placeholder such as [REDACTED-SECRET-3f9a1c2e]. Any key a tool prints later comes back as a placeholder, and a placeholder that Claude writes into a command becomes the real key when that command runs.

This matters for your mission because the transcript is the one thing you cannot undo. A key that reaches the chat stays in the session file, so this family is the clearest example of a hook that guards what enters the record, and it shows how a hook can rewrite a tool's input and output.

## How it was built

1. 1. Give Claude the request_secret tool at session start
2. 2. Refuse any Bash command that would commit a .env file
3. 3. Learn the secret values in .env before a tool reads them
4. 4. Open the box, and wait for the person in short steps
5. 5. Write the .env file, add it to .gitignore first, and answer with a placeholder
6. 6. Restore real values into local tools, and hide them on the way out

The lesson walks through each step with the code from this folder, then shows how to use the mod and checks what you learned.
