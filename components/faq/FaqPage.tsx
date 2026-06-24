"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, Search } from "lucide-react";
import {
  RenzenEditorialFooter,
  RenzenEditorialHeader,
} from "@/components/site/RenzenEditorialChrome";
import { siteConfig } from "@/lib/siteConfig";
import type { FaqCategory, FaqEntry } from "@/data/faqPageContent";

type FaqPageProps = {
  categories: FaqCategory[];
};

function matchesQuery(entry: FaqEntry, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return (
    entry.question.toLowerCase().includes(normalized) ||
    entry.answer.toLowerCase().includes(normalized)
  );
}

export function FaqPage({ categories }: FaqPageProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | "all">("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const filteredCategories = useMemo(() => {
    return categories
      .map((category) => ({
        ...category,
        items: category.items.filter((item) => matchesQuery(item, query)),
      }))
      .filter(
        (category) =>
          (activeCategory === "all" || category.id === activeCategory) &&
          category.items.length > 0,
      );
  }, [categories, query, activeCategory]);

  const totalMatches = filteredCategories.reduce(
    (sum, category) => sum + category.items.length,
    0,
  );

  return (
    <div className="min-h-screen bg-[#fbfaf5] text-[#203129]">
      <RenzenEditorialHeader />

      <main>
        <section className="border-b border-[#dfe2da] bg-[#dfe9dc] px-6 py-16 sm:px-10 sm:py-20 lg:px-14">
          <div className="mx-auto max-w-[900px]">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#41614f]">
              Ofte stillede spørgsmål
            </p>
            <h1 className="mt-5 font-display text-[40px] font-semibold leading-[1.02] tracking-[-0.04em] text-[#173c2c] sm:text-[52px]">
              Svar på det vigtigste
            </h1>
            <p className="mt-5 max-w-[640px] text-base font-medium leading-7 text-[#536159] sm:text-lg">
              Find svar om priser, booking, forsikring, Zenmestre og alle vores
              services — fra privat rengøring til erhverv og Renzen Klub.
            </p>

            <label className="relative mt-8 block max-w-[560px]">
              <span className="sr-only">Søg i FAQ</span>
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7a72]"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Søg efter spørgsmål eller emne..."
                className="w-full rounded-[4px] border border-[#c5cfc0] bg-white py-3.5 pl-11 pr-4 text-sm font-medium text-[#203129] outline-none ring-[#173c2c] transition-shadow placeholder:text-[#8a968f] focus:ring-2"
              />
            </label>
          </div>
        </section>

        <section className="px-6 py-10 sm:px-10 lg:px-14">
          <div className="mx-auto flex max-w-[1100px] flex-col gap-10 lg:flex-row">
            <aside className="lg:w-[240px] lg:shrink-0">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6b7a72]">
                Kategorier
              </p>
              <div className="mt-4 flex flex-wrap gap-2 lg:flex-col lg:gap-1">
                <button
                  type="button"
                  onClick={() => setActiveCategory("all")}
                  className={`rounded-[4px] px-3 py-2 text-left text-sm font-semibold transition-colors ${
                    activeCategory === "all"
                      ? "bg-[#173c2c] text-white"
                      : "text-[#536159] hover:bg-[#eef0ea]"
                  }`}
                >
                  Alle emner
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setActiveCategory(category.id)}
                    className={`rounded-[4px] px-3 py-2 text-left text-sm font-semibold transition-colors ${
                      activeCategory === category.id
                        ? "bg-[#173c2c] text-white"
                        : "text-[#536159] hover:bg-[#eef0ea]"
                    }`}
                  >
                    {category.title}
                  </button>
                ))}
              </div>
            </aside>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[#6b7a72]">
                {totalMatches}{" "}
                {totalMatches === 1 ? "svar fundet" : "svar fundet"}
              </p>

              {filteredCategories.length === 0 ? (
                <div className="mt-8 rounded-[4px] border border-[#dfe2da] bg-white p-8">
                  <p className="font-display text-xl font-semibold text-[#173c2c]">
                    Ingen resultater
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[#6b7a72]">
                    Prøv et andet søgeord, eller kontakt os — vi hjælper gerne.
                  </p>
                  <Link
                    href="/kontakt"
                    className="mt-5 inline-flex text-sm font-bold text-[#173c2c] underline underline-offset-4"
                  >
                    Kontakt os
                  </Link>
                </div>
              ) : (
                <div className="mt-6 space-y-12">
                  {filteredCategories.map((category) => (
                    <div key={category.id} id={category.id}>
                      <h2 className="font-display text-2xl font-semibold tracking-[-0.02em] text-[#173c2c]">
                        {category.title}
                      </h2>
                      <p className="mt-2 max-w-[640px] text-sm leading-relaxed text-[#6b7a72]">
                        {category.description}
                      </p>

                      <div className="mt-5 divide-y divide-[#e2e4de] border border-[#e2e4de] bg-white">
                        {category.items.map((item) => {
                          const isOpen = openId === item.id;

                          return (
                            <div key={item.id} id={item.id}>
                              <button
                                type="button"
                                aria-expanded={isOpen}
                                aria-controls={`${item.id}-panel`}
                                onClick={() =>
                                  setOpenId(isOpen ? null : item.id)
                                }
                                className="flex w-full items-start justify-between gap-4 px-5 py-5 text-left transition-colors hover:bg-[#fafaf7]"
                              >
                                <span className="font-display text-base font-semibold leading-snug text-[#203129] sm:text-[17px]">
                                  {item.question}
                                </span>
                                <ChevronDown
                                  size={18}
                                  className={`mt-0.5 shrink-0 text-[#6b7a72] transition-transform ${
                                    isOpen ? "rotate-180" : ""
                                  }`}
                                  aria-hidden="true"
                                />
                              </button>
                              <div
                                id={`${item.id}-panel`}
                                role="region"
                                className={`px-5 pb-5 text-sm leading-relaxed text-[#536159] ${
                                  isOpen ? "block" : "hidden"
                                }`}
                              >
                                {item.answer}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="border-t border-[#dfe2da] bg-[#eef2eb] px-6 py-14 sm:px-10 lg:px-14">
          <div className="mx-auto flex max-w-[900px] flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-2xl font-semibold text-[#173c2c]">
                Fandt du ikke svar?
              </h2>
              <p className="mt-2 text-sm text-[#536159]">
                Ring eller skriv — vi sidder klar på hverdage 08:00–17:00.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={`tel:+45${siteConfig.phone.replace(/\s/g, "")}`}
                className="inline-flex min-h-11 items-center rounded-[4px] bg-[#173c2c] px-5 text-sm font-bold text-white hover:bg-[#0f2d20]"
              >
                Ring {siteConfig.phone}
              </a>
              <Link
                href="/kontakt"
                className="inline-flex min-h-11 items-center rounded-[4px] border border-[#173c2c] px-5 text-sm font-bold text-[#173c2c] hover:bg-white"
              >
                Kontakt os
              </Link>
            </div>
          </div>
        </section>
      </main>

      <RenzenEditorialFooter />
    </div>
  );
}
