#!/bin/bash

# Load environment variables from .env.local
set -a
source .env.local
set +a

# Run the table creation script (FULLY AUTOMATED!)
node scripts/create-table-automated.mjs
