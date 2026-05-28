#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
// Single source of truth for launch holds (see config/launch-redirects.cjs). When
// a surface like /wiki is held behind a 307, its positioning/route checks below
// are skipped and auto-reactivate the moment the hold is lifted.
const { launchRedirects } = require('../config/launch-redirects.cjs');

const repoRoot = process.cwd();
const baseUrl = (process.env.BRAND_WIKI_CHECK_BASE_URL || 'http://localhost:3001').replace(/\/$/, '');

/** True when `route` is temporarily held behind a 307 (permanent: false). */
function isHeldRoute(route) {
  return launchRedirects.some((r) => r.permanent === false && r.source === route);
}

const launchRoutes = [
  '/',
  '/about',
  '/projects',
  '/stories',
  '/goods',
  '/justicehub',
  '/empathy-ledger',
  '/harvest',
  '/farm',
  '/art',
  '/wiki',
  '/contact',
  '/method',
  '/impact',
  '/principles',
  '/vision',
];

const requiredWikiPages = [
  'act-identity',
  'lcaa-method',
  'act-core-facts',
  'act-brand-alignment-map',
  'soul',
  'designing-for-obsolescence',
];

const requiredProjectSlugs = [
  'goods',
  'justicehub',
  'empathy-ledger',
  'black-cockatoo-valley',
  'the-harvest',
];

const homeBrandSignals = [
  /A Curious Tractor/i,
  /Jinibara Country/i,
  /Explore projects/i,
  /Listen/i,
  /Curiosity/i,
  /Action/i,
  /Art/i,
  /hand\s+over/i,
  /co-designed/i,
];

const wikiBrandSignals = [
  /Methods, decisions/i,
  /source\s+trail/i,
  /check our thinking/i,
];

const bannedPublicPatterns = [
  { pattern: /\bACT Foundation\b/i, reason: 'uses a non-entity legal name' },
  { pattern: /\bACT Ventures\b/i, reason: 'uses a non-entity legal name' },
  { pattern: /\bworld[- ]leading\b/i, reason: 'overclaims' },
  { pattern: /\bluxury\b/i, reason: 'leans into luxury positioning' },
  { pattern: /\bsavio[u]?rs?\b/i, reason: 'savior framing' },
  { pattern: /\bvoiceless\b/i, reason: 'extractive voice framing' },
  { pattern: /\bgive voice\b/i, reason: 'extractive voice framing' },
  { pattern: /\bbeneficiaries\b/i, reason: 'beneficiary framing' },
  { pattern: /\bABN\b/i, reason: 'ABN should not be public until active' },
  { pattern: /\bLCAA\b/i, reason: 'uses bare method acronym instead of Listen, Curiosity, Action, Art' },
  { pattern: /\bALMA\b/i, reason: 'uses bare alternatives-map acronym instead of Australian Living Map of Alternatives' },
  { pattern: /[—–]/, reason: 'uses em/en dash in public ACT copy' },
  { pattern: /\bcoming soon\b/i, reason: 'placeholder copy' },
  { pattern: /\bstill being prepared\b/i, reason: 'placeholder copy' },
  { pattern: /\bstill being surfaced\b/i, reason: 'placeholder copy' },
];

// Anti-extractive critiques legitimately *name* the bad framing in order to
// reject it (the homepage confession wall quotes the status quo ACT dismantles).
// These exact phrases are stripped before the banned-language scan so that
// naming the problem is not mistaken for endorsing it. Keep entries specific.
const allowedCritiquePhrases = [
  /treated as beneficiaries, never owners/gi,
];

const failures = [];

function readJson(relativePath) {
  const absolutePath = path.join(repoRoot, relativePath);
  try {
    return JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
  } catch (error) {
    failures.push(`${relativePath}: could not parse JSON: ${error.message}`);
    return null;
  }
}

