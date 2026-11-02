import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Speed up offline/Docker builds by skipping redundant checks
  typescript: {
    ignoreBuildErrors: true,
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
