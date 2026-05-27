"""Shared catalogue logic: schema, frontmatter parsing, validation, rendering.

Imported by:
  - build.py (CLI that writes the static catalogue/index.html)
  - manage/app.py (Flask editor app)
"""

from __future__ import annotations

import html
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKILLS_DIR = ROOT / "skills"
CONTEXTS_DIR = ROOT / "contexts"
CATALOGUE_DIR = ROOT / "catalogue"
TEMPLATE_PATH = CATALOGUE_DIR / "template.html"
OUTPUT_PATH = CATALOGUE_DIR / "index.html"

# Skill frontmatter contract.
REQUIRED_FIELDS = ["name", "status", "domain", "owner", "summary", "when_to_use"]
VALID_STATUS = {"built", "roadmap"}
VALID_PRIORITY = {"high", "medium", "low"}

# Canonical field order for SKILL.md frontmatter (used by both reader and writer
# so round-trips are stable).
FIELD_ORDER = [
    "name",
    "description",
    "status",
    "domain",
    "owner",
    "order",
    "priority",
    "summary",
    "when_to_use",
]

# Context frontmatter contract.
CONTEXT_REQUIRED_FIELDS = ["name", "title", "type", "owner", "summary"]
CONTEXT_TYPES = {"entity", "report", "jurisdiction", "policy-area", "other"}
CONTEXT_FIELD_ORDER = [
    "name",
    "title",
    "type",
    "owner",
    "jurisdiction",
    "regulator",
    "summary",
    "tags",
]
CONTEXT_TYPE_LABELS = {
    "entity": "Entity",
    "report": "Report",
    "jurisdiction": "Jurisdiction",
    "policy-area": "Policy area",
    "other": "Other",
}

DOMAIN_ORDER = ["universal", "regulatory", "aml", "wealth", "legal", "ops", "hr"]

DOMAIN_CONFIG = {
    "universal": {
        "header": "Universal · Cross-team",
        "owner_line": 'Maintained by <strong>AI Centre of Excellence</strong> · content curated by each calling function',
        "tag_label": "Universal",
        "tag_class": "universal",
    },
    "regulatory": {
        "header": "Domain · Regulatory",
        "owner_line": 'Owned by <strong>Group Compliance</strong>',
        "tag_label": "Regulatory",
        "tag_class": "domain",
    },
    "aml": {
        "header": "Domain · AML &amp; Financial Crime",
        "owner_line": 'Owned by <strong>AML Unit</strong>',
        "tag_label": "AML",
        "tag_class": "domain",
    },
    "wealth": {
        "header": "Domain · Wealth &amp; Portfolio",
        "owner_line": 'Owned by <strong>Investment Compliance</strong> &amp; Front Office',
        "tag_label": "Wealth",
        "tag_class": "domain",
    },
    "legal": {
        "header": "Domain · Legal &amp; Contracts",
        "owner_line": 'Owned by <strong>Legal</strong>',
        "tag_label": "Legal",
        "tag_class": "domain",
    },
    "ops": {
        "header": "Domain · Operations &amp; Technology",
        "owner_line": 'Owned by <strong>COO</strong> &amp; IT Risk',
        "tag_label": "Operations",
        "tag_class": "domain",
    },
    "hr": {
        "header": "Domain · HR &amp; People",
        "owner_line": 'Owned by <strong>HR</strong>',
        "tag_label": "HR",
        "tag_class": "domain",
    },
}

OWNER_ALIASES = {
    "AI CoE": "AI Centre of Excellence",
}

PRIORITY_RANK = {"high": 0, "medium": 1, "low": 2, "": 3}

NAME_PATTERN = re.compile(r"^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$")


class SkillError(Exception):
    """Raised when a SKILL.md fails validation."""


# ─── Frontmatter parsing ────────────────────────────────────────────────────

