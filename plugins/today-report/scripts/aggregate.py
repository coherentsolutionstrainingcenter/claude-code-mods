#!/usr/bin/env python3
"""Totals Claude Code sessions by local day, for the Today's Report pane.

Reads every ~/.claude/projects/**/*.jsonl and prints one JSON object on stdout:
tasks, task categories, task models and tokens per local day. It prints no
prompt or reply text. Each log file's totals are cached by path, size and
mtime, so a later run reads only the logs that changed. A run stops after
--budget seconds and says so; the next run carries on from the cache.
"""
import argparse
import glob
import json
import os
import sys
import time
from datetime import datetime

# Tools that put a task in a category. The first category a task touches wins.
CATEGORIES = [
    ("code changes", {"Edit", "Write", "MultiEdit", "NotebookEdit"}),
    ("commands", {"Bash"}),
    ("research", {"Read", "Grep", "Glob", "WebSearch", "WebFetch"}),
    ("delegated", {"Agent", "Task"}),
]
MARKERS = (b'"type":"user"', b'"type":"assistant"')
TOKEN_FIELDS = {
    "input": "input_tokens",
    "output": "output_tokens",
    "cacheRead": "cache_read_input_tokens",
    "cacheWrite": "cache_creation_input_tokens",
}


def empty_day():
    return {
        "tasks": 0,
        "categories": {},
        "models": {},
        "tokens": {"input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0},
    }


def local_day(timestamp):
    moment = datetime.fromisoformat(timestamp.replace("Z", "+00:00"))
    return moment.astimezone().strftime("%Y-%m-%d")


def category_of(tools):
    for name, members in CATEGORIES:
        if tools & members:
            return name
    return "conversation"


def is_prompt(record, message):
    """A typed prompt: not a tool result, an injected skill text or a slash command."""
    if record.get("isMeta"):
        return False
    content = message.get("content")
    if isinstance(content, str):
        return not content.startswith("<command-")
    if isinstance(content, list):
        return any(isinstance(block, dict) and block.get("type") == "image" for block in content)
    return False


def add_count(counts, key, amount=1):
    counts[key] = counts.get(key, 0) + amount


def close_task(days, task):
    if task is None:
        return
    day = days.setdefault(task["day"], empty_day())
    day["tasks"] += 1
    add_count(day["categories"], category_of(task["tools"]))
    add_count(day["models"], task["model"] or "unknown")


def scan(path):
    """Returns the per-day totals of one log file."""
    days = {}
    seen_requests = set()
    task = None  # the prompt being answered, until the next prompt

    with open(path, "rb") as handle:
        for raw in handle:
            if not any(marker in raw for marker in MARKERS):
                continue
            try:
                record = json.loads(raw)
            except ValueError:
                continue
            message = record.get("message") or {}
            kind = record.get("type")

            if kind == "user" and is_prompt(record, message):
                close_task(days, task)
                task = {"day": local_day(record["timestamp"]), "tools": set(), "model": None}
            elif kind == "assistant":
                usage = message.get("usage")
                if task is not None:
                    for block in message.get("content") or []:
                        if isinstance(block, dict) and block.get("type") == "tool_use":
                            task["tools"].add(block.get("name", ""))
                    if task["model"] is None and isinstance(usage, dict):
                        task["model"] = message.get("model")
                # A reply streams as several records that repeat one usage: count it once.
                request = record.get("requestId")
                if not isinstance(usage, dict) or (request is not None and request in seen_requests):
                    continue
                if request is not None:
                    seen_requests.add(request)
                day = days.setdefault(local_day(record["timestamp"]), empty_day())
                for name, field in TOKEN_FIELDS.items():
                    day["tokens"][name] += usage.get(field) or 0

    close_task(days, task)
    return days


def merge_into(total, days):
    for key, data in days.items():
        day = total.setdefault(key, empty_day())
        day["tasks"] += data["tasks"]
        for name, count in data["categories"].items():
            add_count(day["categories"], name, count)
        for name, count in data["models"].items():
            add_count(day["models"], name, count)
        for name, count in data["tokens"].items():
            day["tokens"][name] += count


def load_cache(path):
    try:
        with open(path, encoding="utf-8") as handle:
            return json.load(handle)
    except (OSError, ValueError):
        return {}


def save_cache(path, cache):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    temp = path + ".tmp"
    with open(temp, "w", encoding="utf-8") as handle:
        json.dump(cache, handle)
    os.replace(temp, path)


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--root", default=os.path.expanduser("~/.claude/projects"))
    parser.add_argument("--cache", default=os.path.expanduser("~/.claude/today-report/cache.json"))
    parser.add_argument("--budget", type=float, default=420, help="seconds before the run stops early")
    args = parser.parse_args()

    started = time.monotonic()
    cache = load_cache(args.cache)
    fresh = {}
    counts = {"files": 0, "scanned": 0, "stale": 0, "pending": 0, "failed": 0}

    for path in sorted(glob.glob(os.path.join(args.root, "**", "*.jsonl"), recursive=True)):
        counts["files"] += 1
        try:
            info = os.stat(path)
        except OSError:
            counts["failed"] += 1
            continue
        known = cache.get(path)
        if known and known["size"] == info.st_size and known["mtime"] == info.st_mtime:
            fresh[path] = known
            continue
        if time.monotonic() - started > args.budget:
            if known:
                fresh[path] = known
                counts["stale"] += 1
            else:
                counts["pending"] += 1
            continue
        try:
            days = scan(path)
        except OSError:
            counts["failed"] += 1
            continue
        fresh[path] = {"size": info.st_size, "mtime": info.st_mtime, "days": days}
        counts["scanned"] += 1

    save_cache(args.cache, fresh)

    total = {}
    for entry in fresh.values():
        merge_into(total, entry["days"])

    json.dump(
        {"generatedAt": int(time.time() * 1000), **counts, "days": total},
        sys.stdout,
    )


if __name__ == "__main__":
    main()
