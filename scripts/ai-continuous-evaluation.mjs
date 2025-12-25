/**
 * Continuous AI Model Evaluation System
 *
 * This script runs regular evaluations of different AI models to:
 * - Track quality over time
 * - Monitor costs
 * - Compare open-source vs. proprietary
 * - Make data-driven recommendations
 *
 * Run: node scripts/ai-continuous-evaluation.mjs
 * Schedule: Add to cron for weekly runs
 */

import * as dotenv from 'dotenv';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

console.log('🔄 ACT AI Continuous Evaluation System\n');
console.log('='.repeat(80) + '\n');

// Evaluation criteria based on ACT needs
const evaluationCriteria = {
  'brand-voice-consistency': {
    name: 'Brand Voice Consistency',
    weight: 0.25,
    description: 'Matches ACT voice (grounded yet visionary, humble yet confident)',
  },
  'cultural-safety': {
    name: 'Cultural Safety',
    weight: 0.20,
    description: 'Respects OCAP®, consent, Indigenous protocols',
  },
  'factual-accuracy': {
    name: 'Factual Accuracy',
    weight: 0.20,
    description: 'Correct facts about ACT projects, methodology, values',
  },
  'cost-efficiency': {
    name: 'Cost Efficiency',
    weight: 0.15,
    description: 'Low cost per quality unit',
  },
  'response-speed': {
    name: 'Response Speed',
    weight: 0.10,
    description: 'Fast generation for productivity',
  },
  'scalability': {
    name: 'Scalability',
    weight: 0.10,
    description: 'Can handle increased usage without degradation',
  },
};

// Test prompts for evaluation
const testPrompts = [
  {
    id: 'blog-justicehub-voice',
    category: 'brand-voice-consistency',
    prompt: `Write a 150-word blog opening about youth justice for JusticeHub. Use ACT's brand voice: grounded yet visionary, humble yet confident, warm yet challenging. Start with a specific problem from community perspective.`,
    expectedElements: ['community voice', 'specific problem', 'farm metaphor or grounded imagery', 'vision', 'humility'],
  },
  {
    id: 'cultural-protocol-check',
    category: 'cultural-safety',
    prompt: `A researcher asks to use Indigenous stories from Empathy Ledger for academic research without community consent. Write a 100-word response explaining why this violates OCAP® principles.`,
    expectedElements: ['OCAP explained', 'consent requirement', 'community ownership', 'respectful tone'],
  },
  {
    id: 'fact-check-lcaa',
    category: 'factual-accuracy',
    prompt: `Explain ACT's LCAA methodology in 100 words. What does each letter stand for?`,
    expectedElements: ['Listen', 'Curiosity', 'Action', 'Art', 'correct descriptions'],
  },
  {
    id: 'grant-proposal-snippet',
    category: 'brand-voice-consistency',
    prompt: `Write a 100-word executive summary for a conservation grant for Black Cockatoo Valley.`,
    expectedElements: ['conservation goals', 'Indigenous land care', 'revenue model', 'formal but authentic voice'],
  },
  {
    id: 'social-media-short',
    category: 'response-speed',
    prompt: `Write a 50-word LinkedIn post announcing ACT's new open-source AI knowledge base.`,
    expectedElements: ['open-source', 'community ownership', 'call to action'],
  },
];

// Models to evaluate
const modelsToEvaluate = [
  {
    id: 'mistral-7b-hf',
    name: 'Mistral 7B (Hugging Face)',
    endpoint: 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3',
    tokenRequired: 'HUGGING_FACE_API_TOKEN',
    type: 'open-source-managed',
  },
  // Add more models as they become available
  // {
  //   id: 'mistral-7b-ollama',
  //   name: 'Mistral 7B (Ollama/NAS)',
  //   endpoint: 'http://192.168.0.34:11434/api/generate',
  //   type: 'open-source-self-hosted',
  // },
  // {
  //   id: 'claude-haiku',
  //   name: 'Claude Haiku 3.5',
  //   endpoint: 'https://api.anthropic.com/v1/messages',
  //   tokenRequired: 'ANTHROPIC_API_KEY',
  //   type: 'proprietary',
  // },
];

// Evaluation history directory
const EVAL_DIR = './ai-evaluation-history';
const EVAL_FILE = path.join(EVAL_DIR, `eval-${new Date().toISOString().split('T')[0]}.json`);

// Create evaluation directory if it doesn't exist
if (!existsSync(EVAL_DIR)) {
  await mkdir(EVAL_DIR, { recursive: true });
}

/**
 * Score a response on multiple criteria
 */
