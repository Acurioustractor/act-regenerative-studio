# Synology NAS Development Setup for ACT Projects

## Overview

This guide sets up your Synology NAS as a development infrastructure hub for all ACT projects, offloading persistent services from your Mac while keeping development servers local for fast iteration.

---

## Prerequisites

- Synology NAS with Container Manager installed (DSM 7.2+)
- Mac with code repositories in `/Users/benknight/Code/`
- Gigabit network connection between Mac and NAS
- Synology model (please confirm - e.g., DS920+, DS1522+)

---

## Part 1: Container Manager Setup

### 1.1 Enable and Update Container Manager

1. **Login to DSM**: http://your-nas-ip:5000 or use find.synology.com
2. **Package Center** → Search "Container Manager"
3. **Install or Update** to latest 2025 version
4. **Open Container Manager** from main menu

### 1.2 Create Shared Folders for Docker Volumes

Control Panel → Shared Folder → Create:

```
/docker/postgres/empathy-ledger/data
/docker/postgres/justicehub/data
/docker/redis/data
/docker/chromadb/data
/docker/backups
/projects/ACT (optional - for code sync)
```

Set permissions: Your user account = Read/Write

---

## Part 2: Database Containers

### 2.1 Empathy Ledger PostgreSQL

**Container Manager → Image → Download**: `postgres:15`

**Container Manager → Container → Create**:
- **Container Name**: `empathy-ledger-db`
- **Image**: postgres:15
- **Port Settings**:
  - Local Port: `5432` → Container Port: `5432`
- **Volume Settings**:
  - Add Folder: `/docker/postgres/empathy-ledger/data` → Mount Path: `/var/lib/postgresql/data`
- **Environment Variables**:
  ```
  POSTGRES_DB=empathy_ledger
  POSTGRES_USER=postgres
  POSTGRES_PASSWORD=YOUR_SECURE_PASSWORD_HERE
  ```
- **Network**: Bridge (default)
- **Restart Policy**: Always
- **Auto-start**: Enabled

Click **Apply** → **Start**

**Verify**:
- Container Manager → Container tab → Check status is "Running"
- Log tab → Should see "database system is ready to accept connections"

### 2.2 JusticeHub PostgreSQL

Same process as above, but:
- **Container Name**: `justicehub-db`
- **Local Port**: `5433` (different from Empathy Ledger)
- **Volume**: `/docker/postgres/justicehub/data` → `/var/lib/postgresql/data`
- **Environment**:
  ```
  POSTGRES_DB=justicehub
  POSTGRES_USER=postgres
  POSTGRES_PASSWORD=YOUR_SECURE_PASSWORD_HERE
  ```

### 2.3 Shared Supabase Instance (Optional)

If you want to run Supabase locally instead of using hosted:

**Note**: Supabase requires multiple containers. Better to use docker-compose approach (see Part 4).

---

## Part 3: Supporting Services

### 3.1 Redis Cache

**Image**: `redis:latest`

**Container Settings**:
- **Name**: `redis-cache`
- **Port**: `6379` → `6379`
- **Volume**: `/docker/redis/data` → `/data`
- **Command**: `redis-server --appendonly yes`
- **Restart**: Always

### 3.2 ChromaDB (for JusticeHub vector search)

**Image**: `chromadb/chroma:latest`

**Container Settings**:
- **Name**: `chromadb`
- **Port**: `8000` → `8000`
- **Volume**: `/docker/chromadb/data` → `/chroma/chroma`
- **Environment**:
  ```
  IS_PERSISTENT=TRUE
  ANONYMIZED_TELEMETRY=FALSE
  ```
- **Restart**: Always

### 3.3 Portainer (Container GUI Management)

**Image**: `portainer/portainer-ce:latest`

**Container Settings**:
- **Name**: `portainer`
- **Port**: `9000` → `9000`, `8000` → `8000`
- **Volume**:
  - `/docker/portainer/data` → `/data`
  - `/var/run/docker.sock` → `/var/run/docker.sock` (Docker socket access)
- **Restart**: Always

