#!/bin/bash

# ACT Development Hub - Clean Startup Script
# Ensures all old processes are killed before starting fresh

echo "🧹 Cleaning up old processes..."

# Kill any existing Next.js dev servers
pkill -f "next dev" 2>/dev/null

# Kill any existing node processes on our ports
lsof -ti:3001 -ti:3002 -ti:3003 -ti:3004 -ti:3999 -ti:4000 | xargs kill -9 2>/dev/null

# Wait a moment for ports to be released
sleep 2

echo "✅ Cleanup complete"
echo ""
echo "🚀 Starting ACT Development Hub..."
echo ""

# Start the orchestrator directly (not via npm to avoid recursion)
node dev-servers.mjs
