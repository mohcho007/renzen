"use client";

import type { ReactNode } from "react";
import flytStyles from "@/components/flytterengoring/FlytBookingWizard.module.css";
import styles from "./BoligserviceOptions.module.css";

export function OptionGrid({ children }: { children: ReactNode }) {
  return <div className={flytStyles.optionGrid}>{children}</div>;
}

type OptionButtonProps = {
  selected: boolean;
  onClick: () => void;
  label: ReactNode;
  sub?: string;
  "aria-pressed"?: boolean;
};

export function OptionButton({
  selected,
  onClick,
  label,
  sub,
  "aria-pressed": ariaPressed,
}: OptionButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={ariaPressed}
      className={`${flytStyles.optionBtn} ${selected ? flytStyles.optionBtnSelected : ""} ${sub ? styles.hasSub : ""}`}
      onClick={onClick}
    >
      {sub ? (
        <>
          <span className={styles.title}>{label}</span>
          <span className={styles.sub}>{sub}</span>
        </>
      ) : (
        label
      )}
    </button>
  );
}

export function ToggleOptionGrid({ children }: { children: ReactNode }) {
  return <div className={flytStyles.extrasGrid}>{children}</div>;
}

type ToggleOptionButtonProps = {
  selected: boolean;
  onClick: () => void;
  label: ReactNode;
  "aria-pressed"?: boolean;
};

export function ToggleOptionButton({
  selected,
  onClick,
  label,
  "aria-pressed": ariaPressed,
}: ToggleOptionButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={ariaPressed ?? selected}
      className={`${flytStyles.extraPill} ${selected ? flytStyles.extraPillSelected : ""}`}
      onClick={onClick}
    >
      <span className={flytStyles.extraName}>{label}</span>
    </button>
  );
}
