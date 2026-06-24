import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ServiceInquiryLandingPage } from "@/components/service-inquiry/ServiceInquiryLandingPage";
import {
  buildPrivatRengoringCityPageConfig,
  getPrivatRengoringCityMetaDescription,
} from "@/components/privat-rengoring/privatRengoringCityContent";
import SchemaMarkup from "@/components/SchemaMarkup";
import { constructMetadata } from "@/lib/seo";
import {
  introCleaningDescription,
  introFromLabel,
  liveStyleCityTitle,
} from "@/lib/metadataCopy";
import { generateFAQSchema, generateServiceSchema } from "@/lib/schema";
import { getAbsoluteUrl, getServiceCityUrl } from "@/lib/urls";
import {
  getPrivatRengoringPriority1City,
  getPrivatRengoringPriority1Slugs,
} from "@/lib/privatRengoringCities";

interface PageProps {
  params: Promise<{ city: string }>;
}

export async function generateStaticParams() {
  return getPrivatRengoringPriority1Slugs().map((city) => ({ city }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const city = getPrivatRengoringPriority1City(resolvedParams.city);

  if (!city) {
    return {};
  }

  const path = getServiceCityUrl("privat-rengoring", city.slug);

  return constructMetadata({
    title:
      city.metaTitleOverrides?.["privat-rengoring"] ||
      liveStyleCityTitle(
        "Privat rengøring",
        city.name,
        `Book ${introFromLabel} · 2 min.`,
      ),
    description:
      city.metaDescriptionOverrides?.["privat-rengoring"] ||
      getPrivatRengoringCityMetaDescription(city.slug) ||
      introCleaningDescription(`privat rengøring i ${city.name}`),
    path,
    indexable: true,
  });
}

export default async function PrivatRengoringCityPage({ params }: PageProps) {
  const resolvedParams = await params;
  const city = getPrivatRengoringPriority1City(resolvedParams.city);

  if (!city) {
    notFound();
  }

  const config = buildPrivatRengoringCityPageConfig(city);
  const pagePath = getServiceCityUrl("privat-rengoring", city.slug);
  const pageUrl = getAbsoluteUrl(pagePath);

  return (
    <>
      <SchemaMarkup
        schema={[
          generateServiceSchema(
            `Privat rengøring i ${city.name}`,
            `Professionel privat rengøring i ${city.name} med forsikrede Zenmestre og Renzen Klub-fordele.`,
            pageUrl,
          ),
          generateFAQSchema(config.faqs),
        ]}
      />
      <ServiceInquiryLandingPage
        config={config}
        inquiryPath="/book-rengoering"
      />
    </>
  );
}
