import type { Metadata } from "next";
import { ServiceInquiryLandingPage } from "@/components/service-inquiry/ServiceInquiryLandingPage";
import { serviceInquiryPages } from "@/components/service-inquiry/serviceInquiryContent";
import { constructMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";

const config = serviceInquiryPages["airbnb-rengoring"];

import { inquiryDescription, liveStyleTitle } from "@/lib/metadataCopy";

export const metadata: Metadata = constructMetadata({
  title: liveStyleTitle(
    "Airbnb rengøring",
    "Klargøring mellem gæster · book online",
  ),
  description: inquiryDescription("Airbnb-rengøring mellem gæster"),
  path: "/airbnb-rengoring/",
  indexable: true,
});

function AirbnbRengoringStructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Airbnb rengøring",
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.origin,
    },
    areaServed: "DK",
    description:
      "Professionel Airbnb rengøring og klargøring mellem gæster med verificerede Zenmestre.",
    url: `${siteConfig.origin}/airbnb-rengoring/`,
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
      <AirbnbRengoringStructuredData />
      <ServiceInquiryLandingPage config={config} />
    </>
  );
}
