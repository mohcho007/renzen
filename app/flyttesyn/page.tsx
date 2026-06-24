import type { Metadata } from "next";
import { ServiceInquiryLandingPage } from "@/components/service-inquiry/ServiceInquiryLandingPage";
import { serviceInquiryPages } from "@/components/service-inquiry/serviceInquiryContent";
import { constructMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";
import { inquiryDescription, liveStyleTitle } from "@/lib/metadataCopy";

const config = serviceInquiryPages.flyttesyn;

export const metadata: Metadata = constructMetadata({
  title: liveStyleTitle("Flyttesyn", "Klar til ind- og fraflytning · få tilbud"),
  description: inquiryDescription("flyttesyn"),
  path: "/flyttesyn/",
  indexable: true,
});

function FlyttesynStructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Flyttesyn",
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.origin,
    },
    areaServed: "DK",
    description:
      "Professionel synspartner til ind- og fraflytningssyn med totalløsning, landsdækkende team og fokus på lejeroplevelsen.",
    url: `${siteConfig.origin}/flyttesyn/`,
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
      <FlyttesynStructuredData />
      <ServiceInquiryLandingPage config={config} />
    </>
  );
}
