/**
 * Import Compendium media into Empathy Ledger Enhanced
 *
 * Uploads local files from the compendium inbox into Supabase Storage
 * and creates media_assets records, linking them to the Compendium 2026 gallery.
 *
 * Run with:
 *   node scripts/import-compendium-media.mjs
 *
 * Requires:
 *   EL_SUPABASE_URL
 *   EL_SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { readFileSync, existsSync, statSync } from 'fs';
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
const BUCKET = 'media';
const PREFIX = 'photos/compendium-2026';
const GALLERY_SLUG = 'compendium-2026';
const GALLERY_TITLE = 'Compendium 2026';
const BASE_TAGS = ['compendium-2026', 'source:webflow-portfolio', 'consent:internal'];

const supabase = createClient(TARGET_URL, TARGET_KEY);

const MIME_BY_EXT = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
};

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

async function loadDefaults() {
  const { data, error } = await supabase
    .from('media_assets')
    .select('tenant_id, uploader_id, organization_id')
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    console.error('Missing media_assets defaults (tenant_id/uploader_id).');
    process.exit(1);
  }

  return data;
}

async function ensureGallery(defaults) {
  const { data: existing, error } = await supabase
    .from('galleries')
    .select('id')
    .eq('slug', GALLERY_SLUG)
    .maybeSingle();

  if (error) {
    console.warn('[Import] Could not check galleries:', error.message);
  }

  if (existing?.id) return existing.id;

  const { data: created, error: insertError } = await supabase
    .from('galleries')
    .insert({
      title: GALLERY_TITLE,
      slug: GALLERY_SLUG,
      description: 'Compendium 2026 media library',
      created_by: defaults.uploader_id,
      organization_id: defaults.organization_id || null,
      visibility: 'organization',
      status: 'active',
    })
    .select('id')
    .single();

  if (insertError) {
    console.error('[Import] Failed to create Compendium gallery:', insertError.message);
    process.exit(1);
  }

  return created.id;
}

async function fetchExistingMediaAssetsByStoragePath(storagePaths) {
  if (storagePaths.length === 0) return new Map();

  const { data, error } = await supabase
    .from('media_assets')
    .select('id, storage_path')
    .in('storage_path', storagePaths);

  if (error) {
    console.warn('[Import] Could not check existing media_assets:', error.message);
    return new Map();
  }

  const map = new Map();
  (data || []).forEach((row) => {
    if (row.storage_path) {
      map.set(row.storage_path, row.id);
    }
  });
  return map;
}

async function importCompendiumMedia() {
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

  const defaults = await loadDefaults();
  const galleryId = await ensureGallery(defaults);

  const storagePaths = records.map((record) => {
    const ext = path.extname(record.filename).toLowerCase();
    const title = (record.entry_title || '').trim() || path.basename(record.filename, ext);
    const slug = slugify(title) || 'untitled';
    const hash = shortHash(record.url);
    return `${PREFIX}/${slug}-${hash}${ext}`;
  });

  const existingAssetMap = await fetchExistingMediaAssetsByStoragePath(storagePaths);
  const existingAssociations = new Set();
  let nextSortOrder = 1;

  const { data: galleryItems } = await supabase
    .from('gallery_media_associations')
    .select('media_asset_id, sort_order')
    .eq('gallery_id', galleryId);

  (galleryItems || []).forEach((row) => {
    if (row.media_asset_id) {
      existingAssociations.add(row.media_asset_id);
      if (row.sort_order && row.sort_order >= nextSortOrder) {
        nextSortOrder = row.sort_order + 1;
      }
    }
  });

  let uploadedCount = 0;
  let insertedCount = 0;
  let skippedCount = 0;
  let linkedCount = 0;

  for (const record of records) {
    const filePath = path.join(INBOX_DIR, record.filename);
    if (!existsSync(filePath)) {
      console.warn(`[Import] Missing file: ${record.filename}`);
      continue;
    }

    const ext = path.extname(record.filename).toLowerCase();
    const mimeType = MIME_BY_EXT[ext] || 'application/octet-stream';
    const title = (record.entry_title || '').trim() || path.basename(record.filename, ext);
    const slug = slugify(title) || 'untitled';
    const hash = shortHash(record.url);
    const storagePath = `${PREFIX}/${slug}-${hash}${ext}`;
    const stats = statSync(filePath);

    try {
      const fileBuffer = readFileSync(filePath);
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, fileBuffer, {
          contentType: mimeType,
          upsert: false,
        });

      if (uploadError && uploadError.statusCode !== '409') {
        console.error(`[Import] Upload failed: ${record.filename} -> ${uploadError.message}`);
        continue;
      }

      if (!uploadError) {
        uploadedCount += 1;
      }
    } catch (error) {
      console.error(`[Import] Upload exception for ${record.filename}:`, error);
      continue;
    }

    let mediaAssetId = existingAssetMap.get(storagePath);

    if (!mediaAssetId) {
      const {
        data: { publicUrl },
      } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);

      const mediaAsset = {
        tenant_id: defaults.tenant_id,
        uploader_id: defaults.uploader_id,
        organization_id: defaults.organization_id || null,
        original_filename: record.filename,
        filename: record.filename,
        file_type: 'image',
        media_type: 'image',
        mime_type: mimeType,
        file_size: stats.size,
        storage_bucket: BUCKET,
        storage_path: storagePath,
        cdn_url: publicUrl,
        title,
        description: 'Imported from ACT Placemat curated-2025 for Compendium 2026.',
        alt_text: title,
        caption: title,
        cultural_tags: BASE_TAGS,
        privacy_level: 'private',
        cultural_sensitivity_level: 'standard',
        processing_status: 'pending',
        metadata: {
          source: 'compendium-import',
          source_id: record.url,
          project_slugs: [],
        },
      };

      const { data: inserted, error: insertError } = await supabase
        .from('media_assets')
        .insert(mediaAsset)
        .select('id')
        .single();

      if (insertError) {
        console.error(`[Import] Insert failed: ${record.filename} -> ${insertError.message}`);
        continue;
      }

      mediaAssetId = inserted.id;
      existingAssetMap.set(storagePath, mediaAssetId);
      insertedCount += 1;
    } else {
      skippedCount += 1;
    }

    if (!existingAssociations.has(mediaAssetId)) {
      const { error: linkError } = await supabase
        .from('gallery_media_associations')
        .insert({
          gallery_id: galleryId,
          media_asset_id: mediaAssetId,
          sort_order: nextSortOrder,
          caption: title,
        });

      if (linkError) {
        console.error(`[Import] Gallery link failed: ${record.filename} -> ${linkError.message}`);
      } else {
        existingAssociations.add(mediaAssetId);
        nextSortOrder += 1;
        linkedCount += 1;
      }
    }
  }

  console.log('\n✅ Compendium media import complete');
  console.log(`   Uploaded: ${uploadedCount}`);
  console.log(`   Inserted media_assets: ${insertedCount}`);
  console.log(`   Skipped (already in media_assets): ${skippedCount}`);
  console.log(`   Linked to gallery: ${linkedCount}`);
}

importCompendiumMedia();
