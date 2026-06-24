"use client";

import { useState } from "react";
import styles from "@/components/dealside/DealTypeformWizard.module.css";
import flytStyles from "@/components/flytterengoring/FlytBookingWizard.module.css";
import type { BoligserviceSlug } from "@/lib/serviceInquiry";
import {
  AFFALD_MAENGDE_OPTIONS,
  AFFALD_TYPE_OPTIONS,
  FLISE_AREA_OPTIONS,
  FLISE_SQM_RANGE_OPTIONS,
  FLISE_TREATMENT_OPTIONS,
  HENTESTED_OPTIONS,
  IT_ENHED_OPTIONS,
  IT_PROBLEM_OPTIONS,
  MOEBELTYPE_OPTIONS,
  MONTERING_ITEM_OPTIONS,
  TAGRENDE_ETAGER_OPTIONS,
  TAGRENDE_LENGTH_OPTIONS,
  TAGRENDE_PROPERTY_OPTIONS,
  UNIT_COUNT_OPTIONS,
  VAEGTYPE_OPTIONS,
  type BortkoerselAffaldDetails,
  type BoligserviceDetails,
  type FliseArea,
  type FliserensDetails,
  type ItEnhed,
  type ItHjaelpDetails,
  type ItProblem,
  type MoebelmonteringDetails,
  type Moebeltype,
  type MonteringItem,
  type MonteringOphaengningDetails,
  type TagrenderensDetails,
} from "@/lib/boligserviceInquiry";
import {
  OptionButton,
  OptionGrid,
  ToggleOptionButton,
  ToggleOptionGrid,
} from "./OptionCard";

type SimpleServiceStepsProps = {
  slug: BoligserviceSlug;
  details: BoligserviceDetails;
  onChange: (details: BoligserviceDetails) => void;
};

function toggleItem<T extends string>(items: T[], id: T) {
  return items.includes(id) ? items.filter((item) => item !== id) : [...items, id];
}

