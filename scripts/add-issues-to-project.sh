#!/bin/bash

# Add all created issues to the ACT Ecosystem Development project board

PROJECT_NUMBER=1
OWNER="Acurioustractor"

echo "📊 Adding issues to Project #$PROJECT_NUMBER"
echo "==========================================="

# Add ACT Main issues
echo ""
echo "📦 Adding act-regenerative-studio issues..."
REPO="act-regenerative-studio"
ISSUES=$(gh issue list --repo "$OWNER/$REPO" --limit 100 --json number --jq '.[].number')
COUNT=0

for issue in $ISSUES; do
  echo "  Adding issue #$issue..."
  gh project item-add "$PROJECT_NUMBER" --owner "$OWNER" \
    --url "https://github.com/$OWNER/$REPO/issues/$issue" > /dev/null 2>&1 && \
    echo "  ✅ Added #$issue" || echo "  ⚠️  Already added or failed #$issue"
  COUNT=$((COUNT + 1))
  sleep 0.2
done

echo "  Added $COUNT issues from $REPO"

# Add Empathy Ledger issues
echo ""
echo "📦 Adding empathy-ledger-v2 issues..."
REPO="empathy-ledger-v2"
ISSUES=$(gh issue list --repo "$OWNER/$REPO" --limit 100 --json number --jq '.[].number')
COUNT=0

for issue in $ISSUES; do
  echo "  Adding issue #$issue..."
  gh project item-add "$PROJECT_NUMBER" --owner "$OWNER" \
    --url "https://github.com/$OWNER/$REPO/issues/$issue" > /dev/null 2>&1 && \
    echo "  ✅ Added #$issue" || echo "  ⚠️  Already added or failed #$issue"
  COUNT=$((COUNT + 1))
  sleep 0.2
done

echo "  Added $COUNT issues from $REPO"

echo ""
echo "🎉 Complete! Check project board at:"
echo "   https://github.com/users/$OWNER/projects/$PROJECT_NUMBER"
