#!/bin/bash
# backup-env.sh - Backup .env-vault directory to secure location
# Usage: ./scripts/backup-env.sh [destination]
#   Default destination: ~/Documents/ACT-env-backup-YYYY-MM-DD.tar.gz.enc

set -e  # Exit on error

VAULT_DIR="/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio/.env-vault"
DATE=$(date +%Y-%m-%d)
DEFAULT_DEST="$HOME/Documents/ACT-env-backup-$DATE.tar.gz.enc"
DEST=${1:-$DEFAULT_DEST}

echo "🔐 ACT Environment Vault Backup"
echo ""

# Check if vault directory exists
if [ ! -d "$VAULT_DIR" ]; then
  echo "❌ Vault directory not found: $VAULT_DIR"
  exit 1
fi

# Check if there are any files to backup
if [ -z "$(ls -A $VAULT_DIR)" ]; then
  echo "⚠️  Vault directory is empty, nothing to backup"
  exit 0
fi

echo "📦 Creating encrypted backup..."
echo "   Source: $VAULT_DIR"
echo "   Destination: $DEST"
echo ""

# Create encrypted tar archive
# Note: This uses openssl encryption. You'll be prompted for a password.
tar -czf - -C "$VAULT_DIR" . | openssl enc -aes-256-cbc -salt -pbkdf2 -out "$DEST"

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Backup created successfully!"
  echo "   File: $DEST"
  echo "   Size: $(du -h "$DEST" | cut -f1)"
  echo ""
  echo "🔒 IMPORTANT: Remember the password you used for encryption!"
  echo ""
  echo "To restore:"
  echo "   openssl enc -aes-256-cbc -d -pbkdf2 -in \"$DEST\" | tar -xzf - -C \"$VAULT_DIR\""
else
  echo ""
  echo "❌ Backup failed"
  exit 1
fi

# Optional: Upload to cloud storage (uncomment and configure as needed)
# echo ""
# echo "📤 Would you like to upload to 1Password or cloud storage?"
# echo "   (This step is manual - copy $DEST to your secure location)"
