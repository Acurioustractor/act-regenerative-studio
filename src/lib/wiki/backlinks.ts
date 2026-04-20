import 'server-only';

import { cache } from 'react';

import {
  getCanonicalWikiPages,
  type CanonicalWikiPageRecord,
} from '@/lib/wiki/canonical-site-wiki';

export interface WikiBacklink {
  title: string;
  stem: string;
  path: string;
  sectionId: string;
  sectionTitle: string;
  href: string;
}

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

function hrefForPage(page: CanonicalWikiPageRecord): string {
  if (page.sectionId === 'projects') {
    return `/projects/${page.stem}`;
  }
  return `/wiki/${page.stem}`;
}

/**
 * Collect every wiki page that references the given page via [[stem]],
 * [[path|label]], or [[section/stem]] wiki-link syntax.
 *
 * Returns backlinks grouped as "from projects" vs "from wiki". Callers can
 * surface them as two separate lanes on the wiki detail page: one tells the
 * reader where this idea shows up in public project work, the other tells
 * them which other wiki pages pick up the same thread.
 */
export const getWikiBacklinksForSlug = cache(
  async (
    slug: string
  ): Promise<{ fromProjects: WikiBacklink[]; fromWiki: WikiBacklink[] }> => {
    const pages = await getCanonicalWikiPages();
    const target = pages.find(
      (page) => normalize(page.stem) === normalize(slug)
    );
    if (!target) return { fromProjects: [], fromWiki: [] };

    const candidates = new Set<string>([
      normalize(target.stem),
      normalize(target.path),
      normalize(`${target.sectionId}/${target.stem}`),
    ]);

    const fromProjects: WikiBacklink[] = [];
    const fromWiki: WikiBacklink[] = [];
    const seen = new Set<string>();

    for (const page of pages) {
      if (page.path === target.path) continue;

      const linkPattern = /\[\[([^\]]+)\]\]/g;
      let match: RegExpExecArray | null;
      let referenced = false;
      while ((match = linkPattern.exec(page.content)) !== null) {
        const raw = match[1].split('|')[0].trim();
        const normalized = normalize(raw);
        if (candidates.has(normalized)) {
          referenced = true;
          break;
        }
      }

      if (!referenced) continue;
      if (seen.has(page.path)) continue;
      seen.add(page.path);

      const entry: WikiBacklink = {
        title: page.title,
        stem: page.stem,
        path: page.path,
        sectionId: page.sectionId,
        sectionTitle: page.sectionTitle,
        href: hrefForPage(page),
      };
      if (page.sectionId === 'projects') {
        fromProjects.push(entry);
      } else {
        fromWiki.push(entry);
      }
    }

    fromProjects.sort((a, b) => a.title.localeCompare(b.title));
    fromWiki.sort((a, b) => a.title.localeCompare(b.title));

    return { fromProjects, fromWiki };
  }
);

/**
 * Other wiki pages in the same section, excluding self. Used as a fallback
 * "keep reading" strip when backlinks alone don't give the reader somewhere
 * obvious to go next.
 */
export const getRelatedWikiPagesInSection = cache(
  async (
    slug: string,
    limit = 5
  ): Promise<WikiBacklink[]> => {
    const pages = await getCanonicalWikiPages();
    const target = pages.find(
      (page) => normalize(page.stem) === normalize(slug)
    );
    if (!target) return [];

    return pages
      .filter(
        (page) =>
          page.sectionId === target.sectionId && page.path !== target.path
      )
      .sort((a, b) => a.title.localeCompare(b.title))
      .slice(0, limit)
      .map((page) => ({
        title: page.title,
        stem: page.stem,
        path: page.path,
        sectionId: page.sectionId,
        sectionTitle: page.sectionTitle,
        href: hrefForPage(page),
      }));
  }
);
