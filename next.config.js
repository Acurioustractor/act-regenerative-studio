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
    return [
      { source: '/lcaa', destination: '/method', permanent: true },
      { source: '/wiki/new', destination: '/wiki', permanent: true },
      { source: '/engine', destination: '/admin/engine', permanent: true },
      { source: '/image-picker', destination: '/admin/image-picker', permanent: true },
      { source: '/media-lab', destination: '/admin/media-lab', permanent: true },
      { source: '/wiki/source-packets', destination: '/admin/source-packets', permanent: true },
      { source: '/wiki/source-bridges', destination: '/admin/source-bridges', permanent: true },
      // Canonical-slug renames (2026-04-23) — see memory/project_canonical_list.md
      { source: '/projects/diagrama-spain', destination: '/projects/diagrama', permanent: true },
      { source: '/projects/bg-fit-mount-isa', destination: '/projects/bg-fit', permanent: true },
      { source: '/projects/smart-hcp-gp-uplift', destination: '/projects/smart-hcp-uplift', permanent: true },
      // Deleted/demoted entries redirect to parent context
      { source: '/projects/green-harvest-witta', destination: '/harvest', permanent: true },
      { source: '/projects/project-her-self', destination: '/projects', permanent: true },
      { source: '/projects/act-monthly-dinners', destination: '/events', permanent: true },
      { source: '/projects/10x10-retreat', destination: '/events', permanent: true },
      { source: '/projects/westpac-summit-2025', destination: '/events', permanent: true },
      { source: '/projects/bupa-tfn-pitch', destination: '/events', permanent: true },
      { source: '/projects/naidoc-week-mount-isa', destination: '/events', permanent: true },
      { source: '/projects/dad-lab-25', destination: '/events', permanent: true },
      { source: '/projects/anat-spectra-2025', destination: '/events', permanent: true },
      { source: '/projects/cars-and-microcontrollers', destination: '/events', permanent: true },
      { source: '/projects/global-laundry-alliance', destination: '/events', permanent: true },
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
