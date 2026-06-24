"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Clock, ShieldCheck, Wallet } from "lucide-react";
import {
  RenzenEditorialFooter,
  RenzenEditorialHeader,
} from "@/components/site/RenzenEditorialChrome";
import { RevenueDonutChart } from "@/components/bliv-zenmester/RevenueDonutChart";
import styles from "@/components/site/RenzenEditorial.module.css";
import { siteConfig } from "@/lib/siteConfig";

const revenueSegments = [
  { label: "Til Zenmester", value: 70, color: "#173c2c" },
  { label: "Til admin", value: 20, color: "#5a7a6a" },
  { label: "Til marketing, salg og tech", value: 10, color: "#b8c9b8" },
];

const benefits = [
  {
    icon: Wallet,
    title: "Fair fordeling",
    text: "70% af omsætningen går direkte til dig som Zenmester. Ingen skjulte mellemled.",
  },
  {
    icon: Clock,
    title: "Fleksible opgaver",
    text: "Vælg de opgaver, der passer til din hverdag — rengøring, have eller specialopgaver.",
  },
  {
    icon: ShieldCheck,
    title: "Tryg platform",
    text: "Forsikring, kundeservice og booking håndteres af Renzen, så du kan fokusere på arbejdet.",
  },
];

const requirements = [
  "Erfaring med rengøring, havearbejde eller relaterede services",
  "Pålidelig, punktlig og grundig i dit arbejde",
  "Ren straffeattest og vilje til baggrundstjek",
  "Dansk eller engelsk i daglig kommunikation",
  "Eget CVR-nummer eller vilje til at oprette enkeltmandsvirksomhed",
];

const steps = [
  {
    title: "Ansøg online",
    text: "Fortæl os om din erfaring, område og hvilke opgaver du vil tage.",
  },
  {
    title: "Kom i gang",
    text: "Vi gennemgår din ansøgning og kontakter dig med næste skridt.",
  },
  {
    title: "Modtag opgaver",
    text: "Få bookede opgaver via platformen og byg en fast kundebase.",
  },
];

export function BlivZenmesterPage() {
  return (
    <div className="min-h-screen bg-[#fbfaf5] text-[#203129]">
      <RenzenEditorialHeader />

      <main>
        <section className="relative overflow-hidden bg-[#dfe9dc]">
          <div className="grid min-h-[620px] w-full lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative z-10 order-2 flex flex-col justify-center px-6 py-16 sm:px-10 lg:order-1 lg:pl-[114px] lg:pr-16 lg:py-20">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#41614f]">
                Bliv Zenmester
              </p>
              <h1 className="mt-5 max-w-[620px] font-display text-[40px] font-semibold leading-[1.02] tracking-[-0.04em] text-[#173c2c] sm:text-[56px]">
                Arbejd sammen med Renzen
              </h1>
              <p className="mt-6 max-w-[540px] text-base font-medium leading-7 text-[#536159] sm:text-lg">
                Som Zenmester får du adgang til kunder, booking og support —
                og beholder den største del af omsætningen. Vi bygger en
                platform, hvor kvalitet og fair vilkår går hånd i hånd.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/kontakt"
                  className="inline-flex min-h-11 items-center gap-2 rounded-[4px] bg-[#173c2c] px-5 text-sm font-bold text-white hover:bg-[#0f2d20]"
                >
                  Ansøg nu
                  <ArrowRight size={15} />
                </Link>
                <a
                  href={`mailto:${siteConfig.email}?subject=${encodeURIComponent("Ansøgning som Zenmester")}`}
                  className="inline-flex min-h-11 items-center rounded-[4px] border border-[#173c2c] px-5 text-sm font-bold text-[#173c2c] hover:bg-white"
                >
                  Skriv til os
                </a>
              </div>
            </div>

            <div
              className={`relative order-1 min-h-[290px] lg:order-2 lg:min-h-full ${styles.heroImage}`}
            >
              <Image
                src="/zenmester-gor-rent-rundt.jpg"
                alt="Zenmester i arbejde"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 52vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </section>

        <section className="px-6 py-16 sm:px-10 sm:py-20 lg:px-14">
          <div className="mx-auto grid max-w-[1100px] gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6b7a72]">
                Gennemsigtig fordeling
              </p>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.03em] text-[#173c2c] sm:text-4xl">
                70% af omsætningen går til dig
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-[#536159] sm:text-base">
                Hos Renzen tror vi på, at dem der udfører arbejdet, skal have
                den største andel. Resten dækker administration, kundeservice,
                marketing og den teknologi, der holder platformen kørende.
              </p>
            </div>
            <div className="rounded-[4px] border border-[#dfe2da] bg-white p-6 sm:p-8">
              <RevenueDonutChart segments={revenueSegments} />
            </div>
          </div>
        </section>

        <section className="border-y border-[#dfe2da] bg-[#eef2eb] px-6 py-16 sm:px-10 lg:px-14">
          <div className="mx-auto max-w-[1100px]">
            <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] text-[#173c2c]">
              Hvorfor blive Zenmester?
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {benefits.map(({ icon: Icon, title, text }) => (
                <article
                  key={title}
                  className="rounded-[4px] border border-[#d5dbd2] bg-white p-6"
                >
                  <Icon size={22} className="text-[#41614f]" aria-hidden="true" />
                  <h3 className="mt-4 font-display text-xl font-semibold text-[#173c2c]">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#536159]">
                    {text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-16 sm:px-10 lg:px-14">
          <div className="mx-auto grid max-w-[1100px] gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] text-[#173c2c]">
                Hvem passer rollen?
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#536159] sm:text-base">
                Vi søger dygtige folk, der tager stolthed i sit arbejde og vil
                være en del af et professionelt fællesskab.
              </p>
              <ul className="mt-8 space-y-3">
                {requirements.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm font-medium text-[#536159]"
                  >
                    <Check
                      size={16}
                      className="mt-0.5 shrink-0 text-[#41614f]"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] text-[#173c2c]">
                Sådan kommer du i gang
              </h2>
              <ol className="mt-8 space-y-6">
                {steps.map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#173c2c] text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-[#173c2c]">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-[#536159]">
                        {step.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="border-t border-[#dfe2da] bg-[#173c2c] px-6 py-16 text-white sm:px-10 lg:px-14">
          <div className="mx-auto flex max-w-[900px] flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-[-0.03em]">
                Klar til at ansøge?
              </h2>
              <p className="mt-3 text-sm text-white/75">
                Kontakt os med din erfaring og dit område — vi vender tilbage
                hurtigst muligt.
              </p>
            </div>
            <Link
              href="/kontakt"
              className="inline-flex min-h-11 items-center gap-2 rounded-[4px] bg-white px-5 text-sm font-bold text-[#173c2c] hover:bg-[#f4f1e8]"
            >
              Ansøg som Zenmester
              <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </main>

      <RenzenEditorialFooter />
    </div>
  );
}
