"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowRight, MapPin } from "lucide-react";
import {
  useDawaPostcode,
  type DawaPostnummerSuggestion,
} from "@/components/service-inquiry/boligservice/DawaAddressField";

type HeroBookingFormProps = {
  showPostcodeIcon?: boolean;
  showSizeField?: boolean;
  /** When false, only the submit button is shown (no postcode / m² fields). */
  showInputs?: boolean;
  /** Wider postcode / size inputs on mobile (and slightly wider on desktop). */
  wideInputs?: boolean;
  className?: string;
  submitPath?: string;
  submitLabel?: string;
  sizeFieldLabel?: string;
  sizeFieldPlaceholder?: string;
};

function isNumericSizeField(label: string, placeholder: string) {
  const combined = `${label} ${placeholder}`.toLowerCase();
  return !/(ruder|opgange|medarbejdere)/.test(combined);
}

export function HeroBookingForm({
  showPostcodeIcon = true,
  showSizeField = true,
  showInputs = true,
  wideInputs = false,
  className = "",
  submitPath = "/book-rengoering",
  submitLabel = "Se din pris",
  sizeFieldLabel = "Boligstørrelse",
  sizeFieldPlaceholder = "F.eks. 100",
}: HeroBookingFormProps) {
  const router = useRouter();
  const [postcodeQuery, setPostcodeQuery] = useState("");
  const [m2, setM2] = useState("");
  const [zipSuggestions, setZipSuggestions] = useState<DawaPostnummerSuggestion[]>(
    [],
  );
  const [showZipSuggestions, setShowZipSuggestions] = useState(false);
  const postcodeDropdownRef = useRef<HTMLDivElement>(null);
  const { fetchSuggestions: fetchZipSuggestions, lookupPostnummer } =
    useDawaPostcode();
  const numericSizeField = isNumericSizeField(sizeFieldLabel, sizeFieldPlaceholder);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        postcodeDropdownRef.current &&
        !postcodeDropdownRef.current.contains(event.target as Node)
      ) {
        setShowZipSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePostcodeChange = (value: string) => {
    setPostcodeQuery(value);

    const digitsOnly = value.replace(/\D/g, "");
    if (digitsOnly.length === 4) {
      setShowZipSuggestions(false);
      void lookupPostnummer(digitsOnly).then((result) => {
        if (result) setPostcodeQuery(result.tekst);
      });
      return;
    }

    fetchZipSuggestions(value, setZipSuggestions, setShowZipSuggestions);
  };

  const handlePostcodeSelect = (suggestion: DawaPostnummerSuggestion) => {
    setPostcodeQuery(suggestion.tekst);
    setZipSuggestions([]);
    setShowZipSuggestions(false);
  };

  const handleM2Change = (value: string) => {
    if (numericSizeField) {
      setM2(value.replace(/\D/g, "").slice(0, 4));
      return;
    }
    setM2(value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    const cleanPostcode = postcodeQuery.replace(/\D/g, "").slice(0, 4);

    if (showInputs) {
      if (cleanPostcode.length === 4) params.set("postcode", cleanPostcode);
      const cleanM2 = numericSizeField ? m2 : m2.replace(/\D/g, "");
      if (cleanM2) params.set("m2", cleanM2);
    }

    const basePath = submitPath.endsWith("/") ? submitPath : `${submitPath}/`;
    router.push(`${basePath}${params.size ? `?${params.toString()}` : ""}`);
  };

  if (!showInputs) {
    return (
      <form
        onSubmit={handleSubmit}
        className={`${wideInputs ? "w-full" : ""} ${className}`.trim()}
      >
        <button
          type="submit"
          className={`flex min-h-[62px] cursor-pointer items-center justify-center gap-2 rounded-[2px] bg-[#173c2c] px-7 text-sm font-bold text-white transition-colors hover:bg-[#0f2d20] ${
            wideInputs ? "w-full" : ""
          }`}
        >
          {submitLabel}
          <ArrowRight size={16} />
        </button>
      </form>
    );
  }

  const formWidth = wideInputs
    ? "w-full sm:max-w-none sm:w-fit"
    : "w-fit max-w-full";
  const gridCols = showSizeField
    ? wideInputs
      ? "sm:grid-cols-[minmax(0,13rem)_minmax(0,14rem)_auto]"
      : "sm:grid-cols-[minmax(0,10rem)_minmax(0,11rem)_auto]"
    : wideInputs
      ? "sm:grid-cols-[minmax(0,13rem)_auto]"
      : "sm:grid-cols-[minmax(0,10rem)_auto]";

  return (
    <form
      onSubmit={handleSubmit}
      className={`${formWidth} border border-[#b9c5b9] bg-[#fbfaf5] p-2 ${className} relative !z-20`}
    >
      <div className={`grid gap-0 ${gridCols}`}>
        <div
          ref={postcodeDropdownRef}
          className={`relative flex min-h-[62px] w-full items-center gap-3 px-4 ${
            showSizeField
              ? "border-b border-[#d8ddd5] sm:border-b-0 sm:border-r"
              : wideInputs
                ? "border-b border-[#d8ddd5] sm:border-b-0 sm:border-r"
                : "max-w-[10rem] border-b border-[#d8ddd5] sm:border-b-0 sm:border-r"
          }`}
        >
          {showPostcodeIcon ? (
            <MapPin size={18} className="shrink-0 text-[#41614f]" />
          ) : null}
          <label className="flex-1">
            <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[#7b887f]">
              Postnummer
            </span>
            <input
              value={postcodeQuery}
              onChange={(event) => handlePostcodeChange(event.target.value)}
              placeholder="F.eks. 2100 eller Østerbro"
              autoComplete="off"
              aria-label="Postnummer"
              className="mt-1 w-full bg-transparent text-sm font-semibold outline-none placeholder:text-[#9ca59f]"
            />
          </label>
          {showZipSuggestions && zipSuggestions.length > 0 && (
            <ul
              className="absolute left-0 right-0 top-full z-50 mt-1 max-h-48 overflow-y-auto border border-[#b9c5b9] bg-white shadow-lg"
              role="listbox"
            >
              {zipSuggestions.map((suggestion) => (
                <li key={suggestion.tekst} role="option">
                  <button
                    type="button"
                    className="w-full bg-white px-4 py-2.5 text-left text-sm font-medium text-[#203129] transition-colors hover:bg-[#f3f5f1]"
                    onMouseDown={(event) => {
                      event.preventDefault();
                      handlePostcodeSelect(suggestion);
                    }}
                  >
                    {suggestion.tekst}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {showSizeField ? (
          <label
            className={`flex min-h-[62px] w-full items-center px-4 sm:border-r sm:border-[#d8ddd5] ${
              wideInputs ? "" : "max-w-[11rem]"
            }`}
          >
            <span className="flex-1">
              <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[#7b887f]">
                {sizeFieldLabel}
              </span>
              <span className="relative mt-1 flex items-center">
                <input
                  value={m2}
                  onChange={(event) => handleM2Change(event.target.value)}
                  type="text"
                  inputMode={numericSizeField ? "numeric" : "text"}
                  pattern={numericSizeField ? "[0-9]*" : undefined}
                  placeholder={sizeFieldPlaceholder}
                  aria-label={sizeFieldLabel}
                  className={`w-full bg-transparent text-sm font-semibold outline-none placeholder:text-[#9ca59f] ${
                    numericSizeField ? "pr-7" : ""
                  }`}
                />
                {numericSizeField ? (
                  <span
                    className="pointer-events-none absolute right-0 text-sm font-semibold text-[#9ca59f]"
                    aria-hidden="true"
                  >
                    m²
                  </span>
                ) : null}
              </span>
            </span>
          </label>
        ) : null}
        <button
          type="submit"
          className="flex min-h-[62px] w-full cursor-pointer items-center justify-center gap-2 rounded-[2px] bg-[#173c2c] px-7 text-sm font-bold text-white transition-colors hover:bg-[#0f2d20] sm:w-auto"
        >
          {submitLabel}
          <ArrowRight size={16} />
        </button>
      </div>
    </form>
  );
}