function FliserensOpgaveStep({
  details,
  onChange,
}: {
  details: FliserensDetails;
  onChange: (details: FliserensDetails) => void;
}) {
  const patch = (partial: Partial<FliserensDetails>) =>
    onChange({ ...details, ...partial });
  const [manualSqmOpen, setManualSqmOpen] = useState(
    () => typeof details.sqmManual === "number" && details.sqmManual > 0,
  );

  return (
    <>
      <h2 className={styles.question}>Hvad skal renses?</h2>
      <p className={styles.hint}>
        Vælg område, behandling og cirka størrelse, så vi kan give et præcist tilbud.
      </p>

      <div className={flytStyles.entryOtherField}>
        <p className={styles.fieldLabel}>Område</p>
        <ToggleOptionGrid>
          {FLISE_AREA_OPTIONS.map((option) => (
            <ToggleOptionButton
              key={option.id}
              selected={details.areas.includes(option.id)}
              onClick={() =>
                patch({
                  areas: toggleItem<FliseArea>(details.areas, option.id),
                })
              }
              label={option.label}
            />
          ))}
        </ToggleOptionGrid>
      </div>

      <div className={flytStyles.entryOtherField}>
        <p className={styles.fieldLabel}>Behandling</p>
        <OptionGrid>
          {FLISE_TREATMENT_OPTIONS.map((option) => (
            <OptionButton
              key={option.id}
              selected={details.treatment === option.id}
              onClick={() => patch({ treatment: option.id })}
              label={option.label}
            />
          ))}
        </OptionGrid>
      </div>

      <div className={flytStyles.entryOtherField}>
        <p className={styles.fieldLabel}>Areal (ca.)</p>
        {!manualSqmOpen ? (
          <>
            <ToggleOptionGrid>
              {FLISE_SQM_RANGE_OPTIONS.map((option) => (
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
            <label className={styles.fieldLabel} htmlFor="fliserens-sqm-manual">
              Areal i m²
            </label>
            <input
              id="fliserens-sqm-manual"
              className={styles.input}
              type="number"
              inputMode="numeric"
              min={1}
              max={999}
              placeholder="F.eks. 45"
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

      <div className={flytStyles.entryOtherField}>
        <label className={styles.fieldLabel} htmlFor="fliserens-notes">
          Bemærkninger (valgfrit)
        </label>
        <textarea
          id="fliserens-notes"
          className={flytStyles.entryOtherInput}
          value={details.notes}
          onChange={(event) => patch({ notes: event.target.value })}
          rows={3}
        />
      </div>
    </>
  );
}

export function SimpleServiceSteps({
  slug,
  details,
  onChange,
}: SimpleServiceStepsProps) {
  if (slug === "fliserens") {
    const d = details as FliserensDetails;
    return (
      <FliserensOpgaveStep
        details={d}
        onChange={(next) => onChange(next)}
      />
    );
  }

  if (slug === "tagrenderens") {
    const d = details as TagrenderensDetails;
    const patch = (partial: Partial<TagrenderensDetails>) =>
      onChange({ ...d, ...partial });

    return (
      <>
        <h2 className={styles.question}>Fortæl os om tagrenderne</h2>
        <p className={styles.hint}>
          Boligtype, etager og cirka længde, så vi kan planlægge opgaven.
        </p>

        <div className={flytStyles.entryOtherField}>
          <p className={styles.fieldLabel}>Boligtype</p>
          <OptionGrid>
            {TAGRENDE_PROPERTY_OPTIONS.map((option) => (
              <OptionButton
                key={option.id}
                selected={d.propertyType === option.id}
                onClick={() => patch({ propertyType: option.id })}
                label={option.label}
              />
            ))}
          </OptionGrid>
        </div>

        <div className={flytStyles.entryOtherField}>
          <p className={styles.fieldLabel}>Etager</p>
          <OptionGrid>
            {TAGRENDE_ETAGER_OPTIONS.map((option) => (
              <OptionButton
                key={option.id}
                selected={d.floors === option.id}
                onClick={() => patch({ floors: option.id })}
                label={option.label}
              />
            ))}
          </OptionGrid>
        </div>

        <div className={flytStyles.entryOtherField}>
          <p className={styles.fieldLabel}>Tagrender (ca.)</p>
          <OptionGrid>
            {TAGRENDE_LENGTH_OPTIONS.map((option) => (
              <OptionButton
                key={option.id}
                selected={d.gutterLength === option.id}
                onClick={() => patch({ gutterLength: option.id })}
                label={option.label}
                sub={option.sub}
              />
            ))}
          </OptionGrid>
        </div>

        <div className={flytStyles.entryOtherField}>
          <label className={styles.fieldLabel} htmlFor="tagrenderens-notes">
            Bemærkninger (valgfrit)
          </label>
          <textarea
            id="tagrenderens-notes"
            className={flytStyles.entryOtherInput}
            value={d.notes}
            onChange={(event) => patch({ notes: event.target.value })}
            rows={3}
          />
        </div>
      </>
    );
  }

  if (slug === "montering-og-ophaengning") {
    const d = details as MonteringOphaengningDetails;
    const patch = (partial: Partial<MonteringOphaengningDetails>) =>
      onChange({ ...d, ...partial });

    return (
      <>
        <h2 className={styles.question}>Hvad skal monteres?</h2>
        <p className={styles.hint}>
          Vælg type og cirka antal. Vægtype er valgfrit.
        </p>

        <div className={flytStyles.entryOtherField}>
          <p className={styles.fieldLabel}>Type</p>
          <ToggleOptionGrid>
            {MONTERING_ITEM_OPTIONS.map((option) => (
              <ToggleOptionButton
                key={option.id}
                selected={d.items.includes(option.id)}
                onClick={() =>
                  patch({
                    items: toggleItem<MonteringItem>(d.items, option.id),
                  })
                }
                label={option.label}
              />
            ))}
          </ToggleOptionGrid>
        </div>

        <div className={flytStyles.entryOtherField}>
          <p className={styles.fieldLabel}>Antal enheder (ca.)</p>
          <ToggleOptionGrid>
            {UNIT_COUNT_OPTIONS.map((option) => (
              <ToggleOptionButton
                key={option.id}
                selected={d.unitCount === option.id}
                onClick={() => patch({ unitCount: option.id })}
                label={option.label}
              />
            ))}
          </ToggleOptionGrid>
        </div>

        <div className={flytStyles.entryOtherField}>
          <p className={styles.fieldLabel}>Vægtype (valgfrit)</p>
          <OptionGrid>
            {VAEGTYPE_OPTIONS.map((option) => (
              <OptionButton
                key={option.id}
                selected={d.wallType === option.id}
                onClick={() =>
                  patch({
                    wallType: d.wallType === option.id ? undefined : option.id,
                  })
                }
                label={option.label}
              />
            ))}
          </OptionGrid>
        </div>

        <div className={flytStyles.entryOtherField}>
          <label className={styles.fieldLabel} htmlFor="montering-notes">
            Bemærkninger (valgfrit)
          </label>
          <textarea
            id="montering-notes"
            className={flytStyles.entryOtherInput}
            value={d.notes}
            onChange={(event) => patch({ notes: event.target.value })}
            rows={3}
          />
        </div>
      </>
    );
  }

  if (slug === "moebelmontering") {
    const d = details as MoebelmonteringDetails;
    const patch = (partial: Partial<MoebelmonteringDetails>) =>
      onChange({ ...d, ...partial });

    return (
      <>
        <h2 className={styles.question}>Hvilke møbler skal samles?</h2>
        <p className={styles.hint}>
          Vælg type og antal, og fortæl os om manual og emballage.
        </p>

        <div className={flytStyles.entryOtherField}>
          <p className={styles.fieldLabel}>Møbeltype</p>
          <ToggleOptionGrid>
            {MOEBELTYPE_OPTIONS.map((option) => (
              <ToggleOptionButton
                key={option.id}
                selected={d.furnitureTypes.includes(option.id)}
                onClick={() =>
                  patch({
                    furnitureTypes: toggleItem<Moebeltype>(
                      d.furnitureTypes,
                      option.id,
                    ),
                  })
                }
                label={option.label}
              />
            ))}
          </ToggleOptionGrid>
        </div>

        <div className={flytStyles.entryOtherField}>
          <p className={styles.fieldLabel}>Antal styk (ca.)</p>
          <ToggleOptionGrid>
            {UNIT_COUNT_OPTIONS.map((option) => (
              <ToggleOptionButton
                key={option.id}
                selected={d.pieceCount === option.id}
                onClick={() => patch({ pieceCount: option.id })}
                label={option.label}
              />
            ))}
          </ToggleOptionGrid>
        </div>

        <div className={flytStyles.entryOtherField}>
          <p className={styles.fieldLabel}>Har du manual og emballage?</p>
          <OptionGrid>
            <OptionButton
              selected={d.hasManual === true}
              onClick={() => patch({ hasManual: true })}
              label="Ja"
            />
            <OptionButton
              selected={d.hasManual === false}
              onClick={() => patch({ hasManual: false })}
              label="Nej"
            />
          </OptionGrid>
        </div>

        <div className={flytStyles.entryOtherField}>
          <label className={styles.fieldLabel} htmlFor="moebel-notes">
            Bemærkninger (valgfrit)
          </label>
          <textarea
            id="moebel-notes"
            className={flytStyles.entryOtherInput}
            value={d.notes}
            onChange={(event) => patch({ notes: event.target.value })}
            rows={3}
          />
        </div>
      </>
    );
  }

  if (slug === "bortkoersel-og-affald") {
    const d = details as BortkoerselAffaldDetails;
    const patch = (partial: Partial<BortkoerselAffaldDetails>) =>
      onChange({ ...d, ...partial });

    return (
      <>
        <h2 className={styles.question}>Hvad skal køres væk?</h2>
        <p className={styles.hint}>
          Type, mængde og hvor det står, så vi kan give et præcist tilbud.
        </p>

        <div className={flytStyles.entryOtherField}>
          <p className={styles.fieldLabel}>Type affald</p>
          <OptionGrid>
            {AFFALD_TYPE_OPTIONS.map((option) => (
              <OptionButton
                key={option.id}
                selected={d.wasteType === option.id}
                onClick={() => patch({ wasteType: option.id })}
                label={option.label}
              />
            ))}
          </OptionGrid>
        </div>

        <div className={flytStyles.entryOtherField}>
          <p className={styles.fieldLabel}>Estimeret mængde</p>
          <OptionGrid>
            {AFFALD_MAENGDE_OPTIONS.map((option) => (
              <OptionButton
                key={option.id}
                selected={d.volume === option.id}
                onClick={() => patch({ volume: option.id })}
                label={option.label}
                sub={option.sub}
              />
            ))}
          </OptionGrid>
        </div>

        <div className={flytStyles.entryOtherField}>
          <p className={styles.fieldLabel}>Hvor står det?</p>
          <OptionGrid>
            {HENTESTED_OPTIONS.map((option) => (
              <OptionButton
                key={option.id}
                selected={d.pickupLocation === option.id}
                onClick={() => patch({ pickupLocation: option.id })}
                label={option.label}
              />
            ))}
          </OptionGrid>
        </div>

        <div className={flytStyles.entryOtherField}>
          <label className={styles.fieldLabel} htmlFor="affald-notes">
            Bemærkninger (valgfrit)
          </label>
          <textarea
            id="affald-notes"
            className={flytStyles.entryOtherInput}
            value={d.notes}
            onChange={(event) => patch({ notes: event.target.value })}
            rows={3}
          />
        </div>
      </>
    );
  }

  if (slug === "it-hjaelp-til-hjemmet") {
    const d = details as ItHjaelpDetails;
    const patch = (partial: Partial<ItHjaelpDetails>) =>
      onChange({ ...d, ...partial });

    return (
      <>
        <h2 className={styles.question}>Hvad drejer det sig om?</h2>
        <p className={styles.hint}>
          Vælg enhed og problem, og angiv om fjernhjælp er OK.
        </p>

        <div className={flytStyles.entryOtherField}>
          <p className={styles.fieldLabel}>Enhed</p>
          <ToggleOptionGrid>
            {IT_ENHED_OPTIONS.map((option) => (
              <ToggleOptionButton
                key={option.id}
                selected={d.devices.includes(option.id)}
                onClick={() =>
                  patch({
                    devices: toggleItem<ItEnhed>(d.devices, option.id),
                  })
                }
                label={option.label}
              />
            ))}
          </ToggleOptionGrid>
        </div>

        <div className={flytStyles.entryOtherField}>
          <p className={styles.fieldLabel}>Problemtype</p>
          <ToggleOptionGrid>
            {IT_PROBLEM_OPTIONS.map((option) => (
              <ToggleOptionButton
                key={option.id}
                selected={d.problemTypes.includes(option.id)}
                onClick={() =>
                  patch({
                    problemTypes: toggleItem<ItProblem>(
                      d.problemTypes,
                      option.id,
                    ),
                  })
                }
                label={option.label}
              />
            ))}
          </ToggleOptionGrid>
        </div>

        <div className={flytStyles.entryOtherField}>
          <p className={styles.fieldLabel}>Fjernhjælp OK?</p>
          <OptionGrid>
            <OptionButton
              selected={d.remoteOk}
              onClick={() => patch({ remoteOk: true })}
              label="Ja, remote er fint"
            />
            <OptionButton
              selected={!d.remoteOk}
              onClick={() => patch({ remoteOk: false })}
              label="Nej, besøg på adressen"
            />
          </OptionGrid>
        </div>

        <div className={flytStyles.entryOtherField}>
          <label className={styles.fieldLabel} htmlFor="it-notes">
            Beskriv problemet (valgfrit)
          </label>
          <textarea
            id="it-notes"
            className={flytStyles.entryOtherInput}
            value={d.notes}
            onChange={(event) => patch({ notes: event.target.value })}
            placeholder="F.eks. hvornår det startede, fejlbeskeder..."
            rows={4}
          />
        </div>
      </>
    );
  }

  return null;
}
