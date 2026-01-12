
import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load envs
dotenv.config({ path: '.env.local' });

async function applyMigration() {
    console.log("🚀 Applying ALMA Schema Migration...");

    if (!process.env.DATABASE_URL) {
        console.error("❌ DATABASE_URL is missing. Please run ./scripts/fetch_secrets_bw.sh first.");
        process.exit(1);
    }

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false } // Required for Supabase in some envs
    });

    try {
        await client.connect();

        const migrationPath = path.join(process.cwd(), 'supabase/migrations/20260109000000_alma_core_entities.sql');
        const sql = fs.readFileSync(migrationPath, 'utf8');

        console.log(`📜 Executing SQL from ${migrationPath}...`);
        await client.query(sql);

        console.log("✅ Schema applied successfully!");
    } catch (err) {
        console.error("❌ Migration failed:", err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

applyMigration();