def parse_frontmatter(text: str) -> tuple[dict, str]:
    """Split YAML-ish frontmatter from the body. Tolerant, single-line values."""
    if not text.startswith("---"):
        return {}, text
    end = text.find("\n---", 3)
    if end == -1:
        return {}, text
    fm_text = text[3:end].strip()
    body_start = end + 4
    if body_start < len(text) and text[body_start] == "\n":
        body_start += 1
    body = text[body_start:]
    out: dict[str, str] = {}
    for line in fm_text.splitlines():
        stripped = line.lstrip()
        if not stripped or stripped.startswith("#"):
            continue
        if ":" not in line:
            continue
        key, _, value = line.partition(":")
        key = key.strip()
        value = value.strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in ('"', "'"):
            value = value[1:-1]
        out[key] = value
    return out, body


def validate_frontmatter(fm: dict) -> dict[str, str]:
    """Return a dict of {field: error message} for any invalid fields. Empty if all OK."""
    errors: dict[str, str] = {}
    for f in REQUIRED_FIELDS:
        if not fm.get(f):
            errors[f] = "required"
    name = fm.get("name", "")
    if name and not NAME_PATTERN.match(name):
        errors["name"] = "must be lowercase-kebab-case (e.g. policy-lookup)"
    status = fm.get("status", "")
    if status and status not in VALID_STATUS:
        errors["status"] = f"must be one of {sorted(VALID_STATUS)}"
    domain = fm.get("domain", "")
    if domain and domain not in DOMAIN_CONFIG:
        errors["domain"] = f"must be one of {sorted(DOMAIN_CONFIG)}"
    priority = fm.get("priority", "")
    if priority and priority not in VALID_PRIORITY:
        errors["priority"] = f"must be one of {sorted(VALID_PRIORITY)} (or empty)"
    if status == "built" and priority:
        errors["priority"] = "built skills must not declare a priority"
    if status == "roadmap" and not priority:
        # Not strictly required, but recommended.
        pass
    order = fm.get("order", "")
    if order:
        try:
            int(order)
        except ValueError:
            errors["order"] = "must be an integer"
    return errors


def load_skills(skills_dir: Path | None = None) -> list[dict]:
    """Read every skills/<name>/SKILL.md and return a list of frontmatter dicts.

    Raises SkillError on the first invalid file.
    """
    base = skills_dir or SKILLS_DIR
    skills: list[dict] = []
    for skill_dir in sorted(base.iterdir()):
        if not skill_dir.is_dir():
            continue
        skill_md = skill_dir / "SKILL.md"
        if not skill_md.exists():
            continue
        fm, _ = parse_frontmatter(skill_md.read_text(encoding="utf-8"))
        errors = validate_frontmatter(fm)
        if errors:
            joined = "; ".join(f"{k}: {v}" for k, v in errors.items())
            rel = skill_md.relative_to(ROOT)
            raise SkillError(f"{rel}: {joined}")
        skills.append(fm)
    return skills


def read_skill(name: str, skills_dir: Path | None = None) -> tuple[dict, str]:
    """Return (frontmatter, body) for skills/<name>/SKILL.md."""
    base = skills_dir or SKILLS_DIR
    path = base / name / "SKILL.md"
    if not path.exists():
        raise SkillError(f"skill not found: {name}")
    return parse_frontmatter(path.read_text(encoding="utf-8"))


# ─── Contexts ───────────────────────────────────────────────────────────────

def validate_context(fm: dict) -> dict[str, str]:
    """Return {field: error} for any invalid context frontmatter. Empty if OK."""
    errors: dict[str, str] = {}
    for f in CONTEXT_REQUIRED_FIELDS:
        if not fm.get(f):
            errors[f] = "required"
    name = fm.get("name", "")
    if name and not NAME_PATTERN.match(name):
        errors["name"] = "must be lowercase-kebab-case (e.g. pictet-singapore)"
    ctype = fm.get("type", "")
    if ctype and ctype not in CONTEXT_TYPES:
        errors["type"] = f"must be one of {sorted(CONTEXT_TYPES)}"
    return errors


