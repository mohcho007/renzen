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

const identityMatrix =
  "1, 0, 0, 0, " +
  "0, 1, 0, 0, " +
  "0, 0, 1, 0, " +
  "0, 0, 0, 1";

const maxRotate = 0.18;
const minRotate = -0.18;
const maxScale = 1;
const minScale = 0.98;

const klubMonthlyLabel = KLUB_ANNUAL_MONTHLY_EQUIVALENT_KR.toLocaleString(
  "da-DK",
  { minimumFractionDigits: 2, maximumFractionDigits: 2 },
);

const klubAnnualLabel = KLUB_ANNUAL_KR.toLocaleString("da-DK");

const overlayColors = [
  "rgba(245, 214, 121, 0.35)",
  "rgba(189, 204, 189, 0.3)",
  "rgba(47, 117, 88, 0.22)",
  "rgba(246, 244, 237, 0.45)",
  "rgba(243, 214, 117, 0.28)",
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
  const ref = useRef<HTMLDivElement>(null);
  const [firstOverlayPosition, setFirstOverlayPosition] = useState(0);
  const [matrix, setMatrix] = useState(identityMatrix);
  const [currentMatrix, setCurrentMatrix] = useState(identityMatrix);
  const [disableInOutOverlayAnimation, setDisableInOutOverlayAnimation] =
    useState(true);
  const [disableOverlayAnimation, setDisableOverlayAnimation] = useState(false);
  const [isTimeoutFinished, setIsTimeoutFinished] = useState(false);
  const enterTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimeout1 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimeout2 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimeout3 = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getDimensions = () => {
    const rect = ref.current?.getBoundingClientRect();
    return {
      left: rect?.left ?? 0,
      right: rect?.right ?? 0,
      top: rect?.top ?? 0,
      bottom: rect?.bottom ?? 0,
    };
  };

  const getMatrix = (clientX: number, clientY: number) => {
    const { left, right, top, bottom } = getDimensions();
    const xCenter = (left + right) / 2;
    const yCenter = (top + bottom) / 2;

    const scale = [
      maxScale -
        ((maxScale - minScale) * Math.abs(xCenter - clientX)) /
          (xCenter - left),
      maxScale -
        ((maxScale - minScale) * Math.abs(yCenter - clientY)) /
          (yCenter - top),
      maxScale -
        ((maxScale - minScale) *
          (Math.abs(xCenter - clientX) + Math.abs(yCenter - clientY))) /
          (xCenter - left + yCenter - top),
    ];

    const rotate = {
      x1:
        0.2 *
        ((yCenter - clientY) / yCenter - (xCenter - clientX) / xCenter),
      x2:
        maxRotate -
        (maxRotate - minRotate) * Math.abs(right - clientX) / (right - left),
      x3: 0,
      y0: 0,
      y2:
        maxRotate -
        (maxRotate - minRotate) * (top - clientY) / (top - bottom),
      y3: 0,
      z0: -(
        maxRotate -
        (maxRotate - minRotate) * Math.abs(right - clientX) / (right - left)
      ),
      z1: 0.15 - (0.15 + 0.45) * ((top - clientY) / (top - bottom)),
      z3: 0,
    };

    return (
      `${scale[0]}, ${rotate.y0}, ${rotate.z0}, 0, ` +
      `${rotate.x1}, ${scale[1]}, ${rotate.z1}, 0, ` +
      `${rotate.x2}, ${rotate.y2}, ${scale[2]}, 0, ` +
      `${rotate.x3}, ${rotate.y3}, ${rotate.z3}, 1`
    );
  };

  const getOppositeMatrix = (
    sourceMatrix: string,
    clientY: number,
    onMouseEnter?: boolean,
  ) => {
    const { top, bottom } = getDimensions();
    const oppositeY = bottom - clientY + top;
    const weakening = onMouseEnter ? 0.7 : 4;
    const multiplier = onMouseEnter ? -1 : 1;

    return sourceMatrix
      .split(", ")
      .map((item, index) => {
        if (index === 2 || index === 4 || index === 8) {
          return (-parseFloat(item) * multiplier) / weakening;
        }
        if (index === 0 || index === 5 || index === 10) {
          return "1";
        }
        if (index === 6) {
          return (
            (multiplier *
              (maxRotate -
                (maxRotate - minRotate) * ((top - oppositeY) / (top - bottom)))) /
            weakening
          );
        }
        if (index === 9) {
          return (
            (maxRotate -
              (maxRotate - minRotate) * ((top - oppositeY) / (top - bottom))) /
            weakening
          );
        }
        return item;
      })
      .join(", ");
  };

  const onMouseEnter = (event: MouseEvent<HTMLDivElement>) => {
    if (leaveTimeout1.current) clearTimeout(leaveTimeout1.current);
    if (leaveTimeout2.current) clearTimeout(leaveTimeout2.current);
    if (leaveTimeout3.current) clearTimeout(leaveTimeout3.current);
    setDisableOverlayAnimation(true);

    const { left, right, top, bottom } = getDimensions();
    const xCenter = (left + right) / 2;
    const yCenter = (top + bottom) / 2;

    setDisableInOutOverlayAnimation(false);
    enterTimeout.current = setTimeout(
      () => setDisableInOutOverlayAnimation(true),
      350,
    );

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setFirstOverlayPosition(
          (Math.abs(xCenter - event.clientX) +
            Math.abs(yCenter - event.clientY)) /
            1.5,
        );
      });
    });

    const nextMatrix = getMatrix(event.clientX, event.clientY);
    const oppositeMatrix = getOppositeMatrix(
      nextMatrix,
      event.clientY,
      true,
    );

    setMatrix(oppositeMatrix);
    setIsTimeoutFinished(false);
    setTimeout(() => setIsTimeoutFinished(true), 200);
  };

  const onMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const { left, right, top, bottom } = getDimensions();
    const xCenter = (left + right) / 2;
    const yCenter = (top + bottom) / 2;

    setTimeout(
      () =>
        setFirstOverlayPosition(
          (Math.abs(xCenter - event.clientX) +
            Math.abs(yCenter - event.clientY)) /
            1.5,
        ),
      150,
    );

    if (isTimeoutFinished) {
      setCurrentMatrix(getMatrix(event.clientX, event.clientY));
    }
  };

  const onMouseLeave = (event: MouseEvent<HTMLDivElement>) => {
    const oppositeMatrix = getOppositeMatrix(matrix, event.clientY);

    if (enterTimeout.current) clearTimeout(enterTimeout.current);

    setCurrentMatrix(oppositeMatrix);
    setTimeout(() => setCurrentMatrix(identityMatrix), 200);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setDisableInOutOverlayAnimation(false);
        leaveTimeout1.current = setTimeout(
          () => setFirstOverlayPosition(-firstOverlayPosition / 4),
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

  useEffect(() => {
    if (isTimeoutFinished) {
      setMatrix(currentMatrix);
    }
  }, [currentMatrix, isTimeoutFinished]);

  useEffect(() => {
    return () => {
      if (enterTimeout.current) clearTimeout(enterTimeout.current);
      if (leaveTimeout1.current) clearTimeout(leaveTimeout1.current);
      if (leaveTimeout2.current) clearTimeout(leaveTimeout2.current);
      if (leaveTimeout3.current) clearTimeout(leaveTimeout3.current);
    };
  }, []);

  const overlayKeyframes = overlayColors
    .map(
      (_, index) => `
    @keyframes klubOverlay${uid}${index + 1} {
      0% { transform: rotate(${index * 18}deg); }
      50% { transform: rotate(${(index + 1) * 18}deg); }
      100% { transform: rotate(${index * 18}deg); }
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
      <style>{overlayKeyframes}</style>
      <div
        className="motion-reduce:transform-none"
        style={{
          transform: `perspective(900px) matrix3d(${matrix})`,
          transformOrigin: "center center",
          transition: "transform 200ms ease-out",
        }}
      >
        <div className="relative overflow-hidden rounded-[18px] bg-[#fffdf9] p-7 shadow-[0_24px_55px_rgba(32,70,52,0.2)] ring-1 ring-[#e5e7e1]/80">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-overlay motion-reduce:hidden"
          >
            {overlayColors.map((color, index) => (
              <div
                key={color}
                className="absolute inset-[-50%]"
                style={{
                  transform: `rotate(${firstOverlayPosition + index * 18}deg)`,
                  transformOrigin: "center center",
                  transition: !disableInOutOverlayAnimation
                    ? "transform 200ms ease-out"
                    : "none",
                  animation: disableOverlayAnimation
                    ? "none"
                    : `klubOverlay${uid}${index + 1} 6s infinite`,
                  willChange: "transform",
                }}
              >
                <div
                  className="h-full w-full opacity-50 blur-md"
                  style={{
                    background: `linear-gradient(135deg, transparent 42%, ${color} 50%, transparent 58%)`,
                  }}
                />
              </div>
            ))}
          </div>

          <div className="relative z-[1]">
            <div className="flex items-start justify-between gap-4 border-b border-[#e5e7e1] pb-5">
              <div className="min-w-0">
                <Link
                  href={klubHref}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#7b8781] transition-colors hover:text-[#173c2c]"
                >
                  <span
                    aria-hidden
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#173c2c] text-sm text-[#f3d675]"
                  >
                    ✦
                  </span>
                  Renzen Klub
                </Link>
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-[#7b8781]">
                  Årsmedlemskab
                </p>
                <p className="mt-1 font-display text-3xl font-bold text-[#17251f]">
                  {klubAnnualLabel} kr.
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-[#f3d675] px-3 py-1 text-xs font-bold text-[#17251f]">
                Bedste værdi
              </span>
            </div>

            <div className="mt-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#69756f]">
                  Svarer til
                </p>
                <p className="font-display text-2xl font-bold text-[#2f7558]">
                  {klubMonthlyLabel} kr./md.
                </p>
              </div>
              <span className="font-display text-4xl text-[#2f7558]">✦</span>
            </div>

            <p className="mt-5 text-xs font-medium leading-5 text-[#78847e]">
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
    </div>
  );
}
