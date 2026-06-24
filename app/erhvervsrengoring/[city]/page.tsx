import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getServiceBySlug } from '../../../data/services';
import { getCityBySlug, cities } from '../../../data/cities';
import { constructMetadata } from '../../../lib/seo';
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
  const service = getServiceBySlug('erhvervsrengoring');
  const city = getCityBySlug(resolvedParams.city);

  if (!service || !city) {
    return {};
  }

  // Erhvervsrengøring is false by default, but can be true if explicitly overridden.
  const isIndexable = service.indexable || (city.indexableServices?.includes(service.slug) ?? false);

  return constructMetadata({
    title: city.metaTitleOverrides?.['erhvervsrengoring'] || `Erhvervsrengøring i ${city.name} | Pålidelig kontorrengøring`,
    description: city.metaDescriptionOverrides?.['erhvervsrengoring'] || `Få et uforpligtende tilbud på erhvervsrengøring i ${city.name}. Skræddersyede aftaler til kontor, butik og klinik. Professionel service.`,
    path: getServiceCityUrl(service.slug, city.slug),
    indexable: isIndexable
  });
}

export default async function ErhvervsrengoringCityPage({ params }: PageProps) {
  const resolvedParams = await params;
  const service = getServiceBySlug('erhvervsrengoring');
  const city = getCityBySlug(resolvedParams.city);

  if (!service || !city) {
    notFound();
  }

  return <CityPageTemplate service={service} city={city} />;
}
