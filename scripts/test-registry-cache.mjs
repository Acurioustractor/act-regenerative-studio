#!/usr/bin/env node
/**
 * Test registry sync with Redis caching
 * This simulates what happens when the dashboard loads
 */

import { createServer } from 'http';

console.log('🧪 Testing registry sync with Redis caching...\n');
console.log('This test will:');
console.log('  1. Start dev server');
console.log('  2. Call /api/registry/status twice');
console.log('  3. First call should MISS cache and fetch from APIs');
console.log('  4. Second call should HIT cache (faster)');
console.log('  5. Compare response times\n');
console.log('Starting test server on http://localhost:3000...\n');

// Start Next.js dev server
import { spawn } from 'child_process';

const server = spawn('npm', ['run', 'dev'], {
  cwd: '/Users/benknight/Code/ACT Farm and Regenerative Innovation Studio',
  stdio: 'pipe'
});

let serverReady = false;

// Wait for server to be ready
server.stdout.on('data', (data) => {
  const output = data.toString();
  if (output.includes('localhost:3000')) {
    serverReady = true;
    console.log('✅ Server ready!\n');
    runTests();
  }
});

server.stderr.on('data', (data) => {
  // Suppress verbose output
});

async function runTests() {
  await new Promise(resolve => setTimeout(resolve, 2000));

  try {
    console.log('Test 1: First registry status call (cache MISS expected)');
    const start1 = Date.now();
    const response1 = await fetch('http://localhost:3000/api/registry/status');
    const data1 = await response1.json();
    const duration1 = Date.now() - start1;
    console.log(`  ⏱️  Duration: ${duration1}ms`);
    console.log(`  📊 Registries synced: ${data1.results?.length || 0}`);

    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('\nTest 2: Second registry status call (cache HIT expected)');
    const start2 = Date.now();
    const response2 = await fetch('http://localhost:3000/api/registry/status');
    const data2 = await response2.json();
    const duration2 = Date.now() - start2;
    console.log(`  ⏱️  Duration: ${duration2}ms`);
    console.log(`  📊 Registries synced: ${data2.results?.length || 0}`);

    console.log('\n📈 Performance Improvement:');
    const improvement = ((duration1 - duration2) / duration1 * 100).toFixed(1);
    console.log(`  First call:  ${duration1}ms`);
    console.log(`  Second call: ${duration2}ms`);
    console.log(`  Speedup:     ${improvement}% faster`);

    if (duration2 < duration1) {
      console.log('\n✅ Cache is working! Second call was faster.');
    } else {
      console.log('\n⚠️  Cache might not be working as expected.');
    }

    console.log('\n💡 Check server logs above for:');
    console.log('   "❌ Cache MISS: registry:..." (first call)');
    console.log('   "✅ Cache HIT: registry:..." (second call)');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  } finally {
    console.log('\n🛑 Stopping test server...');
    server.kill();
    process.exit(0);
  }
}

// Timeout if server doesn't start
setTimeout(() => {
  if (!serverReady) {
    console.error('❌ Server failed to start within 30 seconds');
    server.kill();
    process.exit(1);
  }
}, 30000);
