import { siteConfig } from './siteConfig';
import { DOMAIN } from './urls';

/** Matches on-site copy: 4,8 ud af 5 / +500 glade kunder (TrustMarkers). */
export const RENZEN_AGGREGATE_RATING = {
  '@type': 'AggregateRating',
  ratingValue: '4.8',
  bestRating: '5',
  reviewCount: '500',
} as const;

export function renzenAggregateRating() {
  return { ...RENZEN_AGGREGATE_RATING };
}

function formatSchemaTelephone(phone: string) {
  return `+45 ${phone}`;
}

function renzenPostalAddress() {
  return {
    '@type': 'PostalAddress' as const,
    streetAddress: siteConfig.address.street,
    addressLocality: siteConfig.address.city,
    postalCode: siteConfig.address.postalCode,
    addressCountry: siteConfig.address.country,
  };
}

/**
 * Generates Organization Schema with canonical NAP from siteConfig.
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${DOMAIN}/#organization`,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    image: `${DOMAIN}${siteConfig.logo}`,
    url: siteConfig.origin,
    telephone: formatSchemaTelephone(siteConfig.phone),
    email: siteConfig.email,
    address: renzenPostalAddress(),
    vatID: `DK${siteConfig.cvr}`,
    aggregateRating: renzenAggregateRating(),
    sameAs: [
      siteConfig.social.facebook,
      ...(siteConfig.social.instagram ? [siteConfig.social.instagram] : []),
    ].filter(Boolean),
  };
}

/**
 * Generates LocalBusiness Schema.
 */
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${DOMAIN}/#localbusiness`,
    name: siteConfig.name,
    image: `${DOMAIN}${siteConfig.logo}`,
    url: siteConfig.origin,
    telephone: formatSchemaTelephone(siteConfig.phone),
    email: siteConfig.email,
    address: renzenPostalAddress(),
    vatID: `DK${siteConfig.cvr}`,
    aggregateRating: renzenAggregateRating(),
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
      ],
      opens: '08:00',
      closes: '17:00',
    },
    sameAs: [
      siteConfig.social.facebook,
      ...(siteConfig.social.instagram ? [siteConfig.social.instagram] : []),
    ].filter(Boolean),
  };
}

/**
 * Generates Service Schema.
 */
export function generateServiceSchema(
  name: string,
  description: string,
  url: string,
  cityName?: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'name': cityName ? `${name} i ${cityName}` : name,
    'provider': {
      '@type': 'Organization',
      'name': siteConfig.name,
      'url': siteConfig.origin,
      'telephone': formatSchemaTelephone(siteConfig.phone),
      'address': renzenPostalAddress(),
      'vatID': `DK${siteConfig.cvr}`,
      'aggregateRating': renzenAggregateRating(),
    },
    'aggregateRating': renzenAggregateRating(),
    'description': description,
    'areaServed': cityName ? {
      '@type': 'AdministrativeArea',
      'name': cityName
    } : {
      '@type': 'Country',
      'name': 'Danmark'
    },
    'url': url
  };
}

/**
 * Generates FAQPage Schema.
 */
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  };
}

/**
 * Generates BreadcrumbList Schema.
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.url
    }))
  };
}

/**
 * Generates BlogPosting / Article schema for editorial pages.
 */
export function generateArticleSchema(options: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  imageAlt?: string;
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: options.title,
    description: options.description,
    datePublished: options.datePublished,
    dateModified: options.dateModified ?? options.datePublished,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.origin,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${DOMAIN}${siteConfig.logo}`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": options.url,
    },
    inLanguage: "da-DK",
  };

  if (options.image) {
    schema.image = {
      "@type": "ImageObject",
      url: options.image,
      ...(options.imageAlt ? { caption: options.imageAlt } : {}),
    };
  }

  return schema;
}

/**
 * Generates WebPage Schema.
 */
export function generateWebPageSchema(title: string, description: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    'url': url,
    'name': title,
    'description': description,
    'publisher': {
      '@type': 'Organization',
      'name': siteConfig.name,
      'url': siteConfig.origin,
      'telephone': formatSchemaTelephone(siteConfig.phone),
      'address': renzenPostalAddress(),
      'vatID': `DK${siteConfig.cvr}`,
      'logo': {
        '@type': 'ImageObject',
        'url': `${DOMAIN}${siteConfig.logo}`
      },
      'aggregateRating': renzenAggregateRating(),
    }
  };
}
