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

/**
 * Generates LocalBusiness Schema.
 */
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'Renzen',
    'image': `${DOMAIN}/renzen-logo-ny.png`,
    '@id': `${DOMAIN}/#localbusiness`,
    'url': DOMAIN,
    'aggregateRating': renzenAggregateRating(),
    'telephone': '+45 70 60 40 20', // placeholder or real number
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Købmagergade 42', // placeholder address
      'addressLocality': 'København K',
      'postalCode': '1150',
      'addressCountry': 'DK'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': 55.6811,
      'longitude': 12.5784
    },
    'openingHoursSpecification': {
      '@type': 'OpeningHoursSpecification',
      'dayOfWeek': [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday'
      ],
      'opens': '08:00',
      'closes': '17:00'
    },
    'sameAs': [
      'https://www.facebook.com/renzen.dk',
      'https://www.instagram.com/renzen.dk'
    ]
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
      '@type': 'LocalBusiness',
      'name': 'Renzen',
      'url': DOMAIN,
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
      'name': 'Renzen',
      'logo': {
        '@type': 'ImageObject',
        'url': `${DOMAIN}/renzen-logo-ny.png`
      },
      'aggregateRating': renzenAggregateRating(),
    }
  };
}
