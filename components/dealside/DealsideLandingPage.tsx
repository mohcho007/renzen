"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Phone,
  ShieldCheck,
  Star,
} from "lucide-react";
import { ZEN_CREDIT_SERVICE_LABELS } from "@/lib/zenCreditServices";
import { DEAL_PACKAGES } from "@/components/dealside/dealPackages";
import {
  INTRO_CLEANING_FROM_KR,
  KLUB_ANNUAL_KR,
  KLUB_ANNUAL_MONTHLY_EQUIVALENT_KR,
  ZEN_CREDIT_ANNUAL_KR,
  ZEN_CREDIT_ANNUAL_REMAINING_AFTER_FIRST_KR,
  ZEN_CREDIT_MONTHLY_KR,
} from "@/data/pricing";
import styles from "@/components/site/RenzenEditorial.module.css";

function formatKr(amount: number) {
  return amount.toLocaleString("da-DK");
}

function introDueKr(introPrice: number) {
  return Math.max(0, introPrice - ZEN_CREDIT_MONTHLY_KR);
}

const packages = DEAL_PACKAGES;
const mellemPackage =
  packages.find((pkg) => pkg.m2 === 100) ?? packages[1];
const klubMonthlyLabel = KLUB_ANNUAL_MONTHLY_EQUIVALENT_KR.toLocaleString(
  "da-DK",
  { minimumFractionDigits: 2, maximumFractionDigits: 2 },
);

const zenCreditAnnualMonths = ZEN_CREDIT_ANNUAL_KR / ZEN_CREDIT_MONTHLY_KR;
const zenCreditRemainingMonths = zenCreditAnnualMonths - 1;

const faqs = [
  {
    question: "Hvorfor er den første rengøring så billig?",
    answer:
      "Introprisen kombinerer en velkomstrabat med fordelene i Renzen Klub. Den gælder ved valg af en fast rengøringsaftale hver anden uge.",
  },
  {
    question: "Hvornår betaler jeg?",
    answer:
      "Du betaler 0 kr. ved selve bookingen. Kortet kontrolleres før besøget, og rengøringen faktureres efter den er udført. Den valgte medlemsplan fremgår, før du godkender.",
  },
  {
    question: "Hvordan fungerer medlemskabet?",
    answer:
      `Medlemskabet koster ${KLUB_ANNUAL_KR.toLocaleString("da-DK")} kr. for 12 måneder — svarer til ${klubMonthlyLabel} kr. pr. måned.`,
  },
  {
    question: "Hvordan fungerer Zen-kreditter?",
    answer:
      `De første ${formatKr(ZEN_CREDIT_MONTHLY_KR)} kr. bruges på introrengøringen. Derefter optjener du ${zenCreditRemainingMonths} × ${formatKr(ZEN_CREDIT_MONTHLY_KR)} kr. over de næste ${zenCreditRemainingMonths} aktive medlemsmåneder — i alt ${formatKr(ZEN_CREDIT_ANNUAL_KR)} kr. pr. medlemsår (${formatKr(ZEN_CREDIT_ANNUAL_REMAINING_AFTER_FIRST_KR)} kr. efter første besøg). Kreditter følger gældende anvendelsesregler, gælder udvalgte services og kan ikke udbetales.`,
  },
];

