import type { NextConfig } from "next";
import { generateSeoRedirects } from "./lib/seoRedirects";

const nextConfig: NextConfig = {
  trailingSlash: true,
  async redirects() {
    return generateSeoRedirects();
  },
  webpack: (config, { dev }) => {
    // Avoid intermittent clientReferenceManifest errors from corrupted webpack
    // cache on Windows when .next is written by concurrent dev/HMR reloads.
    if (dev && process.platform === "win32") {
      config.cache = false;
    }
    return config;
  },
  async headers() {
    return [
      {
        source: "/llms.txt",
        headers: [
          {
            key: "Content-Type",
            value: "text/plain; charset=utf-8",
          },
        ],
      },
    ];
  },
  images: {
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.renbud.dk",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
