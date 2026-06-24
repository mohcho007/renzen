"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import tfStyles from "@/components/dealside/DealTypeformWizard.module.css";
import flytStyles from "@/components/flytterengoring/FlytBookingWizard.module.css";
import calcStyles from "@/components/flytterengoring/FlytPriceCalculator.module.css";
import {
  buildFlytBookingPath,
  calculateFlytLocalPrice,
  clampFlytSqm,
  FLYT_DEFAULT_STAND,
  FLYT_SQM_DEFAULT,
  FLYT_SQM_MAX,
  FLYT_SQM_MIN,
  FLYT_STANDS,
  formatFlytReceiptKr,
  getFlytStand,
} from "@/lib/flytterengoring";
import { serviceDeduction } from "@/lib/serviceDeduction";

type FlytPriceCalculatorProps = {
  initialSqm?: number;
  initialStand?: number;
};

type WizardStep = 1 | 2 | 3;

function isFlytSqmInputValid(value: string) {
  const parsed = parseInt(value, 10);
  return (
    !Number.isNaN(parsed) &&
    parsed >= FLYT_SQM_MIN &&
    parsed <= FLYT_SQM_MAX
  );
}

export default function FlytPriceCalculator({
  initialSqm = FLYT_SQM_DEFAULT,
  initialStand = FLYT_DEFAULT_STAND,
}: FlytPriceCalculatorProps) {
  const router = useRouter();
  const [step, setStep] = useState<WizardStep>(1);
  const [sqm, setSqm] = useState(clampFlytSqm(initialSqm));
  const [sqmDraft, setSqmDraft] = useState(String(clampFlytSqm(initialSqm)));
  const isSqmValid = isFlytSqmInputValid(sqmDraft);
  const [standLevel, setStandLevel] = useState(
    getFlytStand(initialStand).level,
  );
  const [buttonState, setButtonState] = useState<"initial" | "priced">(
    "initial",
  );

  const stand = useMemo(() => getFlytStand(standLevel), [standLevel]);
  const pricing = useMemo(
    () => calculateFlytLocalPrice(sqm, stand),
    [sqm, stand],
  );

  const resetPriceReveal = () => {
    if (buttonState === "priced") {
      setButtonState("initial");
    }
  };

  const handleSqmInputChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 3);
    setSqmDraft(cleaned);
    const parsed = parseInt(cleaned, 10);
    if (isFlytSqmInputValid(cleaned)) {
      setSqm(parsed);
      resetPriceReveal();
    }
  };

  const handleSqmBlur = () => {
    const parsed = parseInt(sqmDraft, 10);
    const next = clampFlytSqm(Number.isFinite(parsed) ? parsed : sqm);
    setSqm(next);
    setSqmDraft(String(next));
  };

  const handleStandChange = (value: number) => {
    setStandLevel(getFlytStand(value).level);
    resetPriceReveal();
  };

  const goToStep = (next: WizardStep) => {
    setStep(next);
    if (next < 3) {
      resetPriceReveal();
    }
  };

  const handleBookClick = () => {
    if (!isSqmValid) return;

    if (buttonState === "initial") {
      setButtonState("priced");
      return;
    }

    router.push(
      buildFlytBookingPath({
        stand: stand.level,
        sqm,
      }),
    );
  };

  const stepLabels = ["Areal", "Stand", "Pris"] as const;

  return (
    <div className={calcStyles.shell}>
      <header className={calcStyles.wizardHeader}>
        <div className={calcStyles.progressDots} aria-hidden>
          {([1, 2, 3] as const).map((dot) => (
            <span
              key={dot}
              className={`${calcStyles.progressDot} ${step >= dot ? calcStyles.progressDotActive : ""} ${step === dot ? calcStyles.progressDotCurrent : ""}`}
            />
          ))}
        </div>
        <p className={calcStyles.progressLabel}>
          Trin {step} af 3 · {stepLabels[step - 1]}
        </p>
      </header>

      <div className={calcStyles.wizardBody}>
        {step === 1 && (
          <section aria-label="Boligareal">
            <div
              className={`${tfStyles.m2FormField} ${flytStyles.m2FormFieldTight} ${calcStyles.sqmField}`}
            >
              <label className={tfStyles.fieldLabel} htmlFor="flyt-calc-sqm">
                Hvor mange m² skal rengøres?
              </label>
              <div className={tfStyles.m2FormWrap}>
                <input
                  id="flyt-calc-sqm"
                  className={`${tfStyles.input} ${tfStyles.m2FormInput} ${!isSqmValid && sqmDraft.trim() !== "" ? tfStyles.m2FormInputInvalid : ""}`}
                  type="number"
                  inputMode="numeric"
                  min={FLYT_SQM_MIN}
                  max={FLYT_SQM_MAX}
                  value={sqmDraft}
                  onChange={(event) =>
                    handleSqmInputChange(event.target.value)
                  }
                  onBlur={handleSqmBlur}
                  aria-describedby="flyt-calc-sqm-hint"
                  autoFocus
                />
                <span className={tfStyles.m2FormSuffix}>m²</span>
              </div>
              {!isSqmValid && sqmDraft.trim() !== "" ? (
                <p
                  id="flyt-calc-sqm-hint"
                  className={`${tfStyles.m2FormHint} ${tfStyles.m2FormHintError}`}
                >
                  {`Indtast mellem ${FLYT_SQM_MIN} og ${FLYT_SQM_MAX} m²`}
                </p>
              ) : (
                <p id="flyt-calc-sqm-hint" className="sr-only">
                  Typisk 50–400 m² for lejligheder og huse
                </p>
              )}
            </div>
          </section>
        )}

        {step === 2 && (
          <section aria-label="Boligens stand">
            <p className={tfStyles.fieldLabel} id="flyt-calc-stand-label">
              Hvordan er boligens stand?
            </p>
            <div
              className={calcStyles.standList}
              role="radiogroup"
              aria-labelledby="flyt-calc-stand-label"
            >
              {FLYT_STANDS.map((item) => {
                const isSelected = standLevel === item.level;
                return (
                  <div key={item.level} className={calcStyles.standRowWrap}>
                    <button
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      className={`${calcStyles.standRow} ${isSelected ? calcStyles.standRowSelected : ""}`}
                      onClick={() => handleStandChange(item.level)}
                    >
                      <span className={calcStyles.standRowLevel}>
                        {item.level}
                      </span>
                      <span className={calcStyles.standRowLabel}>
                        {item.shortLabel}
                      </span>
                    </button>
                    {isSelected && (
                      <p className={calcStyles.standRowDescription}>
                        {item.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {step === 3 && (
          <section className={calcStyles.priceStep} aria-label="Din pris">
            <div className={calcStyles.priceSummary}>
              <span>{sqm} m²</span>
              <span className={calcStyles.priceSummaryDot} aria-hidden>
                ·
              </span>
              <span>
                Stand {stand.level} — {stand.shortLabel}
              </span>
            </div>

            {buttonState === "priced" ? (
              <div className={calcStyles.priceReceipt}>
                <div className={tfStyles.receiptTotals}>
                  <div className={tfStyles.receiptTotalNet}>
                    <span>Total</span>
                    <strong>{formatFlytReceiptKr(pricing.total)}</strong>
                  </div>
                  <div
                    className={`${tfStyles.receiptRow} ${tfStyles.receiptRowGreen}`}
                  >
                    <span>
                      Efter servicefradrag (
                      {serviceDeduction.approximateTaxValuePercent}%)
                    </span>
                    <strong>
                      ca. {formatFlytReceiptKr(pricing.afterFradrag)}
                    </strong>
                  </div>
                </div>
                <p className={calcStyles.deductionLink}>
                  <a
                    href={serviceDeduction.sourceUrl}
                    target="_blank"
                    rel="nofollow noopener"
                  >
                    Læs mere om fradrag
                  </a>
                </p>
              </div>
            ) : (
              <p className={calcStyles.priceTeaser}>
                Klik nedenfor for at se din pris inkl. servicefradrag.
              </p>
            )}
          </section>
        )}
      </div>

      <footer className={calcStyles.wizardFooter}>
        {step === 3 ? (
          <div className={calcStyles.priceActions}>
            <button
              type="button"
              className={calcStyles.backBtn}
              onClick={() => goToStep(2)}
            >
              <ArrowLeft size={16} aria-hidden />
              Tilbage
            </button>
            <button
              type="button"
              className={calcStyles.ctaBtn}
              onClick={handleBookClick}
              disabled={!isSqmValid}
            >
              {buttonState === "initial" ? (
                <>
                  Se din pris
                  <ArrowRight size={17} aria-hidden />
                </>
              ) : (
                <span className={calcStyles.ctaBtnInner}>
                  <span>Book flytterengøring</span>
                  <span className={calcStyles.ctaBtnPrice}>
                    {formatFlytReceiptKr(pricing.total)}
                  </span>
                </span>
              )}
            </button>
          </div>
        ) : (
          <div className={calcStyles.footerRow}>
            {step === 1 ? (
              <span className={calcStyles.footerHint}>
                Typisk 50–400 m² for lejligheder og huse
              </span>
            ) : (
              <button
                type="button"
                className={calcStyles.backBtn}
                onClick={() => goToStep((step - 1) as WizardStep)}
              >
                <ArrowLeft size={16} aria-hidden />
                Tilbage
              </button>
            )}
            <button
              type="button"
              className={calcStyles.nextBtn}
              onClick={() => goToStep((step + 1) as WizardStep)}
              disabled={step === 1 && !isSqmValid}
            >
              Næste
              <ArrowRight size={16} aria-hidden />
            </button>
          </div>
        )}
      </footer>

      <div className={calcStyles.trustStrip}>
        <span className={calcStyles.trustItem}>
          <span className={calcStyles.trustDot} aria-hidden />
          <strong>4,8</strong> ud af 5
        </span>
        <span className={calcStyles.trustDivider} aria-hidden>
          ·
        </span>
        <span className={calcStyles.trustItem}>
          <strong>800+</strong> afleveringer
        </span>
        <span className={calcStyles.trustDivider} aria-hidden>
          ·
        </span>
        <span className={calcStyles.trustItem}>
          Beskyttet af <strong>Ren</strong>
          <em>Cover</em>
        </span>
      </div>
    </div>
  );
}
