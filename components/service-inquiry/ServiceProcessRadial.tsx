"use client";

import Image from "next/image";
import {
  CalendarCheck,
  ClipboardCheck,
  Clock,
  FileCheck,
  FileText,
  Home,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";
import type {
  ProcessRadialConfig,
  ProcessRadialLabelAnchor,
  ProcessRadialStep,
} from "@/components/service-inquiry/serviceInquiryContent";
import styles from "@/components/service-inquiry/ServiceProcessRadial.module.css";

const ICONS: Record<ProcessRadialConfig["steps"][number]["icon"], LucideIcon> = {
  booking: CalendarCheck,
  coordination: Users,
  inspection: ClipboardCheck,
  moveOut: ClipboardCheck,
  moveIn: Home,
  documentation: FileText,
  report: FileCheck,
  renovation: Wrench,
  followup: Clock,
};

const RADIAL_SIZE = 520;
const RADIAL_CENTER = RADIAL_SIZE / 2;
/** Matches .hub width/height (6.5rem → 104px at 16px root). */
const HUB_OUTER_RADIUS = 52;
const RING_RADIUS = 178;
const LABEL_RADIUS = 228;
const ANGLE_OFFSET = -90;
const ICON_SIZE_PX = 52;
const ICON_HALF = ICON_SIZE_PX / 2;
const LABEL_GAP_PX = 10;

type ServiceProcessRadialProps = {
  config: ProcessRadialConfig;
};

function polarToCartesian(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: RADIAL_CENTER + radius * Math.cos(rad),
    y: RADIAL_CENTER + radius * Math.sin(rad),
  };
}

function toPercent(value: number) {
  return `${(value / RADIAL_SIZE) * 100}%`;
}

function stepAngle(index: number, stepCount: number) {
  return (360 / stepCount) * index + ANGLE_OFFSET;
}

function spokeEndpoints(angleDeg: number) {
  const inner = polarToCartesian(angleDeg, HUB_OUTER_RADIUS);
  const outer = polarToCartesian(angleDeg, RING_RADIUS - ICON_HALF);
  return { x1: inner.x, y1: inner.y, x2: outer.x, y2: outer.y };
}

function radialLabelStyle(angleDeg: number) {
  const normalized = ((angleDeg % 360) + 360) % 360;

  if (normalized >= 337.5 || normalized < 22.5) {
    return { transform: "translate(0, -50%)", textAlign: "left" as const };
  }
  if (normalized < 67.5) {
    return { transform: "translate(0, 0)", textAlign: "left" as const };
  }
  if (normalized < 112.5) {
    return { transform: "translate(-50%, 0)", textAlign: "center" as const };
  }
  if (normalized < 157.5) {
    return { transform: "translate(-100%, 0)", textAlign: "right" as const };
  }
  if (normalized < 202.5) {
    return { transform: "translate(-100%, -50%)", textAlign: "right" as const };
  }
  if (normalized < 247.5) {
    return { transform: "translate(-100%, -100%)", textAlign: "right" as const };
  }
  if (normalized < 292.5) {
    return { transform: "translate(-50%, -100%)", textAlign: "center" as const };
  }
  return { transform: "translate(0, -100%)", textAlign: "left" as const };
}

function labelPlacement(
  step: ProcessRadialStep,
  angleDeg: number,
  iconPos: { x: number; y: number },
  labelPos: { x: number; y: number },
) {
  const anchor: ProcessRadialLabelAnchor = step.labelAnchor ?? "radial";
  const offsetX = step.labelOffset?.x ?? 0;
  const offsetY = step.labelOffset?.y ?? 0;
  const radialExtra = step.labelOffset?.radial ?? 0;

  if (anchor === "radial") {
    const rad = (angleDeg * Math.PI) / 180;
    const dist = ICON_HALF + LABEL_GAP_PX + radialExtra;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const baseX = iconPos.x + dist * cos + offsetX;
    const baseY = iconPos.y + dist * sin + offsetY;
    const radialStyle = radialLabelStyle(angleDeg);

    return {
      left: toPercent(baseX),
      top: toPercent(baseY),
      transform: radialStyle.transform,
      textAlign: radialStyle.textAlign,
    };
  }

  if (anchor === "center") {
    return {
      left: toPercent(labelPos.x + offsetX),
      top: toPercent(labelPos.y + offsetY),
      transform: "translate(-50%, -50%)",
      textAlign: "center" as const,
    };
  }

  const base = { x: iconPos.x + offsetX, y: iconPos.y + offsetY };

  switch (anchor) {
    case "right":
      return {
        left: toPercent(base.x + ICON_HALF + LABEL_GAP_PX),
        top: toPercent(base.y),
        transform: "translate(0, -50%)",
        textAlign: "left" as const,
      };
    case "left":
      return {
        left: toPercent(base.x - ICON_HALF - LABEL_GAP_PX),
        top: toPercent(base.y),
        transform: "translate(-100%, -50%)",
        textAlign: "right" as const,
      };
    case "top":
      return {
        left: toPercent(base.x),
        top: toPercent(base.y - ICON_HALF - LABEL_GAP_PX),
        transform: "translate(-50%, -100%)",
        textAlign: "center" as const,
      };
    case "bottom":
      return {
        left: toPercent(base.x),
        top: toPercent(base.y + ICON_HALF + LABEL_GAP_PX),
        transform: "translate(-50%, 0)",
        textAlign: "center" as const,
      };
  }
}

