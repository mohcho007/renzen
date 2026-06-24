"use client";

import { useState } from "react";
import styles from "@/components/dealside/DealTypeformWizard.module.css";
import flytStyles from "@/components/flytterengoring/FlytBookingWizard.module.css";
import {
  BOLIGTYPE_FLYT_OPTIONS,
  FLOOR_OPTIONS,
  FLYTNING_EXTRA_OPTIONS,
  FLYTTEKASSER_OPTIONS,
  MOEBLERINGSGRAD_OPTIONS,
  PARKERING_OPTIONS,
  needsElevatorQuestion,
  needsFloorQuestion,
  type FlytningDetails,
  type FlytningExtra,
  type BoligtypeFlyt,
} from "@/lib/boligserviceInquiry";
import {
  DawaAddressField,
  type DawaAddressSuggestion,
} from "./DawaAddressField";
import {
  OptionButton,
  OptionGrid,
  ToggleOptionButton,
  ToggleOptionGrid,
} from "./OptionCard";

type FlytningStepsProps = {
  step: string;
  details: FlytningDetails;
  onChange: (details: FlytningDetails) => void;
  fromAddress: string;
  fromZip: string;
  fromCity: string;
  fromSuggestions: DawaAddressSuggestion[];
  showFromSuggestions: boolean;
  setShowFromSuggestions: (show: boolean) => void;
  onFromAddressChange: (value: string) => void;
  onFromAddressSelect: (suggestion: DawaAddressSuggestion) => void;
  toSuggestions: DawaAddressSuggestion[];
  showToSuggestions: boolean;
  setShowToSuggestions: (show: boolean) => void;
  onToAddressChange: (value: string) => void;
  onToAddressSelect: (suggestion: DawaAddressSuggestion) => void;
};

function toggleExtra(extras: FlytningExtra[], id: FlytningExtra) {
  return extras.includes(id)
    ? extras.filter((item) => item !== id)
    : [...extras, id];
}

function FloorElevatorFields({
  label,
  propertyType,
  floor,
  elevator,
  onUpdate,
}: {
  label: string;
  propertyType: BoligtypeFlyt;
  floor: number;
  elevator: boolean | null;
  onUpdate: (updates: { floor: number; elevator: boolean | null }) => void;
}) {
  if (!needsFloorQuestion(propertyType)) {
    return null;
  }

  const showElevator = needsElevatorQuestion(propertyType, floor);
  const floorLabel = propertyType === "kontor" ? "Sal" : "Etage";

  return (
    <div className={flytStyles.entryOtherField}>
      <p className={styles.fieldLabel}>
        {label}, {floorLabel.toLowerCase()}
      </p>
      <ToggleOptionGrid>
        {FLOOR_OPTIONS.map((value) => {
          const isSelected = floor === value;
          const floorButtonLabel =
            value === 0
              ? "Stue"
              : value === 3
                ? "3+ sal"
                : `${value}. sal`;
          return (
            <ToggleOptionButton
              key={`${label}-floor-${value}`}
              selected={isSelected}
              aria-pressed={isSelected}
              onClick={() => {
                onUpdate({
                  floor: value,
                  elevator: needsElevatorQuestion(propertyType, value)
                    ? elevator
                    : null,
                });
              }}
              label={floorButtonLabel}
            />
          );
        })}
      </ToggleOptionGrid>
      {showElevator && (
        <div className={flytStyles.entryOtherField}>
          <p className={styles.fieldLabel}>Elevator</p>
          <OptionGrid>
            <OptionButton
              selected={elevator === true}
              onClick={() => onUpdate({ floor, elevator: true })}
              label="Ja"
            />
            <OptionButton
              selected={elevator === false}
              onClick={() => onUpdate({ floor, elevator: false })}
              label="Nej"
            />
          </OptionGrid>
        </div>
      )}
    </div>
  );
}

