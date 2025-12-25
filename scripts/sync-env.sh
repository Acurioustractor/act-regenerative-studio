#!/bin/bash
# sync-env.sh - Copy environment files from vault to projects
# Usage: ./scripts/sync-env.sh [project-name]
#   No args: Sync all projects
#   With arg: Sync specific project (the-harvest, act-farm, empathy-ledger, justicehub)

set -e  # Exit on error

VAULT_DIR="/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/.env-vault"

# Project mapping: name:path
declare -A PROJECTS=(
  ["the-harvest"]="/Users/benknight/Code/The Harvest"
  ["act-farm"]="/Users/benknight/Code/ACT Farm/act-farm"
  ["empathy-ledger"]="/Users/benknight/Code/Empathy Ledger v.02"
  ["justicehub"]="/Users/benknight/Code/JusticeHub"
)

# Function to sync a single project
sync_project() {
  local name=$1
  local path=${PROJECTS[$name]}

  if [ -z "$path" ]; then
    echo "❌ Unknown project: $name"
    return 1
  fi

  if [ ! -f "$VAULT_DIR/$name.env.local" ]; then
    echo "⚠️  No vault file for $name ($VAULT_DIR/$name.env.local)"
    return 1
  fi

  if [ ! -d "$path" ]; then
    echo "❌ Project directory not found: $path"
    return 1
  fi

  echo "📋 Syncing $name..."
  cp "$VAULT_DIR/$name.env.local" "$path/.env.local"
  chmod 600 "$path/.env.local"  # Secure permissions (owner read/write only)
  echo "✅ $name synced to $path/.env.local"
}

# Main logic
if [ $# -eq 0 ]; then
  # Sync all projects
  echo "🔄 Syncing all projects from vault..."
  for name in "${!PROJECTS[@]}"; do
    sync_project "$name"
  done
  echo ""
  echo "🎉 Environment sync complete!"
else
  # Sync specific project
  sync_project "$1"
fi

echo ""
echo "💡 Tip: Run ./scripts/validate-env.sh to verify all required variables are set"
