import { Metadata } from 'next';
import { formatPageTitle } from './formatPageTitle';
import { getAbsoluteUrl } from './urls';

export interface SEOProps {
  title: string;
  description: string;
  path: string; // e.g. /privat-rengoring/koebenhavn/
  indexable?: boolean;
}

/**
 * Helper to generate standardized SEO metadata objects for Next.js App Router.
 */
export function constructMetadata({
  title,
  description,
  path,
  indexable = true
}: SEOProps): Metadata {
  const absoluteUrl = getAbsoluteUrl(path);
  const pageTitle = formatPageTitle(title);
  
  const robotsSetting = indexable 
    ? { index: true, follow: true } 
    : { index: false, follow: true }; // default is noindex, follow as requested

  return {
    title: { absolute: pageTitle },
    description: description,
    alternates: {
      canonical: absoluteUrl,
    },
    robots: robotsSetting,
    openGraph: {
      title: pageTitle,
      description: description,
      url: absoluteUrl,
      siteName: 'Renzen',
      locale: 'da_DK',
      type: 'website',
      images: [
        {
          url: 'https://renzen.dk/images/og-share.jpg', // placeholder
          width: 1200,
          height: 630,
          alt: pageTitle,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: description,
    }
  };
}
