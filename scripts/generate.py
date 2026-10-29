"""Regenerates the marketplace files from docs/plugins.json.

Run it after you add, remove or reorder a plugin in docs/plugins.json:
    python3 scripts/generate.py

It rebuilds each lesson's nav and its "In this marketplace" box, writes INSTRUCTIONS.md and
EXPLANATION.md in every plugin folder, and writes .claude-plugin/marketplace.json,
teach/index.html, teach/FAMILIES.md and README.md. A new lesson file must already exist under
the name docs/plugins.json gives it.
"""
import html
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
TEACH = ROOT / "teach"
LESSONS = TEACH / "lessons"
rows = json.load(open(ROOT / "docs" / "plugins.json"))
TIER_NAMES = {1: "Tier 1 (grade 8)", 2: "Tier 2 (grade 7)", 3: "Tier 3 (grade 6)",
              4: "Tier 4 (grade 5)", 5: "Tier 5 (grade 4)", 6: "Tier 6 (toys)"}



def plugin_json(r):
    return json.load(open(ROOT / "plugins" / r["plugin"] / ".claude-plugin" / "plugin.json"))


# ---- Nav and the shipped-plugin box in every lesson. ----
def shipped_box(r):
    pj = plugin_json(r)
    up = f' · upstream <a href="{html.escape(r["upstream"])}">{html.escape(r["upstream"])}</a>' if r["upstream"] else ""
    needs = f"<br>Needs: {html.escape(r['needs'])}." if r["needs"] else ""
    return (
        '<!-- shipped:start -->\n<div class="note"><strong>In this marketplace:</strong> '
        f'plugin <code>{r["plugin"]}</code> {html.escape(pj.get("version", ""))}, '
        f'by {html.escape(r["author"])}, {html.escape(r["license"])}{up}.<br>'
        f'Install: <code>claude plugin install {r["plugin"]}@waraxe-claude-mods</code> · '
        f'folder <a href="../../plugins/{r["plugin"]}/">plugins/{r["plugin"]}</a> · '
        f'<a href="../../plugins/{r["plugin"]}/INSTRUCTIONS.md">instructions</a>{needs}</div>\n<!-- shipped:end -->'
    )


def nav(i):
    prev = rows[i - 1] if i > 0 else None
    nxt = rows[i + 1] if i + 1 < len(rows) else None
    parts = []
    parts.append(f'<a href="{prev["lesson"]}">← {prev["lesson"][:4]} {html.escape(prev["title"])}</a>' if prev else "<span></span>")
    parts.append('<a href="../index.html">Index</a>')
    parts.append(f'<a href="{nxt["lesson"]}">{nxt["lesson"][:4]} {html.escape(nxt["title"])} →</a>' if nxt else "<span></span>")
    return '<nav class="lesson-nav">\n  ' + "\n  ".join(parts) + "\n</nav>"


def fix_lessons():
    for i, r in enumerate(rows):
        f = LESSONS / r["lesson"]
        text = f.read_text(encoding="utf-8")
        num = r["lesson"][:4]
        text = re.sub(r'<p class="kicker">Lesson \d{4}', f'<p class="kicker">Lesson {num}', text, count=1)
        text = re.sub(r"<title>Lesson \d{4}", f"<title>Lesson {num}", text, count=1)
        text = re.sub(r'<nav class="lesson-nav">.*?</nav>', lambda _: nav(i), text, count=1, flags=re.S)
        box = shipped_box(r)
        if "<!-- shipped:start -->" in text:
            text = re.sub(r"<!-- shipped:start -->.*?<!-- shipped:end -->", lambda _: box, text, flags=re.S)
        else:
            text = re.sub(r"(</dl>)", lambda m: m.group(1) + "\n" + box, text, count=1)
        f.write_text(text, encoding="utf-8")


# ---- INSTRUCTIONS.md and EXPLANATION.md for every plugin. ----
def strip_tags(s):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", "", s))).strip()


def lesson_summary(r):
    text = (LESSONS / r["lesson"]).read_text(encoding="utf-8")
    what = re.search(r"<h2>What it is</h2>(.*?)<h2", text, re.S)
    steps = re.search(r"<h2>How it was built</h2>(.*?)<h2", text, re.S)
    paras = [strip_tags(p) for p in re.findall(r"<p>(.*?)</p>", what.group(1), re.S)] if what else []
    h3s = [strip_tags(h) for h in re.findall(r"<h3>(.*?)</h3>", steps.group(1), re.S)] if steps else []
    return paras, h3s


