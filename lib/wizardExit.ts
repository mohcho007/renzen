const WIZARD_RETURN_KEY = "renzen:wizard-return-url";

const FROM_PARAM_PATHS: Record<string, string> = {
  klub: "/klub/",
  "privat-rengoring": "/privat-rengoring/",
  home: "/",
};

const WIZARD_PATH_PREFIXES = ["/book-rengoering", "/introdeal"];

function normalizeReturnPath(path: string): string | null {
  if (!path) return null;
  try {
    const url = new URL(path, window.location.origin);
    if (url.origin !== window.location.origin) return null;
    const pathname = url.pathname.endsWith("/")
      ? url.pathname
      : `${url.pathname}/`;
    if (WIZARD_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
      return null;
    }
    return `${pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}

function referrerToReturnPath(): string | null {
  if (typeof document === "undefined" || !document.referrer) return null;
  return normalizeReturnPath(document.referrer);
}

export function captureWizardReturnUrl(fromParam: string | null): void {
  if (typeof window === "undefined") return;
  if (sessionStorage.getItem(WIZARD_RETURN_KEY)) return;

  const fromPath = fromParam ? FROM_PARAM_PATHS[fromParam] : null;
  if (fromPath) {
    sessionStorage.setItem(WIZARD_RETURN_KEY, fromPath);
    return;
  }

  const referrerPath = referrerToReturnPath();
  if (referrerPath) {
    sessionStorage.setItem(WIZARD_RETURN_KEY, referrerPath);
  }
}

export function getStoredWizardReturnUrl(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(WIZARD_RETURN_KEY);
}

export function clearStoredWizardReturnUrl(): void {
  try {
    sessionStorage.removeItem(WIZARD_RETURN_KEY);
  } catch {
    // sessionStorage may be unavailable in private mode
  }
}

type WizardExitRouter = {
  back: () => void;
  push: (url: string) => void;
};

export function exitWizardNavigation({
  router,
  variant,
  onBack,
}: {
  router: WizardExitRouter;
  variant: "dealpage2" | "book2";
  onBack: () => void;
}): void {
  const stored = getStoredWizardReturnUrl();
  if (stored) {
    clearStoredWizardReturnUrl();
    router.push(stored);
    return;
  }

  if (variant === "dealpage2") {
    onBack();
    return;
  }

  if (typeof window !== "undefined" && window.history.length > 1) {
    router.back();
    return;
  }

  router.push("/privat-rengoring/");
}
