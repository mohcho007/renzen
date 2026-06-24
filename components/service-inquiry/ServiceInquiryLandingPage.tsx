"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, ShieldCheck, Star } from "lucide-react";
import {
  RenzenEditorialFooter,
  RenzenEditorialHeader,
} from "@/components/site/RenzenEditorialChrome";
import { HeroBookingForm } from "@/components/site/HeroBookingForm";
import { RenzenKlubPromoSection } from "@/components/site/RenzenKlubIntro";
import { INTRO_CLEANING_FROM_KR } from "@/data/pricing";
import {
  RenzenKlubMaskCallout,
  renzenKlubMaskStyles,
} from "@/components/site/RenzenKlubMaskCallout";
import styles from "@/components/site/RenzenEditorial.module.css";
import type { EditorialServiceLandingConfig } from "@/components/service-inquiry/serviceInquiryContent";
import { ZEN_CREDIT_SERVICES_SECTION_INTRO } from "@/lib/zenCreditServices";
import { ZenCreditServicesGrid } from "@/components/site/ZenCreditServicesGrid";
import { ServiceProcessRadial } from "@/components/service-inquiry/ServiceProcessRadial";
import ReviewSnippet from "@/components/ReviewSnippet";
import { getServiceCityUrl } from "@/lib/urls";

type ServiceInquiryLandingPageProps = {
  config: EditorialServiceLandingConfig;
  inquiryPath?: string;
};

