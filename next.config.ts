import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Speed up offline/Docker builds by skipping redundant checks
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    minimumCacheTTL: 2592000, // 30 days cache for remote images (prevents repeated S3 GET requests)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "commons.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "en.wikipedia.org",
      },
      {
        protocol: "https",
        hostname: "*.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "*.wikipedia.org",
      },
      {
        protocol: "https",
        hostname: "avatar.vercel.sh",
      },
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