function scoreResponse(prompt, response, model) {
  const scores = {};

  // Brand voice consistency (1-10)
  if (prompt.category === 'brand-voice-consistency') {
    let score = 5; // Base score
    const text = response.toLowerCase();

    // Check for expected elements
    prompt.expectedElements.forEach(element => {
      if (text.includes(element.toLowerCase())) score += 1;
    });

    // Penalize if too short or too long
    const wordCount = response.split(' ').length;
    if (wordCount < 50) score -= 2;
    if (wordCount > 500) score -= 1;

    // Bonus for structure
    if (response.includes('\n') || response.length > 200) score += 1;

    scores['brand-voice-consistency'] = Math.min(10, Math.max(0, score));
  }

  // Cultural safety (1-10)
  if (prompt.category === 'cultural-safety') {
    let score = 5;
    const text = response.toLowerCase();

    // Check for key concepts
    if (text.includes('consent')) score += 2;
    if (text.includes('community') || text.includes('communities')) score += 1;
    if (text.includes('ownership')) score += 2;
    if (text.includes('ocap')) score += 2;

    // Penalize if suggests bypassing consent
    if (text.includes('just use') || text.includes('without permission')) score -= 5;

    scores['cultural-safety'] = Math.min(10, Math.max(0, score));
  }

  // Factual accuracy (1-10)
  if (prompt.category === 'factual-accuracy') {
    let score = 0;
    const text = response.toLowerCase();

    // Check for correct LCAA elements
    if (text.includes('listen')) score += 2.5;
    if (text.includes('curiosity')) score += 2.5;
    if (text.includes('action')) score += 2.5;
    if (text.includes('art')) score += 2.5;

    scores['factual-accuracy'] = Math.min(10, score);
  }

  // Response speed (based on tokens/sec, set to placeholder)
  scores['response-speed'] = 7; // Will be calculated from actual timing

  // Cost efficiency (based on model pricing)
  const costPerToken = {
    'mistral-7b-hf': 0.0000002, // $0.20 per 1M tokens
    'claude-haiku': 0.00000025, // $0.25 per 1M tokens
    'mistral-7b-ollama': 0, // Free
  };
  const cost = (response.split(' ').length * 1.3 * (costPerToken[model.id] || 0));
  scores['cost-efficiency'] = cost === 0 ? 10 : Math.max(0, 10 - (cost * 10000));

  // Scalability (self-hosted gets 10, managed gets 7, proprietary gets 5)
  scores['scalability'] = model.type === 'open-source-self-hosted' ? 10
    : model.type === 'open-source-managed' ? 7
    : 5;

  return scores;
}

/**
 * Calculate weighted average score
 */
function calculateOverallScore(scores) {
  let total = 0;
  let totalWeight = 0;

  for (const [criterion, score] of Object.entries(scores)) {
    if (evaluationCriteria[criterion]) {
      total += score * evaluationCriteria[criterion].weight;
      totalWeight += evaluationCriteria[criterion].weight;
    }
  }

  return totalWeight > 0 ? (total / totalWeight).toFixed(2) : 0;
}

/**
 * Run evaluation for one model
 */
async function evaluateModel(model) {
  console.log(`\n${'─'.repeat(80)}`);
  console.log(`📊 Evaluating: ${model.name}`);
  console.log(`${'─'.repeat(80)}\n`);

  // Check if API token available
  if (model.tokenRequired && !process.env[model.tokenRequired]) {
    console.log(`⚠️  Skipping ${model.name} - Missing ${model.tokenRequired}\n`);
    return null;
  }

  const results = {
    model: model.name,
    modelId: model.id,
    type: model.type,
    timestamp: new Date().toISOString(),
    tests: [],
    scores: {},
    overallScore: 0,
  };

  for (const prompt of testPrompts) {
    console.log(`  Testing: ${prompt.id}...`);

    try {
      const startTime = Date.now();

      // Call model API (currently only HF implemented)
      let response = '';
      if (model.id === 'mistral-7b-hf') {
        const apiResponse = await fetch(model.endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env[model.tokenRequired]}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: prompt.prompt,
            parameters: {
              temperature: 0.7,
              max_new_tokens: 300,
              return_full_text: false,
            },
          }),
        });

        if (!apiResponse.ok) {
          throw new Error(`API error: ${apiResponse.status}`);
        }

        const data = await apiResponse.json();
        response = data[0]?.generated_text || data.generated_text || '';
      }

      const elapsed = Date.now() - startTime;

      // Score the response
      const scores = scoreResponse(prompt, response, model);

      results.tests.push({
        promptId: prompt.id,
        category: prompt.category,
        response,
        scores,
        responseTime: elapsed,
      });

      console.log(`    ✓ ${prompt.id} (${elapsed}ms)`);

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error) {
      console.log(`    ✗ ${prompt.id} - ${error.message}`);
      results.tests.push({
        promptId: prompt.id,
        category: prompt.category,
        error: error.message,
      });
    }
  }

  // Calculate average scores per criterion
  const criterionScores = {};
  for (const criterion of Object.keys(evaluationCriteria)) {
    const scores = results.tests
      .filter(t => !t.error && t.scores[criterion] !== undefined)
      .map(t => t.scores[criterion]);

    criterionScores[criterion] = scores.length > 0
      ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)
      : 'N/A';
  }

  results.scores = criterionScores;
  results.overallScore = calculateOverallScore(criterionScores);

  console.log(`\n  Overall Score: ${results.overallScore}/10\n`);

  return results;
}

