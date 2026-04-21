#!/bin/bash
# Apply Continuous Claude migration via Supabase Management API

set -e

# Read from .env.local
SUPABASE_URL=$(grep "^SUPABASE_URL=" .env.local | cut -d'=' -f2)
SERVICE_KEY=$(grep "^SUPABASE_SERVICE_ROLE_KEY=" .env.local | cut -d'=' -f2)

if [ -z "$SUPABASE_URL" ] || [ -z "$SERVICE_KEY" ]; then
  echo "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
  exit 1
fi

# Extract project ref from URL
PROJECT_REF=$(echo "$SUPABASE_URL" | sed 's|https://||' | cut -d'.' -f1)

echo "Applying Continuous Claude migration to project: $PROJECT_REF"

# Read migration file
MIGRATION_SQL=$(cat supabase/migrations/20260118000000_continuous_claude.sql)

# Use the Supabase REST API to execute SQL via postgrest
# This requires the sql_exec RPC function or we can insert data to verify
echo "Testing connection..."

RESPONSE=$(curl -s -X GET \
  "${SUPABASE_URL}/rest/v1/" \
  -H "apikey: ${SERVICE_KEY}" \
  -H "Authorization: Bearer ${SERVICE_KEY}")

if echo "$RESPONSE" | grep -q "error"; then
  echo "Connection failed: $RESPONSE"
  exit 1
fi

echo "Connection successful!"
echo ""
echo "The migration needs to be applied via the Supabase Dashboard SQL Editor."
echo ""
echo "1. Go to: https://supabase.com/dashboard/project/${PROJECT_REF}/sql/new"
echo "2. Paste the contents of: supabase/migrations/20260118000000_continuous_claude.sql"
echo "3. Click 'Run'"
echo ""
echo "Or copy this URL to your clipboard:"
echo "https://supabase.com/dashboard/project/${PROJECT_REF}/sql/new"
