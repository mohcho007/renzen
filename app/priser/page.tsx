import React from 'react';
import { Metadata } from 'next';
import { constructMetadata } from '../../lib/seo';
import PriceCalculator from '../../components/PriceCalculator';
import PriceExamples from '../../components/PriceExamples';
import FAQSection from '../../components/FAQSection';
import CTA from '../../components/CTA';
import SchemaMarkup from '../../components/SchemaMarkup';
import { generateWebPageSchema, generateFAQSchema } from '../../lib/schema';
import { getAbsoluteUrl } from '../../lib/urls';
import { generalFAQs } from '../../data/faqs';
import { INTRO_CLEANING_FROM_KR, pricingConfig } from '../../data/pricing';
import { liveStyleDescription, liveStyleTitle } from '@/lib/metadataCopy';

export const metadata: Metadata = constructMetadata({
  title: liveStyleTitle(
    "Rengøringspriser",
    "Se priser og book online",
  ),
  description: liveStyleDescription({
    action: "Find priser på privat rengøring, flytterengøring og erhverv.",
    proof: "Brug prisberegneren og se din pris med det samme.",
    cta: `Intro fra ${INTRO_CLEANING_FROM_KR} kr. med Klub. Spar 26% med servicefradrag.`,
  }),
  path: '/priser/',
  indexable: true
});

const pricingFAQs = [
  {
    question: 'Er der skjulte gebyrer eller opstartsgebyrer?',
    answer: 'Nej. Vores priser er 100% gennemskuelige. Du betaler kun den beregnede pris baseret på din boligs størrelse og den valgte frekvens. Ingen administrationsgebyrer eller skjulte tillæg.'
  },
  {
    question: 'Hvornår trækkes betalingen?',
    answer: 'Betalingen godkendes først, efter at rengøringen er udført og afsluttet af din Zenmester. Vi trækker aldrig beløbet forud.'
  },
  {
    question: 'Hvor meget kan jeg spare med servicefradraget?',
    answer: 'I 2026 kan du få fradrag for serviceydelser (hjemmerengøring) på op til 11.900 kr. pr. person i husstanden. Skatteværdien er på ca. 26%, hvilket betyder en direkte besparelse på 26% af din samlede rengøringsudgift.'
  }
];

export default function PriserPage() {
  const absoluteUrl = getAbsoluteUrl('/priser/');
  const webPageSchema = generateWebPageSchema(
    'Rengøringspriser ⇒ Se priser og book online',
    'Se priser for privat rengøring, flytterengøring og meget mere. Helt uden binding. Spar 26% på arbejdslønnen med servicefradraget.',
    absoluteUrl
  );
  const faqSchema = generateFAQSchema([...pricingFAQs, ...generalFAQs]);

  return (
    <>
      <SchemaMarkup schema={[webPageSchema, faqSchema]} />

      <main className="min-h-screen bg-slate-50/50 pb-20">
        <section className="bg-white px-4 py-16 md:px-8 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              Priser & vilkår
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Hvad koster rengøringshjælp?
            </h1>
            <p className="mt-6 text-base leading-relaxed text-slate-500 sm:text-lg">
              Vi ønsker at gøre rengøring tilgængelig og ukompliceret. Derfor har vi en enkel kvadratmeter-baseret prismodel. Ingen binding, ingen skjulte gebyrer – kun rene linjer.
            </p>
          </div>
        </section>

        {/* Pricing Layout */}
        <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
            {/* Interactive Calculator */}
            <div className="lg:col-span-7">
              <PriceCalculator title="Beregn din pris online" showIntroText={true} />
            </div>

            {/* Price examples table */}
            <div className="lg:col-span-5">
              <PriceExamples />
            </div>
          </div>
        </section>

        {/* Detailed Price Explanations */}
        <section className="mx-auto max-w-4xl px-4 py-16 md:px-8">
          <div className="rounded-3xl bg-white p-8 border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800 text-center">Helt enkel prismodel</h2>
            <p className="mt-4 text-sm text-slate-500 text-center">
              Alle vores priser følger den samme letforståelige formel:
            </p>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3 text-center">
              <div className="rounded-2xl bg-slate-50 p-6">
                <span className="text-3xl font-black text-slate-800">{pricingConfig.basePrice} kr.</span>
                <h4 className="mt-2 text-sm font-bold text-slate-700">Grundpris</h4>
                <p className="mt-1 text-xs text-slate-500">Fast beløb pr. rengøring</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-6 flex flex-col justify-center">
                <span className="text-3xl font-black text-emerald-600">+</span>
              </div>

              <div className="rounded-2xl bg-slate-50 p-6">
                <span className="text-3xl font-black text-slate-800">{pricingConfig.pricePerSqm} kr.</span>
                <h4 className="mt-2 text-sm font-bold text-slate-700">Kvadratmeterpris</h4>
                <p className="mt-1 text-xs text-slate-500">Pr. kvadratmeter boligstørrelse</p>
              </div>
            </div>

            {/* Frequency Discounts */}
            <h3 className="mt-12 text-lg font-bold text-slate-800 border-t border-slate-100 pt-8">
              Abonnementsrabatter
            </h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Hvis du vælger et fast rengøringsabonnement, sparer du en fast procentsats på den samlede rengøringspris:
            </p>
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-100">
              <table className="min-w-full divide-y divide-slate-100 text-xs sm:text-sm">
                <thead className="bg-slate-50 font-bold text-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left">Rengøringsinterval</th>
                    <th className="px-6 py-3 text-right">Rabat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  <tr>
                    <td className="px-6 py-4">Ugentlig (Hver uge)</td>
                    <td className="px-6 py-4 text-right text-emerald-600 font-bold">Spar 20%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">Biweekly (Hver 2. uge)</td>
                    <td className="px-6 py-4 text-right text-emerald-600 font-bold">Spar 15%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">Fourweekly (Hver 4. uge)</td>
                    <td className="px-6 py-4 text-right text-emerald-600 font-bold">Spar 5%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">Enkeltstående (Engangs)</td>
                    <td className="px-6 py-4 text-right font-medium">0% (Ingen rabat)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 border-t border-slate-100">
          <FAQSection faqs={[...pricingFAQs, ...generalFAQs]} title="Ofte stillede spørgsmål om priser" />
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
          <CTA />
        </section>
      </main>
    </>
  );
}
