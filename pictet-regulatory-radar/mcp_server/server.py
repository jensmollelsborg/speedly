#!/usr/bin/env python3
"""Pictet skills + contexts MCP server.

Exposes CRUD operations over the local skills/ and contexts/ trees so Claude can
list, search, create, update, and delete content through the Model Context
Protocol. Reuses catalogue/core.py for schema + validation + rendering and
manage/forms.py for the writers + deleters.

Run directly:
    python3 mcp_server/server.py

Wire into Claude (Desktop or Code) via the mcpServers config — see README.md.
"""

from __future__ import annotations

import sys
from pathlib import Path
from typing import Any

from mcp.server.fastmcp import FastMCP

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
sys.path.insert(0, str(ROOT / "catalogue"))
sys.path.insert(0, str(ROOT / "manage"))

import core  # noqa: E402
from forms import (  # noqa: E402
    context_exists,
    delete_context as _delete_context_dir,
    delete_skill as _delete_skill_dir,
    skill_exists,
    write_context,
    write_skill,
)

mcp = FastMCP("pictet-skills")


# ─── Helpers ───────────────────────────────────────────────────────────────

def _regenerate() -> dict[str, Any]:
    """Refresh the static catalogue/index.html. Returns counts; never raises."""
    try:
        out_path, counts = core.render_static()
        return {
            "ok": True,
            "path": str(out_path.relative_to(core.ROOT)),
            "counts": counts,
        }
    except core.SkillError as e:
        return {"ok": False, "error": str(e)}


def _apply_partial(existing: dict, updates: dict) -> dict:
    """Merge `updates` into a copy of `existing`. None ⇒ leave alone;
    empty string ⇒ remove the key (clear optional field)."""
    merged = dict(existing)
    for key, value in updates.items():
        if value is None:
            continue
        if value == "":
            merged.pop(key, None)
        else:
            merged[key] = str(value)
    return merged


def _format_validation_error(errors: dict[str, str]) -> str:
    return "; ".join(f"{k}: {v}" for k, v in errors.items())


# ─── Skill tools ───────────────────────────────────────────────────────────

@mcp.tool()
def list_skills(
    domain: str | None = None,
    status: str | None = None,
    owner: str | None = None,
    priority: str | None = None,
) -> dict:
    """List skills, optionally filtered.

    Filters compose with AND. `owner` is matched against the normalised
    primary owner (e.g. "Group Compliance" matches "Group Compliance + Op Risk").
    Returns frontmatter only; use `get_skill` for the body.
    """
    skills = core.load_skills()
    if domain:
        skills = [s for s in skills if s["domain"] == domain]
    if status:
        skills = [s for s in skills if s["status"] == status]
    if owner:
        target = core._slugify(owner)
        skills = [
            s
            for s in skills
            if core._slugify(core.normalize_owner(s["owner"])) == target
        ]
    if priority:
        skills = [s for s in skills if s.get("priority", "") == priority]
    return {"count": len(skills), "skills": skills}


@mcp.tool()
def get_skill(name: str) -> dict:
    """Read one skill's frontmatter and Markdown body."""
    try:
        fm, body = core.read_skill(name)
    except core.SkillError as e:
        raise ValueError(str(e))
    return {"name": name, "frontmatter": fm, "body": body}


@mcp.tool()
def search_skills(query: str) -> dict:
    """Case-insensitive substring search across name, summary, when_to_use,
    description, and the Markdown body."""
    q = query.strip().lower()
    if not q:
        return {"count": 0, "skills": []}
    matches: list[dict] = []
    for stub in core.load_skills():
        fm, body = core.read_skill(stub["name"])
        haystack = " ".join(
            [
                fm.get("name", ""),
                fm.get("summary", ""),
                fm.get("when_to_use", ""),
                fm.get("description", ""),
                fm.get("owner", ""),
                body,
            ]
        ).lower()
        if q in haystack:
            matches.append(fm)
    return {"count": len(matches), "skills": matches}


@mcp.tool()
def create_skill(
    name: str,
    status: str,
    domain: str,
    owner: str,
    summary: str,
    when_to_use: str,
    description: str,
    body: str = "",
    priority: str = "",
    order: int = 10,
) -> dict:
    """Create a new skill.

    Required: name (lowercase-kebab-case), status ('built'|'roadmap'), domain,
    owner, summary, when_to_use, description. `priority` is required when
    status='roadmap'. `body` is the Markdown skill instructions.

    Fails if a skill with the same name already exists. After a successful
    write the static catalogue/index.html is regenerated.
    """
    if skill_exists(name):
        raise ValueError(f"skill '{name}' already exists")

    fields: dict[str, str] = {
        "name": name,
        "description": description,
        "status": status,
        "domain": domain,
        "owner": owner,
        "order": str(order),
        "summary": summary,
        "when_to_use": when_to_use,
    }
    if priority:
        fields["priority"] = priority

    errors = core.validate_frontmatter(fields)
    if errors:
        raise ValueError(f"validation failed: {_format_validation_error(errors)}")

    path = write_skill(name, fields, body)
    return {
        "created": True,
        "name": name,
        "path": str(path.relative_to(core.ROOT)),
        "catalogue": _regenerate(),
    }


