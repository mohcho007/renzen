import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getServiceBySlug } from '../../../data/services';
import { getCityBySlug, cities } from '../../../data/cities';
import { constructMetadata } from '../../../lib/seo';
import { inquiryDescription, liveStyleCityTitle } from '@/lib/metadataCopy';
import CityPageTemplate from '../../../components/CityPageTemplate';
import { getServiceCityUrl } from '../../../lib/urls';

interface PageProps {
  params: Promise<{ city: string }>;
}

export async function generateStaticParams() {
  return cities.map((city) => ({
    city: city.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const service = getServiceBySlug('airbnb-rengoring');
  const city = getCityBySlug(resolvedParams.city);

  if (!service || !city) {
    return {};
  }

  const isIndexable = service.indexable && (city.indexableServices?.includes(service.slug) ?? true);

  return constructMetadata({
    title: city.metaTitleOverrides?.['airbnb-rengoring'] || liveStyleCityTitle('Airbnb rengøring', city.name, 'Klargøring mellem gæster'),
    description: city.metaDescriptionOverrides?.['airbnb-rengoring'] || inquiryDescription(`Airbnb-rengøring i ${city.name}`),
    path: getServiceCityUrl(service.slug, city.slug),
    indexable: isIndexable
  });
}

export default async function AirbnbRengoringCityPage({ params }: PageProps) {
  const resolvedParams = await params;
  const service = getServiceBySlug('airbnb-rengoring');
  const city = getCityBySlug(resolvedParams.city);

  if (!service || !city) {
    notFound();
  }

  return <CityPageTemplate service={service} city={city} />;
}
