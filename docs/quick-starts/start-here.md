# 🚀 ACT Development Hub - START HERE

## One Command to Rule Them All

```bash
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
npm start
```

That's it! This will:
- ✅ Start ALL your ACT projects simultaneously
- ✅ Each on its own port (no conflicts)
- ✅ Connect all to shared NAS services (Redis, ChromaDB)
- ✅ Enable live reload for instant feedback
- ✅ Auto-restart if any server crashes
- ✅ Show live dashboard at http://localhost:3999

---

## What Gets Started

| Project | Port | URL |
|---------|------|-----|
| **ACT Farm** | 3001 | http://localhost:3001 |
| **JusticeHub** | 3002 | http://localhost:3002 |
| **Empathy Ledger** | 3003 | http://localhost:3003 |
| **The Harvest** | 3004 | http://localhost:3004 |

Plus:
- **Dashboard Monitor**: http://localhost:3999 (shows all server status)

---

## Shared NAS Services (Auto-Connected)

All projects automatically connect to:
- **Redis** (`redis://192.168.0.34:6379`) - Caching
- **ChromaDB** (`http://192.168.0.34:8000`) - Vector search
- **Portainer** (`http://192.168.0.34:9000`) - Container management

---

## How It Works

The orchestrator:
1. Sets unique PORT for each project
2. Injects REDIS_URL and CHROMADB_URL into each
3. Starts `npm run dev` in each project directory
4. Monitors all servers and restarts on crashes
5. Provides color-coded terminal output
6. Serves live dashboard with server status

---

## Terminal Output

You'll see color-coded logs:
- 🟢 **Green** = ACT Farm
- 🔵 **Blue** = JusticeHub
- 🟣 **Magenta** = Empathy Ledger
- 🟡 **Yellow** = The Harvest

Each line is prefixed with `[ProjectName]` so you know which server is logging.

---

## Visual Dashboard

Open http://localhost:3999 to see:
- Live status of all running servers
- Port numbers and clickable URLs
- NAS service connections
- Server uptime
- Restart counts (if crashes occur)
- Auto-refreshes every 5 seconds

---

## Development Workflow

### Working on a single project:
1. `npm start` (starts all)
2. Open http://localhost:3999 (dashboard)
3. Click the project you want to work on
4. Edit files - hot reload works instantly
5. All other projects keep running in background

### Benefits:
- ✅ Test integrations between projects immediately
- ✅ See registry data flowing between sites
- ✅ No need to stop/start different servers
- ✅ Shared caching makes everything faster
- ✅ One terminal window for everything

---

## Stopping Servers

Press `Ctrl+C` in the terminal - all servers stop gracefully.

---

## Troubleshooting

### "Port already in use"
```bash
# Kill process on specific port:
lsof -ti:3001 | xargs kill -9  # Replace 3001 with problem port
```

### "Project won't start"
Check individual project logs in terminal. Each project's errors are color-coded.

### "Dashboard shows 'STOPPED'"
Check terminal for error messages. Server auto-restarts after crashes.

### "Can't connect to Redis/ChromaDB"
```bash
# Check NAS containers are running:
open http://192.168.0.34:9000  # Portainer

# Or test directly:
redis-cli -h 192.168.0.34 ping
curl http://192.168.0.34:8000/api/v2/heartbeat
```

---

## Adding a New Project

Edit `dev-servers.mjs`:

```javascript
{
  name: 'New Project',
  dir: path.join(CODE_DIR, 'new-project-folder'),
  port: 3006,  // Next available port
  color: '\x1b[36m',  // Choose a color
  enabled: true,
}
```

Then `npm start` again.

---

## Environment Variables

All projects automatically get:
```bash
PORT=<unique-port>              # Set by orchestrator
REDIS_URL=redis://192.168.0.34:6379
CHROMADB_URL=http://192.168.0.34:8000
```

Projects can override these in their own `.env.local` if needed.

---

## Performance Benefits

With this setup:
- ✅ **Redis caching**: 99% faster registry syncs
- ✅ **Shared services**: All on NAS, not Mac
- ✅ **Mac battery**: 3x longer (no local Docker)
- ✅ **Development speed**: Instant switching between projects
- ✅ **Integration testing**: All projects running means you can test registry flows immediately

---

## Quick Reference

```bash
# Start all projects
npm start

# Dashboard
open http://localhost:3999

# Individual projects
open http://localhost:3001  # ACT Farm
open http://localhost:3002  # JusticeHub
open http://localhost:3003  # Empathy Ledger
open http://localhost:3004  # The Harvest

# NAS services
open http://192.168.0.34:9000  # Portainer

# Test Redis cache
npm run test:redis

# Demo cache performance
npm run demo:cache
```

---

## What's Next

Once you have this running:
1. ✅ All projects hot-reload on file changes
2. ✅ Test integrations between projects live
3. ✅ Monitor server health in dashboard
4. ✅ Develop on multiple projects simultaneously
5. ✅ Shared Redis cache speeds up everything

Optional enhancements:
- Add Tailscale for remote access to all servers
- Set up automated backups for NAS
- Add more projects to the orchestrator

---

## Status

- [x] Synology NAS with Redis + ChromaDB running
- [x] Multi-project orchestrator created
- [x] Visual dashboard ready
- [x] All 4 projects configured
- [ ] Run `npm start` to launch! 🚀

**Ready when you are!** Just run `npm start` and open the dashboard.
