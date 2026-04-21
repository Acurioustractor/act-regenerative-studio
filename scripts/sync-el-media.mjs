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
const ART_PORTFOLIO_PATH = path.resolve(process.cwd(), 'src/lib/art/art-portfolio.ts');
const WIKI_PROJECTS_PATH = path.resolve(
  process.cwd(),
  'src/data/wiki-projects.generated.json'
);

const LIMITS = {
  storyLimit: 10,
  storytellerLimit: 10,
  // Per-project media cap. EL's content-hub API is paginated at 50/page so
  // we page through up to this total. 250 covers every current EL project
  // (largest is "The Harvest" at 239 media).
  mediaLimit: 250,
  // Per-organisation pool for the image picker. Paginated at 50/page (EL cap).
  orgMediaLimit: 500,
};

// EL organisations indexed by slug. The content-hub media endpoint filters
// by `organization_id` (UUID) only — the `organization` (slug) param is
// silently ignored. This registry lets us resolve slug → UUID for the sync.
// Keep this in sync with the `organizations` table in EL.
const EL_ORG_REGISTRY = [
  { slug: "a-curious-tractor", name: "A Curious Tractor", id: "db0de7bd-eb10-446b-99e9-0f3b7c199b8a" },
  { slug: "bg-fit", name: "BG Fit", id: "cb749bd5-1658-4fb1-a1f1-0bb173a8e8f4" },
  { slug: "confit-pathways", name: "Confit Pathways", id: "f7f70fd6-bb60-4004-a910-bafbeb594caf" },
  { slug: "diagrama", name: "Diagrama", id: "fbe80fa6-8f25-413b-b1b5-43e132341732" },
  { slug: "ecstra-foundation-limited", name: "Ecstra Foundation", id: "f785a540-bc60-4f90-9569-3828885f1765" },
  { slug: "fishers-oysters", name: "Fishers Oysters", id: "d44703a8-78c7-47d9-bac9-b4714bb183c0" },
  { slug: "global-laundry-alliance", name: "Global Laundry Alliance", id: "5492bb3c-53f0-46d5-9676-4667e6ef4095" },
  { slug: "independent-storytellers", name: "Independent Storytellers", id: "0a1bd4a5-5e01-470f-83f6-f55f86c0aa83" },
  { slug: "june-canavan-foundation", name: "June Canavan Foundation", id: "460955e2-8926-4b3d-a5a3-b2ed3d54a46c" },
  { slug: "justicehub", name: "JusticeHub", id: "0e878fa2-0b44-49b7-86d7-ecf169345582" },
  { slug: "minderoo-foundation", name: "Minderoo Foundation", id: "808aa0dc-a8d7-4976-ae3e-ab75a71587c7" },
  { slug: "mingaminga-rangers", name: "MingaMinga Rangers", id: "3a924e56-4c2b-4775-858f-20a3f57008b2" },
  { slug: "mmeic", name: "MMEIC", id: "220e657b-a1e5-41ff-8781-4bd9cf7468da" },
  { slug: "mounty-yarns", name: "Mounty Yarns", id: "e08b256c-0adf-41ce-b641-e373024c3927" },
  { slug: "oonchiumpa", name: "Oonchiumpa", id: "c53077e1-98de-4216-9149-6268891ff62e" },
  { slug: "orange-sky", name: "Orange Sky", id: "1d542d98-38ea-4f1f-b1ad-60dced1a2985" },
  { slug: "palm-island-community-company", name: "Palm Island Community Company", id: "084f851c-72e0-41fb-b5ba-f3088f44862d" },
  { slug: "paul-ramsay-foundation-limited", name: "Paul Ramsay Foundation", id: "f7e27906-f25f-4dd8-881a-fe8b318321e4" },
  { slug: "rio-tinto-foundation", name: "Rio Tinto Foundation", id: "5e5aba94-27f1-4088-98e4-97f87dcb250e" },
  { slug: "smart-recovery", name: "SMART Recovery Australia", id: "57046635-d996-43bc-b290-da886fa049c7" },
  { slug: "snow-foundation", name: "Snow Foundation", id: "4a1c31e8-89b7-476d-a74b-0c8b37efc850" },
  { slug: "the-buttery", name: "The Buttery", id: "94f4d7f1-9334-48db-953f-12b2c042309b" },
  { slug: "the-trustee-for-the-ian-potter-foundation", name: "Ian Potter Foundation", id: "e2678b97-ddc2-47b2-9744-52cbb39c094d" },
  { slug: "tomnet", name: "TOMNET", id: "087e9e7e-40c0-4b11-8054-5b4ccfa647c5" },
  { slug: "young-guns", name: "Young Guns", id: "b8385439-b76e-47ae-9911-5a9c933396d2" },
];

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
  const sources = [PROJECTS_TS_PATH, ART_PORTFOLIO_PATH];
  const slugs = [];
  for (const filePath of sources) {
    try {
      const raw = await fs.readFile(filePath, 'utf8');
      // Match `slug: '...'` or `slug: "..."` so it works in both files
      const pattern = /\bslug:\s*['"]([^'"]+)['"]/g;
      let m;
      while ((m = pattern.exec(raw))) slugs.push(m[1]);
    } catch {
      // Optional source — ignore if missing
    }
  }
  return Array.from(new Set(slugs));
}

