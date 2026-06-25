import { renzenAggregateRating } from "@/lib/schema";
import { siteConfig } from "@/lib/siteConfig";

export function HomeStructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    image: siteConfig.logo,
    url: siteConfig.origin,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.country,
    },
    vatID: `DK${siteConfig.cvr}`,
    sameAs: [siteConfig.social.facebook],
    aggregateRating: renzenAggregateRating(),
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