def write_plugin_docs():
    for r in rows:
        d = ROOT / "plugins" / r["plugin"]
        pj = plugin_json(r)
        lesson = f"../../teach/lessons/{r['lesson']}"
        src = f"{r['author']}, {r['license']}" + (f", from {r['upstream']}" if r["upstream"] else ", built for this marketplace")
        needs = f"- Needs {r['needs']}.\n" if r["needs"] else ""
        (d / "INSTRUCTIONS.md").write_text(
            f"# {r['plugin']}: instructions\n\n"
            f"{pj.get('description', '')}\n\n"
            "## Install\n\n"
            "```bash\n"
            "claude plugin marketplace add <org>/waraxe-claude-mods\n"
            f"claude plugin install {r['plugin']}@waraxe-claude-mods\n"
            "```\n\n"
            "Then open a new chat. Mods load when a chat starts.\n\n"
            "## Use\n\n"
            "The commands, settings and limits are in [README.md](README.md).\n\n"
            "## Before you rely on it\n\n"
            "- Requires Claude Code 2.1.287 or later, with mods turned on for your account.\n"
            f"{needs}"
            f"- Check it first: `claude plugin validate plugins/{r['plugin']}` lists the events it hooks and the calls it makes.\n"
            "- Mods run with your permissions and are not sandboxed.\n\n"
            "## Remove\n\n"
            "```bash\n"
            f"claude plugin uninstall {r['plugin']}@waraxe-claude-mods\n"
            "```\n\n"
            f"Source: {src}. Licence: [LICENSE](LICENSE).\n",
            encoding="utf-8")
        paras, h3s = lesson_summary(r)
        steps = "\n".join(f"{i}. {h}" for i, h in enumerate(h3s, 1)) or "See the lesson."
        (d / "EXPLANATION.md").write_text(
            f"# {r['plugin']}: how it works\n\n"
            f"Lesson {r['lesson'][:4]}, {r['title']} (tier {r['tier']}): [{r['lesson']}]({lesson})\n\n"
            + ("\n\n".join(paras[:2]) + "\n\n" if paras else "")
            + "## How it was built\n\n"
            f"{steps}\n\n"
            "The lesson walks through each step with the code from this folder, then shows how to use the mod and checks what you learned.\n",
            encoding="utf-8")


# ---- Marketplace, index, families table and README. ----
def write_marketplace():
    plugins = []
    for r in rows:
        pj = plugin_json(r)
        plugins.append({"name": r["plugin"], "source": f"./plugins/{r['plugin']}",
                        "description": pj.get("description", ""), "version": pj.get("version", "0.1.0"),
                        "author": {"name": r["author"]}, "license": r["license"],
                        "category": f"tier-{r['tier']}"})
    m = {"name": "waraxe-claude-mods", "owner": {"name": "Igor Waraxe"},
         "metadata": {"description": "43 Claude Code mods, one per lesson, ordered by how useful they are, with a course that explains how each one is built.",
                      "version": "1.0.0"},
         "plugins": plugins}
    (ROOT / ".claude-plugin" / "marketplace.json").write_text(json.dumps(m, indent=2) + "\n", encoding="utf-8")


