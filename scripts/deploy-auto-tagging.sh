#!/bin/bash

# Deploy auto-tagging workflow to all ACT repositories
# This enables automatic project field assignment based on repository

set -e

WORKFLOW_FILE="/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/.github/workflows/auto-tag-project-items.yml"

echo "🚀 Deploying Auto-Tagging Workflow to ACT Ecosystem Repositories"
echo ""

# Repository paths
repos=(
  "/Users/benknight/Code/empathy-ledger-v2"
  "/Users/benknight/Code/JusticeHub"
  "/Users/benknight/Code/The Harvest"
  "/Users/benknight/Code/ACT Farm/act-farm"
  "/Users/benknight/Code/ACT Placemat"
  "/Users/benknight/Code/Goods"
  "/Users/benknight/Code/act-project-template"
)

success_count=0
skip_count=0
error_count=0

for repo_path in "${repos[@]}"; do
  if [ ! -d "$repo_path" ]; then
    echo "⚠️  Skipping $(basename "$repo_path") - directory not found"
    ((skip_count++))
    continue
  fi

  repo_name=$(basename "$repo_path")
  echo ""
  echo "📦 Processing: $repo_name"
  echo "   Path: $repo_path"

  cd "$repo_path" || {
    echo "❌ Failed to enter directory"
    ((error_count++))
    continue
  }

  # Create workflows directory if needed
  mkdir -p .github/workflows

  # Copy workflow file
  if cp "$WORKFLOW_FILE" .github/workflows/auto-tag-project-items.yml; then
    echo "   ✅ Workflow file copied"
  else
    echo "   ❌ Failed to copy workflow file"
    ((error_count++))
    continue
  fi

  # Check if it's a git repository
  if [ ! -d .git ]; then
    echo "   ⚠️  Not a git repository - file copied but not committed"
    ((skip_count++))
    continue
  fi

  # Stage the file
  git add .github/workflows/auto-tag-project-items.yml

  # Check if there are changes to commit
  if git diff --cached --quiet; then
    echo "   ✅ Already deployed (no changes)"
    ((success_count++))
  else
    # Commit
    if git commit -m "feat: add auto-tagging for GitHub Projects

Automatically assigns ACT Project field based on repository.
Auto-adds repository-specific labels for filtering.

🤖 Generated with Claude Code
Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"; then
      echo "   ✅ Changes committed"

      # Push to remote
      if git push; then
        echo "   ✅ Pushed to remote"
        ((success_count++))
      else
        echo "   ⚠️  Committed locally but push failed - please push manually"
        ((error_count++))
      fi
    else
      echo "   ❌ Commit failed"
      ((error_count++))
    fi
  fi
done

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "                   Deployment Summary"
echo "═══════════════════════════════════════════════════════════"
echo "✅ Successfully deployed: $success_count"
echo "⚠️  Skipped:              $skip_count"
echo "❌ Errors:                $error_count"
echo ""

if [ $success_count -gt 0 ]; then
  echo "🎉 Auto-tagging deployed to $success_count repositories!"
  echo ""
  echo "Next steps:"
  echo "1. Verify workflow permissions in each repo:"
  echo "   Settings → Actions → General → Workflow permissions"
  echo "   Set to: 'Read and write permissions'"
  echo ""
  echo "2. Test automation by creating an issue:"
  echo "   gh issue create --repo Acurioustractor/goods-asset-tracker \\"
  echo "     --title 'Test auto-tagging' --body 'Testing automation'"
  echo ""
  echo "3. Verify in GitHub Project:"
  echo "   https://github.com/orgs/Acurioustractor/projects/1"
  echo "   Issue should have ACT Project = 'Goods'"
fi

if [ $error_count -gt 0 ]; then
  echo ""
  echo "⚠️  Some deployments failed. Check logs above for details."
  exit 1
fi

exit 0
