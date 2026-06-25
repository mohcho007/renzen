"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, ShieldCheck, Star } from "lucide-react";
import { HeroBookingForm } from "@/components/site/HeroBookingForm";
import {
  RenzenEditorialFooter,
  RenzenEditorialHeader,
} from "@/components/site/RenzenEditorialChrome";
import { RenzenKlubPromoSection } from "@/components/site/RenzenKlubIntro";
import {
  RenzenKlubMaskCallout,
  renzenKlubMaskStyles,
} from "@/components/site/RenzenKlubMaskCallout";
import styles from "@/components/site/RenzenEditorial.module.css";
import {
  ZEN_CREDIT_MEMBERSHIP_FAQ_ANSWER_DU,
  ZEN_CREDIT_SERVICES_SECTION_INTRO,
} from "@/lib/zenCreditServices";
import { listPriceKr, pricingConfig, INTRO_CLEANING_FROM_KR, KLUB_ANNUAL_KR, KLUB_ANNUAL_MONTHLY_EQUIVALENT_KR, KLUB_MONTHLY_KR, ZEN_CREDIT_MONTHLY_KR } from "@/data/pricing";
import { ZenCreditServicesGrid } from "@/components/site/ZenCreditServicesGrid";
import { getServiceCityUrl } from "@/lib/urls";
import { PRIVAT_RENGORING_PRIORITY_1_CITIES } from "@/lib/privatRengoringCities";

const introFromLabel = `${INTRO_CLEANING_FROM_KR} kr.`;

const servicefradragPrice = (price: number) =>
  Math.round(price * (1 - pricingConfig.servicefradragPct / 100));

const priceExamples = [
  { sqm: 70, price: listPriceKr(70), afterFradrag: servicefradragPrice(listPriceKr(70)) },
  { sqm: 100, price: listPriceKr(100), afterFradrag: servicefradragPrice(listPriceKr(100)) },
  { sqm: 130, price: listPriceKr(130), afterFradrag: servicefradragPrice(listPriceKr(130)) },
];

const klubMonthlyLabel = KLUB_ANNUAL_MONTHLY_EQUIVALENT_KR.toLocaleString(
  "da-DK",
  { minimumFractionDigits: 2, maximumFractionDigits: 2 },
);

const membershipSteps = [
  {
    title: "Du betaler et lille beløb hver måned",
    text: `Renzen Klub koster ${KLUB_MONTHLY_KR} kr. om måneden — eller ${KLUB_ANNUAL_KR.toLocaleString("da-DK")} kr. for et helt år (= ${klubMonthlyLabel} kr./md.), hvis du vil spare mest.`,
  },
  {
    title: "Du får billigere rengøring hver gang",
    text: `Som medlem betaler du mindre for din faste rengøring. Din første rengøring kan starte fra kun ${introFromLabel}`,
  },
  {
    title: "Du får penge til andre opgaver i hjemmet",
    text: `Hver måned får du ${ZEN_CREDIT_MONTHLY_KR} kr. i Zen-kreditter. Brug dem på flytterengøring, havearbejde, vinduespudsning og andre udvalgte boligservices.`,
  },
  {
    title: "Du kan stoppe, når du vil",
    text: "Efter de første 6 måneder kan du sige op når som helst. Ingen skjulte fælder — du bestemmer selv.",
  },
];

const includedTasks = [
  "Støvsugning og gulvvask i alle rum",
  "Afstøvning af overflader, hylder og møbler",
  "Rengøring af køkken, bordplader og håndvask",
  "Rengøring af toilet, håndvask og brusekabine",
  "Tømning af skraldespande og affald",
  "Din faste Zenmester lærer dit hjem at kende",
];

const klubFaqs = [
  {
    question: "Hvad er Zen-kreditter og medlemskabet?",
    answer:
      ZEN_CREDIT_MEMBERSHIP_FAQ_ANSWER_DU,
  },
  {
    question: "Hvordan bruger jeg introtilbuddet?",
    answer:
      `Introtilbuddet giver din første rengøring fra ${introFromLabel} (op til 70 m²) ved fast rengøring hver 2. uge og aktivt Renzen Klub-medlemskab. Gå til dealsiden, vælg boligstørrelse og frekvens — intropris, normalpris og medlemskab vises, før du godkender.`,
  },
  {
    question: "Kan jeg styre mit medlemskab online?",
    answer:
      `Ja. Du vælger og aktiverer medlemskabet online, når du booker rengøring. Du kan skifte mellem månedsplan (${KLUB_MONTHLY_KR} kr.) og årsplan (${KLUB_ANNUAL_KR.toLocaleString("da-DK")} kr.) i bookingflowet, og efter de første 6 måneder kan du opsige når som helst.`,
  },
  {
    question: "Hvad er fordelene ved Renzen Klub?",
    answer:
      `Du får op til 20% medlemsrabat på rengøring, Zen-kreditter til boligservices, intropris fra ${introFromLabel}, fast Zenmester og mulighed for 26% servicefradrag på arbejdslønnen. Alt samlet i ét medlemskab til dit hjem.`,
  },
];

