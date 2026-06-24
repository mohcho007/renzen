import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/siteConfig";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/deals", "/deals/"],
    },
    sitemap: `${siteConfig.origin}/sitemap.xml`,
  };
}
