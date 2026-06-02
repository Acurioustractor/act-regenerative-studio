/** @type {import('next').NextConfig} */
const { launchRedirects } = require('./config/launch-redirects.cjs');

const nextConfig = {
  // Data-heavy routes (/projects/[slug], /ecosystem, /empathy-ledger, /art/*,
  // /sitemap) fetch EL/Supabase at build-time static generation and were blowing
  // the default 60s per-page cap, failing the whole production deploy. Raise the
  // cap so slow-but-finite fetches complete and the build stays fully static.
  // If a fetch ever truly hangs past this, switch those routes to runtime/ISR.
  staticPageGenerationTimeout: 180,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uploads-ssl.webflow.com",
      },
      {
        protocol: "https",
        hostname: "uploads.webflow.com",
      },
      {
        protocol: "https",
        hostname: "assets.website-files.com",
      },
      {
        protocol: "https",
        hostname: "cdn.prod.website-files.com",
      },
      {
        protocol: "https",
        hostname: "tednluwflfhxyucgwigh.supabase.co",
      },
      {
        protocol: "https",
        hostname: "yvnuayzslukamizrlhwb.supabase.co",
      },
      {
        protocol: "https",
        hostname: "uaxhjzqrdotoahjnxmbj.supabase.co",
      },
      {
        protocol: "https",
        hostname: "d1d3n03t5zntha.cloudfront.net",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return launchRedirects;
  },
  // Exclude admin-wiki subdirectory (separate Next.js app)
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  webpack: (config, { isServer }) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/admin-wiki/**', '**/node_modules/**'],
    };
    return config;
  },
};

module.exports = nextConfig;
