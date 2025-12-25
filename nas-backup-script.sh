#!/bin/bash
# Daily backup script for Synology NAS Docker containers
# Install this on your NAS at: /volume1/docker/backups/backup.sh
#
# To deploy:
# 1. Copy this file to NAS:
#    scp nas-backup-script.sh admin@192.168.0.34:/volume1/docker/backups/backup.sh
# 2. SSH into NAS: ssh admin@192.168.0.34
# 3. Make executable: chmod +x /volume1/docker/backups/backup.sh
# 4. Test run: bash /volume1/docker/backups/backup.sh
# 5. Schedule in DSM: Control Panel → Task Scheduler → Create → User-defined script

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/volume1/docker/backups"
LOG_FILE="$BACKUP_DIR/backup.log"

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "=========================================="
log "Starting Docker container backup"
log "=========================================="

# Backup ChromaDB data
log "Backing up ChromaDB data..."
if [ -d "/volume1/docker/chromadb" ]; then
    tar -czf "$BACKUP_DIR/chromadb_$DATE.tar.gz" -C /volume1/docker chromadb/
    CHROMA_SIZE=$(du -sh "$BACKUP_DIR/chromadb_$DATE.tar.gz" | cut -f1)
    log "✅ ChromaDB backup complete: $CHROMA_SIZE"
else
    log "⚠️  ChromaDB directory not found, skipping"
fi

# Backup Redis data
log "Backing up Redis data..."
if [ -d "/volume1/docker/redis" ]; then
    # Trigger Redis save before backup
    docker exec redis redis-cli SAVE 2>/dev/null || log "⚠️  Could not trigger Redis SAVE (container may be stopped)"

    tar -czf "$BACKUP_DIR/redis_$DATE.tar.gz" -C /volume1/docker redis/
    REDIS_SIZE=$(du -sh "$BACKUP_DIR/redis_$DATE.tar.gz" | cut -f1)
    log "✅ Redis backup complete: $REDIS_SIZE"
else
    log "⚠️  Redis directory not found, skipping"
fi

# Backup Portainer data
log "Backing up Portainer data..."
if [ -d "/volume1/docker/portainer" ]; then
    tar -czf "$BACKUP_DIR/portainer_$DATE.tar.gz" -C /volume1/docker portainer/
    PORTAINER_SIZE=$(du -sh "$BACKUP_DIR/portainer_$DATE.tar.gz" | cut -f1)
    log "✅ Portainer backup complete: $PORTAINER_SIZE"
else
    log "⚠️  Portainer directory not found, skipping"
fi

# Keep only last 30 days of backups
log "Cleaning up old backups (keeping last 30 days)..."
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +30 -delete
REMAINING=$(find "$BACKUP_DIR" -name "*.tar.gz" | wc -l)
log "✅ Cleanup complete. Remaining backups: $REMAINING"

# Calculate total backup size
TOTAL_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)
log "📊 Total backup directory size: $TOTAL_SIZE"

log "=========================================="
log "Backup completed successfully"
log "=========================================="
