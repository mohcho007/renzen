import React from "react";
import Link from "next/link";
import {
  RenzenEditorialFooter,
  RenzenEditorialHeader,
} from "@/components/site/RenzenEditorialChrome";
import { siteConfig } from "@/lib/siteConfig";

const listClass = "list-disc pl-5 flex flex-col gap-1.5 mt-1";

function Mailto() {
  return (
    <a
      href={`mailto:${siteConfig.email}`}
      className="text-brand-blue hover:underline"
    >
      {siteConfig.email}
    </a>
  );
}

export default function HandelsbetingelserPage() {
  return (
    <div className="min-h-screen bg-[#fbfaf5] text-[#203129]">
      <RenzenEditorialHeader />

      <main className="px-6 py-16 sm:px-10 sm:py-20 lg:px-14">
        <div className="mx-auto max-w-[900px]">
        <div className="bg-white rounded-3xl border border-zinc-200/60 p-8 sm:p-12 shadow-sm text-left">
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-blue tracking-tight mb-4">
            Handelsbetingelser for Renzen.dk
          </h1>
          <p className="text-zinc-500 font-semibold text-sm mb-8">
            Senest opdateret: 25. juni 2026
          </p>

          <div className="prose prose-zinc max-w-none text-zinc-650 font-medium leading-relaxed text-[15px] flex flex-col gap-6">
            <section className="flex flex-col gap-2">
              <h2 className="font-display font-extrabold text-xl text-brand-blue mt-4">
                1. Virksomhed og anvendelse
              </h2>
              <div className="bg-[#f8fafc] border border-zinc-200/50 rounded-xl p-4 text-xs font-mono font-semibold text-zinc-600 flex flex-col gap-1 w-fit mt-1">
                <span>Renzen</span>
                <span>CVR nr.: 27569811</span>
                <span>Trædrejerporten 1</span>
                <span>2650 Hvidovre</span>
                <span>
                  E-mail: <Mailto />
                </span>
                <span>Telefon: {siteConfig.phone}</span>
              </div>
              <p>
                I disse betingelser omtales kunden som &ldquo;kunden&rdquo;. Den
                person, der udfører rengøringen, omtales som
                &ldquo;Zenmester&rdquo;.
              </p>
              <p>
                Ved booking, oprettelse af kundekonto eller tilmelding til
                Renzen Klub accepterer kunden disse handelsbetingelser.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="font-display font-extrabold text-xl text-brand-blue mt-4">
                2. Bestilling og aftale
              </h2>
              <p>
                Kunden vælger boligstørrelse, rengøringsfrekvens, dato,
                tidspunkt, eventuelle tilvalg og medlemsplan i bookingforløbet.
              </p>
              <p>
                Aftalen er indgået, når Renzen har sendt en ordrebekræftelse til
                kunden.
              </p>
              <p>
                Ordrebekræftelsen viser den valgte rengøring, pris, frekvens,
                medlemsplan og de vigtigste betalings-, afbestillings- og
                opsigelsesvilkår. Kunden skal kontrollere oplysningerne og
                kontakte Renzen hurtigst muligt ved fejl.
              </p>
              <p>
                Renzen forbeholder sig retten til at afvise eller ændre en
                booking, hvis der er fejl i pris, boligstørrelse, adresse,
                kapacitet, adgangsforhold eller andre væsentlige oplysninger.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="font-display font-extrabold text-xl text-brand-blue mt-4">
                3. Priser, betaling og servicefradrag
              </h2>
              <p>Alle priser er i danske kroner og inklusive moms.</p>
              <p>
                Det præcise beløb for første rengøring, eventuelle tilvalg og
                medlemsplan vises, før kunden gennemfører bestillingen.
              </p>
              <p>
                Betalingskort registreres ved bestilling. Betaling for rengøring
                trækkes som udgangspunkt efter udført rengøring, medmindre andet
                tydeligt fremgår af bookingforløbet eller ordrebekræftelsen.
              </p>
              <p>
                Ved løbende rengøring accepterer kunden, at betaling automatisk
                trækkes efter hver udført rengøring i henhold til den valgte
                frekvens.
              </p>
              <p>
                Medlemsbetaling for Renzen Klub trækkes efter den valgte
                medlemsplan. Hvis kunden vælger årsplan, betales medlemskabet
                forud.
              </p>
              <p>
                Hvis en betaling afvises, kan Renzen forsøge at trække beløbet
                igen, kontakte kunden for opdatering af betalingsoplysninger,
                sætte medlemsfordele på pause eller aflyse kommende bookinger,
                indtil betalingen er gennemført.
              </p>
              <p>
                En vist pris efter servicefradrag er kun et estimat. Kunden
                betaler beløbet før skattefradrag og er selv ansvarlig for at
                opfylde og indberette betingelserne for servicefradrag.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="font-display font-extrabold text-xl text-brand-blue mt-4">
                4. Renzen Klub
              </h2>
              <p>
                Renzen Klub er et medlemskab, der giver adgang til medlemspriser,
                udvalgte rabatter, Zenkreditter og andre medlemsfordele, som
                vises i bookingforløbet.
              </p>
              <p>
                Renzen Klub koster 790 kr. inkl. moms for 12 måneders
                medlemskab og betales forud ved oprettelse, medmindre andet
                tydeligt fremgår af bookingforløbet.
              </p>
              <p>
                Medlemskab er påkrævet, når kunden vælger en klubpris,
                intropris eller medlemsfordel, der er markeret som en del af
                Renzen Klub.
              </p>
              <p>
                Medlemskabet gælder i 12 måneder fra oprettelsesdatoen. Hvis
                medlemskabet er sat til automatisk fornyelse, fremgår dette
                tydeligt ved bestilling og i ordrebekræftelsen.
              </p>
              <p>
                Kunden kan opsige medlemskabet via kundens profil eller ved at
                skrive til <Mailto />. En opsigelse stopper kommende fornyelser,
                men giver ikke ret til tilbagebetaling af en allerede betalt
                medlemsperiode, medmindre kunden har en lovbestemt ret til
                tilbagebetaling.
              </p>
              <p>
                Medlemsfordele kan variere afhængigt af boligstørrelse,
                rengøringsfrekvens, kapacitet, kampagner og valgte ydelser.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="font-display font-extrabold text-xl text-brand-blue mt-4">
                5. Zenkreditter
              </h2>
              <p>
                Zenkreditter er personlige rabatkreditter, der kan bruges på
                udvalgte ydelser hos Renzen. Kreditterne er ikke kontanter, et
                indestående eller et gavekort og kan ikke udbetales, overdrages
                eller ombyttes til penge.
              </p>
              <p>
                Som medlem kan kunden optjene op til 12 Zenkreditter á 200 kr.
                pr. medlemsår, svarende til op til 2.400 kr. i rabatværdi pr.
                betalt medlemsår.
              </p>
              <p>
                Der optjenes maksimalt én kredit pr. aktiv medlemsmåned. En
                kredit optjenes kun, når medlemskabet er aktivt og betalt. Der
                optjenes ikke kredit ved betalingsfejl, chargeback, pause,
                tilbagebetaling eller ophørt medlemskab.
              </p>
              <p>
                Der kan maksimalt bruges én kredit á 200 kr. pr. booking og
                maksimalt én kredit pr. medlemsmåned.
              </p>
              <p>
                En booking skal koste mindst 999 kr. før brug af kredit, for at
                kreditten kan anvendes.
              </p>
              <p>
                Kreditter kan kun bruges på de ydelser, der er markeret som
                kreditberettigede ved booking, og kun når Renzen har ledig
                kapacitet til den valgte ydelse.
              </p>
              <p>
                Kreditter kan ikke kombineres med kampagnekoder eller andre
                rabatter, medmindre det tydeligt fremgår af tilbuddet.
              </p>
              <p>
                Hvis første rengøring er købt til intropris, kan Zenkredit som
                bruges på samme booking, medmindre andet tydeligt fremgår.
              </p>
              <p>
                Hver kredit udløber ved udgangen af den medlemsmåned, hvor den
                er optjent. Ubrugte kreditter overføres ikke til senere
                måneder.
              </p>
              <p>
                Ved starten af et nyt betalt medlemsår begynder en ny periode
                med mulighed for optjening af op til 12 nye månedlige kreditter.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="font-display font-extrabold text-xl text-brand-blue mt-4">
                6. Intropris og betinget velkomstrabat
              </h2>
              <p>
                Intropriser gælder kun nye kunder og kun for de boligstørrelser,
                frekvenser og medlemsplaner, der fremgår af det konkrete tilbud.
              </p>
              <p>
                Introprisen kan som udgangspunkt kun benyttes én gang pr.
                husstand, adresse, kunde og betalingskort.
              </p>
              <p>
                Normalprisen, introprisen, medlemsprisen og eventuelle
                minimumsvilkår vises i bookingforløbet, før kunden gennemfører
                bestillingen.
              </p>
              <p>
                Introprisen er en betinget velkomstrabat. Hvis det tydeligt
                fremgår af tilbuddet, at introprisen forudsætter oprettelse af
                Renzen Klub, accepterer kunden ved bestilling, at medlemskabet
                er en del af det samlede tilbud.
              </p>
              <p>
                Hvis kunden uberettiget får medlemsbetalingen tilbageført,
                annullerer betalingen, foretager chargeback eller på anden måde
                ikke betaler for det medlemskab, som introprisen var betinget af,
                kan Renzen opkræve forskellen mellem den betalte intropris og
                den normalpris, der blev vist ved bestillingen.
              </p>
              <p>
                Dette gælder ikke, hvis kunden udøver en lovbestemt rettighed,
                eller hvis aftalen afsluttes som følge af Renzens væsentlige
                misligholdelse.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="font-display font-extrabold text-xl text-brand-blue mt-4">
                7. Ændring, aflysning og forhindret adgang
              </h2>
              <p>
                Kunden kan ændre eller aflyse en rengøring senest 24 timer før
                det aftalte starttidspunkt via kundens profil eller ved at
                kontakte Renzen.
              </p>
              <p>
                Ved ændring eller aflysning senere end 24 timer før start kan
                Renzen opkræve op til fuld pris for den planlagte rengøring,
                hvis Renzen ikke med rimelighed kan nå at ombooke tiden eller
                undgå omkostningen.
              </p>
              <p>
                Hvis Renzen eller Zenmesteren ikke kan få adgang til kundens
                adresse på det aftalte tidspunkt, betragtes dette som forhindret
                adgang. I sådanne tilfælde kan kunden blive opkrævet fuld pris
                for den planlagte rengøring.
              </p>
              <p>Forhindret adgang omfatter blandt andet:</p>
              <ul className={listClass}>
                <li>forkert eller manglende nøgle</li>
                <li>
                  manglende adgang til opgang, port, havelåge eller lignende
                </li>
                <li>manglende eller forkert adgangskode</li>
                <li>manglende deaktivering af alarm</li>
                <li>at kunden ikke er til stede, hvis dette var aftalt</li>
                <li>at nøgle ikke er placeret på det aftalte sted</li>
                <li>
                  fejl i nøgleboks, lås, porttelefon, portsystem eller
                  adgangssystem
                </li>
              </ul>
              <p>
                Hvis rengøringen ikke kan gennemføres på grund af forhindret
                adgang, kan ombooking ske efter aftale. Renzen kan opkræve et
                rimeligt ombookingsgebyr til dækning af transport, tid og
                administration.
              </p>
              <p>
                Ændring eller aflysning af en enkelt rengøring ændrer ikke
                automatisk kundens medlemskab. Kunden skal opsige medlemskabet
                særskilt, hvis medlemskabet også ønskes afsluttet.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="font-display font-extrabold text-xl text-brand-blue mt-4">
                8. Kundens ansvar før rengøring
              </h2>
              <p>
                Kunden skal sikre, at Renzen kan udføre rengøringen forsvarligt
                og effektivt på det aftalte tidspunkt.
              </p>
              <p>Kunden skal blandt andet sikre:</p>
              <ul className={listClass}>
                <li>
                  korrekt adresse, kontaktoplysninger og adgangsinformation
                </li>
                <li>
                  adgang til bolig, opgang, port, nøgleboks og eventuelle
                  alarmkoder
                </li>
                <li>almindelig oprydning før rengøringen</li>
                <li>
                  at særlige forhold, sarte overflader, kæledyr eller særligt
                  krævende rengøringsforhold oplyses på forhånd
                </li>
                <li>
                  at nødvendige rengøringsmidler og udstyr er til stede, hvis
                  kunden selv skal stille dette til rådighed
                </li>
              </ul>
              <p>
                Hvis manglende oprydning, manglende adgang, farlige forhold,
                kæledyr, rod eller væsentligt ændrede forhold gør rengøringen
                vanskelig, urimelig tidskrævende eller uforsvarlig, kan Renzen
                helt eller delvist afvise at udføre opgaven.
              </p>
              <p>
                I sådanne tilfælde kan kunden blive opkrævet fuld pris, hvis
                forholdet skyldes kunden.
              </p>
              <p>
                Hvis rengøringen påbegyndes, men ikke kan færdiggøres på grund
                af forhold, der kan henføres til kunden, anses ydelsen som helt
                eller delvist leveret, og kunden kan blive opkrævet for den
                planlagte rengøring.
              </p>
              <p>
                Renzen er ikke ansvarlig for manglende rengøring af områder, der
                ikke har været tilgængelige, ryddede eller forsvarlige at
                rengøre.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="font-display font-extrabold text-xl text-brand-blue mt-4">
                9. Forsinkelse og aflysning fra Renzens side
              </h2>
              <p>
                Mindre forsinkelser kan forekomme som følge af trafik, sygdom,
                vejrforhold, tidligere opgaver eller andre praktiske forhold.
              </p>
              <p>
                Forsinkelser på op til 30-60 minutter anses normalt ikke som
                misligholdelse.
              </p>
              <p>
                Hvis Renzen må flytte eller aflyse en rengøring på grund af
                sygdom, force majeure, manglende kapacitet eller andre forhold
                uden for Renzens rimelige kontrol, kontaktes kunden hurtigst
                muligt med forslag til ny tid.
              </p>
              <p>
                Hvis rengøringen ikke kan gennemføres, og kunden ikke ønsker
                ombooking, tilbagebetales eventuel betaling for den konkrete
                rengøring. Kunden har ikke krav på yderligere kompensation,
                medmindre andet følger af ufravigelig lovgivning.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="font-display font-extrabold text-xl text-brand-blue mt-4">
                10. Nøgler, adgang og alarm
              </h2>
              <p>
                Renzen kan efter aftale opbevare kundens nøgler, adgangskort,
                koder eller andre adgangsmidler.
              </p>
              <p>
                Nøgler og adgangsmidler opbevares forsvarligt og mærkes på en
                måde, så de ikke uden videre kan henføres til en bestemt
                adresse.
              </p>
              <p>
                Kunden er ansvarlig for, at nøgler, nøgleboks, adgangskoder,
                porttelefon, alarm og lignende fungerer på rengøringstidspunktet.
              </p>
              <p>
                Hvis et alarmsystem udløses ved adgang eller under rengøringen,
                og alarmen ikke kan deaktiveres inden for rimelig tid, kan
                Zenmesteren afbryde arbejdet og forlade adressen. Hvis
                rengøringen derfor ikke kan gennemføres eller færdiggøres, kan
                forholdet behandles som forhindret adgang.
              </p>
              <p>
                Renzen er ikke ansvarlig for gebyrer, vagttilkald eller andre
                omkostninger ved alarmudløsning, medmindre omkostningen skyldes
                Renzens ansvarspådragende fejl eller andet følger af ufravigelig
                lovgivning.
              </p>
              <p>
                Hvis en nøgle, som kunden har udleveret til Renzen, bortkommer,
                erstatter Renzen omkostningen til fremstilling af en ny nøgle.
              </p>
              <p>
                Renzen erstatter ikke omlægning af komplette låsesystemer,
                elektroniske adgangssystemer eller andre følgeomkostninger,
                medmindre andet følger af ufravigelig lovgivning.
              </p>
              <p>
                Ved ophør af kundeforholdet tilbageleveres kundens nøgler inden
                for 14 dage, medmindre andet er aftalt.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="font-display font-extrabold text-xl text-brand-blue mt-4">
                11. Reklamation og mangler
              </h2>
              <p>
                Kunden skal kontakte Renzen inden rimelig tid efter, at en fejl
                eller mangel er opdaget.
              </p>
              <p>
                For at Renzen kan undersøge forholdet bedst muligt, bør
                reklamation ske senest 24 timer efter rengøringen.
              </p>
              <p>
                Reklamation sendes til <Mailto /> med bookingnummer, en kort
                beskrivelse og tydelige billeder af de forhold, kunden ønsker
                vurderet.
              </p>
              <p>
                Renzen vurderer reklamationen på baggrund af bookingoplysninger,
                kundens beskrivelse, eventuel billeddokumentation og
                tilbagemelding fra den ansvarlige Zenmester.
              </p>
              <p>
                Hvis Renzen vurderer, at der foreligger en dokumenterbar mangel
                ved den aftalte rengøring, kan Renzen efter en konkret vurdering
                tilbyde en eller flere af følgende løsninger:
              </p>
              <ul className={listClass}>
                <li>afhjælpning ved næste planlagte rengøring</li>
                <li>særskilt udbedring, hvis manglen er væsentlig</li>
                <li>rimeligt prisafslag</li>
                <li>kredit til en kommende booking</li>
              </ul>
              <p>
                Mindre forhold, enkeltstående oversete områder eller uvæsentlige
                afvigelser giver normalt ikke ret til fuld tilbagebetaling.
              </p>
              <p>
                Ekstra rengøring uden beregning tilbydes kun, hvis Renzen
                vurderer, at manglen er væsentlig og ikke rimeligt kan løses på
                anden måde.
              </p>
              <p>
                Hvis kunden afviser rimelig afhjælpning eller ikke giver adgang
                til boligen på et aftalt tidspunkt, kan retten til yderligere
                kompensation bortfalde.
              </p>
              <p>
                Renzen hæfter ikke for forhold, der skyldes almindeligt slid,
                eksisterende snavs, kalk, rust, misfarvninger, fastgroede
                belægninger, skader, manglende oprydning eller forhold, som
                kunden ikke har oplyst om ved booking.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="font-display font-extrabold text-xl text-brand-blue mt-4">
                12. Skader, forsikring og dækning
              </h2>
              <p>
                Renzen har en forsikringsordning, der kan dække visse skader, som
                dokumenterbart opstår i forbindelse med udførelse af rengøring
                gennem Renzen.
              </p>
              <p>
                Forsikringen kan blandt andet omfatte skader på kundens ejendom,
                inventar, møbler, gulve, vægge og personlige ejendele, hvis
                skaden er opstået som direkte følge af rengøringen og er dækket
                efter forsikringens betingelser.
              </p>
              <p>Forsikringen dækker ikke nødvendigvis skader, der skyldes:</p>
              <ul className={listClass}>
                <li>kundens egen forsømmelse eller manglende oplysninger</li>
                <li>almindeligt slid, ælde eller eksisterende skader</li>
                <li>tyveri eller indbrud begået af tredjemand</li>
                <li>
                  brand, storm, oversvømmelse eller andre forhold uden for
                  rengøringsopgaven
                </li>
                <li>genstande placeret ustabilt eller uhensigtsmæssigt</li>
                <li>
                  særligt sarte overflader eller genstande, som kunden ikke har
                  oplyst Renzen om på forhånd
                </li>
                <li>
                  skader på genstande, der burde have været fjernet, sikret
                  eller oplyst om før rengøringen
                </li>
              </ul>
              <p>
                Skader skal anmeldes skriftligt til <Mailto /> hurtigst muligt
                og senest 24 timer efter rengøringen, så Renzen kan undersøge
                sagen. Anmeldelsen skal indeholde bookingnummer, beskrivelse af
                skaden og tydelig billeddokumentation.
              </p>
              <p>
                Renzen kan anmode om yderligere dokumentation, herunder
                kvittering, vurdering, billeder eller besigtigelse, før en
                skadesag kan færdigbehandles.
              </p>
              <p>
                Ved dækkede skader kan der efter forsikringsordningens
                betingelser gælde en selvrisiko på 600 kr. pr. skadesanmeldelse.
              </p>
              <p>
                Hvis skaden skyldes forhold, der kan henføres til kunden,
                herunder manglende oplysninger om sarte overflader, ustabilt
                placerede genstande, eksisterende skader eller forhold uden for
                Renzens kontrol, kan kunden blive pålagt at betale selvrisikoen.
              </p>
              <p>
                Hvis skaden skyldes Renzens eller Zenmesterens
                ansvarspådragende fejl, vurderes dækning, selvrisiko og
                eventuel erstatning konkret efter gældende ret og
                forsikringsbetingelserne.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="font-display font-extrabold text-xl text-brand-blue mt-4">
                13. Særlige overflader og værdigenstande
              </h2>
              <p>
                Kunden skal på forhånd oplyse Renzen om særligt sarte, dyre
                eller skrøbelige overflader og genstande, der kræver særlig
                behandling.
              </p>
              <p>Dette gælder blandt andet:</p>
              <ul className={listClass}>
                <li>marmor</li>
                <li>natursten</li>
                <li>mikrocement</li>
                <li>beton</li>
                <li>ubehandlet træ</li>
                <li>antikviteter</li>
                <li>designlamper</li>
                <li>kunst</li>
                <li>glasgenstande</li>
                <li>elektronik</li>
                <li>løse eller ustabilt placerede genstande</li>
              </ul>
              <p>
                Hvis kunden ønsker rengøring af særligt sarte overflader eller
                genstande, sker dette kun efter aftale.
              </p>
              <p>
                Hvis kunden ikke har oplyst om særlige forhold på forhånd, kan
                Renzen afvise ansvar for skader, i det omfang dette er tilladt
                efter gældende lovgivning.
              </p>
              <p>
                Kunden bør fjerne eller sikre værdigenstande, skrøbelige
                genstande, kontanter, smykker, private dokumenter og andre
                følsomme genstande før rengøringen.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="font-display font-extrabold text-xl text-brand-blue mt-4">
                14. Billeddokumentation
              </h2>
              <p>
                For at kunne dokumentere forhold på adressen, udført arbejde,
                adgangsproblemer, manglende oprydning, reklamationer eller
                skader kan Renzen eller Zenmesteren tage relevante billeder før
                og efter rengøringen.
              </p>
              <p>
                Billeder bruges kun til dokumentation, kundeservice,
                reklamationsbehandling, skadesager og forebyggelse af misbrug.
              </p>
              <p>
                Billedmateriale opbevares kun så længe, det er nødvendigt for
                den konkrete sag, og behandles i overensstemmelse med Renzens{" "}
                <Link
                  href="/persondatapolitik"
                  className="text-brand-blue hover:underline"
                >
                  privatlivspolitik
                </Link>{" "}
                og gældende databeskyttelsesregler.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="font-display font-extrabold text-xl text-brand-blue mt-4">
                15. Fortrydelsesret
              </h2>
              <p>
                Ved onlinebestilling har kunden som udgangspunkt 14 dages
                fortrydelsesret fra den dag, aftalen indgås.
              </p>
              <p>
                Fortrydelse meddeles tydeligt til <Mailto />.
              </p>
              <p>
                Hvis kunden udtrykkeligt ønsker, at rengøring eller
                medlemsydelser begynder inden fortrydelsesfristens udløb, kan
                Renzen begynde leveringen.
              </p>
              <p>
                Fortryder kunden efter leveringen er begyndt, kan kunden blive
                opkrævet et rimeligt beløb for den del, der allerede er leveret.
              </p>
              <p>
                Fortrydelsesretten kan ophøre, når ydelsen er fuldt leveret,
                hvis lovens krav til kundens forudgående samtykke og
                anerkendelse er opfyldt.
              </p>
              <p>
                Hvis kunden har brugt medlemsfordele, intropris, rabatter eller
                Zen-servicekreditter, kan Renzen ved en eventuel fortrydelse
                modregne værdien af de ydelser eller fordele, som kunden allerede
                har modtaget, i det omfang dette er tilladt efter gældende
                lovgivning.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="font-display font-extrabold text-xl text-brand-blue mt-4">
                16. Misbrug, omgåelse og adfærd
              </h2>
              <p>
                Renzen kan afvise, begrænse, suspendere eller lukke en kundes
                adgang til booking og medlemsfordele ved konkret mistanke om
                misbrug.
              </p>
              <p>Misbrug kan blandt andet omfatte:</p>
              <ul className={listClass}>
                <li>gentagne uberettigede reklamationer eller skadesanmeldelser</li>
                <li>falske oplysninger</li>
                <li>
                  brug af flere profiler for at opnå introtilbud flere gange
                </li>
                <li>tilbageførsel af betalinger uden saglig grund</li>
                <li>
                  systematisk misbrug af intropriser, kreditter eller rabatter
                </li>
                <li>
                  truende, chikanerende, diskriminerende eller krænkende adfærd
                  over for Renzen eller Zenmestre
                </li>
                <li>
                  forsøg på at indgå aftaler med Zenmestre uden om Renzen, når
                  kontakten er etableret via Renzen
                </li>
              </ul>
              <p>
                Kunden må ikke forsøge at omgå Renzen ved at indgå direkte
                aftale med en Zenmester, som kunden har fået kontakt til gennem
                Renzen.dk.
              </p>
              <p>
                Ved misbrug kan Renzen opkræve betaling for allerede leverede
                ydelser, opkræve forskel til normalpris, lukke adgang til
                kampagner eller afvise fremtidige bookinger.
              </p>
              <p>
                Kunden skal sikre et sikkert og forsvarligt arbejdsmiljø for
                Zenmesteren. Renzen kan afbryde eller afvise en rengøring, hvis
                forholdene på adressen er uforsvarlige, utrygge eller
                uacceptable.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="font-display font-extrabold text-xl text-brand-blue mt-4">
                17. Ændringer i priser, medlemskab og vilkår
              </h2>
              <p>
                Renzen kan ændre priser, medlemsfordele og handelsbetingelser
                med rimeligt varsel.
              </p>
              <p>
                Væsentlige ændringer i pris eller medlemsvilkår varsles
                individuelt i rimelig tid, hvis ændringen har betydning for
                kundens eksisterende medlemskab.
              </p>
              <p>
                Hvis en ændring er til ugunst for kunden, kan kunden opsige
                medlemskabet, før ændringen får virkning, i det omfang gældende
                lov kræver det.
              </p>
              <p>
                Ændringer påvirker ikke allerede betalte rengøringer eller
                medlemsperioder, medmindre andet følger af lovgivningen eller
                aftales særskilt.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="font-display font-extrabold text-xl text-brand-blue mt-4">
                18. Privatliv og datahåndtering
              </h2>
              <p>
                Renzen behandler personoplysninger i overensstemmelse med
                gældende databeskyttelseslovgivning og Renzens{" "}
                <Link
                  href="/persondatapolitik"
                  className="text-brand-blue hover:underline"
                >
                  privatlivspolitik
                </Link>
                .
              </p>
              <p>
                Renzen behandler blandt andet oplysninger, der er nødvendige for
                booking, betaling, kundeservice, reklamation, skadesbehandling,
                medlemskab og dokumentation.
              </p>
              <p>
                Renzen deler ikke kundens oplysninger med tredjemand til
                markedsføring uden kundens udtrykkelige samtykke.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="font-display font-extrabold text-xl text-brand-blue mt-4">
                19. Klager og lovvalg
              </h2>
              <p>
                En klage skal først sendes til <Mailto />, så parterne kan
                forsøge at finde en løsning.
              </p>
              <p>
                Hvis en forbrugerklage ikke løses, kan kunden undersøge
                muligheden for at klage til Mæglingsteamet for Forbrugerklager
                via Nævnenes Hus.
              </p>
              <p>Aftalen er underlagt dansk ret.</p>
              <p>
                Intet i disse betingelser begrænser kundens ufravigelige
                rettigheder efter dansk forbrugerret.
              </p>
            </section>
          </div>
        </div>
        </div>
      </main>

      <RenzenEditorialFooter />
    </div>
  );
}
