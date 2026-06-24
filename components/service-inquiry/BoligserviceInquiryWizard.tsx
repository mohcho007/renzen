"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "@/components/dealside/DealTypeformWizard.module.css";
import flytStyles from "@/components/flytterengoring/FlytBookingWizard.module.css";
import { TermsConfirmCard, TermsLink } from "@/components/forms/TermsConfirmCard";
import {
  createDefaultBoligserviceDetails,
  getBoligserviceSteps,
  type BoligserviceDetails,
  type BoligserviceStepId,
  type FlytningDetails,
  type ItHjaelpDetails,
  type MalerarbejdeDetails,
  type PreferredTimeWindow,
} from "@/lib/boligserviceInquiry";
import {
  SERVICE_ENTRY_OPTIONS,
  type BoligserviceSlug,
  type ServiceEntryOptionId,
  type ServiceInquiryPayload,
} from "@/lib/serviceInquiry";
import { sanitizeOptionalNote } from "@/lib/optionalNote";
import wizardStyles from "./ServiceInquiryWizard.module.css";
import { BoligserviceDateStep } from "./boligservice/BoligserviceDateStep";
import {
  DawaAddressField,
  formatStreetAddress,
  useDawaAddress,
  type DawaAddressSuggestion,
} from "./boligservice/DawaAddressField";
import { FlytningSteps } from "./boligservice/FlytningSteps";
import { MalerarbejdeSteps } from "./boligservice/MalerarbejdeSteps";
import { SimpleServiceSteps } from "./boligservice/SimpleServiceSteps";
import {
  buildBoligserviceSummaryItems,
  validateBoligserviceStep,
} from "./boligservice/boligserviceSummary";
import { OptionButton, OptionGrid } from "./boligservice/OptionCard";

type BoligserviceInquiryWizardProps = {
  serviceSlug: BoligserviceSlug;
  serviceName: string;
  embedded?: boolean;
};

function parseInitialPostcode(postcodeParam: string | null) {
  if (!postcodeParam) return "";
  const digits = postcodeParam.replace(/\D/g, "");
  return digits.length === 4 ? digits : "";
}

function withSanitizedOptionalNotes(
  details: BoligserviceDetails,
): BoligserviceDetails {
  const next = { ...details };
  if ("notes" in next && typeof next.notes === "string") {
    next.notes = sanitizeOptionalNote(next.notes);
  }
  if ("accessNotes" in next && typeof next.accessNotes === "string") {
    next.accessNotes = sanitizeOptionalNote(next.accessNotes);
  }
  return next;
}

