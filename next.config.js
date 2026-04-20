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
