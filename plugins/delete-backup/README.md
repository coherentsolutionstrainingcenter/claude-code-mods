# delete-backup

delete-backup is undo for deletions. Before a Bash command runs an `rm`, it copies each target that exists into `~/.claude/delete-backup/<time>/` with `cp -Rp`, and writes a `manifest.json` with the original paths, the command and the time. Run `/undo-delete` to put the newest backup back at its original paths. It never writes over a path that exists, and it removes the backup only after every item is back. It follows `cd` across Bash calls, so `cd build && rm -rf dist` backs up `build/dist`.

## Denied rm

When delete-backup cannot tell which files an rm would delete, it returns a deny for the whole Bash call, and nothing runs. That happens when the command has a subshell `( )` or a `{ }` group, a `cd -`, a `$(` or backtick in an rm, a `$` in an rm target, or when the folder the shell is in is unknown. The reason says that delete-backup cannot tell which files would be deleted. A copy that fails also denies the call.

## Limits

- Only `rm`, optionally after `sudo`, is covered. `find -delete`, `xargs rm`, `git clean`, `git reset`, `/bin/rm`, `command rm`, Write and Edit are not backed up.
- Shell keywords before an `rm` (`if`, `then`, `else`, `elif`, `while`, `until`, `do`, `!`, `time`) are skipped, so `then rm -rf build` is still backed up. A `cd` after a keyword may sit in a branch that does not run, so it makes the folder unknown.
- If the targets match so many paths that the list is cut at 4 MiB, the call is denied rather than backed up in part.
- Only `cd` moves the tracked folder. `pushd`, `popd`, `source`, `.`, `eval`, `exec`, `builtin` and `command` make it unknown. Aliases and shell functions are not seen.
- The folder is unknown after a cd that may not have run, such as `make && cd build`, and after a chain that may stop before its last cd, such as `cd a && rm b && cd ..`. Until a Bash call runs `cd` with an absolute path, rm is denied.
- Only the newest backup is restored each time. Older backups stay until you delete them. Nothing is pruned automatically.
- Variables and `$(...)` are not expanded, so an rm with a `$` is denied rather than backed up.
- A backup that fails part-way has no manifest.json and is skipped. If one item cannot be restored, the backup is kept, and items already put back show as existing on the next run.

## Cost

Each covered `rm` copies what it would delete first. A large `rm -rf`, such as `node_modules` or a build folder, takes time and needs about as much disk space again until you delete the backup folder yourself.
