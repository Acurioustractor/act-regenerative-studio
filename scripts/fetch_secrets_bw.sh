#!/bin/bash

# This script fetches Supabase credentials from the "ACT Knowledge Hub" item in Bitwarden
# and appends them to .env.local.
# Requirement: You must be logged in ('bw login') and ideally unlocked.

echo "🔍 Fetching 'ACT Knowledge Hub' from Bitwarden..."

# Try to get the item. If it fails, it usually means the vault is locked.
ITEM_JSON=$(bw get item "ACT Knowledge Hub" 2>/dev/null)

if [ -z "$ITEM_JSON" ]; then
    echo "❌ Could not fetch item. Your vault might be locked."
    echo "👉 Run this command to unlock and try again:"
    echo '   export BW_SESSION=$(bw unlock --raw)'
    exit 1
fi

echo "✅ Item found. Extracting keys..."

# Extract fields and append to .env.local
echo "$ITEM_JSON" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    # Fields can be in 'fields' list
    fields = {f['name']: f['value'] for f in data.get('fields', [])}
    
    # Also check login username/password/uris if mapped there, but usually custom fields
    # Output in .env format
    if 'SUPABASE_SERVICE_ROLE_KEY' in fields:
        print(f\"SUPABASE_SERVICE_ROLE_KEY={fields['SUPABASE_SERVICE_ROLE_KEY']}\")
    if 'SUPABASE_URL' in fields:
        print(f\"SUPABASE_URL={fields['SUPABASE_URL']}\")
        # Extract project ID from URL for DATABASE_URL construction
        try:
            import re
            match = re.search(r'https://([^.]+)\.supabase\.co', fields['SUPABASE_URL'])
            if match and 'SUPABASE_DB_PASSWORD' in fields:
                project_id = match.group(1)
                password = fields['SUPABASE_DB_PASSWORD']
                # Escape password just in case? Usually not needed for simple print but good hygiene
                # Construct standard Supabase connection string
                print(f\"DATABASE_URL=postgresql://postgres:{password}@db.{project_id}.supabase.co:5432/postgres\")
        except:
            pass
            
    if 'SUPABASE_DB_PASSWORD' in fields:
        print(f\"SUPABASE_DB_PASSWORD={fields['SUPABASE_DB_PASSWORD']}\")
    
except Exception as e:
    print(f\"Error parsing JSON: {e}\", file=sys.stderr)
" >> .env.local

echo "✅ Credentials appended to .env.local"
