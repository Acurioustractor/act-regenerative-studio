# ACT Development Hub - Multi-Project Live Server Setup

## The Vision

**One command starts everything:**
- All ACT projects running simultaneously
- Each on its own port (no conflicts)
- Shared NAS services (Redis, ChromaDB)
- Live reload for instant feedback
- Visual dashboard showing all running servers

---

## Project Port Allocation

| Project | Port | URL |
|---------|------|-----|
| **ACT Hub** (main) | 3000 | http://localhost:3000 |
| **ACT Farm** | 3001 | http://localhost:3001 |
| **JusticeHub** | 3002 | http://localhost:3002 |
| **Empathy Ledger** | 3003 | http://localhost:3003 |
| **The Harvest** | 3004 | http://localhost:3004 |
| **Goods on Country** | 3005 | http://localhost:3005 |
| **Dashboard Monitor** | 3999 | http://localhost:3999 |

---

## Directory Structure

```
/Users/benknight/Code/
├── ACT Farm and Regenerative Innovation Studio/  ← Main hub (port 3000)
│   ├── package.json (main orchestrator)
│   ├── dev-servers.js (startup script)
│   └── dashboard/ (live server monitor)
│
├── ACT Farm/act-farm/                           ← ACT Farm site (port 3001)
├── JusticeHub/                                  ← JusticeHub (port 3002)
├── empathy-ledger-v2/                           ← Empathy Ledger (port 3003)
├── The Harvest/                                 ← The Harvest (port 3004)
└── (Goods on Country location?)                 ← Goods (port 3005)
```

---

## Shared NAS Services

All projects use these shared services:

```bash
# Redis Cache
REDIS_URL=redis://192.168.0.34:6379

# ChromaDB (for vector search)
CHROMADB_URL=http://192.168.0.34:8000
```

---

## One-Command Startup

We'll create a startup script that:
1. Checks all project directories exist
2. Starts each project on its designated port
3. Shows live status dashboard
4. Auto-restarts if any server crashes

---

## Next Steps

I'll create:
1. **dev-servers.js** - Orchestration script to start all projects
2. **package.json** - With single `npm start` command
3. **Visual dashboard** - Live server monitor at :3999
4. **Health checks** - Auto-restart crashed servers
5. **Shared .env template** - For all projects to use NAS services

Ready to implement?
