# repo-heatmap

## What it does

`/heatmap` opens a pane that shows how this repository's files spread across folders and kinds. It counts the files git tracks, groups them by top-level folder, and draws one colored bar per folder, split by kind: code, tests, docs, design, data, config and other. The biggest folders come first, up to 15 rows, with a legend of each kind's count above the rows and a total line below them.

## Install

```bash
claude plugin marketplace add <org>/waraxe-claude-mods
claude plugin install repo-heatmap@waraxe-claude-mods
```

## Use

- `/heatmap` opens the pane and counts the files.
- **Refresh** in the pane counts them again, for example after you add or delete files.
- There are no settings.

The kinds, tried in this order (the first match wins):

| Kind | What counts |
| --- | --- |
| tests | a file under a `test`, `tests`, `__tests__`, `spec`, `specs` or `e2e` folder, or named like `x.test.ts`, `x_test.go` or `test_x.py` |
| design | `svg`, `png`, `jpg`, `jpeg`, `gif`, `webp`, `ico`, `fig`, `sketch`, `psd`, `xd` |
| config | dotfiles and anything in a hidden folder (`.github/`), `toml`, `ini`, `cfg`, `conf`, `lock`, `env`, and names such as `package.json`, `tsconfig.json`, `Dockerfile`, `Makefile` and `*.config.ts` |
| data | `json`, `jsonl`, `csv`, `tsv`, `sql`, `db`, `sqlite`, `yaml`, `yml`, `xml`, `parquet` |
| docs | `md`, `mdx`, `txt`, `rst`, `adoc`, `pdf`, and `README`, `LICENSE` or `CHANGELOG` with no extension |
| code | common source extensions, such as `ts`, `js`, `py`, `go`, `rs`, `java`, `swift`, `c`, `css` and `html` |
| other | everything else |

## Cost

No model calls. Each count runs `git ls-files` once, on your machine.

## Limits

- It counts only the files git tracks. Untracked and ignored files are not counted, and a repository with no commits and nothing staged shows no files.
- Outside a git repository the pane says so. It does not walk the disk instead.
- It runs in the session's folder. In a subfolder of a repository, it counts the files under that subfolder only.
- The kind of a file comes from its name and folder, not its content. A YAML file outside a hidden folder counts as data, even when it is a CI or deploy config.
- A file list bigger than 4 MiB is cut, and the pane then says the counts are partial.
- Folders past the 15th are not drawn; the total line says how many were left out.

## How it works

`session.start` registers `/heatmap`. The `command.run` hook opens the pane with `$.ui.open` and starts a count. The count calls `$.process.run(['git', 'ls-files', '-z'])` in the folder from `$.session.cwd()`, sorts each path into a top-level folder and a kind, and writes the 15 biggest rows and the totals to a `$.state` atom. The pane's `ui.render` hook draws from that atom, sizing the bars to the pane's width, and its Refresh button runs the count again.

Lesson: [teach/lessons/0035-repo-heatmap.html](../../teach/lessons/0035-repo-heatmap.html)
