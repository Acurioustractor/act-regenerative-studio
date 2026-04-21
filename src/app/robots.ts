import type { MetadataRoute } from "next";

const siteUrl = (() => {
  // Match sitemap.ts: reject dev URLs so production robots.txt never points at localhost.
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

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/image-picker/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
