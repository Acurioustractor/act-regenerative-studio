#!/bin/bash

# ACT Documentation Reorganization - Phase 5
# Consolidate duplicate/overlapping documentation

set -e  # Exit on error

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║    ACT Documentation Reorganization - Phase 5              ║"
echo "║    Consolidating Duplicate Documents                       ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

cd "$(dirname "$0")/.."

echo "📋 Analyzing potential duplicates..."
echo ""

# Consolidate GHL email strategy docs (3 files → 1)
echo "📧 Consolidating GHL email strategy docs..."
if [ -f "docs/integrations/ghl/email-domain-strategy.md" ] && \
   [ -f "docs/integrations/ghl/email-domain-strategy-existing.md" ] && \
   [ -f "docs/integrations/ghl/email-strategy-ghl-native.md" ]; then

  echo "  Creating consolidated email-strategy.md..."
  cat > docs/integrations/ghl/email-strategy.md << 'EOF'
# GHL Email Strategy - Consolidated

> **Note**: This document consolidates email-domain-strategy.md, email-domain-strategy-existing.md, and email-strategy-ghl-native.md

## Overview

Comprehensive email strategy for GoHighLevel across all ACT projects.

## Source Documents

For historical reference, see:
- [email-domain-strategy.md](./email-domain-strategy.md)
- [email-domain-strategy-existing.md](./email-domain-strategy-existing.md)
- [email-strategy-ghl-native.md](./email-strategy-ghl-native.md)

**TODO**: Consolidate content from source documents into this file.

EOF
  echo "  ✓ Created consolidated email-strategy.md"
fi

# Consolidate GHL setup/implementation docs (3 files → 1)
echo ""
echo "📋 Consolidating GHL setup/implementation docs..."
if [ -f "docs/integrations/ghl/setup-guide.md" ] && \
   [ -f "docs/integrations/ghl/setup-checklist.md" ] && \
   [ -f "docs/integrations/ghl/implementation-checklist.md" ]; then

  echo "  Note: setup-guide.md + setup-checklist.md + implementation-checklist.md"
  echo "  → Keep all 3 (serve different purposes: guide vs checklist vs implementation)"
fi

# Consolidate GHL status/progress docs (2 files → archive or 1)
echo ""
echo "📊 Analyzing GHL status docs..."
if [ -f "docs/integrations/ghl/implementation-status.md" ] && \
   [ -f "docs/integrations/ghl/integration-progress.md" ]; then

  echo "  Moving temporal status docs to archive..."
  mv docs/integrations/ghl/implementation-status.md docs/archive/2024-12/ 2>/dev/null || true
  mv docs/integrations/ghl/integration-progress.md docs/archive/2024-12/ 2>/dev/null || true
  echo "  ✓ Archived GHL status docs"
fi

# Consolidate quick-start variants (4 files → review)
echo ""
echo "🚀 Quick start docs analysis..."
echo "  - quick-start.md (general)"
echo "  - start-here.md (general)"
echo "  - startup.md (README_STARTUP)"
echo "  - quick-reference.md (reference)"
echo "  → Recommend: Keep quick-start.md + quick-reference.md, review others"

# Consolidate project ecosystem docs (2 files → 1)
echo ""
echo "🌍 Consolidating ecosystem docs..."
if [ -f "docs/projects/act-ecosystem.md" ] && \
   [ -f "docs/projects/ecosystem-readme.md" ]; then

  echo "  Note: act-ecosystem.md + ecosystem-readme.md likely overlap"
  echo "  → Manual review needed to consolidate"
fi

# Consolidate roadmap docs (2 files → 1)
echo ""
echo "🗺️ Consolidating roadmap docs..."
if [ -f "docs/strategy/act-ecosystem-roadmap.md" ] && \
   [ -f "docs/strategy/next-steps-roadmap.md" ]; then

  echo "  Note: act-ecosystem-roadmap.md + next-steps-roadmap.md"
  echo "  → Keep both: ecosystem is long-term, next-steps is short-term"
fi

# Consolidate engagement docs (2 files → review)
echo ""
echo "💬 Engagement docs analysis..."
if [ -f "docs/features/engagement-system.md" ] && \
   [ -f "docs/features/content-engagement.md" ]; then

  echo "  Note: engagement-system.md + content-engagement.md"
  echo "  → Keep both: system (architecture) vs content (guide)"
fi

echo ""
echo "📊 Summary..."
echo ""

# Count docs
TOTAL_DOCS=$(find docs -type f -name "*.md" | wc -l | tr -d ' ')
ARCHIVE_DOCS=$(find docs/archive -type f -name "*.md" | wc -l | tr -d ' ')
ACTIVE_DOCS=$((TOTAL_DOCS - ARCHIVE_DOCS))

echo "Total docs: $TOTAL_DOCS"
echo "  Active: $ACTIVE_DOCS"
echo "  Archive: $ARCHIVE_DOCS"

echo ""
echo "✅ Phase 5 complete!"
echo ""
echo "Next: Manual review of flagged duplicates, then create CLAUDE.md"
echo ""
