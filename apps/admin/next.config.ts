import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",

        hostname: "pub-a7eeb317de9f489e9add2e3b06002597.r2.dev",
      },
    ],
  },
};

export default nextConfig;
