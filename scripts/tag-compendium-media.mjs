/**
 * Generate a compendium media tag sheet and apply project/consent metadata
 * to media_assets in Empathy Ledger Enhanced.
 *
 * Run with:
 *   node scripts/tag-compendium-media.mjs
 *
 * Requires:
 *   EL_SUPABASE_URL
 *   EL_SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';
import { createHash } from 'crypto';

dotenv.config({ path: '.env.local' });

const TARGET_URL = process.env.EL_SUPABASE_URL;
const TARGET_KEY = process.env.EL_SUPABASE_SERVICE_ROLE_KEY;

if (!TARGET_URL || !TARGET_KEY) {
  console.error('Missing EL_SUPABASE_URL or EL_SUPABASE_SERVICE_ROLE_KEY in environment.');
  process.exit(1);
}

const INBOX_DIR = '/Users/benknight/Code/act-regenerative-studio/assets/compendium-2026/00-inbox';
const LOG_PATH = path.join(INBOX_DIR, '_download_log.csv');
const OUTPUT_PATH = '/Users/benknight/Code/act-regenerative-studio/assets/compendium-2026/compendium_media_tag_sheet.csv';

const BASE_TAGS = ['compendium-2026', 'source:webflow-portfolio'];
const DEFAULT_CONSENT = 'internal';

const PROJECT_RULES = [
  { match: /bg fit/i, slug: 'bg-fit' },
  { match: /fishers oysters/i, slug: 'fishers-oysters' },
  { match: /diagrama/i, slug: 'diagrama' },
  { match: /justicehub/i, slug: 'justicehub' },
  { match: /oonchiumpa/i, slug: 'oonchiumpa' },
  { match: /empathy ledger/i, slug: 'empathy-ledger' },
  { match: /gold\.phone/i, slug: 'gold-phone' },
  { match: /global laundry alliance|\bgla\b/i, slug: 'global-laundry-alliance' },
  { match: /sowing seeds|witta/i, slug: 'witta-harvest-hq' },
  { match: /smart recovery|smart connect/i, slug: 'smart-connect' },
  { match: /goods\b|washing machine|pakkinjalki|weave bed|tennant creek|bupa tfn/i, slug: 'goods' },
  { match: /confit/i, slug: 'justicehub' },
  { match: /gpce|general practice conference/i, slug: 'smart-hcp-gp-uplift-project' },
  { match: /mission beach|elder'?s trip/i, slug: 'picc-elders-trip' },
  { match: /invasion day/i, slug: 'custodian-economy' },
];

const supabase = createClient(TARGET_URL, TARGET_KEY);
const PREFIX = 'photos/compendium-2026';

function slugify(value) {
  if (!value) return '';
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 64);
}

function shortHash(value) {
  return createHash('sha1').update(value).digest('hex').slice(0, 8);
}

function buildStoragePath(title, url, filename) {
  const ext = path.extname(filename).toLowerCase();
  const safeTitle = (title || '').trim() || path.basename(filename, ext);
  const slug = slugify(safeTitle) || 'untitled';
  const hash = shortHash(url);
  return `${PREFIX}/${slug}-${hash}${ext}`;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          current += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      row.push(current);
      current = '';
    } else if (char === '\n') {
      row.push(current);
      rows.push(row);
      row = [];
      current = '';
    } else if (char !== '\r') {
      current += char;
    }
  }

  if (current.length || row.length) {
    row.push(current);
    rows.push(row);
  }

  return rows;
}

function escapeCsvValue(value) {
  if (value === null || value === undefined) return '';
  const stringValue = String(value);
  if (stringValue.includes('"') || stringValue.includes(',') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

function toCsv(rows) {
  return rows.map((row) => row.map(escapeCsvValue).join(',')).join('\n') + '\n';
}

function uniqueList(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function sameSet(left, right) {
  if (left.length !== right.length) return false;
  const leftSet = new Set(left);
  return right.every((value) => leftSet.has(value));
}

function inferProjects(title) {
  if (!title) return [];
  const matches = PROJECT_RULES.filter((rule) => rule.match.test(title)).map((rule) => rule.slug);
  return uniqueList(matches);
}

function buildTagSheet(records) {
  const header = [
    'source_id',
    'filename',
    'title',
    'project_slugs (semicolon separated)',
    'consent',
    'manual_tags (semicolon separated)',
    'notes',
  ];

  const rows = records.map((record) => {
    const title = (record.entry_title || '').trim();
    const projectSlugs = inferProjects(title);
    const consent = DEFAULT_CONSENT;
    const manualTags = uniqueList([...BASE_TAGS, `consent:${consent}`]);

    return {
      source_id: record.url,
      filename: record.filename,
      title,
      project_slugs: projectSlugs,
      consent,
      manual_tags: manualTags,
      notes: projectSlugs.length === 0 ? 'Review project mapping' : '',
    };
  });

  const csvRows = [header, ...rows.map((row) => [
    row.source_id,
    row.filename,
    row.title,
    row.project_slugs.join(';'),
    row.consent,
    row.manual_tags.join(';'),
    row.notes,
  ])];

  writeFileSync(OUTPUT_PATH, toCsv(csvRows), 'utf8');

  return rows;
}

async function applyMetadata(tagRows) {
  let updatedCount = 0;
  let skippedCount = 0;
  let missingCount = 0;

  for (const row of tagRows) {
    const storagePath = buildStoragePath(row.title, row.source_id, row.filename);
    const { data: existing, error } = await supabase
      .from('media_assets')
      .select('id, cultural_tags, metadata')
      .eq('storage_path', storagePath)
      .maybeSingle();

    if (error) {
      console.error(`[Tagging] Failed to load ${row.filename}: ${error.message}`);
      continue;
    }

    if (!existing) {
      missingCount += 1;
      console.warn(`[Tagging] No media_assets match for ${row.filename}`);
      continue;
    }

    const existingTags = existing.cultural_tags || [];
    const currentTags = existingTags.filter((tag) => !tag.startsWith('consent:'));
    const nextTags = uniqueList([...currentTags, ...row.manual_tags]);
    const existingMetadata = (existing.metadata && typeof existing.metadata === 'object')
      ? existing.metadata
      : {};
    const existingProjects = Array.isArray(existingMetadata.project_slugs)
      ? existingMetadata.project_slugs
      : [];
    const nextProjects = uniqueList([...existingProjects, ...row.project_slugs]);

    const tagsChanged = !sameSet(existingTags, nextTags);
    const projectsChanged = !sameSet(existingProjects, nextProjects);

    if (!tagsChanged && !projectsChanged) {
      skippedCount += 1;
      continue;
    }

    const nextMetadata = {
      ...existingMetadata,
      project_slugs: nextProjects,
      source_id: row.source_id,
      compendium: true,
    };

    const { error: updateError } = await supabase
      .from('media_assets')
      .update({
        cultural_tags: nextTags,
        metadata: nextMetadata,
      })
      .eq('id', existing.id);

    if (updateError) {
      console.error(`[Tagging] Update failed for ${row.filename}: ${updateError.message}`);
      continue;
    }

    updatedCount += 1;
  }

  console.log('\n✅ Tagging complete');
  console.log(`   Updated: ${updatedCount}`);
  console.log(`   Skipped (no change): ${skippedCount}`);
  console.log(`   Missing: ${missingCount}`);
}

async function run() {
  if (!existsSync(LOG_PATH)) {
    console.error(`Missing log file: ${LOG_PATH}`);
    process.exit(1);
  }

  const csvText = readFileSync(LOG_PATH, 'utf8');
  const rows = parseCsv(csvText);
  const header = rows.shift();

  if (!header || header.length < 3) {
    console.error('Unexpected CSV format. Expected header with filename,url,entry_title.');
    process.exit(1);
  }

  const records = rows
    .map((row) => ({
      filename: row[0],
      url: row[1],
      entry_title: row[2],
    }))
    .filter((row) => row.filename && row.url);

  const tagRows = buildTagSheet(records);

  console.log(`✅ Tag sheet written to ${OUTPUT_PATH}`);
  console.log(`   Items: ${tagRows.length}`);

  await applyMetadata(tagRows);
}

run();