**Access**: http://nas-ip:9000
- Create admin account on first login
- Easier container management than Container Manager GUI

---

## Part 4: Docker Compose (Advanced Multi-Container Stacks)

Container Manager supports docker-compose.yml in 2025.

### 4.1 Create Complete Stack File

Create this file on your Mac: `/Users/benknight/Code/synology-dev-stack.yml`

```yaml
version: '3.8'

services:
  # Empathy Ledger Database
  empathy-db:
    image: postgres:15
    container_name: empathy-ledger-db
    restart: always
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: empathy_ledger
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${EMPATHY_DB_PASSWORD}
    volumes:
      - /volume1/docker/postgres/empathy-ledger/data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  # JusticeHub Database
  justicehub-db:
    image: postgres:15
    container_name: justicehub-db
    restart: always
    ports:
      - "5433:5432"
    environment:
      POSTGRES_DB: justicehub
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${JUSTICEHUB_DB_PASSWORD}
    volumes:
      - /volume1/docker/postgres/justicehub/data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:latest
    container_name: redis-cache
    restart: always
    ports:
      - "6379:6379"
    volumes:
      - /volume1/docker/redis/data:/data
    command: redis-server --appendonly yes
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5

  # ChromaDB Vector Store
  chromadb:
    image: chromadb/chroma:latest
    container_name: chromadb
    restart: always
    ports:
      - "8000:8000"
    environment:
      IS_PERSISTENT: "TRUE"
      ANONYMIZED_TELEMETRY: "FALSE"
    volumes:
      - /volume1/docker/chromadb/data:/chroma/chroma

  # Portainer Container Management
  portainer:
    image: portainer/portainer-ce:latest
    container_name: portainer
    restart: always
    ports:
      - "9000:9000"
      - "9443:9443"
    volumes:
      - /volume1/docker/portainer/data:/data
      - /var/run/docker.sock:/var/run/docker.sock

volumes:
  empathy-data:
  justicehub-data:
  redis-data:
  chroma-data:
  portainer-data:
```

### 4.2 Deploy via Container Manager

1. **Container Manager → Project tab → Create**
2. **Upload** the compose file
3. **Set environment variables**:
   - `EMPATHY_DB_PASSWORD=your_password`
   - `JUSTICEHUB_DB_PASSWORD=your_password`
4. **Start** the project

All containers launch together with proper networking.

---

## Part 5: Mac Development Setup

### 5.1 Update .env Files to Point to NAS

**Empathy Ledger** (`/Users/benknight/Code/empathy-ledger-v2/.env.local`):

```bash
# Change from localhost to NAS IP
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@192.168.1.XXX:5432/empathy_ledger

# Supabase stays cloud-hosted
NEXT_PUBLIC_SUPABASE_URL=https://yvnuayzslukamizrlhwb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Redis cache on NAS
REDIS_URL=redis://192.168.1.XXX:6379
```

**JusticeHub** (`/Users/benknight/Code/JusticeHub/.env.local`):

```bash
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@192.168.1.XXX:5433/justicehub

# ChromaDB on NAS
CHROMADB_URL=http://192.168.1.XXX:8000
```

**Replace `192.168.1.XXX`** with your actual NAS IP address.

### 5.2 Test Connections from Mac

```bash
# Test Empathy Ledger DB
psql postgresql://postgres:YOUR_PASSWORD@192.168.1.XXX:5432/empathy_ledger

# Test JusticeHub DB
psql postgresql://postgres:YOUR_PASSWORD@192.168.1.XXX:5433/justicehub

# Test Redis
redis-cli -h 192.168.1.XXX ping
# Should return: PONG

# Test ChromaDB
curl http://192.168.1.XXX:8000/api/v1/heartbeat
# Should return: {"nanosecond heartbeat": ...}
```

### 5.3 Run Development Servers on Mac

```bash
# Empathy Ledger
cd "/Users/benknight/Code/empathy-ledger-v2"
npm run dev
# Runs on http://localhost:3000, connects to NAS DB

# JusticeHub
cd "/Users/benknight/Code/JusticeHub"
npm run dev
# Runs on http://localhost:3001, connects to NAS DB

# The Harvest
cd "/Users/benknight/Code/The Harvest"
npm run dev

# ACT Farm
cd "/Users/benknight/Code/ACT Farm/act-farm"
npm run dev

# ACT Hub
cd "/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio"
npm run dev
```

