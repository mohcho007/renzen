"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/dynamic/Reveal";
import type { CustomerType } from "@/components/dynamic/quoteConfig";

export function DynamicFinalCta({
  activeTab,
  selectedService,
  postalCode,
}: {
  activeTab: CustomerType;
  selectedService: string;
  postalCode: string;
}) {
  const postalMatch = postalCode.match(/\b\d{4}\b/);
  const postalParam = postalMatch ? `&postalCode=${postalMatch[0]}` : "";

  return (
    <div className="px-0 sm:px-5 w-full my-6 sm:my-8 lg:my-16">
      <section className="py-16 sm:py-20 bg-gradient-to-br from-[#192251] via-[#111943] to-[#090d25] text-white rounded-none sm:rounded-[18px] border-y sm:border border-blue-400/20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[45%] h-[60%] rounded-full bg-blue-500/15 blur-[100px] animate-blob" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[45%] h-[60%] rounded-full bg-emerald-500/10 blur-[100px] animate-blob" />
        </div>
        <div className="absolute inset-0 bg-emerald-950/10 pointer-events-none z-0" />
        <div className="absolute left-0 top-0 w-80 h-80 pointer-events-none z-0 opacity-[0.2] select-none">
          <Image
            src="/shapes/structure-section-line1.svg"
            fill
            sizes="320px"
            className="object-contain object-left-top"
            alt=""
          />
        </div>
        <div className="absolute right-0 bottom-0 w-80 h-80 pointer-events-none z-0 opacity-[0.1] select-none">
          <Image
            src="/shapes/hero-vector.svg"
            fill
            sizes="320px"
            className="object-contain object-right-bottom"
            alt=""
          />
        </div>
        <Reveal className="max-w-4xl mx-auto px-6 text-center relative z-10 flex flex-col gap-8 items-center">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl leading-tight tracking-tight">
            Klar til at spare tid og penge?
          </h2>
          <p className="text-lg text-white/80 max-w-xl font-medium leading-relaxed">
            Det tager under 1 minut at indsende din forespørgsel. Få
            uforpligtende priser fra verificerede firmaer i dag.
          </p>
          <a
            href={`https://app.renbud.dk/hent-tilbud?type=${activeTab}&service=${selectedService}${postalParam}`}
            className="bg-primary hover:bg-emerald-800 text-white font-display font-bold h-14 px-10 rounded-full text-[17px] flex items-center justify-center gap-2 shadow-lg transition-all scale-100 hover:scale-[1.02] active:scale-[0.98] btn-shimmer-container"
          >
            <span>Få 3 gratis tilbud</span>
            <ArrowRight size={20} />
          </a>
          <span className="text-sm text-white/60 font-semibold">
            ✓ 100% uforpligtende · Ingen skjulte gebyrer
          </span>
        </Reveal>
      </section>
    </div>
  );
}
