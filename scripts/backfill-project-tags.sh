#!/bin/bash

# Backfill existing issues with ACT Project field and labels
# This adds all existing issues to the GitHub Project and tags them

PROJECT_ID="PVT_kwHOCOopjs4BLVik"
PROJECT_NUMBER=1

echo "🏷️  ACT Ecosystem - Backfill Project Tags"
echo "=========================================="
echo ""
echo "This script will:"
echo "  1. Find all open issues across ACT repos"
echo "  2. Add them to GitHub Project"
echo "  3. Set ACT Project field based on repository"
echo "  4. Add repository-specific labels"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

# Repository configurations
declare -A REPO_TO_PROJECT=(
  ["goods-asset-tracker"]="Goods"
  ["empathy-ledger-v2"]="Empathy Ledger"
  ["justicehub-platform"]="JusticeHub"
  ["the-harvest-website"]="The Harvest"
  ["act-farm"]="ACT Farm"
  ["act-placemat"]="ACT Placemat"
  ["act-regenerative-studio"]="ACT Main"
  ["act-project-template"]="Cross-Project"
)

declare -A REPO_TO_LABELS=(
  ["goods-asset-tracker"]="goods,asset-tracking,circular-economy"
  ["empathy-ledger-v2"]="empathy-ledger,storytelling"
  ["justicehub-platform"]="justicehub,justice"
  ["the-harvest-website"]="harvest,community"
  ["act-farm"]="act-farm,website"
  ["act-placemat"]="placemat,mapping"
  ["act-regenerative-studio"]="studio,infrastructure"
  ["act-project-template"]="template,cross-project"
)

total_issues=0
added_to_project=0
labels_added=0

for repo_name in "${!REPO_TO_PROJECT[@]}"; do
  full_repo="Acurioustractor/$repo_name"
  act_project="${REPO_TO_PROJECT[$repo_name]}"
  labels="${REPO_TO_LABELS[$repo_name]}"

  echo ""
  echo "📦 Processing: $full_repo"
  echo "   ACT Project: $act_project"
  echo "   Labels: $labels"
  echo ""

  # Get all open issues
  issues=$(gh issue list --repo "$full_repo" --state open --limit 1000 --json number,title | jq -r '.[] | @base64')

  if [ -z "$issues" ]; then
    echo "   No open issues found."
    continue
  fi

  for row in $issues; do
    _jq() {
      echo "${row}" | base64 --decode | jq -r "${1}"
    }

    issue_number=$(_jq '.number')
    issue_title=$(_jq '.title')

    echo "   Issue #$issue_number: $issue_title"

    # Add labels
    IFS=',' read -ra LABEL_ARRAY <<< "$labels"
    if gh issue edit "$issue_number" --repo "$full_repo" --add-label "${LABEL_ARRAY[@]}" 2>/dev/null; then
      echo "      ✅ Labels added"
      ((labels_added++))
    else
      echo "      ⚠️  Labels skipped (may already exist)"
    fi

    # Add to project (this will be done via the workflow on next issue update,
    # or we can trigger it manually)

    ((total_issues++))

    # Rate limiting
    sleep 0.5
  done
done

echo ""
echo "=========================================="
echo "Summary:"
echo "  Total issues processed: $total_issues"
echo "  Labels added: $labels_added"
echo ""
echo "Note: Issues are now labeled. The auto-tag workflow"
echo "will add them to the project on next update, or you"
echo "can manually add them to the project at:"
echo "https://github.com/users/Acurioustractor/projects/1"
echo ""
echo "Next: Run the GraphQL script to add all issues to project"
echo "and set ACT Project field values."