/**
 * Parse each ACT project's explicit `elProjectSlugs` so the sync can pull
 * media from multiple EL projects and merge them into this project's pool.
 * Returns { [actSlug]: string[] }.
 */
async function loadElProjectSlugMap() {
  const result = {};
  for (const filePath of [PROJECTS_TS_PATH, ART_PORTFOLIO_PATH]) {
    let raw;
    try {
      raw = await fs.readFile(filePath, 'utf8');
    } catch {
      continue;
    }
    // Match either ' or " quoting; empathyLedger may sit anywhere within the
    // record. Use a non-greedy capture so we stop at the first closing brace.
    const projectRe = /\bslug:\s*['"]([^'"]+)['"][\s\S]*?empathyLedger:\s*\{([\s\S]*?)\}/g;
    let m;
    while ((m = projectRe.exec(raw))) {
      const actSlug = m[1];
      const inner = m[2];
      const arr = /["']?elProjectSlugs["']?\s*:\s*\[([^\]]*)\]/.exec(inner);
      if (!arr) continue;
      const slugs = [...arr[1].matchAll(/['"]([^'"]+)['"]/g)].map((x) => x[1]);
      if (slugs.length > 0) result[actSlug] = slugs;
    }
  }
  return result;
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

async function fetchOrganizationMedia(org) {
  const pageLimit = 50; // EL endpoint hard-caps at 50
  const maxItems = LIMITS.orgMediaLimit;
  const items = [];
  const seen = new Set();
  let page = 1;

  while (items.length < maxItems) {
    const params = new URLSearchParams({
      organization_id: org.id,
      limit: String(pageLimit),
      page: String(page),
    });
    const payload = await fetchJson(
      `${EMPATHY_LEDGER_URL}/api/v1/content-hub/media?${params.toString()}`
    ).catch(() => null);

    const batch = payload?.media || [];
    if (batch.length === 0) break;

    for (const item of batch) {
      if (!item?.id || seen.has(item.id)) continue;
      if (!item.url) continue;
      seen.add(item.id);
      const kind = inferMediaKind(item.mediaType);
      if (kind !== 'image' && kind !== 'video') continue;
      items.push({
        id: item.id,
        url: item.url,
        thumbnail_url: item.thumbnailUrl || null,
        preview_url: item.thumbnailUrl || null,
        type: item.mediaType || 'image',
        kind,
        title: item.title || null,
        alt: item.altText || item.title || null,
        caption: item.description || null,
        credit: item.attributionText || null,
        is_hero: Boolean(item.isHero),
        is_featured: Boolean(item.isHero),
        source: 'content-hub',
      });
      if (items.length >= maxItems) break;
    }

    if (!payload?.pagination?.hasMore) break;
    page += 1;
  }

  if (items.length === 0) return null;

  return {
    org: { slug: org.slug, name: org.name, id: org.id },
    media: { items },
    meta: {
      media_count: items.length,
      fetched_at: new Date().toISOString(),
      source: 'content-hub',
    },
  };
}

async function fetchProjectContent(projectSlug, wikiRecord, projectCodeRegistry, extraElSlugs = []) {
  const candidateKeys = Array.from(
    new Set([
      ...getProjectKeyCandidates(projectSlug, wikiRecord, projectCodeRegistry),
      ...extraElSlugs,
    ])
  );
  let bestResponse = null;
  let bestScore = -1;
  // Accumulate media across ALL candidates that return content, so that
  // when an ACT project spans multiple EL projects (e.g. MMEIC Cultural
  // Initiative + Quandamooka Justice), the panel sees the union.
  const mergedMedia = [];
  const seenMediaIds = new Set();

  for (const candidateKey of candidateKeys) {
    const queryCandidate = encodeURIComponent(candidateKey);
    const orgId = encodeURIComponent(EMPATHY_LEDGER_ORGANIZATION_ID);

    // Project-scoped fetches. The per-organisation image pool is now
    // synced separately into snapshot.organizations and surfaced by the
    // image picker, so there's no partner-org merge here.
    const [stories, storytellers, media] = await Promise.all([
      fetchJson(
        `${EMPATHY_LEDGER_URL}/api/v1/content-hub/stories?project=${queryCandidate}&limit=${LIMITS.storyLimit}`
      ).catch(() => ({ stories: [] })),
      fetchJson(
        `${EMPATHY_LEDGER_URL}/api/v1/content-hub/storytellers?project=${queryCandidate}&limit=${LIMITS.storytellerLimit}`
      ).catch(() => ({ storytellers: [] })),
      (async () => {
        // EL caps limit at 50/page; paginate until we reach mediaLimit.
        const pageLimit = 50;
        const merged = [];
        const seenIds = new Set();
        let page = 1;
        while (merged.length < LIMITS.mediaLimit) {
          const params = new URLSearchParams({
            project: candidateKey,
            limit: String(pageLimit),
            page: String(page),
          });
          const resp = await fetchJson(
            `${EMPATHY_LEDGER_URL}/api/v1/content-hub/media?${params.toString()}`
          ).catch(() => null);
          const batch = resp?.media || [];
          if (batch.length === 0) break;
          for (const item of batch) {
            if (!item?.id || seenIds.has(item.id)) continue;
            seenIds.add(item.id);
            merged.push(item);
            if (merged.length >= LIMITS.mediaLimit) break;
          }
          if (!resp?.pagination?.hasMore) break;
          page += 1;
        }
        return { media: merged };
      })(),
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

    // Merge media from every candidate so projects spanning multiple EL
    // records (e.g. MMEIC Cultural Initiative + Quandamooka Justice) see
    // the union rather than whichever one wins the score tiebreaker.
    if (candidateResponse?.media?.items) {
      for (const item of candidateResponse.media.items) {
        if (!item?.id || seenMediaIds.has(item.id)) continue;
        seenMediaIds.add(item.id);
        mergedMedia.push(item);
      }
    }

    const score = mediaCount * 10000 + storyCount * 100 + storytellerCount;
    if (candidateResponse && score > bestScore) {
      bestResponse = candidateResponse;
      bestScore = score;
    }
  }

  if (bestResponse && mergedMedia.length > 0) {
    bestResponse = {
      ...bestResponse,
      media: {
        items: mergedMedia.slice(0, LIMITS.mediaLimit),
        hero:
          mergedMedia.find((item) => item.is_hero) ||
          mergedMedia[0] ||
          null,
      },
      meta: {
        ...bestResponse.meta,
        media_count: Math.min(mergedMedia.length, LIMITS.mediaLimit),
      },
    };
  }

  return bestResponse;
}

async function main() {
  try {
    const [staticSlugs, wikiProjectMap, projectCodeRegistry, elProjectSlugMap] = await Promise.all([
      loadProjectSlugs(),
      loadWikiProjectMap(),
      loadProjectCodeRegistrySnapshot(),
      loadElProjectSlugMap(),
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
            projectCodeRegistry,
            elProjectSlugMap[slug] || []
          );
          return [slug, content];
        })
      )
    );

    const orgEntries = await Promise.all(
      EL_ORG_REGISTRY.map((org) =>
        limit(async () => {
          const content = await fetchOrganizationMedia(org);
          return [org.slug, content];
        })
      )
    );

    const projects = Object.fromEntries(entries);
    const organizations = Object.fromEntries(orgEntries);

    const snapshot = {
      generatedAt: new Date().toISOString(),
      sourceUrl: EMPATHY_LEDGER_URL,
      sourceOrganizationId: EMPATHY_LEDGER_ORGANIZATION_ID,
      projectCount: projectSlugs.length,
      projects,
      organizations,
    };

    await writeSnapshot(snapshot);

    const populatedProjectCount = Object.values(projects).filter(Boolean).length;
    const populatedOrgCount = Object.values(organizations).filter(Boolean).length;
    const totalOrgImages = Object.values(organizations)
      .filter(Boolean)
      .reduce((sum, entry) => sum + (entry.media?.items?.length || 0), 0);
    console.log(
      `synced EL media snapshot: ${populatedProjectCount}/${projectSlugs.length} projects, ` +
        `${populatedOrgCount}/${EL_ORG_REGISTRY.length} orgs (${totalOrgImages} images) → ${OUTPUT_PATH}`
    );
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