export default function DealsideLandingPage() {
  const router = useRouter();

  const selectPackage = (m2: number) => {
    const pkg = DEAL_PACKAGES.find((p) => p.m2 === m2);
    if (!pkg) return;
    router.push(`/book-rengoering?m2=${pkg.m2}&from=klub`);
  };

  const featured = packages.find((pkg) => pkg.popular)!;
  const alternatives = packages.filter((pkg) => !pkg.popular);

  return (
    <div className="min-h-screen bg-[#fbfaf5] text-[#203129]">
      <header className="sticky top-0 z-50 border-b border-[#dfe2da] bg-[#fbfaf5]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-[70px] max-w-[1320px] items-center justify-between px-5 sm:px-8">
          <Link href="/" aria-label="Renzen forside">
            <Image
              src="/renzen-logo-ny.png"
              alt="Renzen"
              width={120}
              height={31}
              priority
            />
          </Link>
          <div className="flex items-center gap-5">
            <span className="hidden items-center gap-2 text-xs font-semibold text-[#657169] sm:flex">
              <ShieldCheck size={16} />
              Sikker booking
            </span>
            <a
              href="tel:+4549903055"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#173c2c]"
            >
              <Phone size={15} />
              <span className="hidden sm:inline">49 90 30 55</span>
              <span className="sm:hidden">Ring</span>
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="bg-[#dfe9dc]">
          <div className="mx-auto grid min-h-[660px] max-w-[1440px] lg:grid-cols-[0.92fr_1.08fr]">
            <div className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-16 lg:py-20">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#4f6858]">
                Introduktion til Renzen Klub
              </p>
              <h1 className="mt-5 max-w-[700px] font-display text-[48px] font-semibold leading-[0.98] tracking-[-0.05em] text-[#173c2c] sm:text-[68px] lg:text-[76px]">
                Første rengøring fra {formatKr(INTRO_CLEANING_FROM_KR)} kr.
              </h1>
              <p className="mt-7 max-w-[570px] text-base font-medium leading-7 text-[#536159] sm:text-lg">
                Start med professionel rengøring hver anden uge. Få en fast
                Zenmester, medlemspris på de næste besøg og optjen Zen-kreditter
                til udvalgte services — efter {formatKr(ZEN_CREDIT_MONTHLY_KR)} kr.
                velkomstkredit på første besøg.
              </p>

              <div className="mt-8 border-y border-[#b9c5b9] py-5">
                {[
                  `${formatKr(ZEN_CREDIT_MONTHLY_KR)} kr. velkomstkredit på 1. rengøring`,
                  "Op til 20% på løbende rengøring",
                  `${formatKr(ZEN_CREDIT_ANNUAL_KR)} kr. i Zen-kreditter pr. medlemsår`,
                  "0 kr. ved booking",
                ].map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-center gap-3 py-1.5 text-sm font-bold text-[#314139]"
                  >
                    <Check size={15} />
                    {benefit}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  document
                    .querySelector("#pakker")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="mt-9 inline-flex min-h-12 w-fit cursor-pointer items-center gap-2 rounded-[3px] bg-[#173c2c] px-6 text-sm font-bold text-white transition-colors hover:bg-[#0f2d20]"
              >
                Find din boligstørrelse
                <ArrowRight size={16} />
              </button>
            </div>

            <div className={`relative min-h-[450px] bg-[#dfe9dc] lg:min-h-full ${styles.dealImage}`}>
              <Image
                src="/renzen-zenmester.png"
                alt="Renzen Zenmester"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-contain object-center"
              />
              <div className="absolute bottom-7 left-7 bg-[#fbfaf5] px-6 py-5 sm:bottom-10 sm:left-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#768178]">
                  Mellem bolig · op til 100 m²
                </p>
                <div className="mt-2 flex items-end gap-3">
                  <strong className="font-display text-4xl font-semibold text-[#173c2c]">
                    {formatKr(introDueKr(mellemPackage.introPrice))} kr.
                  </strong>
                  <span className="pb-1 text-sm font-semibold text-[#89928c] line-through">
                    {formatKr(mellemPackage.normalPrice)} kr.
                  </span>
                </div>
                <p className="mt-1 text-[10px] font-semibold text-[#768178]">
                  med Klub · velkomstkredit
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[#dfe2da]">
          <div className="mx-auto flex max-w-[1180px] flex-wrap justify-between gap-x-10 gap-y-5 px-6 py-8 sm:px-8">
            {[
              ["4,8 ud af 5", "Kundevurdering"],
              ["10 mio. kr.", "Forsikringsdækning"],
              ["Hver 2. uge", "Fast aftale"],
              ["Efter besøget", "Betaling"],
            ].map(([value, label]) => (
              <div key={label}>
                <p className="font-display text-lg font-semibold text-[#173c2c]">
                  {value}
                </p>
                <p className="mt-1 text-xs font-medium text-[#77827a]">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="pakker" className="scroll-mt-20 px-6 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto max-w-[1220px]">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#55705f]">
                  Vælg boligstørrelse
                </p>
                <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.03] tracking-[-0.04em] text-[#173c2c] sm:text-6xl">
                  En intropris, der er let at forstå.
                </h2>
              </div>
              <p className="max-w-xl text-base font-medium leading-7 text-[#667168] lg:justify-self-end">
                Hver anden uge er valgt på forhånd. Den almindelige pris,
                medlemsbetaling og vilkår vises igen i bookingflowet.
              </p>
            </div>

            <div className="mt-14 grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
              <article className="bg-[#cfdccf] p-7 sm:p-10">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#53685a]">
                      Mest valgt
                    </p>
                    <h3 className="mt-4 font-display text-4xl font-semibold text-[#173c2c]">
                      {featured.title}
                    </h3>
                    <p className="mt-2 text-sm font-semibold text-[#607066]">
                      {featured.rooms} · op til {featured.m2} m²
                    </p>
                  </div>
                  <span className="border border-[#8fa092] px-3 py-2 text-xs font-bold text-[#173c2c]">
                    Mest valgt
                  </span>
                </div>

                <div className="mt-16">
                  <p className="text-sm font-semibold text-[#758178] line-through">
                    Normalpris {featured.normalPrice.toLocaleString("da-DK")} kr.
                  </p>
                  <p className="mt-2 font-display text-[76px] font-semibold leading-none tracking-[-0.06em] text-[#173c2c] sm:text-[96px]">
                    {formatKr(introDueKr(featured.introPrice))}
                    <span className="ml-2 text-2xl tracking-normal">kr.</span>
                  </p>
                  <p className="mt-3 text-xs font-semibold text-[#607066]">
                    med Klub · efter {formatKr(ZEN_CREDIT_MONTHLY_KR)} kr. velkomstkredit
                  </p>
                  <p className="mt-5 text-sm font-bold text-[#4b6354]">
                    Intropris {formatKr(featured.introPrice)} kr. — normalpris{" "}
                    {formatKr(featured.normalPrice)} kr.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => selectPackage(featured.m2)}
                  className="mt-10 flex min-h-13 w-full cursor-pointer items-center justify-between rounded-[3px] bg-[#173c2c] px-6 text-sm font-bold text-white"
                >
                  Vælg mellem bolig
                  <ArrowRight size={17} />
                </button>
              </article>

              <div className="border-t border-[#ccd2ca]">
                {alternatives.map((pkg) => (
                  <button
                    key={pkg.m2}
                    type="button"
                    onClick={() => selectPackage(pkg.m2)}
                    className="group grid w-full cursor-pointer grid-cols-[1fr_auto] gap-6 border-b border-[#ccd2ca] py-7 text-left"
                  >
                    <span>
                      <span className="block font-display text-2xl font-semibold text-[#173c2c]">
                        {pkg.title}
                      </span>
                      <span className="mt-1 block text-xs font-medium text-[#77827a]">
                        {pkg.rooms} · op til {pkg.m2} m²
                      </span>
                      <span className="mt-5 block text-xs font-bold text-[#55705f]">
                        Spar {pkg.savings.toLocaleString("da-DK")} kr.
                      </span>
                    </span>
                    <span className="flex items-center gap-5">
                      <span className="text-right">
                        <span className="block text-xs font-semibold text-[#929a95] line-through">
                          {pkg.normalPrice.toLocaleString("da-DK")} kr.
                        </span>
                        <span className="mt-1 block font-display text-3xl font-semibold text-[#173c2c]">
                          {formatKr(introDueKr(pkg.introPrice))} kr.
                        </span>
                      </span>
                      <ArrowRight
                        size={18}
                        className="text-[#55705f] transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-7 max-w-3xl text-xs font-medium leading-5 text-[#7b857f]">
              Priser er for 1. rengøring efter {formatKr(ZEN_CREDIT_MONTHLY_KR)} kr.
              velkomstkredit ved fast aftale hver 2. uge og Renzen Klub (
              {formatKr(KLUB_ANNUAL_KR)} kr./år). Normalpris er uden
              tilbud. Servicefradrag vises i bookingflowet.
            </p>
          </div>
        </section>

        <section className="bg-[#173c2c] py-24 text-[#f5f1e7] sm:py-32">
          <div className="mx-auto grid max-w-[1220px] gap-14 px-6 sm:px-8 lg:grid-cols-[1fr_1fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/55">
                Renzen Klub
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.03] tracking-[-0.04em] sm:text-6xl">
                Medlemsfordele uden et kompliceret loyalitetsprogram.
              </h2>
              <p className="mt-7 max-w-xl text-base font-medium leading-7 text-white/65">
                Du får medlemspris på løbende rengøring og optjener kreditter
                til udvalgte services i hjemmet.
              </p>
              <div className="mt-9 max-w-xl">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/50">
                  10 services med Zen-kreditter
                </p>
                <ul className="mt-4 grid border-t border-white/20 text-sm font-semibold sm:grid-cols-2">
                  {ZEN_CREDIT_SERVICE_LABELS.map((service) => (
                    <li
                      key={service}
                      className="flex min-h-12 items-center gap-3 border-b border-white/20 py-3 pr-5 text-white/75"
                    >
                      <Check size={14} className="shrink-0 text-white/45" />
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 border-t border-white/20">
                {[
                  "Op til 20% rabat på løbende rengøring",
                  `${formatKr(ZEN_CREDIT_MONTHLY_KR)} kr./md. · ${formatKr(ZEN_CREDIT_ANNUAL_KR)} kr./år i Zen-kreditter`,
                  `${formatKr(ZEN_CREDIT_ANNUAL_REMAINING_AFTER_FIRST_KR)} kr. efter velkomstkredit på 1. besøg`,
                  "Medlemspriser på udvalgte boligservices",
                  "Tilfredshedsgaranti og RenCover forsikring",
                ].map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-center gap-3 border-b border-white/20 py-4 text-sm font-bold"
                  >
                    <Check size={15} />
                    {benefit}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#cfdccf] p-7 text-[#173c2c] sm:p-10">
              <div className="border-b border-[#9dad9f] pb-8">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#5f7165]">
                      Årsplan
                    </p>
                    <p className="mt-4 font-display text-[68px] font-semibold leading-none tracking-[-0.06em] sm:text-[82px]">
                      {KLUB_ANNUAL_KR.toLocaleString("da-DK")}
                      <span className="ml-2 text-2xl tracking-normal">kr.</span>
                    </p>
                  </div>
                  <span className="border border-[#8c9f91] px-3 py-2 text-xs font-bold">
                    Bedste værdi
                  </span>
                </div>
                <p className="mt-4 text-sm font-semibold">
                  12 måneder · svarer til {klubMonthlyLabel} kr./md.
                </p>
              </div>

              <p className="border-t border-[#9dad9f] pt-5 text-xs font-medium leading-5 text-[#5f6c63]">
                Velkomstkredit ({formatKr(ZEN_CREDIT_MONTHLY_KR)} kr.) bruges på
                introrengøringen. Zen-kreditter har anvendelsesvilkår, udløber
                efter gældende regler og kan ikke udbetales som kontanter.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1180px] px-6 py-24 sm:px-8 sm:py-32">
          <div className="grid gap-14 lg:grid-cols-[0.78fr_1.22fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#55705f]">
                Sådan kommer du i gang
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.04] tracking-[-0.04em] text-[#173c2c] sm:text-5xl">
                Fra boligstørrelse til første besøg.
              </h2>
            </div>
            <ol className="border-t border-[#ccd2ca]">
              {[
                ["Vælg bolig", "Start med den pakke, der passer til boligens størrelse."],
                ["Vælg dato", "Se ledige tider, normalpris og årligt medlemskab."],
                ["Få gjort rent", "Din Zenmester udfører arbejdet. Vi fakturerer efter besøget."],
              ].map(([title, text], index) => (
                <li
                  key={title}
                  className="grid gap-4 border-b border-[#ccd2ca] py-8 sm:grid-cols-[62px_0.8fr_1.2fr]"
                >
                  <span className="font-mono text-xs font-bold text-[#7a867e]">
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

        <section className="bg-[#e7e4da] py-24 sm:py-32">
          <div className="mx-auto grid max-w-[1180px] gap-12 px-6 sm:px-8 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#55705f]">
                Før du vælger
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.04em] text-[#173c2c]">
                Kort fortalt om vilkårene.
              </h2>
              <Link
                href="/handelsbetingelser"
                className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#173c2c]"
              >
                Læs handelsbetingelserne
                <ArrowRight size={15} />
              </Link>
            </div>
            <div className="border-t border-[#bfc5bc]">
              {faqs.map((faq) => (
                <details key={faq.question} className="group border-b border-[#bfc5bc]">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-6 font-display text-xl font-semibold text-[#173c2c]">
                    {faq.question}
                    <ChevronRight
                      size={18}
                      className="shrink-0 transition-transform group-open:rotate-90"
                    />
                  </summary>
                  <p className="max-w-2xl pb-7 text-sm font-medium leading-6 text-[#647068]">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto grid max-w-[1180px] gap-10 border-y border-[#ccd2ca] py-14 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <div className="flex gap-1 text-[#65796a]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} size={16} fill="currentColor" />
                ))}
              </div>
              <h2 className="mt-6 max-w-3xl font-display text-4xl font-semibold leading-[1.08] tracking-[-0.04em] text-[#173c2c] sm:text-5xl">
                Prøv din første rengøring fra {formatKr(INTRO_CLEANING_FROM_KR)} kr.
              </h2>
              <p className="mt-4 max-w-xl text-sm font-medium leading-6 text-[#69746c]">
                Du ser alle priser og vilkår, før bookingen bliver godkendt.
              </p>
            </div>
            <button
              type="button"
              onClick={() => selectPackage(featured.m2)}
              className="inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-[3px] bg-[#173c2c] px-6 text-sm font-bold text-white"
            >
              Vælg din bolig
              <ArrowRight size={16} />
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-[#173c2c] px-6 py-10 text-white/65 sm:px-8">
        <div className="mx-auto flex max-w-[1180px] flex-col justify-between gap-6 text-xs font-medium sm:flex-row sm:items-center">
          <Image
            src="/renzen-logo-ny.png"
            alt="Renzen"
            width={112}
            height={29}
            className="brightness-0 invert"
          />
          <p className="max-w-2xl leading-5">
            Introtilbuddet forudsætter fast rengøring hver 2. uge og Renzen Klub.
            Priser er efter {formatKr(ZEN_CREDIT_MONTHLY_KR)} kr. velkomstkredit.
            Alle priser vises i bookingflowet, før du godkender.
          </p>
          <div className="flex gap-5 font-bold text-white">
            <Link href="/handelsbetingelser">Vilkår</Link>
            <Link href="/persondatapolitik">Privatliv</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
