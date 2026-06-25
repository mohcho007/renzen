import { Metadata } from 'next';
import { formatPageTitle } from './formatPageTitle';
import { siteConfig } from './siteConfig';
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
          url: siteConfig.ogImage,
          width: siteConfig.ogImageWidth,
          height: siteConfig.ogImageHeight,
          alt: siteConfig.ogImageAlt,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: description,
      images: [siteConfig.ogImage],
    }
  };
}