function stripVisibleText(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function visibleSnippet(text, pattern) {
  const match = text.match(pattern);
  if (!match || match.index === undefined) return text.slice(0, 160);
  const start = Math.max(0, match.index - 70);
  return text.slice(start, start + 180);
}

async function fetchRoute(route) {
  const response = await fetch(`${baseUrl}${route}`);
  const html = await response.text();
  return { response, html, visibleText: stripVisibleText(html) };
}

function checkGeneratedWikiData() {
  const pagesPayload = readJson('src/data/wiki-pages.generated.json');
  const projectsPayload = readJson('src/data/wiki-projects.generated.json');
  const packsPayload = readJson('src/data/wiki-flagship-project-packs.generated.json');

  const pages = pagesPayload?.pages || [];
  const projects = projectsPayload?.projects || [];
  const packs = packsPayload?.packs || [];

  if (pages.length < 100) failures.push(`wiki-pages: expected at least 100 pages, found ${pages.length}`);
  if (projects.length < 20) failures.push(`wiki-projects: expected at least 20 projects, found ${projects.length}`);
  if (packs.length < 5) failures.push(`flagship packs: expected at least 5 packs, found ${packs.length}`);

  if (pagesPayload?.pageCount && pagesPayload.pageCount !== pages.length) {
    failures.push(`wiki-pages: pageCount ${pagesPayload.pageCount} does not match ${pages.length} records`);
  }
  if (projectsPayload?.projectCount && projectsPayload.projectCount !== projects.length) {
    failures.push(`wiki-projects: projectCount ${projectsPayload.projectCount} does not match ${projects.length} records`);
  }
  if (packsPayload?.packCount && packsPayload.packCount !== packs.length) {
    failures.push(`flagship packs: packCount ${packsPayload.packCount} does not match ${packs.length} records`);
  }

  const pageStems = new Set(pages.map((page) => page.stem));
  for (const stem of requiredWikiPages) {
    if (!pageStems.has(stem)) {
      failures.push(`wiki-pages: missing required page stem ${stem}`);
    }
  }

  const projectSlugs = new Set(projects.map((project) => project.slug));
  for (const slug of requiredProjectSlugs) {
    if (!projectSlugs.has(slug)) {
      failures.push(`wiki-projects: missing required project ${slug}`);
    }
  }

  const packSlugs = new Set(packs.map((pack) => pack.slug));
  for (const slug of requiredProjectSlugs) {
    if (!packSlugs.has(slug)) {
      failures.push(`flagship packs: missing required pack ${slug}`);
    }
  }
}

async function checkRouteBrandSignals() {
  const home = await fetchRoute('/');
  if (home.response.status !== 200) {
    failures.push(`/: expected 200, got ${home.response.status}`);
  } else {
    for (const pattern of homeBrandSignals) {
      if (!pattern.test(home.visibleText)) {
        failures.push(`/: missing ACT brand signal ${pattern}`);
      }
    }
  }

  // /wiki is held behind a 307 for launch; its positioning copy does not render
  // while redirected. check:redirects already verifies the hold itself.
  if (isHeldRoute('/wiki')) return;

  const wiki = await fetchRoute('/wiki');
  if (wiki.response.status !== 200) {
    failures.push(`/wiki: expected 200, got ${wiki.response.status}`);
  } else {
    for (const pattern of wikiBrandSignals) {
      if (!pattern.test(wiki.visibleText)) {
        failures.push(`/wiki: missing wiki positioning signal ${pattern}`);
      }
    }
  }
}

async function checkPublicRouteLanguage() {
  for (const route of launchRoutes) {
    // Held surfaces 307 away; skip rather than scan the redirect destination
    // under the wrong route label (the destination is checked on its own route).
    if (isHeldRoute(route)) continue;

    const { response, visibleText } = await fetchRoute(route);
    if (response.status !== 200) {
      failures.push(`${route}: expected 200, got ${response.status}`);
      continue;
    }

    // Strip documented anti-extractive critiques so naming the bad framing is
    // not mistaken for endorsing it.
    let scanText = visibleText;
    for (const phrase of allowedCritiquePhrases) scanText = scanText.replace(phrase, ' ');

    for (const { pattern, reason } of bannedPublicPatterns) {
      if (pattern.test(scanText)) {
        failures.push(`${route}: ${reason}: "${visibleSnippet(scanText, pattern)}"`);
      }
    }
  }
}

async function checkRequiredWikiRoutes() {
  // The /wiki/* detail routes are held behind a 307 for launch; their content is
  // not reachable while redirected. Re-checked automatically once /wiki is live.
  if (isHeldRoute('/wiki')) return;

  for (const stem of requiredWikiPages) {
    const { response } = await fetchRoute(`/wiki/${stem}`);
    if (response.status !== 200) {
      failures.push(`/wiki/${stem}: expected 200, got ${response.status}`);
    }
  }
}

checkGeneratedWikiData();

try {
  await checkRouteBrandSignals();
  await checkPublicRouteLanguage();
  await checkRequiredWikiRoutes();
} catch (error) {
  failures.push(`brand/wiki route check failed against ${baseUrl}: ${error.message}`);
}

if (failures.length > 0) {
  console.error(`Brand/wiki check failed against ${baseUrl}`);
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Brand/wiki check passed against ${baseUrl}`);
console.log('Verified ACT brand signals, public-language guardrails, generated wiki content, flagship packs, and required wiki routes.');
