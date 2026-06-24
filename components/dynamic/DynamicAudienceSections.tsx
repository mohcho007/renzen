"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/dynamic/Reveal";
import type { DynamicAudienceContent } from "@/lib/audienceContent";

interface DynamicAudienceSectionsProps {
  content: DynamicAudienceContent;
  onPrimaryClick: () => void;
  onSecondaryClick: () => void;
}

export function DynamicAudienceSections({
  content,
  onPrimaryClick,
  onSecondaryClick,
}: DynamicAudienceSectionsProps) {
  const clickHandlers = [onPrimaryClick, onSecondaryClick];

  return (
    <>
      {content.blocks.map((block, index) => {
        const isReversed = index % 2 === 1;
        const image =
          index === 0
            ? {
                src: "/renzen-rengøring-privat.png",
                alt: "Privat rengøringshjælp i det private hjem",
                className: "object-contain",
              }
            : {
                src: "/renzen-rengøring-erhverv.png",
                alt: "Professionel erhvervsrengøring på kontoret",
                className: "object-cover object-top",
              };

        return (
          <section
            key={`${block.eyebrow}:${block.title}`}
            className="w-full bg-white py-16 sm:py-20 relative z-20"
          >
            <div className="max-w-[1300px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <Reveal
                className={
                  isReversed
                    ? "flex flex-col gap-6 text-left order-1 md:order-2"
                    : "flex flex-col gap-6 text-left"
                }
              >
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#3B7965] bg-[#3B7965]/10 px-3 py-1 rounded-full w-fit">
                  {block.eyebrow}
                </span>
                <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-blue tracking-tight leading-[1.2]">
                  {block.title}
                </h2>
                <p className="text-zinc-650 font-medium text-base leading-relaxed">
                  {block.description}
                </p>
                <div className="flex flex-col gap-3">
                  {block.benefits.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2.5 text-zinc-700 text-sm font-semibold"
                    >
                      <span className="w-5 h-5 bg-[#3b7965]/10 text-[#3b7965] flex items-center justify-center rounded-md text-xs font-bold shrink-0">
                        ✓
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={clickHandlers[index]}
                  className="mt-4 w-fit bg-[#3B7965] hover:bg-emerald-800 text-white font-display font-bold h-12 px-8 rounded-xl text-[15px] flex items-center justify-center gap-2 shadow-md transition-all scale-100 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <span>{block.ctaLabel}</span>
                  <ArrowRight size={18} />
                </button>
              </Reveal>

              <Reveal
                className={
                  isReversed
                    ? "w-full flex justify-center order-2 md:order-1"
                    : "w-full flex justify-center"
                }
              >
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className={image.className}
                    sizes="(max-width: 767px) 100vw, 500px"
                  />
                </div>
              </Reveal>
            </div>
          </section>
        );
      })}
    </>
  );
}
