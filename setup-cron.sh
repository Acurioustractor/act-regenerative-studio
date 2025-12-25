#!/bin/bash

# Setup script for weekly knowledge review cron job
# This adds a cron job to run every Monday at 9am

SCRIPT_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/scripts/weekly-knowledge-review.mjs"
LOG_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/weekly-knowledge-reviews/cron.log"

# Create cron command
CRON_CMD="0 9 * * 1 cd \"$(pwd)\" && node \"$SCRIPT_PATH\" >> \"$LOG_PATH\" 2>&1"

# Check if cron job already exists
if crontab -l 2>/dev/null | grep -q "weekly-knowledge-review.mjs"; then
    echo "✅ Cron job already exists"
    echo "Current crontab:"
    crontab -l | grep "weekly-knowledge-review.mjs"
else
    echo "📅 Adding weekly knowledge review cron job..."
    echo ""
    echo "This will run every Monday at 9am:"
    echo "$CRON_CMD"
    echo ""
    echo "To add this cron job, run:"
    echo "(crontab -l 2>/dev/null; echo \"$CRON_CMD\") | crontab -"
    echo ""
    echo "Or manually add to crontab with: crontab -e"
fi
