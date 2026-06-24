import type { Metadata } from "next";
import { boligservicePages } from "@/components/boligservice/boligserviceContent";
import { ServiceInquiryLandingPage } from "@/components/service-inquiry/ServiceInquiryLandingPage";
import { constructMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";
import { inquiryDescription, liveStyleTitle } from "@/lib/metadataCopy";

const config = boligservicePages["it-hjaelp-til-hjemmet"];

export const metadata: Metadata = constructMetadata({
  title: liveStyleTitle(config.serviceName, "Få tilbud inden 24 timer"),
  description: inquiryDescription(config.serviceName.toLowerCase()),
  path: "/it-hjaelp-til-hjemmet/",
  indexable: true,
});

function StructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: config.serviceName,
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.origin,
    },
    areaServed: "DK",
    description: config.heroDescription,
    url: `${siteConfig.origin}/it-hjaelp-til-hjemmet/`,
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
      <StructuredData />
      <ServiceInquiryLandingPage config={config} />
    </>
  );
}
