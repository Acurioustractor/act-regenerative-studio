/**
 * Live state of every ACT site, read from the shared database table
 * `ecosystem_sites`. The table is written by the infra Vercel sync and the
 * Vercel deployment webhook; this module only reads it with the public key.
 *
 * Empty array, never a throw, when the key is missing or the read fails: the
 * page renders without the strip rather than failing the build.
 */

export type SiteStatus = "live" | "building" | "broken" | "canceled" | "unknown" | "external" | "archived";

export interface SiteState {
  slug: string;
  name: string;
  url: string | null;
  projectCode: string;
  status: SiteStatus;
  lastDeploymentAt: string | null;
  lastCheckAt: string | null;
  /** Empathy Ledger syndication site this site reads stories as; null when it has none. */
  elSiteSlug: string | null;
  /** Articles + stories consented to this site in Empathy Ledger at the last sync. */
  storiesConsented: number | null;
  /** Last time the site pulled from Empathy Ledger; null means never. */
  storiesLastPullAt: string | null;
}

interface SiteRow {
  slug: string;
  name: string;
  url: string | null;
  project_code: string;
  status: string | null;
  last_deployment_at: string | null;
  last_check_at: string | null;
  el_site_slug?: string | null;
  stories_consented?: number | null;
  stories_last_pull_at?: string | null;
}

const STATUSES: SiteStatus[] = ["live", "building", "broken", "canceled", "unknown", "external", "archived"];

export function normalizeStatus(value: string | null | undefined): SiteStatus {
  return STATUSES.includes(value as SiteStatus) ? (value as SiteStatus) : "unknown";
}

/** Public wording. Deploy vocabulary stays out of the page. */
export function describeStatus(status: SiteStatus): { label: string; tone: "good" | "warn" | "bad" | "muted" } {
  switch (status) {
    case "live":
      return { label: "Online", tone: "good" };
    case "building":
      return { label: "Updating", tone: "warn" };
    case "broken":
      return { label: "Needs attention", tone: "bad" };
    case "canceled":
      return { label: "Paused", tone: "muted" };
    case "external":
      return { label: "Hosted elsewhere", tone: "muted" };
    case "archived":
      return { label: "Retired", tone: "muted" };
    default:
      return { label: "Unknown", tone: "muted" };
  }
}

export function rowToSiteState(row: SiteRow): SiteState {
  return {
    slug: row.slug,
    name: row.name,
    url: row.url,
    projectCode: row.project_code,
    status: normalizeStatus(row.status),
    lastDeploymentAt: row.last_deployment_at,
    lastCheckAt: row.last_check_at,
    elSiteSlug: row.el_site_slug ?? null,
    storiesConsented: row.stories_consented ?? null,
    storiesLastPullAt: row.stories_last_pull_at ?? null,
  };
}

/**
 * The one thing this column exists to catch: stories consented to a site that
 * the site has never asked for. Consent without consumption is silent drift.
 */
export function storyState(site: Pick<SiteState, "elSiteSlug" | "storiesConsented" | "storiesLastPullAt">): { label: string; tone: "good" | "warn" | "muted" } {
  if (!site.elSiteSlug) return { label: "No story feed", tone: "muted" };
  const n = site.storiesConsented ?? 0;
  if (n === 0) return { label: "Nothing consented yet", tone: "muted" };
  if (!site.storiesLastPullAt) return { label: `${n} consented, never pulled`, tone: "warn" };
  return { label: `${n} consented, pulled ${relativeTime(site.storiesLastPullAt) ?? site.storiesLastPullAt.slice(0, 10)}`, tone: "good" };
}

/** "3 days ago" style, coarse on purpose. */
export function relativeTime(iso: string | null, now: Date = new Date()): string | null {
  if (!iso) return null;
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return null;
  const days = Math.floor((now.getTime() - then) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  const years = Math.floor(days / 365);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

export async function getSiteStates(): Promise<SiteState[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  try {
    const res = await fetch(
      `${url}/rest/v1/ecosystem_sites?select=slug,name,url,project_code,status,last_deployment_at,last_check_at,el_site_slug,stories_consented,stories_last_pull_at&project_code=not.is.null&order=name.asc`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: "no-store" },
    );
    if (!res.ok) return [];
    const rows = (await res.json()) as SiteRow[];
    return Array.isArray(rows) ? rows.map(rowToSiteState) : [];
  } catch {
    return [];
  }
}

export function siteStatesByProjectCode(states: SiteState[]): Map<string, SiteState[]> {
  const map = new Map<string, SiteState[]>();
  for (const s of states) {
    if (!map.has(s.projectCode)) map.set(s.projectCode, []);
    map.get(s.projectCode)!.push(s);
  }
  return map;
}
