"use client";

import { useState } from "react";
import styles from "@/components/dealside/DealTypeformWizard.module.css";
import flytStyles from "@/components/flytterengoring/FlytBookingWizard.module.css";
import {
  MALER_FINISH_OPTIONS,
  MALER_FURNITURE_OPTIONS,
  MALER_JOB_TYPE_OPTIONS,
  MALER_ROOM_COUNT_OPTIONS,
  MALER_SCOPE_MODE_OPTIONS,
  MALER_SQM_RANGE_OPTIONS,
  MALER_STAND_OPTIONS,
  MALER_SURFACE_OPTIONS,
  type MalerarbejdeDetails,
  type MalerSurface,
} from "@/lib/boligserviceInquiry";
import { ConfirmCard } from "@/components/forms/TermsConfirmCard";
import {
  SERVICE_ENTRY_OPTIONS,
  type ServiceEntryOptionId,
} from "@/lib/serviceInquiry";
import {
  OptionButton,
  OptionGrid,
  ToggleOptionButton,
  ToggleOptionGrid,
} from "./OptionCard";

type MalerStepProps = {
  step: string;
  details: MalerarbejdeDetails;
  onChange: (details: MalerarbejdeDetails) => void;
  entryMethod: ServiceEntryOptionId | "";
  setEntryMethod: (value: ServiceEntryOptionId | "") => void;
  entryOtherDetails: string;
  setEntryOtherDetails: (value: string) => void;
};

function toggleSurface(surfaces: MalerSurface[], id: MalerSurface) {
  return surfaces.includes(id)
    ? surfaces.filter((item) => item !== id)
    : [...surfaces, id];
}

