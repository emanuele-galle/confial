import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // turbopack: {}, // Disabled temporarily for debugging
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'confialtv.it',
      },
    ],
  },
};

export default nextConfig;
