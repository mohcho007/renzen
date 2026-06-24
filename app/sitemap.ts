import { MetadataRoute } from "next";
import { services } from "@/data/services";
import { cities } from "@/data/cities";
import { SERVICE_INQUIRY_SLUGS } from "@/lib/serviceInquiry";
import { BOLIGSERVICE_SLUGS } from "@/components/boligservice/boligserviceContent";
import { siteConfig } from "@/lib/siteConfig";
import { getAirbnbServedCitySlugs } from "@/components/service-inquiry/airbnbCityContent";
import { getPrivatRengoringPriority1Slugs } from "@/lib/privatRengoringCities";

const AIRBNB_SERVED_CITY_SLUGS = new Set(getAirbnbServedCitySlugs());
const PRIVAT_RENGORING_PRIORITY_1_SLUGS = new Set(getPrivatRengoringPriority1Slugs());

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.origin;

  // 1. Static pages (with trailing slashes)
  const staticRoutes = [
    "",
    "om-os",
    "cookiepolitik",
    "handelsbetingelser",
    "persondatapolitik",
    "faq",
    "kontakt",
    "bliv-zenmester",
    "priser",
  ].map((route) => {
    const suffix = route === "" ? "/" : `/${route}/`;
    return {
      url: `${baseUrl}${suffix}`,
      lastModified: new Date(),
      changeFrequency: route === "" ? ("daily" as const) : ("monthly" as const),
      priority: route === "" ? 1.0 : 0.5,
    };
  });

  // 2. Indexable Service pages
  const indexedServiceSlugs = new Set(
    services.filter((service) => service.indexable).map((service) => service.slug),
  );
  const serviceRoutes = services
    .filter((service) => service.indexable)
    .map((service) => ({
      url: `${baseUrl}/${service.slug}/`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  // 3. Service inquiry landing pages (e.g. havearbejde, ferieservice-til-haven)
  const serviceInquiryRoutes = SERVICE_INQUIRY_SLUGS.filter(
    (slug) => !indexedServiceSlugs.has(slug),
  ).map((slug) => ({
    url: `${baseUrl}/${slug}/`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const boligserviceRoutes = [
    "boligservice",
    ...BOLIGSERVICE_SLUGS,
  ].map((slug) => ({
    url: `${baseUrl}/${slug}/`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // 4. Indexable Service + City pages
  const dynamicRoutes: MetadataRoute.Sitemap = [];
  services
    .filter((service) => service.indexable)
    .forEach((service) => {
      cities.forEach((city) => {
        if (
          service.slug === "airbnb-rengoring" &&
          !AIRBNB_SERVED_CITY_SLUGS.has(city.slug)
        ) {
          return;
        }
        if (
          service.slug === "privat-rengoring" &&
          !PRIVAT_RENGORING_PRIORITY_1_SLUGS.has(city.slug)
        ) {
          return;
        }
        const isIndexable = service.indexable && (city.indexableServices?.includes(service.slug) ?? true);
        if (isIndexable) {
          dynamicRoutes.push({
            url: `${baseUrl}/${service.slug}/${city.slug}/`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.6,
          });
        }
      });
    });

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...serviceInquiryRoutes,
    ...boligserviceRoutes,
    ...dynamicRoutes,
  ];
}
