"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  RenzenEditorialFooter,
  RenzenEditorialHeader,
} from "@/components/site/RenzenEditorialChrome";
import {
  erhvervsrengoringHubIntro,
  erhvervsrengoringHubItems,
  erhvervsrengoringInquiryPath,
} from "@/components/erhvervsrengoring/erhvervsrengoringContent";
import styles from "@/components/site/RenzenEditorial.module.css";

export function ErhvervsrengoringHubPage() {
  return (
    <div className="min-h-screen bg-[#fbfaf5] text-[#203129]">
      <RenzenEditorialHeader />

      <main>
        <section className="relative overflow-hidden bg-[#cfdccf]">
          <div className="mx-auto grid max-w-[1380px] gap-10 px-6 py-20 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:py-28">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#52665b]">
                {erhvervsrengoringHubIntro.eyebrow}
              </p>
              <h1 className="mt-5 font-display text-[42px] font-semibold leading-[0.98] tracking-[-0.05em] text-[#173c2c] sm:text-[58px]">
                {erhvervsrengoringHubIntro.title}
              </h1>
              <p className="mt-7 max-w-lg text-base font-medium leading-7 text-[#536159] sm:text-lg">
                {erhvervsrengoringHubIntro.description}
              </p>
              <Link
                href={erhvervsrengoringInquiryPath()}
                className="mt-10 inline-flex min-h-12 items-center gap-2 rounded-[4px] bg-[#173c2c] px-6 text-sm font-bold text-white transition-colors hover:bg-[#0f2d20]"
              >
                Få et uforpligtende tilbud
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {erhvervsrengoringHubItems.map((item) => (
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

        <section className="mx-auto max-w-[1180px] px-6 py-20 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="relative aspect-[4/3] overflow-hidden bg-[#e8e6df]">
              <Image
                src="/erhvervsrengoering.jpeg"
                alt="Professionel erhvervsrengøring i kontorlokaler"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#55705f]">
                Til virksomheder
              </p>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.04em] text-[#173c2c] sm:text-4xl">
                Fleksibilitet uden for arbejdstiden
              </h2>
              <p className="mt-5 text-sm font-medium leading-6 text-[#69746c]">
                Vi planlægger rengøringen, så den forstyrrer jeres drift mindst
                muligt. Tidlig morgen, aften eller weekend — med et fast team, så
                I altid ved, hvem der har adgang til jeres lokaler.
              </p>
              <Link
                href={erhvervsrengoringInquiryPath()}
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
