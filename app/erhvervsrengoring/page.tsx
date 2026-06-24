import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServiceBySlug } from '../../data/services';
import { constructMetadata } from '../../lib/seo';
import ServicePageTemplate from '../../components/ServicePageTemplate';

import { liveStyleDescription, liveStyleTitle } from '@/lib/metadataCopy';

export const metadata: Metadata = constructMetadata({
  title: liveStyleTitle('Erhvervsrengøring', 'Få skræddersyet tilbud'),
  description: liveStyleDescription({
    action: 'Rent kontor, butik eller klinik med faste tider og erfarne Zenmestre.',
    proof: 'Skræddersyede aftaler til jeres lokaler.',
    cta: 'Få uforpligtende tilbud inden for 24 timer.',
  }),
  path: '/erhvervsrengoring/',
  indexable: false // noindex by default
});

export default function ErhvervsrengoringPage() {
  const service = getServiceBySlug('erhvervsrengoring');
  if (!service) notFound();

  return (
    <ServicePageTemplate
      service={service}
      contentSection={
        <>
          <h2>Erhvervsrengøring – stabilt og professionelt</h2>
          <p>
            Et rent og sundt arbejdsmiljø er afgørende for dine medarbejderes trivsel og effektivitet. Samtidig er jeres lokaler virksomhedens ansigt udadtil over for kunder og samarbejdspartnere. Hos Renzen leverer vi stabil og professionel erhvervsrengøring tilpasset jeres specifikke behov.
          </p>

          <h3>Skræddersyede aftaler til alle erhverv</h3>
          <p>
            Vi dækker en bred vifte af erhvervstyper:
          </p>
          <ul>
            <li><strong>Kontorrengøring:</strong> Aftørring af arbejdsstationer, fællesarealer, mødelokaler, støvsugning og gulvvask.</li>
            <li><strong>Klinikrengøring:</strong> Ekstra fokus på hygiejne og desinficering af berøringsflader i henhold til gældende retningslinjer.</li>
            <li><strong>Butiksrengøring:</strong> Klargøring af butiksareal, indgangsparti og personalefaciliteter, så butikken altid fremstår indbydende.</li>
          </ul>

          <h3>Fleksibilitet uden for arbejdstiden</h3>
          <p>
            Vi planlægger rengøringen, så den forstyrrer jeres drift mindst muligt. Vores Zenmestre kan udføre arbejdet tidligt om morgenen, om aftenen eller i weekenden. I får tilknyttet et fast team, så I altid ved, hvem der har adgang til jeres lokaler.
          </p>
        </>
      }
    />
  );
}