@mcp.tool()
def update_skill(
    name: str,
    description: str | None = None,
    status: str | None = None,
    domain: str | None = None,
    owner: str | None = None,
    summary: str | None = None,
    when_to_use: str | None = None,
    priority: str | None = None,
    order: int | None = None,
    body: str | None = None,
) -> dict:
    """Update an existing skill.

    Pass only the fields you want to change. None ⇒ leave unchanged.
    Empty string for `priority` ⇒ clear it (the only optional field).
    `body` ⇒ replace the full Markdown body; pass None to keep current body.
    """
    if not skill_exists(name):
        raise ValueError(f"skill '{name}' not found")

    existing_fm, existing_body = core.read_skill(name)
    updates: dict[str, Any] = {
        "description": description,
        "status": status,
        "domain": domain,
        "owner": owner,
        "summary": summary,
        "when_to_use": when_to_use,
        "priority": priority,
    }
    if order is not None:
        updates["order"] = order

    merged = _apply_partial(existing_fm, updates)
    merged["name"] = name  # name is immutable

    errors = core.validate_frontmatter(merged)
    if errors:
        raise ValueError(f"validation failed: {_format_validation_error(errors)}")

    new_body = existing_body if body is None else body
    path = write_skill(name, merged, new_body)
    return {
        "updated": True,
        "name": name,
        "path": str(path.relative_to(core.ROOT)),
        "catalogue": _regenerate(),
    }


@mcp.tool()
def delete_skill(name: str) -> dict:
    """Permanently delete skills/<name>/ (SKILL.md, references/, sample-runs/).

    This is irreversible from the MCP tool's perspective. If the folder also
    contains references or sample runs that may have been authored by hand,
    they will be removed too.
    """
    try:
        target = _delete_skill_dir(name)
    except core.SkillError as e:
        raise ValueError(str(e))
    return {
        "deleted": True,
        "name": name,
        "path": str(target.relative_to(core.ROOT)),
        "catalogue": _regenerate(),
    }


# ─── Context tools ─────────────────────────────────────────────────────────

@mcp.tool()
def list_contexts(
    type: str | None = None,
    owner: str | None = None,
    jurisdiction: str | None = None,
    regulator: str | None = None,
) -> dict:
    """List context items, optionally filtered (AND-combined)."""
    contexts = core.load_contexts()
    if type:
        contexts = [c for c in contexts if c["type"] == type]
    if owner:
        target = core._slugify(owner)
        contexts = [
            c
            for c in contexts
            if core._slugify(core.normalize_owner(c["owner"])) == target
        ]
    if jurisdiction:
        contexts = [c for c in contexts if c.get("jurisdiction", "") == jurisdiction]
    if regulator:
        contexts = [c for c in contexts if c.get("regulator", "") == regulator]
    return {"count": len(contexts), "contexts": contexts}


@mcp.tool()
def get_context(name: str) -> dict:
    """Read one context item's frontmatter and Markdown body."""
    try:
        fm, body = core.read_context(name)
    except core.SkillError as e:
        raise ValueError(str(e))
    return {"name": name, "frontmatter": fm, "body": body}


@mcp.tool()
def search_contexts(query: str) -> dict:
    """Case-insensitive substring search across name, title, summary, owner,
    jurisdiction, regulator, tags, and the Markdown body."""
    q = query.strip().lower()
    if not q:
        return {"count": 0, "contexts": []}
    matches: list[dict] = []
    for stub in core.load_contexts():
        fm, body = core.read_context(stub["name"])
        haystack = " ".join(
            [
                fm.get("name", ""),
                fm.get("title", ""),
                fm.get("summary", ""),
                fm.get("owner", ""),
                fm.get("jurisdiction", ""),
                fm.get("regulator", ""),
                fm.get("tags", ""),
                body,
            ]
        ).lower()
        if q in haystack:
            matches.append(fm)
    return {"count": len(matches), "contexts": matches}


@mcp.tool()
def create_context(
    name: str,
    title: str,
    type: str,
    owner: str,
    summary: str,
    body: str = "",
    jurisdiction: str = "",
    regulator: str = "",
    tags: str = "",
) -> dict:
    """Create a new context item.

    Required: name (lowercase-kebab-case), title, type (one of: entity, report,
    jurisdiction, policy-area, other), owner, summary. Optional: jurisdiction,
    regulator, tags (comma-separated), Markdown body.
    """
    if context_exists(name):
        raise ValueError(f"context '{name}' already exists")

    fields: dict[str, str] = {
        "name": name,
        "title": title,
        "type": type,
        "owner": owner,
        "summary": summary,
    }
    if jurisdiction:
        fields["jurisdiction"] = jurisdiction
    if regulator:
        fields["regulator"] = regulator
    if tags:
        fields["tags"] = tags

    errors = core.validate_context(fields)
    if errors:
        raise ValueError(f"validation failed: {_format_validation_error(errors)}")

    path = write_context(name, fields, body)
    return {
        "created": True,
        "name": name,
        "path": str(path.relative_to(core.ROOT)),
        "catalogue": _regenerate(),
    }


