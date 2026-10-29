# spend-guard: how it works

Lesson 0023, Spend and publish guard (tier 3): [0023-spend-and-publish-guard.html](../../teach/lessons/0023-spend-and-publish-guard.html)

This family stops a costly or public step until you approve it. The two best variants were video only: credit saver (28a) asked before a paid generation, and publish lock (31) showed a checklist before a publish. spend-guard is our own build of both ideas in one hook. It holds publish and deploy commands in Bash (npm publish, docker push, git push to main, and others) and MCP tools whose names say they publish, post, send, charge or generate images and video. It asks once, counts your approvals for the day, and refuses the call on anything but Proceed.

For your mission, this is the plainest example of a guard: one event, five calls on $, and a refusal you can explain line by line before you publish the marketplace.

## How it was built

1. 1. Declare the module and one setting
2. 2. Name what counts as a spend or a publish
3. 3. Read your own patterns once, at load
4. 4. Decide, then ask
5. 5. Refuse on anything but Proceed, count on Proceed
6. 6. Tell a Bash call from an MCP call
7. 7. Find a push to main, even a bare one

The lesson walks through each step with the code from this folder, then shows how to use the mod and checks what you learned.
