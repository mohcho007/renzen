export interface Service {
  slug: string;
  label: string;
  intent: string;
  indexable: boolean;
  h2Title: string;
  description: string;
}

export const services: Service[] = [
  {
    slug: 'rengoring',
    label: 'Rengøring',
    intent: 'generel rengøring',
    indexable: true,
    h2Title: 'Professionel rengøring tilpasset dine behov',
    description: 'Få et rent og indbydende hjem med vores professionelle rengøringsservice. Vi sikrer høj kvalitet og fuld tryghed hver gang.',
  },
  {
    slug: 'privat-rengoring',
    label: 'Privat rengøring',
    intent: 'rengøring i private hjem',
    indexable: true,
    h2Title: 'Få mere tid i hverdagen med privat rengøring',
    description: 'Vi klarer rengøringen i dit private hjem med fast tilknyttede Zenmestre. Altid forsikret og med fuld fleksibilitet.',
  },
  {
    slug: 'flytterengoring',
    label: 'Flytterengøring',
    intent: 'rengøring ved fraflytning/indflytning',
    indexable: true,
    h2Title: 'Få dit depositum tilbage med en professionel flytterengøring',
    description: 'Vi foretager en grundig og dybdegående rengøring ved fraflytning eller indflytning, så boligen afleveres i perfekt stand.',
  },
  {
    slug: 'airbnb-rengoring',
    label: 'Airbnb rengøring',
    intent: 'rengøring mellem gæster/korttidsudlejning',
    indexable: true,
    h2Title: 'Klargøring af din udlejningsbolig mellem gæster',
    description: 'Vi sikrer, at din Airbnb eller feriebolig står knivskarpt til de næste gæster med professionel rengøring og klargøring.',
  },
  {
    slug: 'erhvervsrengoring',
    label: 'Erhvervsrengøring',
    intent: 'rengøring til virksomheder/kontorer',
    indexable: false, // false som standard, med mulighed for true pr. by
    h2Title: 'Professionel erhvervsrengøring til kontor og butik',
    description: 'Skab et sundt og rent arbejdsmiljø for dine medarbejdere med stabil og professionel erhvervsrengøring.',
  },
  {
    slug: 'hovedrengoring',
    label: 'Hovedrengøring',
    intent: 'grundig rengøring',
    indexable: false, // false som standard, med mulighed for true pr. by
    h2Title: 'En dybdegående hovedrengøring med ekstra knofedt',
    description: 'Når der er brug for ekstra grundighed. Vi kommer helt i bund i alle kroge, afkalker badeværelset og renser paneler.',
  },
  {
    slug: 'engangsrengoring',
    label: 'Engangsrengøring',
    intent: 'enkeltstående rengøring',
    indexable: false, // false som standard, med mulighed for true pr. by
    h2Title: 'Professionel rengøring uden binding',
    description: 'Har du brug for en enkelt rengøring før en fest, efter håndværkere eller bare til en travl uge? Book uden abonnement.',
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find(s => s.slug === slug);
}
