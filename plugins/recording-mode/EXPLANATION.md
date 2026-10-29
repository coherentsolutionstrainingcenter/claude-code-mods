# recording-mode: how it works

Lesson 0015, Screen privacy (tier 2): [0015-screen-privacy.html](../../teach/lessons/0015-screen-privacy.html)

recording-mode adds /rec. While it is on, in every Claude Code session on the machine, it does four things. It masks keys, .env values, emails, names, phone numbers, addresses, ID and account numbers, money and business figures wherever the transcript draws text. It draws results from mail, chat, task, file, calendar and finance tools as hidden. It refuses private files and finance tools. And it adds a note to each prompt asking Claude to keep names and figures out of its replies.

It matters for your mission because one short mod uses four kinds of hook, for drawing, refusing, telling the model and a command, and you need to say which one does what before you publish it.

## How it was built

1. 1. Declare the hook module
2. 2. Share one switch between all chats
3. 3. Mask each row as it is drawn
4. 4. Find what to hide
5. 5. Keep private files closed
6. 6. Tell Claude
7. 7. Show that it is on

The lesson walks through each step with the code from this folder, then shows how to use the mod and checks what you learned.
