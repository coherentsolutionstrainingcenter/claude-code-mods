# spoken-alerts

## What it does

It says out loud what is going on, so you can follow a session without watching the screen. There are two alerts, each with its own chime and voice:

| Alert | When | You hear |
|---|---|---|
| Work done | A main-thread turn ends | A soft falling chime, then Samantha: "Done in waraxe claude mods, thread Spoken alerts mod. Built the spoken alerts mod and its tests." |
| Question | Claude asks you something | A bright rising chime, played twice, then Daniel: "Question from waraxe claude mods, thread Spoken alerts mod. Which voices should the alerts use? Recommended: Mac voices." |

By default it speaks through the Mac's own voices (`$.audio.speak`, which is `say` on macOS) and plays its chimes with `afplay`. It can speak with OpenAI or ElevenLabs voices instead (see [Voices](#voices)). Everything runs where Claude Code runs, so it works in the desktop app as well as the terminal. VS Code and mobile are not tried.

## Voices

| `provider` | Work-done voice | Question voice | Needs |
|---|---|---|---|
| `mac` (default) | Samantha | Daniel | nothing: free and offline |
| `openai` | cedar | marin | an OpenAI API key; model `gpt-4o-mini-tts`, which speaks the question alert in a more urgent style |
| `elevenlabs` | Sarah (`EXAVITQu4vr4xnSDxMaL`) | George (`JBFqnCBsd6RMkjVDRZzb`) | an ElevenLabs API key; model `eleven_flash_v2_5` |

`doneVoice` and `questionVoice` replace those defaults. Use a name from `say -v '?'` for `mac`, a voice name for `openai` (alloy, ash, ballad, cedar, coral, echo, fable, marin, nova, onyx, sage, shimmer, verse), and a voice ID from your ElevenLabs voice library for `elevenlabs`. Leave a field empty for the default.

With a cloud provider the chime plays at once while the audio downloads, so the voice starts a second or two later than a Mac voice would. If the cloud voice fails (no key, a refused key, no credits, no network, 20 seconds without an answer), the Mac voice speaks that alert instead. A toast says why, once per reason in each session.

**Where the key comes from.** At each alert the mod takes the first key it finds:

1. the `openaiApiKey` or `elevenlabsApiKey` setting, kept in Claude Code's secure storage (the macOS keychain);
2. `OPENAI_API_KEY` or `ELEVENLABS_API_KEY` in Claude Code's environment;
3. the same variable in `~/.claude/.env`, as `NAME=value` (`export` and quotes allowed), where the claude-cs hooks keep theirs.

The file is read again at each alert, so a key you change there needs no reload. A key in the file is plain text; put it in the setting instead if you want it only in the keychain.

**Setting it up.** With your keys already in `~/.claude/.env`, only pick the provider, in the desktop app's `/config` or in a terminal:

```bash
echo '{"provider":"openai"}' | claude plugin configure spoken-alerts@waraxe-claude-mods --values-stdin
```

To keep a key in the keychain instead, add it to the same JSON (`"openaiApiKey":"..."` or `"elevenlabsApiKey":"..."`). Options you leave out keep their values, so `{"provider":"mac"}` switches back without losing a key. The keys are not rows in `/config`, since they are secret.

Then, in the session, run `/reload-plugins` and `/spoken-alerts-test`. It answers at once and plays both alerts; with a cloud voice, a toast then says they played, or why the Mac voices spoke instead.

## The work-done alert

- **Project:** the repository's folder name, with dashes read as spaces. In a worktree it is the main repository's name, so all of a repository's worktrees sound the same.
- **Thread:** the session's title as Claude Code gives it. When it gives none, one Haiku call names the subject in 2 to 5 words, and that name is kept for the session.
- **What was done:** one Haiku call turns your request, Claude's last reply and the desktop's next-step recap into one sentence of at most 20 words. If Haiku does not answer, the alert speaks the recap, or else the reply's first sentence.
- A turn that ends in an error says "stopped with an error". An interrupted turn and a subagent's turn stay silent.

## The question alert

| What asks | What is spoken |
|---|---|
| A question dialog (AskUserQuestion) | Each question, then "Recommended:" and the option marked "(Recommended)". With no option marked, it lists the options. It speaks as the dialog opens. |
| A permission prompt | What Claude asks to do: "Claude asks to run a command: Run the tests." The notification that comes with a prompt is not spoken a second time. |
| The desktop app's next-step box | Its question, then its first button as the recommendation. It comes right after the work-done alert, since the box appears as the turn ends. |
| A task assigned to you (human-in-the-loop) | The task's title and, for a choice, its options. |
| An MCP server's own question | Its notification message. |

The reminder that Claude has been waiting a while is not spoken.

Alerts play one after another, so a chime never plays over the words of the alert before it.

## Cost

One Haiku call after each main-thread turn: your request (1,500 characters), the next-step recap (600) and the last reply (4,000), up to 150 output tokens. Questions make no model call.

With a cloud provider, each alert is also one speech request of about 100 to 300 characters. OpenAI bills that to your API account, well under a cent per alert. ElevenLabs takes it from your plan's character credits. The Mac voices cost nothing.

## Limits

- On a Mac without Samantha or Daniel, the alert uses the default system voice, so the two alerts differ only by their chimes. To list your voices, run `say -v '?'`.
- A cloud alert's text goes to OpenAI or ElevenLabs. That text is the project and thread names, a one-sentence summary and the question, never your code or files.
- A refused request's toast gives a short reason, never the provider's reply, since a reply can echo part of the key.
- Each session speaks for itself. Two sessions ending at the same moment can talk over each other.
- The spoken thread name is only as good as the title Claude Code passes to hooks. If the title changes later, the next alert uses the new one.
- It has no mute switch. To stop the alerts, disable the mod.

## Your terminal hooks

The `claude-cs` terminal setup (`~/.claude-cs/settings.json`) still runs its own `Stop` and `Notification` hooks with OpenAI voices. This mod is installed for `~/.claude`, the desktop app's settings, so the two never speak for the same session. Install it under `~/.claude-cs` too only after removing those two hooks there, or every alert plays twice.

## Install

At the prompt of a terminal session:

```text
/plugin install spoken-alerts --marketplace coherentsolutionstrainingcenter/claude-code-mods
```

From a shell, and the rest of the install notes, see [INSTRUCTIONS.md](INSTRUCTIONS.md).
