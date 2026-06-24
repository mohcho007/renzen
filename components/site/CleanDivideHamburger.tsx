"use client";

interface CleanDivideHamburgerProps {
  toggled: boolean;
  toggle: (open: boolean) => void;
  label: string;
}

const rows = [15, 23, 31] as const;

export function CleanDivideHamburger({
  toggled,
  toggle,
  label,
}: CleanDivideHamburgerProps) {
  const sharedBar =
    "absolute h-0.5 bg-[#52525b] rounded-full transition-all duration-[120ms] ease-linear";

  return (
    <button
      type="button"
      onClick={() => toggle(!toggled)}
      aria-label={label}
      aria-expanded={toggled}
      className="relative h-12 w-12 cursor-pointer select-none"
    >
      {rows.map((top) => (
        <span
          key={`base-${top}`}
          aria-hidden="true"
          className={`${sharedBar} left-[11px] w-[26px] ${
            toggled ? "opacity-0" : "opacity-100"
          }`}
          style={{ top }}
        />
      ))}

      <span
        aria-hidden="true"
        className={`${sharedBar} left-[11px] w-[13px] ${
          toggled ? "opacity-100" : "opacity-0"
        }`}
        style={{
          top: 15,
          transform: toggled
            ? "translate(2.71px, 4.12px) rotate(45deg)"
            : "none",
        }}
      />
      <span
        aria-hidden="true"
        className={`${sharedBar} left-6 w-[13px] ${
          toggled ? "opacity-100" : "opacity-0"
        }`}
        style={{
          top: 15,
          transform: toggled
            ? "translate(-2.71px, 4.12px) rotate(-45deg)"
            : "none",
        }}
      />
      <span
        aria-hidden="true"
        className={`${sharedBar} left-[11px] w-[13px] opacity-0`}
        style={{
          top: 23,
          transform: toggled ? "translateX(-7.06px)" : "none",
        }}
      />
      <span
        aria-hidden="true"
        className={`${sharedBar} left-6 w-[13px] opacity-0`}
        style={{
          top: 23,
          transform: toggled ? "translateX(7.06px)" : "none",
        }}
      />
      <span
        aria-hidden="true"
        className={`${sharedBar} left-[11px] w-[13px] ${
          toggled ? "opacity-100" : "opacity-0"
        }`}
        style={{
          top: 31,
          transform: toggled
            ? "translate(2.71px, -4.12px) rotate(-45deg)"
            : "none",
        }}
      />
      <span
        aria-hidden="true"
        className={`${sharedBar} left-6 w-[13px] ${
          toggled ? "opacity-100" : "opacity-0"
        }`}
        style={{
          top: 31,
          transform: toggled
            ? "translate(-2.71px, -4.12px) rotate(45deg)"
            : "none",
        }}
      />
    </button>
  );
}
