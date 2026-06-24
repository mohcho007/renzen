"use client";

import { useEffect, useRef } from "react";
import styles from "@/components/dealside/DealTypeformWizard.module.css";
import {
  buildAliasPostcodeSuggestion,
  formatPostcodeSuggestionText,
  getPostcodeDisplayLabel,
} from "@/lib/postcodeLabels";

export type DawaAdresse = {
  vejnavn: string;
  husnr: string;
  etage?: string | null;
  dør?: string | null;
  postnr: string;
  postnrnavn: string;
};

export type DawaAddressSuggestion = {
  tekst: string;
  adresse: DawaAdresse;
};

export type DawaPostnummerSuggestion = {
  tekst: string;
  nr: string;
  navn: string;
};

type DawaPostnummerApiItem = {
  tekst: string;
  nr?: string;
  navn?: string;
  data?: { nr: string; navn: string };
  postnummer?: { nr: string; navn: string };
};

function toPostcodeSuggestion(
  postnr: string,
  fallbackNavn: string,
): DawaPostnummerSuggestion {
  const navn = getPostcodeDisplayLabel(postnr, fallbackNavn);
  return {
    nr: postnr,
    navn,
    tekst: formatPostcodeSuggestionText(postnr, fallbackNavn),
  };
}

export function formatStreetAddress(adresse: DawaAdresse) {
  let line = `${adresse.vejnavn} ${adresse.husnr}`;
  if (adresse.etage) line += `, ${adresse.etage}.`;
  if (adresse.dør) line += ` ${adresse.dør}`;
  return line;
}

function parsePostnummerSuggestion(
  item: DawaPostnummerApiItem,
): DawaPostnummerSuggestion | null {
  const nr =
    item.nr ??
    item.postnummer?.nr ??
    item.data?.nr ??
    item.tekst.match(/^(\d{4})\b/)?.[1] ??
    "";
  const fallbackNavn =
    item.navn ??
    item.postnummer?.navn ??
    item.data?.navn ??
    item.tekst.replace(/^\d{4}\s*/, "").trim();
  if (!/^\d{4}$/.test(nr)) return null;
  return toPostcodeSuggestion(nr, fallbackNavn);
}

type DawaAddressFieldProps = {
  id: string;
  label: string;
  address: string;
  zip: string;
  city: string;
  onAddressChange: (value: string) => void;
  onSelect: (suggestion: DawaAddressSuggestion) => void;
  suggestions: DawaAddressSuggestion[];
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
  placeholder?: string;
  autoFocus?: boolean;
  showPostnummerBadge?: boolean;
  hint?: string;
};

export function DawaAddressField({
  id,
  label,
  address,
  zip,
  city,
  onAddressChange,
  onSelect,
  suggestions,
  showSuggestions,
  setShowSuggestions,
  placeholder = "F.eks. Nørrebrogade 12",
  autoFocus = false,
  showPostnummerBadge = true,
  hint,
}: DawaAddressFieldProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowSuggestions]);

  const postnummerFilled = zip.length === 4 && city.trim().length > 0;

  return (
    <div>
      <label className={styles.fieldLabel} htmlFor={id}>
        {label}
      </label>
      {hint ? <p className={styles.fieldHint}>{hint}</p> : null}
      <div className={styles.addressAutocomplete} ref={dropdownRef}>
        <input
          id={id}
          className={styles.input}
          value={address}
          onChange={(event) => onAddressChange(event.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          autoFocus={autoFocus}
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className={styles.suggestionsList} role="listbox">
            {suggestions.map((suggestion) => (
              <li key={suggestion.tekst} role="option">
                <button
                  type="button"
                  className={styles.suggestionItem}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    onSelect(suggestion);
                  }}
                >
                  {suggestion.tekst}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {showPostnummerBadge && postnummerFilled && (
        <div className={styles.badge}>
          ✓ {zip} {city}
        </div>
      )}
    </div>
  );
}

export function useDawaAddress(_initialPostcode = "") {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSuggestions = (
    value: string,
    setSuggestions: (items: DawaAddressSuggestion[]) => void,
    setShow: (show: boolean) => void,
    postnrFilter?: string,
  ) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length < 2) {
      setSuggestions([]);
      setShow(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const params = new URLSearchParams({
          q: value.trim(),
          per_side: "8",
        });
        if (postnrFilter && /^\d{4}$/.test(postnrFilter)) {
          params.set("postnr", postnrFilter);
        }
        const res = await fetch(
          `https://api.dataforsyningen.dk/adresser/autocomplete?${params.toString()}`,
        );
        if (res.ok) {
          const data: DawaAddressSuggestion[] = await res.json();
          const filtered = postnrFilter
            ? data.filter((item) => item.adresse?.postnr === postnrFilter)
            : data;
          setSuggestions(filtered);
          setShow(filtered.length > 0);
        }
      } catch {
        setSuggestions([]);
        setShow(false);
      }
    }, 250);
  };

  return { fetchSuggestions };
}

export function useDawaPostcode(
  filterPostnr?: (postnr: string) => boolean,
) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSuggestions = (
    value: string,
    setSuggestions: (items: DawaPostnummerSuggestion[]) => void,
    setShow: (show: boolean) => void,
  ) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = value.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setShow(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.dataforsyningen.dk/postnumre/autocomplete?q=${encodeURIComponent(trimmed)}`,
        );
        if (!res.ok) {
          setSuggestions([]);
          setShow(false);
          return;
        }
        const data: DawaPostnummerApiItem[] = await res.json();
        const parsed = data
          .map(parsePostnummerSuggestion)
          .filter((item): item is DawaPostnummerSuggestion => item !== null)
          .filter((item) => !filterPostnr || filterPostnr(item.nr));

        const aliasSuggestion = buildAliasPostcodeSuggestion(trimmed);
        const merged =
          aliasSuggestion &&
          (!filterPostnr || filterPostnr(aliasSuggestion.nr)) &&
          !parsed.some((item) => item.nr === aliasSuggestion.nr)
            ? [aliasSuggestion, ...parsed]
            : parsed;

        setSuggestions(merged);
        setShow(merged.length > 0);
      } catch {
        setSuggestions([]);
        setShow(false);
      }
    }, 250);
  };

  const lookupPostnummer = async (
    postnr: string,
  ): Promise<DawaPostnummerSuggestion | null> => {
    if (!/^\d{4}$/.test(postnr)) return null;
    try {
      const res = await fetch(
        `https://api.dataforsyningen.dk/postnumre/${postnr}`,
      );
      if (!res.ok) return null;
      const data = await res.json();
      if (!data?.nr) return null;
      return toPostcodeSuggestion(data.nr, data.navn ?? "");
    } catch {
      return null;
    }
  };

  return { fetchSuggestions, lookupPostnummer };
}
