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
