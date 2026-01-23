import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@clerk/nextjs"],
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.pinimg.com" },
      { protocol: "https", hostname: "example.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "http", hostname: "res.cloudinary.com" },
    ],
  },

  async headers() {
    const clerkProxy = "https://clerk.trangsucdaquy.shop";

    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              `script-src 'self' 'unsafe-eval' 'unsafe-inline' ${clerkProxy} https://*.clerk.accounts.dev https://*.clerk.com https://clerk.com https://*.clerk.dev`,
              `style-src 'self' 'unsafe-inline' ${clerkProxy} https://*.clerk.accounts.dev https://*.clerk.com https://clerk.com`,
              "img-src 'self' data: https: blob:",
              "font-src 'self' data: https:",
              `connect-src 'self' ${clerkProxy} https://*.clerk.accounts.dev https://*.clerk.com https://clerk.com wss://*.clerk.accounts.dev https://api.clerk.com https://*.clerk.dev https://api.iconify.design https://api.unisvg.com https://api.simplesvg.com`,
              `frame-src 'self' ${clerkProxy} https://*.clerk.accounts.dev https://*.clerk.com https://clerk.com`,
              "worker-src 'self' blob:",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