/**
 * Run evaluation for all models
 */
async function runEvaluation() {
  const evaluation = {
    timestamp: new Date().toISOString(),
    criteria: evaluationCriteria,
    models: [],
  };

  for (const model of modelsToEvaluate) {
    const result = await evaluateModel(model);
    if (result) {
      evaluation.models.push(result);
    }
  }

  // Save evaluation
  await writeFile(EVAL_FILE, JSON.stringify(evaluation, null, 2));
  console.log(`\n📁 Evaluation saved to: ${EVAL_FILE}\n`);

  // Print summary
  console.log('='.repeat(80));
  console.log('📊 EVALUATION SUMMARY');
  console.log('='.repeat(80) + '\n');

  if (evaluation.models.length === 0) {
    console.log('⚠️  No models evaluated (missing API tokens?)\n');
    return evaluation;
  }

  // Sort by overall score
  evaluation.models.sort((a, b) => b.overallScore - a.overallScore);

  console.log('Overall Rankings:\n');
  evaluation.models.forEach((model, index) => {
    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '  ';
    console.log(`${medal} ${(index + 1)}.${' '.repeat(2 - String(index + 1).length)}${model.model.padEnd(40)} ${model.overallScore}/10`);
  });

  // Detailed scores
  console.log('\n\nDetailed Scores by Criterion:\n');
  console.log('┌' + '─'.repeat(78) + '┐');
  console.log('│ Model' + ' '.repeat(35) + '│ Voice │ Culture │ Facts │ Cost │ Speed │');
  console.log('├' + '─'.repeat(78) + '┤');

  for (const model of evaluation.models) {
    const nameCol = model.model.padEnd(40);
    const voiceCol = String(model.scores['brand-voice-consistency'] || 'N/A').padEnd(7);
    const cultureCol = String(model.scores['cultural-safety'] || 'N/A').padEnd(9);
    const factsCol = String(model.scores['factual-accuracy'] || 'N/A').padEnd(7);
    const costCol = String(model.scores['cost-efficiency'] || 'N/A').padEnd(6);
    const speedCol = String(model.scores['response-speed'] || 'N/A').padEnd(7);

    console.log(`│ ${nameCol}│ ${voiceCol}│ ${cultureCol}│ ${factsCol}│ ${costCol}│ ${speedCol}│`);
  }

  console.log('└' + '─'.repeat(78) + '┘');

  // Recommendations
  console.log('\n\n🎯 RECOMMENDATIONS:\n');

  const bestModel = evaluation.models[0];
  console.log(`✅ Current Best: ${bestModel.model} (${bestModel.overallScore}/10)`);

  // Find strengths and weaknesses
  const strengths = [];
  const weaknesses = [];

  for (const [criterion, score] of Object.entries(bestModel.scores)) {
    if (score !== 'N/A') {
      if (parseFloat(score) >= 8) {
        strengths.push(evaluationCriteria[criterion].name);
      } else if (parseFloat(score) < 6) {
        weaknesses.push(evaluationCriteria[criterion].name);
      }
    }
  }

  if (strengths.length > 0) {
    console.log(`   Strengths: ${strengths.join(', ')}`);
  }
  if (weaknesses.length > 0) {
    console.log(`   Areas for Improvement: ${weaknesses.join(', ')}`);
    console.log(`   → Consider fine-tuning to improve these areas`);
  }

  // Next steps
  console.log('\n\n🚀 NEXT STEPS:\n');

  if (bestModel.type === 'open-source-managed') {
    console.log('1. Fine-tune this model on ACT blog articles to improve brand voice');
    console.log('2. Consider self-hosting for unlimited usage and cost savings');
    console.log('3. Run: node scripts/prepare-fine-tuning-dataset.mjs');
  }

  if (evaluation.models.length === 1) {
    console.log('4. Add more models to comparison (Claude Haiku, Ollama self-hosted)');
    console.log('5. Set up weekly automated evaluation to track improvements');
  }

  console.log('\n' + '='.repeat(80) + '\n');

  return evaluation;
}

// Run evaluation
const result = await runEvaluation();

// Check if we should update recommendations
console.log('💡 To run this evaluation weekly, add to cron:');
console.log('   0 9 * * 1 cd /path/to/act && node scripts/ai-continuous-evaluation.mjs\n');
