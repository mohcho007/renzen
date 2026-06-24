"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Phone,
  ShieldCheck,
} from "lucide-react";
import {
  DEAL_PACKAGES,
  type DealPackage,
} from "@/components/dealside/dealPackages";
import {
  KLUB_ANNUAL_KR,
  KLUB_ANNUAL_MONTHLY_EQUIVALENT_KR,
  KLUB_ANNUAL_SAVINGS_VS_MONTHLY_KR,
  KLUB_MONTHLY_KR,
  ZEN_CREDIT_ANNUAL_KR,
  ZEN_CREDIT_MONTHLY_KR,
} from "@/data/pricing";
import styles from "@/components/site/RenzenEditorial.module.css";
import type { DealWizardVariant } from "@/components/dealside/DealTypeformWizard";

const DealTypeformWizard = dynamic(
  () => import("@/components/dealside/DealTypeformWizard"),
  { ssr: false },
);

const included = [
  "Fast rengøring hver 2. uge",
  "0 kr. ved booking — betaling efter besøget",
  "Forsikret Zenmester og tilfredshedsgaranti",
  "Medlemspris og Zen-kreditter på løbende besøg",
];

function formatKr(amount: number) {
  return amount.toLocaleString("da-DK");
}

const klubMonthlyLabel = KLUB_ANNUAL_MONTHLY_EQUIVALENT_KR.toLocaleString(
  "da-DK",
  { minimumFractionDigits: 2, maximumFractionDigits: 2 },
);

function introDueKr(introPrice: number) {
  return Math.max(0, introPrice - ZEN_CREDIT_MONTHLY_KR);
}

const INTRO_DUE_MIN_KR = introDueKr(DEAL_PACKAGES[0].introPrice);
const INTRO_DUE_MAX_KR = introDueKr(
  DEAL_PACKAGES[DEAL_PACKAGES.length - 1].introPrice,
);

const zenCreditAnnualMonths = ZEN_CREDIT_ANNUAL_KR / ZEN_CREDIT_MONTHLY_KR;

const faqs = [
  {
    question: "Hvad koster den første rengøring?",
    answer:
      `Din pris for 1. rengøring afhænger af boligens størrelse: fra ${formatKr(INTRO_DUE_MIN_KR)} kr. (op til ${DEAL_PACKAGES[0].m2} m²) til ${formatKr(INTRO_DUE_MAX_KR)} kr. (op til ${DEAL_PACKAGES[DEAL_PACKAGES.length - 1].m2} m²) — efter ${formatKr(ZEN_CREDIT_MONTHLY_KR)} kr. velkomstkredit med Renzen Klub. Renzen Klub (${formatKr(KLUB_ANNUAL_KR)} kr./år) og total vises, før du godkender.`,
  },
  {
    question: "Hvorfor er introprisen lavere end normalprisen?",
    answer:
      "Introprisen kombinerer velkomstrabat og fordele i Renzen Klub. Den gælder ved fast rengøring hver 2. uge og et aktivt medlemskab.",
  },
  {
    question: "Hvornår betaler jeg?",
    answer:
      "Du betaler 0 kr. ved booking. Kortet kontrolleres før besøget, og rengøringen faktureres efter den er udført.",
  },
  {
    question: "Kan jeg se alle vilkår før jeg booker?",
    answer:
      "Ja. I bookingflowet ser du intropris, normalpris, medlemsplan og løbende pris, før du godkender.",
  },
];

const DEFAULT_BOOK2_PACKAGE =
  DEAL_PACKAGES.find((pkg) => pkg.popular) ?? DEAL_PACKAGES[1];

function getPackageFromM2Param(m2Param: string | null): DealPackage | null {
  if (!m2Param) return null;
  const m2 = Number.parseInt(m2Param, 10);
  if (!Number.isFinite(m2)) return null;
  return DEAL_PACKAGES.find((pkg) => pkg.m2 === m2) ?? null;
}

