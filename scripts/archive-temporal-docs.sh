#!/bin/bash

# ACT Documentation Reorganization - Phase 2
# Archive temporal snapshot files from 2024-12

set -e  # Exit on error

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║    ACT Documentation Reorganization - Phase 2              ║"
echo "║    Archiving Temporal Snapshots                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

cd "$(dirname "$0")/.."

echo "📦 Archiving temporal snapshot files to docs/archive/2024-12/..."
echo ""

# Function to move file if it exists
move_if_exists() {
    if [ -f "$1" ]; then
        mv "$1" "docs/archive/2024-12/"
        echo "  ✓ Archived: $1"
    fi
}

# Phase completion snapshots
move_if_exists "SETUP_COMPLETE.md"
move_if_exists "PHASE_1_COMPLETE.md"
move_if_exists "PHASE_2_COMPLETE.md"

# Quick Win completion snapshots
move_if_exists "QUICK_WIN_1_COMPLETE.md"
move_if_exists "QUICK_WIN_2_COMPLETE.md"
move_if_exists "QUICK_WIN_3_COMPLETE.md"
move_if_exists "QUICK_WIN_4_COMPLETE.md"
move_if_exists "QUICK_WIN_5_COMPLETE.md"

# Status reports
move_if_exists "GMAIL_AUTH_STATUS.md"
move_if_exists "GMAIL_OAUTH_STATUS.md"
move_if_exists "KNOWLEDGE_SYSTEM_STATUS.md"
move_if_exists "LIVING_WIKI_STATUS.md"
move_if_exists "PROJECT_STATUS.md"

# Implementation summaries
move_if_exists "AUTO_APPROVAL_IMPLEMENTATION.md"
move_if_exists "EMBEDDINGS_IMPLEMENTATION.md"
move_if_exists "NOTIFICATIONS_IMPLEMENTATION.md"
move_if_exists "REVIEW_QUEUE_IMPLEMENTATION.md"

# Setup/config guides (keep most recent versions, archive old)
move_if_exists "GMAIL_OAUTH_SETUP_OLD.md"
move_if_exists "INITIAL_SETUP.md"
move_if_exists "QUICK_SETUP.md"

# Migration/transition docs
move_if_exists "MIGRATION_GUIDE.md"
move_if_exists "TRANSITION_PLAN.md"

# Old roadmaps/plans that are now outdated
move_if_exists "ROADMAP_OLD.md"
move_if_exists "PHASE_1_PLAN.md"
move_if_exists "PHASE_2_PLAN.md"

# Test/demo specific docs
move_if_exists "DEMO_SCRIPT.md"
move_if_exists "TEST_RESULTS.md"

# Temporary troubleshooting guides (keep FIX_GMAIL_AUTH.md in root for now)
move_if_exists "TROUBLESHOOTING_OLD.md"

# Session summaries and notes
move_if_exists "SESSION_NOTES.md"
move_if_exists "MEETING_NOTES.md"
move_if_exists "DECISIONS.md"

# Old comparison/analysis docs
move_if_exists "COMPARISON_GMAIL_VS_NOTION.md"
move_if_exists "ANALYSIS_KNOWLEDGE_SOURCES.md"

# Deprecated feature docs
move_if_exists "DEPRECATED_FEATURES.md"
move_if_exists "REMOVED_FUNCTIONALITY.md"

echo ""
echo "📊 Checking archive contents..."
ls -1 docs/archive/2024-12/ | wc -l | xargs echo "Files archived:"

echo ""
echo "✅ Phase 2 complete!"
echo ""
echo "Next step: Run ./scripts/reorganize-docs.sh"
echo ""
