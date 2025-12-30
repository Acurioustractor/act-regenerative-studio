#!/usr/bin/env node
/**
 * ACT Knowledge Query CLI
 *
 * Query the comprehensive ACT knowledge base via command line.
 * Uses the unified RAG service to provide intelligent answers with sources.
 *
 * Usage:
 *   npm run ask "What's the LCAA methodology?"
 *   npm run ask "How do I create an invoice?" --tier=fast
 *   npm run ask "What's our profit-sharing policy?" --sources
 *
 * Options:
 *   --tier=fast    Use quick tier for faster, cheaper responses
 *   --tier=deep    Use deep tier for comprehensive answers (default)
 *   --sources      Show source documents and confidence scores
 *   --port=3000    Specify the port where Next.js dev server is running (default: 3000)
 */

import fetch from 'node:fetch';

const args = process.argv.slice(2);
const query = args.find(arg => !arg.startsWith('--'));
const tier = args.find(arg => arg.startsWith('--tier='))?.split('=')[1] || 'deep';
const showSources = args.includes('--sources');
const port = args.find(arg => arg.startsWith('--port='))?.split('=')[1] || '3000';

if (!query) {
  console.log(`
ACT Knowledge Query CLI

Prerequisites:
  The Next.js dev server must be running:
  - In a separate terminal: cd /Users/benknight/Code/act-regenerative-studio && npm run dev

Usage:
  npm run ask "your question here"
  npm run ask "your question" --tier=fast
  npm run ask "your question" --sources

Options:
  --tier=fast    Quick responses (cheaper, faster)
  --tier=deep    Comprehensive answers (default)
  --sources      Show source documents
  --port=3000    Specify dev server port (default: 3000)

Examples:
  npm run ask "What's the LCAA methodology?"
  npm run ask "How do I invoice NDIS clients?"
  npm run ask "What's our 40% profit-sharing policy?"
  npm run ask "Grant application template" --sources
  `);
  process.exit(1);
}

console.log(`\n🔍 Asking ACT: "${query}"\n`);
console.log(`⚙️  Tier: ${tier}\n`);

try {
  // Call the API endpoint
  const apiUrl = `http://localhost:${port}/api/v1/intelligence/ask`;

  const fetchResponse = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      tier,
      topK: 10,
      minSimilarity: 0.7
    })
  });

  if (!fetchResponse.ok) {
    const error = await fetchResponse.json();
    throw new Error(error.details || error.error || 'API request failed');
  }

  const response = await fetchResponse.json();

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📝 Answer:\n');
  console.log(response.answer);
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (showSources && response.sources?.length > 0) {
    console.log('\n📚 Sources:\n');
    response.sources.forEach((s, i) => {
      console.log(`${i + 1}. ${s.title || 'Untitled'}`);
      console.log(`   Project: ${s.sourceProject || 'Unknown'}`);
      console.log(`   Confidence: ${((s.confidence || 0) * 100).toFixed(1)}%`);
      if (s.excerpt) {
        console.log(`   Excerpt: ${s.excerpt.slice(0, 100)}...`);
      }
      console.log('');
    });
  }

  console.log(`\n💰 Cost: $${response.cost?.total?.toFixed(4) || '0.0000'}`);
  console.log(`⏱️  Time: ${response.latencyMs?.total || 0}ms\n`);

} catch (error) {
  console.error('\n❌ Error querying ACT knowledge:\n');
  console.error(error.message);

  if (error.message.includes('fetch') || error.message.includes('ECONNREFUSED')) {
    console.error('\n💡 Tip: Make sure the Next.js dev server is running:');
    console.error(`   cd /Users/benknight/Code/act-regenerative-studio`);
    console.error(`   npm run dev`);
    console.error(`\n   Then run this command again.\n`);
  }

  process.exit(1);
}
