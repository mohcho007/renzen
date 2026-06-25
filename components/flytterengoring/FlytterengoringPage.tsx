"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, ShieldCheck, Star } from "lucide-react";
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
import { ZEN_CREDIT_SERVICES_SECTION_INTRO } from "@/lib/zenCreditServices";
import { INTRO_CLEANING_FROM_KR, ZEN_CREDIT_MONTHLY_KR } from "@/data/pricing";
import { ZenCreditServicesGrid } from "@/components/site/ZenCreditServicesGrid";

const FlytPriceCalculator = dynamic(
  () => import("@/components/flytterengoring/FlytPriceCalculator"),
  {
    ssr: false,
    loading: () => (
      <div
        className="min-h-[320px] animate-pulse rounded border border-[#d8ddd5] bg-[#f6f4ee]"
        aria-hidden="true"
      />
    ),
  },
);

const beforeAfterImages = [
  {
    label: "Toilet og bad gjort klar til aflevering",
    src: "/foer-efter-toilet-rens.webp",
  },
  {
    label: "Ovn renset helt i bund",
    src: "/foer-efter-ovn-rens.webp",
  },
  {
    label: "Kalk og belægninger fjernet",
    src: "/foer-efter-wc-rens-1.webp",
  },
  {
    label: "Vask og armatur rengjort",
    src: "/foer-efter-amatur-rengoering.webp",
  },
];

const priceExamples = [
  { sqm: 50, price: 2000, afterFradrag: 1480 },
  { sqm: 70, price: 2800, afterFradrag: 2072 },
  { sqm: 100, price: 4000, afterFradrag: 2960 },
  { sqm: 130, price: 5200, afterFradrag: 3848 },
];

const checklistItems = [
  "Rengøring indvendigt og udvendigt af alle skabe, skuffer og hylder",
  "Dybdegående rengøring af ovn, kogeplader, emhætte og filter",
  "Afkalkning af armaturer, fliser, bruseniche og toiletter",
  "Vask af døre, dørkarme, paneler, kontakter og radiatorer",
  "Støvsugning og vask af alle gulve",
];

const klubFaqs = [
  {
    question: "Gælder Renzen Klub også for flytterengøring?",
    answer:
      "Ja. Som medlem får du medlemsfordele på flytterengøring og adgang til Zen-kreditter. Du vælger medlemskab i bookingflowet, så pris og fordele fremgår tydeligt, før du godkender.",
  },
  {
    question: "Hvordan fungerer Zen-kreditter ved flytning?",
    answer:
      `Du optjener ${ZEN_CREDIT_MONTHLY_KR} kr. i Zen-kreditter hver måned som medlem. Kreditterne kan bruges på flyttehjælp, flytterengøring, malerarbejde og andre udvalgte boligservices, der ofte opstår omkring en flytning.`,
  },
  {
    question: "Kan jeg kombinere klubfordele og servicefradrag?",
    answer:
      "Ja. Medlemsfordele og servicefradrag kan bruges samtidig, når betingelserne for fradrag er opfyldt. Det betyder, at du både kan få en skarpere medlemspris og 26% fradrag på arbejdslønnen.",
  },
  {
    question: "Kan jeg stoppe medlemskabet efter flytterengøringen?",
    answer:
      "Ja. Renzen Klub har en minimumsperiode på 6 måneder, og derefter kan du opsige når som helst. Mange bruger perioden til både flytterengøring og efterfølgende hjælp i den nye bolig.",
  },
];

const faqs = [
  {
    question: "Hvor grundig er en flytterengøring?",
    answer:
      "En flytterengøring er en dybdegående rengøring, hvor alt gås igennem. Det inkluderer indvendig og udvendig rengøring af alle skabe, skuffer, ovn, emhætte, afkalkning af fliser og armaturer, samt vask af døre, karme, paneler og stikkontakter.",
  },
  {
    question: "Giver I garanti for godkendelse af flytterengøringen?",
    answer:
      "Vi udfører flytterengøringen efter en grundig tjekliste. Skulle udlejer eller køber mod forventning have bemærkninger til rengøringen, udbedrer vi fejlene uden ekstra beregning inden for rammerne af vores tilfredshedsgaranti.",
  },
  {
    question: "Skal boligen være tom inden rengøringen?",
    answer:
      "Ja, flytterengøring udføres i en ryddet og tom bolig. Møbler og personlige ejendele skal være fjernet, så vi kan komme til alle overflader, skabe og hjørner.",
  },
  {
    question: "Kan jeg få servicefradrag på flytterengøring?",
    answer:
      "Ja. Flytterengøring er servicefradragsberettiget, så længe du er tilmeldt folkeregisteret på adressen på udførelsestidspunktet. Det giver 26% fradrag i skat på arbejdslønnen.",
  },
];

