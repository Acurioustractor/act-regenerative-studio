#!/bin/bash

# ACT Living Wiki - Generate Notifications
# Triggers database functions to create review reminders and extraction notifications

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Load environment variables
if [ -f "$PROJECT_ROOT/.env.local" ]; then
  export $(grep -v '^#' "$PROJECT_ROOT/.env.local" | xargs)
fi

echo "🔔 Generating notifications for ACT Living Wiki..."
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

echo "📊 Creating review reminders for overdue pages..."
REVIEW_COUNT=$(psql -h "$DB_HOST" -p "$DB_PORT" -d "$DB_NAME" -U "$DB_USER" -t -c "SELECT create_review_reminders();" 2>/dev/null | tr -d ' ')

if [ -n "$REVIEW_COUNT" ]; then
  echo "   ✅ Created $REVIEW_COUNT review reminder(s)"
else
  echo "   ℹ️  No overdue pages found"
fi

echo ""
echo "✨ Creating high-confidence extraction notifications..."
EXTRACTION_COUNT=$(psql -h "$DB_HOST" -p "$DB_PORT" -d "$DB_NAME" -U "$DB_USER" -t -c "SELECT create_extraction_notifications();" 2>/dev/null | tr -d ' ')

if [ -n "$EXTRACTION_COUNT" ]; then
  echo "   ✅ Created $EXTRACTION_COUNT extraction notification(s)"
else
  echo "   ℹ️  No new high-confidence extractions found"
fi

echo ""
echo "📈 Current notification summary:"
psql -h "$DB_HOST" -p "$DB_PORT" -d "$DB_NAME" -U "$DB_USER" -c "SELECT * FROM notification_summary;" 2>/dev/null

echo ""
echo "✅ Done! View notifications at http://localhost:3001/admin/queue"