def load_contexts(contexts_dir: Path | None = None) -> list[dict]:
    """Read every contexts/<name>/CONTEXT.md and return a list of frontmatter dicts."""
    base = contexts_dir or CONTEXTS_DIR
    if not base.exists():
        return []
    contexts: list[dict] = []
    for ctx_dir in sorted(base.iterdir()):
        if not ctx_dir.is_dir():
            continue
        path = ctx_dir / "CONTEXT.md"
        if not path.exists():
            continue
        fm, _ = parse_frontmatter(path.read_text(encoding="utf-8"))
        errors = validate_context(fm)
        if errors:
            joined = "; ".join(f"{k}: {v}" for k, v in errors.items())
            rel = path.relative_to(ROOT)
            raise SkillError(f"{rel}: {joined}")
        contexts.append(fm)
    return contexts


def read_context(name: str, contexts_dir: Path | None = None) -> tuple[dict, str]:
    """Return (frontmatter, body) for contexts/<name>/CONTEXT.md."""
    base = contexts_dir or CONTEXTS_DIR
    path = base / name / "CONTEXT.md"
    if not path.exists():
        raise SkillError(f"context not found: {name}")
    return parse_frontmatter(path.read_text(encoding="utf-8"))


# ─── HTML rendering ─────────────────────────────────────────────────────────

def esc(s: str) -> str:
    return html.escape(s, quote=False)


def mono(s: str) -> str:
    return re.sub(r"`([^`]+)`", r'<span class="mono">\1</span>', s)


def render_card(skill: dict, link: bool = False) -> str:
    name = esc(skill["name"])
    status = skill["status"]
    status_label = "Built" if status == "built" else "Roadmap"
    summary = mono(esc(skill["summary"]))
    when = mono(esc(skill["when_to_use"]))
    owner = esc(skill["owner"])
    domain = skill["domain"]
    cfg = DOMAIN_CONFIG[domain]
    priority = skill.get("priority", "")

    attrs = f'data-status="{status}" data-domain="{domain}"'
    if status == "roadmap" and priority:
        attrs += f' data-priority="{priority}"'

    priority_tag = ""
    if status == "roadmap" and priority:
        priority_tag = (
            f'              <span class="tag priority {priority}">'
            f'{priority.capitalize()} priority</span>\n'
        )

    if link:
        name_html = f'<a class="skill-name" href="/skills/{name}">{name}</a>'
        actions_html = (
            f'              <div class="card-actions">\n'
            f'                <a class="card-edit" href="/skills/{name}/edit" title="Edit">Edit</a>\n'
            f'                <span class="status {status}">{status_label}</span>\n'
            f'              </div>\n'
        )
    else:
        name_html = f'<div class="skill-name">{name}</div>'
        actions_html = f'              <span class="status {status}">{status_label}</span>\n'

    owner_slug = _slugify(normalize_owner(skill["owner"]))
    jurisdiction = esc(skill.get("jurisdiction", ""))
    attrs += f' data-type="skill" data-owner="{owner_slug}"'
    if jurisdiction:
        attrs += f' data-jurisdiction="{jurisdiction}"'

    return (
        f'          <article class="skill-card" {attrs}>\n'
        f'            <div class="skill-card-top">\n'
        f'              {name_html}\n'
        f'{actions_html}'
        f'            </div>\n'
        f'            <p class="skill-desc">{summary}</p>\n'
        f'            <p class="skill-when">{when}</p>\n'
        f'            <div class="skill-meta">\n'
        f'              <span class="tag layer {cfg["tag_class"]}">{cfg["tag_label"]}</span>\n'
        f'{priority_tag}'
        f'              <span class="owner">{owner}</span>\n'
        f'            </div>\n'
        f'          </article>'
    )


def render_domain(domain: str, skills_in_domain: list[dict], link: bool = False) -> str:
    cfg = DOMAIN_CONFIG[domain]
    total = len(skills_in_domain)
    built = sum(1 for s in skills_in_domain if s["status"] == "built")
    skills_in_domain.sort(
        key=lambda s: (
            0 if s["status"] == "built" else 1,
            PRIORITY_RANK.get(s.get("priority", ""), 3),
            int(s.get("order", "999")),
            s["name"],
        )
    )
    cards = "\n\n".join(render_card(s, link=link) for s in skills_in_domain)
    return (
        f'      <!-- ─ {cfg["tag_label"]} ─ -->\n'
        f'      <div class="domain-group" data-domain="{domain}">\n'
        f'        <div class="domain-head">\n'
        f'          <h3>{cfg["header"]}</h3>\n'
        f'          <span class="domain-owner">{cfg["owner_line"]}</span>\n'
        f'          <span class="domain-count">{total} skills · {built} built</span>\n'
        f'        </div>\n'
        f'\n'
        f'        <div class="skill-grid">\n'
        f'\n'
        f'{cards}\n'
        f'\n'
        f'        </div>\n'
        f'      </div>'
    )


