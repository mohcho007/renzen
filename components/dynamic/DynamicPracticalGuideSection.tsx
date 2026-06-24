import type { ReactNode } from "react";

export interface DynamicPracticalGuide {
  title: string;
  disclaimerTitle: string;
  disclaimerText: string;
  checklistTitle: string;
  checklistItems: string[];
  extraTitle: string;
  extraContent: ReactNode;
}

export function DynamicPracticalGuideSection({
  guide,
}: {
  guide: DynamicPracticalGuide;
}) {
  return (
    <div className="px-0 sm:px-5 w-full my-6 sm:my-8">
      <section className="py-16 sm:py-20 bg-white rounded-none sm:rounded-[18px] border-y sm:border border-stone-200/50 relative z-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-12 text-center max-w-2xl mx-auto flex flex-col gap-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#3B7965] bg-[#3B7965]/10 px-3 py-1 rounded-full w-fit mx-auto">
              Forventningsafstemning
            </span>
            <h3 className="font-display font-extrabold text-2xl sm:text-3.5xl text-[#192251]">
              {guide.title}
            </h3>
            <p className="text-zinc-500 font-semibold text-sm">
              Her er hvad du kan forvente af opgavens omfang, krav og
              ansvarsfordeling.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 bg-[#f8fafc] border border-stone-200/80 p-6 sm:p-8 rounded-3xl shadow-xs">
              <h4 className="font-display font-extrabold text-lg sm:text-xl text-[#192251] mb-6 flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-[#3B7965]/10 text-[#3B7965] flex items-center justify-center text-xs font-extrabold">
                  ✓
                </span>
                {guide.checklistTitle}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {guide.checklistItems.map((item) => (
                  <div
                    key={item}
                    className="bg-white border border-stone-200/40 hover:border-[#3B7965]/30 p-4 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.01)] transition-all duration-150 flex gap-3 group"
                  >
                    <span className="w-5 h-5 bg-[#3B7965]/10 text-[#3B7965] flex items-center justify-center rounded-md text-xs font-bold shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                      ✓
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-zinc-700 leading-snug">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-6 w-full">
              <div className="bg-amber-50/50 border border-amber-200/60 p-6 rounded-3xl flex flex-col gap-4">
                <div className="flex items-center gap-2.5 text-amber-850">
                  <span className="w-6 h-6 bg-amber-100 text-amber-800 flex items-center justify-center rounded-lg text-xs font-bold shrink-0">
                    !
                  </span>
                  <h4 className="font-display font-extrabold text-sm sm:text-base">
                    {guide.disclaimerTitle}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-zinc-650 font-medium leading-relaxed">
                  {guide.disclaimerText}
                </p>
              </div>

              <div className="bg-white border border-stone-200/80 p-6 rounded-3xl flex flex-col gap-4 shadow-xs">
                <h4 className="font-display font-extrabold text-sm sm:text-base text-[#192251]">
                  {guide.extraTitle}
                </h4>
                {guide.extraContent}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
