# ACT Ecosystem Local Deployment Skill

**Type**: Project Management Skill
**Category**: Development Operations
**Usage**: `/act-deploy [start|stop|restart|status|logs|monitor]`

---

## Purpose

Production-quality deployment of all 6 ACT ecosystem websites locally with one command.

---

## What This Skill Does

When invoked, this skill:

1. **Manages all ACT sites with PM2** (production-grade process manager)
2. **Opens all 6 sites in one browser window** (Chrome tabs, not new windows)
3. **Provides real-time monitoring** (pm2 monit dashboard)
4. **Auto-restarts crashed servers** (max 10 restarts per server)
5. **Centralizes logs** (timestamped, organized by project)
6. **Persists after terminal closes** (PM2 daemon keeps running)

---

## Commands

### Start All Servers
```bash
/act-deploy start
```
- Starts all 6 ACT ecosystem sites
- Opens browser with all sites in tabs
- Shows status dashboard

### Stop All Servers
```bash
/act-deploy stop
```
- Gracefully stops all running servers
- Cleans up PM2 processes

### Restart All Servers
```bash
/act-deploy restart
```
- Restarts all servers without full stop/start cycle
- Faster than stop + start

### Show Status
```bash
/act-deploy status
```
- Lists all running processes
- Shows CPU/memory usage
- Displays URLs for each site

### View Logs
```bash
/act-deploy logs
```
- Shows live logs from all servers
- Tail-follows output in real-time
- Color-coded by process

### Open Monitoring Dashboard
```bash
/act-deploy monitor
```
- Opens interactive PM2 dashboard
- Real-time CPU, memory, restart counts
- Navigate with arrow keys

---

## Sites Deployed

| Site | Port | URL |
|------|------|-----|
| ACT Regenerative Studio | 3002 | http://localhost:3002 |
| Empathy Ledger | 3001 | http://localhost:3001 |
| JusticeHub | 3003 | http://localhost:3003 |
| The Harvest Website | 3004 | http://localhost:3004 |
| ACT Farm | 3005 | http://localhost:3005 |
| ACT Placemat | 3999 | http://localhost:3999 |

---

## Technical Implementation

### PM2 Ecosystem Configuration
- **File**: `ecosystem.config.js`
- **Process manager**: PM2 (production-grade)
- **Auto-restart**: Yes (max 10 per process)
- **Log rotation**: Yes (timestamped)
- **Persistence**: Survives terminal closure

### Browser Automation
- **File**: `scripts/open-all-sites.applescript`
- **Technology**: AppleScript (native macOS)
- **Behavior**: Opens all 6 tabs in ONE Safari window
- **Smart**: Uses existing window if available

### Deployment Script
- **File**: `scripts/deploy-act-ecosystem.sh`
- **Features**:
  - Color-coded output
  - Error handling
  - Status reporting
  - Multiple commands (start/stop/restart/logs/monitor)

---

## Skill Behavior

When you use `/act-deploy start`, Claude Code will:

1. Execute: `cd /Users/benknight/Code/act-regenerative-studio`
2. Run: `./scripts/deploy-act-ecosystem.sh start`
3. Wait for servers to initialize (8 seconds)
4. Open Safari with all 6 tabs
5. Display status dashboard

**Output Example:**
```
╔════════════════════════════════════════╗
║   ACT Ecosystem Deployment Manager    ║
╚════════════════════════════════════════╝

✓ PM2 ready
ℹ Starting all ACT ecosystem servers...
✓ All servers started with PM2

ℹ Waiting for servers to start...

ℹ Opening all sites in Safari...
✓ Sites opened in browser

┌────┬─────────────────┬─────────┬─────────┬──────────┐
│ id │ name            │ mode    │ ↺      │ status   │
├────┼─────────────────┼─────────┼─────────┼──────────┤
│ 0  │ act-studio      │ fork    │ 0      │ online   │
│ 1  │ empathy-ledger  │ fork    │ 0      │ online   │
│ 2  │ justicehub      │ fork    │ 0      │ online   │
│ 3  │ harvest         │ fork    │ 0      │ online   │
│ 4  │ act-farm        │ fork    │ 0      │ online   │
│ 5  │ placemat        │ fork    │ 0      │ online   │
└────┴─────────────────┴─────────┴─────────┴──────────┘

🎉 ACT Ecosystem is now running!
```

---

## Advantages Over Previous Methods

| Feature | Old (tmux) | New (PM2) |
|---------|------------|-----------|
| Reliability | ❌ Inconsistent | ✅ Production-grade |
| Browser Integration | ❌ New windows | ✅ One window, 6 tabs |
| Persistence | ❌ Dies with terminal | ✅ Survives closure |
| Monitoring | ⚠️ Manual tmux | ✅ pm2 monit dashboard |
| Logs | ⚠️ Scattered | ✅ Centralized |
| Auto-restart | ❌ No | ✅ Yes |
| Status | ⚠️ Manual check | ✅ pm2 list |

---

## Troubleshooting

### Servers won't start
```bash
pm2 logs
```
Check for errors in specific process logs.

### Port already in use
```bash
/act-deploy stop
```
Then start again.

### Browser doesn't open
Manually run:
```bash
osascript /Users/benknight/Code/act-regenerative-studio/scripts/open-all-sites.applescript
```

### Need to restart one server
```bash
pm2 restart act-studio
```
Or replace `act-studio` with: `empathy-ledger`, `justicehub`, `harvest`, `act-farm`, `placemat`

---

## Files Created

```
act-regenerative-studio/
├── ecosystem.config.js                 # PM2 configuration
├── scripts/
│   ├── deploy-act-ecosystem.sh         # Main deployment script
│   └── open-all-sites.applescript      # Browser automation
└── logs/                               # PM2 log files
    ├── act-studio-error.log
    ├── act-studio-out.log
    ├── empathy-ledger-error.log
    ├── empathy-ledger-out.log
    ├── justicehub-error.log
    ├── justicehub-out.log
    ├── harvest-error.log
    ├── harvest-out.log
    ├── act-farm-error.log
    ├── act-farm-out.log
    ├── placemat-error.log
    └── placemat-out.log
```

---

## Usage in Claude Code

Simply type:
```
/act-deploy start
```

Claude will execute the deployment script and show you the status.

---

**Last Updated**: 2025-12-30
**Maintainer**: Ben Knight
**Status**: Production-Ready
