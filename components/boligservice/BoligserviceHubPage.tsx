"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  RenzenEditorialFooter,
  RenzenEditorialHeader,
} from "@/components/site/RenzenEditorialChrome";
import { boligserviceHubIntro, boligserviceHubItems, boligserviceInquiryPath } from "@/components/boligservice/boligserviceContent";
import { ZEN_CREDIT_MONTHLY_KR } from "@/data/pricing";
import styles from "@/components/site/RenzenEditorial.module.css";

export function BoligserviceHubPage() {
  return (
    <div className="min-h-screen bg-[#fbfaf5] text-[#203129]">
      <RenzenEditorialHeader />

      <main>
        <section className="relative overflow-hidden bg-[#cfdccf]">
          <div className="mx-auto grid max-w-[1380px] gap-10 px-6 py-20 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:py-28">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#52665b]">
                {boligserviceHubIntro.eyebrow}
              </p>
              <h1 className="mt-5 font-display text-[42px] font-semibold leading-[0.98] tracking-[-0.05em] text-[#173c2c] sm:text-[58px]">
                {boligserviceHubIntro.title}
              </h1>
              <p className="mt-7 max-w-lg text-base font-medium leading-7 text-[#536159] sm:text-lg">
                {boligserviceHubIntro.description}
              </p>
              <Link
                href={boligserviceInquiryPath(boligserviceHubItems[0].slug)}
                className="mt-10 inline-flex min-h-12 items-center gap-2 rounded-[4px] bg-[#173c2c] px-6 text-sm font-bold text-white transition-colors hover:bg-[#0f2d20]"
              >
                Få et uforpligtende tilbud
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {boligserviceHubItems.map((item) => (
                <Link
                  key={item.slug}
                  href={`/${item.slug}/`}
                  className={`${styles.megaMenuLink} block min-h-0 rounded-none border border-[#bdccbd] bg-[#fbfaf5]`}
                >
                  <span className="block font-display text-xl font-semibold leading-tight tracking-[-0.02em] text-[#203129]">
                    {item.label}
                  </span>
                  <span className="mt-2 block text-[13px] leading-5 text-[#69746e]">
                    {item.description}
                  </span>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#173c2c]">
                    Læs mere
                    <ArrowRight size={14} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-[#dfe2da] bg-[#173c2c] px-6 py-16 text-[#f6f2e8] sm:px-8">
          <div className="mx-auto flex max-w-[1180px] flex-col justify-between gap-8 sm:flex-row sm:items-end">
            <div>
              <h2 className="max-w-xl font-display text-3xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-4xl">
                Zen-kreditter kan bruges på boligservice
              </h2>
              <p className="mt-4 max-w-lg text-sm font-medium leading-6 text-[#d8e0d8]">
                Som medlem af Renzen Klub får du {ZEN_CREDIT_MONTHLY_KR} kr. i kreditter hver måned
                til opgaver i og omkring hjemmet.
              </p>
            </div>
            <Link
              href="/klub/"
              className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-[3px] border border-white/30 px-6 text-sm font-bold text-white transition-colors hover:border-transparent hover:bg-[#f1e9d8] hover:text-[#173c2c]"
            >
              Se Renzen Klub
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-[1180px] px-6 py-20 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="relative aspect-[4/3] overflow-hidden bg-[#e8e6df]">
              <Image
                src="/services/handyman.webp"
                alt="Boligservice udført af en Zenmester"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#55705f]">
                Kvalitetssikret hjælp
              </p>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.04em] text-[#173c2c] sm:text-4xl">
                Én kontakt til det praktiske i hjemmet
              </h2>
              <p className="mt-5 text-sm font-medium leading-6 text-[#69746c]">
                Alle Zenmestre er verificerede og forsikrede. Du får et
                uforpligtende tilbud inden for 24 timer. Du bestemmer selv,
                om du vil gå videre.
              </p>
              <Link
                href={boligserviceInquiryPath(boligserviceHubItems[0].slug)}
                className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#173c2c]"
              >
                Få et uforpligtende tilbud
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <RenzenEditorialFooter />
    </div>
  );
}
