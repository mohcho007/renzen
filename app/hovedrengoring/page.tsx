import type { Metadata } from "next";
import { ServiceInquiryLandingPage } from "@/components/service-inquiry/ServiceInquiryLandingPage";
import { serviceInquiryPages } from "@/components/service-inquiry/serviceInquiryContent";
import { constructMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";

const config = serviceInquiryPages.hovedrengoring;

import { inquiryDescription, liveStyleTitle } from "@/lib/metadataCopy";

export const metadata: Metadata = constructMetadata({
  title: liveStyleTitle(
    "Hovedrengøring",
    "Kom helt i bund · få tilbud",
  ),
  description: inquiryDescription("hovedrengøring"),
  path: "/hovedrengoring/",
  indexable: true,
});

function HovedrengoringStructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Hovedrengøring",
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.origin,
    },
    areaServed: "DK",
    description:
      "Grundig hovedrengøring med afkalkning, paneler, skabe og dybdegående rengøring i privat bolig.",
    url: `${siteConfig.origin}/hovedrengoring/`,
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
      <HovedrengoringStructuredData />
      <ServiceInquiryLandingPage config={config} />
    </>
  );
}
