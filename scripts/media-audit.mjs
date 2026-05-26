#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const publicRoot = path.join(repoRoot, 'public');
const baseUrl = (process.env.MEDIA_AUDIT_BASE_URL || 'http://localhost:3001').replace(/\/$/, '');
const asJson = process.argv.includes('--json');

const launchRoutes = [
  '/',
  '/projects',
  '/stories',
  '/stories/utopia-may-2026',
  '/goods',
  '/justicehub',
  '/empathy-ledger',
  '/harvest',
  '/farm',
  '/art',
  '/wiki',
  '/contact',
];

const sourceRoots = [
  path.join(repoRoot, 'src/app'),
  path.join(repoRoot, 'src/components'),
  path.join(repoRoot, 'src/lib'),
];

const sourceExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.md', '.mdx', '.json']);
const publicAssetPattern =
  /["'`](\/(?:(?:media|branding)\/[^"'`\s)]+|act_placemat_2026_poster\.png))["'`]/g;
const mediaExtensionPattern = /\.(jpe?g|png|webp|gif|mp4|mov)$/i;
const imageExtensionPattern = /\.(jpe?g|png|webp|gif)$/i;
const videoExtensionPattern = /\.(mp4|mov|webm)(\?|#|$)/i;
const imageWarnBytes = Number(process.env.MEDIA_AUDIT_IMAGE_WARN_BYTES || 1024 * 1024);
const videoWarnBytes = Number(process.env.MEDIA_AUDIT_VIDEO_WARN_BYTES || 5 * 1024 * 1024);

const failures = [];
const warnings = [];

function walkFiles(dir) {
  if (!fs.existsSync(dir)) return [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next') continue;
      files.push(...walkFiles(fullPath));
    } else if (sourceExtensions.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

function publicPathToFile(assetPath) {
  const cleanPath = assetPath.split('?')[0].split('#')[0];
  return path.join(publicRoot, cleanPath.replace(/^\//, ''));
}

function bytesLabel(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.ceil(bytes / 1024)} KB`;
}

function getTagAttr(tag, attr) {
  const match = tag.match(new RegExp(`${attr}=["']([^"']*)["']`, 'i'));
  return match?.[1] ?? null;
}

function decodeImageSrc(src) {
  if (!src) return null;

  try {
    const parsed = new URL(src, baseUrl);
    if (parsed.pathname === '/_next/image') {
      const encoded = parsed.searchParams.get('url');
      return encoded ? decodeURIComponent(encoded) : null;
    }
    return parsed.pathname;
  } catch {
    return src;
  }
}

function isWeakAlt(alt) {
  const trimmed = alt.trim();
  if (!trimmed) return true;
  if (mediaExtensionPattern.test(trimmed)) return true;
  if (/^(image|photo|field photo|media item|hero image|selected image|current hero image)$/i.test(trimmed)) return true;
  if (/^img[_-]?\d+/i.test(trimmed)) return true;
  if (/^[a-z0-9]+[-_][a-z0-9-_]+[-_]\d{3,}$/i.test(trimmed)) return true;
  return false;
}

function collectSourceAssetReferences() {
  const references = new Map();

  for (const filePath of sourceRoots.flatMap(walkFiles)) {
    const source = fs.readFileSync(filePath, 'utf8');
    for (const match of source.matchAll(publicAssetPattern)) {
      const assetPath = match[1];
      if (!mediaExtensionPattern.test(assetPath)) continue;

      if (!references.has(assetPath)) {
        references.set(assetPath, []);
      }
      references.get(assetPath).push(path.relative(repoRoot, filePath));
    }
  }

  return references;
}

function auditSourceReferences(references) {
  for (const [assetPath, files] of references) {
    const filePath = publicPathToFile(assetPath);
    if (!fs.existsSync(filePath)) {
      failures.push(`Missing public media file ${assetPath}, referenced by ${files.slice(0, 3).join(', ')}`);
    }
  }
}

function auditAssetSizes() {
  const mediaRoot = path.join(publicRoot, 'media');
  const brandingRoot = path.join(publicRoot, 'branding');
  const assetFiles = [...walkPublicAssets(mediaRoot), ...walkPublicAssets(brandingRoot)];

  for (const filePath of assetFiles) {
    const relativePath = `/${path.relative(publicRoot, filePath)}`;
    const size = fs.statSync(filePath).size;

    if (imageExtensionPattern.test(filePath) && size > imageWarnBytes) {
      warnings.push(`Image over ${bytesLabel(imageWarnBytes)}: ${relativePath} is ${bytesLabel(size)}`);
    }
    if (videoExtensionPattern.test(filePath) && size > videoWarnBytes) {
      warnings.push(`Video over ${bytesLabel(videoWarnBytes)}: ${relativePath} is ${bytesLabel(size)}`);
    }
  }
}

function walkPublicAssets(dir) {
  if (!fs.existsSync(dir)) return [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkPublicAssets(fullPath));
    } else if (mediaExtensionPattern.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

async function auditRenderedRouteMedia() {
  let imageCount = 0;
  let localImageCount = 0;

  for (const route of launchRoutes) {
    let response;
    let html;

    try {
      response = await fetch(`${baseUrl}${route}`);
      html = await response.text();
    } catch (error) {
      failures.push(`${route}: media audit request failed: ${error.message}`);
      continue;
    }

    if (response.status !== 200) {
      failures.push(`${route}: expected 200 for media audit, got ${response.status}`);
      continue;
    }

    const imageTags = html.match(/<img\b[^>]*>/gi) || [];
    imageCount += imageTags.length;

    for (const tag of imageTags) {
      const alt = getTagAttr(tag, 'alt');
      const src = decodeImageSrc(getTagAttr(tag, 'src'));

      if (videoExtensionPattern.test(src || '')) {
        failures.push(`${route}: rendered image points to video asset ${src}`);
      }

      if (alt === null) {
        failures.push(`${route}: rendered image missing alt text`);
      } else if (isWeakAlt(alt)) {
        failures.push(`${route}: rendered image has weak alt text "${alt}"`);
      }

      if (src?.startsWith('/media/') || src?.startsWith('/branding/') || src === '/act_placemat_2026_poster.png') {
        localImageCount += 1;
        const filePath = publicPathToFile(src);
        if (!fs.existsSync(filePath)) {
          failures.push(`${route}: rendered image points to missing public file ${src}`);
        }
      }
    }
  }

  return { imageCount, localImageCount };
}

const references = collectSourceAssetReferences();
auditSourceReferences(references);
auditAssetSizes();
const rendered = await auditRenderedRouteMedia();

const summary = {
  baseUrl,
  launchRoutes: launchRoutes.length,
  sourceReferences: references.size,
  renderedImages: rendered.imageCount,
  renderedLocalImages: rendered.localImageCount,
  warnings: warnings.length,
  failures: failures.length,
};

if (asJson) {
  console.log(JSON.stringify({ summary, warnings, failures }, null, 2));
} else {
  console.log(`Media audit checked ${launchRoutes.length} launch routes against ${baseUrl}`);
  console.log(`Source media references: ${references.size}`);
  console.log(`Rendered images: ${rendered.imageCount}`);
  console.log(`Rendered local images: ${rendered.localImageCount}`);

  if (warnings.length > 0) {
    console.log('');
    console.log('Warnings:');
    warnings.forEach((warning) => console.log(`- ${warning}`));
  }

  if (failures.length > 0) {
    console.error('');
    console.error('Failures:');
    failures.forEach((failure) => console.error(`- ${failure}`));
  }
}

if (failures.length > 0) {
  process.exit(1);
}
