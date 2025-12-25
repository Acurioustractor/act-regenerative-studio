#!/bin/bash

# Setup Empathy Ledger Integration - One Command Setup
# Usage: ./scripts/setup-empathy-ledger-integration.sh

set -e

echo "🚀 Setting up Empathy Ledger Integration..."
echo ""

SOURCE_DIR="/Users/benknight/Code/Empathy Ledger v.02"
TARGET_DIR="/Users/benknight/Code/empathy-ledger-v2"

# Step 1: Copy migration
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 Step 1: Copying database migration..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "$SOURCE_DIR/supabase/migrations/20251224000001_act_project_tagging_system_fixed.sql" ]; then
  mkdir -p "$TARGET_DIR/supabase/migrations"
  cp "$SOURCE_DIR/supabase/migrations/20251224000001_act_project_tagging_system_fixed.sql" \
     "$TARGET_DIR/supabase/migrations/"
  echo "✅ Migration copied"
else
  echo "⚠️  Migration file not found in source, skipping..."
fi

echo ""

# Step 2: Copy shared types
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 Step 2: Copying shared types..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

mkdir -p "$TARGET_DIR/src/types/shared"

if [ -f "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/src/types/shared/act-featured-content.ts" ]; then
  {
    echo "// Synced from ACT Main Website on $(date '+%Y-%m-%d %H:%M:%S')"
    echo "// SOURCE OF TRUTH: /Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/src/types/shared/act-featured-content.ts"
    echo ""
    cat "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/src/types/shared/act-featured-content.ts"
  } > "$TARGET_DIR/src/types/shared/act-featured-content.ts"
  echo "✅ Types copied"
else
  echo "❌ Types file not found!"
  exit 1
fi

echo ""

# Step 3: Copy Supabase helpers
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 Step 3: Copying Supabase helpers..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

mkdir -p "$TARGET_DIR/src/lib/supabase"

if [ -f "$SOURCE_DIR/src/lib/supabase/client.ts" ]; then
  cp "$SOURCE_DIR/src/lib/supabase/client.ts" "$TARGET_DIR/src/lib/supabase/" 2>/dev/null || echo "Already exists"
  echo "✅ client.ts copied"
fi

if [ -f "$SOURCE_DIR/src/lib/supabase/server.ts" ]; then
  cp "$SOURCE_DIR/src/lib/supabase/server.ts" "$TARGET_DIR/src/lib/supabase/" 2>/dev/null || echo "Already exists"
  echo "✅ server.ts copied"
fi

echo ""

# Step 4: Create API endpoint directory
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 Step 4: Creating API endpoint directory..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

mkdir -p "$TARGET_DIR/src/app/api/v1/act-projects/[slug]/featured"
echo "✅ Directory created: $TARGET_DIR/src/app/api/v1/act-projects/[slug]/featured"

echo ""

# Step 5: Instructions for next steps
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Next Steps (Manual):"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Deploy migration to Supabase:"
echo "   cd '$TARGET_DIR'"
echo "   supabase db push"
echo ""
echo "2. Create API route file:"
echo "   See: EMPATHY_LEDGER_SETUP_GUIDE.md → Step 5"
echo "   File: $TARGET_DIR/src/app/api/v1/act-projects/[slug]/featured/route.ts"
echo ""
echo "3. Install shadcn components:"
echo "   cd '$TARGET_DIR'"
echo "   npx shadcn@latest add button card select checkbox label badge input"
echo ""
echo "4. Grant admin permissions:"
echo "   See: EMPATHY_LEDGER_SETUP_GUIDE.md → Step 4"
echo "   Run SQL in Supabase Dashboard"
echo ""
echo "5. Test locally:"
echo "   cd '$TARGET_DIR'"
echo "   npm run dev"
echo "   Open: http://localhost:3001"
echo ""
echo "✅ Setup preparation complete!"
echo "📖 Full guide: EMPATHY_LEDGER_SETUP_GUIDE.md"
