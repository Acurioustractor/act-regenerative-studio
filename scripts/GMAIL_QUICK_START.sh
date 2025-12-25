#!/bin/bash

# Gmail Scanner Quick Start
# After you've added credentials to .env.local, run this script

echo "📧 Gmail Scanner Quick Start"
echo "=============================="
echo ""

# Check if credentials are set
if grep -q "GOOGLE_CLIENT_ID=paste-your-client-id" .env.local 2>/dev/null || ! grep -q "GOOGLE_CLIENT_ID=" .env.local 2>/dev/null; then
    echo "❌ Gmail credentials not set in .env.local"
    echo ""
    echo "Please:"
    echo "1. Follow GMAIL_OAUTH_SETUP.md steps 1-5"
    echo "2. Add credentials to .env.local"
    echo "3. Run this script again"
    exit 1
fi

echo "✅ Credentials found in .env.local"
echo ""

# Check if server is running
if ! curl -s http://localhost:3001/api/auth/gmail > /dev/null 2>&1; then
    echo "⚠️  Development server not running"
    echo ""
    echo "Starting server..."
    npm run dev &
    SERVER_PID=$!
    echo "Waiting for server to start..."
    sleep 10
else
    echo "✅ Server is running"
fi

echo ""
echo "Next steps:"
echo "==========="
echo ""
echo "1. 🔐 Authorize Gmail access:"
echo "   Open: http://localhost:3001/api/auth/gmail"
echo ""
echo "2. ✅ After authorization completes, verify connection:"
echo "   PGPASSWORD=\"19bhlGkZRuH9LxrK\" psql -h aws-0-ap-southeast-2.pooler.supabase.com -p 6543 -d postgres -U postgres.tednluwflfhxyucgwigh -c \"SELECT user_email FROM gmail_auth_tokens;\""
echo ""
echo "3. 📧 Run your first scan (replace with your email):"
echo "   curl -X POST http://localhost:3001/api/knowledge/scan-gmail \\"
echo "     -H \"Content-Type: application/json\" \\"
echo "     -d '{\"userEmail\": \"your-email@gmail.com\"}'"
echo ""
echo "4. 📊 Review extracted knowledge:"
echo "   http://localhost:3001/admin/queue"
echo ""
echo "🎉 Setup complete! Follow the steps above."

