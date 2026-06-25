"use client";

import { X } from "lucide-react";
import styles from "./WizardExitButton.module.css";

type WizardExitButtonProps = {
  onClick: () => void;
  ariaLabel?: string;
};

export function WizardExitButton({
  onClick,
  ariaLabel = "Luk",
}: WizardExitButtonProps) {
  return (
    <button
      type="button"
      className={styles.exitBtn}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <X size={14} strokeWidth={2.5} aria-hidden="true" />
    </button>
  );
}

type WizardStepMetaProps = {
  current: number;
  total: number;
  onExit: () => void;
  exitAriaLabel?: string;
};

export function WizardStepMeta({
  current,
  total,
  onExit,
  exitAriaLabel,
}: WizardStepMetaProps) {
  return (
    <div className={styles.stepMetaGroup}>
      <span className={styles.stepMeta}>
        {current} / {total}
      </span>
      <WizardExitButton onClick={onExit} ariaLabel={exitAriaLabel} />
    </div>
  );
}