def write_index():
    groups = []
    for tier in sorted({r["tier"] for r in rows}):
        items = []
        for r in (x for x in rows if x["tier"] == tier):
            text = (LESSONS / r["lesson"]).read_text(encoding="utf-8")
            lede = re.search(r'<p class="lede">(.*?)</p>', text, re.S)
            items.append(
                f'<li><a href="lessons/{r["lesson"]}">{r["lesson"][:4]} · {html.escape(r["title"])}</a> '
                f'<span class="kicker">plugin {r["plugin"]}</span><br>'
                f'<span class="lede">{html.escape(strip_tags(lede.group(1))) if lede else ""}</span></li>')
        groups.append(f"<h2>{TIER_NAMES[tier]}</h2>\n<ul class=\"steps\">\n" + "\n".join(items) + "\n</ul>")
    (TEACH / "index.html").write_text(f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Claude Code mods course</title>
<link rel="stylesheet" href="assets/lesson.css">
</head>
<body>
<main>
<p class="kicker">Index</p>
<h1>Claude Code mods course</h1>
<p class="lede">43 lessons, one per plugin in this marketplace, ordered by tier: the most useful mods first. Each lesson covers what the mod is, how it was built, with the code, and how to use it.</p>
<div class="note"><strong>Start here.</strong> Read the <a href="reference/mod-api-cheatsheet.html">API cheat sheet</a>, then lesson 0001. The <a href="reference/mod-catalogue.html">mod catalogue</a> lists all 109 reviewed mods. Your goal is in <a href="MISSION.md">MISSION.md</a>, and the full review is in <a href="../docs/MODS-FINAL-SYNTHESIS.md">MODS-FINAL-SYNTHESIS.md</a>.</div>
{chr(10).join(groups)}
<h2>Workspace files</h2>
<ul class="steps">
<li><a href="FAMILIES.md">FAMILIES.md</a>: which lesson ships which plugin, and where it came from.</li>
<li><a href="RESOURCES.md">RESOURCES.md</a>: the sources the lessons are built on.</li>
<li><a href="NOTES.md">NOTES.md</a>: conventions and open questions.</li>
</ul>
<p class="note">Ask follow-up questions in this chat. This page is a starting point; the agent is your teacher.</p>
</main>
</body>
</html>
""", encoding="utf-8")


def write_families():
    lines = ["# Lessons and plugins", "",
             "One lesson per plugin, in tier order. Generated from `docs/plugins.json`; edit that file, not this table.", "",
             "| No. | Lesson | Tier | Plugin | Author | Licence | Source |", "|---|---|---|---|---|---|---|"]
    for r in rows:
        src = r["upstream"] or ("built for this marketplace" if r["kind"] == "build" else "this marketplace")
        lines.append(f"| {r['lesson'][:4]} | [{r['title']}](lessons/{r['lesson']}) | {r['tier']} | `{r['plugin']}` | {r['author']} | {r['license']} | {src} |")
    lines += ["", "Variants that are not shipped (no licence, or one plugin per lesson) stay in each lesson's Variants table."]
    (TEACH / "FAMILIES.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_readme():
    table = ["| No. | Plugin | What it does | Tier | Author | Licence | Lesson |", "|---|---|---|---|---|---|---|"]
    for r in rows:
        desc = plugin_json(r).get("description", "").replace("|", "/")
        table.append(f"| {r['lesson'][:4]} | `{r['plugin']}` | {desc} | {r['tier']} | {r['author']} | {r['license']} | [{r['title']}](teach/lessons/{r['lesson']}) |")
    upstreams = sorted({(r["author"], r["upstream"]) for r in rows if r["upstream"]})
    credits = "\n".join(f"- {a}: {u}" for a, u in upstreams)
    needs = "\n".join(f"- `{r['plugin']}` needs {r['needs']}." for r in rows if r["needs"])
    (ROOT / "README.md").write_text(f"""# waraxe-claude-mods

Our internal Claude Code marketplace: 43 mods you can install, and a course that explains how each one is built. Shared inside our GitHub organization only.

- **Mods:** `plugins/`, one folder per mod. Each holds a README, a LICENSE, `INSTRUCTIONS.md` (install and use) and `EXPLANATION.md` (how it works, with a link to its lesson).
- **Course:** open `teach/index.html`. There are 43 lessons, one per mod, ordered by tier so the most useful mods come first.
- **Review:** `docs/MODS-FINAL-SYNTHESIS.md` ranks the 109 mods found in the videos and guides. `docs/plugins.json` maps every lesson to its plugin and source.

## Install

The repository is private to the organization. Members need read access and git credentials on their machine (`gh auth login`, or an SSH key).

```bash
claude plugin marketplace add <org>/waraxe-claude-mods
claude plugin install <plugin>@waraxe-claude-mods
```

Then open a new chat. Mods need Claude Code 2.1.287 or later, with mods turned on for your account. To update: `claude plugin marketplace update waraxe-claude-mods`, then `claude plugin update <plugin>@waraxe-claude-mods`.

## The 43 mods, in tier order

{chr(10).join(table)}

## Needs beyond Claude Code

{needs}

## Where the mods come from

- **Built here** (MIT, Igor Waraxe): 18 mods, including 9 built from descriptions in the videos.
- **Copied with their licences**, unchanged, from their authors' repositories. Each folder keeps its LICENSE:
{credits}

The review also used five local folders: `benai-mods` (Ben AI), `claude-code-playground-mods` (Anthropic), `claude-mods-starter-pack` (RocketLauncher), `nateherk-claude-code-mods` (Nate Herk) and `wearenocode-claude-mods` (WeAreNoCode). Mods with no licence, from Ben AI, WeAreNoCode, the starter pack and the Pokémon mod, are not copied. Their lessons teach a licensed or newly built mod instead, and keep the unlicensed one as a variant.

## Safety

Mods run with your permissions and are not sandboxed. Read a mod's code, or run `claude plugin validate plugins/<plugin>`, before you install it. Every mod here passes validation. Validation checks structure and the declared calls, not behaviour.

## License

Each mod has its own licence in its folder. Everything else in this repository is MIT. See [LICENSE](LICENSE).
""", encoding="utf-8")


if __name__ == "__main__":
    fix_lessons()
    write_plugin_docs()
    write_marketplace()
    write_families()
    write_index()
    write_readme()
    print("regenerated")
