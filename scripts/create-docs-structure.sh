#!/bin/bash

# ACT Documentation Reorganization - Create Directory Structure
# Run this first to set up the new documentation organization

set -e  # Exit on error

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║    ACT Documentation Reorganization - Phase 1              ║"
echo "║    Creating Directory Structure                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

cd "$(dirname "$0")/.."

echo "📁 Creating main documentation directories..."
mkdir -p docs/{quick-starts,architecture,features,integrations,infrastructure,development,operations,strategy,brand,projects,standards,examples,archive/2024-12}

echo "📁 Creating feature subdirectories..."
mkdir -p docs/features/{dashboard,knowledge-base,media-gallery,story-impact,project-enrichment}

echo "📁 Creating integration subdirectories..."
mkdir -p docs/integrations/{ghl,notion,gmail,openai,supabase,empathy-ledger}

echo "📁 Creating brand subdirectories..."
mkdir -p docs/brand/content-drafts

echo "📁 Creating project subdirectories..."
mkdir -p docs/projects/{empathy-ledger,justicehub,harvest,bcv}

echo "📁 Creating .claude skill archive..."
mkdir -p .claude/skills/act-knowledge-base/archive

echo ""
echo "✅ Directory structure created successfully!"
echo ""
echo "📊 Structure overview:"
tree -L 2 -d docs/ 2>/dev/null || find docs -type d -print | sed 's|[^/]*/| |g'

echo ""
echo "Next steps:"
echo "  1. Run: ./scripts/archive-temporal-docs.sh"
echo "  2. Run: ./scripts/reorganize-docs.sh"
echo "  3. Review and consolidate duplicates"
echo ""
