"use client";

import Link from "next/link";
import {
  type MouseEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import {
  KLUB_ANNUAL_KR,
  KLUB_ANNUAL_MONTHLY_EQUIVALENT_KR,
} from "@/data/pricing";

const klubMonthlyLabel = KLUB_ANNUAL_MONTHLY_EQUIVALENT_KR.toLocaleString(
  "da-DK",
  { minimumFractionDigits: 2, maximumFractionDigits: 2 },
);

const klubAnnualLabel = KLUB_ANNUAL_KR.toLocaleString("da-DK");

const overlayViewBox = { width: 430, height: 170 };
const overlayPolygonPoints = `0,0 ${overlayViewBox.width},${overlayViewBox.height} ${overlayViewBox.width},0 0,${overlayViewBox.height}`;

// Premium brushed-silver shimmer (Product Hunt "Golden Kitty" recipe).
// The live PH badge renders saturated wedges at opacity 0.5 under an
// `overlay` blend on a flat #ddd base; the overlay-over-light-gray
// interaction mutes them into a metallic sheen. We keep that structure but
// lean the color hues toward silver (lower saturation, higher lightness) and
// weight the white highlight wedges more heavily so the large card reads as
// brushed metal with only a faint holographic hint rather than a rainbow.
const holographicLayers = [
  { fill: "hsl(350, 55%, 70%)", offset: 0, opacity: 0.16 },
  { fill: "white", offset: 12, opacity: 0.32 },
  { fill: "hsl(45, 55%, 70%)", offset: 24, opacity: 0.16 },
  { fill: "transparent", offset: 36, opacity: 0 },
  { fill: "hsl(150, 42%, 68%)", offset: 48, opacity: 0.14 },
  { fill: "white", offset: 60, opacity: 0.32 },
  { fill: "hsl(210, 52%, 70%)", offset: 72, opacity: 0.16 },
  { fill: "transparent", offset: 84, opacity: 0 },
  { fill: "hsl(275, 42%, 70%)", offset: 96, opacity: 0.14 },
  { fill: "white", offset: 108, opacity: 0.32 },
] as const;

type KlubMembershipBadgeProps = {
  className?: string;
  klubHref?: string;
};

export function KlubMembershipBadge({
  className = "",
  klubHref = "/klub/",
}: KlubMembershipBadgeProps) {
  const uid = useId().replace(/:/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const [firstOverlayPosition, setFirstOverlayPosition] = useState(0);
  const [disableInOutOverlayAnimation, setDisableInOutOverlayAnimation] =
    useState(true);
  const [disableOverlayAnimation, setDisableOverlayAnimation] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const enterTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimeout1 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimeout2 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimeout3 = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () =>
      setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    return () => {
      if (enterTimeout.current) clearTimeout(enterTimeout.current);
      if (leaveTimeout1.current) clearTimeout(leaveTimeout1.current);
      if (leaveTimeout2.current) clearTimeout(leaveTimeout2.current);
      if (leaveTimeout3.current) clearTimeout(leaveTimeout3.current);
    };
  }, []);

  const getFirstOverlayPosition = (clientX: number, clientY: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return 0;

    const xCenter = (rect.left + rect.right) / 2;
    const yCenter = (rect.top + rect.bottom) / 2;

    return (
      (Math.abs(xCenter - clientX) + Math.abs(yCenter - clientY)) / 1.5
    );
  };

  const onMouseEnter = (event: MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;

    if (leaveTimeout1.current) clearTimeout(leaveTimeout1.current);
    if (leaveTimeout2.current) clearTimeout(leaveTimeout2.current);
    if (leaveTimeout3.current) clearTimeout(leaveTimeout3.current);

    setDisableOverlayAnimation(true);
    setDisableInOutOverlayAnimation(false);
    enterTimeout.current = setTimeout(
      () => setDisableInOutOverlayAnimation(true),
      350,
    );

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setFirstOverlayPosition(
          getFirstOverlayPosition(event.clientX, event.clientY),
        );
      });
    });
  };

  const onMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;

    setTimeout(
      () =>
        setFirstOverlayPosition(
          getFirstOverlayPosition(event.clientX, event.clientY),
        ),
      150,
    );
  };

  const onMouseLeave = () => {
    if (prefersReducedMotion) return;

    if (enterTimeout.current) clearTimeout(enterTimeout.current);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setDisableInOutOverlayAnimation(false);
        leaveTimeout1.current = setTimeout(
          () => setFirstOverlayPosition((current) => -current / 4),
          150,
        );
        leaveTimeout2.current = setTimeout(() => setFirstOverlayPosition(0), 300);
        leaveTimeout3.current = setTimeout(() => {
          setDisableOverlayAnimation(false);
          setDisableInOutOverlayAnimation(true);
        }, 500);
      });
    });
  };

  const overlayPosition = prefersReducedMotion ? 0 : firstOverlayPosition;
  const overlayAnimating =
    !prefersReducedMotion && !disableOverlayAnimation;

  const overlayAnimations = holographicLayers
    .map(
      (_, index) => `
    @keyframes klubOverlay${uid}${index + 1} {
      0% { transform: rotate(${index * 10}deg); }
      50% { transform: rotate(${(index + 1) * 10}deg); }
      100% { transform: rotate(${index * 10}deg); }
    }
  `,
    )
    .join("");

  return (
    <div
      ref={ref}
      className={`relative w-full max-w-[430px] -translate-y-[40px] rotate-[-2deg] motion-reduce:translate-y-0 motion-reduce:rotate-0 ${className}`}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <style>{`
        ${overlayAnimations}
        @media (prefers-reduced-motion: reduce) {
          .klub-overlay-${uid} {
            animation: none !important;
          }
        }
      `}</style>

      <div
        className="relative overflow-hidden rounded-[18px] p-5 shadow-[0_24px_55px_rgba(32,70,52,0.2)] ring-1 ring-[#b6b6b2]"
        style={{
          // Brushed-silver base: vertical metal gradient (light → mid → light)
          // so the card reads as polished metal instead of flat grey.
          background:
            "linear-gradient(165deg, #f6f6f3 0%, #e6e6e2 20%, #cfcfca 52%, #dededb 80%, #f1f1ee 100%)",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-[4px] rounded-[14px] border border-[#bbb]"
        />
        {/* Static diagonal sheen — the polished-metal highlight that gives the
            card its premium feel even when motion is disabled. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 rounded-[18px]"
          style={{
            background:
              "linear-gradient(115deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.55) 43%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.5) 57%, rgba(255,255,255,0) 70%)",
            mixBlendMode: "soft-light",
          }}
        />

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
              <p className="mt-0.5 bg-gradient-to-br from-[#3a3f3c] via-[#2f7558] to-[#b8922a] bg-clip-text font-display text-[1.75rem] font-bold leading-tight text-transparent">
                {klubAnnualLabel} kr.
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-[#f3d675] px-2.5 py-0.5 text-[11px] font-bold text-[#17251f]">
              Bedste værdi
            </span>
          </div>

          <div className="mt-3.5 flex items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[#69756f]">Svarer til</p>
              <p className="font-display text-xl font-bold text-[#2f7558]">
                {klubMonthlyLabel} kr./md.
              </p>
            </div>
            <span className="font-display text-3xl text-[#2f7558]">✦</span>
          </div>

          <p className="mt-3.5 text-[11px] font-medium leading-[1.45] text-[#78847e]">
            <span className="text-[#2f7558]">✦</span> Kreditter har
            anvendelsesvilkår og kan ikke udbetales som kontanter.
          </p>
        </div>

        <svg
          aria-hidden
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${overlayViewBox.width} ${overlayViewBox.height}`}
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 z-[2] h-full w-full"
        >
          <defs>
            <filter id={`${uid}-blur`}>
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
            </filter>
            <mask id={`${uid}-mask`}>
              <rect
                width={overlayViewBox.width}
                height={overlayViewBox.height}
                fill="white"
                rx="18"
              />
            </mask>
          </defs>
          <g
            style={{ mixBlendMode: "overlay", opacity: 0.78 }}
            mask={`url(#${uid}-mask)`}
          >
            {holographicLayers.map((layer, index) => (
              <g
                key={layer.offset}
                className={`klub-overlay-${uid}`}
                style={{
                  transform: `rotate(${overlayPosition + layer.offset}deg)`,
                  transformOrigin: "center center",
                  transition: !disableInOutOverlayAnimation
                    ? "transform 200ms ease-out"
                    : "none",
                  animation: overlayAnimating
                    ? `klubOverlay${uid}${index + 1} 5s infinite`
                    : "none",
                  willChange: "transform",
                }}
              >
                <polygon
                  points={overlayPolygonPoints}
                  fill={layer.fill}
                  filter={`url(#${uid}-blur)`}
                  opacity={layer.opacity}
                />
              </g>
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}
