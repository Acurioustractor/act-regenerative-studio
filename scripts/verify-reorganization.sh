#!/bin/bash

# ACT Documentation Reorganization - Phase 7
# Verify reorganization is complete

set -e  # Exit on error

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║    ACT Documentation Reorganization - Phase 7              ║"
echo "║    Verification                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

cd "$(dirname "$0")/.."

echo "📊 Verification Checks..."
echo ""

# Count markdown files in root
ROOT_MD_COUNT=$(ls -1 *.md 2>/dev/null | wc -l | tr -d ' ')
echo "✓ Markdown files in root: $ROOT_MD_COUNT"

# Expected: README.md, CLAUDE.md, and maybe a couple others
if [ "$ROOT_MD_COUNT" -le 5 ]; then
    echo "  ✅ Good - Root is clean (≤5 files)"
else
    echo "  ⚠️  Warning - Still many files in root ($ROOT_MD_COUNT)"
fi

echo ""

# Count docs in organized structure
DOCS_TOTAL=$(find docs -type f -name "*.md" | wc -l | tr -d ' ')
DOCS_ARCHIVE=$(find docs/archive -type f -name "*.md" | wc -l | tr -d ' ')
DOCS_ACTIVE=$((DOCS_TOTAL - DOCS_ARCHIVE))

echo "✓ Documentation structure:"
echo "  Total docs: $DOCS_TOTAL"
echo "  Active: $DOCS_ACTIVE"
echo "  Archive: $DOCS_ARCHIVE"
echo ""

# Verify key categories exist
echo "✓ Category verification:"
for dir in quick-starts architecture features integrations projects strategy operations development infrastructure standards brand examples archive; do
    if [ -d "docs/$dir" ]; then
        COUNT=$(find "docs/$dir" -type f -name "*.md" | wc -l | tr -d ' ')
        echo "  ✅ docs/$dir/ ($COUNT files)"
    else
        echo "  ❌ docs/$dir/ missing!"
    fi
done
echo ""

# Verify navigation aids exist
echo "✓ Navigation aids:"
[ -f "CLAUDE.md" ] && echo "  ✅ CLAUDE.md (root)" || echo "  ❌ CLAUDE.md missing!"
[ -f "docs/README.md" ] && echo "  ✅ docs/README.md (index)" || echo "  ❌ docs/README.md missing!"
[ -f ".claude/SKILLS_GUIDE.md" ] && echo "  ✅ .claude/SKILLS_GUIDE.md" || echo "  ❌ SKILLS_GUIDE.md missing!"
[ -f ".claude/SKILLS_MAP.md" ] && echo "  ✅ .claude/SKILLS_MAP.md" || echo "  ❌ SKILLS_MAP.md missing!"
[ -f ".claude/skills-menu.sh" ] && echo "  ✅ .claude/skills-menu.sh" || echo "  ❌ skills-menu.sh missing!"
echo ""

# Check skills directory
echo "✓ Claude skills:"
SKILL_COUNT=$(ls -1d .claude/skills/*/ 2>/dev/null | wc -l | tr -d ' ')
echo "  Total skills: $SKILL_COUNT"

for skill_dir in .claude/skills/*/; do
    if [ -d "$skill_dir" ]; then
        skill_name=$(basename "$skill_dir")
        if [ -f "${skill_dir}SKILL.md" ] || [ -f "${skill_dir}skill.md" ]; then
            echo "  ✅ $skill_name"
        else
            echo "  ⚠️  $skill_name (missing SKILL.md)"
        fi
    fi
done
echo ""

# Check act-knowledge-base skill slimdown
echo "✓ act-knowledge-base skill:"
KB_SKILL_FILES=$(find .claude/skills/act-knowledge-base -maxdepth 1 -type f -name "*.md" | wc -l | tr -d ' ')
KB_ARCHIVE_FILES=$(find .claude/skills/act-knowledge-base/archive -type f -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
echo "  Active files: $KB_SKILL_FILES"
echo "  Archived files: $KB_ARCHIVE_FILES"

if [ "$KB_SKILL_FILES" -le 7 ]; then
    echo "  ✅ Slimmed down successfully (≤7 files)"
else
    echo "  ⚠️  Still too many files ($KB_SKILL_FILES)"
fi
echo ""

# List remaining root markdown files
echo "📄 Remaining files in root:"
ls -1 *.md 2>/dev/null | while read file; do
    echo "  • $file"
done
echo ""

echo "✅ Verification complete!"
echo ""
echo "Summary:"
echo "  Root .md files: $ROOT_MD_COUNT (target: ≤5)"
echo "  Organized docs: $DOCS_ACTIVE active + $DOCS_ARCHIVE archived"
echo "  Navigation aids: CLAUDE.md, docs/README.md, skills guide, skills map"
echo "  Skills slimmed: act-knowledge-base ($KB_SKILL_FILES files + $KB_ARCHIVE_FILES archived)"
echo ""
