import DynamicPageClient from "@/components/dynamic/DynamicPageClient";
import { DynamicStructuredData } from "@/components/dynamic/DynamicStructuredData";
import {
  DynamicAppDownloadSection,
  DynamicComparisonSection,
  DynamicFooterSection,
  DynamicHowItWorksSection,
  DynamicPricingSection,
} from "@/components/dynamic/DynamicStaticSections";
import {
  CITIES,
  getLocationPhrase,
  REGIONS,
} from "@/lib/cities";
import { LOCAL_MARKET_DATA } from "@/lib/localStats";
import { SERVICES } from "@/lib/services";
import { getAudienceContent } from "@/lib/audienceContent";

interface DynamicPageLayoutProps {
  serviceSlug: string;
  citySlug?: string;
  regionSlug?: string;
}

export default function DynamicPageLayout({
  serviceSlug,
  citySlug,
  regionSlug,
}: DynamicPageLayoutProps) {
  const service = SERVICES[serviceSlug];
  const city = citySlug ? CITIES[citySlug] : undefined;
  const region = regionSlug ? REGIONS[regionSlug] : undefined;

  if (!service) return null;

  const activeCity = city ?? (region ? CITIES[region.defaultCitySlug] : undefined);
  const tierMultiplier = activeCity
    ? activeCity.tier === 1
      ? 1.12
      : activeCity.tier === 3
        ? 0.9
        : 1
    : 1;
  const localStats = city
    ? LOCAL_MARKET_DATA[city.municipalitySlug ?? city.slug]
    : undefined;
  const audienceContent = getAudienceContent({
    service,
    city,
    region,
    localStats,
  });
  const parentRegion = region ?? (city ? REGIONS[city.region] : undefined);
  const breadcrumbs = [{ label: "Hjem", href: "/" }];

  breadcrumbs.push({ label: service.name, href: `/${serviceSlug}` });
  if (parentRegion) {
    breadcrumbs.push({
      label: parentRegion.name,
      href: `/${serviceSlug}/${parentRegion.slug}`,
    });
  }
  if (city) {
    breadcrumbs.push({
      label: city.name,
      href: `/${serviceSlug}/${city.slug}`,
    });
  }

  return (
    <>
      <DynamicStructuredData
        service={service}
        serviceSlug={serviceSlug}
        city={city}
        region={region}
        localStats={localStats}
        tierMultiplier={tierMultiplier}
        breadcrumbs={breadcrumbs}
      />
      <DynamicPageClient
        key={`${serviceSlug}:${citySlug ?? ""}:${regionSlug ?? ""}`}
        serviceSlug={serviceSlug}
        citySlug={citySlug}
        regionSlug={regionSlug}
        audienceContent={audienceContent}
        pricingSection={
          <DynamicPricingSection
            service={service}
            locationPhrase={
              city
                ? getLocationPhrase(city)
                : region
                  ? getLocationPhrase(region)
                  : undefined
            }
          />
        }
        comparisonSection={<DynamicComparisonSection />}
        howItWorksSection={<DynamicHowItWorksSection />}
        appDownloadSection={<DynamicAppDownloadSection />}
        footerSection={<DynamicFooterSection />}
      />
    </>
  );
}
