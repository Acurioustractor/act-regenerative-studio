#!/bin/bash

# Type check all ACT ecosystem codebases
# Usage: ./scripts/type-check-ecosystem.sh

set -e

REPOS=(
  "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
  "/Users/benknight/Code/empathy-ledger-v2"
  "/Users/benknight/Code/JusticeHub"
  "/Users/benknight/Code/The Harvest"
  "/Users/benknight/Code/ACT Farm/act-farm"
  "/Users/benknight/Code/ACT Placemat"
)

echo "🔍 Type checking ACT ecosystem..."
echo ""

PASSED=0
FAILED=0
SKIPPED=0

for repo in "${REPOS[@]}"; do
  REPO_NAME=$(basename "$repo")

  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📁 $REPO_NAME"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  if [ ! -d "$repo" ]; then
    echo "⚠️  Directory not found, skipping..."
    echo ""
    SKIPPED=$((SKIPPED + 1))
    continue
  fi

  if [ ! -f "$repo/package.json" ]; then
    echo "⚠️  No package.json found, skipping..."
    echo ""
    SKIPPED=$((SKIPPED + 1))
    continue
  fi

  # Check if type-check script exists
  if ! grep -q '"type-check"' "$repo/package.json" 2>/dev/null; then
    # Try typescript check as fallback
    if ! grep -q '"typescript"' "$repo/package.json" 2>/dev/null; then
      echo "⚠️  No type-check script or typescript dependency, skipping..."
      echo ""
      SKIPPED=$((SKIPPED + 1))
      continue
    fi
  fi

  if (cd "$repo" && npm run type-check 2>&1); then
    echo "✅ Type check passed"
    PASSED=$((PASSED + 1))
  else
    echo "❌ Type check failed"
    FAILED=$((FAILED + 1))
  fi

  echo ""
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Passed: $PASSED"
echo "❌ Failed: $FAILED"

if [ $SKIPPED -gt 0 ]; then
  echo "⚠️  Skipped: $SKIPPED"
fi

echo ""

if [ $FAILED -eq 0 ]; then
  echo "🎉 All type checks passed!"
  exit 0
else
  echo "⚠️  $FAILED repo(s) have type errors. Fix them before deploying."
  exit 1
fi
