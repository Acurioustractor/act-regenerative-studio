# ACT Regenerative Studio

> Central hub for the ACT ecosystem - regenerative innovation infrastructure

---

## 🚀 Quick Start - Local Deployment

**All 6 ACT sites with one command:**

```bash
act-start
```

**📚 New here?** Read the setup guide: [SETUP-COMPLETE.md](./SETUP-COMPLETE.md)

**💡 Quick reference:** [QUICK-START.md](./QUICK-START.md)

**📖 Full docs:** [README-DEPLOYMENT.md](./README-DEPLOYMENT.md)

---

## 🌐 Your Local Sites

| Site | Port | URL |
|------|------|-----|
| 🌐 ACT Regenerative Studio | 3002 | http://localhost:3002 |
| 📖 Empathy Ledger | 3001 | http://localhost:3001 |
| ⚖️ JusticeHub | 3003 | http://localhost:3003 |
| 🌾 The Harvest | 3004 | http://localhost:3004 |
| 🚜 ACT Farm | 3005 | http://localhost:3005 |
| 🗂️ ACT Placemat | 3999 | http://localhost:3999 |

---

## 📋 All Commands

```bash
act-start      # Start all sites + Chrome
act-stop       # Stop all sites
act-restart    # Restart all sites
act-status     # Show running sites
act-logs       # View live logs
act-monitor    # PM2 dashboard
```

---

## 🎯 Common Workflows

### Start your day
```bash
act-start
```

### Check what's running
```bash
act-status
```

### Debug issues
```bash
act-logs
```

### End of day
```bash
act-stop
```

---

## 🛠 Technology Stack

- **Process Manager**: PM2 (production-grade)
- **Browser Automation**: AppleScript → Chrome
- **Deployment**: Bash orchestration
- **Logging**: Centralized timestamped logs
- **Monitoring**: Real-time PM2 dashboard

---

## 📁 Project Structure

```
act-regenerative-studio/
├── src/                          # Next.js application
├── scripts/
│   ├── deploy-act-ecosystem.sh   # Main deployment script
│   └── open-all-sites.applescript # Browser automation
├── ecosystem.config.js           # PM2 configuration
├── logs/                         # PM2 log files
├── QUICK-START.md                # Quick reference
├── README-DEPLOYMENT.md          # Full deployment docs
└── SETUP-COMPLETE.md            # Setup summary
```

---

## 🔗 ACT Ecosystem Projects

1. **ACT Regenerative Studio** - Central hub (this repo)
2. **Empathy Ledger** - Storytelling platform
3. **JusticeHub** - Youth justice platform
4. **The Harvest** - Community food systems
5. **ACT Farm** - Regenerative agriculture
6. **ACT Placemat** - Project coordination

---

## 📚 Documentation

- [Setup Complete Guide](./SETUP-COMPLETE.md) - Overview of what's been set up
- [Quick Start](./QUICK-START.md) - Fast reference for daily use
- [Full Deployment Docs](./README-DEPLOYMENT.md) - Complete technical documentation

---

## 🆘 Support

Having issues? Check the troubleshooting sections in:
- [QUICK-START.md](./QUICK-START.md#troubleshooting)
- [README-DEPLOYMENT.md](./README-DEPLOYMENT.md#troubleshooting)

---

**Last Updated**: 2025-12-31  
**Status**: ✅ Production Ready
