import React from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { siteConfig } from "@/lib/siteConfig";
import {
  KLUB_ANNUAL_KR,
  KLUB_ANNUAL_MONTHLY_EQUIVALENT_KR,
  KLUB_MONTHLY_KR,
  ZEN_CREDIT_ANNUAL_KR,
  ZEN_CREDIT_ANNUAL_REMAINING_AFTER_FIRST_KR,
  ZEN_CREDIT_MONTHLY_KR,
} from "@/data/pricing";

const listClass = "list-disc pl-5 flex flex-col gap-1.5 mt-1";
const klubAnnualMonthlyLabel = KLUB_ANNUAL_MONTHLY_EQUIVALENT_KR.toLocaleString(
  "da-DK",
  { minimumFractionDigits: 2, maximumFractionDigits: 2 },
);
const zenCreditAnnualMonths = ZEN_CREDIT_ANNUAL_KR / ZEN_CREDIT_MONTHLY_KR;
const zenCreditRemainingMonths = zenCreditAnnualMonths - 1;

export default function HandelsbetingelserPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans">
      <SiteHeader />

      <main className="flex-grow max-w-[900px] mx-auto px-6 py-16 sm:py-20 w-full">
        <div className="bg-white rounded-3xl border border-zinc-200/60 p-8 sm:p-12 shadow-sm text-left">
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-blue tracking-tight mb-4">
            Handelsbetingelser
          </h1>
          <p className="text-zinc-500 font-semibold text-sm mb-8">
            Senest opdateret: 14. juni 2026
          </p>

          <div className="prose prose-zinc max-w-none text-zinc-650 font-medium leading-relaxed text-[15px] flex flex-col gap-6">
            <section className="flex flex-col gap-2">
              <h2 className="font-display font-extrabold text-xl text-brand-blue mt-4">
                1. Virksomhed og anvendelse
              </h2>
              <p>
                Disse betingelser gælder, når en privatkunde bestiller rengøring eller
                tilmelder sig Renzen Klub direkte via Renzen.dk.
              </p>
              <div className="bg-[#f8fafc] border border-zinc-200/50 rounded-xl p-4 text-xs font-mono font-semibold text-zinc-600 flex flex-col gap-1 w-fit mt-1">
                <span>{siteConfig.legalName}</span>
                <span>E-mail: {siteConfig.email}</span>
                <span>Telefon: {siteConfig.phone}</span>
              </div>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="font-display font-extrabold text-xl text-brand-blue mt-4">
                2. Bestilling og aftale
              </h2>
              <p>
                Kunden vælger boligstørrelse, rengøringsfrekvens, dato, tidspunkt,
                eventuelle tilvalg og medlemsplan i bookingforløbet. Aftalen er indgået,
                når Renzen har sendt en ordrebekræftelse.
              </p>
              <p>
                Ordrebekræftelsen viser den valgte rengøring, pris, frekvens,
                medlemsplan og de vigtigste betalings- og opsigelsesvilkår. Kunden skal
                kontrollere oplysningerne og kontakte Renzen hurtigst muligt ved fejl.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="font-display font-extrabold text-xl text-brand-blue mt-4">
                3. Priser, betaling og servicefradrag
              </h2>
              <ul className={listClass}>
                <li>Alle priser er i danske kroner og inklusive moms.</li>
                <li>
                  Det præcise beløb for første rengøring og medlemsplan vises, før
                  kunden gennemfører bestillingen.
                </li>
                <li>
                  Betalingskortet registreres ved bestilling. Første betaling trækkes
                  efter den første udførte rengøring, medmindre andet tydeligt fremgår
                  af ordrebekræftelsen.
                </li>
                <li>
                  Efterfølgende rengøringer og medlemsbetalinger trækkes efter den
                  valgte frekvens og betalingsplan.
                </li>
                <li>
                  En vist pris efter servicefradrag er et estimat. Kunden betaler
                  beløbet før skattefradrag og er selv ansvarlig for at opfylde og
                  indberette fradragets betingelser.
                </li>
              </ul>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="font-display font-extrabold text-xl text-brand-blue mt-4">
                4. Renzen Klub
              </h2>
              <p>
                Renzen Klub giver adgang til de medlemspriser, rabatter og
                servicekreditter, der vises i bookingforløbet. Medlemskab er påkrævet,
                når kunden vælger en klubpris eller en intropris, der er markeret som
                en medlemsfordel.
              </p>
              <ul className={listClass}>
                <li>
                  <strong>Månedsplan:</strong> {KLUB_MONTHLY_KR} kr. pr. måned med minimum 6 betalte
                  medlemsmåneder.
                </li>
                <li>
                  <strong>Årsplan:</strong> {KLUB_ANNUAL_KR.toLocaleString("da-DK")} kr. betalt forud for 12 måneders
                  medlemskab, svarende til {klubAnnualMonthlyLabel} kr. pr. måned.
                </li>
                <li>
                  Medlemskabet fortsætter efter minimumsperioden, indtil kunden
                  opsiger det. En opsigelse stopper kommende fornyelser, men ikke en
                  allerede betalt medlemsperiode.
                </li>
                <li>
                  Månedsplanen kan opsiges til udløbet af den sjette betalte
                  medlemsmåned og derefter med en måneds varsel. Årsplanen kan opsiges
                  når som helst med virkning ved udløbet af den betalte 12-måneders
                  periode.
                </li>
                <li>
                  Opsigelse kan ske via kundens profil eller ved at skrive til{" "}
                  {siteConfig.email}. Renzen sender en bekræftelse på opsigelsen.
                </li>
              </ul>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="font-display font-extrabold text-xl text-brand-blue mt-4">
                5. Zen-servicekreditter
              </h2>
              <p>
                Servicekreditter er personlige rabatkreditter til udvalgte ydelser. De
                er ikke kontanter, et indestående eller et gavekort og kan ikke
                udbetales.
              </p>
              <ul className={listClass}>
                <li>
                  Kunden kan optjene {zenCreditAnnualMonths} kreditter á {ZEN_CREDIT_MONTHLY_KR} kr. i medlemsmåned 1-{zenCreditAnnualMonths} i hvert
                  medlemsår, i alt op til {ZEN_CREDIT_ANNUAL_KR.toLocaleString("da-DK")} kr. pr. medlemsår.
                </li>
                <li>
                  Den første kredit på {ZEN_CREDIT_MONTHLY_KR} kr. bruges på den første rengøring. De
                  resterende {zenCreditRemainingMonths} kreditter optjenes én ad gangen i de næste {zenCreditRemainingMonths} aktive
                  medlemsmåneder.
                </li>
                <li>
                  En kredit optjenes kun efter en gennemført medlemsbetaling. Der
                  optjenes ingen kredit ved pause, tilbagebetaling, chargeback eller
                  betalingsfejl.
                </li>
                <li>
                  Der kan bruges maksimalt {ZEN_CREDIT_MONTHLY_KR} kr. kredit på én booking og maksimalt én
                  kredit i hver medlemsmåned.
                </li>
                <li>
                  En booking skal koste mindst 999 kr. før kredit, for at kreditten kan
                  bruges.
                </li>
                <li>
                  Kreditter kan kun bruges på de udvalgte services, der er markeret som
                  kreditberettigede ved booking, og kun når servicen har tilstrækkelig
                  ledig kapacitet.
                </li>
                <li>
                  Kreditter kan ikke kombineres med kampagnekoder, introtilbud eller
                  andre rabatter, medmindre andet udtrykkeligt fremgår.
                </li>
                <li>
                  Hver kredit udløber ved udgangen af den medlemsmåned, hvor den er
                  optjent. Ubrugte kreditter overføres ikke.
                </li>
                <li>
                  Ved starten af et nyt, betalt medlemsår begynder en ny periode med op
                  til 10 månedlige kreditter.
                </li>
              </ul>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="font-display font-extrabold text-xl text-brand-blue mt-4">
                6. Intropris og tidlig afslutning
              </h2>
              <p>
                Intropriser gælder kun nye kunder og de boligstørrelser, frekvenser og
                medlemsplaner, der fremgår af tilbuddet. Normalprisen og introprisen
                vises i bookingforløbet.
              </p>
              <p>
                Hvis en månedsplan afsluttes på kundens initiativ, før 6
                medlemsbetalinger er gennemført, kan den betingede velkomstrabat
                bortfalde. Renzen kan i så fald opkræve forskellen mellem den betalte
                intropris og den normalpris, som blev vist ved bestillingen. Dette
                gælder ikke, når kunden udøver en lovbestemt rettighed, eller når
                afslutningen skyldes Renzens væsentlige misligholdelse.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="font-display font-extrabold text-xl text-brand-blue mt-4">
                7. Ændring og aflysning af rengøring
              </h2>
              <p>
                Ændring eller aflysning af en rengøring ændrer ikke automatisk
                medlemskabet. Kunden skal derfor opsige medlemskabet særskilt, hvis det
                også ønskes afsluttet.
              </p>
              <p>
                Eventuelle frister eller gebyrer for sen aflysning skal fremgå af
                bookingforløbet eller ordrebekræftelsen for at kunne opkræves. Hvis
                Renzen må flytte en booking, kontaktes kunden hurtigst muligt med et
                nyt forslag.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="font-display font-extrabold text-xl text-brand-blue mt-4">
                8. Fortrydelsesret
              </h2>
              <p>
                Ved onlinebestilling har kunden som udgangspunkt 14 dages
                fortrydelsesret fra den dag, aftalen indgås. Fortrydelse meddeles
                tydeligt til {siteConfig.email}.
              </p>
              <p>
                Hvis kunden udtrykkeligt ønsker, at en rengøring eller medlemsydelse
                begynder inden fortrydelsesfristens udløb, kan Renzen begynde
                leveringen. Fortryder kunden efter leveringen er begyndt, kan kunden
                blive opkrævet et rimeligt beløb for den del, der allerede er leveret.
                Fortrydelsesretten kan ophøre, når ydelsen er fuldt leveret, hvis
                lovens krav til kundens forudgående samtykke og anerkendelse er opfyldt.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="font-display font-extrabold text-xl text-brand-blue mt-4">
                9. Mangler og reklamation
              </h2>
              <p>
                Kunden skal kontakte Renzen inden rimelig tid efter, at en fejl eller
                mangel er opdaget, og give Renzen mulighed for at undersøge og om
                muligt afhjælpe forholdet. Henvendelsen sendes til{" "}
                {siteConfig.email} med bookingnummer og en kort beskrivelse.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="font-display font-extrabold text-xl text-brand-blue mt-4">
                10. Ændringer i medlemskabet
              </h2>
              <p>
                Væsentlige ændringer i pris eller medlemsvilkår varsles individuelt i
                rimelig tid. Hvis en ændring er til ugunst for kunden, kan kunden
                opsige medlemskabet, før ændringen får virkning, i det omfang gældende
                lov kræver det.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="font-display font-extrabold text-xl text-brand-blue mt-4">
                11. Klager og lovvalg
              </h2>
              <p>
                En klage skal først sendes til {siteConfig.email}, så parterne kan
                forsøge at finde en løsning. Hvis en forbrugerklage ikke løses, kan
                kunden undersøge muligheden for at klage til Mæglingsteamet for
                Forbrugerklager via Nævnenes Hus.
              </p>
              <p>
                Aftalen er underlagt dansk ret. Intet i disse betingelser begrænser
                kundens ufravigelige rettigheder efter dansk forbrugerret.
              </p>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
