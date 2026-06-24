"use client";

import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";
import styles from "./ConfirmCard.module.css";

type ConfirmCardProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
  description?: ReactNode;
  className?: string;
  id?: string;
  ariaLabel?: string;
};

export function ConfirmCard({
  checked,
  onChange,
  children,
  description,
  className,
  id,
  ariaLabel,
}: ConfirmCardProps) {
  return (
    <button
      type="button"
      id={id}
      className={[
        styles.confirmCard,
        checked ? styles.confirmCardSelected : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      aria-label={ariaLabel}
    >
      <span className={styles.confirmCardCheck} aria-hidden>
        {checked ? "✓" : ""}
      </span>
      <span className={styles.confirmCardText}>
        <span className={styles.confirmCardLabel}>{children}</span>
        {description ? (
          <span className={styles.confirmCardDescription}>{description}</span>
        ) : null}
      </span>
    </button>
  );
}

type TermsConfirmCardProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children?: ReactNode;
  description?: ReactNode;
  includeClubTerms?: boolean;
  className?: string;
  id?: string;
  ariaLabel?: string;
};

export function TermsLink() {
  return (
    <Link
      href="/handelsbetingelser/"
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event: MouseEvent) => event.stopPropagation()}
    >
      handelsbetingelserne
    </Link>
  );
}

export function TermsConfirmCard({
  checked,
  onChange,
  children,
  description,
  includeClubTerms = false,
  className,
  id,
  ariaLabel,
}: TermsConfirmCardProps) {
  const label =
    children ??
    (includeClubTerms ? (
      <>
        Jeg accepterer <TermsLink /> og medlemsvilkårene for Renzen Klub.
      </>
    ) : (
      <>
        Jeg accepterer <TermsLink />
      </>
    ));

  return (
    <ConfirmCard
      checked={checked}
      onChange={onChange}
      description={description}
      className={className}
      id={id}
      ariaLabel={
        ariaLabel ??
        (includeClubTerms
          ? "Accepter handelsbetingelser og medlemsvilkår"
          : "Accepter handelsbetingelser")
      }
    >
      {label}
    </ConfirmCard>
  );
}