export function ServiceInquiryLandingPage({
  config,
  inquiryPath,
}: ServiceInquiryLandingPageProps) {
  const forespoergselPath =
    inquiryPath ?? `/${config.slug}/forespoergsel/`;

  return (
    <div className="min-h-screen bg-[#fbfaf5] text-[#203129]">
      <RenzenEditorialHeader />

      <main>
        <section
          className={`relative overflow-hidden bg-[#dfe9dc] ${config.heroCreamOnMobile ? "max-lg:bg-[#fbfaf5]" : ""}`}
        >
          <div className="grid min-h-[690px] w-full lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative z-10 order-2 flex flex-col justify-center px-6 py-16 sm:px-10 lg:order-1 lg:pl-[114px] lg:pr-16 lg:py-20">
              {config.heroCornerImage ? (
                <Image
                  src={config.heroCornerImage}
                  alt=""
                  width={306}
                  height={127}
                  aria-hidden="true"
                  className={styles.serviceHeroCornerMenu}
                />
              ) : (
                <Image
                  src="/shapes/hero-vector.svg"
                  alt=""
                  width={160}
                  height={134}
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-0 right-0 z-0 hidden h-auto w-[120px] opacity-70 sm:block lg:w-[160px]"
                />
              )}
              <p className="relative z-10 mb-6 text-xs font-bold uppercase tracking-[0.18em] text-[#41614f]">
                {config.heroEyebrow}
              </p>
              <h1 className="relative z-10 max-w-[620px] font-display text-[42px] font-semibold leading-[0.98] tracking-[-0.05em] text-[#173c2c] sm:text-[58px] lg:text-[68px]">
                {config.heroTitle}
              </h1>
              <p className="relative z-10 mt-7 max-w-[540px] text-base font-medium leading-7 text-[#536159] sm:text-lg">
                {config.heroDescription}
              </p>

              <HeroBookingForm
                showPostcodeIcon={false}
                showInputs={config.showHeroInputs ?? true}
                showSizeField={config.showSizeField ?? true}
                wideInputs={config.heroFormWideInputs ?? true}
                submitPath={forespoergselPath}
                submitLabel="Få et uforpligtende tilbud"
                sizeFieldLabel={config.sizeFieldLabel}
                sizeFieldPlaceholder={config.sizeFieldPlaceholder}
                className="relative z-10 mt-9"
              />

              <div className="relative z-10 mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-[#536159]">
                {config.trustBadges.map((item) => (
                  <span key={item} className="flex items-center gap-2">
                    <Check size={14} />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div
              className={`${renzenKlubMaskStyles.heroKlubVisual} order-1 lg:order-2 ${styles.heroImage} ${config.heroWrapperClassName ? styles[config.heroWrapperClassName as keyof typeof styles] : ""} ${
                config.heroCreamOnMobile
                  ? renzenKlubMaskStyles.heroKlubVisualCreamMobile
                  : ""
              }`}
            >
              <div
                className={`${renzenKlubMaskStyles.heroKlubImageSlot} relative lg:min-h-full`}
              >
                <Image
                  src={config.heroImage}
                  alt={config.heroImageAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className={
                    config.heroImageClassName
                      ? styles[config.heroImageClassName as keyof typeof styles]
                      : "object-cover object-right"
                  }
                />
              </div>
              {(config.showKlubMask ?? true) && (
                <RenzenKlubMaskCallout
                  variant={config.klubMaskVariant}
                  serviceLine={config.klubMaskServiceLine}
                />
              )}
            </div>
          </div>
        </section>

        <section className="border-b border-[#dfe2da] bg-[#fbfaf5]">
          <div className="mx-auto flex max-w-[1260px] flex-wrap justify-between gap-x-10 gap-y-6 px-6 py-8 sm:px-8">
            {config.stats.map(([value, label]) => (
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
          {config.includedRooms ? (
            <>
              <div className="mx-auto mb-16 max-w-3xl text-center">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#55705f]">
                  {config.includedEyebrow}
                </p>
                <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.04em] text-[#173c2c] sm:text-5xl">
                  {config.includedTitle}
                </h2>
                <p className="mt-6 text-base font-medium leading-7 text-[#667168]">
                  {config.includedDescription}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                {config.includedRooms.map((room) => (
                  <div
                    key={room.title}
                    className="flex flex-col border border-[#ccd2ca] bg-white p-6"
                  >
                    <h3 className="border-b border-[#ccd2ca] pb-3 font-display text-lg font-semibold text-[#173c2c]">
                      {room.title}
                    </h3>
                    <ul className="mt-4 space-y-2.5">
                      {room.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2.5 text-sm font-medium leading-6 text-[#5f6d65]"
                        >
                          <Check
                            size={15}
                            className="mt-0.5 shrink-0 text-[#41614f]"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="grid gap-14 lg:grid-cols-[0.72fr_1.28fr]">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#55705f]">
                  {config.includedEyebrow}
                </p>
                <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.04em] text-[#173c2c] sm:text-5xl">
                  {config.includedTitle}
                </h2>
                <p className="mt-6 max-w-md text-base font-medium leading-7 text-[#667168]">
                  {config.includedDescription}
                </p>
              </div>
              <ul className="border-t border-[#ccd2ca]">
                {config.includedItems.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-4 border-b border-[#ccd2ca] py-6"
                  >
                    <Check
                      size={18}
                      className="mt-0.5 shrink-0 text-[#41614f]"
                    />
                    <span className="text-sm font-semibold leading-6 text-[#3f4d45]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <section
          className={`bg-[#e7e4da] py-24 sm:py-32${config.howItWorksBackgroundImage ? ` ${styles.includedSection}` : ""}`}
        >
          {config.howItWorksBackgroundImage ? (
            <div className="absolute inset-0 z-0">
              <Image
                src={config.howItWorksBackgroundImage}
                alt=""
                fill
                sizes="100vw"
                aria-hidden="true"
                className="object-cover object-center"
              />
            </div>
          ) : null}
          <div
            className={`mx-auto px-6 sm:px-8 ${config.howItWorksBackgroundImage ? "relative z-10 max-w-[1280px]" : "max-w-[1180px]"}`}
          >
            <div
              className={
                config.howItWorksBackgroundImage
                  ? "max-w-xl lg:max-w-[52%] lg:pr-10"
                  : undefined
              }
            >
              <div
                className={
                  config.howItWorksBackgroundImage ? undefined : "max-w-2xl"
                }
              >
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#55705f]">
                  {config.howItWorksEyebrow}
                </p>
                <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.04] tracking-[-0.04em] text-[#173c2c] sm:text-5xl">
                  {config.howItWorksTitle}
                </h2>
              </div>

              <ol className="mt-14 border-t border-[#ccd2ca]">
                {config.howItWorks.map(([title, text], index) => (
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
          </div>
        </section>

        {config.processSection ? (
          <ServiceProcessRadial config={config.processSection} />
        ) : null}

        {config.whyRenzen?.sections ? (
          <section className="border-y border-[#dfe2da] bg-white">
            <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
              <div className="py-16 text-center sm:py-20">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#55705f]">
                  {config.whyRenzen.eyebrow}
                </p>
                {config.whyRenzen.title ? (
                  <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.04em] text-[#173c2c] sm:text-5xl">
                    {config.whyRenzen.title}
                  </h2>
                ) : null}
              </div>
              {config.whyRenzen.sections.map((block, index) => (
                <div
                  key={block.title}
                  className={`grid gap-10 border-[#dfe2da] py-16 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16 ${
                    index > 0 ? "border-t" : ""
                  }`}
                >
                  <div
                    className={`relative order-1 aspect-[4/3] w-full overflow-hidden bg-[#e7e4da] ${
                      block.imagePosition === "right" ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <Image
                      src={block.image}
                      alt={block.imageAlt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover object-center"
                    />
                  </div>
                  <div
                    className={`order-2 ${
                      block.imagePosition === "right" ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    <h3 className="font-display text-3xl font-semibold tracking-[-0.04em] text-[#173c2c] sm:text-4xl">
                      {block.title}
                    </h3>
                    <div className="mt-6 space-y-5 text-base font-medium leading-7 text-[#667168]">
                      {block.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : config.whyRenzen?.paragraphs ? (
          <section className="border-y border-[#dfe2da] bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-3xl px-6 text-center sm:px-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#55705f]">
                {config.whyRenzen.eyebrow}
              </p>
              {config.whyRenzen.title ? (
                <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.04em] text-[#173c2c] sm:text-5xl">
                  {config.whyRenzen.title}
                </h2>
              ) : null}
              <div className="mt-8 space-y-5 text-base font-medium leading-7 text-[#667168]">
                {config.whyRenzen.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {config.showReviews ? (
          <section className="bg-[#fbfaf5] py-24 sm:py-32">
            <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
              <div className="mx-auto mb-16 max-w-3xl text-center">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#55705f]">
                  Kundeudtalelser
                </p>
                <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.04em] text-[#173c2c] sm:text-5xl">
                  Det siger kunderne om Renzen
                </h2>
              </div>
              <ReviewSnippet />
            </div>
          </section>
        ) : null}

        {config.hostBenefits ? (
          <section className="mx-auto max-w-[1200px] px-6 py-24 sm:px-8 sm:py-32">
            <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
              {config.hostBenefits.image ? (
                <div className="relative mx-auto aspect-square w-full max-w-[320px] overflow-hidden rounded-full border-8 border-[#f0ede4] bg-[#e7e4da] shadow-sm lg:mx-0">
                  <Image
                    src={config.hostBenefits.image}
                    alt={config.hostBenefits.imageAlt ?? ""}
                    fill
                    sizes="320px"
                    className="object-cover"
                  />
                </div>
              ) : null}
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#55705f]">
                  {config.hostBenefits.eyebrow}
                </p>
                <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.04em] text-[#173c2c] sm:text-5xl">
                  {config.hostBenefits.title}
                </h2>
                <ul className="mt-8 space-y-4 border-t border-[#ccd2ca] pt-8">
                  {config.hostBenefits.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm font-semibold leading-6 text-[#3f4d45]"
                    >
                      <Check
                        size={16}
                        className="mt-0.5 shrink-0 text-[#41614f]"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={forespoergselPath}
                  className="mt-10 inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-[3px] bg-[#173c2c] px-6 text-sm font-bold text-[#f6f2e8] transition-colors hover:bg-[#41614f]"
                >
                  Send forespørgsel
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </section>
        ) : null}

        {config.tilvalg ? (
          <section className="border-y border-[#dfe2da] bg-[#fbfaf5] px-6 py-24 sm:px-8 sm:py-32">
            <div className="mx-auto max-w-[1200px]">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#55705f]">
                  {config.tilvalg.eyebrow}
                </p>
                <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.04em] text-[#173c2c] sm:text-5xl">
                  {config.tilvalg.title}
                </h2>
                {config.tilvalg.description ? (
                  <p className="mt-6 text-base font-medium leading-7 text-[#667168]">
                    {config.tilvalg.description}
                  </p>
                ) : null}
              </div>
              <ul className={`mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${styles.tilvalgCardGrid}`}>
                {config.tilvalg.items.map((item) => (
                  <li
                    key={item}
                    className={`flex min-h-[7.5rem] flex-col justify-between border border-[#ccd2ca] bg-white px-6 py-5 ${styles.tilvalgCard}`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7b887f]">
                      Tilvalg
                    </span>
                    <span className="mt-3 text-base font-semibold leading-6 text-[#173c2c]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href={forespoergselPath}
                className="mt-12 inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-[3px] bg-[#173c2c] px-6 text-sm font-bold text-[#f6f2e8] transition-colors hover:bg-[#41614f]"
              >
                Få et uforpligtende tilbud
                <ArrowRight size={16} />
              </Link>
            </div>
          </section>
        ) : null}

        {config.cityLinks ? (
          <section className="border-t border-[#dfe2da] bg-[#fbfaf5] py-24 sm:py-32">
            <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#55705f]">
                {config.cityLinks.eyebrow}
              </p>
              <h2 className="mt-4 max-w-3xl font-display text-4xl font-semibold tracking-[-0.04em] text-[#173c2c] sm:text-5xl">
                {config.cityLinks.title}
              </h2>
              <p className="mt-6 max-w-3xl text-base font-medium leading-7 text-[#667168]">
                {config.cityLinks.description}
              </p>
              <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {config.cityLinks.cities.map((city) => (
                  <Link
                    key={city.slug}
                    href={getServiceCityUrl(config.slug, city.slug)}
                    className="flex min-h-12 cursor-pointer items-center justify-center rounded-[3px] border border-[#ccd2ca] bg-white px-4 text-center text-sm font-bold text-[#173c2c] transition-colors hover:border-[#41614f] hover:text-[#41614f]"
                  >
                    {city.name}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {config.showKlubSections && (
          <>
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

            <RenzenKlubPromoSection description={config.klubPromoDescription} />

            <section
              className={`${styles.klubFaqSection} ${styles.klubFaqSectionSolid} sm:py-28`}
            >
              <div className={`mx-auto max-w-[1280px] px-6 sm:px-8 ${styles.klubFaqInner}`}>
                <div className={styles.klubFaqGrid}>
                  {config.klubFaqs.map((faq) => (
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
                    className="inline-flex cursor-pointer items-center gap-2 text-sm font-bold text-[#173c2c] underline decoration-[#b8c9b8] underline-offset-4 transition-colors hover:text-[#41614f] hover:decoration-[#41614f]"
                  >
                    Se alle spørgsmål
                    <ArrowRight size={15} />
                  </Link>
                </p>
              </div>
            </section>
          </>
        )}

        <section className="bg-[#173c2c] px-6 py-20 text-[#f6f2e8] sm:px-8 sm:py-24">
          <div className="mx-auto flex max-w-[1180px] flex-col justify-between gap-10 sm:flex-row sm:items-end">
            <h2 className="max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl">
              {config.ctaTitle}
            </h2>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Link
                href={forespoergselPath}
                className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-[3px] border border-transparent bg-[#f1e9d8] px-6 text-sm font-bold text-[#173c2c] transition-colors hover:border-white/30 hover:bg-transparent hover:text-[#f6f2e8]"
              >
                {config.bottomCtaLabel ?? "Få et uforpligtende tilbud"}
                <ArrowRight size={16} />
              </Link>
              {config.showKlubSections && (
                <Link
                  href="/klub/"
                  className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-[3px] border border-white/30 px-6 text-sm font-bold text-white transition-colors hover:border-transparent hover:bg-[#f1e9d8] hover:text-[#173c2c]"
                >
                  Se introtilbud
                  <ArrowRight size={16} />
                </Link>
              )}
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
                {config.faqs.map((faq) => (
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
                Uforpligtende tilbud
              </h2>
              <p className="mt-4 text-sm font-medium leading-6 text-[#69746c]">
                Du binder dig til ingenting. Vi vender tilbage med et skræddersyet
                tilbud inden for 24 timer — og du bestemmer selv, om du vil gå videre.
              </p>
              <div className="mt-7 flex gap-1 text-[#6b7e70]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} size={17} fill="currentColor" />
                ))}
              </div>
              <p className="mt-4 font-display text-lg font-medium leading-snug text-[#173c2c]">
                &ldquo;Hurtigt svar og et fair tilbud. Præcis den hjælp vi havde brug for.&rdquo;
              </p>
              <p className="mt-3 text-sm font-bold text-[#607066]">
                Kunde, København
              </p>
              <div className="mt-7 flex flex-col gap-3">
                <Link
                  href={forespoergselPath}
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#173c2c]"
                >
                  Send forespørgsel
                  <ArrowRight size={15} />
                </Link>
                {config.showKlubSections && (
                  <Link
                    href="/klub/"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#41614f]"
                  >
                    Se introtilbud fra {INTRO_CLEANING_FROM_KR} kr.
                    <ArrowRight size={15} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <RenzenEditorialFooter />
    </div>
  );
}
