import type { Metadata } from "next";
import { ServiceInquiryLandingPage } from "@/components/service-inquiry/ServiceInquiryLandingPage";
import { serviceInquiryPages } from "@/components/service-inquiry/serviceInquiryContent";
import { constructMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";

const config = serviceInquiryPages.vinduespudsning;

import { inquiryDescription, liveStyleTitle } from "@/lib/metadataCopy";

export const metadata: Metadata = constructMetadata({
  title: liveStyleTitle(
    "Vinduespudsning",
    "Få tilbud inden 24 timer",
  ),
  description: inquiryDescription("vinduespudsning"),
  path: "/vinduespudsning/",
  indexable: true,
});

function VinduespudsningStructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Vinduespudsning",
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.origin,
    },
    areaServed: "DK",
    description:
      "Professionel vinduespudsning indvendigt og udvendigt til huse og lejligheder.",
    url: `${siteConfig.origin}/vinduespudsning/`,
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
      <VinduespudsningStructuredData />
      <ServiceInquiryLandingPage config={config} />
    </>
  );
}
