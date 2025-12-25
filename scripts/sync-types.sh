#!/bin/bash

# Sync shared types from ACT Main Website (source of truth) to Empathy Ledger
# Usage: ./scripts/sync-types.sh

set -e

SOURCE_DIR="/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/src/types/shared"
TARGET_DIR="/Users/benknight/Code/Empathy Ledger v.02/src/types/shared"

echo "🔄 Syncing shared types..."
echo "   Source: $SOURCE_DIR"
echo "   Target: $TARGET_DIR"

# Create target directory if it doesn't exist
mkdir -p "$TARGET_DIR"

# Copy all TypeScript files
for file in "$SOURCE_DIR"/*.ts; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    echo "   Copying $filename..."

    # Add sync timestamp comment at the top
    {
      echo "// Synced from ACT Main Website on $(date)"
      cat "$file"
    } > "$TARGET_DIR/$filename"
  fi
done

echo "✅ Types synced successfully!"
echo ""
echo "Files synced:"
ls -1 "$TARGET_DIR"/*.ts 2>/dev/null | while read file; do
  echo "   - $(basename "$file")"
done
