import type { MetadataRoute } from "next";

import { getAllArtSlugs } from "@/lib/art/art-portfolio";
import { getAllStorytellers } from "@/lib/empathy-ledger-storytellers";
import { getSiteEditorialArticles } from "@/lib/empathy-ledger-editorial";
import { listAllWikiPages } from "@/lib/wiki/canonical-site-wiki";
import { getCanonicalWikiProjectRecords } from "@/lib/wiki/canonical-project-wiki";
import { heldProjectSlugs } from "@/lib/projects/public-projects";

const siteUrl = (() => {
  // Reject dev URLs so we never ship a sitemap pointing at localhost.
  // `.env.local` commonly sets NEXT_PUBLIC_SITE_URL to the dev host for previews,
  // which would otherwise poison every <loc> in production.
  const candidate = process.env.NEXT_PUBLIC_SITE_URL || "";
  if (!candidate || /localhost|127\.0\.0\.1|0\.0\.0\.0/.test(candidate)) {
    return process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "https://act-regenerative-studio.vercel.app";
  }
  return candidate;
})();

const staticRoutes: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/projects", changeFrequency: "weekly", priority: 0.9 },
  { path: "/stories", changeFrequency: "weekly", priority: 0.8 },
  // Launch hold (2026-05-27): /storytellers held until >1 consented profile syncs.
  { path: "/art", changeFrequency: "weekly", priority: 0.9 },
  { path: "/farm", changeFrequency: "monthly", priority: 0.8 },
  { path: "/harvest", changeFrequency: "monthly", priority: 0.8 },
  { path: "/goods", changeFrequency: "monthly", priority: 0.8 },
  { path: "/empathy-ledger", changeFrequency: "monthly", priority: 0.8 },
  { path: "/justicehub", changeFrequency: "monthly", priority: 0.8 },
  { path: "/ecosystem", changeFrequency: "monthly", priority: 0.8 },
  { path: "/method", changeFrequency: "monthly", priority: 0.7 },
  // Launch hold (2026-05-27): /wiki held (longer build); see config/launch-redirects.cjs.
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/vision", changeFrequency: "monthly", priority: 0.6 },
  { path: "/principles", changeFrequency: "monthly", priority: 0.6 },
  { path: "/how-we-work", changeFrequency: "monthly", priority: 0.6 },
  { path: "/governance", changeFrequency: "monthly", priority: 0.5 },
  { path: "/studio", changeFrequency: "monthly", priority: 0.6 },
  { path: "/impact", changeFrequency: "monthly", priority: 0.6 },
  { path: "/partners", changeFrequency: "monthly", priority: 0.7 },
  { path: "/events", changeFrequency: "weekly", priority: 0.6 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
  { path: "/media", changeFrequency: "weekly", priority: 0.6 },
  { path: "/people", changeFrequency: "weekly", priority: 0.6 },
  // Launch hold (2026-05-27): /ask (public AI Q&A) held for a later phase.
  { path: "/farm/stay", changeFrequency: "monthly", priority: 0.6 },
  { path: "/farm/retreats", changeFrequency: "monthly", priority: 0.6 },
  { path: "/farm/workshops", changeFrequency: "monthly", priority: 0.6 },
  { path: "/harvest/csa", changeFrequency: "monthly", priority: 0.6 },
  { path: "/harvest/produce", changeFrequency: "monthly", priority: 0.6 },
  { path: "/art/artists", changeFrequency: "monthly", priority: 0.6 },
  { path: "/art/artworks", changeFrequency: "monthly", priority: 0.6 },
  { path: "/art/commissions", changeFrequency: "monthly", priority: 0.6 },
  { path: "/art/exhibitions", changeFrequency: "monthly", priority: 0.6 },
  { path: "/art/residencies", changeFrequency: "monthly", priority: 0.6 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const [wikiPages, projectRecords, storytellers, editorial] = await Promise.all([
    listAllWikiPages().catch(() => []),
    getCanonicalWikiProjectRecords().catch(() => []),
    Promise.resolve(getAllStorytellers()).catch(() => []),
    getSiteEditorialArticles().catch(() => []),
  ]);

  const artSlugs = getAllArtSlugs();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const held = heldProjectSlugs();
  const projectEntries: MetadataRoute.Sitemap = projectRecords
    .filter((record) => !held.has(record.slug) && !held.has(record.websiteSlug || record.slug))
    .map((record) => ({
      url: `${siteUrl}/projects/${record.websiteSlug || record.slug}`,
      lastModified: record.modifiedAt ? new Date(record.modifiedAt) : now,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  const wikiEntries: MetadataRoute.Sitemap = wikiPages.map((page) => ({
    url: `${siteUrl}/wiki/${page.stem}`,
    lastModified: page.modifiedAt ? new Date(page.modifiedAt) : now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const storytellerEntries: MetadataRoute.Sitemap = storytellers.map((s) => ({
    url: `${siteUrl}/storytellers/${s.id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const artEntries: MetadataRoute.Sitemap = artSlugs.map((slug) => ({
    url: `${siteUrl}/art/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const editorialEntries: MetadataRoute.Sitemap = editorial
    .filter((article) => article.slug)
    .map((article) => ({
      url: `${siteUrl}/blog/${article.slug}`,
      lastModified: article.publishedAt ? new Date(article.publishedAt) : now,
      changeFrequency: "monthly",
      priority: 0.5,
    }));

  return [
    ...staticEntries,
    ...projectEntries,
    // Launch hold (2026-05-27): wiki + storyteller URLs withheld while those
    // surfaces are held. Both stay computed for an easy restore.
    // ...wikiEntries,
    // ...storytellerEntries,
    ...artEntries,
    ...editorialEntries,
  ];
}
