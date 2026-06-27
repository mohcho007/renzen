import Link from "next/link";
import { useId } from "react";
import {
  KLUB_ANNUAL_KR,
  KLUB_ANNUAL_MONTHLY_EQUIVALENT_KR,
} from "@/data/pricing";

const klubMonthlyLabel = KLUB_ANNUAL_MONTHLY_EQUIVALENT_KR.toLocaleString(
  "da-DK",
  { minimumFractionDigits: 2, maximumFractionDigits: 2 },
);

const klubAnnualLabel = KLUB_ANNUAL_KR.toLocaleString("da-DK");

const cardBackground =
  "linear-gradient(145deg, #ececec 0%, #ddd 28%, #c8c8c8 52%, #e5e5e5 78%, #d6d6d6 100%)";

const shimmerLayers = [
  "rgba(255, 255, 255, 0.55)",
  "rgba(230, 230, 230, 0.42)",
  "rgba(243, 214, 117, 0.32)",
  "rgba(189, 204, 189, 0.26)",
  "rgba(47, 117, 88, 0.16)",
  "rgba(255, 255, 255, 0.38)",
];

type KlubMembershipBadgeProps = {
  className?: string;
  klubHref?: string;
  termsHref?: string;
};

export function KlubMembershipBadge({
  className = "",
  klubHref = "/klub/",
  termsHref = "/handelsbetingelser/",
}: KlubMembershipBadgeProps) {
  const uid = useId().replace(/:/g, "");

  const shimmerKeyframes = shimmerLayers
    .map(
      (_, index) => `
    @keyframes klubShimmer${uid}${index} {
      0%, 100% { transform: rotate(${index * 22}deg); }
      50% { transform: rotate(${index * 22 + 14}deg); }
    }
  `,
    )
    .join("");

  return (
    <div
      className={`relative w-full max-w-[430px] -translate-y-[40px] rotate-[-2deg] motion-reduce:translate-y-0 motion-reduce:rotate-0 ${className}`}
    >
      <style>{`
        ${shimmerKeyframes}
        @media (prefers-reduced-motion: reduce) {
          .klub-shimmer-${uid} {
            animation: none !important;
          }
        }
      `}</style>

      <div
        className="relative overflow-hidden rounded-[18px] p-5 shadow-[0_24px_55px_rgba(32,70,52,0.2)] ring-1 ring-[#bbb]"
        style={{ background: cardBackground }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-[4px] rounded-[14px] border border-[#bbb]"
        />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 mix-blend-overlay"
        >
          {shimmerLayers.map((color, index) => (
            <div
              key={color}
              className={`klub-shimmer-${uid} absolute inset-[-50%]`}
              style={{
                transform: `rotate(${index * 22}deg)`,
                transformOrigin: "center center",
                animation: `klubShimmer${uid}${index} 7s ease-in-out infinite`,
                animationDelay: `${index * 0.35}s`,
                willChange: "transform",
              }}
            >
              <div
                className="h-full w-full opacity-45 blur-md"
                style={{
                  background: `linear-gradient(135deg, transparent 40%, ${color} 50%, transparent 60%)`,
                }}
              />
            </div>
          ))}
        </div>

        <div className="relative z-[1]">
          <div className="flex items-start justify-between gap-3 border-b border-[#bbb]/70 pb-3.5">
            <div className="min-w-0">
              <Link
                href={klubHref}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#7b8781] transition-colors hover:text-[#173c2c]"
              >
                <span
                  aria-hidden
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#173c2c] text-xs text-[#f3d675]"
                >
                  ✦
                </span>
                Renzen Klub
              </Link>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-[#7b8781]">
                Årsmedlemskab
              </p>
              <div className="mt-0.5 flex items-end justify-between gap-3">
                <p className="bg-gradient-to-br from-[#3a3f3c] via-[#2f7558] to-[#b8922a] bg-clip-text font-display text-[1.75rem] font-bold leading-tight text-transparent">
                  {klubAnnualLabel} kr.
                </p>
                <span className="font-display text-3xl text-[#2f7558]">✦</span>
              </div>
            </div>
            <span className="shrink-0 rounded-full bg-[#f3d675] px-2.5 py-0.5 text-[11px] font-bold text-[#17251f]">
              Bedste værdi
            </span>
          </div>

          <div className="mt-3.5">
            <p className="text-sm font-semibold text-[#69756f]">Svarer til</p>
            <p className="font-display text-xl font-bold text-[#2f7558]">
              {klubMonthlyLabel} kr./md.
            </p>
          </div>

          <p className="mt-3.5 text-[11px] font-medium leading-[1.45] text-[#78847e]">
            <span className="text-[#2f7558]">✦</span> Kreditter har
            anvendelsesvilkår og kan ikke udbetales som kontanter.{" "}
            <Link
              href={termsHref}
              className="font-semibold text-[#173c2c] underline decoration-[#bdccbd] underline-offset-2 transition-colors hover:text-[#2f7558]"
            >
              Se de fulde medlemsbetingelser.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
