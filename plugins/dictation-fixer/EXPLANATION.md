# dictation-fixer: how it works

Lesson 0011, Dictation fixer (tier 2): [0011-dictation-fixer.html](../../teach/lessons/0011-dictation-fixer.html)

Dictation Fixer runs on each prompt you submit at the terminal. A prompt of 120 characters or more looks dictated if it has no sentence-ending punctuation, a filler word such as "um" or "you know", or a word repeated straight away. For those prompts, Haiku returns a tidied copy, and a dialog asks whether to send that copy or your original text.

This matters for your mission because the mod can change a prompt before the model sees it, so you must be able to say exactly when it acts and when it steps aside.

## How it was built

1. 1. Hook the prompt and skip anything that is not your typed text
2. 2. Decide whether the text looks dictated
3. 3. Ask Haiku for a cleaned copy, with a cap and a time limit
4. 4. Fence the text inside the prompt
5. 5. Let you choose which copy is sent

The lesson walks through each step with the code from this folder, then shows how to use the mod and checks what you learned.
