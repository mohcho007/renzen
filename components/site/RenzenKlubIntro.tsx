import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { KlubMembershipBadge } from "@/components/ui/klub-membership-badge";
import {
  KLUB_ANNUAL_KR,
  KLUB_SAVINGS_EXAMPLE_ANNUAL_KR,
  KLUB_SAVINGS_EXAMPLE_FIRST_YEAR_KR,
  KLUB_SAVINGS_EXAMPLE_SQM,
  ZEN_CREDIT_ANNUAL_KR,
  ZEN_CREDIT_MONTHLY_KR,
} from "@/data/pricing";

const klubBenefits = [
  { label: "Op til 20% medlemsrabat" },
  {
    label: `${ZEN_CREDIT_ANNUAL_KR.toLocaleString("da-DK")} kr. i Zenkreditter om året`,
  },
  { label: "Fast Zenmester" },
  {
    label: `Årsmedlemskab: ${KLUB_ANNUAL_KR.toLocaleString("da-DK")} kr.`,
    sublabel: "Betales én gang årligt.",
  },
] as const;

type RenzenKlubPromoSectionProps = {
  description?: string;
};

export function RenzenKlubPromoSection({
  description = "Med Renzen Klub får du lavere priser på fast rengøring og optjener Zenkreditter til ekstra services i hjemmet.",
}: RenzenKlubPromoSectionProps = {}) {
  return (
    <section className="bg-[#fbfaf5] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-[1340px]">
        <div className="mb-8 max-w-3xl sm:mb-10">
          <h2 className="font-display text-4xl font-bold leading-[1.02] tracking-[-0.04em] text-[#173c2c] sm:text-5xl lg:text-6xl">
            Spar ca. {KLUB_SAVINGS_EXAMPLE_FIRST_YEAR_KR.toLocaleString("da-DK")}{" "}
            kr. første år på din rengøring
          </h2>
          <p className="mt-4 max-w-2xl text-sm font-medium leading-6 text-[#52625a] sm:text-base sm:leading-7">
            En bolig på {KLUB_SAVINGS_EXAMPLE_SQM} m² med rengøring hver uge
            sparer ca. {KLUB_SAVINGS_EXAMPLE_ANNUAL_KR.toLocaleString("da-DK")}{" "}
            kr. om året med medlemspris. Som nyt medlem får du også{" "}
            {ZEN_CREDIT_MONTHLY_KR.toLocaleString("da-DK")} kr. i velkomstkredit
            på din første rengøring.
          </p>
        </div>

        <div className="relative grid overflow-hidden rounded-[30px] bg-[#dfe9dc] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="px-7 py-14 sm:px-12 sm:py-16 lg:px-16 lg:py-20">
            <span className="inline-flex rounded-full bg-[#173c2c] px-4 py-2 text-xs font-bold text-white">
              Renzen Klub
            </span>
            <h2 className="mt-6 max-w-2xl font-display text-4xl font-bold leading-[1.02] tracking-[-0.04em] text-[#173c2c] sm:text-5xl">
              Få mere ud af din rengøring – hele året
            </h2>
            <p className="mt-5 max-w-xl text-base font-medium leading-7 text-[#52625a]">
              {description}
            </p>
            <p className="mt-8 text-sm font-bold text-[#27362f]">Du får:</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {klubBenefits.map((benefit) => (
                <span
                  key={benefit.label}
                  className="flex items-start gap-2 text-sm font-bold text-[#27362f]"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[#2f7558]">
                    <Check size={13} />
                  </span>
                  <span>
                    {benefit.label}
                    {"sublabel" in benefit && benefit.sublabel ? (
                      <span className="mt-1 block text-xs font-medium text-[#52625a]">
                        {benefit.sublabel}
                      </span>
                    ) : null}
                  </span>
                </span>
              ))}
            </div>
            <Link
              href="/klub/"
              className="mt-9 inline-flex min-h-13 items-center gap-2 rounded-full bg-[#17251f] px-7 font-display text-sm font-bold text-white transition-colors hover:bg-black"
            >
              Start med introtilbuddet
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="relative flex min-h-[380px] items-center justify-center overflow-hidden bg-[#dfe9dc] p-8">
            <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-[#f5d679]/70 lg:-bottom-auto lg:-top-24" />
            <KlubMembershipBadge />
          </div>
        </div>
      </div>
    </section>
  );
}
