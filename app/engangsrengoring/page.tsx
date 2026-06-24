import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServiceBySlug } from '../../data/services';
import { constructMetadata } from '../../lib/seo';
import ServicePageTemplate from '../../components/ServicePageTemplate';

import { liveStyleDescription, liveStyleTitle } from '@/lib/metadataCopy';

export const metadata: Metadata = constructMetadata({
  title: liveStyleTitle('Engangsrengøring', 'Beregn pris · ingen binding'),
  description: liveStyleDescription({
    action: 'Book enkelt rengøring når du har brug for det.',
    proof: 'Ingen abonnement, forsikret Zenmester og fast pris online.',
    cta: 'Betaling efter besøget.',
  }),
  path: '/engangsrengoring/',
  indexable: false // noindex by default
});

export default function EngangsrengoringPage() {
  const service = getServiceBySlug('engangsrengoring');
  if (!service) notFound();

  return (
    <ServicePageTemplate
      service={service}
      contentSection={
        <>
          <h2>Engangsrengøring – fleksibelt og uden abonnement</h2>
          <p>
            Har du brug for en enkelt rengøring af dit hjem før eller efter et stort arrangement, i en ekstra travl periode, eller vil du blot prøve vores service af, før du tager stilling til et fast abonnement? Vores engangsrengøringsservice er den ideelle løsning til dig, der ønsker fuld fleksibilitet.
          </p>

          <h3>Ingen binding – kun renlighed</h3>
          <p>
            Med engangsrengøring betaler du kun for det konkrete besøg. Der er intet løbende abonnement, ingen bindingsperiode og ingen skjulte forpligtelser. Du booker blot den dag og det tidspunkt, der passer dig bedst, og betaler direkte efter opgavens udførelse.
          </p>

          <h3>Perfekt til særlige begivenheder</h3>
          <p>
            En enkeltstående rengøring er yderst populær i mange situationer:
          </p>
          <ul>
            <li>Rengøring før eller efter fødselsdage, konfirmationer eller højtider.</li>
            <li>Ekstra hjælp til den årlige forårsrengøring.</li>
            <li>Aflastning i eksamensperioder, under flytning eller ved sygdom.</li>
            <li>En betænksom gave til bedsteforældre eller nybagte forældre.</li>
          </ul>

          <h3>Fuld ansvarsforsikring og servicefradrag</h3>
          <p>
            Rengøringen udføres af vores professionelle Zenmestre og er fuldt dækket af vores erhvervsansvarsforsikring. Derudover kan du trække 26% af arbejdslønnen fra i skat via det danske servicefradrag.
          </p>
        </>
      }
    />
  );
}
