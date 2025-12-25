#!/bin/bash

echo "🚀 Finishing Empathy Ledger Setup..."
echo ""

cd "/Users/benknight/Code/empathy-ledger-v2"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 Step 1: Initialize shadcn/ui..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if already initialized
if [ ! -f "components.json" ]; then
  echo "Creating components.json..."
  cat > components.json <<'EOF'
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
EOF
  echo "✅ components.json created"
else
  echo "✅ components.json already exists"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 Step 2: Installing shadcn components..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Install components
npx shadcn@latest add alert --yes --overwrite
echo "✅ Alert installed"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 Step 3: Testing API endpoint..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Start dev server in background for testing
echo "Starting dev server..."
npm run dev > /tmp/empathy-ledger-dev.log 2>&1 &
DEV_PID=$!

# Wait for server to start
echo "Waiting for server to start..."
sleep 10

# Test API
echo "Testing API endpoint..."
curl -s http://localhost:3001/api/v1/act-projects/justicehub/featured | jq . || echo "API test failed (this is OK if tables don't exist yet)"

# Kill dev server
kill $DEV_PID 2>/dev/null

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎯 Next Steps:"
echo ""
echo "1. Deploy migration in Supabase:"
echo "   https://supabase.com/dashboard/project/yvnuayzslukamizrlhwb/sql/new"
echo "   Copy and paste migration from:"
echo "   /Users/benknight/Code/empathy-ledger-v2/supabase/migrations/20251224000001_act_project_tagging_system_fixed.sql"
echo ""
echo "2. Start development:"
echo "   cd '/Users/benknight/Code/empathy-ledger-v2'"
echo "   npm run dev"
echo ""
echo "3. Test Magic Link login:"
echo "   http://localhost:3001/login"
echo "   Email: benjamin@act.place"
echo ""
echo "4. Test API:"
echo "   http://localhost:3001/api/v1/act-projects/justicehub/featured"
echo ""