const faqs = [
  {
    question: "Hvad er Renzen Klub?",
    answer:
      `Renzen Klub er vores medlemskab til dig, der vil have fast rengøring. Du betaler ${KLUB_MONTHLY_KR} kr. om måneden (eller ${KLUB_ANNUAL_KR.toLocaleString("da-DK")} kr. for et år) og får lavere priser på rengøring plus Zen-kreditter til andre opgaver i hjemmet.`,
  },
  {
    question: "Får jeg altid den samme Zenmester?",
    answer:
      "Ja. Ved faste aftaler sender vi den samme Zenmester, så vedkommende lærer dit hjem og dine ønsker at kende. Det giver tryghed og et bedre resultat hver gang.",
  },
  {
    question: "Kan jeg få servicefradrag?",
    answer:
      "Ja. Privat rengøring er fradragsberettiget i Danmark. Du kan trække 26% af arbejdslønnen fra i skat. Vi sender en faktura, du kan bruge direkte hos SKAT.",
  },
  {
    question: "Skal jeg have rengøringsmidler klar?",
    answer:
      "Zenmesteren medbringer klude og rengøringsmidler. Du skal bare have en støvsuger og en gulvmoppe klar, der virker.",
  },
];

export function PrivatRengoringPage() {
  return (
    <div className="min-h-screen bg-[#fbfaf5] text-[#203129]">
      <RenzenEditorialHeader />

      <main id="main">
        <section className="relative z-30 overflow-visible bg-[#dfe9dc]">
          <div className="grid min-h-[690px] w-full lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative z-10 order-2 flex flex-col justify-center px-6 py-16 sm:px-10 lg:order-1 lg:pl-[114px] lg:pr-16 lg:py-20">
              <Image
                src="/shapes/hero-vector.svg"
                alt=""
                width={160}
                height={134}
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 right-0 z-0 hidden h-auto w-[120px] opacity-70 sm:block lg:w-[160px]"
              />
              <p className="relative z-10 mb-6 text-xs font-bold uppercase tracking-[0.18em] text-[#41614f]">
                Renzen Klub · Fast Zenmester
              </p>
              <h1 className="relative z-10 max-w-[620px] font-display text-[42px] font-semibold leading-[0.98] tracking-[-0.05em] text-[#173c2c] sm:text-[58px] lg:text-[68px]">
                Privat rengøring med medlemsfordele.
              </h1>
              <p className="relative z-10 mt-7 max-w-[540px] text-base font-medium leading-7 text-[#536159] sm:text-lg">
                Få en fast Zenmester til dit hjem og spar penge som medlem af
                Renzen Klub. Se din pris med det samme — ingen binding ud over
                medlemskabet.
              </p>

              <HeroBookingForm
                showPostcodeIcon={false}
                wideInputs
                className="relative z-10 mt-9"
                submitPath="/book-rengoering"
              />

              <div className="relative z-10 mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-[#536159]">
                {[
                  "Forsikrede Zenmestre",
                  "Tilfredshedsgaranti",
                  "26% servicefradrag",
                ].map((item) => (
                  <span key={item} className="flex items-center gap-2">
                    <Check size={14} />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className={`${renzenKlubMaskStyles.heroKlubVisual} order-1 lg:order-2 ${styles.heroImage}`}>
              <div className={`${renzenKlubMaskStyles.heroKlubImageSlot} relative lg:min-h-full`}>
                <Image
                  src="/flytterengoring-hero.jpg"
                  alt="Familie nyder et rent hjem med privat rengøring fra Renzen"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover object-right"
                />
              </div>
              <RenzenKlubMaskCallout variant="intro" />
            </div>
          </div>
        </section>

        <section className="relative z-10 border-b border-[#dfe2da] bg-[#fbfaf5]">
          <div className="mx-auto flex max-w-[1260px] flex-wrap justify-between gap-x-10 gap-y-6 px-6 py-8 sm:px-8">
            {[
              ["4,8 ud af 5", "Kundevurdering"],
              [`Fra ${introFromLabel}`, "Første rengøring med Klub"],
              ["26%", "Muligt servicefradrag"],
              ["Fast Zenmester", "Samme ansigt hver gang"],
            ].map(([value, label]) => (
              <div key={label}>
                <p className="font-display text-xl font-semibold text-[#173c2c]">
                  {value}
                </p>
                <p className="mt-1 text-xs font-medium text-[#758078]">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-6 py-24 sm:px-8 sm:py-32">
          <div className="grid gap-14 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#55705f]">
                Sådan virker medlemskabet
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.04] tracking-[-0.04em] text-[#173c2c] sm:text-5xl">
                Renzen Klub forklaret helt enkelt.
              </h2>
              <p className="mt-6 max-w-md text-sm font-medium leading-6 text-[#69746c]">
                Tænk på det som et lille medlemskab, der gør din rengøring
                billigere — og giver dig ekstra hjælp til hjemmet.
              </p>
              <Link
                href="/klub/"
                className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#173c2c]"
              >
                Se introtilbud fra {INTRO_CLEANING_FROM_KR} kr.
                <ArrowRight size={15} />
              </Link>
            </div>
            <ol className="border-t border-[#ccd2ca]">
              {membershipSteps.map((step, index) => (
                <li
                  key={step.title}
                  className="grid gap-4 border-b border-[#ccd2ca] py-8 sm:grid-cols-[70px_0.9fr_1.1fr]"
                >
                  <span className="font-mono text-sm font-bold text-[#7a867e]">
                    0{index + 1}
                  </span>
                  <h3 className="font-display text-2xl font-semibold text-[#173c2c]">
                    {step.title}
                  </h3>
                  <p className="text-sm font-medium leading-6 text-[#69746c]">
                    {step.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          className={`bg-[#e7e4da] py-24 sm:py-32 ${styles.includedSection}`}
        >
          <div className="absolute inset-0 z-0">
            <Image
              src="/nyd-friheden.jpg"
              alt=""
              fill
              sizes="100vw"
              aria-hidden="true"
              className="object-cover object-center"
            />
          </div>
          <div className="relative z-10 mx-auto max-w-[1280px] px-6 sm:px-8">
            <div className="max-w-xl lg:max-w-[52%] lg:pr-10">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#55705f]">
                Hvad er inkluderet
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.04] tracking-[-0.04em] text-[#173c2c] sm:text-5xl">
                Standardrengøring, der holder hjemmet rent.
              </h2>
              <p className="mt-7 max-w-xl text-base font-medium leading-7 text-[#606c64]">
                Din Zenmester følger en tjekliste, så du får det samme gode
                resultat ved hvert besøg. Du vælger selv, hvor ofte — hver uge,
                hver anden uge eller hver fjerde uge.
              </p>
              <ul className="mt-8 space-y-3">
                {includedTasks.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm font-semibold text-[#3f4d45]"
                  >
                    <Check
                      size={16}
                      className="mt-0.5 shrink-0 text-[#41614f]"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="border-y border-[#dfe2da] bg-[#fbfaf5] py-24 sm:py-32">
          <div className="mx-auto max-w-[1180px] px-6 sm:px-8">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#55705f]">
                Priseksempler
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.04em] text-[#173c2c] sm:text-5xl">
                Hvad koster privat rengøring?
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-sm font-medium leading-6 text-[#69746c]">
                Priserne er vejledende for hver 2. uge. Se din præcise pris
                ovenfor — medlemsrabat vises ved booking.
              </p>
            </div>

            <div className="mt-14 grid gap-5 sm:grid-cols-3">
              {priceExamples.map((card) => (
                <div
                  key={card.sqm}
                  className="border border-[#d0d5cd] bg-white p-6 text-center"
                >
                  <p className="font-display text-xl font-semibold text-[#173c2c]">
                    {card.sqm} m²
                  </p>
                  <p className="mt-1 text-xs font-medium text-[#7b887f]">
                    Hver 2. uge · vejledende
                  </p>
                  <p className="mt-5 font-display text-3xl font-semibold text-[#173c2c]">
                    {card.price.toLocaleString("da-DK")} kr.
                  </p>
                  <p className="mt-3 border border-[#c5d4c8] bg-[#eef3ee] px-3 py-2 text-xs font-bold text-[#41614f]">
                    Efter fradrag: {card.afterFradrag.toLocaleString("da-DK")}{" "}
                    kr.
                  </p>
                </div>
              ))}
            </div>
            <p className="mx-auto mt-8 max-w-lg text-center text-xs font-medium leading-5 text-[#8a948c]">
              Intropris fra {INTRO_CLEANING_FROM_KR} kr. forudsætter Renzen Klub og fast rengøring hver
              2. uge.{" "}
              <Link href="/klub/" className="font-bold text-[#41614f] underline">
                Se introtilbuddet
              </Link>
              .
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-6 py-24 sm:px-8 sm:py-32">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#55705f]">
                Med Renzen Klub
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.04] tracking-[-0.04em] text-[#173c2c] sm:text-5xl">
                10 services du kan bruge Zen-kreditter på.
              </h2>
            </div>
            <p className="max-w-xl text-base font-medium leading-7 text-[#667168] lg:justify-self-end">
              {ZEN_CREDIT_SERVICES_SECTION_INTRO}
            </p>
          </div>

          <ZenCreditServicesGrid />
        </section>

        <RenzenKlubPromoSection />

        <section
          className={`${styles.klubFaqSection} ${styles.klubFaqSectionSolid} sm:py-28`}
        >
          <div className={`mx-auto max-w-[1280px] px-6 sm:px-8 ${styles.klubFaqInner}`}>
            <div className={styles.klubFaqGrid}>
              {klubFaqs.map((faq) => (
                <div key={faq.question}>
                  <p className={styles.klubFaqQuestion}>
                    <span className="font-bold">Q:</span> {faq.question}
                  </p>
                  <p className={styles.klubFaqAnswer}>
                    <span className="font-bold text-[#536159]">A:</span>{" "}
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-12 text-center">
              <Link
                href="/faq/"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#173c2c] underline decoration-[#b8c9b8] underline-offset-4 transition-colors hover:text-[#41614f] hover:decoration-[#41614f]"
              >
                Se alle spørgsmål
                <ArrowRight size={15} />
              </Link>
            </p>
          </div>
        </section>

        <section className="bg-[#173c2c] px-6 py-20 text-[#f6f2e8] sm:px-8 sm:py-24">
          <div className="mx-auto flex max-w-[1180px] flex-col justify-between gap-10 sm:flex-row sm:items-end">
            <h2 className="max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl">
              Bliv medlem og få din første rengøring fra {INTRO_CLEANING_FROM_KR} kr.
            </h2>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Link
                href="/klub/"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[3px] bg-[#f1e9d8] px-6 text-sm font-bold text-[#173c2c]"
              >
                Se introtilbud
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/book-rengoering"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[3px] border border-white/30 px-6 text-sm font-bold text-white"
              >
                Beregn pris
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1180px] px-6 py-24 sm:px-8 sm:py-32">
          <div className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#55705f]">
                Ofte stillede spørgsmål
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.04em] text-[#173c2c] sm:text-5xl">
                Det du bør vide.
              </h2>
              <dl className="mt-10 border-t border-[#ccd2ca]">
                {faqs.map((faq) => (
                  <div
                    key={faq.question}
                    className="border-b border-[#ccd2ca] py-7"
                  >
                    <dt className="font-display text-xl font-semibold text-[#173c2c]">
                      {faq.question}
                    </dt>
                    <dd className="mt-3 text-sm font-medium leading-6 text-[#69746c]">
                      {faq.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="border-l border-[#d0d5cd] pl-8">
              <ShieldCheck size={28} className="text-[#41614f]" />
              <h2 className="mt-6 font-display text-2xl font-semibold text-[#173c2c]">
                Tilfredshedsgaranti
              </h2>
              <p className="mt-4 text-sm font-medium leading-6 text-[#69746c]">
                Er du ikke tilfreds med rengøringen, udbedrer vi det — uden
                ekstra omkostninger for dig.
              </p>
              <div className="mt-7 flex gap-1 text-[#6b7e70]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} size={17} fill="currentColor" />
                ))}
              </div>
              <p className="mt-4 font-display text-lg font-medium leading-snug text-[#173c2c]">
                &ldquo;Det er en lettelse at have den samme Zenmester hver gang.
                Hjemmet er rent, og jeg slipper for at tænke på det.&rdquo;
              </p>
              <p className="mt-3 text-sm font-bold text-[#607066]">
                Kunde, Frederiksberg
              </p>
              <Link
                href="/klub/"
                className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#173c2c]"
              >
                Se introtilbud
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t border-[#dfe2da] bg-[#fbfaf5] py-24 sm:py-32">
          <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#55705f]">
              Lokal dækning
            </p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl font-semibold tracking-[-0.04em] text-[#173c2c] sm:text-5xl">
              Privat rengøring i hele Storkøbenhavn
            </h2>
            <p className="mt-6 max-w-3xl text-base font-medium leading-7 text-[#667168]">
              Vi tilbyder privat rengøring i alle vores aktive byområder i
              Storkøbenhavn, så du nemt kan finde den lokale side for dit område.
            </p>
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {PRIVAT_RENGORING_PRIORITY_1_CITIES.map((city) => (
                <Link
                  key={city.slug}
                  href={getServiceCityUrl("privat-rengoring", city.slug)}
                  className="flex min-h-12 cursor-pointer items-center justify-center rounded-[3px] border border-[#ccd2ca] bg-white px-4 text-center text-sm font-bold text-[#173c2c] transition-colors hover:border-[#41614f] hover:text-[#41614f]"
                >
                  {city.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <RenzenEditorialFooter />
    </div>
  );
}
