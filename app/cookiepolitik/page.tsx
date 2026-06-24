"use client";

import React from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export default function CookiepolitikPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans">
      <SiteHeader />

      {/* Main Content Area */}
      <main className="flex-grow max-w-[900px] mx-auto px-6 py-16 sm:py-20 w-full">
        <div className="bg-white rounded-3xl border border-zinc-200/60 p-8 sm:p-12 shadow-sm text-left">
          
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-blue tracking-tight mb-4">
            Cookiepolitik
          </h1>
          <p className="text-zinc-500 font-semibold text-sm mb-8">
            Senest opdateret: {new Date().toLocaleDateString("da-DK", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <div className="prose prose-zinc max-w-none text-zinc-655 font-medium leading-relaxed text-[15px] flex flex-col gap-6">
            
            <section className="flex flex-col gap-2">
              <h2 className="font-display font-extrabold text-xl text-brand-blue mt-4">1. Hvad er cookies?</h2>
              <p>
                Cookies er små tekstfiler, som gemmes på din computer, mobiltelefon eller tablet, når du besøger et website. Cookies anvendes til at få websitet til at fungere effektivt, tilpasse din brugeroplevelse og indsamle statistik om trafikken. Cookies kan ikke indeholde skadelig kode som f.eks. virus.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="font-display font-extrabold text-xl text-brand-blue mt-4">2. Hvorfor bruger vi cookies?</h2>
              <p>
                Vi bruger cookies på Renzen.dk for at give dig en velfungerende og brugervenlig tjeneste. Overordnet set bruger vi cookies til tre formål:
              </p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 mt-1">
                <li><strong>Nødvendige cookies:</strong> Disse er essentielle for, at websitet og vores formular til tilbudsindhentning fungerer korrekt (f.eks. ved at huske din indtastede service eller postnummer midlertidigt).</li>
                <li><strong>Statistik og analyse:</strong> Hvis du accepterer statistik, bruger vi Google Analytics 4 til at forstå trafik, sidevisninger og teknisk ydeevne, så vi kan forbedre siden.</li>
                <li><strong>Marketing:</strong> Marketingteknologier aktiveres kun, hvis de fremgår af denne politik, og du særskilt accepterer marketing.</li>
              </ul>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="font-display font-extrabold text-xl text-brand-blue mt-4">3. Tredjeparts-cookies</h2>
              <p>
                Følgende eksterne tjeneste kan sætte cookies via Renzen.dk efter dit samtykke:
              </p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 mt-1">
                <li><strong>Google Analytics 4:</strong> Måle-ID G-5B7M35QQX7 anvendes til statistik. Google-tagget indlæses først, når du accepterer kategorien Statistik.</li>
              </ul>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="font-display font-extrabold text-xl text-brand-blue mt-4">4. Hvor længe gemmes cookies?</h2>
              <p>
                Nogle cookies (såkaldte session cookies) slettes automatisk, så snart du lukker din browser. Andre cookies (persistent cookies) gemmes på din enhed i en foruddefineret periode (f.eks. 12-24 måneder) for at kunne genkende din enhed ved fremtidige besøg. Hver gang du genbesøger websitet, fornyes perioden.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="font-display font-extrabold text-xl text-brand-blue mt-4">5. Hvordan sletter eller undgår du cookies?</h2>
              <p>
                Du kan til enhver tid ændre dit cookie-samtykke direkte på vores website via vores cookie-indstillinger. Derudover har du mulighed for at afvise cookies på din enhed ved at ændre indstillingerne i din internetbrowser.
              </p>
              <p>
                Hvis du ønsker at slette eksisterende cookies på din computer, afhænger metoden af, hvilken browser du benytter. Du kan finde udførlige vejledninger til sletning af cookies i de mest populære browsere på de respektive udbyderes support-sider.
              </p>
              <p className="text-stone-500 font-semibold text-xs mt-1">
                Bemærk: Hvis du blokerer eller sletter alle cookies, kan der være funktioner på websitet, som ophører med at fungere optimalt, og visse sider kan blive svære at navigere på.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="font-display font-extrabold text-xl text-brand-blue mt-4">6. Kontakt os</h2>
              <p>
                Hvis du har spørgsmål til vores brug af cookies på Renzen.dk, er du velkommen til at kontakte os på info@renzen.dk.
              </p>
            </section>

          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
