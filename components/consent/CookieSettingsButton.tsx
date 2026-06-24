"use client";

import { CONSENT_EVENT } from "@/lib/consent";

export function CookieSettingsButton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() =>
        window.dispatchEvent(new Event(`${CONSENT_EVENT}:settings`))
      }
    >
      Cookieindstillinger
    </button>
  );
}
