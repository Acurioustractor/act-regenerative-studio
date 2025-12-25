#!/bin/bash

# Sync shared types from ACT Main Website (source of truth) to all ACT platforms
# Usage: ./scripts/sync-types-all.sh

set -e

SOURCE_DIR="/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/src/types/shared"

TARGET_REPOS=(
  "/Users/benknight/Code/empathy-ledger-v2"
  "/Users/benknight/Code/JusticeHub"
  "/Users/benknight/Code/The Harvest"
  "/Users/benknight/Code/ACT Farm/act-farm"
  "/Users/benknight/Code/ACT Placemat"
)

echo "🔄 Syncing shared types across ACT ecosystem..."
echo "   Source (SOURCE OF TRUTH): $SOURCE_DIR"
echo ""

SYNCED=0
FAILED=0

for repo in "${TARGET_REPOS[@]}"; do
  REPO_NAME=$(basename "$repo")
  TARGET_DIR="$repo/src/types/shared"

  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📁 $REPO_NAME"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  if [ ! -d "$repo" ]; then
    echo "⚠️  Repository not found, skipping..."
    echo ""
    FAILED=$((FAILED + 1))
    continue
  fi

  # Create target directory if it doesn't exist
  mkdir -p "$TARGET_DIR"

  # Copy all TypeScript files
  FILE_COUNT=0
  for file in "$SOURCE_DIR"/*.ts; do
    if [ -f "$file" ]; then
      filename=$(basename "$file")

      # Add sync timestamp comment at the top
      {
        echo "// Synced from ACT Main Website on $(date '+%Y-%m-%d %H:%M:%S')"
        echo "// SOURCE OF TRUTH: /Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/src/types/shared/$filename"
        echo ""
        cat "$file"
      } > "$TARGET_DIR/$filename"

      echo "   ✅ $filename"
      FILE_COUNT=$((FILE_COUNT + 1))
    fi
  done

  if [ $FILE_COUNT -gt 0 ]; then
    echo "   Synced $FILE_COUNT file(s)"
    SYNCED=$((SYNCED + 1))
  else
    echo "   ⚠️  No TypeScript files found to sync"
    FAILED=$((FAILED + 1))
  fi

  echo ""
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Successfully synced: $SYNCED repositories"

if [ $FAILED -gt 0 ]; then
  echo "⚠️  Failed/Skipped: $FAILED repositories"
fi

echo ""
echo "🎯 Next Steps:"
echo "   1. Run: ./scripts/type-check-ecosystem.sh"
echo "   2. Fix any type errors in target repos"
echo "   3. Test locally with: ./scripts/start-all-platforms.sh"
echo "   4. Commit changes to each repo separately"