def normalize_owner(owner: str) -> str:
    primary = re.split(r"[+&]", owner)[0].strip()
    return OWNER_ALIASES.get(primary, primary)


def _slugify(value: str) -> str:
    """Filesystem-and-attr-safe slug. Lowercase, hyphenated."""
    s = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return s or "unknown"


def render_context_card(ctx: dict, link: bool = False) -> str:
    """Render a context as a card. Shares .skill-card layout with skill cards
    but uses .context-card and a type pill instead of status."""
    name = esc(ctx["name"])
    title = esc(ctx["title"])
    ctype = ctx["type"]
    type_label = CONTEXT_TYPE_LABELS.get(ctype, ctype)
    summary = mono(esc(ctx["summary"]))
    owner = esc(ctx["owner"])
    jurisdiction = ctx.get("jurisdiction", "")
    regulator = ctx.get("regulator", "")
    when_parts = [p for p in (jurisdiction, regulator) if p]
    when = esc(" · ".join(when_parts)) if when_parts else "&nbsp;"

    if link:
        title_html = f'<a class="skill-name" href="/contexts/{name}">{title}</a>'
    else:
        title_html = f'<div class="skill-name">{title}</div>'

    owner_slug = _slugify(normalize_owner(ctx["owner"]))
    juris = esc(ctx.get("jurisdiction", ""))
    juris_attr = f' data-jurisdiction="{juris}"' if juris else ""

    return (
        f'          <article class="skill-card context-card" data-domain="context" data-status="context" data-type="context" data-context-type="{ctype}" data-owner="{owner_slug}"{juris_attr}>\n'
        f'            <div class="skill-card-top">\n'
        f'              {title_html}\n'
        f'              <span class="status context-type type-{ctype}">{type_label}</span>\n'
        f'            </div>\n'
        f'            <p class="skill-desc">{summary}</p>\n'
        f'            <p class="skill-when">{when}</p>\n'
        f'            <div class="skill-meta">\n'
        f'              <span class="tag layer context">Context · <span class="mono">{name}</span></span>\n'
        f'              <span class="owner">{owner}</span>\n'
        f'            </div>\n'
        f'          </article>'
    )