export function MalerarbejdeSteps({
  step,
  details,
  onChange,
  entryMethod,
  setEntryMethod,
  entryOtherDetails,
  setEntryOtherDetails,
}: MalerStepProps) {
  const patch = (partial: Partial<MalerarbejdeDetails>) =>
    onChange({ ...details, ...partial });
  const [manualSqmOpen, setManualSqmOpen] = useState(
    () => typeof details.sqmManual === "number" && details.sqmManual > 0,
  );

  if (step === "opgavetype") {
    return (
      <>
        <h2 className={styles.question}>Hvilken type malerarbejde?</h2>
        <p className={styles.hint}>
          Vælg indvendig, udvendig eller begge, og angiv cirka omfang.
        </p>

        <div className={flytStyles.entryOtherField}>
          <p className={styles.fieldLabel}>Opgavetype</p>
          <OptionGrid>
            {MALER_JOB_TYPE_OPTIONS.map((option) => (
              <OptionButton
                key={option.id}
                selected={details.jobType === option.id}
                onClick={() => patch({ jobType: option.id })}
                label={option.label}
              />
            ))}
          </OptionGrid>
        </div>

        <div className={flytStyles.entryOtherField}>
          <p className={styles.fieldLabel}>Omfang</p>
          <OptionGrid>
            {MALER_SCOPE_MODE_OPTIONS.map((option) => (
              <OptionButton
                key={option.id}
                selected={details.scopeMode === option.id}
                onClick={() => patch({ scopeMode: option.id })}
                label={option.label}
              />
            ))}
          </OptionGrid>
        </div>

        {details.scopeMode === "rooms" ? (
          <div className={flytStyles.entryOtherField}>
            <p className={styles.fieldLabel}>Antal rum</p>
            <ToggleOptionGrid>
              {MALER_ROOM_COUNT_OPTIONS.map((option) => (
                <ToggleOptionButton
                  key={option.id}
                  selected={details.roomCount === option.id}
                  onClick={() => patch({ roomCount: option.id })}
                  label={option.label}
                />
              ))}
            </ToggleOptionGrid>
          </div>
        ) : (
          <div className={flytStyles.entryOtherField}>
            <p className={styles.fieldLabel}>Areal</p>
            {!manualSqmOpen ? (
              <>
                <ToggleOptionGrid>
                  {MALER_SQM_RANGE_OPTIONS.map((option) => (
                    <ToggleOptionButton
                      key={option.id}
                      selected={details.sqmRange === option.id}
                      onClick={() =>
                        patch({ sqmRange: option.id, sqmManual: undefined })
                      }
                      label={option.label}
                    />
                  ))}
                </ToggleOptionGrid>
                <button
                  type="button"
                  className={styles.detailsLink}
                  onClick={() => {
                    setManualSqmOpen(true);
                    patch({ sqmRange: undefined });
                  }}
                >
                  Indtast m² manuelt
                </button>
              </>
            ) : (
              <>
                <label className={styles.fieldLabel} htmlFor="maler-sqm-manual">
                  Areal i m²
                </label>
                <input
                  id="maler-sqm-manual"
                  className={styles.input}
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={999}
                  placeholder="F.eks. 85"
                  value={details.sqmManual ?? ""}
                  onChange={(event) => {
                    const parsed = Number.parseInt(event.target.value, 10);
                    patch({
                      sqmManual: Number.isFinite(parsed) ? parsed : undefined,
                      sqmRange: undefined,
                    });
                  }}
                />
                <button
                  type="button"
                  className={styles.detailsLink}
                  onClick={() => {
                    setManualSqmOpen(false);
                    patch({ sqmManual: undefined });
                  }}
                >
                  Vælg interval i stedet
                </button>
              </>
            )}
          </div>
        )}
      </>
    );
  }

  if (step === "detaljer") {
    return (
      <>
        <h2 className={styles.question}>Detaljer om opgaven</h2>
        <p className={styles.hint}>
          Hvad skal males, og hvordan ser overfladerne ud i dag?
        </p>

        <div className={flytStyles.entryOtherField}>
          <p className={styles.fieldLabel}>Hvad skal males?</p>
          <ToggleOptionGrid>
            {MALER_SURFACE_OPTIONS.map((option) => (
              <ToggleOptionButton
                key={option.id}
                selected={details.surfaces.includes(option.id)}
                onClick={() =>
                  patch({ surfaces: toggleSurface(details.surfaces, option.id) })
                }
                label={option.label}
              />
            ))}
          </ToggleOptionGrid>
        </div>

        <div className={flytStyles.entryOtherField}>
          <p className={styles.fieldLabel}>Nuværende stand</p>
          <OptionGrid>
            {MALER_STAND_OPTIONS.map((option) => (
              <OptionButton
                key={option.id}
                selected={details.currentStand === option.id}
                onClick={() => patch({ currentStand: option.id })}
                label={option.label}
              />
            ))}
          </OptionGrid>
        </div>

        <div className={flytStyles.entryOtherField}>
          <p className={styles.fieldLabel}>Tapet / finish i dag</p>
          <OptionGrid>
            {MALER_FINISH_OPTIONS.map((option) => (
              <OptionButton
                key={option.id}
                selected={details.wallFinish === option.id}
                onClick={() => patch({ wallFinish: option.id })}
                label={option.label}
              />
            ))}
          </OptionGrid>
        </div>

        <ConfirmCard
          checked={details.hasPhotos}
          onChange={(hasPhotos) => patch({ hasPhotos })}
          ariaLabel="Jeg kan sende billeder efter forespørgsel"
        >
          Jeg kan sende billeder efter forespørgsel (valgfrit)
        </ConfirmCard>
      </>
    );
  }

  if (step === "forberedelse") {
    return (
      <>
        <h2 className={styles.question}>Adgang og forberedelse</h2>
        <p className={styles.hint}>
          Hvem flytter møbler, og hvordan kommer maleren ind?
        </p>

        <div className={flytStyles.entryOtherField}>
          <p className={styles.fieldLabel}>Møbler og dækning</p>
          <OptionGrid>
            {MALER_FURNITURE_OPTIONS.map((option) => (
              <OptionButton
                key={option.id}
                selected={details.furnitureHandling === option.id}
                onClick={() => patch({ furnitureHandling: option.id })}
                label={option.label}
                sub={option.sub}
              />
            ))}
          </OptionGrid>
        </div>

        <div className={flytStyles.entryOtherField}>
          <p className={styles.fieldLabel}>Adgangsmetode</p>
          <OptionGrid>
            {SERVICE_ENTRY_OPTIONS.map((option) => (
              <OptionButton
                key={option.id}
                selected={entryMethod === option.id}
                onClick={() => {
                  setEntryMethod(option.id);
                  if (option.id !== "other") {
                    setEntryOtherDetails("");
                  }
                }}
                label={option.label}
              />
            ))}
          </OptionGrid>
        </div>

        {entryMethod === "other" && (
          <div className={flytStyles.entryOtherField}>
            <label className={styles.fieldLabel} htmlFor="maler-entry-other">
              Beskriv adgangen
            </label>
            <textarea
              id="maler-entry-other"
              className={flytStyles.entryOtherInput}
              value={entryOtherDetails}
              onChange={(event) => setEntryOtherDetails(event.target.value)}
              rows={3}
            />
          </div>
        )}

        <div className={flytStyles.entryOtherField}>
          <label className={styles.fieldLabel} htmlFor="maler-access-notes">
            Bemærkninger (valgfrit)
          </label>
          <textarea
            id="maler-access-notes"
            className={flytStyles.entryOtherInput}
            value={details.accessNotes}
            onChange={(event) => patch({ accessNotes: event.target.value })}
            placeholder="F.eks. parkering, trapper, særlige forhold..."
            rows={3}
          />
        </div>
      </>
    );
  }

  return null;
}
