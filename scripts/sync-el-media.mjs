import fs from 'node:fs/promises';
import path from 'node:path';

import dotenv from 'dotenv';
import pLimit from 'p-limit';

import {
  getProjectKeyCandidates,
  loadProjectCodeRegistrySnapshot,
} from './lib/project-code-registry.mjs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const EMPATHY_LEDGER_URL =
  process.env.EMPATHY_LEDGER_URL ||
  process.env.NEXT_PUBLIC_EMPATHY_LEDGER_URL ||
  'http://localhost:3030';

const EMPATHY_LEDGER_ORGANIZATION_ID =
  process.env.EMPATHY_LEDGER_ORGANIZATION_ID ||
  'db0de7bd-eb10-446b-99e9-0f3b7c199b8a';

const DEFAULT_TIMEOUT_MS = Number.parseInt(
  process.env.EMPATHY_LEDGER_SYNC_TIMEOUT_MS || '8000',
  10
);

const OUTPUT_PATH = path.resolve(
  process.cwd(),
  'src/data/empathy-ledger-featured.generated.json'
);

const PROJECTS_TS_PATH = path.resolve(process.cwd(), 'src/data/projects.ts');
const WIKI_PROJECTS_PATH = path.resolve(
  process.cwd(),
  'src/data/wiki-projects.generated.json'
);

const LIMITS = {
  storyLimit: 10,
  storytellerLimit: 10,
  mediaLimit: 24,
};

function createEmptySnapshot() {
  return {
    generatedAt: new Date().toISOString(),
    sourceUrl: null,
    sourceOrganizationId: EMPATHY_LEDGER_ORGANIZATION_ID,
    projectCount: 0,
    projects: {},
  };
}

