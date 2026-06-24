export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  author: string;
  readTime: string;
  image?: string;
  indexable: boolean;
}

export const articles: Article[] = [
  {
    slug: 'guide-rent-hjem-med-servicefradrag',
    title: 'Guide: Sådan får du råd til rengøringshjælp med servicefradraget',
    excerpt: 'Hvor meget kan man egentlig spare på rengøringshjælp ved at bruge det danske servicefradrag? Læs vores komplette guide om reglerne for 2026.',
    content: `
      <p>Mange tror fejlagtigt, at professionel rengøringshjælp i det private hjem er en luksus, der kun er forbeholdt de få. Men takket være det danske servicefradrag (også kendt som håndværkerfradraget for serviceydelser) er det i dag yderst overkommeligt for almindelige familier og enlige at få professionel hjælp til rengøringen.</p>
      
      <h2>Hvad er servicefradraget for rengøring?</h2>
      <p>Servicefradraget er et skattefradrag, som du kan få for arbejdslønnen på udvalgte serviceydelser udført i dit hjem. Rengøring i hjemmet er en af de primære ydelser, der er dækket. Fradraget betyder i praksis, at staten refunderer cirka 26% af den arbejdsløn, du betaler for rengøringen.</p>
      
      <h2>Sådan beregner du din besparelse</h2>
      <p>Hvis du modtager en rengøring til en pris på f.eks. 500 kr. i arbejdsløn, kan du trække dette beløb fra. Skatteværdien af fradraget er på ca. 26%. Det betyder, at du reelt sparer 130 kr. i skat, og din reelle udgift for rengøringen bliver kun 370 kr.</p>
      
      <blockquote>
        <strong>Eksempel på beregning:</strong><br>
        Ugentlig rengøring (listepris): 400 kr.<br>
        Skattebesparelse (26%): -104 kr.<br>
        <strong>Reel udgift efter fradrag: 296 kr.</strong>
      </blockquote>

      <h2>Hvordan indberetter man fradraget?</h2>
      <p>Det er utrolig simpelt at få fradraget. Når du får gjort rent gennem Renzen, modtager du en faktura med specificeret arbejdsløn og vores CVR-nummer. Du skal blot:</p>
      <ol>
        <li>Logge ind på SKAT TastSelv.</li>
        <li>Vælge "Indberet servicefradrag".</li>
        <li>Indtaste CVR-nummer, dato for udførelse samt det betalte beløb for arbejdsløn.</li>
        <li>Fradraget modregnes herefter automatisk i din årsopgørelse.</li>
      </ol>
      
      <p>Hos Renzen gør vi det nemt for dig at holde styr på dine bilag, så du altid har den dokumentation, du skal bruge til SKAT.</p>
    `,
    publishedAt: '2026-03-12',
    author: 'Renzen Teamet',
    readTime: '4 min read',
    indexable: true,
  },
  {
    slug: '5-tips-til-nem-flytterengoering',
    title: '5 uundværlige tips til en smertefri flytterengøring',
    excerpt: 'At flytte er stressende nok i sig selv. Her får du vores 5 bedste råd til, hvordan du sikrer, at flytterengøringen går igennem udlejers syn uden problemer.',
    content: `
      <p>Fraflytning af en lejlighed eller et hus indebærer næsten altid den frygtede flytterengøring. Mange oplever, at udlejer er yderst detaljeorienteret under flyttesynet, og at et mangelfuldt rengjort lejemål kan koste dyrt i tilbageholdt depositum.</p>
      
      <h2>1. Læg en klar plan og start oppefra</h2>
      <p>Rengøring skal altid ske oppefra og ned. Start med at fjerne spindelvæv i loftet, tørre ovenpå skabe, dørkarme og kontakter af, før du kaster dig over gulvene. Hvis du vasker gulvet først, vil støv og snavs fra paneler og lofter blot falde ned på dit rene gulv.</p>
      
      <h2>2. Glem ikke det "usynlige" snavs</h2>
      <p>Udlejere tjekker ofte steder, man nemt glemmer i hverdagen:</p>
      <ul>
        <li>Emhættefilteret (skal afkalkes og affedtes).</li>
        <li>Gummilister i køleskabet og opvaskemaskinen.</li>
        <li>Afløbet i brusenichen og under håndvasken.</li>
        <li>Bag radiatorer og i ovnens renderskinner.</li>
      </ul>
      
      <h2>3. Afkalkning kræver tid</h2>
      <p>Badeværelset er det rum, hvor flest dumper. Fliser, armaturer og fuger skal afkalkes grundigt. Brug en god kalkfjerner, lad den virke i 10-15 minutter (men lad den ikke tørre ind på sarte fliser), og skrub grundigt efter med en svamp.</p>
      
      <h2>4. Rengør vinduerne både indvendigt og udvendigt</h2>
      <p>Rene ruder gør en enorm forskel for helhedsindtrykket af boligen. Sørg for at pudse vinduerne og tørre vindueskarmene af. Hvis vinduerne er stribede eller beskidte, trækker det hele indtrykket ned.</p>
      
      <h2>5. Overvej professionel hjælp</h2>
      <p>Hvis du vil slippe for stressen og være helt sikker på at få dit depositum tilbage, kan det betale sig at booke en professionel flytterengøring. Hos Renzen tilbyder vi professionel flytterengøring med tilfredshedsgaranti. Det betyder, at hvis din udlejer mod forventning har indvendinger til rengøringen under flyttesynet, kommer vi og udbedrer det kvit og frit.</p>
    `,
    publishedAt: '2026-04-05',
    author: 'Rengøringseksperten',
    readTime: '5 min read',
    indexable: true,
  }
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find(a => a.slug === slug);
}
