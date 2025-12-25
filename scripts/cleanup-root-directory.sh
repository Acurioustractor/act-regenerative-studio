#!/bin/bash

# Clean up root directory - move misc files to appropriate locations

set -e  # Exit on error

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║    Root Directory Cleanup                                  ║"
echo "║    Organizing Non-Documentation Files                      ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

cd "$(dirname "$0")/.."

# Create directories if they don't exist
mkdir -p assets/screenshots
mkdir -p data
mkdir -p config

echo "📸 Moving screenshots..."
mv "Screenshot 2025-12-24 at 9.46.44 am.png" assets/screenshots/ 2>/dev/null && echo "  ✓ Screenshot 1" || true
mv "Screenshot 2025-12-24 at 9.46.49 am.png" assets/screenshots/ 2>/dev/null && echo "  ✓ Screenshot 2" || true
mv "Screenshot 2025-12-24 at 9.46.59 am.png" assets/screenshots/ 2>/dev/null && echo "  ✓ Screenshot 3" || true

echo ""
echo "📊 Moving data files..."
mv "A Curious Tractor - Blogs.csv" data/ 2>/dev/null && echo "  ✓ Blogs CSV" || true

echo ""
echo "⚙️ Moving config files..."
mv ai-model-comparison.json config/ 2>/dev/null && echo "  ✓ AI model comparison" || true

echo ""
echo "📜 Moving scripts to scripts/ directory..."
mv GMAIL_QUICK_START.sh scripts/ 2>/dev/null && echo "  ✓ GMAIL_QUICK_START.sh" || true
mv test-gmail-oauth.sh scripts/ 2>/dev/null && echo "  ✓ test-gmail-oauth.sh" || true
mv test-media-api.mjs scripts/ 2>/dev/null && echo "  ✓ test-media-api.mjs" || true
mv test-notion-connection.mjs scripts/ 2>/dev/null && echo "  ✓ test-notion-connection.mjs" || true
mv test-notion-simple.mjs scripts/ 2>/dev/null && echo "  ✓ test-notion-simple.mjs" || true
mv setup-cron.sh scripts/ 2>/dev/null && echo "  ✓ setup-cron.sh" || true
mv nas-backup-script.sh scripts/ 2>/dev/null && echo "  ✓ nas-backup-script.sh" || true
mv start-clean.sh scripts/ 2>/dev/null && echo "  ✓ start-clean.sh" || true
mv dev-servers.mjs scripts/ 2>/dev/null && echo "  ✓ dev-servers.mjs" || true

echo ""
echo "📁 Checking admin-wiki directory..."
if [ -d "admin-wiki" ]; then
    echo "  ℹ️  admin-wiki directory exists (keeping in root for now)"
    echo "     Check if this should be moved or documented"
fi

echo ""
echo "📊 Updated root directory structure:"
echo ""
ls -1 | grep -v "^node_modules$" | grep -v "^\.next$" | head -20

echo ""
echo "✅ Root directory cleanup complete!"
echo ""
echo "New directories created:"
echo "  • assets/screenshots/ (3 PNG files)"
echo "  • data/ (1 CSV file)"
echo "  • config/ (1 JSON file)"
echo "  • scripts/ (9 additional scripts moved)"
echo ""