def render_filter_bar(skills: list[dict], contexts: list[dict]) -> str:
    """Multi-axis filter bar HTML + inline filter JS.

    Axes (AND-combined): status, type, domain, owner, jurisdiction. Plus a
    free-text search box over the skill/context name. Per axis a single pill
    or select value is active; click an active pill to clear that axis.
    """
    n_skills = len(skills)
    n_contexts = len(contexts)
    n_built = sum(1 for s in skills if s["status"] == "built")
    n_roadmap = n_skills - n_built
    domain_counts = {d: sum(1 for s in skills if s["domain"] == d) for d in DOMAIN_CONFIG}

    # Distinct owners and jurisdictions, sorted, with counts.
    items_for_axes = skills + contexts
    owners_count: dict[str, int] = {}
    juris_count: dict[str, int] = {}
    for item in items_for_axes:
        o = normalize_owner(item["owner"])
        owners_count[o] = owners_count.get(o, 0) + 1
        j = item.get("jurisdiction", "")
        if j:
            juris_count[j] = juris_count.get(j, 0) + 1

    def pill(axis: str, value: str, label: str, count: int, active: bool = False) -> str:
        cls = "pill active" if active else "pill"
        return (
            f'<button class="{cls}" data-axis="{axis}" data-value="{value}">'
            f'{label} <span class="count">{count}</span></button>'
        )

    status_pills = (
        pill("status", "", "All", n_skills + n_contexts, active=True)
        + pill("status", "built", "Built", n_built)
        + pill("status", "roadmap", "Roadmap", n_roadmap)
    )
    type_pills = (
        pill("type", "", "All", n_skills + n_contexts, active=True)
        + pill("type", "skill", "Skills", n_skills)
        + pill("type", "context", "Contexts", n_contexts)
    )
    domain_pills = pill("domain", "", "All", n_skills + n_contexts, active=True)
    for d in DOMAIN_ORDER:
        if domain_counts[d]:
            label = DOMAIN_CONFIG[d]["tag_label"]
            if d == "ops":
                label = "Ops &amp; Tech"
            domain_pills += pill("domain", d, label, domain_counts[d])
    if n_contexts:
        domain_pills += pill("domain", "context", "Context", n_contexts)

    owner_options = '<option value="">All owners</option>'
    for owner in sorted(owners_count, key=lambda o: -owners_count[o]):
        slug = _slugify(owner)
        owner_options += f'<option value="{slug}">{esc(owner)} ({owners_count[owner]})</option>'

    juris_select = ""
    if juris_count:
        juris_options = '<option value="">All jurisdictions</option>'
        for j in sorted(juris_count):
            juris_options += f'<option value="{esc(j)}">{esc(j)} ({juris_count[j]})</option>'
        juris_select = (
            '<label class="filter-select"><span>Jurisdiction</span>'
            f'<select data-axis="jurisdiction">{juris_options}</select></label>'
        )

    bar = (
        '<div class="filter-bar" role="toolbar" aria-label="Filter">\n'
        '  <div class="filter-row">\n'
        '    <span class="filter-label">Status</span>\n'
        f'    {status_pills}\n'
        '  </div>\n'
        '  <div class="filter-row">\n'
        '    <span class="filter-label">Type</span>\n'
        f'    {type_pills}\n'
        '  </div>\n'
        '  <div class="filter-row">\n'
        '    <span class="filter-label">Domain</span>\n'
        f'    {domain_pills}\n'
        '  </div>\n'
        '  <div class="filter-row">\n'
        '    <label class="filter-select"><span>Owner</span>\n'
        f'      <select data-axis="owner">{owner_options}</select>\n'
        '    </label>\n'
        f'    {juris_select}\n'
        '    <input type="search" class="search-input" id="search" placeholder="Search by name…" aria-label="Search by name">\n'
        '  </div>\n'
        '</div>\n'
    )

    script = """
<script>
(function () {
  function init() {
    const root = document.querySelector('.filter-bar');
    if (!root) return;
    const cards = document.querySelectorAll('.skill-card');
    const groups = document.querySelectorAll('.domain-group');
    const noResults = document.getElementById('no-results');
    const filters = { status: '', type: '', domain: '', owner: '', jurisdiction: '' };
    let query = '';

    function apply() {
      let visible = 0;
      cards.forEach(card => {
        let show = true;
        for (const axis in filters) {
          const v = filters[axis];
          if (!v) continue;
          const cardValue = card.dataset[axis] || '';
          if (cardValue !== v) { show = false; break; }
        }
        if (show && query) {
          const nameEl = card.querySelector('.skill-name');
          const txt = (nameEl ? nameEl.textContent : '').toLowerCase();
          if (!txt.includes(query)) show = false;
        }
        card.classList.toggle('hidden', !show);
        if (show) visible++;
      });
      groups.forEach(group => {
        const any = Array.from(group.querySelectorAll('.skill-card')).some(c => !c.classList.contains('hidden'));
        group.style.display = any ? '' : 'none';
      });
      if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
    }

    root.querySelectorAll('.pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const axis = pill.dataset.axis;
        const value = pill.dataset.value;
        if (filters[axis] === value) return; // already active
        root.querySelectorAll('.pill[data-axis="' + axis + '"]').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        filters[axis] = value;
        apply();
      });
    });
    root.querySelectorAll('select[data-axis]').forEach(sel => {
      sel.addEventListener('change', () => {
        filters[sel.dataset.axis] = sel.value;
        apply();
      });
    });
    const search = document.getElementById('search');
    if (search) {
      search.addEventListener('input', e => {
        query = (e.target.value || '').trim().toLowerCase();
        apply();
      });
    }
    apply();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
</script>
"""
    return bar + script


