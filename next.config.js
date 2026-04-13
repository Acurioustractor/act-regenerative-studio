/** @type {import('next').NextConfig} */
const nextConfig = {
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
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      // Internal docs → wiki
      { source: '/governance', destination: '/wiki/governance', permanent: true },
      { source: '/principles', destination: '/wiki/principles', permanent: true },
      { source: '/how-we-work', destination: '/wiki/how-we-work', permanent: true },
      { source: '/vision', destination: '/wiki/vision', permanent: true },
      { source: '/ecosystem', destination: '/wiki/ecosystem', permanent: true },
      { source: '/impact', destination: '/wiki/impact', permanent: true },
      { source: '/studio', destination: '/wiki/studio-capabilities', permanent: true },
      // Merged pages
      { source: '/events', destination: '/farm', permanent: true },
      { source: '/people', destination: '/about', permanent: true },
      { source: '/farm/stay', destination: '/farm', permanent: true },
      { source: '/farm/retreats', destination: '/farm', permanent: true },
      { source: '/farm/workshops', destination: '/farm', permanent: true },
      { source: '/harvest/csa', destination: '/harvest', permanent: true },
      { source: '/harvest/produce', destination: '/harvest', permanent: true },
      // Art sub-pages → main art page
      { source: '/art/artists', destination: '/art', permanent: true },
      { source: '/art/artworks', destination: '/art', permanent: true },
      { source: '/art/commissions', destination: '/contact', permanent: true },
      { source: '/art/exhibitions', destination: '/art', permanent: true },
      { source: '/art/residencies', destination: '/farm', permanent: true },
    ];
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
