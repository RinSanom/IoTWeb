import type { NextConfig } from "next";

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: false, // Enable PWA in all environments
  register: true,
  skipWaiting: true,
  sw: 'sw.js',
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
        networkTimeoutSeconds: 10,
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ],
  fallbacks: {
    document: '/offline.html',
  },
  publicExcludes: ['!noprecache/**/*'],
  scope: '/',
});

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // PWA Headers for better install support
  async headers() {
    return [
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
          {
            key: 'Install-Mode',
            value: 'immediate',
          }
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
    ];
  },

  // Image optimization
  images: {
    domains: ['localhost', '14eab50ee750.ngrok-free.app', 'daaa4fd7e035.ngrok-free.app', 'io-t-web-six.vercel.app', 'io-t-web-btit.vercel.app'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Compress output
  compress: true,
};

export default withPWA(nextConfig);
