#!/usr/bin/env python3
"""Build catalogue/index.html from skills/**/SKILL.md.

Walks each skill folder, validates frontmatter, and writes the static page.
All schema + rendering logic lives in core.py.

Run:  python3 catalogue/build.py
"""

import sys

from core import ROOT, OUTPUT_PATH, SkillError, render_static


def main() -> None:
    try:
        out_path, counts = render_static()
    except SkillError as e:
        sys.exit(f"ERROR: {e}")
    print(f"Built {out_path.relative_to(ROOT)}")
    print(f"  {counts['total']} skills ({counts['built']} built · {counts['roadmap']} roadmap)")
    print(f"  {counts['contexts']} contexts")
    print(f"  {counts['owners']} owning functions")


if __name__ == "__main__":
    main()