async function writeSnapshot(snapshot) {
  await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`);
}

async function keepExistingSnapshot(reason) {
  try {
    await fs.access(OUTPUT_PATH);
    console.log(`${reason}, keeping existing EL media snapshot at ${OUTPUT_PATH}`);
    return;
  } catch {
    const emptySnapshot = createEmptySnapshot();
    await writeSnapshot(emptySnapshot);
    console.log(`${reason}, wrote empty EL media snapshot to ${OUTPUT_PATH}`);
  }
}

async function loadWikiProjectMap() {
  try {
    const raw = await fs.readFile(WIKI_PROJECTS_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    const records = Array.isArray(parsed.projects) ? parsed.projects : [];
    return new Map(records.map((record) => [record.slug, record]));
  } catch {
    return new Map();
  }
}

async function loadProjectSlugs() {
  const raw = await fs.readFile(PROJECTS_TS_PATH, 'utf8');
  const slugs = [];
  const pattern = /slug:\s*"([^"]+)"/g;
  let match = pattern.exec(raw);

  while (match) {
    slugs.push(match[1]);
    match = pattern.exec(raw);
  }

  return Array.from(new Set(slugs));
}

async function fetchJson(url) {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  return response.json();
}

function inferMediaKind(type) {
  const normalized = (type || '').toLowerCase();

  if (normalized.startsWith('video')) return 'video';
  if (normalized.startsWith('audio')) return 'audio';
  if (
    normalized.startsWith('image') ||
    normalized === 'photo' ||
    normalized === 'image'
  ) {
    return 'image';
  }

  return 'other';
}

function normalizeThemes(themes) {
  if (!Array.isArray(themes)) {
    return [];
  }

  return themes
    .map((theme) => {
      if (typeof theme === 'string') return theme;
      return theme?.name || null;
    })
    .filter(Boolean);
}

function normalizeOptionalText(value) {
  if (Array.isArray(value)) {
    return value
      .map((entry) => String(entry || '').trim())
      .filter(Boolean)
      .join(', ') || null;
  }

  if (value === null || value === undefined) {
    return null;
  }

  const text = String(value).trim();
  return text || null;
}

function buildFeaturedResponse(projectSlug, wikiRecord, payload) {
  const stories = (payload.stories?.stories || []).map((story, index) => ({
    story_id: story.id,
    story_title: story.title,
    excerpt: story.summary || null,
    themes: normalizeThemes(story.themes),
    featured_image_url: null,
    video_url: null,
    audio_url: null,
    submitted_at: story.publishedAt || new Date().toISOString(),
    storyteller_id: story.authorId || `story-${index}`,
    storyteller_name: story.authorName || null,
    storyteller_display_name: story.authorName || null,
    storyteller_image: null,
    featured_priority: index + 1,
    featured_as_hero: index === 0,
    relevance_score: null,
    ai_reasoning: 'Empathy Ledger sync snapshot from Content Hub.',
    story_url: `${EMPATHY_LEDGER_URL}/stories/${story.id}`,
    content_url: null,
  }));

  const storytellers = (payload.storytellers?.storytellers || []).map(
    (storyteller, index) => ({
      storyteller_id: storyteller.id,
      full_name: storyteller.displayName || null,
      display_name: storyteller.displayName || null,
      bio: storyteller.bio || null,
      profile_image_url: storyteller.avatarUrl || null,
      current_organization: null,
      current_role: null,
      featured_bio: storyteller.bio || null,
      custom_tagline: normalizeOptionalText(storyteller.culturalBackground) ||
        (storyteller.elderStatus ? 'Elder' : null) ||
        null,
      featured_priority: index + 1,
      featured_story_count: stories.filter(
        (story) => story.storyteller_id === storyteller.id
      ).length,
      opted_in_at: new Date().toISOString(),
      approved_at: new Date().toISOString(),
    })
  );

  const mediaItems = (payload.media?.media || []).map((item, index) => {
    const kind = inferMediaKind(item.mediaType);
    const isHero =
      Boolean(item.isHero) ||
      (item.sourceType === 'hero_asset' && kind === 'image') ||
      (index === 0 && kind === 'image');

    return {
      id: item.id,
      url: item.url,
      thumbnail_url: item.thumbnailUrl || null,
      preview_url: item.thumbnailUrl || null,
      type: item.mediaType || kind,
      kind,
      title: item.title || null,
      alt: item.altText || item.title || null,
      caption: item.description || null,
      credit: item.attributionText || null,
      is_hero: isHero,
      is_featured: isHero,
      source: 'content-hub',
    };
  });

  if (stories.length === 0 && storytellers.length === 0 && mediaItems.length === 0) {
    return null;
  }

  return {
    project: {
      slug: projectSlug,
      title: wikiRecord?.title || projectSlug,
      organization: 'A Curious Tractor',
      focus_areas: null,
      themes: null,
      project_id: null,
      organization_id: EMPATHY_LEDGER_ORGANIZATION_ID,
    },
    featured: {
      storytellers,
      stories,
    },
    media: {
      items: mediaItems,
      hero: mediaItems.find((item) => item.is_hero) || mediaItems[0] || null,
    },
    meta: {
      storyteller_count: storytellers.length,
      story_count: stories.length,
      media_count: mediaItems.length,
      gallery_count: 0,
      fetched_at: new Date().toISOString(),
      source: 'content-hub',
      site_slug: null,
    },
  };
}

async function fetchProjectContent(projectSlug, wikiRecord, projectCodeRegistry) {
  const candidateKeys = getProjectKeyCandidates(
    projectSlug,
    wikiRecord,
    projectCodeRegistry
  );
  let bestResponse = null;
  let bestScore = -1;

  for (const candidateKey of candidateKeys) {
    const queryCandidate = encodeURIComponent(candidateKey);
    const orgId = encodeURIComponent(EMPATHY_LEDGER_ORGANIZATION_ID);

    const [stories, storytellers, media] = await Promise.all([
      fetchJson(
        `${EMPATHY_LEDGER_URL}/api/v1/content-hub/stories?project=${queryCandidate}&limit=${LIMITS.storyLimit}`
      ).catch(() => ({ stories: [] })),
      fetchJson(
        `${EMPATHY_LEDGER_URL}/api/v1/content-hub/storytellers?project=${queryCandidate}&limit=${LIMITS.storytellerLimit}`
      ).catch(() => ({ storytellers: [] })),
      fetchJson(
        `${EMPATHY_LEDGER_URL}/api/v1/content-hub/media?project=${queryCandidate}&limit=${LIMITS.mediaLimit}`
      ).catch(() => ({ media: [] })),
    ]);

    const mediaCount = media?.media?.length || 0;
    const storyCount = stories?.stories?.length || 0;
    const storytellerCount = storytellers?.storytellers?.length || 0;
    const hasContent = mediaCount > 0 || storyCount > 0 || storytellerCount > 0;

    if (!hasContent) {
      continue;
    }

    const candidateResponse = buildFeaturedResponse(projectSlug, wikiRecord, {
      stories,
      storytellers,
      media,
    });

    const score = mediaCount * 10000 + storyCount * 100 + storytellerCount;
    if (candidateResponse && score > bestScore) {
      bestResponse = candidateResponse;
      bestScore = score;
    }
  }

  return bestResponse;
}

async function main() {
  try {
    const [staticSlugs, wikiProjectMap, projectCodeRegistry] = await Promise.all([
      loadProjectSlugs(),
      loadWikiProjectMap(),
      loadProjectCodeRegistrySnapshot(),
    ]);

    // Merge static + wiki slugs so wiki-only projects also get synced
    const projectSlugs = [...new Set([...staticSlugs, ...wikiProjectMap.keys()])];

    const limit = pLimit(8);
    const entries = await Promise.all(
      projectSlugs.map((slug) =>
        limit(async () => {
          const content = await fetchProjectContent(
            slug,
            wikiProjectMap.get(slug) || null,
            projectCodeRegistry
          );
          return [slug, content];
        })
      )
    );

    const projects = Object.fromEntries(entries);
    const snapshot = {
      generatedAt: new Date().toISOString(),
      sourceUrl: EMPATHY_LEDGER_URL,
      sourceOrganizationId: EMPATHY_LEDGER_ORGANIZATION_ID,
      projectCount: projectSlugs.length,
      projects,
    };

    await writeSnapshot(snapshot);

    const populatedCount = Object.values(projects).filter(Boolean).length;
    console.log(`synced EL media snapshot for ${populatedCount}/${projectSlugs.length} projects to ${OUTPUT_PATH}`);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Empathy Ledger sync failed';
    await keepExistingSnapshot(`Empathy Ledger sync unavailable (${message})`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
