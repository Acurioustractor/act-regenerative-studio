# ACT Development Hub - Startup Guide

## ✅ Fixed Issues

### Problems Identified & Resolved

1. **Port Conflicts** ✅
   - **Issue**: Multiple processes trying to use same ports
   - **Fix**: Created `start-clean.sh` that kills old processes before starting

2. **Empathy Ledger Port Hardcoding** ✅
   - **Issue**: `package.json` had `-p 3005` hardcoded instead of using orchestrator's 3003
   - **Fix**: Removed hardcoded port, now respects orchestrator config

3. **Port Assignment** ✅
   - **Issue**: Next.js wasn't respecting PORT environment variable
   - **Fix**: Updated orchestrator to explicitly pass `-p [port]` to `next dev`

4. **Recursive Script Call** ✅
   - **Issue**: `npm start` calling `start-clean.sh` which called `npm start` again
   - **Fix**: Script now calls `node dev-servers.mjs` directly

---

## 🚀 How to Start (The Right Way)

### Method 1: Clean Start (Recommended)

```bash
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
npm start
```

This will:
1. Kill any existing dev servers
2. Wait for ports to be released
3. Start all 5 projects + dashboard

### Method 2: Manual Start

```bash
# Kill old processes
npm run stop

# Start orchestrator
npm run dev
```

---

## 🗺️ Port Assignments

| Project | Port | URL |
|---------|------|-----|
| **Admin Wiki** | 4000 | http://localhost:4000 |
| **ACT Farm** | 3001 | http://localhost:3001 |
| **JusticeHub** | 3002 | http://localhost:3002 |
| **Empathy Ledger** | 3003 | http://localhost:3003 |
| **The Harvest** | 3004 | http://localhost:3004 |
| **Dev Dashboard** | 3999 | http://localhost:3999 |

---

## 📊 Monitoring

### Dev Dashboard (Port 3999)

Open [http://localhost:3999](http://localhost:3999) to see:
- All 5 projects' status (RUNNING/STOPPED)
- Process IDs and restart counts
- Direct links to each project
- NAS service links (Redis, ChromaDB, Portainer)
- System uptime
- Auto-refreshes every 5 seconds

### Admin Wiki (Port 4000)

Open [http://localhost:4000](http://localhost:4000) to access:
- **Dashboard**: System health + cross-project metrics
- **Ecosystem Map**: Visual integration diagram
- **Pipelines**: All 15 pipelines across projects
- **Revenue**: Financial dashboard with projections
- **Documentation**: All strategy docs and guides

---

## 🛑 How to Stop

### Stop All Servers

```bash
# Method 1: Ctrl+C in the terminal where it's running
^C

# Method 2: From another terminal
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
npm run stop
```

---

## 🔧 Troubleshooting

### "Address already in use" Error

```bash
# Kill all dev servers and try again
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
npm run stop
sleep 2
npm start
```

### "Dashboard not loading" (http://localhost:3999)

1. Check terminal output for errors
2. Verify no other process is using port 3999:
   ```bash
   lsof -i :3999
   ```
3. If port is blocked, kill the process:
   ```bash
   lsof -ti:3999 | xargs kill -9
   ```
4. Restart: `npm start`

### "Projects showing as STOPPED in dashboard"

- Check terminal output for error messages
- Common causes:
  - Missing `node_modules`: cd to project, run `npm install`
  - Port conflict: Use `npm run stop` then `npm start`
  - Syntax error in code: Check terminal for error details

### "Redis connection failed"

1. Check if NAS is running:
   ```bash
   ping 192.168.0.34
   ```

2. Check Docker containers on NAS:
   - Open Portainer: http://192.168.0.34:9000
   - Verify Redis container is running

3. Test Redis connection:
   ```bash
   npm run test:redis
   ```

---

## 📝 Scripts Reference

| Command | Description |
|---------|-------------|
| `npm start` | Clean start (kills old processes, starts all projects) |
| `npm run dev` | Direct start (assumes ports are free) |
| `npm run stop` | Kill all dev servers |
| `npm run test:redis` | Test Redis connection |
| `npm run demo:cache` | Demo Redis caching performance |

---

## 🏗️ Project Structure

```
ACT Farm and Regenerative Innovation Studio/
├── dev-servers.mjs           # Main orchestrator
├── start-clean.sh            # Clean startup script
├── package.json              # NPM scripts
│
├── admin-wiki/               # Port 4000 - Admin Dashboard
│   ├── src/
│   │   ├── app/
│   │   └── components/
│   └── package.json
│
└── [Other project directories accessed via CODE_DIR/..]
    ├── ACT Farm/act-farm/        # Port 3001
    ├── JusticeHub/               # Port 3002
    ├── Empathy Ledger v.02/      # Port 3003
    └── The Harvest/              # Port 3004
```

---

## 🌐 Shared NAS Services

All projects automatically connect to these shared services:

| Service | URL | Purpose |
|---------|-----|---------|
| **Redis** | redis://192.168.0.34:6379 | Caching for all projects |
| **ChromaDB** | http://192.168.0.34:8000 | Vector search |
| **Portainer** | http://192.168.0.34:9000 | Docker management |

Environment variables are automatically injected by the orchestrator:
```javascript
REDIS_URL='redis://192.168.0.34:6379'
CHROMADB_URL='http://192.168.0.34:8000'
PORT=[project-specific-port]
```

---

## ✅ Verification Checklist

After starting, verify:

- [ ] Dev dashboard loads: http://localhost:3999
- [ ] All 5 projects show "RUNNING" status
- [ ] Admin Wiki loads: http://localhost:4000
- [ ] ACT Farm loads: http://localhost:3001
- [ ] JusticeHub loads: http://localhost:3002
- [ ] Empathy Ledger loads: http://localhost:3003
- [ ] The Harvest loads: http://localhost:3004
- [ ] No error messages in terminal
- [ ] Process IDs visible in dashboard
- [ ] NAS services links work (Redis, ChromaDB, Portainer)

---

## 🎯 Quick Start Summary

```bash
# 1. Navigate to root
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"

# 2. Start everything
npm start

# 3. Check status
# Open: http://localhost:3999

# 4. Access admin wiki
# Open: http://localhost:4000

# 5. Stop when done
# Press Ctrl+C in terminal
```

---

## 📚 Related Documentation

- [Complete System Setup](./SYSTEM_SETUP_COMPLETE.md)
- [Visual Ecosystem Strategy](./ACT_ECOSYSTEM_VISUAL_STRATEGY.md)
- [GHL Pipeline Strategy](./GHL_PIPELINE_STRATEGY.md)
- [GHL CRM Advisor Skill](./.claude/skills/ghl-crm-advisor/SKILL.md)

---

**Last Updated**: 2025-12-24
**Tested On**: macOS (Darwin 25.1.0)
**Node Version**: 18+
