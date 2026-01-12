#!/bin/bash

# Start all ACT platform dev servers
# Usage: ./scripts/start-all-platforms.sh

echo "🚀 Starting all ACT platform dev servers..."
echo ""

# Check if tmux is installed
if ! command -v tmux &> /dev/null; then
  echo "❌ tmux is not installed. Please install it first:"
  echo "   brew install tmux"
  exit 1
fi

# Kill existing session if it exists
tmux kill-session -t act-ecosystem 2>/dev/null || true

# Create new tmux session
tmux new-session -d -s act-ecosystem -n "ACT Platforms"

# Split window into 6 panes (2x3 grid)
tmux split-window -h -t act-ecosystem
tmux split-window -v -t act-ecosystem:0.0
tmux split-window -v -t act-ecosystem:0.1
tmux select-pane -t act-ecosystem:0.0
tmux split-window -v -t act-ecosystem:0.0
tmux select-pane -t act-ecosystem:0.2
tmux split-window -v -t act-ecosystem:0.2

# Pane 0: ACT Regenerative Studio (port 3002)
tmux send-keys -t act-ecosystem:0.0 "cd '/Users/benknight/Code/act-regenerative-studio'" C-m
tmux send-keys -t act-ecosystem:0.0 "echo '🌐 ACT Regenerative Studio - http://localhost:3002'" C-m
tmux send-keys -t act-ecosystem:0.0 "PORT=3002 npm run dev" C-m

# Pane 1: Empathy Ledger (port 3001)
tmux send-keys -t act-ecosystem:0.1 "cd '/Users/benknight/Code/empathy-ledger-v2'" C-m
tmux send-keys -t act-ecosystem:0.1 "echo '📖 Empathy Ledger - http://localhost:3001'" C-m
tmux send-keys -t act-ecosystem:0.1 "npm run dev" C-m

# Pane 2: JusticeHub (port 3003)
tmux send-keys -t act-ecosystem:0.2 "cd '/Users/benknight/Code/JusticeHub'" C-m
tmux send-keys -t act-ecosystem:0.2 "echo '⚖️  JusticeHub - http://localhost:3003'" C-m
tmux send-keys -t act-ecosystem:0.2 "PORT=3003 npm run dev" C-m

# Pane 3: The Harvest Website (port 3004)
tmux send-keys -t act-ecosystem:0.3 "cd '/Users/benknight/Code/The Harvest Website'" C-m
tmux send-keys -t act-ecosystem:0.3 "echo '🌾 The Harvest - http://localhost:3004'" C-m
tmux send-keys -t act-ecosystem:0.3 "PORT=3004 npm run dev" C-m

# Pane 4: ACT Farm (port 3005)
tmux send-keys -t act-ecosystem:0.4 "cd '/Users/benknight/Code/act-farm'" C-m
tmux send-keys -t act-ecosystem:0.4 "echo '🚜 ACT Farm - http://localhost:3005'" C-m
tmux send-keys -t act-ecosystem:0.4 "PORT=3005 npm run dev" C-m

# Pane 5: ACT Placemat (port 3999)
tmux send-keys -t act-ecosystem:0.5 "cd '/Users/benknight/Code/ACT Placemat'" C-m
tmux send-keys -t act-ecosystem:0.5 "echo '🗂️  ACT Placemat - http://localhost:3999'" C-m
tmux send-keys -t act-ecosystem:0.5 "npm run dev" C-m

echo "✅ All platforms starting in tmux session 'act-ecosystem'"
echo ""
echo "📋 Platforms:"
echo "   🌐 ACT Regenerative Studio:  http://localhost:3002"
echo "   📖 Empathy Ledger:           http://localhost:3001"
echo "   ⚖️  JusticeHub:               http://localhost:3003"
echo "   🌾 The Harvest Website:      http://localhost:3004"
echo "   🚜 ACT Farm:                 http://localhost:3005"
echo "   🗂️  ACT Placemat:             http://localhost:3999"
echo ""
echo "🎯 Commands:"
echo "   Attach to session:  tmux attach -t act-ecosystem"
echo "   Navigate panes:     Ctrl+B then arrow keys"
echo "   Detach:             Ctrl+B then D"
echo "   Kill all:           tmux kill-session -t act-ecosystem"
echo ""
echo "⏳ Waiting 5 seconds for servers to start..."
sleep 5
echo ""
echo "🎉 Opening in browser..."

# Open all platforms in browser
open http://localhost:3002 &
open http://localhost:3001 &
open http://localhost:3003 &
open http://localhost:3004 &
open http://localhost:3005 &
open http://localhost:3999 &

echo ""
echo "✅ All platforms should be running!"
echo "   Attach to tmux session to see logs: tmux attach -t act-ecosystem"
