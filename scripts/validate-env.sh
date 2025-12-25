#!/bin/bash
# validate-env.sh - Check all projects have required environment variables
# Usage: ./scripts/validate-env.sh [project-name]
#   No args: Validate all projects
#   With arg: Validate specific project (the-harvest, act-farm, empathy-ledger, justicehub)

set -e  # Exit on error

# Project mapping: name:path:required_vars
declare -a PROJECTS=(
  "the-harvest:/Users/benknight/Code/The Harvest:GHL_API_KEY,GHL_LOCATION_ID,REDIS_URL,RESEND_API_KEY"
  "act-farm:/Users/benknight/Code/ACT Farm/act-farm:GHL_API_KEY,GHL_LOCATION_ID,REDIS_URL,RESEND_API_KEY"
  "empathy-ledger:/Users/benknight/Code/Empathy Ledger v.02:GHL_API_KEY,GHL_LOCATION_ID,NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY,REDIS_URL,RESEND_API_KEY"
  "justicehub:/Users/benknight/Code/JusticeHub:GHL_API_KEY,GHL_LOCATION_ID,NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY,REDIS_URL,RESEND_API_KEY"
)

# Function to validate a single project
validate_project() {
  local project_spec=$1
  IFS=':' read -r name path required <<< "$project_spec"

  # If specific project requested, skip others
  if [ $# -eq 2 ] && [ "$name" != "$2" ]; then
    return 0
  fi

  if [ ! -f "$path/.env.local" ]; then
    echo ""
    echo "❌ $name: No .env.local file found at $path"
    echo "   💡 Run: cp \"$path/.env.local.example\" \"$path/.env.local\""
    return 1
  fi

  echo ""
  echo "🔍 Checking $name..."

  local all_valid=true
  IFS=',' read -ra VARS <<< "$required"
  for var in "${VARS[@]}"; do
    # Check if variable is set and not empty
    if grep -q "^$var=.\+" "$path/.env.local" 2>/dev/null; then
      # Get the value (but don't show secrets)
      local value=$(grep "^$var=" "$path/.env.local" | cut -d'=' -f2-)

      # Check if it's still a placeholder
      if [[ "$value" == *"your_"*"_here"* ]] || [[ "$value" == *"[your"* ]]; then
        echo "  ⚠️  $var (set but appears to be placeholder)"
        all_valid=false
      else
        echo "  ✅ $var"
      fi
    else
      echo "  ❌ $var (missing or empty)"
      all_valid=false
    fi
  done

  if [ "$all_valid" = true ]; then
    echo "✅ $name: All required variables are set"
  else
    echo "⚠️  $name: Some variables missing or using placeholders"
  fi
}

# Main logic
echo "🔐 ACT Environment Variable Validation"

if [ $# -eq 0 ]; then
  # Validate all projects
  for project in "${PROJECTS[@]}"; do
    validate_project "$project"
  done
else
  # Validate specific project
  found=false
  for project in "${PROJECTS[@]}"; do
    IFS=':' read -r name path required <<< "$project"
    if [ "$name" = "$1" ]; then
      validate_project "$project" "$1"
      found=true
      break
    fi
  done

  if [ "$found" = false ]; then
    echo "❌ Unknown project: $1"
    echo "Available projects: the-harvest, act-farm, empathy-ledger, justicehub"
    exit 1
  fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "💡 Tips:"
echo "  - Missing .env.local? Copy from .env.local.example"
echo "  - Need secrets? Check .env-vault/ directory"
echo "  - Sync from vault: ./scripts/sync-env.sh"
echo "  - See ENV_AUDIT_AND_MANAGEMENT.md for credential sources"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
