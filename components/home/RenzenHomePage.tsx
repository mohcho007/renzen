"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, ShieldCheck, Star } from "lucide-react";
import { HomeServicesBento } from "@/components/home/HomeServicesBento";
import { HeroBookingForm } from "@/components/site/HeroBookingForm";
import {
  RenzenEditorialFooter,
  RenzenEditorialHeader,
} from "@/components/site/RenzenEditorialChrome";
import { RenzenKlubPromoSection } from "@/components/site/RenzenKlubIntro";
import { RenzenKlubMaskCallout, renzenKlubMaskStyles } from "@/components/site/RenzenKlubMaskCallout";
import homeStyles from "@/components/home/RenzenHomePage.module.css";

export function RenzenHomePage() {
  return (
    <div className="min-h-screen bg-[#fbfaf5] text-[#203129]">
      <RenzenEditorialHeader />

      <main id="main">
        <section className={homeStyles.hero}>
          <div className={homeStyles.heroGrid}>
            <div className={homeStyles.heroContent}>
              <Image
                src="/shapes/hero-vector.svg"
                alt=""
                width={160}
                height={134}
                aria-hidden="true"
                className={homeStyles.heroShape}
              />
              <p className={homeStyles.eyebrow}>
                <span className={homeStyles.eyebrowRule} aria-hidden="true" />
                Skræddersyet rengøring
              </p>
              <h1 className={homeStyles.heroTitle}>
                Et renere hjem giver plads til mere.
              </h1>
              <p className={homeStyles.heroSubtext}>
                Få en fast, kvalitetssikret Zenmester og en rengøringsaftale,
                der passer til dit hjem. Tydelige priser — betaling først efter
                udført arbejde.
              </p>

              <HeroBookingForm
                showPostcodeIcon={false}
                wideInputs
                className={homeStyles.heroForm}
                submitPath="/book-rengoering"
              />

              <div className={homeStyles.trustRow}>
                {[
                  "Forsikrede Zenmestre",
                  "Servicefradrag",
                  "4,8 kundevurdering",
                ].map((item) => (
                  <span key={item} className={homeStyles.trustItem}>
                    <Check size={14} className={homeStyles.trustIcon} />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className={`${homeStyles.heroVisual} ${renzenKlubMaskStyles.heroKlubVisual}`}>
              <div className={homeStyles.heroImageWrap}>
                <Image
                  src="/flytterengoring-hero.jpg"
                  alt="Professionel rengøring i et nordisk hjem"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className={homeStyles.heroImage}
                />
              </div>

              <RenzenKlubMaskCallout variant="intro" />
            </div>
          </div>
        </section>

        <section className="border-b border-[#dfe2da] bg-[#fbfaf5]">
          <div className="mx-auto flex max-w-[1260px] flex-wrap justify-between gap-x-10 gap-y-6 px-6 py-8 sm:px-8">
            {[
              ["4,8 ud af 5", "Kundevurdering"],
              ["10 mio. kr.", "Forsikringsdækning"],
              ["26%", "Muligt servicefradrag"],
              ["Hele Danmark", "Voksende dækning"],
            ].map(([value, label]) => (
              <div key={label}>
                <p className="font-display text-xl font-semibold text-[#173c2c]">
                  {value}
                </p>
                <p className="mt-1 text-xs font-medium text-[#758078]">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-6 py-24 sm:px-8 sm:py-32">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#55705f]">
                Rengøring til forskellige hjem
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.04] tracking-[-0.04em] text-[#173c2c] sm:text-6xl">
                Hjælp, når hverdagen er fuld.
              </h2>
            </div>
            <p className="max-w-xl text-base font-medium leading-7 text-[#667168] lg:justify-self-end">
              Vælg en fast aftale eller få hjælp til den store opgave. Vi gør
              prisen tydelig, før du booker, og tilpasser arbejdet til boligen.
            </p>
          </div>

          <HomeServicesBento />
        </section>

        <section className="bg-[#e7e4da] py-24 sm:py-32">
          <div className="mx-auto grid max-w-[1280px] gap-12 px-6 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="relative min-h-[560px] bg-[#e7e4da]">
              <Image
                src="/renzen-zenmester.png"
                alt="Renzen Zenmester"
                fill
                sizes="(max-width: 1024px) 100vw, 52vw"
                className="object-contain object-center"
              />
            </div>
            <div className="lg:pl-10">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#55705f]">
                En fast person gør en forskel
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.04] tracking-[-0.04em] text-[#173c2c] sm:text-6xl">
                Din Zenmester lærer hjemmet at kende.
              </h2>
              <p className="mt-7 max-w-xl text-base font-medium leading-7 text-[#606c64]">
                Ved faste aftaler prioriterer vi den samme professionelle. Det
                giver bedre rutiner, færre forklaringer og et mere ensartet
                resultat fra gang til gang.
              </p>
              <dl className="mt-10 border-t border-[#bcc3b9]">
                {[
                  ["Fast aftale", "Den samme Zenmester prioriteres ved tilbagevendende rengøring."],
                  ["RenCover", "Din booking er forsikret for op til 10 mio. kr."],
                  ["Tilfredshedsgaranti", "Vi hjælper, hvis resultatet ikke er som aftalt."],
                ].map(([title, text], index) => (
                  <div
                    key={title}
                    className="grid grid-cols-[42px_1fr] gap-3 border-b border-[#bcc3b9] py-6"
                  >
                    <span className="font-mono text-xs font-bold text-[#758078]">
                      0{index + 1}
                    </span>
                    <div>
                      <dt className="font-display text-xl font-semibold text-[#173c2c]">
                        {title}
                      </dt>
                      <dd className="mt-2 text-sm font-medium leading-6 text-[#69746c]">
                        {text}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section id="sadan-virker-det" className="mx-auto max-w-[1200px] px-6 py-24 sm:px-8 sm:py-32">
          <div className="grid gap-14 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#55705f]">
                Fra booking til rent hjem
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.04em] text-[#173c2c] sm:text-5xl">
                En enkel proces uden unødigt bøvl.
              </h2>
            </div>
            <ol className="border-t border-[#ccd2ca]">
              {[
                ["Fortæl om boligen", "Indtast postnummer, størrelse og den ønskede hyppighed."],
                ["Vælg dato og pris", "Se den samlede pris og vælg en ledig tid, der passer dig."],
                ["Kom hjem til rent", "Din Zenmester udfører opgaven. Betalingen trækkes bagefter."],
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

        <RenzenKlubPromoSection />

        <section className="mx-auto max-w-[1180px] px-6 py-24 sm:px-8 sm:py-32">
          <div className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr]">
            <blockquote>
              <div className="flex gap-1 text-[#6b7e70]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} size={17} fill="currentColor" />
                ))}
              </div>
              <p className="mt-7 font-display text-4xl font-medium leading-[1.15] tracking-[-0.035em] text-[#173c2c] sm:text-5xl">
                “Det er især roen i at have den samme person hver anden uge,
                der gør forskellen for os.”
              </p>
              <footer className="mt-7 text-sm font-bold text-[#607066]">
                Mette, Frederiksberg
              </footer>
            </blockquote>
            <div className="border-l border-[#d0d5cd] pl-8">
              <ShieldCheck size={28} className="text-[#41614f]" />
              <h2 className="mt-6 font-display text-2xl font-semibold text-[#173c2c]">
                Tryghed skal kunne mærkes
              </h2>
              <p className="mt-4 text-sm font-medium leading-6 text-[#69746c]">
                Tydelig pris, forsikrede fagfolk og hjælp fra Renzen, hvis noget
                ikke går som aftalt.
              </p>
              <div className="mt-7 flex flex-col items-start gap-5">
                <Link
                  href="/klub/"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#173c2c]"
                >
                  Se introtilbud fra 199 kr.
                  <ArrowRight size={15} />
                </Link>
                <Link
                  href="/book-rengoering"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#41614f]"
                >
                  Beregn din pris
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#173c2c] px-6 py-20 text-[#f6f2e8] sm:px-8 sm:py-24">
          <div className="mx-auto flex max-w-[1180px] flex-col justify-between gap-10 sm:flex-row sm:items-end">
            <h2 className="max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-6xl">
              Brug tiden på noget bedre end rengøring.
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
                Beregn pris og book
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <RenzenEditorialFooter />
    </div>
  );
}
