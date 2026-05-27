#!/usr/bin/env python3
"""Local skills-management web app.

  python3 manage/app.py    # serves http://127.0.0.1:8765/

Read paths use catalogue/core.py (parser + validator + renderer). Writes go
through manage/forms.py (frontmatter serializer + file writer). The static
catalogue/index.html is regenerated after every successful save so the offline
snapshot stays in sync with the live editor.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CATALOGUE_DIR = ROOT / "catalogue"
sys.path.insert(0, str(CATALOGUE_DIR))

from flask import (  # noqa: E402
    Flask,
    Response,
    abort,
    flash,
    get_flashed_messages,
    redirect,
    render_template,
    request,
    url_for,
)

import core  # noqa: E402
from forms import (  # noqa: E402
    context_exists,
    skill_exists,
    write_context,
    write_skill,
)

app = Flask(__name__, static_folder="static", template_folder="templates")
app.secret_key = "pictet-skills-local-only"  # local single-user app; not security-sensitive

PORT = 8765


# ─── Helpers ───────────────────────────────────────────────────────────────

def _shared_css() -> str:
    """Extract the inline <style> block from catalogue/template.html so the editor
    pages share visual identity with the static catalogue."""
    text = core.TEMPLATE_PATH.read_text(encoding="utf-8")
    m = re.search(r"<style>(.*?)</style>", text, flags=re.DOTALL)
    return m.group(1) if m else ""


_SHARED_CSS_CACHE: str | None = None


def shared_css() -> str:
    global _SHARED_CSS_CACHE
    if _SHARED_CSS_CACHE is None:
        _SHARED_CSS_CACHE = _shared_css()
    return _SHARED_CSS_CACHE


def regenerate_static_snapshot() -> None:
    """After a write, refresh catalogue/index.html so the static demo stays current."""
    try:
        core.render_static()
    except core.SkillError:
        # If the on-disk corpus is now invalid we don't want the save handler
        # to crash; the editor will surface the issue at the next read.
        pass


def fields_from_form(form, field_order=None) -> dict:
    """Normalise a posted form into a frontmatter dict."""
    order = field_order or core.FIELD_ORDER
    out: dict[str, str] = {}
    for key in order:
        if key in form:
            out[key] = form.get(key, "").strip()
    return out


# ─── Routes ────────────────────────────────────────────────────────────────

@app.route("/")
def catalogue_view():
    try:
        skills = core.load_skills()
        contexts = core.load_contexts()
    except core.SkillError as e:
        return render_template("error.html", message=str(e), css=shared_css()), 500

    by_domain: dict[str, list[dict]] = {d: [] for d in core.DOMAIN_CONFIG}
    for s in skills:
        by_domain[s["domain"]].append(s)

    blocks = []
    for d in core.DOMAIN_ORDER:
        if by_domain[d]:
            blocks.append((d, core.render_domain(d, by_domain[d], link=True)))

    contexts_html = core.render_contexts_section(contexts, link=True)
    filter_bar = core.render_filter_bar(skills, contexts)

    built = sum(1 for s in skills if s["status"] == "built")
    counts = {
        "total": len(skills),
        "built": built,
        "roadmap": len(skills) - built,
        "owners": len({core.normalize_owner(s["owner"]) for s in skills}),
        "domains": sum(1 for d in core.DOMAIN_CONFIG if d != "universal" and by_domain[d]),
        "per_domain": {d: len(by_domain[d]) for d in core.DOMAIN_CONFIG},
        "contexts": len(contexts),
    }
    return render_template(
        "catalogue.html",
        blocks=blocks,
        contexts_html=contexts_html,
        filter_bar=filter_bar,
        counts=counts,
        css=shared_css(),
    )


@app.route("/skills/new", methods=["GET", "POST"])
def skill_new():
    if request.method == "GET":
        return render_template(
            "skill_form.html",
            mode="new",
            fields={"status": "roadmap", "order": "10"},
            body="",
            errors={},
            css=shared_css(),
            domain_config=core.DOMAIN_CONFIG,
        )

    fields = fields_from_form(request.form)
    body = request.form.get("body", "")
    name = fields.get("name", "").strip()

    errors = core.validate_frontmatter(fields)
    if name and skill_exists(name):
        errors["name"] = f"a skill named '{name}' already exists"

    if errors:
        return render_template(
            "skill_form.html",
            mode="new",
            fields=fields,
            body=body,
            errors=errors,
            css=shared_css(),
            domain_config=core.DOMAIN_CONFIG,
        ), 400

    write_skill(name, fields, body)
    regenerate_static_snapshot()
    flash(f"Created {name}.", "success")
    return redirect(url_for("skill_view", name=name))


@app.route("/skills/<name>")
def skill_view(name: str):
    try:
        fm, body = core.read_skill(name)
    except core.SkillError:
        abort(404)
    return render_template(
        "skill_view.html",
        name=name,
        fields=fm,
        body=body,
        css=shared_css(),
        domain_config=core.DOMAIN_CONFIG,
        field_order=core.FIELD_ORDER,
    )


@app.route("/skills/<name>/edit", methods=["GET"])
def skill_edit_get(name: str):
    try:
        fm, body = core.read_skill(name)
    except core.SkillError:
        abort(404)
    return render_template(
        "skill_form.html",
        mode="edit",
        name=name,
        fields=fm,
        body=body,
        errors={},
        css=shared_css(),
        domain_config=core.DOMAIN_CONFIG,
    )


@app.route("/skills/<name>", methods=["POST"])
def skill_edit_post(name: str):
    if not skill_exists(name):
        abort(404)

    fields = fields_from_form(request.form)
    body = request.form.get("body", "")
    fields["name"] = name  # name is immutable in edit mode

    errors = core.validate_frontmatter(fields)
    if errors:
        return render_template(
            "skill_form.html",
            mode="edit",
            name=name,
            fields=fields,
            body=body,
            errors=errors,
            css=shared_css(),
            domain_config=core.DOMAIN_CONFIG,
        ), 400

    write_skill(name, fields, body)
    regenerate_static_snapshot()
    flash(f"Saved {name}.", "success")
    return redirect(url_for("skill_view", name=name))


@app.route("/api/skills")
def api_skills():
    try:
        skills = core.load_skills()
    except core.SkillError as e:
        return {"error": str(e)}, 500
    return {"skills": skills, "count": len(skills)}


# ─── Context routes ────────────────────────────────────────────────────────

@app.route("/contexts/new", methods=["GET", "POST"])
def context_new():
    if request.method == "GET":
        return render_template(
            "context_form.html",
            mode="new",
            fields={"type": "entity"},
            body="",
            errors={},
            css=shared_css(),
            context_types=sorted(core.CONTEXT_TYPES),
        )

    fields = fields_from_form(request.form, field_order=core.CONTEXT_FIELD_ORDER)
    body = request.form.get("body", "")
    name = fields.get("name", "").strip()

    errors = core.validate_context(fields)
    if name and context_exists(name):
        errors["name"] = f"a context named '{name}' already exists"

    if errors:
        return render_template(
            "context_form.html",
            mode="new",
            fields=fields,
            body=body,
            errors=errors,
            css=shared_css(),
            context_types=sorted(core.CONTEXT_TYPES),
        ), 400

    write_context(name, fields, body)
    regenerate_static_snapshot()
    flash(f"Created context {name}.", "success")
    return redirect(url_for("context_view", name=name))


@app.route("/contexts/<name>")
def context_view(name: str):
    try:
        fm, body = core.read_context(name)
    except core.SkillError:
        abort(404)
    return render_template(
        "context_view.html",
        name=name,
        fields=fm,
        body=body,
        css=shared_css(),
        field_order=core.CONTEXT_FIELD_ORDER,
    )


@app.route("/contexts/<name>/edit", methods=["GET"])
def context_edit_get(name: str):
    try:
        fm, body = core.read_context(name)
    except core.SkillError:
        abort(404)
    return render_template(
        "context_form.html",
        mode="edit",
        name=name,
        fields=fm,
        body=body,
        errors={},
        css=shared_css(),
        context_types=sorted(core.CONTEXT_TYPES),
    )


@app.route("/contexts/<name>", methods=["POST"])
def context_edit_post(name: str):
    if not context_exists(name):
        abort(404)

    fields = fields_from_form(request.form, field_order=core.CONTEXT_FIELD_ORDER)
    body = request.form.get("body", "")
    fields["name"] = name

    errors = core.validate_context(fields)
    if errors:
        return render_template(
            "context_form.html",
            mode="edit",
            name=name,
            fields=fields,
            body=body,
            errors=errors,
            css=shared_css(),
            context_types=sorted(core.CONTEXT_TYPES),
        ), 400

    write_context(name, fields, body)
    regenerate_static_snapshot()
    flash(f"Saved context {name}.", "success")
    return redirect(url_for("context_view", name=name))


@app.route("/api/contexts")
def api_contexts():
    try:
        contexts = core.load_contexts()
    except core.SkillError as e:
        return {"error": str(e)}, 500
    return {"contexts": contexts, "count": len(contexts)}


@app.route("/styles.css")
def styles():
    return Response(shared_css(), mimetype="text/css")


@app.errorhandler(404)
def not_found(e):
    return render_template("error.html", message="Not found.", css=shared_css()), 404


if __name__ == "__main__":
    print(f"Pictet skills editor → http://127.0.0.1:{PORT}/")
    app.run(host="127.0.0.1", port=PORT, debug=False)