export function ServiceProcessRadial({ config }: ServiceProcessRadialProps) {
  const stepCount = config.steps.length;

  return (
    <section className={styles.section} aria-labelledby="process-radial-title">
      <div className={styles.inner}>
        <div className={styles.grid}>
          <header className={styles.copy}>
            {config.eyebrow ? (
              <p className={styles.eyebrow}>{config.eyebrow}</p>
            ) : null}
            <h2 id="process-radial-title" className={styles.title}>
              {config.title}
            </h2>
            {config.body?.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className={styles.body}>
                {paragraph}
              </p>
            ))}
          </header>

          <div className={styles.diagramCol}>
            <div className={styles.radialWrap}>
              <div
                className={styles.radial}
                role="list"
                aria-label={config.title}
              >
                <svg
                  className={styles.ringSvg}
                  viewBox={`0 0 ${RADIAL_SIZE} ${RADIAL_SIZE}`}
                  aria-hidden="true"
                >
                  {config.steps.map((step, index) => {
                    const angle = stepAngle(index, stepCount);
                    const { x1, y1, x2, y2 } = spokeEndpoints(angle);
                    return (
                      <line
                        key={`spoke-${step.label}`}
                        className={styles.spoke}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                      />
                    );
                  })}
                </svg>

                <div className={styles.hub}>
                  <Image
                    src={siteConfig.logo}
                    alt=""
                    width={88}
                    height={32}
                    className={styles.hubLogo}
                    aria-hidden="true"
                  />
                  {config.hubSubtitle ? (
                    <span className={styles.hubSubtitle}>{config.hubSubtitle}</span>
                  ) : null}
                  <span className={styles.srOnly}>Renzen</span>
                </div>

                {config.steps.map((step, index) => {
                  const Icon = ICONS[step.icon];
                  const angle = stepAngle(index, stepCount);
                  const iconPos = polarToCartesian(angle, RING_RADIUS);
                  const labelPos = polarToCartesian(angle, LABEL_RADIUS);
                  const labelStyle = labelPlacement(step, angle, iconPos, labelPos);

                  return (
                    <div
                      key={step.label}
                      className={styles.step}
                      role="listitem"
                    >
                      <span
                        className={styles.nodeIcon}
                        style={{
                          left: toPercent(iconPos.x),
                          top: toPercent(iconPos.y),
                        }}
                        aria-hidden="true"
                      >
                        <Icon size={22} strokeWidth={1.75} />
                      </span>
                      <span
                        className={styles.nodeLabel}
                        style={{
                          left: labelStyle.left,
                          top: labelStyle.top,
                          transform: labelStyle.transform,
                          textAlign: labelStyle.textAlign,
                        }}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <ol className={styles.mobileFlow} aria-label={config.title}>
              <li className={styles.mobileHub} aria-hidden="true">
                <Image
                  src={siteConfig.logo}
                  alt=""
                  width={72}
                  height={26}
                  className={styles.mobileHubLogo}
                />
                {config.hubSubtitle ? (
                  <span className={styles.mobileHubSubtitle}>
                    {config.hubSubtitle}
                  </span>
                ) : null}
              </li>
              {config.steps.map((step) => {
                const Icon = ICONS[step.icon];
                return (
                  <li key={step.label} className={styles.mobileStep}>
                    <span className={styles.mobileStepIcon} aria-hidden="true">
                      <Icon size={22} strokeWidth={1.75} />
                    </span>
                    <span className={styles.mobileStepLabel}>{step.label}</span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
