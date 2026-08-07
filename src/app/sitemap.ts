import type { MetadataRoute } from "next";

import { fieldQuestions } from "@/data/field-questions";
import { getAllArtSlugs } from "@/lib/art/art-portfolio";
import { getSiteEditorialArticles } from "@/lib/empathy-ledger-editorial";
import { storyPackets } from "@/lib/stories/story-packets";

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
  { path: "/confessions", changeFrequency: "weekly", priority: 0.9 },
  { path: "/confessions/listen", changeFrequency: "weekly", priority: 0.8 },
  { path: "/confessions/friday", changeFrequency: "weekly", priority: 0.8 },
  // /confessions/wall is not listed: the Payout Wall was retired from the
  // campaign and the route 307s to /confessions/listen. The redirect stays for
  // shared links, but a URL that redirects must not be advertised in a sitemap.
  { path: "/confessions/method", changeFrequency: "monthly", priority: 0.5 },
  { path: "/stories", changeFrequency: "weekly", priority: 0.8 },
  { path: "/questions", changeFrequency: "weekly", priority: 0.7 },
  { path: "/fields/art", changeFrequency: "monthly", priority: 0.7 },
  { path: "/fields/empathy", changeFrequency: "monthly", priority: 0.7 },
  { path: "/fields/justice", changeFrequency: "monthly", priority: 0.7 },
  { path: "/fields/goods", changeFrequency: "monthly", priority: 0.7 },
  { path: "/fields/harvest", changeFrequency: "monthly", priority: 0.7 },
  { path: "/art", changeFrequency: "weekly", priority: 0.9 },
  { path: "/harvest", changeFrequency: "monthly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
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

  const editorial = await getSiteEditorialArticles().catch(() => []);

  const artSlugs = getAllArtSlugs();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const questionEntries: MetadataRoute.Sitemap = fieldQuestions.map(
    (question) => ({
      url: `${siteUrl}/questions/${question.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    }),
  );

  const artEntries: MetadataRoute.Sitemap = artSlugs.map((slug) => ({
    url: `${siteUrl}/art/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // Authored story packets share the /stories/[slug] space with editorial
  // articles (route unification, 2026-08-07). Only published packets are
  // indexed; public-preview and internal ones render noindex, and listing a
  // noindex page in the sitemap would contradict it.
  const packetEntries: MetadataRoute.Sitemap = storyPackets
    .filter((story) => story.status === "published")
    .map((story) => ({
      url: `${siteUrl}/stories/${story.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  const packetUrls = new Set(packetEntries.map((entry) => entry.url));

  const editorialEntries: MetadataRoute.Sitemap = editorial
    .filter((article) => article.slug)
    .map((article) => ({
      url: `${siteUrl}/stories/${article.slug}`,
      lastModified: article.publishedAt ? new Date(article.publishedAt) : now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }))
    // A slug collision resolves to the packet on the page; keep the sitemap
    // consistent with that.
    .filter((entry) => !packetUrls.has(entry.url));

  return [
    ...staticEntries,
    ...questionEntries,
    ...artEntries,
    ...packetEntries,
    ...editorialEntries,
  ];
}
