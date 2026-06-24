"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface DynamicFaqSectionProps {
  faqs: ReadonlyArray<{ q: string; a: string }>;
}

export function DynamicFaqSection({ faqs }: DynamicFaqSectionProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="w-full bg-white py-16 sm:py-20 relative z-20"
    >
      <div className="max-w-[850px] mx-auto px-6">
        <div className="text-center mb-16 flex flex-col gap-3">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#192251]">
            Ofte stillede spørgsmål
          </h2>
          <p className="text-zinc-500 font-semibold text-base">
            Har du spørgsmål? Her er svar på de mest almindelige spørgsmål.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            const panelId = `faq-panel-${index}`;
            const triggerId = `faq-trigger-${index}`;

            return (
              <div
                key={faq.q}
                className="border border-stone-200 rounded-xl overflow-hidden transition-all duration-200"
              >
                <button
                  id={triggerId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() =>
                    setOpenFaq((current) =>
                      current === index ? null : index,
                    )
                  }
                  className="w-full flex items-center justify-between px-6 py-5 text-left bg-stone-50/50 hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  <span className="font-display font-bold text-[#192251] text-sm sm:text-base pr-4">
                    {faq.q}
                  </span>
                  <span className="text-[#3B7965] shrink-0" aria-hidden="true">
                    {isOpen ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </span>
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  className={`px-6 py-5 bg-white border-t border-stone-100 text-zinc-655 font-medium text-sm leading-relaxed ${
                    isOpen ? "block" : "hidden"
                  }`}
                >
                  {faq.a}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
