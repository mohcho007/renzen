import type { Metadata } from "next";
import { formatPageTitle } from "@/lib/formatPageTitle";
import { siteConfig } from "@/lib/siteConfig";
export function createStaticPageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const normalizedPath = path === "/" ? "" : path;
  const url = `${siteConfig.origin}${normalizedPath}`;
  const pageTitle = formatPageTitle(title);

  return {
    title: {
      absolute: pageTitle,
    },
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: pageTitle,
      description,
      url,
      siteName: "Renzen",
      locale: "da_DK",
      type: "website",
      images: [
        {
          url: siteConfig.logo,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [siteConfig.logo],
    },
  };
}
