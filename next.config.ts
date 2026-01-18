import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // Update to use remotePatterns instead of domains (deprecated)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    // Keep domains for backward compatibility but it's deprecated
    domains: ["i.pinimg.com", "example.com", "res.cloudinary.com"],
  },
  // Allow Clerk scripts to load - Updated CSP for better compatibility
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.clerk.accounts.dev https://*.clerk.com https://clerk.com https://*.clerk.dev",
              "style-src 'self' 'unsafe-inline' https://*.clerk.accounts.dev https://*.clerk.com https://clerk.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data: https:",
              "connect-src 'self' https://*.clerk.accounts.dev https://*.clerk.com https://clerk.com wss://*.clerk.accounts.dev https://api.clerk.com",
              "frame-src 'self' https://*.clerk.accounts.dev https://*.clerk.com https://clerk.com",
              "worker-src 'self' blob:",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
