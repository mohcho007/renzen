import type { Metadata } from "next";
import { ServiceInquiryLandingPage } from "@/components/service-inquiry/ServiceInquiryLandingPage";
import { serviceInquiryPages } from "@/components/service-inquiry/serviceInquiryContent";
import { constructMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";
import { inquiryDescription, liveStyleTitle } from "@/lib/metadataCopy";

const config = serviceInquiryPages["foraars-og-efteraarsklargoering"];

export const metadata: Metadata = constructMetadata({
  title: liveStyleTitle("Forårs- og efterårsklargøring", "Få tilbud inden 24 timer"),
  description: inquiryDescription("sæsonklargøring"),
  path: "/foraars-og-efteraarsklargoering/",
  indexable: true,
});

function SaesonklargoeringStructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Forårs- og efterårsklargøring",
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.origin,
    },
    areaServed: "DK",
    description:
      "Professionel sæsonklargøring af haven til forår og efterår.",
    url: `${siteConfig.origin}/foraars-og-efteraarsklargoering/`,
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
      <SaesonklargoeringStructuredData />
      <ServiceInquiryLandingPage config={config} />
    </>
  );
}
