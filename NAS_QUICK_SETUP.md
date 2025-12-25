# Synology NAS Quick Setup for ACT Development (WiFi)

## Step 1: Find Your NAS IP Address

### Option A: Find via Synology Assistant (Easiest)
1. Download **Synology Assistant** from: https://www.synology.com/support/download
2. Run it - it will auto-detect your NAS on the network
3. Note the IP address (e.g., `192.168.1.150`)

### Option B: Find via Router
1. Login to your router admin (usually `192.168.1.1` or `192.168.0.1`)
2. Look for "Connected Devices" or "DHCP Client List"
3. Find device named "Synology" or your NAS model name
4. Note the IP address

### Option C: Terminal Command (Mac)
```bash
# Scan your network for Synology devices
arp -a | grep -i synology

# Or scan port 5000 (DSM web interface)
nmap -p 5000 192.168.1.0/24
```

**✏️ Write down your NAS IP here**: `192.168.1.___`

---

## Step 2: Reserve Static IP (Recommended for WiFi)

To prevent the IP from changing:

1. Login to your **router admin**
2. Find **DHCP Reservation** or **Static IP Assignment**
3. Reserve the IP for your NAS's MAC address
4. OR: In Synology → Control Panel → Network → Network Interface → WiFi → Edit → Use manual configuration

**Recommended IP**: `192.168.1.150` (or whatever you noted above)

---

## Step 3: Login to Synology DSM

1. Open browser: `http://192.168.1.150:5000` (replace with your IP)
2. Login with your admin credentials
3. Update DSM if prompted (Control Panel → Update & Restore)

---

## Step 4: Install Container Manager

1. **Package Center** (icon on left sidebar)
2. Search: **"Container Manager"**
3. Click **Install**
4. Wait for installation (1-2 minutes)
5. Click **Open** when done

---

## Step 5: Create Docker Folders

Container Manager → **Settings** → **Storage** → Click folder icon:

Create these shared folders:
```
/docker
/docker/chromadb
/docker/redis
/docker/portainer
/docker/backups
```

Or via **Control Panel → Shared Folder → Create**:
- Folder Name: `docker`
- Permissions: Your user = Read/Write
- Enable data checksum (if using Btrfs)

Then create subfolders:
1. File Station (icon on left)
2. Navigate to `docker` folder
3. Right-click → Create → Create Folder:
   - `chromadb`
   - `redis`
   - `portainer`
   - `backups`

---

## Step 6: Deploy ChromaDB (for JusticeHub Vector Search)

Container Manager → **Image** tab:

1. Click **Add** → **Add from URL**
2. URL: `chromadb/chroma:latest`
3. Click **Add** → Wait for download

Container Manager → **Container** tab:

1. Click **Create**
2. Select image: `chromadb/chroma:latest`
3. **Container Name**: `chromadb`
4. Click **Advanced Settings**:

**Port Settings**:
- Local Port: `8000` → Container Port: `8000`

**Volume Settings**:
- Click **Add Folder**
- Select `/docker/chromadb` → Mount path: `/chroma/chroma`

**Environment**:
- Click **+** to add variables:
  - `IS_PERSISTENT` = `TRUE`
  - `ANONYMIZED_TELEMETRY` = `FALSE`

**Auto-restart**: ✅ Enable (under General tab)

5. Click **Done** → **Apply**
6. Container should start automatically

**✅ Verify**: Container status shows "Running" with green icon

---

## Step 7: Deploy Redis (for Caching)

Container Manager → **Image** tab:

1. Add from URL: `redis:latest`

Container Manager → **Container** tab → **Create**:

- **Container Name**: `redis`
- **Image**: `redis:latest`

**Advanced Settings**:

**Port Settings**:
- Local Port: `6379` → Container Port: `6379`

**Volume Settings**:
- `/docker/redis` → `/data`

**Execution Command** (under General tab):
```
redis-server --appendonly yes
```

**Auto-restart**: ✅ Enable

Click **Done** → **Apply**

**✅ Verify**: Container status = Running

---

## Step 8: Deploy Portainer (Container Management GUI)

Container Manager → **Image** → Add: `portainer/portainer-ce:latest`

**Create Container**:

- **Name**: `portainer`
- **Image**: `portainer/portainer-ce:latest`

**Port Settings**:
- Local Port: `9000` → Container Port: `9000`
- Local Port: `9443` → Container Port: `9443`

**Volume Settings**:
- `/docker/portainer` → `/data`
- **Important**: Also add Docker socket:
  - Type: **File**
  - File: `/var/run/docker.sock` → `/var/run/docker.sock`

**Auto-restart**: ✅ Enable

**✅ Verify**: Open `http://192.168.1.150:9000` in browser
- Create admin password on first login
- Select "Get Started" → Should see all 3 containers

---

## Step 9: Configure Mac Development Environment

### 9.1 Add NAS to /etc/hosts (Optional but Recommended)