export default function Dealside2LandingPage({
  wizardVariant = "dealpage2",
}: {
  wizardVariant?: DealWizardVariant;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isBook2 = wizardVariant === "book2";
  const fromKlub = isBook2 && searchParams.get("from") === "klub";
  const pkgFromQuery = useMemo(
    () => (isBook2 ? getPackageFromM2Param(searchParams.get("m2")) : null),
    [isBook2, searchParams],
  );
  const initialBook2Package = isBook2
    ? (pkgFromQuery ?? DEFAULT_BOOK2_PACKAGE)
    : null;
  const [selectedPackage, setSelectedPackage] = useState<DealPackage | null>(
    isBook2 ? initialBook2Package : null,
  );
  const [showWizard, setShowWizard] = useState(isBook2);

  useEffect(() => {
    if (!isBook2) return;
    const pkg = pkgFromQuery ?? DEFAULT_BOOK2_PACKAGE;
    setSelectedPackage(pkg);
    setShowWizard(true);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [isBook2, pkgFromQuery]);

  const startBooking = (pkg: DealPackage) => {
    setSelectedPackage(pkg);
    setShowWizard(true);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  };

  const handleBack = () => {
    if (isBook2) {
      router.push(fromKlub ? "/klub/" : "/");
      return;
    }
    setShowWizard(false);
  };

  if (showWizard && selectedPackage) {
    return (
      <DealTypeformWizard
        pkg={selectedPackage}
        onBack={handleBack}
        variant={wizardVariant}
        initialActualM2={pkgFromQuery?.m2}
        initialClubSelected={fromKlub ? true : undefined}
      />
    );
  }

  return (
    <div className="dealpage2-landing min-h-screen bg-[#fbfaf5] text-[#203129]">
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
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/"
              className="hidden text-xs font-semibold text-[#657169] sm:inline"
            >
              Se forsiden
            </Link>
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
          <div className="mx-auto grid max-w-[1440px] gap-10 px-6 py-16 sm:px-10 lg:grid-cols-[1fr_0.95fr] lg:items-center lg:py-20 lg:pl-16 lg:pr-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#4f6858]">
                Renzen Klub · introtilbud
              </p>
              <h1 className="mt-5 max-w-[640px] font-display text-[42px] font-semibold leading-[0.98] tracking-[-0.05em] text-[#173c2c] sm:text-[56px] lg:text-[64px]">
                Vælg din bolig — se din pris med det samme
              </h1>
              <p className="mt-6 max-w-[540px] text-base font-medium leading-7 text-[#536159] sm:text-lg">
                Professionel rengøring hver 2. uge med fast Zenmester. Første
                rengøring fra {formatKr(INTRO_DUE_MIN_KR)} kr. med Renzen Klub —
                normalpris og medlemskab vises tydeligt, før du booker.
              </p>

              <div className="mt-8 overflow-hidden border border-[#b9c5b9] bg-[#fbfaf5]">
                <div className="grid grid-cols-[1.2fr_0.8fr_0.8fr] border-b border-[#d8ddd5] bg-[#edf2ea] px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#607066] sm:px-5">
                  <span>Bolig</span>
                  <span>1. rengøring</span>
                  <span className="hidden sm:inline">Normalpris</span>
                </div>
                {DEAL_PACKAGES.map((pkg) => (
                  <button
                    key={pkg.m2}
                    type="button"
                    onClick={() => startBooking(pkg)}
                    className={`dealpage2-package-card group grid w-full grid-cols-[1fr_auto_auto] items-center gap-3 border-b border-[#d8ddd5] px-4 py-4 text-left last:border-b-0 sm:grid-cols-[1.2fr_0.8fr_0.8fr_auto] sm:px-5 ${
                      pkg.popular ? "bg-[#f6f3eb]" : "bg-[#fbfaf5]"
                    }`}
                  >
                    <span>
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-display text-lg font-semibold text-[#173c2c] sm:text-xl">
                          {pkg.title}
                        </span>
                        {pkg.popular && (
                          <span className="rounded-[2px] bg-[#173c2c] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                            Populær
                          </span>
                        )}
                      </span>
                      <span className="mt-1 block text-xs font-medium text-[#77827a]">
                        {pkg.rooms} · op til {pkg.m2} m²
                      </span>
                    </span>
                    <span>
                      <span className="font-display text-2xl font-semibold text-[#173c2c] sm:text-3xl">
                        {formatKr(introDueKr(pkg.introPrice))} kr.
                      </span>
                      <span className="mt-0.5 block text-[10px] font-semibold leading-4 text-[#77827a] sm:text-[11px]">
                        med Klub · velkomstkredit
                      </span>
                    </span>
                    <span className="hidden text-sm font-semibold text-[#929a95] line-through sm:inline">
                      {formatKr(pkg.normalPrice)} kr.
                    </span>
                    <ArrowRight
                      size={18}
                      className="text-[#55705f] transition-transform group-hover:translate-x-1"
                    />
                  </button>
                ))}
              </div>

              <p className="mt-4 text-xs font-medium leading-5 text-[#7b857f]">
                Priser er for 1. rengøring efter {formatKr(ZEN_CREDIT_MONTHLY_KR)} kr. velkomstkredit ved fast
                aftale hver 2. uge og Renzen Klub ({formatKr(KLUB_ANNUAL_KR)} kr./år, min. 6 mdr.).
                Normalpris er uden tilbud. Servicefradrag vises i bookingflowet.
              </p>
            </div>

            <div className={`relative min-h-[420px] bg-[#dfe9dc] lg:min-h-[560px] ${styles.dealImage}`}>
              <Image
                src="/renzen-zenmester.png"
                alt="Renzen Zenmester"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="object-contain object-center"
              />
            </div>
          </div>
        </section>

        <section className="border-b border-[#dfe2da] bg-[#fbfaf5]">
          <div className="mx-auto grid max-w-[1180px] gap-8 px-6 py-10 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
            {included.map((item) => (
              <div key={item} className="flex gap-3">
                <Check size={16} className="mt-0.5 shrink-0 text-[#41614f]" />
                <p className="text-sm font-semibold leading-6 text-[#314139]">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto max-w-[1180px]">
            <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#55705f]">
                  Sådan hænger det sammen
                </p>
                <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.04] tracking-[-0.04em] text-[#173c2c] sm:text-5xl">
                  Tre tal — ingen overraskelser
                </h2>
                <p className="mt-6 text-base font-medium leading-7 text-[#667168]">
                  Vi viser intropris, normalpris og medlemskab adskilt, så du
                  kan vurdere tilbuddet, før du binder dig.
                </p>
              </div>

              <div className="border-t border-[#ccd2ca]">
                {[
                  [
                    "1. rengøring",
                    `Din pris efter ${formatKr(ZEN_CREDIT_MONTHLY_KR)} kr. velkomstkredit med Renzen Klub.`,
                    `${formatKr(INTRO_DUE_MIN_KR)}–${formatKr(INTRO_DUE_MAX_KR)} kr. afhængig af m²`,
                  ],
                  [
                    "Normalpris",
                    "Prisen for samme rengøring uden introtilbud og medlemsfordele.",
                    `${DEAL_PACKAGES[0].normalPrice.toLocaleString("da-DK")}–${DEAL_PACKAGES[DEAL_PACKAGES.length - 1].normalPrice.toLocaleString("da-DK")} kr. afhængig af m²`,
                  ],
                  [
                    "Renzen Klub",
                    `${KLUB_MONTHLY_KR} kr./md. (min. 6 mdr.) eller ${formatKr(KLUB_ANNUAL_KR)} kr. for 12 mdr. (= ${klubMonthlyLabel} kr./md.). Årsplanen sparer ${formatKr(KLUB_ANNUAL_SAVINGS_VS_MONTHLY_KR)} kr. og låser intropris.`,
                    "Vælges i bookingflowet",
                  ],
                ].map(([title, text, note]) => (
                  <div
                    key={title}
                    className="grid gap-3 border-b border-[#ccd2ca] py-7 sm:grid-cols-[140px_1fr]"
                  >
                    <h3 className="font-display text-xl font-semibold text-[#173c2c]">
                      {title}
                    </h3>
                    <div>
                      <p className="text-sm font-medium leading-6 text-[#69746c]">
                        {text}
                      </p>
                      <p className="mt-2 text-xs font-bold text-[#55705f]">
                        {note}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#173c2c] py-20 text-[#f5f1e7] sm:py-28">
          <div className="mx-auto grid max-w-[1180px] gap-12 px-6 sm:px-8 lg:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/55">
                Renzen Klub
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.03] tracking-[-0.04em] sm:text-5xl">
                Medlemsfordele uden et kompliceret loyalitetsprogram
              </h2>
              <ul className="mt-8 space-y-3 text-sm font-bold">
                {[
                  "Op til 20% rabat på løbende rengøring",
                  `${zenCreditAnnualMonths} × ${formatKr(ZEN_CREDIT_MONTHLY_KR)} kr. i Zen-kreditter pr. medlemsår`,
                  "Medlemspriser på udvalgte boligservices",
                  "Tilfredshedsgaranti og RenCover forsikring",
                ].map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <Check size={15} className="shrink-0 text-white/45" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="bg-[#cfdccf] p-6 text-[#173c2c] sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#5f7165]">
                  Årsplan · bedste værdi
                </p>
                <p className="mt-3 font-display text-5xl font-semibold tracking-[-0.05em]">
                  {formatKr(KLUB_ANNUAL_KR)} kr.
                </p>
                <p className="mt-2 text-sm font-semibold">
                  12 måneder · svarer til {klubMonthlyLabel} kr./md.
                </p>
              </div>
              <div className="border border-white/20 p-6 sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/50">
                  Månedsplan
                </p>
                <p className="mt-3 font-display text-3xl font-semibold">
                  {KLUB_MONTHLY_KR} kr. <span className="text-base">pr. måned</span>
                </p>
                <p className="mt-2 text-sm font-medium text-white/65">
                  Minimum seks betalte måneder
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#e7e4da] py-20 sm:py-28">
          <div className="mx-auto grid max-w-[1180px] gap-12 px-6 sm:px-8 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#55705f]">
                Ofte stillede spørgsmål
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.04em] text-[#173c2c]">
                Kort svar, før du vælger
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
                <details
                  key={faq.question}
                  className="group border-b border-[#bfc5bc]"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-6 font-display text-lg font-semibold text-[#173c2c] sm:text-xl">
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
          <div className="mx-auto flex max-w-[1180px] flex-col justify-between gap-8 border-y border-[#ccd2ca] py-14 sm:flex-row sm:items-end">
            <div>
              <h2 className="max-w-xl font-display text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-[#173c2c] sm:text-5xl">
                Klar til at booke?
              </h2>
              <p className="mt-4 max-w-lg text-sm font-medium leading-6 text-[#69746c]">
                Vælg boligstørrelse og gå direkte til booking. Du ser alle priser
                og vilkår, før du godkender.
              </p>
            </div>
            <button
              type="button"
              onClick={() => startBooking(DEAL_PACKAGES.find((p) => p.popular)!)}
              className="dealpage2-cta-btn inline-flex min-h-12 shrink-0 items-center gap-2 rounded-[3px] bg-[#173c2c] px-6 text-sm font-bold text-white transition-colors hover:bg-[#0f2d20]"
            >
              Vælg mellem bolig — {formatKr(introDueKr(DEAL_PACKAGES.find((p) => p.popular)!.introPrice))} kr.
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
