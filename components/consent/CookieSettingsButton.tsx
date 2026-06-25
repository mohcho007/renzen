"use client";

import { CONSENT_SETTINGS_EVENT } from "@/lib/consent";

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
        window.dispatchEvent(new Event(CONSENT_SETTINGS_EVENT))
      }
    >
      Cookieindstillinger
    </button>
  );
}
