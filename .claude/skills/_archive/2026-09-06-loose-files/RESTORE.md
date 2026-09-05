# Restore

Loose December 2025 files that sat in .claude/skills but were not skill directories (no SKILL.md), so the loader ignored them. Moved 2026-09-06 during the skills audit.

To restore: `mv <file> ../../`

## Added later the same day (skills review)

- `ACT_COMPLETE_KNOWLEDGE_BASE*.md` (three files, 205 KB, "December 2024, training data for LLMs"). Sat in
  act-brand-alignment/references but no SKILL.md pointed at them and the canonical skill in
  act-global-infrastructure does not carry them. Stale on entities and visuals.
- `README.md`, `SKILLS_GUIDE.md`, `SKILLS_MAP.md`, `skills-menu.sh` from `.claude/`. Dated 2025-12, described
  skills and a dist folder that no longer exist, repeated the retired dual-entity claim.

The one skill left, act-brand-alignment, is now synced from act-global-infrastructure by
`scripts/sync-brand-skill.mjs`. Edit it there, not here.
