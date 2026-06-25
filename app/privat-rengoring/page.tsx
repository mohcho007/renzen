import type { Metadata } from "next";
import { PrivatRengoringPage } from "@/components/privat-rengoring/PrivatRengoringPage";
import {
  introCleaningDescription,
  introPriceHook,
  liveStyleTitle,
} from "@/lib/metadataCopy";
import { renzenAggregateRating } from "@/lib/schema";
import { constructMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = constructMetadata({
  title: liveStyleTitle("Privat rengøring", introPriceHook()),
  description: introCleaningDescription("privat rengøring"),
  path: "/privat-rengoring/",
  indexable: true,
});

function PrivatRengoringStructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Privat rengøring",
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.origin,
      aggregateRating: renzenAggregateRating(),
    },
    aggregateRating: renzenAggregateRating(),
    areaServed: "DK",
    description:
      "Fast privat rengøring med forsikrede Zenmestre og medlemsfordele i Renzen Klub.",
    url: `${siteConfig.origin}/privat-rengoring/`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export default function Page() {
  return (
    <>
      <PrivatRengoringStructuredData />
      <PrivatRengoringPage />
    </>
  );
}
