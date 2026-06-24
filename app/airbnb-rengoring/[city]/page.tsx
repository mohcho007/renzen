import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ServiceInquiryLandingPage } from "@/components/service-inquiry/ServiceInquiryLandingPage";
import {
  buildAirbnbCityPageConfig,
  getAirbnbCityMetaDescription,
  getAirbnbServedCity,
  getAirbnbServedCitySlugs,
} from "@/components/service-inquiry/airbnbCityContent";
import SchemaMarkup from "@/components/SchemaMarkup";
import { constructMetadata } from "@/lib/seo";
import { liveStyleCityTitle } from "@/lib/metadataCopy";
import { generateFAQSchema, generateServiceSchema } from "@/lib/schema";
import { getAbsoluteUrl, getServiceCityUrl } from "@/lib/urls";

interface PageProps {
  params: Promise<{ city: string }>;
}

export async function generateStaticParams() {
  return getAirbnbServedCitySlugs().map((city) => ({ city }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const city = getAirbnbServedCity(resolvedParams.city);

  if (!city) {
    return {};
  }

  const path = getServiceCityUrl("airbnb-rengoring", city.slug);

  return constructMetadata({
    title:
      city.metaTitleOverrides?.["airbnb-rengoring"] ||
      liveStyleCityTitle(
        "Airbnb rengøring",
        city.name,
        "Klargøring mellem gæster",
      ),
    description:
      city.metaDescriptionOverrides?.["airbnb-rengoring"] ||
      getAirbnbCityMetaDescription(city.slug) ||
      `Professionel Airbnb rengøring i ${city.name}. Klargøring mellem gæster med verificerede Zenmestre.`,
    path,
    indexable: true,
  });
}

export default async function AirbnbRengoringCityPage({ params }: PageProps) {
  const resolvedParams = await params;
  const city = getAirbnbServedCity(resolvedParams.city);

  if (!city) {
    notFound();
  }

  const config = buildAirbnbCityPageConfig(city);
  const pagePath = getServiceCityUrl("airbnb-rengoring", city.slug);
  const pageUrl = getAbsoluteUrl(pagePath);

  return (
    <>
      <SchemaMarkup
        schema={[
          generateServiceSchema(
            `Airbnb rengøring i ${city.name}`,
            `Professionel Airbnb rengøring og klargøring mellem gæster i ${city.name} med verificerede Zenmestre.`,
            pageUrl,
          ),
          generateFAQSchema(config.faqs),
        ]}
      />
      <ServiceInquiryLandingPage config={config} />
    </>
  );
}
