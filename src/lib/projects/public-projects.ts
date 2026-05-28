import { getCanonicalWikiProjectRecords } from "@/lib/wiki/canonical-project-wiki";
// Shared with next.config.js — the single source of truth for which /projects/<slug>
// routes are redirected away (flagship promotions, slug renames, demoted events).
import { launchRedirects } from "../../../config/launch-redirects.cjs";

type LaunchRedirect = { source: string; destination: string; permanent?: boolean };

/** `/projects/<slug>` paths that 301/307 away, so they are not real public pages. */
function redirectedProjectPaths(): Set<string> {
  const paths = new Set<string>();
  for (const redirect of launchRedirects as LaunchRedirect[]) {
    if (!redirect.source.startsWith("/projects/")) continue;
    // Drop any param/wildcard suffix (e.g. `/projects/:slug*`) and trailing slash.
    paths.add(redirect.source.replace(/\/:.*$/, "").replace(/\/$/, ""));
  }
  return paths;
}

/**
 * Single source of truth for "held" project slugs: any project with a
 * `/projects/<slug>` redirect (launch holds, slug renames, demoted entries).
 * A held project is removed everywhere it would otherwise be linked — the page
 * (redirect), the public count, the sitemap, the /projects index, the homepage
 * mosaic, and related-projects. To hide a project, add one redirect line in
 * config/launch-redirects.cjs.
 */
export function heldProjectSlugs(): Set<string> {
  const slugs = new Set<string>();
  for (const path of redirectedProjectPaths()) {
    const slug = path.replace(/^\/projects\//, "");
    if (slug) slugs.add(slug);
  }
  return slugs;
}

/** True when a project slug (or its website alias) is held off the public launch. */
export function isHeldProject(slug: string | null | undefined, websiteSlug?: string | null): boolean {
  if (!slug && !websiteSlug) return false;
  const held = heldProjectSlugs();
  return (slug ? held.has(slug) : false) || (websiteSlug ? held.has(websiteSlug) : false);
}

let redirectDestinationCache: Map<string, string> | null = null;

/** Each `/projects/<slug>` redirect's destination, keyed by slug. Cached — the
 *  launch-redirects config is static, so this is built once per process. */
function projectRedirectDestinations(): Map<string, string> {
  if (redirectDestinationCache) return redirectDestinationCache;
  const map = new Map<string, string>();
  for (const redirect of launchRedirects as LaunchRedirect[]) {
    if (!redirect.source.startsWith("/projects/")) continue;
    const slug = redirect.source.replace(/\/:.*$/, "").replace(/\/$/, "").replace(/^\/projects\//, "");
    if (slug) map.set(slug, redirect.destination);
  }
  redirectDestinationCache = map;
  return map;
}

/**
 * Resolve a project slug (as referenced by people chips, related lists, etc.) to
 * the URL it should link to, following launch redirects so a chip never lands on
 * a redirect bounce:
 *  - a flagship rename or section demotion returns its real destination
 *    (`the-harvest` -> `/harvest`, `global-laundry-alliance` -> `/events`);
 *  - a fully-held project, whose redirect points at the generic `/projects`
 *    index, returns `null` so the caller drops the chip rather than link to a
 *    dead-end (`grantscope`);
 *  - anything else returns its own `/projects/<slug>` page.
 */
export function resolveProjectChipHref(slug: string): string | null {
  const dest = projectRedirectDestinations().get(slug);
  if (!dest) return `/projects/${slug}`;
  if (dest === "/projects") return null;
  return dest;
}

/**
 * Distinct, publicly-reachable project pages: every canonical project record that
 * resolves to a `/projects/<slug>` route which is not redirected away. Mirrors the
 * slug the sitemap derives (`websiteSlug || slug`) so the count tracks the live site.
 */
export async function getPublicProjectCount(): Promise<number> {
  const records = await getCanonicalWikiProjectRecords();
  const redirected = redirectedProjectPaths();
  const seen = new Set<string>();
  for (const record of records) {
    const slug = record.websiteSlug || record.slug;
    if (!slug) continue;
    const path = `/projects/${slug}`;
    if (redirected.has(path) || seen.has(path)) continue;
    seen.add(path);
  }
  return seen.size;
}
