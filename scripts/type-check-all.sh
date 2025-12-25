#!/bin/bash

# Type check all ACT codebases
# Usage: ./scripts/type-check-all.sh

set -e

REPOS=(
  "/Users/benknight/Code/Empathy Ledger v.02"
  "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
  "/Users/benknight/Code/ACT Placemat"
)

echo "🔍 Type checking all ACT codebases..."
echo ""

FAILED=0

for repo in "${REPOS[@]}"; do
  if [ -d "$repo" ]; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📁 $(basename "$repo")"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    if (cd "$repo" && npm run type-check 2>&1); then
      echo "✅ Type check passed"
    else
      echo "❌ Type check failed"
      FAILED=$((FAILED + 1))
    fi

    echo ""
  else
    echo "⚠️  Directory not found: $repo"
    echo ""
  fi
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $FAILED -eq 0 ]; then
  echo "✅ All type checks passed!"
  exit 0
else
  echo "❌ $FAILED repo(s) failed type checking"
  exit 1
fi
