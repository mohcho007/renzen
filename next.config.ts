import type { NextConfig } from "next";
import { LEGACY_WP_ARTICLE_SLUGS } from "./lib/legacyRedirectLogic";

function wpArticleRedirects() {
  return LEGACY_WP_ARTICLE_SLUGS.flatMap((slug) => {
    const variants = new Set([
      slug,
      slug.replace(/rengoering/g, "rengoring"),
      slug.replace(/rengoring/g, "rengoering"),
    ]);
    return [...variants].flatMap((variant) => [
      {
        source: `/${variant}`,
        destination: `/artikler/${slug}/`,
        permanent: true,
      },
      {
        source: `/${variant}/`,
        destination: `/artikler/${slug}/`,
        permanent: true,
      },
    ]);
  });
}

const nextConfig: NextConfig = {
  trailingSlash: true,
  webpack: (config, { dev }) => {
    // Avoid intermittent clientReferenceManifest errors from corrupted webpack
    // cache on Windows when .next is written by concurrent dev/HMR reloads.
    if (dev && process.platform === "win32") {
      config.cache = false;
    }
    return config;
  },
  async redirects() {
    return wpArticleRedirects();
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
        hostname: "renzen.dk",
        pathname: "/wp-content/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
