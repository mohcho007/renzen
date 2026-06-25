"use client";

import React from "react";
import {
  RenzenEditorialFooter,
  RenzenEditorialHeader,
} from "@/components/site/RenzenEditorialChrome";

export default function PersondatapolitikPage() {
  return (
    <div className="min-h-screen bg-[#fbfaf5] text-[#203129]">
      <RenzenEditorialHeader />

      <main className="px-6 py-16 sm:px-10 sm:py-20 lg:px-14">
        <div className="mx-auto max-w-[900px]">
        <div className="bg-white rounded-3xl border border-zinc-200/60 p-8 sm:p-12 shadow-sm text-left">
          
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-blue tracking-tight mb-4">
            Persondatapolitik
          </h1>
          <p className="text-zinc-500 font-semibold text-sm mb-8">
            Senest opdateret: {new Date().toLocaleDateString("da-DK", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <div className="prose prose-zinc max-w-none text-zinc-655 font-medium leading-relaxed text-[15px] flex flex-col gap-6">
            
            <section className="flex flex-col gap-2">
              <h2 className="font-display font-extrabold text-xl text-brand-blue mt-4">1. Introduktion</h2>
              <p>
                Hos Renzen beskytter vi dine personoplysninger. Når du anvender vores sammenligningstjeneste Renzen.dk, indsamler og behandler vi data om dig. Nærværende persondatapolitik beskriver, hvordan vi indsamler, lagrer, deler og beskytter dine personlige oplysninger, og hvilke rettigheder du har.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="font-display font-extrabold text-xl text-brand-blue mt-4">2. Dataansvarlig</h2>
              <p>
                Den dataansvarlige for behandlingen af dine personoplysninger er:
              </p>
              <div className="bg-[#f8fafc] border border-zinc-200/50 rounded-xl p-4 text-xs font-mono font-semibold text-zinc-600 flex flex-col gap-1 w-fit mt-1">
                <span>Renzen Rengøring</span>
                <span>E-mail: info@renzen.dk</span>
              </div>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="font-display font-extrabold text-xl text-brand-blue mt-4">3. Hvilke oplysninger indsamler vi?</h2>
              <p>
                Vi behandler personoplysninger, som du selv afgiver til os via vores opgaveformular, eller som indsamles under brug af vores website:
              </p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 mt-1">
                <li><strong>Kontaktoplysninger:</strong> Navn, e-mailadresse og telefonnummer.</li>
                <li><strong>Opgavedetaljer:</strong> Rengøringskategori, postnummer, frekvens, anslået boligstørrelse og eventuelle noter.</li>
                <li><strong>Erhvervsoplysninger (hvis relevant):</strong> Firmanavn og CVR-nummer.</li>
                <li><strong>Brugsdata:</strong> IP-adresse, browsertype, styresystem samt din adfærd på Renzen.dk (opsamlet via cookies).</li>
              </ul>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="font-display font-extrabold text-xl text-brand-blue mt-4">4. Formål og retsgrundlag for behandlingen</h2>
              <p>
                Vi behandler dine oplysninger med følgende formål:
              </p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 mt-1">
                <li><strong>Formidling af tilbud:</strong> At sende din rengøringsopgave i udbud hos op til 3 godkendte rengøringsfirmaer (GDPR art. 6, stk. 1, litra b - opfyldelse af kontrakt).</li>
                <li><strong>Kundeservice:</strong> At besvare henvendelser, yde support og følge op på formidlede opgaver (GDPR art. 6, stk. 1, litra f - legitim interesse).</li>
                <li><strong>Optimering og markedsføring:</strong> At forbedre vores tjeneste, analysere brugeradfærd samt målrette markedsføring (GDPR art. 6, stk. 1, litra a - samtykke).</li>
              </ul>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="font-display font-extrabold text-xl text-brand-blue mt-4">5. Deling af personoplysninger</h2>
              <p>
                For at kunne give dig de bedste tilbud, deler vi din opgavebeskrivelse og dine kontaktoplysninger (navn, e-mail og telefonnummer) med op til 3 udvalgte rengøringsfirmaer. Disse firmaer fungerer som selvstændigt dataansvarlige for de oplysninger, de modtager, og må kun anvende oplysningerne til at afgive tilbud på den konkrete opgave.
              </p>
              <p>
                We deler herudover data med vores underdatabehandlere (f.eks. hostingleverandører og systemudbydere), som udelukkende handler efter instruks fra Renzen under en skriftlig databehandleraftale.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="font-display font-extrabold text-xl text-brand-blue mt-4">6. Opbevaringstid</h2>
              <p>
                Vi opbevarer dine personoplysninger, så længe det er nødvendigt for at opfylde de formål, de blev indsamlet til. Oplysninger indsendt i forbindelse med et tilbud opbevares normalt i 2 år for at kunne dokumentere formidlingen og yde support, medmindre vi ifølge gældende bogføringslovgivning er forpligtet til at gemme dem længere.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="font-display font-extrabold text-xl text-brand-blue mt-4">7. Dine rettigheder</h2>
              <p>
                Du har efter databeskyttelsesforordningen en række rettigheder i forhold til vores behandling af dine oplysninger:
              </p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 mt-1">
                <li><strong>Ret til indsigt:</strong> Du kan få oplyst, hvilke data vi behandler om dig.</li>
                <li><strong>Ret til berigtigelse:</strong> Du kan få rettet ukorrekte oplysninger.</li>
                <li><strong>Ret til sletning (&quot;retten til at blive glemt&quot;):</strong> Du kan i visse tilfælde få slettet dine oplysninger før vores normale slettefrist.</li>
                <li><strong>Ret til at tilbagekalde samtykke:</strong> Du kan til enhver tid tilbagekalde dit samtykke til cookies eller nyhedsbreve.</li>
              </ul>
              <p>
                For at gøre brug af dine rettigheder kan du kontakte os på info@renzen.dk.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="font-display font-extrabold text-xl text-brand-blue mt-4">8. Klage til Datatilsynet</h2>
              <p>
                Du har ret til at indgive en klage til Datatilsynet, hvis du er utilfreds med den måde, vi behandler dine personoplysninger på. Du finder Datatilsynets kontaktoplysninger på www.datatilsynet.dk.
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
