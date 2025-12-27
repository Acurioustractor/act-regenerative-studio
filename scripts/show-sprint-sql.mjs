#!/usr/bin/env node

/**
 * Display the SQL for creating sprint_snapshots table
 * This can be copied to Supabase dashboard SQL editor
 */

import { readFileSync } from 'fs';

const migrationSQL = readFileSync('supabase/migrations/20251227010000_sprint_snapshots.sql', 'utf8');

console.log('╔════════════════════════════════════════════════════════════════════════╗');
console.log('║  SPRINT SNAPSHOTS TABLE SQL                                            ║');
console.log('║  Copy this SQL to Supabase dashboard at:                               ║');
console.log('║  https://supabase.com/dashboard/project/tednluwflfhxyucgwigh/sql/new   ║');
console.log('╚════════════════════════════════════════════════════════════════════════╝');
console.log('');
console.log(migrationSQL);
console.log('');
console.log('After running this in Supabase dashboard, run: ./scripts/run-snapshot.sh');
console.log('');
