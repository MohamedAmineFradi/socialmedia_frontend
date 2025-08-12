/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow avatars and external images used across the app
    domains: [
      'avatars.githubusercontent.com',
      'duckduckgo.com',
      'external-content.duckduckgo.com',
      'ui-avatars.com',
      'tse1.mm.bing.net',
      'imgs.search.brave.com'
    ],
    // Alternatively, you can use remotePatterns for finer control
    // remotePatterns: [
    //   { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    //   { protocol: 'https', hostname: 'duckduckgo.com' },
    //   { protocol: 'https', hostname: 'external-content.duckduckgo.com' },
    //   { protocol: 'https', hostname: 'ui-avatars.com' },
    //   { protocol: 'https', hostname: 'tse1.mm.bing.net' }
    // ]
  }
};

export default nextConfig;
