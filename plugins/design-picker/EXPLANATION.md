# design-picker: how it works

Lesson 0036, Design picker (tier 5): [0036-design-picker.html](../../teach/lessons/0036-design-picker.html)

Claude asks you to choose with its question dialog, the AskUserQuestion tool. Choosing a style from a few words is hard. design-picker steps in just before that dialog opens. If the question or its options mention a design word (style, theme, palette, colour or color, font, typography, layout, look, design, UI), it makes one Haiku call for the styles. It writes one page with a card per option, side by side, to ~/.claude/design-picker/ and opens it in your browser. Each card shows the style's colours, its type, a sample heading and a sample button. Then the dialog appears, unchanged, and you choose there.

It fails open. If the call or the file write fails, no page opens and the dialog appears as normal.

## How it was built

1. 1. Spot a design question
2. 2. Hook the dialog and let it through
3. 3. Make one Haiku call, then write and open the page
4. 4. Ask for CSS only
5. 5. Read the answer as cards
6. 6. Clean the CSS
7. 7. Escape every option text and lock the page down
8. 8. Open the page, and reopen the newest

The lesson walks through each step with the code from this folder, then shows how to use the mod and checks what you learned.