function handlePropertyTypeChange(
  side: "from" | "to",
  propertyType: BoligtypeFlyt,
  patch: (partial: Partial<FlytningDetails>) => void,
) {
  const updates: Partial<FlytningDetails> =
    side === "from"
      ? { fromPropertyType: propertyType }
      : { toPropertyType: propertyType };

  if (!needsFloorQuestion(propertyType)) {
    if (side === "from") {
      updates.fromFloor = 0;
      updates.fromElevator = null;
    } else {
      updates.toFloor = 0;
      updates.toElevator = null;
    }
  }

  patch(updates);
}

export function FlytningSteps({
  step,
  details,
  onChange,
  fromAddress,
  fromZip,
  fromCity,
  fromSuggestions,
  showFromSuggestions,
  setShowFromSuggestions,
  onFromAddressChange,
  onFromAddressSelect,
  toSuggestions,
  showToSuggestions,
  setShowToSuggestions,
  onToAddressChange,
  onToAddressSelect,
}: FlytningStepsProps) {
  const patch = (partial: Partial<FlytningDetails>) =>
    onChange({ ...details, ...partial });
  const [manualBoxOpen, setManualBoxOpen] = useState(
    () => typeof details.boxManual === "number" && details.boxManual >= 0,
  );

  if (step === "adresser") {
    return (
      <>
        <h2 className={styles.question}>Fra og til adresse</h2>
        <p className={styles.hint}>
          Angiv begge adresser. Vi finder postnummer og by automatisk.
        </p>

        <DawaAddressField
          id="flytning-from-address"
          label="Fra adresse"
          address={fromAddress}
          zip={fromZip}
          city={fromCity}
          onAddressChange={onFromAddressChange}
          onSelect={onFromAddressSelect}
          suggestions={fromSuggestions}
          showSuggestions={showFromSuggestions}
          setShowSuggestions={setShowFromSuggestions}
          autoFocus
        />

        <DawaAddressField
          id="flytning-to-address"
          label="Til adresse"
          address={details.toAddress}
          zip={details.toZip}
          city={details.toCity}
          onAddressChange={onToAddressChange}
          onSelect={onToAddressSelect}
          suggestions={toSuggestions}
          showSuggestions={showToSuggestions}
          setShowSuggestions={setShowToSuggestions}
        />
      </>
    );
  }

  if (step === "bolig") {
    return (
      <>
        <h2 className={styles.question}>Boligtype og adgang</h2>
        <p className={styles.hint}>
          Fortæl os om boligtypen, og etage eller sal for lejlighed og kontor.
        </p>

        <div className={flytStyles.entryOtherField}>
          <p className={styles.fieldLabel}>Fra: boligtype</p>
          <OptionGrid>
            {BOLIGTYPE_FLYT_OPTIONS.map((option) => (
              <OptionButton
                key={option.id}
                selected={details.fromPropertyType === option.id}
                onClick={() =>
                  handlePropertyTypeChange("from", option.id, patch)
                }
                label={option.label}
              />
            ))}
          </OptionGrid>
        </div>

        <FloorElevatorFields
          label="Fra"
          propertyType={details.fromPropertyType}
          floor={details.fromFloor}
          elevator={details.fromElevator}
          onUpdate={({ floor, elevator }) =>
            patch({ fromFloor: floor, fromElevator: elevator })
          }
        />

        <div className={flytStyles.entryOtherField}>
          <p className={styles.fieldLabel}>Til: boligtype</p>
          <OptionGrid>
            {BOLIGTYPE_FLYT_OPTIONS.map((option) => (
              <OptionButton
                key={option.id}
                selected={details.toPropertyType === option.id}
                onClick={() => handlePropertyTypeChange("to", option.id, patch)}
                label={option.label}
              />
            ))}
          </OptionGrid>
        </div>

        <FloorElevatorFields
          label="Til"
          propertyType={details.toPropertyType}
          floor={details.toFloor}
          elevator={details.toElevator}
          onUpdate={({ floor, elevator }) =>
            patch({ toFloor: floor, toElevator: elevator })
          }
        />
      </>
    );
  }

  if (step === "flytteinfo") {
    return (
      <>
        <h2 className={styles.question}>Flytteoplysninger</h2>
        <p className={styles.hint}>
          Parkeringsafstand, møbleringsgrad og antal kasser hjælper os med at estimere opgaven.
        </p>

        <div className={flytStyles.entryOtherField}>
          <p className={styles.fieldLabel}>Parkeringsafstand</p>
          <OptionGrid>
            {PARKERING_OPTIONS.map((option) => (
              <OptionButton
                key={option.id}
                selected={details.parkingDistance === option.id}
                onClick={() => patch({ parkingDistance: option.id })}
                label={option.label}
              />
            ))}
          </OptionGrid>
        </div>

        <div className={flytStyles.entryOtherField}>
          <p className={styles.fieldLabel}>Møbleringsgrad</p>
          <OptionGrid>
            {MOEBLERINGSGRAD_OPTIONS.map((option) => (
              <OptionButton
                key={option.id}
                selected={details.furnishingLevel === option.id}
                onClick={() => patch({ furnishingLevel: option.id })}
                label={option.label}
              />
            ))}
          </OptionGrid>
        </div>

        <div className={flytStyles.entryOtherField}>
          <p className={styles.fieldLabel}>Antal flyttekasser (ca.)</p>
          {!manualBoxOpen ? (
            <>
              <ToggleOptionGrid>
                {FLYTTEKASSER_OPTIONS.map((option) => (
                  <ToggleOptionButton
                    key={option.id}
                    selected={details.boxCount === option.id}
                    onClick={() =>
                      patch({ boxCount: option.id, boxManual: undefined })
                    }
                    label={option.label}
                  />
                ))}
              </ToggleOptionGrid>
              <button
                type="button"
                className={styles.detailsLink}
                onClick={() => {
                  setManualBoxOpen(true);
                  patch({ boxCount: undefined, boxManual: undefined });
                }}
              >
                Indtast antal manuelt
              </button>
            </>
          ) : (
            <>
              <label className={styles.fieldLabel} htmlFor="flytning-box-manual">
                Antal kasser
              </label>
              <input
                id="flytning-box-manual"
                className={styles.input}
                type="number"
                inputMode="numeric"
                min={0}
                max={999}
                placeholder="F.eks. 15"
                value={details.boxManual ?? ""}
                onChange={(event) => {
                  const parsed = Number.parseInt(event.target.value, 10);
                  patch({
                    boxManual: Number.isFinite(parsed) ? parsed : undefined,
                    boxCount: undefined,
                  });
                }}
              />
              <button
                type="button"
                className={styles.detailsLink}
                onClick={() => {
                  setManualBoxOpen(false);
                  patch({ boxManual: undefined, boxCount: "1_10" });
                }}
              >
                Vælg interval i stedet
              </button>
            </>
          )}
        </div>
      </>
    );
  }

  if (step === "ekstra") {
    return (
      <>
        <h2 className={styles.question}>Ekstra behov</h2>
        <p className={styles.hint}>
          Vælg det der gælder. Resten er valgfrit.
        </p>

        <div className={flytStyles.entryOtherField}>
          <p className={styles.fieldLabel}>Særlige genstande (valgfrit)</p>
          <ToggleOptionGrid>
            {FLYTNING_EXTRA_OPTIONS.map((option) => (
              <ToggleOptionButton
                key={option.id}
                selected={details.extras.includes(option.id)}
                onClick={() =>
                  patch({ extras: toggleExtra(details.extras, option.id) })
                }
                label={option.label}
              />
            ))}
          </ToggleOptionGrid>
        </div>

        <div className={flytStyles.entryOtherField}>
          <label className={styles.fieldLabel} htmlFor="flytning-notes">
            Bemærkninger (valgfrit)
          </label>
          <textarea
            id="flytning-notes"
            className={flytStyles.entryOtherInput}
            value={details.notes}
            onChange={(event) => patch({ notes: event.target.value })}
            placeholder="F.eks. skabe der skal pakkes, særlige genstande..."
            rows={4}
          />
        </div>
      </>
    );
  }

  return null;
}
