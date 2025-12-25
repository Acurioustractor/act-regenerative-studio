/**
 * Prepare Fine-Tuning Dataset from ACT Blog Articles
 *
 * This script creates training data for fine-tuning open-source models
 * on ACT's brand voice by extracting blog articles from enrichment_reviews.
 *
 * Output: JSONL file ready for fine-tuning (Axolotl, Unsloth, etc.)
 *
 * Run: node scripts/prepare-fine-tuning-dataset.mjs
 */

import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { writeFile } from 'fs/promises';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔧 Preparing Fine-Tuning Dataset from ACT Blog Articles\n');

/**
 * Extract key themes from article data
 */
function extractThemes(article) {
  const themes = [];

  // Project-based themes
  if (article.project_slug === 'justicehub') {
    themes.push('youth justice', 'community programs', 'recidivism');
  } else if (article.project_slug === 'empathy-ledger') {
    themes.push('storytelling', 'data sovereignty', 'OCAP principles');
  } else if (article.project_slug === 'goods-on-country') {
    themes.push('circular economy', 'community ownership', 'manufacturing');
  } else if (article.project_slug === 'black-cockatoo-valley') {
    themes.push('conservation', 'Indigenous land care', 'regeneration');
  } else if (article.project_slug === 'the-harvest') {
    themes.push('therapeutic horticulture', 'community agriculture', 'heritage');
  }

  // Tag-based themes (if available)
  if (article.tags && Array.isArray(article.tags)) {
    themes.push(...article.tags);
  }

  return themes;
}

/**
 * Generate instruction prompt for training
 */
function generateInstruction(article, themes) {
  const instructions = [
    `Write a blog post about ${themes[0] || 'community innovation'} for A Curious Tractor`,
    `Create content for ${article.project_slug} focusing on ${themes.slice(0, 2).join(' and ')}`,
    `Draft an article about ${themes[0]} using ACT's brand voice (grounded yet visionary, humble yet confident)`,
    `Write about ${themes.slice(0, 2).join(' and ')} for ${article.project_slug} in ACT's style`,
  ];

  // Pick random instruction style
  return instructions[Math.floor(Math.random() * instructions.length)];
}

/**
 * Create training example in Alpaca/Instruct format
 */
function createTrainingExample(article) {
  const themes = extractThemes(article);
  const instruction = generateInstruction(article, themes);

  // Input context (optional, can be empty)
  const input = themes.length > 0
    ? `Topic: ${themes.slice(0, 3).join(', ')}\nProject: ${article.project_slug}`
    : '';

  // Output (the actual article content)
  const output = article.enrichment_data?.summary || article.enrichment_data?.content || '';

  // Metadata for tracking
  const metadata = {
    source: 'ACT Blog',
    project: article.project_slug,
    url: article.enrichment_data?.url,
    author: article.enrichment_data?.author,
    date: article.enrichment_data?.publishedDate,
  };

  return {
    instruction,
    input,
    output,
    metadata,
  };
}

/**
 * Create training example in ChatML format (for chat models)
 */
function createChatMLExample(article) {
  const themes = extractThemes(article);
  const instruction = generateInstruction(article, themes);
  const output = article.enrichment_data?.summary || article.enrichment_data?.content || '';

  return {
    messages: [
      {
        role: 'system',
        content: 'You are a content writer for A Curious Tractor, a regenerative innovation ecosystem partnering with marginalized communities. Your voice is grounded yet visionary, humble yet confident, warm yet challenging, and poetic yet clear. You use farm metaphors thoughtfully and center community voices.',
      },
      {
        role: 'user',
        content: instruction,
      },
      {
        role: 'assistant',
        content: output,
      },
    ],
    metadata: {
      source: 'ACT Blog',
      project: article.project_slug,
      url: article.enrichment_data?.url,
    },
  };
}