@mcp.tool()
def update_context(
    name: str,
    title: str | None = None,
    type: str | None = None,
    owner: str | None = None,
    summary: str | None = None,
    jurisdiction: str | None = None,
    regulator: str | None = None,
    tags: str | None = None,
    body: str | None = None,
) -> dict:
    """Update an existing context. None ⇒ leave unchanged. Empty string for
    any optional field (jurisdiction, regulator, tags) ⇒ clear it."""
    if not context_exists(name):
        raise ValueError(f"context '{name}' not found")

    existing_fm, existing_body = core.read_context(name)
    updates: dict[str, Any] = {
        "title": title,
        "type": type,
        "owner": owner,
        "summary": summary,
        "jurisdiction": jurisdiction,
        "regulator": regulator,
        "tags": tags,
    }
    merged = _apply_partial(existing_fm, updates)
    merged["name"] = name

    errors = core.validate_context(merged)
    if errors:
        raise ValueError(f"validation failed: {_format_validation_error(errors)}")

    new_body = existing_body if body is None else body
    path = write_context(name, merged, new_body)
    return {
        "updated": True,
        "name": name,
        "path": str(path.relative_to(core.ROOT)),
        "catalogue": _regenerate(),
    }


@mcp.tool()
def delete_context(name: str) -> dict:
    """Permanently delete contexts/<name>/. Irreversible from this tool."""
    try:
        target = _delete_context_dir(name)
    except core.SkillError as e:
        raise ValueError(str(e))
    return {
        "deleted": True,
        "name": name,
        "path": str(target.relative_to(core.ROOT)),
        "catalogue": _regenerate(),
    }


# ─── Meta / lookup tools ──────────────────────────────────────────────────

@mcp.tool()
def list_domains() -> dict:
    """List the canonical skill domains, in display order."""
    return {
        "domains": [
            {"slug": d, "label": core.DOMAIN_CONFIG[d]["tag_label"]}
            for d in core.DOMAIN_ORDER
        ]
    }


@mcp.tool()
def list_context_types() -> dict:
    """List the allowed values for a context's `type` field."""
    return {"types": sorted(core.CONTEXT_TYPES)}


@mcp.tool()
def list_priorities() -> dict:
    """List the allowed values for a roadmap skill's `priority` field."""
    return {"priorities": sorted(core.VALID_PRIORITY)}


@mcp.tool()
def list_statuses() -> dict:
    """List the allowed values for a skill's `status` field."""
    return {"statuses": sorted(core.VALID_STATUS)}


@mcp.tool()
def list_owners() -> dict:
    """Distinct normalised primary owners across skills + contexts."""
    items = core.load_skills() + core.load_contexts()
    owners = sorted({core.normalize_owner(i["owner"]) for i in items})
    return {"owners": owners}


@mcp.tool()
def list_jurisdictions() -> dict:
    """Distinct jurisdictions present across the corpus (currently contexts only)."""
    items = core.load_skills() + core.load_contexts()
    juris = sorted(
        {i.get("jurisdiction", "") for i in items if i.get("jurisdiction")}
    )
    return {"jurisdictions": juris}


@mcp.tool()
def list_regulators() -> dict:
    """Distinct regulators present across the corpus (currently contexts only)."""
    items = core.load_skills() + core.load_contexts()
    regs = sorted(
        {i.get("regulator", "") for i in items if i.get("regulator")}
    )
    return {"regulators": regs}


@mcp.tool()
def regenerate_catalogue() -> dict:
    """Force a rebuild of the static catalogue/index.html. The CRUD tools call
    this automatically after a successful write; use this if you've edited
    files outside the MCP server."""
    return _regenerate()


@mcp.tool()
def catalogue_summary() -> dict:
    """High-level counts: number of skills (built / roadmap), contexts, owners,
    domains. Useful as a quick health check."""
    skills = core.load_skills()
    contexts = core.load_contexts()
    built = sum(1 for s in skills if s["status"] == "built")
    by_domain = {d: 0 for d in core.DOMAIN_CONFIG}
    for s in skills:
        by_domain[s["domain"]] += 1
    return {
        "skills_total": len(skills),
        "skills_built": built,
        "skills_roadmap": len(skills) - built,
        "contexts_total": len(contexts),
        "owners_total": len(
            {core.normalize_owner(i["owner"]) for i in skills + contexts}
        ),
        "skills_by_domain": by_domain,
    }


if __name__ == "__main__":
    mcp.run()