```bash
sudo nano /etc/hosts
```

Add line:
```
192.168.1.150   nas.local
```

Save (Ctrl+X, Y, Enter)

Now you can use `nas.local` instead of IP address.

### 9.2 Update Project .env Files

**For JusticeHub** (`/Users/benknight/Code/JusticeHub/.env.local`):

Add these lines:
```bash
# Synology NAS Services
CHROMADB_URL=http://nas.local:8000
REDIS_URL=redis://nas.local:6379
```

**For All Projects** (optional caching):

Add to any project's `.env.local`:
```bash
REDIS_URL=redis://nas.local:6379
```

---

## Step 10: Test Connections from Mac

### Test ChromaDB
```bash
curl http://nas.local:8000/api/v1/heartbeat
```

Expected response:
```json
{"nanosecond heartbeat": 1734912000000000000}
```

### Test Redis
```bash
# Install redis-cli if needed:
brew install redis

# Test connection:
redis-cli -h nas.local ping
```

Expected response:
```
PONG
```

### Test Portainer GUI
Open browser: `http://nas.local:9000`

Should see container dashboard with 3 running containers.

---

## Step 11: Optimize for WiFi Performance

### Check WiFi Speed to NAS

```bash
# Install iperf3 if needed
brew install iperf3

# On Mac terminal:
# First, SSH into NAS and run: iperf3 -s
# Then on Mac:
iperf3 -c nas.local -t 10
```

**Expected speed over WiFi**:
- WiFi 5 (802.11ac): 200-400 Mbps
- WiFi 6 (802.11ax): 600-900 Mbps

If speed is lower than expected:
- Check NAS is on 5GHz WiFi (not 2.4GHz)
- Move NAS closer to router OR
- Consider Ethernet connection for best performance

### Reduce Network Latency

**Enable HTTP/2 in Synology** (faster concurrent requests):
1. Control Panel → Network → DSM Settings
2. ✅ Enable HTTP/2

**Use Connection Pooling** in your code:
```typescript
// lib/redis.ts
import Redis from 'ioredis';

const redis = new Redis({
  host: 'nas.local',
  port: 6379,
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  lazyConnect: true, // Connect on first use
});

export default redis;
```

---

## Step 12: Set Up Automated Backups

### Daily Container Data Backup Script

Container Manager → **Container** → Select `chromadb` → **Details** → **Terminal**

Create backup script:
```bash
#!/bin/bash
# Save as /volume1/docker/backups/backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/volume1/docker/backups"

# Backup ChromaDB data
tar -czf $BACKUP_DIR/chromadb_$DATE.tar.gz /volume1/docker/chromadb/

# Backup Redis data
tar -czf $BACKUP_DIR/redis_$DATE.tar.gz /volume1/docker/redis/

# Keep only last 7 days
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

**Schedule in DSM**:
1. Control Panel → Task Scheduler → Create → Scheduled Task → User-defined script
2. General:
   - Task: "Docker Backup"
   - User: root
3. Schedule: Daily, 2:00 AM
4. Task Settings → User-defined script:
   ```bash
   bash /volume1/docker/backups/backup.sh
   ```
5. Save

---

## Step 13: Monitor Resource Usage

### Portainer Dashboard
- Open `http://nas.local:9000`
- Go to **Containers** → See CPU/Memory usage
- Click container name → **Stats** for real-time graphs

### Synology Resource Monitor
- DSM → **Resource Monitor** (icon on left)
- Check:
  - CPU usage (should be <30% at idle)
  - Memory (containers use ~500MB total)
  - Network (should see traffic when Mac dev servers connect)

---

## WiFi-Specific Tips

### 1. Optimize WiFi Connection

**Mac WiFi Settings**:
- System Preferences → Network → WiFi → Advanced
- Remove other networks (so Mac always prefers your home network)
- Disable "Auto-join" for public networks

**Router Settings** (if accessible):
- Enable QoS (Quality of Service) for NAS MAC address (priority traffic)
- Disable WiFi power saving for NAS
- Use separate 5GHz band for NAS + Mac (avoid 2.4GHz congestion)

### 2. Connection Resilience

**Add retry logic** in your code:
```typescript
// lib/chromadb-client.ts
import { ChromaClient } from 'chromadb';

let client: ChromaClient | null = null;

export async function getChromaClient() {
  if (!client) {
    client = new ChromaClient({
      path: process.env.CHROMADB_URL,
    });
  }

  // Test connection with retry
  let retries = 3;
  while (retries > 0) {
    try {
      await client.heartbeat();
      return client;
    } catch (error) {
      retries--;
      if (retries === 0) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}
```

### 3. Fallback to Local (Optional)

If WiFi drops, fall back to localhost:
```typescript
// lib/config.ts
export const CHROMADB_URL =
  process.env.CHROMADB_URL || // Try NAS first
  'http://localhost:8000';    // Fallback to local container
```

---

## Troubleshooting

