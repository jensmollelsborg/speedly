# Pictet skills MCP server

A Model Context Protocol server that lets Claude list, search, create, update, and delete every skill and context in this repository. Backed by the same `catalogue/core.py` schema + validator and `manage/forms.py` writers that the Flask editor uses, so every operation goes through the same governance gates and the static `catalogue/index.html` snapshot is regenerated after each write.

## Setup

```bash
pip install -r mcp_server/requirements.txt
```

Requires Python 3.10+ (the `mcp` SDK does).

Confirm the server boots:

```bash
python3 mcp_server/server.py
# (stays attached on stdio; ctrl-C to exit)
```

## Wire it into Claude

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS):

```json
{
  "mcpServers": {
    "pictet-skills": {
      "command": "python3",
      "args": ["/Users/drofes/Documents/Speedly/pictet-regulatory-radar/mcp_server/server.py"]
    }
  }
}
```

Restart Claude Desktop. The tools appear under the connector menu.

### Claude Code

```bash
claude mcp add pictet-skills python3 /Users/drofes/Documents/Speedly/pictet-regulatory-radar/mcp_server/server.py
```

Or edit `~/.claude/settings.json` directly with the same shape as above.

## Tool reference

All 19 tools below operate on `skills/` and `contexts/` in this repo. Every create/update/delete refreshes `catalogue/index.html` automatically.

### Skills

| Tool | Purpose |
|---|---|
| `list_skills(domain?, status?, owner?, priority?)` | Filtered frontmatter list (AND-combined). Owner matches the *primary* owner (e.g. "Group Compliance" matches "Group Compliance + Op Risk"). |
| `get_skill(name)` | Full frontmatter + Markdown body. |
| `search_skills(query)` | Case-insensitive substring search across name, summary, when_to_use, description, and body. |
| `create_skill(name, status, domain, owner, summary, when_to_use, description, body?, priority?, order?)` | New skill. Validates via `core.validate_frontmatter` before writing. |
| `update_skill(name, …partial fields)` | Update existing skill. `None` ⇒ leave unchanged. Empty string for `priority` ⇒ clear it. |
| `delete_skill(name)` | Removes `skills/<name>/` entirely (incl. `references/` and `sample-runs/`). Irreversible. |

### Contexts

| Tool | Purpose |
|---|---|
| `list_contexts(type?, owner?, jurisdiction?, regulator?)` | Filtered frontmatter list. |
| `get_context(name)` | Full frontmatter + body. |
| `search_contexts(query)` | Case-insensitive substring search across name, title, summary, owner, jurisdiction, regulator, tags, and body. |
| `create_context(name, title, type, owner, summary, body?, jurisdiction?, regulator?, tags?)` | New context. |
| `update_context(name, …partial fields)` | Update existing context. |
| `delete_context(name)` | Removes `contexts/<name>/` entirely. Irreversible. |

### Lookup / meta

| Tool | Returns |
|---|---|
| `list_domains()` | Canonical domain slugs + labels in display order. |
| `list_context_types()` | Allowed values for a context's `type` field. |
| `list_priorities()` | Allowed values for `priority`. |
| `list_statuses()` | Allowed values for `status`. |
| `list_owners()` | Distinct normalised primary owners across the whole corpus. |
| `list_jurisdictions()` | Distinct jurisdictions present in the corpus. |
| `list_regulators()` | Distinct regulators present in the corpus. |
| `regenerate_catalogue()` | Force rebuild of `catalogue/index.html` (only needed if you edited files outside the server). |
| `catalogue_summary()` | High-level counts — quick health check. |

## Example prompts

Once wired in, ask Claude things like:

- *"List all built skills owned by Group Compliance."*
- *"Search the catalogue for AML and show me what we have."*
- *"Create a new roadmap skill called `kyc-refresh-cycle` under the AML domain, owned by the AML Unit, priority high, summary 'Quarterly KYC refresh prompts'."*
- *"Update the policy-compliance-checker priority to high."*
- *"Add a context item for Pictet Geneva — Swiss head office, FINMA-supervised."*
- *"Delete the test-skill I created earlier."*
- *"Give me a catalogue summary."*

Claude will pick the right tool, validate the input against the schema, and you'll see the change reflected in the Flask editor (`http://127.0.0.1:8765/`) on next reload.

## Safety notes

- The server runs locally on stdio. It has no network surface and only touches files under this repo's `skills/` and `contexts/` directories.
- `delete_*` tools are destructive and irreversible from the server. Keep the repo under git so accidental deletions are recoverable via `git checkout`.
- Validation is identical to what the Flask app and the static build enforce. A malformed write would block the catalogue rebuild; the tool result will surface the error.
