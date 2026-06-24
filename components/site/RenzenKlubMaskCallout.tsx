import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { INTRO_CLEANING_FROM_KR, ZEN_CREDIT_MONTHLY_KR } from "@/data/pricing";
import styles from "@/components/site/RenzenKlubMaskCallout.module.css";

type RenzenKlubMaskCalloutProps = {
  className?: string;
  variant?: "intro" | "zenCredit";
  serviceLine?: string;
};

export function RenzenKlubMaskCallout({
  className,
  variant = "intro",
  serviceLine,
}: RenzenKlubMaskCalloutProps = {}) {
  const isZenCredit = variant === "zenCredit";
  const headline = isZenCredit
    ? `Få ${ZEN_CREDIT_MONTHLY_KR} kr.`
    : `Fra ${INTRO_CLEANING_FROM_KR} kr.`;
  const subtext = isZenCredit ? serviceLine : "for første rengøring";
  const ariaLabel = isZenCredit
    ? `Renzen Klub: ${headline} ${serviceLine ?? ""}`
    : "Renzen Klub intro";
  const ctaAriaLabel = isZenCredit
    ? `Se tilbud: ${ZEN_CREDIT_MONTHLY_KR} kr. i Zen-kreditter med Renzen Klub`
    : `Se introtilbud: første rengøring fra ${INTRO_CLEANING_FROM_KR} kr.`;

  return (
    <div
      className={className ? `${styles.klubMask} ${className}` : styles.klubMask}
      aria-label={ariaLabel}
    >
      <div className={styles.klubMaskContent}>
        <span className={styles.klubMaskLabel}>Renzen Klub intro</span>
        <strong className={styles.klubMaskPrice}>{headline}</strong>
        {subtext ? (
          <span className={styles.klubMaskSubtext}>{subtext}</span>
        ) : null}
        <Link
          href="/klub/"
          className={styles.klubMaskCta}
          aria-label={ctaAriaLabel}
        >
          Se tilbuddet
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

export { styles as renzenKlubMaskStyles };