async function prepareDataset() {
  console.log('📥 Fetching blog articles from enrichment_reviews...\n');

  // Fetch all approved blog articles
  const { data: articles, error } = await supabase
    .from('enrichment_reviews')
    .select('*')
    .eq('enrichment_type', 'blog_links')
    .eq('status', 'approved')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('❌ Error fetching articles:', error);
    process.exit(1);
  }

  console.log(`✅ Found ${articles.length} approved blog articles\n`);

  if (articles.length === 0) {
    console.error('❌ No articles found. Run import-justicehub-articles.mjs first.');
    process.exit(1);
  }

  // Create training datasets in both formats
  const alpacaDataset = [];
  const chatMLDataset = [];

  console.log('🔄 Processing articles...\n');

  for (const article of articles) {
    // Skip if no content
    if (!article.enrichment_data?.summary && !article.enrichment_data?.content) {
      console.log(`⚠️  Skipping article (no content): ${article.enrichment_data?.title || 'Untitled'}`);
      continue;
    }

    // Create both formats
    alpacaDataset.push(createTrainingExample(article));
    chatMLDataset.push(createChatMLExample(article));

    console.log(`✅ ${article.enrichment_data?.title || 'Untitled'} (${article.project_slug})`);
  }

  console.log(`\n📊 Dataset Statistics:`);
  console.log(`   Total examples: ${alpacaDataset.length}`);

  // Count by project
  const byProject = alpacaDataset.reduce((acc, ex) => {
    acc[ex.metadata.project] = (acc[ex.metadata.project] || 0) + 1;
    return acc;
  }, {});

  console.log(`\n   By project:`);
  Object.entries(byProject).forEach(([project, count]) => {
    console.log(`   - ${project}: ${count} articles`);
  });

  // Calculate average output length
  const avgLength = Math.round(
    alpacaDataset.reduce((sum, ex) => sum + ex.output.length, 0) / alpacaDataset.length
  );
  const avgWords = Math.round(avgLength / 5); // Rough char-to-word conversion

  console.log(`\n   Average output length: ${avgLength} characters (~${avgWords} words)`);

  // Split into train/validation (80/20)
  const splitIndex = Math.floor(alpacaDataset.length * 0.8);

  const alpacaTrain = alpacaDataset.slice(0, splitIndex);
  const alpacaVal = alpacaDataset.slice(splitIndex);

  const chatMLTrain = chatMLDataset.slice(0, splitIndex);
  const chatMLVal = chatMLDataset.slice(splitIndex);

  console.log(`\n   Train/Val split: ${alpacaTrain.length}/${alpacaVal.length} (80/20)`);

  // Save datasets
  console.log(`\n💾 Saving datasets...\n`);

  // Alpaca format (for Axolotl, Unsloth)
  await writeFile(
    './training-data-alpaca-train.jsonl',
    alpacaTrain.map(ex => JSON.stringify(ex)).join('\n')
  );
  await writeFile(
    './training-data-alpaca-val.jsonl',
    alpacaVal.map(ex => JSON.stringify(ex)).join('\n')
  );
  console.log(`✅ Alpaca format saved:`);
  console.log(`   - training-data-alpaca-train.jsonl (${alpacaTrain.length} examples)`);
  console.log(`   - training-data-alpaca-val.jsonl (${alpacaVal.length} examples)`);

  // ChatML format (for OpenAI, Mistral fine-tuning APIs)
  await writeFile(
    './training-data-chatml-train.jsonl',
    chatMLTrain.map(ex => JSON.stringify(ex)).join('\n')
  );
  await writeFile(
    './training-data-chatml-val.jsonl',
    chatMLVal.map(ex => JSON.stringify(ex)).join('\n')
  );
  console.log(`\n✅ ChatML format saved:`);
  console.log(`   - training-data-chatml-train.jsonl (${chatMLTrain.length} examples)`);
  console.log(`   - training-data-chatml-val.jsonl (${chatMLVal.length} examples)`);

  // Save metadata summary
  const summary = {
    created: new Date().toISOString(),
    totalExamples: alpacaDataset.length,
    trainExamples: alpacaTrain.length,
    valExamples: alpacaVal.length,
    byProject,
    avgOutputLength: avgLength,
    avgWords,
    projects: Object.keys(byProject),
  };

  await writeFile(
    './training-data-summary.json',
    JSON.stringify(summary, null, 2)
  );
  console.log(`\n✅ Summary saved: training-data-summary.json`);

  // Generate sample config for Axolotl
  const axolotlConfig = {
    base_model: 'mistralai/Mistral-7B-Instruct-v0.3',
    model_type: 'MistralForCausalLM',
    tokenizer_type: 'LlamaTokenizer',

    load_in_8bit: false,
    load_in_4bit: true,
    strict: false,

    datasets: [
      {
        path: './training-data-alpaca-train.jsonl',
        type: 'alpaca',
      },
    ],
    val_set_size: 0.1,

    adapter: 'lora',
    lora_r: 16,
    lora_alpha: 32,
    lora_dropout: 0.05,
    lora_target_modules: ['q_proj', 'k_proj', 'v_proj', 'o_proj'],

    sequence_len: 2048,
    sample_packing: true,

    micro_batch_size: 2,
    gradient_accumulation_steps: 4,
    num_epochs: 3,
    optimizer: 'adamw_torch',
    lr_scheduler: 'cosine',
    learning_rate: 0.0002,

    train_on_inputs: false,
    group_by_length: false,

    bf16: true,
    fp16: false,
    tf32: false,

    gradient_checkpointing: true,
    early_stopping_patience: 3,

    logging_steps: 10,
    save_steps: 100,
    eval_steps: 50,

    output_dir: './act-mistral-lora',
  };

  await writeFile(
    './axolotl-config.yml',
    `# Axolotl config for fine-tuning Mistral 7B on ACT blog articles
# Run: accelerate launch -m axolotl.cli.train axolotl-config.yml

${Object.entries(axolotlConfig).map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}:\n${value.map(v => `  - ${typeof v === 'object' ? JSON.stringify(v) : v}`).join('\n')}`;
      } else if (typeof value === 'object') {
        return `${key}:\n${Object.entries(value).map(([k, v]) => `  ${k}: ${v}`).join('\n')}`;
      }
      return `${key}: ${value}`;
    }).join('\n')}
