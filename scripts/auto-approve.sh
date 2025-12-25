#!/bin/bash

# ACT Living Wiki - Auto-Approval Script
# Automatically approves high-confidence knowledge extractions

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Default confidence threshold (90%)
CONFIDENCE_THRESHOLD="${1:-0.90}"

# Dry run flag (default: false)
DRY_RUN="${2:-false}"

# Load environment variables
if [ -f "$PROJECT_ROOT/.env.local" ]; then
  export $(grep -v '^#' "$PROJECT_ROOT/.env.local" | xargs)
fi

echo "🤖 ACT Living Wiki - Auto-Approval"
echo "=================================="
echo ""

# Database connection details from Supabase
DB_HOST="aws-0-ap-southeast-2.pooler.supabase.com"
DB_PORT="6543"
DB_NAME="postgres"
DB_USER="postgres.tednluwflfhxyucgwigh"

# Check for database password
if [ -z "$PGPASSWORD" ]; then
  PGPASSWORD="19bhlGkZRuH9LxrK"
fi

export PGPASSWORD

if [ "$DRY_RUN" = "true" ]; then
  echo "🔍 DRY RUN MODE - No changes will be made"
  echo "   Confidence threshold: >= ${CONFIDENCE_THRESHOLD} (${CONFIDENCE_THRESHOLD}%)"
  echo ""

  echo "📋 Items that would be auto-approved:"
  echo ""

  psql -h "$DB_HOST" -p "$DB_PORT" -d "$DB_NAME" -U "$DB_USER" -c "
    SELECT
      RPAD(title, 50) as title,
      LPAD(ROUND(confidence::numeric * 100, 0)::text || '%', 6) as conf,
      suggested_type as type
    FROM auto_approve_high_confidence($CONFIDENCE_THRESHOLD, true)
    ORDER BY confidence DESC;
  " 2>/dev/null

  echo ""
  echo "ℹ️  To execute auto-approval, run: $0 $CONFIDENCE_THRESHOLD false"
else
  echo "⚡ EXECUTING AUTO-APPROVAL"
  echo "   Confidence threshold: >= ${CONFIDENCE_THRESHOLD} (${CONFIDENCE_THRESHOLD}%)"
  echo ""

  # Execute auto-approval and capture results
  RESULTS=$(psql -h "$DB_HOST" -p "$DB_PORT" -d "$DB_NAME" -U "$DB_USER" -t -c "
    SELECT
      action,
      title,
      ROUND(confidence::numeric * 100, 0)::text || '%' as confidence,
      suggested_type
    FROM auto_approve_high_confidence($CONFIDENCE_THRESHOLD, false);
  " 2>/dev/null)

  if [ -z "$RESULTS" ]; then
    echo "ℹ️  No items found matching criteria (>= ${CONFIDENCE_THRESHOLD} confidence)"
  else
    # Count approvals and duplicates
    APPROVED_COUNT=$(echo "$RESULTS" | grep "approved" | wc -l | tr -d ' ')
    DUPLICATE_COUNT=$(echo "$RESULTS" | grep "duplicate" | wc -l | tr -d ' ')

    if [ "$APPROVED_COUNT" -gt 0 ]; then
      echo "✅ Auto-approved $APPROVED_COUNT item(s):"
      echo ""
      echo "$RESULTS" | grep "approved" | while read -r line; do
        TITLE=$(echo "$line" | awk -F'|' '{print $2}' | xargs)
        CONF=$(echo "$line" | awk -F'|' '{print $3}' | xargs)
        TYPE=$(echo "$line" | awk -F'|' '{print $4}' | xargs)
        echo "   - $TITLE ($CONF, $TYPE)"
      done
      echo ""
    fi

    if [ "$DUPLICATE_COUNT" -gt 0 ]; then
      echo "⚠️  Skipped $DUPLICATE_COUNT duplicate(s)"
      echo ""
    fi

    # Show current stats
    echo "📊 Auto-Approval Statistics:"
    psql -h "$DB_HOST" -p "$DB_PORT" -d "$DB_NAME" -U "$DB_USER" -c "
      SELECT * FROM get_auto_approval_stats();
    " 2>/dev/null
  fi
fi

echo ""
echo "🔗 View results at http://localhost:3001/wiki"
echo ""

exit 0
