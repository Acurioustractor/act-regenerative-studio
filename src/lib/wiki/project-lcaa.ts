/**
 * Project LCAA extractor
 *
 * Reads Listen/Curiosity/Action/Art blocks from a wiki project markdown doc.
 * Source of truth: /Users/benknight/Code/act-global-infrastructure/wiki/projects/<slug>.md
 * (or projects/<cluster>/<slug>.md), resolved via getCanonicalWikiPage.
 *
 * Research loop: because canonical-site-wiki reads live from the filesystem
 * (via the live-wiki tier), every extractor call sees the latest wiki content
 * on the next request — no snapshot rebuild needed for content changes.
 */

import 'server-only';

import { cache } from 'react';

import { getCanonicalWikiPage } from './canonical-site-wiki';

export type LCAAPhase = 'listen' | 'curiosity' | 'action' | 'art';

export interface ProjectLCAA {
  listen: string | null;
  curiosity: string | null;
  action: string | null;
  art: string | null;
  /** The phase most emphasized in the wiki doc (e.g. single-phase projects). */
  primaryPhase: LCAAPhase | null;
  /** Which of the three patterns matched, or null if none. */
  pattern: 'single' | 'table' | 'list' | null;
}

const EMPTY: ProjectLCAA = {
  listen: null,
  curiosity: null,
  action: null,
  art: null,
  primaryPhase: null,
  pattern: null,
};