**Benefits**:
- Mac only runs Node.js dev servers (hot reload, fast)
- Databases always-on on NAS (survives Mac sleep)
- Low Mac battery usage (no Docker containers)
- Data persists on NAS RAID (safe from Mac issues)

---

## Part 6: Code Sync to NAS (Optional)

### 6.1 Enable SMB/NFS on Synology

**Control Panel → File Services**:
- Enable **SMB**: For Mac Finder access
- Enable **NFS** (optional): For faster mount

### 6.2 Mount NAS Share on Mac

**Finder → Go → Connect to Server** (⌘K):
```
smb://192.168.1.XXX/projects
```

Enter your NAS credentials.

**Auto-mount on login**:
- System Preferences → Users & Groups → Login Items
- Add the mounted share

### 6.3 Work Directly from NAS (Optional)

Move code to NAS share:
```bash
# One-time sync
rsync -avz "/Users/benknight/Code/" "/Volumes/projects/ACT/"

# OR use symlinks
ln -s "/Volumes/projects/ACT" "/Users/benknight/Code/ACT-NAS"
```

**VS Code**: Open `/Volumes/projects/ACT/empathy-ledger-v2` directly

**Benefits**:
- Code backed up to NAS RAID automatically
- Work from multiple machines
- Synology Snapshot Replication for versioning

**Tradeoff**: Slightly slower file operations over network (negligible on Gigabit)

---

## Part 7: Backups and Automation

### 7.1 Database Backup Container

**Image**: `postgres:15`

**Container**: `db-backup`

**Script** (run as scheduled task in Container Manager):

```bash
#!/bin/bash
# Daily backup script
BACKUP_DIR="/volume1/docker/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Empathy Ledger backup
docker exec empathy-ledger-db pg_dump -U postgres empathy_ledger > \
  $BACKUP_DIR/empathy_ledger_$DATE.sql

# JusticeHub backup
docker exec justicehub-db pg_dump -U postgres justicehub > \
  $BACKUP_DIR/justicehub_$DATE.sql

# Keep only last 30 days
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete

echo "Backups completed: $DATE"
```

**Schedule**:
- Control Panel → Task Scheduler → Create → User-defined script
- Schedule: Daily at 2 AM
- Script: Upload above script

### 7.2 Synology Snapshot Replication

**Snapshot Replication** (if supported by your model):
- Control Panel → Shared Folder → Select `/docker` folder
- Enable snapshots: Every 4 hours, keep 24 snapshots
- Instant rollback if container corruption

---

## Part 8: Performance Optimization

### 8.1 NAS Resource Allocation

**Container Manager → Settings → Resources**:
- CPU Limit: 80% (leave 20% for DSM)
- Memory Limit: 80% of total RAM
- Enable automatic cleanup of unused images

### 8.2 Network Optimization

**Router Settings**:
- Reserve static IP for NAS (DHCP reservation)
- Enable Jumbo Frames (MTU 9000) if supported
- Use wired Gigabit for best performance

**Mac Network**:
- Add NAS IP to `/etc/hosts`:
  ```
  192.168.1.XXX   nas.local
  ```
- Use `nas.local` in connection strings instead of IP

### 8.3 SSD Cache (If Available)

If your Synology has SSD slots (e.g., DS920+):
- **Storage Manager → SSD Cache → Create**
- Assign cache to `/docker` folder
- Dramatically speeds up database operations

---

## Part 9: Monitoring and Maintenance

### 9.1 Portainer Dashboard

**Access**: http://nas.local:9000

**Monitor**:
- Container CPU/memory usage
- Container logs (real-time)
- Quick restart/stop/rebuild
- Stack management

### 9.2 Synology Resource Monitor

**DSM → Resource Monitor**:
- Check overall CPU/RAM usage
- Network throughput graphs
- Storage I/O performance

### 9.3 Health Checks