`
  );
  console.log(`\n✅ Axolotl config saved: axolotl-config.yml`);

  // Next steps
  console.log(`\n${'='.repeat(80)}`);
  console.log('🎯 NEXT STEPS FOR FINE-TUNING');
  console.log('='.repeat(80));

  console.log(`\n📦 Option 1: Fine-tune with Axolotl (DIY, most control)`);
  console.log(`   1. Install Axolotl: pip install axolotl`);
  console.log(`   2. Run training: accelerate launch -m axolotl.cli.train axolotl-config.yml`);
  console.log(`   3. Merge LoRA: python -m axolotl.cli.merge_lora axolotl-config.yml --lora_model_dir ./act-mistral-lora`);
  console.log(`   Cost: $5-20 on RunPod/Modal (4-8 hours on A100 spot)`);

  console.log(`\n☁️  Option 2: Fine-tune with Hugging Face AutoTrain (easiest)`);
  console.log(`   1. Upload training-data-chatml-train.jsonl to HF`);
  console.log(`   2. Use AutoTrain web UI: https://huggingface.co/autotrain`);
  console.log(`   3. Select Mistral 7B base model`);
  console.log(`   Cost: $50-100 (managed fine-tuning)`);

  console.log(`\n🚀 Option 3: Fine-tune with Unsloth (fastest, recommended for testing)`);
  console.log(`   1. Use Google Colab free GPU`);
  console.log(`   2. Load notebook: https://colab.research.google.com/drive/1lBzz5KeZJKXjvivbYvmGarix9Ao6Wxe5`);
  console.log(`   3. Upload training-data-alpaca-train.jsonl`);
  console.log(`   Cost: $0 (free Colab GPU) or $10 on Colab Pro`);

  console.log(`\n📊 Expected Results:`);
  console.log(`   - Training time: 3-8 hours`);
  console.log(`   - LoRA adapter size: ~100MB`);
  console.log(`   - Quality improvement: 1-2 points on ACT voice tasks`);
  console.log(`   - Fine-tuned model will write exactly like ACT blog articles`);

  console.log(`\n${'='.repeat(80)}\n`);
}

prepareDataset().catch(error => {
  console.error('🚨 Failed to prepare dataset:', error);
  process.exit(1);
});
