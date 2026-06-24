import type { Metadata } from "next";
import { ServiceInquiryLandingPage } from "@/components/service-inquiry/ServiceInquiryLandingPage";
import { serviceInquiryPages } from "@/components/service-inquiry/serviceInquiryContent";
import SchemaMarkup from "@/components/SchemaMarkup";
import { constructMetadata } from "@/lib/seo";
import { bookOnlineDescription, liveStyleTitle } from "@/lib/metadataCopy";
import { generateFAQSchema, generateServiceSchema } from "@/lib/schema";
import { getAbsoluteUrl } from "@/lib/urls";
import { serviceFAQs } from "@/data/faqs";

const config = serviceInquiryPages["airbnb-rengoring"];
const pagePath = "/airbnb-rengoring/";
const pageUrl = getAbsoluteUrl(pagePath);
const airbnbFaqs = serviceFAQs["airbnb-rengoring"];

export const metadata: Metadata = constructMetadata({
  title: liveStyleTitle(
    "Airbnb rengøring",
    "Klargøring mellem gæster · book online",
  ),
  description: bookOnlineDescription("Airbnb-klargøring mellem gæster"),
  path: pagePath,
  indexable: true,
});

export default function Page() {
  return (
    <>
      <SchemaMarkup
        schema={[
          generateServiceSchema(
            "Airbnb rengøring",
            "Professionel Airbnb rengøring og klargøring mellem gæster med verificerede Zenmestre.",
            pageUrl,
          ),
          generateFAQSchema(airbnbFaqs),
        ]}
      />
      <ServiceInquiryLandingPage config={config} />
    </>
  );
}