export function BoligserviceInquiryWizard({
  serviceSlug,
  serviceName,
  embedded = true,
}: BoligserviceInquiryWizardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPostcode = parseInitialPostcode(searchParams.get("postcode"));
  const { fetchSuggestions } = useDawaAddress(initialPostcode);

  const [details, setDetails] = useState<BoligserviceDetails>(() =>
    createDefaultBoligserviceDetails(serviceSlug),
  );

  const steps = useMemo(
    () => getBoligserviceSteps(serviceSlug, details),
    [serviceSlug, details],
  );

  const [stepIndex, setStepIndex] = useState(0);
  const step = steps[stepIndex] ?? steps[0];
  const progress = ((stepIndex + 1) / steps.length) * 100;

  const [address, setAddress] = useState("");
  const [zip, setZip] = useState(initialPostcode);
  const [city, setCity] = useState("");
  const [fromSuggestions, setFromSuggestions] = useState<DawaAddressSuggestion[]>(
    [],
  );
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [toSuggestions, setToSuggestions] = useState<DawaAddressSuggestion[]>(
    [],
  );
  const [showToSuggestions, setShowToSuggestions] = useState(false);

  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTimeWindow, setPreferredTimeWindow] =
    useState<PreferredTimeWindow>("fleksibel");
  const [weekOffset, setWeekOffset] = useState(0);
  const [viewDate, setViewDate] = useState(() => new Date());
  const [entryMethod, setEntryMethod] = useState<ServiceEntryOptionId | "">("");
  const [entryOtherDetails, setEntryOtherDetails] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);
  const formColumnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activePostcode = parseInitialPostcode(searchParams.get("postcode"));
    if (!activePostcode) return;
    setZip(activePostcode);
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `https://api.dataforsyningen.dk/postnumre/${activePostcode}`,
        );
        if (!res.ok || cancelled) return;
        const data: { navn?: string } = await res.json();
        if (data.navn) setCity(data.navn);
      } catch {
        // optional
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  useEffect(() => {
    if (!detailsOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setDetailsOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [detailsOpen]);

  useEffect(() => {
    if (stepIndex >= steps.length) {
      setStepIndex(Math.max(0, steps.length - 1));
    }
  }, [stepIndex, steps.length]);

  useLayoutEffect(() => {
    if (embedded) {
      formColumnRef.current?.scrollIntoView({
        behavior: "instant",
        block: "start",
      });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
    shellRef.current?.scrollTo({ top: 0, left: 0, behavior: "instant" });
    formColumnRef.current?.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [stepIndex, embedded]);

  const handleFromAddressChange = (value: string) => {
    setAddress(value);
    setZip("");
    setCity("");
    fetchSuggestions(value, setFromSuggestions, setShowFromSuggestions);
  };

  const handleFromAddressSelect = (suggestion: DawaAddressSuggestion) => {
    const { adresse } = suggestion;
    setAddress(formatStreetAddress(adresse));
    setZip(adresse.postnr);
    setCity(adresse.postnrnavn);
    setFromSuggestions([]);
    setShowFromSuggestions(false);
  };

  const handleToAddressChange = (value: string) => {
    const flyt = details as FlytningDetails;
    setDetails({
      ...flyt,
      toAddress: value,
      toZip: "",
      toCity: "",
    });
    fetchSuggestions(value, setToSuggestions, setShowToSuggestions);
  };

  const handleToAddressSelect = (suggestion: DawaAddressSuggestion) => {
    const { adresse } = suggestion;
    const flyt = details as FlytningDetails;
    setDetails({
      ...flyt,
      toAddress: formatStreetAddress(adresse),
      toZip: adresse.postnr,
      toCity: adresse.postnrnavn,
    });
    setToSuggestions([]);
    setShowToSuggestions(false);
  };

  const canContinue = useMemo(() => {
    if (step === "kontakt") {
      return (
        firstName.trim().length > 0 &&
        lastName.trim().length > 0 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
        phone.replace(/\D/g, "").length >= 8 &&
        termsAccepted
      );
    }
    return validateBoligserviceStep(serviceSlug, step, {
      address,
      zip,
      city,
      details,
      preferredDate,
      preferredTimeWindow,
      entryMethod,
      entryOtherDetails,
    });
  }, [
    step,
    serviceSlug,
    address,
    zip,
    city,
    details,
    preferredDate,
    preferredTimeWindow,
    entryMethod,
    entryOtherDetails,
    firstName,
    lastName,
    email,
    phone,
    termsAccepted,
  ]);

  const buildPayload = useCallback((): ServiceInquiryPayload => {
    const resolvedEntry =
      entryMethod ||
      (serviceSlug === "it-hjaelp-til-hjemmet" &&
      (details as ItHjaelpDetails).remoteOk
        ? "contact_present"
        : "contact_present");

    return {
      serviceSlug,
      address,
      zip,
      city,
      preferredDate,
      preferredTimeWindow,
      entryMethod: resolvedEntry as ServiceEntryOptionId,
      entryOtherDetails,
      firstName,
      lastName,
      email,
      phone,
      termsAccepted,
      details: withSanitizedOptionalNotes(details),
    };
  }, [
    serviceSlug,
    address,
    zip,
    city,
    preferredDate,
    preferredTimeWindow,
    entryMethod,
    entryOtherDetails,
    firstName,
    lastName,
    email,
    phone,
    termsAccepted,
    details,
  ]);

  const submitInquiry = useCallback(async () => {
    setIsSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/service-inquiry/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Kunne ikke sende forespørgslen.");
      }
      setIsDone(true);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Kunne ikke sende forespørgslen. Prøv igen.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [buildPayload]);

  const goNext = useCallback(async () => {
    setError("");
    if (!canContinue) return;
    if (step === "kontakt") {
      await submitInquiry();
      return;
    }
    setStepIndex((current) => Math.min(current + 1, steps.length - 1));
  }, [canContinue, step, submitInquiry, steps.length]);

  const goBack = useCallback(() => {
    setError("");
    if (stepIndex === 0) {
      router.push(`/${serviceSlug}/`);
      return;
    }
    setStepIndex((current) => Math.max(current - 1, 0));
  }, [stepIndex, router, serviceSlug]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const showingSuggestions =
      (step === "adresse" && showFromSuggestions) ||
      (step === "adresser" && showToSuggestions);
    if (event.key === "Enter" && !event.shiftKey && !showingSuggestions) {
      event.preventDefault();
      goNext();
    }
  };

  const summaryItems = useMemo(
    () =>
      buildBoligserviceSummaryItems(
        serviceSlug,
        serviceName,
        address,
        zip,
        city,
        details,
        preferredDate,
        preferredTimeWindow,
        entryMethod,
      ),
    [
      serviceSlug,
      serviceName,
      address,
      zip,
      city,
      details,
      preferredDate,
      preferredTimeWindow,
      entryMethod,
    ],
  );

  const mobileSummaryHint = useMemo(() => {
    if (address.trim() && zip.trim()) {
      return `${address.trim()}, ${zip.trim()}`;
    }
    return serviceName;
  }, [address, zip, serviceName]);

  const renderStepContent = (currentStep: BoligserviceStepId) => {
    if (currentStep === "adresse") {
      return (
        <>
          <h2 className={styles.question}>Hvad er adressen?</h2>
          <p className={styles.hint}>
            Begynd at skrive din adresse. Vi finder postnummer og by automatisk.
          </p>
          <DawaAddressField
            id="boligservice-from-address"
            label="Adresse"
            address={address}
            zip={zip}
            city={city}
            onAddressChange={handleFromAddressChange}
            onSelect={handleFromAddressSelect}
            suggestions={fromSuggestions}
            showSuggestions={showFromSuggestions}
            setShowSuggestions={setShowFromSuggestions}
            autoFocus
          />
        </>
      );
    }

    if (currentStep === "dato") {
      const showFlex =
        serviceSlug === "malerarbejde" ||
        serviceSlug === "flytning-og-flyttehjaelp";
      const maler = details as MalerarbejdeDetails;
      const flyt = details as FlytningDetails;
      const dateFlex =
        serviceSlug === "malerarbejde"
          ? maler.dateFlexibility
          : flyt.dateFlexibility;

      return (
        <BoligserviceDateStep
          title={
            serviceSlug === "flytning-og-flyttehjaelp"
              ? "Hvornår skal flytningen ske?"
              : undefined
          }
          preferredDate={preferredDate}
          setPreferredDate={setPreferredDate}
          weekOffset={weekOffset}
          setWeekOffset={setWeekOffset}
          viewDate={viewDate}
          setViewDate={setViewDate}
          showFlexibility={showFlex}
          dateFlexibility={dateFlex}
          setDateFlexibility={(value) => {
            if (serviceSlug === "malerarbejde") {
              setDetails({ ...maler, dateFlexibility: value });
            } else if (serviceSlug === "flytning-og-flyttehjaelp") {
              setDetails({ ...flyt, dateFlexibility: value });
            }
          }}
          preferredTimeWindow={preferredTimeWindow}
          setPreferredTimeWindow={setPreferredTimeWindow}
        />
      );
    }

    if (currentStep === "adgang") {
      return (
        <>
          <h2 className={styles.question}>Adgang til boligen</h2>
          <p className={styles.hint}>
            Fortæl os hvordan vi kommer ind, når opgaven skal udføres.
          </p>
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
          {entryMethod === "other" && (
            <div className={flytStyles.entryOtherField}>
              <label className={styles.fieldLabel} htmlFor="entry-other">
                Beskriv adgangen
              </label>
              <textarea
                id="entry-other"
                className={flytStyles.entryOtherInput}
                value={entryOtherDetails}
                onChange={(event) => setEntryOtherDetails(event.target.value)}
                rows={4}
                autoFocus
              />
            </div>
          )}
        </>
      );
    }

    if (currentStep === "kontakt") {
      return (
        <>
          <h2 className={styles.question}>Dine kontaktoplysninger</h2>
          <p className={styles.hint}>
            Vi sender dit tilbud til denne e-mail inden for 24 timer.
          </p>
          <div className={styles.fieldStack}>
            <div>
              <label className={styles.fieldLabel} htmlFor="inquiry-first-name">
                Fornavn
              </label>
              <input
                id="inquiry-first-name"
                className={styles.input}
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                autoFocus
              />
            </div>
            <div>
              <label className={styles.fieldLabel} htmlFor="inquiry-last-name">
                Efternavn
              </label>
              <input
                id="inquiry-last-name"
                className={styles.input}
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
              />
            </div>
            <div>
              <label className={styles.fieldLabel} htmlFor="inquiry-email">
                E-mail
              </label>
              <input
                id="inquiry-email"
                className={styles.input}
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div>
              <label className={styles.fieldLabel} htmlFor="inquiry-phone">
                Telefon
              </label>
              <input
                id="inquiry-phone"
                className={styles.input}
                inputMode="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </div>
            <TermsConfirmCard
              checked={termsAccepted}
              onChange={setTermsAccepted}
              ariaLabel="Giv samtykke til behandling af oplysninger"
            >
              Jeg giver samtykke til, at Renzen må behandle mine oplysninger med
              henblik på at udarbejde et tilbud og kontakte mig om min
              forespørgsel. Jeg har læst og accepterer <TermsLink />.
            </TermsConfirmCard>
          </div>
        </>
      );
    }

    if (serviceSlug === "malerarbejde") {
      return (
        <MalerarbejdeSteps
          step={currentStep}
          details={details as MalerarbejdeDetails}
          onChange={setDetails}
          entryMethod={entryMethod}
          setEntryMethod={setEntryMethod}
          entryOtherDetails={entryOtherDetails}
          setEntryOtherDetails={setEntryOtherDetails}
        />
      );
    }

    if (serviceSlug === "flytning-og-flyttehjaelp") {
      return (
        <FlytningSteps
          step={currentStep}
          details={details as FlytningDetails}
          onChange={setDetails}
          fromAddress={address}
          fromZip={zip}
          fromCity={city}
          fromSuggestions={fromSuggestions}
          showFromSuggestions={showFromSuggestions}
          setShowFromSuggestions={setShowFromSuggestions}
          onFromAddressChange={handleFromAddressChange}
          onFromAddressSelect={handleFromAddressSelect}
          toSuggestions={toSuggestions}
          showToSuggestions={showToSuggestions}
          setShowToSuggestions={setShowToSuggestions}
          onToAddressChange={handleToAddressChange}
          onToAddressSelect={handleToAddressSelect}
        />
      );
    }

    if (currentStep === "opgave") {
      return (
        <SimpleServiceSteps
          slug={serviceSlug}
          details={details}
          onChange={setDetails}
        />
      );
    }

    return null;
  };

  const renderSummary = () => (
    <>
      <p className={wizardStyles.summaryEyebrow}>Din forespørgsel</p>
      <h3 className={wizardStyles.summaryTitle}>{serviceName}</h3>
      <dl className={wizardStyles.summaryList}>
        {summaryItems
          .filter(([, value]) =>
            Array.isArray(value) ? value.length > 0 : value.length > 0,
          )
          .map(([label, value]) => (
            <div key={label} className={wizardStyles.summaryRow}>
              <dt>{label}</dt>
              <dd>
                {Array.isArray(value) ? (
                  <ul className={wizardStyles.summaryValueList}>
                    {value.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  value
                )}
              </dd>
            </div>
          ))}
      </dl>
      <p className={wizardStyles.summaryNote}>
        Uforpligtende tilbud inden for 24 timer. Ingen betaling nu.
      </p>
    </>
  );

  if (isDone) {
    return (
      <div
        className={`${styles.shell} ${embedded ? wizardStyles.embeddedShell : ""}`}
      >
        <main className={styles.successMain}>
          <div className={`${styles.frame} ${styles.step}`}>
            <div className={styles.successIcon}>✓</div>
            <h2 className={styles.successTitle}>Tak for din forespørgsel</h2>
            <p className={styles.successCopy}>
              Vi har modtaget din forespørgsel om {serviceName.toLowerCase()}.
              Du hører fra os inden for 24 timer på {email}.
            </p>
            {!embedded && (
              <Link href={`/${serviceSlug}/`} className={styles.backBtn}>
                Tilbage til {serviceName.toLowerCase()}
              </Link>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      ref={shellRef}
      className={`${styles.shell} ${embedded ? wizardStyles.embeddedShell : ""}`}
      onKeyDown={handleKeyDown}
    >
      <header className={styles.top}>
        <div className={styles.topInner}>
          <div className={styles.topRow}>
            <button type="button" className={styles.backBtn} onClick={goBack}>
              ← {stepIndex === 0 ? "Tilbage" : "Forrige"}
            </button>
            <span className={styles.stepMeta}>
              {stepIndex + 1} / {steps.length}
            </span>
          </div>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      <div className={styles.workspace}>
        <div className={styles.formColumn} ref={formColumnRef}>
          <div className={`${styles.frame} ${styles.step}`} key={step}>
            {renderStepContent(step)}
            {error && <p className={styles.error}>{error}</p>}
          </div>
        </div>

        <aside
          className={`${styles.summaryPanel} ${wizardStyles.summaryPanel}`}
          aria-label="Oversigt"
        >
          {renderSummary()}
        </aside>
      </div>

      <div className={styles.bottomChrome}>
        <div className={`${styles.mobileCheckoutBar} ${wizardStyles.mobileCheckoutBar}`} aria-label="Forespørgselsoversigt">
          <div className={styles.mobileCheckoutLeft}>
            <p className={wizardStyles.mobileSummaryHint}>{mobileSummaryHint}</p>
            <button
              type="button"
              className={styles.detailsLink}
              onClick={() => setDetailsOpen(true)}
              aria-expanded={detailsOpen}
            >
              Se detaljer
            </button>
          </div>
          <button
            type="button"
            className={`${styles.continueBtn} ${styles.mobileContinueBtn}`}
            disabled={!canContinue || isSubmitting}
            onClick={goNext}
          >
            {isSubmitting
              ? "Sender…"
              : step === "kontakt"
                ? "Send forespørgsel"
                : "Fortsæt"}
            {!isSubmitting && <span aria-hidden>→</span>}
          </button>
        </div>

        <footer className={styles.footer}>
          <div className={styles.footerGrid}>
            <div className={styles.footerInner}>
              <span className={styles.footerHint}>
                {step === "kontakt"
                  ? "Tryk Enter for at sende"
                  : "Tryk Enter for at fortsætte"}
              </span>
              <button
                type="button"
                className={styles.continueBtn}
                disabled={!canContinue || isSubmitting}
                onClick={goNext}
              >
                {isSubmitting
                  ? "Sender…"
                  : step === "kontakt"
                    ? "Send forespørgsel"
                    : "Fortsæt"}
                {!isSubmitting && <span aria-hidden>→</span>}
              </button>
            </div>
          </div>
        </footer>
      </div>

      <div
        className={`${styles.sheetBackdrop} ${detailsOpen ? styles.sheetBackdropOpen : ""}`}
        onClick={() => setDetailsOpen(false)}
        aria-hidden={!detailsOpen}
      />
      <div
        id="boligservice-details-sheet"
        className={`${styles.sheetPanel} ${detailsOpen ? styles.sheetPanelOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="boligservice-details-title"
        aria-hidden={!detailsOpen}
      >
        <div className={styles.sheetHandle} aria-hidden />
        <div className={styles.sheetHeader}>
          <h2 id="boligservice-details-title" className={styles.sheetTitle}>
            Din forespørgsel
          </h2>
          <button
            type="button"
            className={styles.sheetClose}
            onClick={() => setDetailsOpen(false)}
            aria-label="Luk forespørgselsoversigt"
          >
            ×
          </button>
        </div>
        <div className={styles.sheetBody}>{renderSummary()}</div>
      </div>
    </div>
  );
}
