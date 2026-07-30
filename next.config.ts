import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-69eab091f5934cdc85df6f0c340a4f4f.r2.dev",
      },
    ],
  },
};

export default nextConfig;
