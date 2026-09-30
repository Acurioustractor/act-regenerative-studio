/**
 * Photographs from Empathy Ledger arrive as full-size originals through its
 * consent-gated route (`/api/media/<id>/file`, a 302 to a signed file). On
 * 30 Sep 2026 that meant 13.4 MB for the ten cards on /stories (one source
 * 8,192px wide for a 266px card) and 31.3 MB for the body photographs of
 * "At the Speed of Ceremony". Sent through Next's optimiser at the width they
 * are shown, the same photographs came to 0.35 MB and 1.86 MB.
 *
 * The optimiser still asks the gate for every photograph, so a withdrawal in
 * Empathy Ledger still removes it; nothing here links to a storage bucket.
 *
 * `next/image` throws on a host that is not in next.config.js remotePatterns,
 * so anything rendered through it is checked against the same list first.
 * optimised-image.test.ts fails if the two lists drift apart.
 */

/** Every hostname in next.config.js `images.remotePatterns`. */
export const OPTIMISABLE_HOSTS = [
  "uploads-ssl.webflow.com",
  "uploads.webflow.com",
  "assets.website-files.com",
  "cdn.prod.website-files.com",
  "tednluwflfhxyucgwigh.supabase.co",
  "yvnuayzslukamizrlhwb.supabase.co",
  "uaxhjzqrdotoahjnxmbj.supabase.co",
  "d1d3n03t5zntha.cloudfront.net",
  "www.empathyledger.com",
  "empathyledger.com",
] as const;

/** Widths the optimiser accepts: a subset of Next's default deviceSizes. */
export const OPTIMISER_WIDTHS = [640, 828, 1200, 1920] as const;
export type OptimiserWidth = (typeof OPTIMISER_WIDTHS)[number];

const EMPATHY_LEDGER_MEDIA =
  /^https:\/\/(?:www\.)?empathyledger\.com\/api\/media\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/file(?:\?[^\s"'<>]*)?$/i;

/** A photograph served by Empathy Ledger's consent-gated media route. */
export function isEmpathyLedgerMedia(src: string | null | undefined): src is string {
  return Boolean(src && EMPATHY_LEDGER_MEDIA.test(src));
}

/** True when next/image can render this without throwing. */
export function isOptimisable(src: string | null | undefined): src is string {
  if (!src) return false;
  if (src.startsWith("/") && !src.startsWith("//")) return true;
  try {
    const url = new URL(src);
    return url.protocol === "https:" && (OPTIMISABLE_HOSTS as readonly string[]).includes(url.hostname);
  } catch {
    return false;
  }
}

/** The optimiser's address for a remote photograph at one width. */
export function optimisedImageUrl(src: string, width: OptimiserWidth, quality = 75): string {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
}

/** A srcset over every optimiser width. */
export function optimisedSrcSet(src: string, quality = 75): string {
  return OPTIMISER_WIDTHS.map((width) => `${optimisedImageUrl(src, width, quality)} ${width}w`).join(", ");
}

/** The widest copy Empathy Ledger's gate will resize to (`?w=`, capped there). */
export const GATE_SOURCE_WIDTH = 2000;

/**
 * The address the optimiser should fetch for an Empathy Ledger photograph.
 *
 * Two savings, both through the same gate. Empathy Ledger answers www with a
 * 308 to the apex domain, an extra hop before the gate's own 302. And the gate
 * resizes on request (`?w=`, up to 2000px), so the optimiser need not pull an
 * 8,192px original to make a 640px card; on 30 Sep 2026 the optimiser timed
 * out on originals of 1.5 to 2.5 MB while the gate was serving them. A width
 * already asked for, or the gate's own thumbnail, is kept as it is.
 */
export function canonicalMediaSrc(src: string): string {
  const apex = src.replace(/^https:\/\/www\.empathyledger\.com\//i, "https://empathyledger.com/");
  if (!isEmpathyLedgerMedia(apex)) return apex;
  const url = new URL(apex);
  if (url.searchParams.has("w") || url.searchParams.get("v") === "thumb") return apex;
  url.searchParams.set("w", String(GATE_SOURCE_WIDTH));
  return url.toString();
}
