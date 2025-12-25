#!/usr/bin/env node
/**
 * Visual demonstration of Redis caching performance
 * Shows before/after comparison
 */

import Redis from 'ioredis';

const redis = new Redis('redis://192.168.0.34:6379', {
  maxRetriesPerRequest: 3,
  lazyConnect: true,
});

// Simulated expensive API calls (like registry fetches)
const MOCK_REGISTRIES = [
  { name: 'Empathy Ledger', delay: 800 },
  { name: 'JusticeHub', delay: 600 },
  { name: 'Goods on Country', delay: 400 },
  { name: 'The Harvest', delay: 700 },
  { name: 'ACT Farm', delay: 500 },
];

async function simulateAPIFetch(registry) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: registry.name,
        items: Math.floor(Math.random() * 100) + 10,
        timestamp: new Date().toISOString(),
      });
    }, registry.delay);
  });
}

async function fetchWithoutCache() {
  const results = [];
  const startTime = Date.now();

  for (const registry of MOCK_REGISTRIES) {
    const result = await simulateAPIFetch(registry);
    results.push(result);
  }

  return {
    results,
    duration: Date.now() - startTime,
  };
}

async function fetchWithCache() {
  const results = [];
  const startTime = Date.now();

  for (const registry of MOCK_REGISTRIES) {
    const cacheKey = `demo:${registry.name.toLowerCase().replace(/\s+/g, '-')}`;

    // Check cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      results.push(JSON.parse(cached));
      continue;
    }

    // Cache miss - fetch and store
    const result = await simulateAPIFetch(registry);
    await redis.setex(cacheKey, 300, JSON.stringify(result));
    results.push(result);
  }

  return {
    results,
    duration: Date.now() - startTime,
  };
}

async function runDemo() {
  console.log('🎬 Redis Cache Performance Demo\n');
  console.log('═══════════════════════════════════════════════════════\n');

  await redis.connect();

  // Clear any existing demo cache
  const keys = await redis.keys('demo:*');
  if (keys.length > 0) {
    await redis.del(...keys);
  }

  // Scenario 1: Without cache (baseline)
  console.log('📊 SCENARIO 1: Without Redis Cache (Traditional Approach)');
  console.log('─────────────────────────────────────────────────────────');

  const without = await fetchWithoutCache();

  console.log('Fetching from 5 external APIs...');
  MOCK_REGISTRIES.forEach((reg, i) => {
    console.log(`  ${i + 1}. ${reg.name.padEnd(20)} ⏱️  ${reg.delay}ms`);
  });
  console.log(`\n⏱️  Total Time: ${without.duration}ms`);
  console.log(`📦 Items Fetched: ${without.results.reduce((sum, r) => sum + r.items, 0)}`);
  console.log('\n');

  // Scenario 2: First load with cache (cold cache)
  console.log('📊 SCENARIO 2: First Load with Redis Cache (Cache MISS)');
  console.log('─────────────────────────────────────────────────────────');

  const firstLoad = await fetchWithCache();

  console.log('Fetching from 5 APIs + caching in Redis...');
  MOCK_REGISTRIES.forEach((reg, i) => {
    console.log(`  ${i + 1}. ${reg.name.padEnd(20)} ❌ Cache MISS → Fetching...`);
  });
  console.log(`\n⏱️  Total Time: ${firstLoad.duration}ms (same as without cache)`);
  console.log(`📦 Items Cached: ${firstLoad.results.reduce((sum, r) => sum + r.items, 0)}`);
  console.log('✅ Data now cached in Redis for 5 minutes');
  console.log('\n');

  // Small delay to simulate user refreshing
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Scenario 3: Subsequent loads (warm cache)
  console.log('📊 SCENARIO 3: Page Refresh with Redis Cache (Cache HIT)');
  console.log('─────────────────────────────────────────────────────────');

  const secondLoad = await fetchWithCache();

  console.log('Fetching from Redis cache (instant!)...');
  MOCK_REGISTRIES.forEach((reg, i) => {
    console.log(`  ${i + 1}. ${reg.name.padEnd(20)} ✅ Cache HIT → <1ms`);
  });
  console.log(`\n⏱️  Total Time: ${secondLoad.duration}ms`);
  console.log(`📦 Items Retrieved: ${secondLoad.results.reduce((sum, r) => sum + r.items, 0)}`);
  console.log('\n');

  // Performance comparison
  console.log('═══════════════════════════════════════════════════════\n');
  console.log('🚀 PERFORMANCE COMPARISON\n');
  console.log(`Without Cache:     ${without.duration}ms`);
  console.log(`With Cache (1st):  ${firstLoad.duration}ms (same - cache warming)`);
  console.log(`With Cache (2nd):  ${secondLoad.duration}ms ⚡ INSTANT!\n`);

  const improvement = ((without.duration - secondLoad.duration) / without.duration * 100).toFixed(1);
  const speedup = (without.duration / secondLoad.duration).toFixed(1);

  console.log(`📈 Performance Gain: ${improvement}% faster`);
  console.log(`⚡ Speedup Factor:   ${speedup}x faster\n`);

  // Visual representation
  console.log('📊 Visual Timeline:\n');

  const maxWidth = 50;
  const scale = maxWidth / Math.max(without.duration, firstLoad.duration);

  const withoutBar = '█'.repeat(Math.ceil(without.duration * scale));
  const secondBar = '█'.repeat(Math.ceil(secondLoad.duration * scale));

  console.log(`Without Cache: ${withoutBar} ${without.duration}ms`);
  console.log(`With Cache:    ${secondBar} ${secondLoad.duration}ms\n`);

  // Real-world impact
  console.log('═══════════════════════════════════════════════════════\n');
  console.log('🌟 REAL-WORLD IMPACT\n');
  console.log('Dashboard Load Time:');
  console.log(`  Before: ${without.duration}ms (${(without.duration/1000).toFixed(1)}s) - Every. Single. Time.`);
  console.log(`  After:  ${secondLoad.duration}ms (0.0${Math.ceil(secondLoad.duration/10)}s) - On refresh within 5 min\n`);

  console.log('User Experience:');
  console.log(`  Before: ⏳ Wait ${(without.duration/1000).toFixed(1)}s for data to load`);
  console.log(`  After:  ⚡ Data appears instantly (<0.1s)\n`);

  console.log('Server Load:');
  console.log(`  Before: 🔥 5 API calls every dashboard view`);
  console.log(`  After:  ✅ 5 API calls once every 5 minutes\n`);

  console.log('API Rate Limits:');
  console.log(`  Before: 5 calls/view × 100 views = 500 API calls`);
  console.log(`  After:  5 calls/5min × 12 periods = 60 API calls (92% reduction)\n`);

  // Cleanup
  const demoKeys = await redis.keys('demo:*');
  if (demoKeys.length > 0) {
    await redis.del(...demoKeys);
  }

  await redis.quit();

  console.log('═══════════════════════════════════════════════════════\n');
  console.log('✅ Demo complete! This is what happens in your dashboard.');
  console.log('\n💡 Try it yourself:');
  console.log('   1. npm run dev');
  console.log('   2. Open http://localhost:3000/admin/dashboard');
  console.log('   3. Click "Sync Now" (cache miss)');
  console.log('   4. Refresh page (cache hit)');
  console.log('   5. Watch server logs for cache messages!\n');
}

runDemo().catch(console.error);
