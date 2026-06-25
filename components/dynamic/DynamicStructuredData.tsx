import type { City, Region } from "@/lib/cities";
import { getDynamicFaqs, getLocalPrice } from "@/lib/dynamicPageContent";
import type { LocalMarketData } from "@/lib/localStats";
import {
  getServiceNameInSentence,
  type Service,
} from "@/lib/services";
import { renzenAggregateRating } from "@/lib/schema";
import { siteConfig } from "@/lib/siteConfig";

interface Breadcrumb {
  label: string;
  href: string;
}

interface DynamicStructuredDataProps {
  service: Service;
  serviceSlug: string;
  city?: City;
  region?: Region;
  localStats?: LocalMarketData;
  tierMultiplier: number;
  breadcrumbs: Breadcrumb[];
}

export function DynamicStructuredData({
  service,
  serviceSlug,
  city,
  region,
  localStats,
  tierMultiplier,
  breadcrumbs,
}: DynamicStructuredDataProps) {
  const serviceName = getServiceNameInSentence(service);
  const locationName = city?.name ?? region?.name ?? "Danmark";
  const localizedBasePrice = getLocalPrice(
    service.pricingTable?.[0]?.price ?? "",
    tierMultiplier,
  );
  const faqs = getDynamicFaqs({
    service,
    serviceSlug,
    locationName,
    localizedBasePrice,
  });

  const schemas: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.name,
      description: service.description,
      provider: {
        "@type": "Organization",
        name: siteConfig.name,
        image: siteConfig.logo,
        url: siteConfig.origin,
        telephone: siteConfig.phone,
        aggregateRating: renzenAggregateRating(),
        address: {
          "@type": "PostalAddress",
          streetAddress: siteConfig.address.street,
          addressLocality: siteConfig.address.city,
          postalCode: siteConfig.address.postalCode,
          addressCountry: siteConfig.address.country,
        },
        vatID: `DK${siteConfig.cvr}`,
      },
      ...(city || region
        ? {
            areaServed: {
              "@type": "AdministrativeArea",
              name: locationName,
            },
          }
        : {}),
      aggregateRating: renzenAggregateRating(),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: `Priser for ${serviceName}`,
        itemListElement:
          service.pricingTable?.map((row) => {
            const price = getLocalPrice(row.price, tierMultiplier);
            const priceMatch = price.match(/\d[\d\s.]*/);
            return {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: row.label,
              },
              priceSpecification: {
                "@type": "PriceSpecification",
                price: priceMatch
                  ? priceMatch[0].replace(/[\s.]/g, "")
                  : "0",
                priceCurrency: "DKK",
              },
            };
          }) ?? [],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.a,
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((breadcrumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: breadcrumb.label,
        item:
          breadcrumb.href === "/"
            ? siteConfig.origin
            : `${siteConfig.origin}${breadcrumb.href}`,
      })),
    },
  ];

  if (city && localStats) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: `Markedsdata og demografi for ${localStats.municipalityName}`,
      description: `Kommunale demografi- og erhvervsdata for ${localStats.municipalityName}, anvendt som lokal kontekst for ${city.name}.`,
      creator: [
        {
          "@type": "Organization",
          name: "Danmarks Statistik",
          url: "https://www.dst.dk",
        },
        {
          "@type": "Organization",
          name: "CVR-registret (Erhvervsstyrelsen)",
          url: "https://datacvr.virk.dk",
        },
      ],
      variableMeasured: [
        "Befolkningstal",
        "Antal husstande",
        "Aktive CVR-registrerede rengøringsfirmaer",
      ],
      temporalCoverage: "2026",
      spatialCoverage: {
        "@type": "Place",
        name: localStats.municipalityName,
      },
    });
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemas).replace(/</g, "\\u003c"),
      }}
    />
  );
}
