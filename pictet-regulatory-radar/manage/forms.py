"""Frontmatter writer + SKILL.md round-tripping for the editor app.

The reader (parse_frontmatter) lives in catalogue/core.py. This module is the
mirror: it serialises a frontmatter dict back to YAML-ish text and writes the
SKILL.md to disk.
"""

from __future__ import annotations

import sys
from pathlib import Path

CATALOGUE_DIR = Path(__file__).resolve().parent.parent / "catalogue"
sys.path.insert(0, str(CATALOGUE_DIR))

from core import (  # noqa: E402
    CONTEXT_FIELD_ORDER,
    CONTEXTS_DIR,
    FIELD_ORDER,
    SKILLS_DIR,
    SkillError,
)


def serialize_frontmatter(fields: dict, field_order: list[str] | None = None) -> str:
    """Render a frontmatter dict as `key: value` lines in canonical order."""
    order = field_order or FIELD_ORDER
    lines: list[str] = []
    seen: set[str] = set()
    for key in order:
        if key not in fields:
            continue
        value = fields[key]
        if value is None or value == "":
            continue
        lines.append(f"{key}: {_format_value(str(value))}")
        seen.add(key)
    for key, value in fields.items():
        if key in seen or value is None or value == "":
            continue
        lines.append(f"{key}: {_format_value(str(value))}")
    return "\n".join(lines)


def _format_value(value: str) -> str:
    """Emit a single-line YAML value.

    The reader (core.parse_frontmatter) strips at most one matching pair of
    surrounding `"..."` or `'...'`. We only need to defend against that case:
    if the value's first and last chars are the same quote, the reader would
    discard them — wrap in the *opposite* quote to round-trip safely. Anything
    else is emitted as-is; the reader doesn't interpret `[`, `{`, etc.
    """
    if len(value) >= 2 and value[0] == value[-1] and value[0] in ('"', "'"):
        wrap = "'" if value[0] == '"' else '"'
        return f"{wrap}{value}{wrap}"
    return value


def write_skill(name: str, fields: dict, body: str, skills_dir: Path | None = None) -> Path:
    """Compose and write skills/<name>/SKILL.md. Creates the folder if missing."""
    base = skills_dir or SKILLS_DIR
    skill_dir = base / name
    skill_dir.mkdir(parents=True, exist_ok=True)
    path = skill_dir / "SKILL.md"
    fm_text = serialize_frontmatter(fields)
    body_text = body.strip("\n")
    content = f"---\n{fm_text}\n---\n"
    if body_text:
        content += f"\n{body_text}\n"
    path.write_text(content, encoding="utf-8")
    return path


def skill_exists(name: str, skills_dir: Path | None = None) -> bool:
    base = skills_dir or SKILLS_DIR
    return (base / name / "SKILL.md").exists()


def write_context(name: str, fields: dict, body: str, contexts_dir: Path | None = None) -> Path:
    """Compose and write contexts/<name>/CONTEXT.md. Creates the folder if missing."""
    base = contexts_dir or CONTEXTS_DIR
    ctx_dir = base / name
    ctx_dir.mkdir(parents=True, exist_ok=True)
    path = ctx_dir / "CONTEXT.md"
    fm_text = serialize_frontmatter(fields, field_order=CONTEXT_FIELD_ORDER)
    body_text = body.strip("\n")
    content = f"---\n{fm_text}\n---\n"
    if body_text:
        content += f"\n{body_text}\n"
    path.write_text(content, encoding="utf-8")
    return path


def context_exists(name: str, contexts_dir: Path | None = None) -> bool:
    base = contexts_dir or CONTEXTS_DIR
    return (base / name / "CONTEXT.md").exists()


def delete_skill(name: str, skills_dir: Path | None = None) -> Path:
    """Permanently delete skills/<name>/ (incl. references/ and sample-runs/)."""
    base = skills_dir or SKILLS_DIR
    target = base / name
    if not target.exists():
        raise SkillError(f"skill not found: {name}")
    import shutil

    shutil.rmtree(target)
    return target


def delete_context(name: str, contexts_dir: Path | None = None) -> Path:
    """Permanently delete contexts/<name>/."""
    base = contexts_dir or CONTEXTS_DIR
    target = base / name
    if not target.exists():
        raise SkillError(f"context not found: {name}")
    import shutil

    shutil.rmtree(target)
    return target


__all__ = [
    "SkillError",
    "serialize_frontmatter",
    "write_skill",
    "skill_exists",
    "delete_skill",
    "write_context",
    "context_exists",
    "delete_context",
]
