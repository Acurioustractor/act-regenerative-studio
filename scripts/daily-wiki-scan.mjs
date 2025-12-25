#!/usr/bin/env node

/**
 * ACT Living Wiki - Daily Scanner
 *
 * Runs daily to:
 * 1. Scan Notion for new/updated pages
 * 2. Extract knowledge with AI
 * 3. Queue high-confidence items for review
 *
 * Usage:
 *   node scripts/daily-wiki-scan.mjs
 *
 * Cron schedule (daily at 2am):
 *   0 2 * * * cd /path/to/project && node scripts/daily-wiki-scan.mjs >> logs/wiki-scan.log 2>&1
 */

import fetch from 'node-fetch';
import { promises as fs } from 'fs';
import path from 'path';

const API_BASE = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3999';
const LOG_DIR = path.join(process.cwd(), 'logs', 'wiki-scans');

console.log('🚀 Starting ACT Living Wiki daily scan...');
console.log(`📅 ${new Date().toISOString()}`);

async function main() {
  const results = {
    timestamp: new Date().toISOString(),
    success: false,
    scanned: 0,
    extracted: 0,
    errors: [],
  };

  try {
    // Ensure log directory exists
    await fs.mkdir(LOG_DIR, { recursive: true });

    // Step 1: Scan Notion
    console.log('\n📚 Step 1: Scanning Notion workspace...');
    const scanResponse = await fetch(`${API_BASE}/api/knowledge/scan-notion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const scanResult = await scanResponse.json();

    if (!scanResult.success) {
      throw new Error(`Notion scan failed: ${scanResult.error}`);
    }

    results.scanned = scanResult.scanned;
    console.log(`✅ Found ${scanResult.scanned} knowledge items`);

    if (scanResult.scanned === 0) {
      console.log('ℹ️  No new knowledge found. Scan complete.');
      results.success = true;
      await saveLog(results);
      return;
    }

    // Step 2: Get pending queue items
    console.log('\n🤖 Step 2: Running AI extractions...');
    const queueResponse = await fetch(`${API_BASE}/api/knowledge/extract`);
    const queueData = await queueResponse.json();

    if (queueData.pendingCount === 0) {
      console.log('ℹ️  No items to extract.');
      results.success = true;
      await saveLog(results);
      return;
    }

    // Step 3: Extract knowledge with AI
    let extractedCount = 0;
    for (const item of queueData.pendingItems.slice(0, 10)) {
      // Limit to 10 per run
      try {
        console.log(`\n  Processing: ${item.title}...`);

        const extractResponse = await fetch(`${API_BASE}/api/knowledge/extract`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            queueId: item.id,
            sourceTitle: item.title,
            content: item.content,
          }),
        });

        const extractResult = await extractResponse.json();

        if (extractResult.success) {
          extractedCount++;
          console.log(`  ✅ Extracted (${extractResult.extraction.confidence} confidence)`);
        } else {
          console.log(`  ⚠️  Failed: ${extractResult.error}`);
          results.errors.push(`${item.title}: ${extractResult.error}`);
        }

        // Rate limiting: wait 2 seconds between extractions
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`  ❌ Error: ${error.message}`);
        results.errors.push(`${item.title}: ${error.message}`);
      }
    }

    results.extracted = extractedCount;
    results.success = true;

    console.log(`\n✅ Daily scan complete!`);
    console.log(`   Scanned: ${results.scanned}`);
    console.log(`   Extracted: ${results.extracted}`);
    console.log(`   Errors: ${results.errors.length}`);

    // Save results
    await saveLog(results);
  } catch (error) {
    console.error('\n❌ Daily scan failed:', error);
    results.errors.push(error.message);
    await saveLog(results);
    process.exit(1);
  }
}

async function saveLog(results) {
  const date = new Date().toISOString().split('T')[0];
  const logFile = path.join(LOG_DIR, `scan-${date}.json`);

  await fs.writeFile(logFile, JSON.stringify(results, null, 2));
  console.log(`\n📝 Log saved to: ${logFile}`);
}

main();
