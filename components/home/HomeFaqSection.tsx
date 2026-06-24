"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Reveal } from "@/components/dynamic/Reveal";

const HOME_FAQS = [
  {
    q: "Hvordan fungerer Renzen?",
    a: "Det er super nemt! Du bruger bare vores prisberegner, indtaster antal kvadratmeter og får en fast pris med det samme. Derefter kan du booke direkte online på under 2 minutter.",
  },
  {
    q: "Hvad koster det at booke?",
    a: "Prisen afhænger af dine kvadratmeter og den valgte service. Du kan altid se den præcise, faste pris i vores beregner før du bekræfter. Der er ingen skjulte gebyrer eller binding.",
  },
  {
    q: "Er rengøringen forsikret?",
    a: "Ja, alle rengøringer udført af vores Zenmestre er fuldt forsikrede. Vi dækker for eventuelle skader, så du trygt kan overlade nøglerne til os.",
  },
  {
    q: "Hvem gør rent hjemme hos mig?",
    a: "Vores dygtige og erfarne Zenmestre! Alle er godkendt af Renzen med baggrundstjek, oplæring og ren straffeattest. Mange steder får du en fast Zenmester tilknyttet.",
  },
  {
    q: "Hvor ofte kan jeg få gjort rent?",
    a: "Du kan vælge mellem enkeltstående rengøring (f.eks. ved flytning eller forårsrengøring) eller faste aftaler som ugentligt, hver anden uge eller hver 4. uge. Vi tilpasser os dit behov.",
  },
  {
    q: "Skal jeg selv have rengøringsmidler klar?",
    a: "Nej, vores Zenmestre medbringer altid alle nødvendige rengøringsmidler, klude og udstyr, inklusiv professionel støvsuger og gulvmoppe, medmindre andet er aftalt.",
  },
  {
    q: "Hvordan betaler jeg?",
    a: "Betalingen foregår automatisk via kort. Du indtaster dit kort ved booking, og vi trækker først pengene efter rengøringen er udført. Du modtager altid en kvittering på mail.",
  },
  {
    q: "Kan jeg trække rengøringen fra i skat?",
    a: "Ja, med servicefradraget kan du trække arbejdslønnen fra i skat. Efter rengøringen får du en faktura, som du nemt kan indberette på SKAT, og du sparer ca. 26%.",
  },
  {
    q: "Hvad sker der hvis jeg skal aflyse?",
    a: "Du kan frit aflyse eller ændre din aftale op til 48 timer før rengøringen starter direkte i din profil. Ved aflysning senere end dette, kan der forekomme et gebyr.",
  },
  {
    q: "Hvad hvis jeg ikke er tilfreds?",
    a: "Vi har 100% tilfredshedsgaranti. Skulle der mod forventning være mangler i rengøringen, kontakter du os blot inden for 24 timer, og vi kommer ud og udbedrer det kvit og frit.",
  },
] as const;

export function HomeFaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section id="faq" className="py-16 sm:py-20 bg-[#f8fafc]/50">
      <div className="max-w-[1300px] mx-auto px-6">
        <Reveal className="text-center mb-16 flex flex-col gap-3">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-blue">
            Har du spørgsmål?
          </h2>
          <p className="text-zinc-600 font-medium text-lg leading-relaxed">
            Her finder du svar på de mest almindelige spørgsmål om vores
            rengøringsservice.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {HOME_FAQS.map((faq, index) => {
            const isOpen = openFaq === index;
            const triggerId = `home-faq-trigger-${index}`;
            const panelId = `home-faq-panel-${index}`;

            return (
              <Reveal
                key={faq.q}
                className={`bg-white rounded-2xl border transition-all duration-300 shadow-xs hover:shadow-md ${
                  index % 2 === 0
                    ? "fade-in-delay-100"
                    : "fade-in-delay-200"
                } ${
                  isOpen
                    ? "border-primary/30 ring-1 ring-primary/5"
                    : "border-zinc-200/60 hover:border-primary/20"
                }`}
              >
                <button
                  id={triggerId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() =>
                    setOpenFaq((current) =>
                      current === index ? null : index,
                    )
                  }
                  className="w-full py-5 px-6 flex items-center justify-between text-left font-display font-bold text-base sm:text-lg text-brand-blue hover:text-primary transition-colors cursor-pointer focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <span aria-hidden="true">
                    {isOpen ? (
                      <ChevronUp size={20} className="text-primary" />
                    ) : (
                      <ChevronDown size={20} className="text-zinc-400" />
                    )}
                  </span>
                </button>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  className={`px-6 pb-6 text-zinc-600 text-[15px] leading-relaxed font-medium border-t border-zinc-100 pt-4 animate-in fade-in slide-in-from-top-1 duration-150 ${
                    isOpen ? "block" : "hidden"
                  }`}
                >
                  {faq.a}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
