import type { NextConfig } from "next";

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: false,
  register: true,
  skipWaiting: true,
  immediate: true, // Enable immediate installation
  skipInstallPrompt: true, // Skip native install prompt
  fallbacks: {
    document: '/offline.html',
  },
});

const nextConfig: NextConfig = {
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
    domains: ['localhost', 'daaa4fd7e035.ngrok-free.app' , 'https://eae4216241d2.ngrok-free.app/'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Compress output
  compress: true,
};

export default withPWA(nextConfig);
