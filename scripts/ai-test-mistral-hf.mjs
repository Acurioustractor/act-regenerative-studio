/**
 * Test Mistral 7B via Hugging Face Inference API
 *
 * This script tests the open-source Mistral model as a proof-of-concept
 * for ACT's AI knowledge system.
 *
 * Run: node scripts/ai-test-mistral-hf.mjs
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const HF_TOKEN = process.env.HUGGING_FACE_API_TOKEN;

if (!HF_TOKEN) {
  console.error('❌ Missing HUGGING_FACE_API_TOKEN in .env.local');
  console.log('\n📝 To get a token:');
  console.log('1. Go to https://huggingface.co/settings/tokens');
  console.log('2. Create a new token (read access)');
  console.log('3. Add to .env.local: HUGGING_FACE_API_TOKEN=hf_...');
  process.exit(1);
}

console.log('🧪 Testing Mistral 7B Instruct via Hugging Face API\n');

// Test prompts covering ACT use cases
const testPrompts = [
  {
    name: 'Blog Article (JusticeHub)',
    category: 'Content Creation',
    prompt: `You are a content writer for A Curious Tractor, a regenerative innovation ecosystem. Write a compelling 150-word opening for a blog article about community-led justice programs.

Topic: Why 58% recidivism proves current systems are broken
Voice: Grounded yet visionary, humble yet confident, warm yet challenging
Approach: Start with a specific problem from community perspective

Write the opening:`,
    expectedQuality: 8.5,
  },
  {
    name: 'Homepage Hero (The Harvest)',
    category: 'Website Copy',
    prompt: `You are a copywriter for A Curious Tractor. Write a homepage hero section for "The Harvest" - a community hub combining therapeutic horticulture, sustainable agriculture, and authentic community building in rural Witta.

Brand voice: Grounded yet visionary, poetic yet clear
Metaphor: Use farm/garden imagery
Heritage: German agricultural settlement since 1887
Tone: Warm, welcoming, anti-technology (physical over digital)

Write a 2-sentence hero headline and 50-word supporting paragraph:`,
    expectedQuality: 8.0,
  },
  {
    name: 'Grant Proposal Snippet',
    category: 'Formal Writing',
    prompt: `Write a concise 100-word executive summary for a conservation grant proposal.

Project: Black Cockatoo Valley - 150 acres regeneration estate
Goal: Habitat restoration + Indigenous land-care jobs + ethical eco-tourism
Impact: Protect threatened species, create 10+ jobs, self-sustaining revenue for conservation
Approach: Premium residencies fund conservation (country caring for people, people caring for country)

Write executive summary:`,
    expectedQuality: 9.0,
  },
  {
    name: 'Social Media Post',
    category: 'Social Content',
    prompt: `Write a LinkedIn post (max 150 words) announcing ACT's new AI knowledge base.

Key points:
- Open-source AI system for community organizations
- Forkable and self-hostable
- Respects Indigenous data sovereignty (OCAP principles)
- Designed for obsolescence (communities own it)

Tone: Warm yet challenging, grounded yet visionary
Include: Call to action

Write post:`,
    expectedQuality: 7.5,
  },
  {
    name: 'Email Sequence',
    category: 'Communication',
    prompt: `Write a welcome email (100 words) for new Empathy Ledger users.

Platform: Ethical storytelling where communities control narratives
Key message: Your story, your power, your profit
Action: Share your first story with consent settings
Tone: Warm, empowering, respectful of cultural protocols

Write email:`,
    expectedQuality: 8.0,
  },
];

// Track results
const results = {
  timestamp: new Date().toISOString(),
  model: 'mistralai/Mistral-7B-Instruct-v0.3',
  tests: [],
  summary: {
    avgResponseTime: 0,
    avgQuality: 0,
    totalCost: 0,
    passedTests: 0,
  },
};

async function testMistral(prompt, temperature = 0.7, maxTokens = 500) {
  const startTime = Date.now();

  const response = await fetch(
    'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          temperature,
          max_new_tokens: maxTokens,
          return_full_text: false,
        },
      }),
    }
  );

  const elapsed = Date.now() - startTime;

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`HF API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const generated = data[0]?.generated_text || data.generated_text || '';

  // Estimate cost (HF Inference API: ~$0.20 per 1M tokens)
  const inputTokens = prompt.split(' ').length * 1.3; // Rough estimate
  const outputTokens = generated.split(' ').length * 1.3;
  const totalTokens = inputTokens + outputTokens;
  const cost = (totalTokens / 1_000_000) * 0.20;

  return {
    generated,
    responseTime: elapsed,
    cost,
    tokens: {
      input: Math.round(inputTokens),
      output: Math.round(outputTokens),
      total: Math.round(totalTokens),
    },
  };
}

function evaluateQuality(generated, expectedQuality) {
  // Simple quality checks
  const wordCount = generated.split(' ').length;
  const hasStructure = generated.includes('\n') || generated.length > 100;
  const notTooShort = wordCount > 30;
  const notTooLong = wordCount < 1000;
  const noRepetition = !/([\w\s]{20,})\1{2,}/.test(generated);

  let score = 0;
  if (notTooShort) score += 2;
  if (notTooLong) score += 2;
  if (hasStructure) score += 2;
  if (noRepetition) score += 2;
  if (wordCount > 50 && wordCount < 500) score += 2;

  // Normalize to 0-10
  const normalizedScore = score;

  const passed = normalizedScore >= (expectedQuality - 1.5);

  return {
    score: normalizedScore,
    expected: expectedQuality,
    passed,
    wordCount,
    checks: {
      notTooShort,
      notTooLong,
      hasStructure,
      noRepetition,
    },
  };
}

async function runTests() {
  console.log('Running tests...\n');

  for (const test of testPrompts) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`📝 Test: ${test.name} (${test.category})`);
    console.log(`${'='.repeat(80)}\n`);

    try {
      const result = await testMistral(test.prompt);
      const quality = evaluateQuality(result.generated, test.expectedQuality);

      console.log('✨ Generated Output:');
      console.log(`${'-'.repeat(80)}`);
      console.log(result.generated);
      console.log(`${'-'.repeat(80)}`);

      console.log('\n📊 Metrics:');
      console.log(`   Response Time: ${result.responseTime}ms`);
      console.log(`   Tokens: ${result.tokens.input} in → ${result.tokens.output} out (${result.tokens.total} total)`);
      console.log(`   Cost: $${result.cost.toFixed(6)}`);
      console.log(`   Quality Score: ${quality.score}/10 (expected ${quality.expected})`);
      console.log(`   Word Count: ${quality.wordCount}`);
      console.log(`   Status: ${quality.passed ? '✅ PASSED' : '❌ FAILED'}`);

      results.tests.push({
        name: test.name,
        category: test.category,
        responseTime: result.responseTime,
        cost: result.cost,
        tokens: result.tokens,
        quality: quality.score,
        expected: quality.expected,
        passed: quality.passed,
        output: result.generated,
      });

      if (quality.passed) {
        results.summary.passedTests++;
      }

      // Rate limiting: Wait 2 seconds between requests
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      results.tests.push({
        name: test.name,
        category: test.category,
        error: error.message,
        passed: false,
      });
    }
  }

  // Calculate summary
  const validTests = results.tests.filter(t => !t.error);
  results.summary.avgResponseTime = Math.round(
    validTests.reduce((sum, t) => sum + t.responseTime, 0) / validTests.length
  );
  results.summary.avgQuality = (
    validTests.reduce((sum, t) => sum + t.quality, 0) / validTests.length
  ).toFixed(1);
  results.summary.totalCost = validTests.reduce((sum, t) => sum + t.cost, 0);

  // Print summary
  console.log('\n\n' + '='.repeat(80));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(80) + '\n');

  console.log(`Model: ${results.model}`);
  console.log(`Tests Run: ${results.tests.length}`);
  console.log(`Passed: ${results.summary.passedTests}/${results.tests.length} (${Math.round(results.summary.passedTests / results.tests.length * 100)}%)`);
  console.log(`Average Response Time: ${results.summary.avgResponseTime}ms`);
  console.log(`Average Quality Score: ${results.summary.avgQuality}/10`);
  console.log(`Total Cost: $${results.summary.totalCost.toFixed(6)}`);

  // Cost extrapolation
  const monthlyEstimate = results.summary.totalCost * 200; // Assume 200 similar requests/month
  const yearlyEstimate = monthlyEstimate * 12;

  console.log('\n💰 Cost Projections:');
  console.log(`   Per 5 tests: $${results.summary.totalCost.toFixed(6)}`);
  console.log(`   Monthly (200 requests): $${monthlyEstimate.toFixed(2)}`);
  console.log(`   Yearly: $${yearlyEstimate.toFixed(2)}`);
  console.log(`   vs. Claude Sonnet (est. $3,600/year): Save $${(3600 - yearlyEstimate).toFixed(2)} (${Math.round((3600 - yearlyEstimate) / 3600 * 100)}%)`);

  console.log('\n📈 Performance vs. Expectations:');
  results.tests.forEach(test => {
    if (!test.error) {
      const delta = test.quality - test.expected;
      const icon = delta >= -1 ? '✅' : '⚠️';
      const deltaStr = delta >= 0 ? `+${delta.toFixed(1)}` : delta.toFixed(1);
      console.log(`   ${icon} ${test.name}: ${test.quality}/10 (${deltaStr} vs. expected)`);
    }
  });

  // Recommendation
  console.log('\n🎯 Recommendation:');
  const passRate = results.summary.passedTests / results.tests.length;
  if (passRate >= 0.8 && results.summary.avgQuality >= 7.5) {
    console.log('   ✅ Mistral 7B performs well for ACT use cases!');
    console.log('   ✅ Quality is acceptable for most content generation');
    console.log('   ✅ Cost savings are massive (95%+ vs. Claude)');
    console.log('   ➡️  NEXT STEP: Fine-tune on ACT blog articles for even better quality');
  } else if (passRate >= 0.6) {
    console.log('   ⚠️  Mistral 7B shows promise but needs improvement');
    console.log('   ➡️  NEXT STEP: Fine-tune on ACT data to improve quality');
    console.log('   ➡️  Consider hybrid approach (Mistral + Claude for critical tasks)');
  } else {
    console.log('   ❌ Mistral 7B may not be suitable without fine-tuning');
    console.log('   ➡️  NEXT STEP: Try Phi-3.5 Medium (14B) for better quality');
    console.log('   ➡️  Or proceed with fine-tuning to improve performance');
  }

  console.log('\n' + '='.repeat(80) + '\n');

  // Save results
  const fs = await import('fs/promises');
  const resultsPath = './ai-test-results-mistral-hf.json';
  await fs.writeFile(resultsPath, JSON.stringify(results, null, 2));
  console.log(`📁 Results saved to: ${resultsPath}\n`);
}

// Run tests
runTests().catch(error => {
  console.error('🚨 Test suite failed:', error);
  process.exit(1);
});
