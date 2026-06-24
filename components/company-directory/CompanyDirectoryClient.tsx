"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import type { DemoCompany } from "@/lib/demoCompanies";
import { CompanyCard } from "@/components/company-directory/CompanyCard";

export function CompanyDirectoryClient({
  companies,
}: {
  companies: DemoCompany[];
}) {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("Alle byer");
  const [service, setService] = useState("Alle services");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const cities = useMemo(
    () =>
      [...new Set(companies.map((company) => company.city))].sort((a, b) =>
        a.localeCompare(b, "da"),
      ),
    [companies],
  );
  const services = useMemo(
    () =>
      [...new Set(companies.flatMap((company) => company.services))].sort(
        (a, b) => a.localeCompare(b, "da"),
      ),
    [companies],
  );

  const filteredCompanies = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("da");

    return companies
      .filter((company) => {
        const matchesQuery =
          !normalizedQuery ||
          `${company.name} ${company.city} ${company.services.join(" ")}`
            .toLocaleLowerCase("da")
            .includes(normalizedQuery);
        const matchesCity = city === "Alle byer" || company.city === city;
        const matchesService =
          service === "Alle services" || company.services.includes(service);
        const matchesVerified = !verifiedOnly || company.verified;

        return (
          matchesQuery && matchesCity && matchesService && matchesVerified
        );
      })
      .sort((a, b) => {
        if (a.sponsored !== b.sponsored) return a.sponsored ? -1 : 1;
        if (a.verified !== b.verified) return a.verified ? -1 : 1;
        return a.name.localeCompare(b.name, "da");
      });
  }, [city, companies, query, service, verifiedOnly]);

  return (
    <section aria-labelledby="company-list-heading" className="py-14 sm:py-18">
      <div className="mx-auto max-w-[1300px] px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-brand-green">
              Firmaoversigt
            </span>
            <h2
              id="company-list-heading"
              className="mt-2 font-display text-3xl font-extrabold text-brand-blue sm:text-4xl"
            >
              Find firmaet der passer til opgaven
            </h2>
          </div>
          <p className="text-sm font-semibold text-zinc-500">
            {filteredCompanies.length} af {companies.length} demofirmaer
          </p>
        </div>

        <div className="mt-8 grid gap-3 rounded-3xl border border-zinc-200 bg-[#fafafa] p-4 shadow-xs md:grid-cols-[1.5fr_1fr_1fr_auto]">
          <label className="relative">
            <span className="sr-only">Søg efter firma, by eller service</span>
            <Search
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Søg efter firma, by eller service"
              className="h-12 w-full rounded-xl border border-zinc-200 bg-white pl-11 pr-4 text-sm font-semibold text-brand-blue outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/15"
            />
          </label>

          <label>
            <span className="sr-only">Filtrer efter by</span>
            <select
              value={city}
              onChange={(event) => setCity(event.target.value)}
              className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-brand-blue outline-none focus:border-brand-green"
            >
              <option>Alle byer</option>
              {cities.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            <span className="sr-only">Filtrer efter service</span>
            <select
              value={service}
              onChange={(event) => setService(event.target.value)}
              className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-brand-blue outline-none focus:border-brand-green"
            >
              <option>Alle services</option>
              {services.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="flex h-12 cursor-pointer items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-bold text-zinc-600">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(event) => setVerifiedOnly(event.target.checked)}
              className="h-4 w-4 accent-[#3B7965]"
            />
            <SlidersHorizontal size={15} aria-hidden="true" />
            Kun verificerede
          </label>
        </div>

        <div className="mt-5 flex items-center gap-2 text-xs font-medium text-zinc-500">
          <span className="rounded-full bg-brand-blue px-2.5 py-1 font-bold text-white">
            Sponsoreret
          </span>
          Betalte placeringer markeres tydeligt og sorteres før organiske
          resultater.
        </div>

        {filteredCompanies.length > 0 ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredCompanies.map((company) => (
              <CompanyCard key={company.slug} company={company} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-16 text-center">
            <h3 className="font-display text-xl font-bold text-brand-blue">
              Ingen firmaer matcher filtrene
            </h3>
            <p className="mt-2 text-sm text-zinc-500">
              Prøv en anden by, service eller søgning.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
