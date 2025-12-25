# 🎨 VSCode Multi-Project Setup

## Three Ways to Work with Multiple Projects

### **Option 1: VSCode Workspace (RECOMMENDED)** ⭐

**One VSCode window with ALL projects:**

1. **Open the workspace file:**
   ```bash
   open "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/ACT-Workspace.code-workspace"
   ```

2. **You'll see all 5 folders in the sidebar:**
   - 🏠 ACT Farm
   - ⚖️ JusticeHub
   - 💚 Empathy Ledger
   - 🌾 The Harvest
   - 🎛️ Dev Hub

3. **Start servers two ways:**

   **Method A - Individual projects:**
   - Press `F5` or click "Run and Debug" (left sidebar)
   - Select which project to start:
     - ▶️ ACT Farm (3001)
     - ▶️ JusticeHub (3002)
     - ▶️ Empathy Ledger (3005)
     - ▶️ The Harvest (3004)
   - Click ▶️ to start
   - Opens in dedicated terminal tab

   **Method B - All at once:**
   - Press `F5` or click "Run and Debug"
   - Select "🎯 Start All Projects"
   - All 4 projects start simultaneously
   - Each in its own terminal tab
   - Stop all with one button

4. **Work on any project:**
   - All files visible in sidebar
   - Edit any file → Auto hot reload
   - Terminal tabs for each server
   - Integrated debugging for each

**Benefits:**
✅ All projects in one window
✅ One-click start/stop
✅ Separate terminal per project
✅ File search across all projects
✅ Git integration for all
✅ Shared settings and extensions

---

### **Option 2: Separate VSCode Windows**

**Traditional approach - one window per project:**

**Window 1 - ACT Farm:**
```bash
cd "/Users/benknight/Code/ACT Farm/act-farm"
code .
# In terminal: PORT=3001 npm run dev
```

**Window 2 - JusticeHub:**
```bash
cd "/Users/benknight/Code/JusticeHub"
code .
# In terminal: PORT=3002 npm run dev
```

**Window 3 - Empathy Ledger:**
```bash
cd "/Users/benknight/Code/Empathy Ledger v.02"
code .
# In terminal: npm run dev
```

**Window 4 - The Harvest:**
```bash
cd "/Users/benknight/Code/The Harvest"
code .
# In terminal: PORT=3004 npm run dev
```

**Benefits:**
✅ Full screen for each project
✅ Independent VSCode instances
✅ Can use different extensions per project
✅ Familiar workflow

**Drawbacks:**
❌ Lots of windows to manage
❌ Have to manually set PORT each time
❌ Can't search across all projects
❌ More memory usage (4 VSCode instances)

---

### **Option 3: Orchestrator + VSCode**

**Best of both worlds:**

1. **Start orchestrator in terminal:**
   ```bash
   cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
   npm start
   # Dashboard at http://localhost:3999
   # All servers running
   ```

2. **Open VSCode workspace:**
   ```bash
   open ACT-Workspace.code-workspace
   ```

3. **Don't start servers in VSCode** - they're already running!

4. **Just edit files:**
   - All changes hot-reload
   - Servers run in background terminal
   - VSCode just for editing

**Benefits:**
✅ Visual dashboard shows all servers
✅ Color-coded logs in terminal
✅ Auto-restart on crashes
✅ VSCode just for editing (fast)
✅ One terminal manages everything

---

## 🔧 Shared NAS Services (All Methods)

**No matter which method you use**, all projects connect to shared NAS:

| Service | URL | Used For |
|---------|-----|----------|
| **Redis** | `redis://192.168.0.34:6379` | Caching (99% faster) |
| **ChromaDB** | `http://192.168.0.34:8000` | Vector search |
| **Portainer** | `http://192.168.0.34:9000` | Container management |

This is configured in each project's `.env.local`:
```bash
REDIS_URL=redis://192.168.0.34:6379
CHROMADB_URL=http://192.168.0.34:8000
```

---

## 📊 Port Allocation (All Methods)

