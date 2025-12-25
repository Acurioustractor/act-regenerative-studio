#!/bin/bash

echo "🔍 Testing Gmail OAuth Setup"
echo "=============================="
echo ""

# Check if server is running
if curl -s http://localhost:3001/api/auth/gmail > /dev/null 2>&1; then
    echo "✅ Server is running"
    echo "✅ Gmail OAuth endpoint is accessible"
    echo ""
    echo "🔐 Ready to authorize!"
    echo ""
    echo "Open this URL in your browser:"
    echo "http://localhost:3001/api/auth/gmail"
    echo ""
    echo "Or run: open http://localhost:3001/api/auth/gmail"
else
    echo "❌ Server not ready yet"
    echo ""
    echo "Wait 10 seconds and try again:"
    echo "./test-gmail-oauth.sh"
fi