Add to crontab on Mac (optional):

```bash
#!/bin/bash
# ~/check-nas-services.sh

SERVICES=(
  "postgres:5432"
  "postgres:5433"
  "redis:6379"
  "chromadb:8000"
)

NAS_IP="192.168.1.XXX"

for service in "${SERVICES[@]}"; do
  name="${service%:*}"
  port="${service#*:}"

  if nc -z -w5 $NAS_IP $port; then
    echo "✅ $name is UP"
  else
    echo "❌ $name is DOWN"
    # Optional: Send notification via curl/osascript
  fi
done
```

Run daily via `crontab -e`:
```
0 9 * * * ~/check-nas-services.sh
```

---

## Part 10: Troubleshooting

### Database won't start

**Check logs**:
- Container Manager → Container → Select container → Log tab
- Look for permission errors or port conflicts

**Fix permissions**:
```bash
# SSH into NAS (enable Terminal in DSM)
sudo chown -R 999:999 /volume1/docker/postgres/empathy-ledger/data
```

### Can't connect from Mac

**Firewall**:
- Control Panel → Security → Firewall → Edit Rules
- Allow ports: 5432, 5433, 6379, 8000, 9000

**Network**:
- Ping NAS from Mac: `ping 192.168.1.XXX`
- Test port: `nc -zv 192.168.1.XXX 5432`

### Slow performance

**Check network speed**:
```bash
# On Mac, test transfer speed
time dd if=/dev/zero of=/Volumes/projects/test.img bs=1m count=1024
```

Should be ~100 MB/s on Gigabit.

**Optimize Docker storage**:
- Use Btrfs volumes (better than ext4 for containers)
- Enable SSD cache if available

### Data migration from old container

**Mac → NAS**:

```bash
# Dump from old Mac container
docker exec qldtrackerwindsurf-db-1 pg_dump -U postgres your_db > backup.sql

# Copy to NAS
scp backup.sql your_user@nas.local:/volume1/docker/backups/

# Restore to NAS container
cat backup.sql | docker exec -i empathy-ledger-db psql -U postgres empathy_ledger
```

---

## Summary: What You Get

### Mac Development
- ✅ Fast hot-reload dev servers (Next.js runs locally)
- ✅ Low battery usage (no Docker containers)
- ✅ No data loss on Mac sleep/restart
- ✅ Clean separation of concerns

### NAS Infrastructure
- ✅ 24/7 always-on databases
- ✅ RAID data redundancy
- ✅ Automated backups
- ✅ Low power consumption (5-15W total)
- ✅ Centralized service management

### Network Performance
- ✅ Sub-5ms latency on local network
- ✅ 100+ MB/s throughput
- ✅ No noticeable slowdown vs localhost

### Cost Savings
- ✅ Mac battery life extended 2-3x
- ✅ NAS uses ~$2/month electricity vs Mac always-on
- ✅ Data safety (RAID + snapshots)

---

## Quick Start Checklist

- [ ] Install/update Container Manager on Synology
- [ ] Create shared folders for Docker volumes
- [ ] Deploy Empathy Ledger PostgreSQL container
- [ ] Deploy JusticeHub PostgreSQL container
- [ ] Deploy Redis container
- [ ] Deploy ChromaDB container
- [ ] Deploy Portainer container
- [ ] Update Mac `.env.local` files with NAS IP
- [ ] Test database connections from Mac
- [ ] Run dev servers on Mac
- [ ] Verify hot reload still works
- [ ] Set up automated backups
- [ ] Configure monitoring

---

## Next Steps

1. **Share your Synology model**: So I can optimize volume paths and resource limits
2. **Test first container**: Start with Empathy Ledger PostgreSQL
3. **Migrate data**: Dump from old container → restore to NAS
4. **Expand gradually**: Add other services one by one
5. **Monitor performance**: Check Portainer after 24h to verify stability

---

**Need help?** Share:
- Synology model (e.g., DS920+)
- Container Manager screenshots (if errors)
- Mac connection test results
- Any specific error messages

Let's get your ACT development infrastructure rock-solid! 🚀