def render_contexts_section(contexts: list[dict], link: bool = False) -> str:
    """Render the entire contexts section: header + cards. Empty if no contexts."""
    if not contexts:
        return ""
    contexts_sorted = sorted(contexts, key=lambda c: (c["type"], c["name"]))
    cards = "\n\n".join(render_context_card(c, link=link) for c in contexts_sorted)
    types = sorted({c["type"] for c in contexts_sorted})
    types_summary = ", ".join(CONTEXT_TYPE_LABELS.get(t, t) for t in types)
    return (
        f'      <!-- ─ Contexts ─ -->\n'
        f'      <div class="domain-group" data-domain="context">\n'
        f'        <div class="domain-head">\n'
        f'          <h3>Context · Reference</h3>\n'
        f'          <span class="domain-owner">Entity, report and policy-area context the skills reference</span>\n'
        f'          <span class="domain-count">{len(contexts_sorted)} contexts · {types_summary}</span>\n'
        f'        </div>\n'
        f'\n'
        f'        <div class="skill-grid">\n'
        f'\n'
        f'{cards}\n'
        f'\n'
        f'        </div>\n'
        f'      </div>'
    )


def render_full(
    skills: list[dict],
    template_text: str,
    contexts: list[dict] | None = None,
    link: bool = False,
) -> str:
    """Render the complete catalogue page by substituting placeholders in the template."""
    contexts = contexts or []
    total = len(skills)
    by_domain: dict[str, list[dict]] = {d: [] for d in DOMAIN_CONFIG}
    for s in skills:
        by_domain[s["domain"]].append(s)
    built_total = sum(1 for s in skills if s["status"] == "built")
    roadmap_total = total - built_total

    owners = sorted({normalize_owner(s["owner"]) for s in skills})
    kpi_owners = len(owners)
    kpi_domains = sum(1 for d in DOMAIN_CONFIG if d != "universal" and by_domain[d])

    domain_blocks = [
        render_domain(d, by_domain[d], link=link) for d in DOMAIN_ORDER if by_domain[d]
    ]
    catalogue_html = "\n\n".join(domain_blocks)
    contexts_html = render_contexts_section(contexts, link=link)

    placeholders = {
        "{{kpi_built}}": str(built_total),
        "{{kpi_roadmap}}": str(roadmap_total),
        "{{kpi_owners}}": str(kpi_owners),
        "{{kpi_domains}}": str(kpi_domains),
        "{{kpi_contexts}}": str(len(contexts)),
        "{{catalogue_groups}}": catalogue_html,
        "{{contexts_section}}": contexts_html,
        "{{filter_bar}}": render_filter_bar(skills, contexts),
    }

    out = template_text
    for key, val in placeholders.items():
        out = out.replace(key, val)

    remaining = re.findall(r"\{\{[^}]+\}\}", out)
    if remaining:
        raise SkillError(f"unsubstituted placeholders in template: {sorted(set(remaining))}")
    return out


def render_static(
    skills: list[dict] | None = None,
    contexts: list[dict] | None = None,
    template_path: Path | None = None,
    output_path: Path | None = None,
) -> tuple[Path, dict]:
    """Render the catalogue to disk. Returns (output_path, counts)."""
    template_path = template_path or TEMPLATE_PATH
    output_path = output_path or OUTPUT_PATH
    if not template_path.exists():
        raise SkillError(f"template not found at {template_path}")
    if skills is None:
        skills = load_skills()
    if contexts is None:
        contexts = load_contexts()
    template_text = template_path.read_text(encoding="utf-8")
    out = render_full(skills, template_text, contexts=contexts)
    output_path.write_text(out, encoding="utf-8")
    built = sum(1 for s in skills if s["status"] == "built")
    counts = {
        "total": len(skills),
        "built": built,
        "roadmap": len(skills) - built,
        "owners": len({normalize_owner(s["owner"]) for s in skills}),
        "contexts": len(contexts),
    }
    return output_path, counts
