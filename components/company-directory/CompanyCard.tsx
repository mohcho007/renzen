import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  MapPin,
  Sparkles,
} from "lucide-react";
import {
  getCompanyPrimaryRating,
  type DemoCompany,
} from "@/lib/demoCompanies";
import { CompanyRating } from "@/components/company-directory/CompanyRating";

export function CompanyCard({ company }: { company: DemoCompany }) {
  const primaryRating = getCompanyPrimaryRating(company);

  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.05)] transition-all duration-200 hover:-translate-y-1 hover:border-brand-green/30 hover:shadow-[0_18px_50px_rgba(15,23,42,0.09)]">
      {company.sponsored && (
        <div className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full bg-brand-blue px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
          <Sparkles size={11} aria-hidden="true" />
          Sponsoreret
        </div>
      )}

      <div className="flex items-start gap-4 pr-20">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl font-display text-lg font-black ${company.accentClass}`}
          aria-hidden="true"
        >
          {company.initials}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h2 className="truncate font-display text-xl font-extrabold text-brand-blue">
              {company.name}
            </h2>
            {company.verified && (
              <BadgeCheck
                size={18}
                className="shrink-0 fill-brand-green text-white"
                aria-label="Verificeret profil"
              />
            )}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-zinc-500">
            <MapPin size={13} aria-hidden="true" />
            {company.postalCode} {company.city}
          </div>
        </div>
      </div>

      <p className="mt-5 text-sm font-semibold leading-relaxed text-zinc-700">
        {company.tagline}
      </p>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-500">
        {company.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {company.services.slice(0, 3).map((service) => (
          <span
            key={service}
            className="rounded-full bg-zinc-100 px-3 py-1.5 text-[11px] font-bold text-zinc-600"
          >
            {service}
          </span>
        ))}
        {company.services.length > 3 && (
          <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-[11px] font-bold text-zinc-600">
            +{company.services.length - 3}
          </span>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {primaryRating && <CompanyRating rating={primaryRating} compact />}
        <div className="flex items-center gap-1.5 rounded-xl bg-zinc-50 px-2.5 py-1.5 text-[11px] font-semibold text-zinc-500">
          <Clock3 size={13} aria-hidden="true" />
          {company.responseTime}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-5">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            Profil
          </div>
          <div className="mt-0.5 text-xs font-bold text-brand-green">
            {company.claimed ? company.plan : "Ikke gjort krav på"}
          </div>
        </div>
        <Link
          href={`/rengoeringsfirmaer/${company.slug}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-green px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-emerald-800"
        >
          Se profil
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
