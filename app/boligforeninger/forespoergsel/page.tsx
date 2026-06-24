import type { Metadata } from "next";
import { ServiceInquiryForespoergselPage } from "@/components/service-inquiry/ServiceInquiryForespoergselPage";
import { serviceInquiryPages } from "@/components/service-inquiry/serviceInquiryContent";
import { constructMetadata } from "@/lib/seo";
import { forespoergselTitle } from "@/lib/metadataCopy";

const config = serviceInquiryPages.boligforeninger;

export const metadata: Metadata = constructMetadata({
  title: forespoergselTitle(config.serviceName),
  description: config.formDescription,
  path: "/boligforeninger/forespoergsel/",
  indexable: false,
});

export default function Page() {
  return <ServiceInquiryForespoergselPage config={config} />;
}