### "Can't connect to ChromaDB/Redis from Mac"

**Check firewall**:
```bash
# On Mac, test port is open:
nc -zv nas.local 8000  # ChromaDB
nc -zv nas.local 6379  # Redis
```

**If timeout**:
1. Synology → Control Panel → Security → Firewall
2. If enabled → Edit Rules → Create
3. Ports: `Custom` → `8000,6379,9000`
4. Source IP: Your Mac IP or `192.168.1.0/24` (whole network)
5. Action: Allow

### "Containers stop after NAS reboot"

**Check auto-restart**:
1. Container Manager → Container → Select container
2. Details → Settings → **Auto-restart** should be ✅ Enabled

### "Slow performance over WiFi"

**Check WiFi band**:
```bash
# On Mac:
/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I | grep channel
```

If channel is 1-11 (2.4GHz), switch to 5GHz:
- DSM → Control Panel → Network → Wireless → WiFi → Edit
- Select 5GHz network

**Measure latency**:
```bash
ping -c 10 nas.local
```

Should average <5ms. If >20ms, investigate WiFi issues.

---

## Quick Reference

### Container URLs
- **ChromaDB**: `http://nas.local:8000`
- **Redis**: `redis://nas.local:6379`
- **Portainer**: `http://nas.local:9000`
- **DSM Admin**: `http://nas.local:5000`

### Useful Commands

**Check container status**:
```bash
# Via Portainer: http://nas.local:9000

# Or via Container Manager:
# DSM → Container Manager → Container tab
```

**Restart container**:
- Portainer → Containers → Select → **Restart** button
- Or Container Manager → Select → **Action** → **Restart**

**View logs**:
- Portainer → Containers → Select → **Logs** button
- Or Container Manager → Select → **Details** → **Log** tab

**Test from Mac**:
```bash
# ChromaDB
curl http://nas.local:8000/api/v1/heartbeat

# Redis
redis-cli -h nas.local ping

# Port scan
nmap -p 8000,6379,9000 nas.local
```

---

## Next Steps After Setup

### 1. Update JusticeHub to Use ChromaDB

Edit `/Users/benknight/Code/JusticeHub/src/lib/chromadb.ts` (if exists):
```typescript
import { ChromaClient } from 'chromadb';

const client = new ChromaClient({
  path: process.env.CHROMADB_URL || 'http://nas.local:8000',
});

export default client;
```

Update `.env.local`:
```bash
CHROMADB_URL=http://nas.local:8000
```

### 2. Add Redis Caching to All Projects

Example for registry sync caching:
```typescript
// lib/registry-cache.ts
import redis from '@/lib/redis';

export async function getCachedRegistry(name: string) {
  const cached = await redis.get(`registry:${name}`);
  if (cached) return JSON.parse(cached);

  // Fetch from API
  const data = await fetchRegistry(name);

  // Cache for 5 minutes
  await redis.setex(`registry:${name}`, 300, JSON.stringify(data));

  return data;
}
```

### 3. Monitor Performance

**First 24 hours**:
- Check Portainer → Stats for memory/CPU usage
- Check DSM Resource Monitor for overall NAS load
- Test dev servers still work smoothly

**After 1 week**:
- Review backup files in `/docker/backups`
- Check container logs for any errors
- Measure WiFi speed again to ensure stability

---

## Success Checklist

- [ ] Found NAS IP address
- [ ] Reserved static IP for NAS
- [ ] Installed Container Manager
- [ ] Created `/docker` folders
- [ ] Deployed ChromaDB container (running)
- [ ] Deployed Redis container (running)
- [ ] Deployed Portainer container (running)
- [ ] Added `nas.local` to Mac `/etc/hosts`
- [ ] Updated JusticeHub `.env.local` with NAS URLs
- [ ] Tested ChromaDB connection from Mac
- [ ] Tested Redis connection from Mac
- [ ] Portainer GUI accessible at `http://nas.local:9000`
- [ ] Set up automated backups
- [ ] Verified WiFi performance (200+ Mbps)

---

## What You Achieved

### Before
- Mac running Docker containers (battery drain)
- Containers stop when Mac sleeps
- No persistence across reboots
- Heavy CPU/memory usage

### After
- ✅ NAS runs containers 24/7 (5-10W power)
- ✅ Mac battery life extended 2-3x
- ✅ Services always available (survive Mac sleep/shutdown)
- ✅ Data persists on NAS RAID (safe from Mac issues)
- ✅ Mac only runs lightweight dev servers
- ✅ Easy container management via Portainer GUI
- ✅ Automated daily backups

**Over WiFi**: Expect <5ms latency, 200-900 Mbps throughput (depending on WiFi generation)

---

**Start with Step 1** and let me know:
1. Your NAS IP address
2. Your Synology model (e.g., DS220+, DS920+)
3. WiFi generation (WiFi 5 / WiFi 6)

I'll help troubleshoot any issues along the way! 🚀
