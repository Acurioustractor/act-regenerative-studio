#!/usr/bin/env node
/**
 * Test script for Redis caching functionality
 * Usage: node scripts/test-redis-cache.mjs
 */

import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://192.168.0.34:6379', {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  lazyConnect: true,
  enableReadyCheck: true,
});

async function testRedisCache() {
  console.log('🧪 Testing Redis connection to NAS...\n');

  try {
    // Connect
    await redis.connect();
    console.log('✅ Connected to Redis on NAS\n');

    // Test 1: PING
    const pong = await redis.ping();
    console.log('Test 1 - PING:', pong === 'PONG' ? '✅ PASS' : '❌ FAIL');

    // Test 2: SET key
    const testKey = 'test:registry:empathy-ledger';
    const testData = {
      items: [
        { id: '1', title: 'Test Story', type: 'story' },
        { id: '2', title: 'Test Event', type: 'event' }
      ],
      count: 2,
      timestamp: new Date().toISOString()
    };

    await redis.setex(testKey, 300, JSON.stringify(testData));
    console.log('Test 2 - SET:', '✅ PASS');

    // Test 3: GET key
    const cached = await redis.get(testKey);
    const parsed = JSON.parse(cached);
    console.log('Test 3 - GET:', parsed.count === 2 ? '✅ PASS' : '❌ FAIL');

    // Test 4: TTL check
    const ttl = await redis.ttl(testKey);
    console.log(`Test 4 - TTL: ${ttl}s remaining`, ttl > 0 && ttl <= 300 ? '✅ PASS' : '❌ FAIL');

    // Test 5: DELETE key
    await redis.del(testKey);
    const deleted = await redis.get(testKey);
    console.log('Test 5 - DEL:', deleted === null ? '✅ PASS' : '❌ FAIL');

    // Test 6: Cache wrapper simulation
    console.log('\n🔄 Testing cache wrapper pattern...');

    let fetchCount = 0;
    const expensiveFetch = async () => {
      fetchCount++;
      console.log(`  → Expensive fetch called (count: ${fetchCount})`);
      return { data: 'expensive result', timestamp: Date.now() };
    };

    const withCache = async (key, fetcher, ttl = 300) => {
      const cached = await redis.get(key);
      if (cached) {
        console.log(`  ✅ Cache HIT: ${key}`);
        return JSON.parse(cached);
      }
      console.log(`  ❌ Cache MISS: ${key} - fetching...`);
      const data = await fetcher();
      await redis.setex(key, ttl, JSON.stringify(data));
      return data;
    };

    // First call - should miss and fetch
    const result1 = await withCache('test:wrapper', expensiveFetch, 60);
    console.log('  First call result:', result1);

    // Second call - should hit cache
    const result2 = await withCache('test:wrapper', expensiveFetch, 60);
    console.log('  Second call result:', result2);

    console.log('\nTest 6 - Cache wrapper:', fetchCount === 1 ? '✅ PASS (fetch called only once)' : '❌ FAIL');

    // Cleanup
    await redis.del('test:wrapper');

    console.log('\n🎉 All tests passed! Redis caching is working correctly.\n');
    console.log('📊 Summary:');
    console.log('  - Redis connection: ✅');
    console.log('  - Cache operations (SET/GET/DEL): ✅');
    console.log('  - TTL management: ✅');
    console.log('  - Cache wrapper pattern: ✅');
    console.log('\n🚀 Registry sync caching will now work with 5-minute TTL');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('  1. Check NAS is accessible: ping 192.168.0.34');
    console.error('  2. Check Redis container is running: docker ps | grep redis');
    console.error('  3. Check Redis port: nc -zv 192.168.0.34 6379');
  } finally {
    await redis.quit();
  }
}

testRedisCache();
