import type { CuratedProjectCardConfig } from "@/lib/projects/build-curated-project-cards";

/**
 * Curated cards for the studio surfaces and the site footer.
 *
 * `href` must point at a route that returns 200. The old per-project hubs
 * (/justicehub, /goods, /empathy-ledger, /farm) are now 307s into the field
 * pages and /about, so linking to them sent visitors through a redirect and
 * showed crawlers a wall of soft-404s. Verify with `node scripts/sweep-routes.mjs`
 * before changing any href here.
 *
 * Black Cockatoo Valley has no field page of its own; its story lives in the
 * history section of /about.
 */

export const studioProjectConfigs: CuratedProjectCardConfig[] = [
  {
    slug: "justicehub",
    eyebrow: "Justice",
    href: "/fields/justice",
    fallbackTitle: "JusticeHub",
    fallbackTagline: "Youth justice and community support",
    fallbackDescription:
      "Justice models, evidence, and community-owned infrastructure.",
  },
  {
    slug: "goods",
    eyebrow: "Goods",
    href: "/fields/goods",
    fallbackTitle: "Goods on Country",
    fallbackTagline: "Circular economy for remote communities",
    fallbackDescription:
      "Goods, manufacturing, procurement, and circular value held closer to community.",
  },
  {
    slug: "the-harvest",
    eyebrow: "Commons",
    href: "/harvest",
    fallbackTitle: "The Harvest",
    fallbackTagline: "Community hub and Community Supported Agriculture programs",
    fallbackDescription:
      "Gatherings, local enterprise, and practical exchange rooted in place.",
  },
  {
    slug: "empathy-ledger",
    eyebrow: "Stories",
    href: "/fields/empathy",
    fallbackTitle: "Empathy Ledger",
    fallbackTagline: "Ethical storytelling platform",
    fallbackDescription:
      "Consent-first storytelling, archival care, and narrative sovereignty infrastructure.",
  },
  {
    slug: "black-cockatoo-valley",
    eyebrow: "Land",
    href: "/about#history",
    fallbackTitle: "Black Cockatoo Valley",
    fallbackTagline: "Regenerative residencies on Jinibara Country",
    fallbackDescription:
      "Land practice, conservation, and residencies on Jinibara Country.",
  },
];
