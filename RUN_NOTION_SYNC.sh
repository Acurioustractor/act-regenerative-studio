#!/bin/bash

# Sync GitHub Issues to Notion
# Run this script to import all your GitHub issues into Notion

echo "🔄 Starting GitHub → Notion Sync"
echo ""

# Set your Notion database ID
export NOTION_DATABASE_ID="2d5ebcf9-81cf-8042-9f40-ef7b39b39ca1"

# Load from .env.local if it exists
if [ -f .env.local ]; then
  export $(cat .env.local | grep -v '^#' | xargs)
fi

# Check if tokens are set
if [ -z "$NOTION_TOKEN" ]; then
  echo "❌ Error: NOTION_TOKEN not set"
  echo "Add to .env.local or run:"
  echo "  export NOTION_TOKEN=your_token_here"
  exit 1
fi

if [ -z "$GITHUB_TOKEN" ] && [ -z "$GH_PROJECT_TOKEN" ]; then
  echo "❌ Error: GITHUB_TOKEN or GH_PROJECT_TOKEN not set"
  echo "Add to .env.local or run:"
  echo "  export GITHUB_TOKEN=your_token_here"
  exit 1
fi

# Use GH_PROJECT_TOKEN if GITHUB_TOKEN not set
if [ -z "$GITHUB_TOKEN" ]; then
  export GITHUB_TOKEN="$GH_PROJECT_TOKEN"
fi

echo "✅ Configuration loaded"
echo "📦 Notion Database: $NOTION_DATABASE_ID"
echo ""

# Run sync
node scripts/sync-github-to-notion.js

# Check result
if [ $? -eq 0 ]; then
  echo ""
  echo "🎉 Sync complete!"
  echo ""
  echo "🎯 Next steps:"
  echo "  1. Open Notion: https://www.notion.so/acurioustractor/$NOTION_DATABASE_ID"
  echo "  2. Click '+ New view' → 'Board'"
  echo "  3. Group by: Status"
  echo "  4. Enjoy your Kanban board! 🎨"
else
  echo ""
  echo "❌ Sync failed"
  echo ""
  echo "Common issues:"
  echo "  - GitHub API rate limit (wait 1 hour)"
  echo "  - Invalid tokens (check .env.local)"
  echo "  - Notion database not shared with integration"
fi