function stripInlineMarkdown(value: string): string {
  return value
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2')
    .replace(/\[\[([^\]]+)\]\]/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizePhaseName(raw: string): LCAAPhase | null {
  const token = raw.toLowerCase().trim();
  if (token.startsWith('listen')) return 'listen';
  if (token.startsWith('curiosity') || token.startsWith('curious')) return 'curiosity';
  if (token.startsWith('action')) return 'action';
  if (token === 'art' || token.startsWith('art ')) return 'art';
  return null;
}

/**
 * Find the LCAA section body. Accepts headings like:
 *   ## LCAA Phase
 *   ## LCAA Phase: Art
 *   ## LCAA in Practice
 *   ## LCAA Connection
 */
function extractLCAASection(content: string): string | null {
  const match = content.match(
    /^##\s+LCAA[^\n]*\n([\s\S]*?)(?=^##\s|\z)/im
  );
  return match?.[1] ?? null;
}

function parseListPattern(section: string): Partial<Record<LCAAPhase, string>> | null {
  // - **Listen** — description...
  // * **Curiosity** — description...
  const result: Partial<Record<LCAAPhase, string>> = {};
  const lineRe = /^[-*]\s+\*\*([^*]+)\*\*\s*[—–-]\s*(.+?)\s*$/gm;
  let m: RegExpExecArray | null;
  while ((m = lineRe.exec(section)) !== null) {
    const phase = normalizePhaseName(m[1]);
    if (phase && !result[phase]) {
      result[phase] = stripInlineMarkdown(m[2]);
    }
  }
  return Object.keys(result).length > 0 ? result : null;
}

function parseTablePattern(section: string): Partial<Record<LCAAPhase, string>> | null {
  // | **Listen** | value |
  // (separator row with --- is skipped)
  const result: Partial<Record<LCAAPhase, string>> = {};
  const rowRe = /^\s*\|\s*\*\*([^*]+)\*\*\s*\|\s*([^|]+?)\s*\|\s*$/gm;
  let m: RegExpExecArray | null;
  while ((m = rowRe.exec(section)) !== null) {
    const phase = normalizePhaseName(m[1]);
    if (phase && !result[phase]) {
      const value = stripInlineMarkdown(m[2]);
      // Skip pure separator cells like "---"
      if (value && !/^-+$/.test(value)) {
        result[phase] = value;
      }
    }
  }
  return Object.keys(result).length > 0 ? result : null;
}

function parseSinglePhasePattern(
  section: string,
  headingLine: string
): { phase: LCAAPhase; text: string } | null {
  // Heading might specify the phase: "## LCAA Phase: Art"
  const headingPhaseMatch = headingLine.match(/LCAA[^:]*:\s*(\w+)/i);
  const headingPhase = headingPhaseMatch
    ? normalizePhaseName(headingPhaseMatch[1])
    : null;

  // Find the first **Phase** — text block
  const bodyMatch = section.match(
    /\*\*([A-Za-z][A-Za-z +]*?)\*\*\s*[—–-]\s*([^\n]+(?:\n(?!\n|\*\*|-|\|)[^\n]+)*)/
  );
  if (bodyMatch) {
    const phase = normalizePhaseName(bodyMatch[1]) || headingPhase;
    if (phase) {
      return { phase, text: stripInlineMarkdown(bodyMatch[2]) };
    }
  }

  if (headingPhase) {
    // Heading declared a phase but body not bolded — use first paragraph
    const firstPara = section.trim().split(/\n\n/)[0];
    if (firstPara) {
      return { phase: headingPhase, text: stripInlineMarkdown(firstPara) };
    }
  }

  return null;
}

export function parseProjectLCAA(markdown: string): ProjectLCAA {
  const section = extractLCAASection(markdown);
  if (!section) return EMPTY;

  const headingLine =
    markdown.match(/^##\s+LCAA[^\n]*$/im)?.[0] ?? '## LCAA';

  // Prefer list pattern (richest per-phase data), then table, then single.
  const list = parseListPattern(section);
  if (list) {
    const primaryFromHeading = headingLine.match(/LCAA[^:]*:\s*(\w+)/i);
    const primaryPhase = primaryFromHeading
      ? normalizePhaseName(primaryFromHeading[1])
      : null;
    return {
      listen: list.listen ?? null,
      curiosity: list.curiosity ?? null,
      action: list.action ?? null,
      art: list.art ?? null,
      primaryPhase: primaryPhase ?? null,
      pattern: 'list',
    };
  }

  const table = parseTablePattern(section);
  if (table) {
    return {
      listen: table.listen ?? null,
      curiosity: table.curiosity ?? null,
      action: table.action ?? null,
      art: table.art ?? null,
      primaryPhase: null,
      pattern: 'table',
    };
  }

  const single = parseSinglePhasePattern(section, headingLine);
  if (single) {
    return {
      listen: single.phase === 'listen' ? single.text : null,
      curiosity: single.phase === 'curiosity' ? single.text : null,
      action: single.phase === 'action' ? single.text : null,
      art: single.phase === 'art' ? single.text : null,
      primaryPhase: single.phase,
      pattern: 'single',
    };
  }

  return EMPTY;
}

/**
 * Slug resolution — wiki project docs live at one of:
 *   projects/<slug>
 *   projects/<cluster>/<slug>
 * canonical-site-wiki's matcher already handles both via stem-matching, but the
 * cluster layout means we try a few candidates in priority order.
 */
async function resolveProjectWikiPage(slug: string) {
  const candidates = [
    `projects/${slug}`,
    // Cluster variants — each ACT project cluster (act-studio, act-farm,
    // justicehub, picc, smart-recovery, empathy-ledger, the-harvest) may
    // nest its projects.
    `projects/act-studio/${slug}`,
    `projects/act-farm/${slug}`,
    `projects/justicehub/${slug}`,
    `projects/picc/${slug}`,
    `projects/smart-recovery/${slug}`,
    `projects/empathy-ledger/${slug}`,
    `projects/the-harvest/${slug}`,
    // Fall back to slug alone (canonical-site-wiki handles legacy aliases)
    slug,
  ];
  for (const candidate of candidates) {
    const page = await getCanonicalWikiPage(candidate);
    if (page) return page;
  }
  return null;
}

export const getProjectLCAA = cache(
  async (projectSlug: string): Promise<ProjectLCAA> => {
    const page = await resolveProjectWikiPage(projectSlug);
    if (!page) return EMPTY;
    return parseProjectLCAA(page.content);
  }
);

// -----------------------------------------------------------------------------
// Pull-quote extraction — first early blockquote in a wiki project doc
// -----------------------------------------------------------------------------

export interface ProjectWikiQuote {
  text: string;
  author: string | null;
  role: string | null;
}

/**
 * Extract the first blockquote from a wiki project doc, up to ~500 chars in.
 * Most ACT project docs place an epigraph-style quote between the H1 and the
 * first H2 section.
 */
export function parseProjectQuote(markdown: string): ProjectWikiQuote | null {
  // Look in the first ~800 chars (past frontmatter) for an epigraph
  const head = markdown.slice(0, 1200);
  const match = head.match(/^>\s+(.+?)\s*$/m);
  if (!match) return null;
  const text = stripInlineMarkdown(match[1]);
  if (!text || text.length < 8) return null;

  // Attribution lookup: next non-empty line after blockquote often has "— Name, Role"
  const afterQuoteIdx = (match.index ?? 0) + match[0].length;
  const after = markdown.slice(afterQuoteIdx, afterQuoteIdx + 400);
  const attrMatch = after.match(/^\s*\n\s*[—–-]\s*([^,\n]+)(?:,\s*([^\n]+))?\s*$/m);
  const author = attrMatch ? stripInlineMarkdown(attrMatch[1]) : null;
  const role = attrMatch?.[2] ? stripInlineMarkdown(attrMatch[2]) : null;

  return { text, author, role };
}

export const getProjectWikiQuote = cache(
  async (projectSlug: string): Promise<ProjectWikiQuote | null> => {
    const page = await resolveProjectWikiPage(projectSlug);
    if (!page) return null;
    return parseProjectQuote(page.content);
  }
);

// -----------------------------------------------------------------------------
// Stats extraction — bullet-list pattern with bold values
// -----------------------------------------------------------------------------

export interface ProjectWikiStat {
  value: string;
  label: string;
}

const STATS_HEADINGS = /^##\s+.*?(impact|by the numbers|the numbers|key numbers|metrics|stats|at a glance)[^\n]*\n/im;

/**
 * Extract a stats section like:
 *   ## By the Numbers
 *   - **176** total staff
 *   - **25** services delivered
 * Returns up to 6 stats, each with {value, label}.
 */
export function parseProjectStats(markdown: string): ProjectWikiStat[] {
  const headingMatch = markdown.match(STATS_HEADINGS);
  if (!headingMatch) return [];
  const headingEnd = (headingMatch.index ?? 0) + headingMatch[0].length;
  const remainder = markdown.slice(headingEnd);
  const sectionMatch = remainder.match(/^([\s\S]*?)(?=^##\s|\z)/m);
  const section = sectionMatch?.[1] ?? '';
  if (!section) return [];

  const lineRe = /^[-*]\s+\*\*([^*]+)\*\*\s+(.+?)\s*$/gm;
  const stats: ProjectWikiStat[] = [];
  let m: RegExpExecArray | null;
  while ((m = lineRe.exec(section)) !== null && stats.length < 6) {
    const value = stripInlineMarkdown(m[1]);
    const label = stripInlineMarkdown(m[2]);
    if (value && label) stats.push({ value, label });
  }
  return stats;
}

export const getProjectWikiStats = cache(
  async (projectSlug: string): Promise<ProjectWikiStat[]> => {
    const page = await resolveProjectWikiPage(projectSlug);
    if (!page) return [];
    return parseProjectStats(page.content);
  }
);

// -----------------------------------------------------------------------------
// Key People extraction — ## Key People section with wiki-links or bold names
// -----------------------------------------------------------------------------

export interface ProjectWikiPerson {
  /** Display name */
  name: string;
  /** Wiki slug to people/<slug> if the source used a `[[slug|Name]]` link. */
  wikiSlug: string | null;
  /** The descriptive text after the em-dash. */
  context: string | null;
}

/**
 * Parse a `## Key People` section. Two row patterns:
 *   - `- [[wiki-slug|Display Name]] — context text`
 *   - `- **Display Name** — context text` (no wiki link)
 */
export function parseProjectKeyPeople(markdown: string): ProjectWikiPerson[] {
  const sectionMatch = markdown.match(
    /^##\s+Key People[^\n]*\n([\s\S]*?)(?=^##\s|\z)/im
  );
  if (!sectionMatch) return [];
  const section = sectionMatch[1];

  const people: ProjectWikiPerson[] = [];
  const lineRe = /^[-*]\s+(.+?)\s*$/gm;
  let m: RegExpExecArray | null;
  while ((m = lineRe.exec(section)) !== null) {
    const raw = m[1];
    // Pattern 1: [[slug|Name]] — context   OR   [[slug]] — context
    const wikiLinkMatch = raw.match(
      /^\[\[([^\]|]+)(?:\|([^\]]+))?\]\]\s*[—–-]\s*(.+)$/
    );
    if (wikiLinkMatch) {
      const slug = wikiLinkMatch[1].trim();
      const displayName = (wikiLinkMatch[2] || slug).trim();
      people.push({
        name: stripInlineMarkdown(displayName),
        wikiSlug: slug,
        context: stripInlineMarkdown(wikiLinkMatch[3]),
      });
      continue;
    }

    // Pattern 2: **Name** — context
    const boldMatch = raw.match(/^\*\*([^*]+)\*\*\s*[—–-]\s*(.+)$/);
    if (boldMatch) {
      people.push({
        name: stripInlineMarkdown(boldMatch[1]),
        wikiSlug: null,
        context: stripInlineMarkdown(boldMatch[2]),
      });
      continue;
    }
  }

  return people;
}

export const getProjectKeyPeople = cache(
  async (projectSlug: string): Promise<ProjectWikiPerson[]> => {
    const page = await resolveProjectWikiPage(projectSlug);
    if (!page) return [];
    return parseProjectKeyPeople(page.content);
  }
);

// -----------------------------------------------------------------------------
// Backlinks extraction — ## Backlinks section, editorially-curated cross-refs
// -----------------------------------------------------------------------------

export interface ProjectWikiBacklink {
  /** Wiki slug (the part before `|` or the whole link if no pipe). */
  slug: string;
  /** Display name (after `|`, or the slug itself if no pipe). */
  name: string;
}

/**
 * Parse a `## Backlinks` section. Pattern:
 *   - [[slug|Display Name]]
 *   - [[slug-no-pipe]]
 */
export function parseProjectBacklinks(markdown: string): ProjectWikiBacklink[] {
  const sectionMatch = markdown.match(
    /^##\s+Backlinks[^\n]*\n([\s\S]*?)(?=^##\s|\z)/im
  );
  if (!sectionMatch) return [];
  const section = sectionMatch[1];

  const links: ProjectWikiBacklink[] = [];
  const linkRe = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
  let m: RegExpExecArray | null;
  while ((m = linkRe.exec(section)) !== null) {
    const slug = m[1].trim();
    const name = (m[2] || slug).trim();
    if (slug) {
      links.push({ slug, name: stripInlineMarkdown(name) });
    }
  }

  // Dedupe by slug
  const seen = new Set<string>();
  return links.filter((l) => {
    if (seen.has(l.slug)) return false;
    seen.add(l.slug);
    return true;
  });
}

export const getProjectBacklinks = cache(
  async (projectSlug: string): Promise<ProjectWikiBacklink[]> => {
    const page = await resolveProjectWikiPage(projectSlug);
    if (!page) return [];
    return parseProjectBacklinks(page.content);
  }
);
