"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, MapPin } from "lucide-react";

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

export function HeroBookingForm({
  showPostcodeIcon = true,
  showSizeField = true,
  showInputs = true,
  wideInputs = false,
  className = "",
  submitPath = "/book-rengoering",
  submitLabel = "Se din pris",
  sizeFieldLabel = "Boligstørrelse",
  sizeFieldPlaceholder = "F.eks. 100 m²",
}: HeroBookingFormProps) {
  const router = useRouter();
  const [postcode, setPostcode] = useState("");
  const [m2, setM2] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    const cleanPostcode = postcode.replace(/\D/g, "").slice(0, 4);
    const cleanM2 = m2.replace(/\D/g, "");

    if (showInputs) {
      if (cleanPostcode.length === 4) params.set("postcode", cleanPostcode);
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
      className={`${formWidth} border border-[#b9c5b9] bg-[#fbfaf5] p-2 ${className}`}
    >
      <div className={`grid gap-0 ${gridCols}`}>
        <label
          className={`flex min-h-[62px] w-full items-center gap-3 px-4 ${
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
          <span className="flex-1">
            <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[#7b887f]">
              Postnummer
            </span>
            <input
              value={postcode}
              onChange={(event) => setPostcode(event.target.value)}
              inputMode="numeric"
              maxLength={4}
              placeholder="F.eks. 2100"
              aria-label="Postnummer"
              className="mt-1 w-full bg-transparent text-sm font-semibold outline-none placeholder:text-[#9ca59f]"
            />
          </span>
        </label>
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
              <input
                value={m2}
                onChange={(event) => setM2(event.target.value)}
                inputMode="numeric"
                placeholder={sizeFieldPlaceholder}
                aria-label={sizeFieldLabel}
                className="mt-1 w-full bg-transparent text-sm font-semibold outline-none placeholder:text-[#9ca59f]"
              />
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
