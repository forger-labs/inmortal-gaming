import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "pub-041a526b56d14b38a39546790a6c9c4c.r2.dev",
      },
      {
        protocol: "https",
        hostname: "pub-a7eeb317de9f489e9add2e3b06002597.r2.dev",
      },
    ],
  },
};

export default nextConfig;
