import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServiceBySlug } from '../../data/services';
import {
  introCleaningDescription,
  introPriceHook,
  liveStyleTitle,
} from '@/lib/metadataCopy';
import { constructMetadata } from '../../lib/seo';
import ServicePageTemplate from '../../components/ServicePageTemplate';

export const metadata: Metadata = constructMetadata({
  title: liveStyleTitle('Rengøringshjælp', `${introPriceHook()} · beregn pris`),
  description: introCleaningDescription('rengøring'),
  path: '/rengoring/',
  indexable: true
});

export default function RengoringPage() {
  const service = getServiceBySlug('rengoring');
  if (!service) notFound();

  return (
    <ServicePageTemplate
      service={service}
      contentSection={
        <>
          <h2>Professionel rengøring, der gør en forskel</h2>
          <p>
            Hos Renzen mener vi, at et rent hjem eller kontor er vejen til mere ro, mental frihed og energi i hverdagen. Rengøring er ikke bare en praktisk opgave – det handler om at skabe rammerne for et godt liv. Vores mission er at levere en service, der får dig til at sænke skuldrene og nyde dit hjem.
          </p>

          <h3>Fleksibel rengøring tilpasset dig</h3>
          <p>
            Vores platform er designet til at passe ind i din tidsplan. Du kan vælge rengøring som en fast abonnementsordning (hver uge, hver 2. uge eller hver 4. uge) eller booke en enkeltstående engangsrengøring, når der er brug for det. Du kan altid justere din aftale online.
          </p>

          <h3>Hvem udfører rengøringen?</h3>
          <p>
            Rengøringen udføres af vores verificerede og forsikrede &quot;Zenmestre&quot;. Alle rengøringsfolk, der er tilknyttet Renzen, gennemgår et grundigt baggrundstjek og skal fremvise en ren straffeattest. Derudover er alle opgaver dækket af en ansvarsforsikring, så du er fuldt sikret.
          </p>
        </>
      }
    />
  );
}
