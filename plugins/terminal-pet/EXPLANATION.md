# terminal-pet: how it works

Lesson 0041, Cosmetic mods (tier 6): [0041-cosmetic-mods.html](../../teach/lessons/0041-cosmetic-mods.html)

Each file Claude reads with the Read tool in this session is one meal. The pet has four moods, each with two frames drawn in plain characters on one line: eating (^O^) for a few seconds after each read, hungry (°o°) until it has eaten 8 files, full (^_^) after that, and sleepy (-_-) zZ after 10 idle minutes. Beside the face it says what it is doing, such as Pip is eating register.ts · 3 files eaten. /pet off, /pet on and /pet name <name> control it. It is a toy and makes no model calls.

Your mission asks you to point to the hook events and API calls each mod uses, and this small mod puts five events in one short file: a tool hook, a turn hook, a command, a timer and the band above the prompt.

## How it was built

1. 1. Count the meals with a hook on Read
2. 2. Work out the mood
3. 3. Give each mood two frames
4. 4. Move the frames with a clock
5. 5. Draw the band above the prompt
6. 6. Keep the name and the setting in the store
7. 7. Answer /pet

The lesson walks through each step with the code from this folder, then shows how to use the mod and checks what you learned.