export function FlytterengoringPage() {
  return (
    <div className="min-h-screen bg-[#fbfaf5] text-[#203129]">
      <RenzenEditorialHeader />

      <main>
        <section className="relative overflow-hidden bg-[#dfe9dc]">
          <div className="grid min-h-[600px] w-full lg:grid-cols-[1fr_0.95fr]">
            <div className="relative z-10 order-2 flex flex-col justify-center px-6 py-16 sm:px-10 lg:order-1 lg:pl-[114px] lg:pr-12 lg:py-20">
              <Image
                src="/shapes/hero-vector.svg"
                alt=""
                width={160}
                height={134}
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 right-0 z-0 hidden h-auto w-[120px] opacity-70 sm:block lg:w-[160px]"
              />
              <p className="relative z-10 mb-6 text-xs font-bold uppercase tracking-[0.18em] text-[#41614f]">
                Tilfredshedsgaranti · Depositumsretur
              </p>
              <h1 className="relative z-10 max-w-[620px] font-display text-[42px] font-semibold leading-[0.98] tracking-[-0.05em] text-[#173c2c] sm:text-[58px] lg:text-[68px]">
                Flytterengøring med garanti.
              </h1>
              <p className="relative z-10 mt-7 max-w-[540px] text-base font-medium leading-7 text-[#536159] sm:text-lg">
                Professionel rengøring ved fraflytning eller indflytning. Se
                din pris med det samme og book på under 60 sekunder.
              </p>

              <div id="calculator" className="relative z-10 mt-9 scroll-mt-28">
                <FlytPriceCalculator initialSqm={70} initialStand={1} />
              </div>

              <div className="relative z-10 mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-[#536159]">
                {[
                  "Verificerede Zenmestre",
                  "Klar til flyttesyn",
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
                  src="/flytterengøring.jpg"
                  alt="Professionel flytterengøring i en nordisk bolig"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  className="object-cover object-center"
                />
              </div>
              <RenzenKlubMaskCallout
                variant="zenCredit"
                serviceLine="til din flytterengøring"
              />
            </div>
          </div>
        </section>

        <section className="border-b border-[#dfe2da] bg-[#fbfaf5]">
          <div className="mx-auto flex max-w-[1260px] flex-wrap justify-between gap-x-10 gap-y-6 px-6 py-8 sm:px-8">
            {[
              ["4,8 ud af 5", "Kundevurdering"],
              ["800+", "Godkendte afleveringer"],
              ["26%", "Muligt servicefradrag"],
              ["Tilfredshedsgaranti", "Ved flyttesyn"],
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

        <section className="mx-auto max-w-[1280px] px-6 py-24 sm:px-8 sm:py-32">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#55705f]">
                Før og efter
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.04] tracking-[-0.04em] text-[#173c2c] sm:text-5xl">
                Fra beskidt til godkendt flyttesyn.
              </h2>
            </div>
            <p className="max-w-xl text-base font-medium leading-7 text-[#667168] lg:justify-self-end">
              Udlejere og boligselskaber lægger vægt på detaljerne. Her er
              eksempler på områder, vi typisk går i dybden med ved
              flytterengøring.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-2">
            <div className="overflow-hidden border border-[#d0d5cd] bg-white">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/flytterengoring-foer-koekken.jpg"
                  alt="Køkken før flytterengøring"
                  fill
                  sizes="(max-width: 1024px) 50vw, 50vw"
                  className="object-cover"
                />
              </div>
              <p className="border-t border-[#e5e7e1] px-2 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#7b887f] sm:px-5 sm:py-3">
                Før
              </p>
            </div>
            <div className="overflow-hidden border border-[#d0d5cd] bg-white">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/flytterengoring-efter-koekken.jpg"
                  alt="Køkken efter flytterengøring"
                  fill
                  sizes="(max-width: 1024px) 50vw, 50vw"
                  className="object-cover"
                />
              </div>
              <p className="border-t border-[#e5e7e1] px-2 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#41614f] sm:px-5 sm:py-3">
                Efter
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {beforeAfterImages.map((item) => (
              <div
                key={item.label}
                className="border border-[#d8ddd5] bg-[#f6f4ee] p-2 sm:p-4"
              >
                <div className="relative aspect-square overflow-hidden bg-[#e8e6df]">
                  <Image
                    src={item.src}
                    alt={item.label}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <p className="mt-2 text-center text-xs font-semibold leading-snug text-[#536159] sm:mt-3 sm:leading-5">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#e7e4da] py-24 sm:py-32">
          <div className="mx-auto grid max-w-[1280px] gap-12 px-6 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className={`relative min-h-[520px] overflow-hidden ${styles.portraitImage}`}>
              <Image
                src="/foer-renzen.png"
                alt="Bolig før professionel flytterengøring"
                fill
                sizes="(max-width: 1024px) 100vw, 52vw"
                className="object-cover"
              />
            </div>
            <div className="lg:pl-10">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#55705f]">
                Undgå at miste dit depositum
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.04] tracking-[-0.04em] text-[#173c2c] sm:text-5xl">
                Få boligen godkendt uden stress.
              </h2>
              <p className="mt-7 max-w-xl text-base font-medium leading-7 text-[#606c64]">
                Når du flytter, er der nok at holde styr på. Vi gør den sidste
                del lettere med professionel flytterengøring, der har fokus på
                de områder, udlejere typisk lægger vægt på ved aflevering.
              </p>
              <ul className="mt-8 space-y-3">
                {[
                  "Fokus på aflevering og flyttesyn",
                  "Verificerede og forsikrede Zenmestre",
                  "Fast pris baseret på boligstørrelse og stand",
                  "100% tilfredshedsgaranti",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm font-semibold text-[#3f4d45]"
                  >
                    <Check size={16} className="mt-0.5 shrink-0 text-[#41614f]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-6 py-24 sm:px-8 sm:py-32">
          <div className="grid gap-14 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#55705f]">
                Hvad er inkluderet
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.04em] text-[#173c2c] sm:text-5xl">
                En dybdegående rengøring fra top til bund.
              </h2>
            </div>
            <ul className="border-t border-[#ccd2ca]">
              {checklistItems.map((item, index) => (
                <li
                  key={item}
                  className="grid gap-4 border-b border-[#ccd2ca] py-6 sm:grid-cols-[70px_1fr]"
                >
                  <span className="font-mono text-sm font-bold text-[#7a867e]">
                    0{index + 1}
                  </span>
                  <p className="text-sm font-medium leading-6 text-[#69746c]">
                    {item}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-y border-[#dfe2da] bg-[#e7e4da] py-24 sm:py-32">
          <div className="mx-auto max-w-[1180px] px-6 sm:px-8">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#55705f]">
                Priseksempler
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.04em] text-[#173c2c] sm:text-5xl">
                Hvad koster flytterengøring?
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-sm font-medium leading-6 text-[#69746c]">
                Priserne er baseret på stand 1 (40 kr./m²). Se din præcise pris
                i beregneren ovenfor.
              </p>
            </div>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {priceExamples.map((card) => (
                <div
                  key={card.sqm}
                  className="border border-[#d0d5cd] bg-white p-6 text-center"
                >
                  <p className="font-display text-xl font-semibold text-[#173c2c]">
                    {card.sqm} m²
                  </p>
                  <p className="mt-1 text-xs font-medium text-[#7b887f]">
                    Stand 1 · 40 kr./m²
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
              Flytterengøring udføres i en ryddet og tom bolig. Har boligen
              særlige behov udover standardomfanget, aftales det på forhånd.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-6 py-24 sm:px-8 sm:py-32">
          <div className="grid gap-14 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#55705f]">
                Sådan foregår det
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.04em] text-[#173c2c] sm:text-5xl">
                Klar til flyttesyn på tre trin.
              </h2>
            </div>
            <ol className="border-t border-[#ccd2ca]">
              {[
                [
                  "Se din pris",
                  "Brug prisberegneren og få en pris ud fra boligstørrelse og stand.",
                ],
                [
                  "Book tid",
                  "Vælg et tidspunkt, der passer dig. Vi sender et erfarent team.",
                ],
                [
                  "Vi klarer resten",
                  "Zenmesterne sørger for, at boligen er klar til aflevering og flyttesyn.",
                ],
              ].map(([title, text], index) => (
                <li
                  key={title}
                  className="grid gap-4 border-b border-[#ccd2ca] py-8 sm:grid-cols-[70px_0.7fr_1.3fr]"
                >
                  <span className="font-mono text-sm font-bold text-[#7a867e]">
                    0{index + 1}
                  </span>
                  <h3 className="font-display text-2xl font-semibold text-[#173c2c]">
                    {title}
                  </h3>
                  <p className="text-sm font-medium leading-6 text-[#69746c]">
                    {text}
                  </p>
                </li>
              ))}
            </ol>
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

        <section className={`${styles.klubFaqSection} ${styles.klubFaqSectionSolid} sm:py-28`}>
          <div
            className={`mx-auto max-w-[1280px] px-6 sm:px-8 ${styles.klubFaqInner}`}
          >
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
              Gør boligen klar til flyttesyn og book flytterengøring.
            </h2>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <a
                href="#calculator"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[3px] bg-[#f1e9d8] px-6 text-sm font-bold text-[#173c2c]"
              >
                Beregn pris og book
                <ArrowRight size={16} />
              </a>
              <Link
                href="/klub/"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[3px] border border-white/30 px-6 text-sm font-bold text-white"
              >
                Se introtilbud
                <ArrowRight size={16} />
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
                Skulle der mod forventning være anmærkninger ved flyttesynet,
                udbedrer vi fejlene kvit og frit inden for garantiens rammer.
              </p>
              <div className="mt-7 flex gap-1 text-[#6b7e70]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} size={17} fill="currentColor" />
                ))}
              </div>
              <p className="mt-4 font-display text-lg font-medium leading-snug text-[#173c2c]">
                “Udlejeren havde intet at udsætte på resultatet. Det var en
                lettelse midt i en stressende flytning.”
              </p>
              <p className="mt-3 text-sm font-bold text-[#607066]">
                Kunde, København
              </p>
              <div className="mt-7 flex flex-col gap-3">
                <a
                  href="#calculator"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#173c2c]"
                >
                  Se pris og book
                  <ArrowRight size={15} />
                </a>
                <Link
                  href="/klub/"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#41614f]"
                >
                  Se introtilbud fra {INTRO_CLEANING_FROM_KR} kr.
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <RenzenEditorialFooter />
    </div>
  );
}
