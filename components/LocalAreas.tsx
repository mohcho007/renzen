import React from 'react';
import Link from 'next/link';
import { cities } from '../data/cities';

interface LocalAreasProps {
  currentCityName: string;
  nearbyAreas: string[]; // array of city names
  serviceSlug: string;
}

export default function LocalAreas({ currentCityName, nearbyAreas, serviceSlug }: LocalAreasProps) {
  // Find slugs for the nearby area names
  const areasWithSlugs = nearbyAreas.map(areaName => {
    const foundCity = cities.find(c => c.name.toLowerCase() === areaName.toLowerCase());
    return {
      name: areaName,
      slug: foundCity ? foundCity.slug : areaName.toLowerCase().replace(/\s+/g, '-'),
    };
  });

  if (areasWithSlugs.length === 0) return null;

  return (
    <div className="rounded-2xl bg-slate-50 p-6 border border-slate-100">
      <h4 className="text-base font-bold text-slate-800">
        Rengøringshjælp i nærliggende områder
      </h4>
      <p className="mt-1 text-xs text-slate-500">
        Vi dækker bredt i hele regionen. Se vores services i nabobyerne til {currentCityName}:
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {areasWithSlugs.map((area) => (
          <Link
            key={area.slug}
            href={`/${serviceSlug}/${area.slug}/`}
            className="flex items-center space-x-1.5 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm border border-slate-100 hover:text-emerald-600 hover:border-emerald-200 transition-colors"
          >
            <svg className="h-3 w-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{area.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