| Project | Port | How to Access |
|---------|------|---------------|
| ACT Farm | 3001 | http://localhost:3001 |
| JusticeHub | 3002 | http://localhost:3002 |
| Empathy Ledger | 3005 | http://localhost:3005 |
| The Harvest | 3004 | http://localhost:3004 |
| Dashboard | 3999 | http://localhost:3999 |

---

## 🎯 Recommended Workflow

**For daily development:**

1. **Morning startup:**
   ```bash
   cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
   npm start
   ```
   - All projects start
   - Dashboard at http://localhost:3999
   - Terminal shows color-coded logs

2. **Open workspace:**
   ```bash
   open ACT-Workspace.code-workspace
   ```
   - All projects visible in one VSCode window
   - Don't start servers (already running from step 1)

3. **Work on any project:**
   - Edit files in VSCode
   - Changes hot-reload automatically
   - Switch projects by clicking folder in sidebar
   - Check dashboard to see server status

4. **End of day:**
   - Ctrl+C in terminal (stops all servers)
   - Close VSCode

**For focused work on one project:**

1. **Open just that project:**
   ```bash
   cd "/Users/benknight/Code/JusticeHub"
   code .
   ```

2. **Start server:**
   ```bash
   PORT=3002 npm run dev
   ```

3. **Work normally:**
   - Full VSCode window for this project
   - Still connects to shared NAS services
   - Other projects aren't running (saves battery)

---

## 🚀 Quick Commands

### VSCode Workspace
```bash
# Open workspace
open "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/ACT-Workspace.code-workspace"

# Or from command line:
code "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/ACT-Workspace.code-workspace"
```

### Start All Servers (Terminal)
```bash
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
npm start
```

### Start Individual Project
```bash
# ACT Farm
cd "/Users/benknight/Code/ACT Farm/act-farm"
PORT=3001 npm run dev

# JusticeHub
cd "/Users/benknight/Code/JusticeHub"
PORT=3002 npm run dev

# Empathy Ledger
cd "/Users/benknight/Code/Empathy Ledger v.02"
npm run dev  # Has port 3005 hardcoded

# The Harvest
cd "/Users/benknight/Code/The Harvest"
PORT=3004 npm run dev
```

### Open Dashboard
```bash
open http://localhost:3999
```

---

## 💡 Pro Tips

### Tip 1: Use Split Terminals
In VSCode workspace:
- Terminal → Split Terminal
- Run different projects in different splits
- See logs side-by-side

### Tip 2: Use Terminal Tabs
VSCode automatically creates terminal tabs when you start multiple servers via debugger:
- Each project gets its own tab
- Easy to switch between logs
- Clean and organized

### Tip 3: File Search Across All Projects
In workspace mode:
- Cmd+Shift+F (global search)
- Searches all 5 folders
- Great for finding where something is used

### Tip 4: Multi-Cursor Editing Across Projects
- Edit similar files across projects simultaneously
- E.g., update all `.env.local` files at once

### Tip 5: Integrated Git
- Source Control panel shows all 5 repos
- Commit to any project
- See changes across all projects

---

## 🐛 Troubleshooting

### "Port already in use"
```bash
# Kill process on port:
lsof -ti:3001 | xargs kill -9

# Or kill all:
pkill -f "next dev"
```

### VSCode debugger won't start
- Check project has `npm run dev` script
- Verify `package.json` exists
- Try starting manually first: `npm run dev`

### Can't see all folders in workspace
- File → Open Workspace from File
- Select `ACT-Workspace.code-workspace`
- All folders should appear

### Servers running but can't see dashboard
- Orchestrator not running
- Start with: `npm start` in Dev Hub folder

---

## ✅ Summary

**You have THREE ways to work:**

1. **Workspace + Orchestrator** (Best for multi-project work)
   - `npm start` + open workspace
   - All projects visible, all servers running
   - Dashboard monitoring

2. **Workspace only** (Good for coding sessions)
   - Open workspace
   - Use VSCode debugger to start projects
   - No dashboard but clean VSCode UI

3. **Separate windows** (Good for focused work)
   - Open one project at a time
   - Traditional workflow
   - Less memory if only working on one project

**All methods share NAS services automatically!** 🎉

Choose what fits your workflow best. I recommend trying **Option 1 (Workspace + Orchestrator)** first - it's the most powerful.
