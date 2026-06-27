"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  RenzenEditorialFooter,
  RenzenEditorialHeader,
} from "@/components/site/RenzenEditorialChrome";
import { BookingConfirmationTracker } from "@/components/booking/BookingConfirmationTracker";
import {
  consumeBookingConfirmation,
  type BookingConfirmationPayload,
} from "@/lib/bookingConfirmation";
import { siteConfig } from "@/lib/siteConfig";
import "./booking-confirmation.css";

function formatKr(amount: number) {
  return `${amount.toLocaleString("da-DK", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })} kr.`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("da-DK", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function buildNextSteps(payload: BookingConfirmationPayload) {
  const isFlyt = payload.source === "flyt";
  const serviceNoun = isFlyt ? "flytterengøring" : "rengøring";

  const steps = [
    {
      title: "Bekræftelse på e-mail",
      text: `Vi sender en bekræftelse til ${payload.email} inden for kort tid med alle detaljer om din ${isFlyt ? "flytterengøring" : "booking"}.`,
    },
    {
      title: "Vi matcher dig med en Zenmester",
      text: isFlyt
        ? "Du får besked, når din flytterengøring er bekræftet, og vi sender en påmindelse før besøget."
        : "Du får besked, når din rengøring er bekræftet, og vi sender en påmindelse før besøget.",
    },
    {
      title: "Adgang på rengøringsdagen",
      text: `Din Zenmester ankommer i det valgte tidsrum. Sørg for, at adgang er som aftalt (nøgle, kode eller dørkode).`,
    },
    {
      title: "Fakturering efter besøget",
      text: payload.isKlub
        ? `Du betaler ikke nu. Fakturering sker først efter ${serviceNoun}en — introprisen og medlemsfordele gælder som aftalt ved booking.`
        : `Du betaler ikke nu. Fakturering sker først efter ${serviceNoun}en er gennemført.`,
    },
  ];

  if (payload.isKlub) {
    steps.push({
      title: "Renzen Klub aktiveres",
      text: "Dine Zenkreditter og medlemsfordele er klar — du kan bruge dem til ekstra hjælp i hjemmet.",
    });
  }

  return steps;
}

type ConfirmationContentProps = {
  payload: BookingConfirmationPayload;
  skipTracking?: boolean;
  showPreviewBanner?: boolean;
};

function ConfirmationContent({
  payload,
  skipTracking = false,
  showPreviewBanner = false,
}: ConfirmationContentProps) {
  const phoneHref = `tel:+45${siteConfig.phone.replace(/\s/g, "")}`;
  const steps = buildNextSteps(payload);

  return (
  <>
    {!skipTracking ? <BookingConfirmationTracker payload={payload} /> : null}
    <div
      className="bcPage"
      data-page="booking-confirmation"
      data-booking-source={payload.source}
      data-booking-id={payload.bookingId}
      data-booking-value={payload.totalTodayKr}
      data-booking-currency="DKK"
      data-klub={payload.isKlub ? "true" : "false"}
      data-frequency={payload.frequencyId}
    >
      {showPreviewBanner ? (
        <div className="bcPreviewBanner" role="status">
          Forhåndsvisning — ikke en rigtig booking
        </div>
      ) : null}
      <RenzenEditorialHeader />
      <main className="bcMain">
        <div className="bcInner">
          <header className="bcHero">
            <div className="bcCheck" aria-hidden="true">
              ✓
            </div>
            <h1 className="bcTitle">Tak, {payload.firstName}</h1>
            <p className="bcLead">
              {payload.source === "flyt"
                ? "Din flytterengøring er modtaget. Her er et overblik over det, du har bestilt."
                : "Din booking er modtaget. Her er et overblik over det, du har bestilt."}
            </p>
            <p className="bcRef">
              Reference: <strong>{payload.bookingId}</strong>
            </p>
          </header>

          <section className="bcCard" aria-labelledby="booking-summary-title">
            <h2 id="booking-summary-title" className="bcCardTitle">
              Bookingoversigt
            </h2>
            <div className="bcSummaryGrid">
              <div className="bcSummaryItem">
                <span className="bcSummaryLabel">Dato</span>
                <span className="bcSummaryValue">{formatDate(payload.date)}</span>
              </div>
              <div className="bcSummaryItem">
                <span className="bcSummaryLabel">Tid</span>
                <span className="bcSummaryValue">{payload.timeSlot}</span>
              </div>
              <div className="bcSummaryItem">
                <span className="bcSummaryLabel">Adresse</span>
                <span className="bcSummaryValue">
                  {payload.address}
                  <br />
                  {payload.postcode} {payload.city}
                </span>
              </div>
              {payload.source === "flyt" ? (
                <div className="bcSummaryItem">
                  <span className="bcSummaryLabel">Stand</span>
                  <span className="bcSummaryValue">
                    {payload.standLabel ?? `Stand ${payload.serviceLabel}`}
                  </span>
                </div>
              ) : (
                <div className="bcSummaryItem">
                  <span className="bcSummaryLabel">Frekvens</span>
                  <span className="bcSummaryValue">{payload.frequency}</span>
                </div>
              )}
              <div className="bcSummaryItem">
                <span className="bcSummaryLabel">Størrelse</span>
                <span className="bcSummaryValue">{payload.squareMeters} m²</span>
              </div>
              <div className="bcSummaryItem">
                <span className="bcSummaryLabel">Type</span>
                <span className="bcSummaryValue">
                  {payload.source === "flyt" ? "Flytterengøring" : payload.serviceLabel}
                  {payload.isKlub ? " · Renzen Klub" : ""}
                </span>
              </div>
            </div>

            {(payload.boligstandSurchargeKr && payload.boligstandSurchargeKr > 0) ||
            payload.extras.length > 0 ? (
              <>
                <div className="bcDivider" />
                <div className="bcLineItems">
                  {payload.boligstandSurchargeKr && payload.boligstandSurchargeKr > 0 ? (
                    <div className="bcLineItem">
                      <span className="bcLineItemLabel">
                        Ekstra tid
                        {payload.boligstandLabel ? (
                          <span className="bcLineItemSub">{payload.boligstandLabel}</span>
                        ) : null}
                      </span>
                      <span className="bcLineItemValue">
                        {formatKr(payload.boligstandSurchargeKr)}
                      </span>
                    </div>
                  ) : null}
                  {payload.extras.map((extra) => (
                    <div key={extra.id} className="bcLineItem">
                      <span className="bcLineItemLabel">
                        {extra.label}
                        {extra.quantity > 1 ? (
                          <span className="bcLineItemSub">× {extra.quantity}</span>
                        ) : null}
                      </span>
                      <span className="bcLineItemValue">
                        {formatKr(extra.price * extra.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : null}

            <div className="bcTotal">
              <span>Samlet pris</span>
              <strong>{formatKr(payload.totalTodayKr)}</strong>
            </div>

            {payload.recurringKr !== undefined && payload.isKlub ? (
              <p className="bcRecurring">
                Din faste pris herefter: <strong>{formatKr(payload.recurringKr)}</strong> pr.
                rengøring
              </p>
            ) : null}
          </section>

          <section className="bcSteps" aria-labelledby="next-steps-title">
            <h2 id="next-steps-title" className="bcStepsTitle">
              Hvad sker der nu?
            </h2>
            <ol className="bcStepList">
              {steps.map((step, index) => (
                <li key={step.title} className="bcStep">
                  <span className="bcStepNum" aria-hidden="true">
                    {index + 1}
                  </span>
                  <div className="bcStepBody">
                    <strong>{step.title}</strong>
                    <p>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="bcSupport">
            <p>Har du spørgsmål til din booking? Vi er klar til at hjælpe.</p>
            <div className="bcSupportLinks">
              <Link href="/kontakt/">Kontakt os</Link>
              <a href={phoneHref}>{siteConfig.phone}</a>
            </div>
          </section>

          <div className="bcCtas">
            <Link href="/" className="bcCtaPrimary">
              Til forsiden
            </Link>
            {payload.source === "flyt" ? (
              <Link href="/flytterengoring/" className="bcCtaSecondary">
                Tilbage til flytterengøring
              </Link>
            ) : payload.source === "airbnb" ? (
              <Link href="/airbnb-rengoring/" className="bcCtaSecondary">
                Tilbage til Airbnb rengøring
              </Link>
            ) : payload.isKlub ? (
              <Link href="/klub/" className="bcCtaSecondary">
                Læs om Renzen Klub
              </Link>
            ) : null}
          </div>
        </div>
      </main>
      <RenzenEditorialFooter />
    </div>
  </>
  );
}

function FallbackContent() {
  return (
    <div className="bcPage" data-page="booking-confirmation">
      <RenzenEditorialHeader />
      <main className="bcMain">
        <div className="bcInner bcFallback">
          <h1 className="bcTitle">Vi kunne ikke finde en aktiv booking</h1>
          <p className="bcLead">
            Denne side viser en bekræftelse lige efter du har gennemført en booking. Hvis du
            lige har booket, tjek din e-mail — ellers kan du starte en ny booking her.
          </p>
          <div className="bcCtas">
            <Link href="/book-rengoering/" className="bcCtaPrimary">
              Book rengøring
            </Link>
            <Link href="/flytterengoring/" className="bcCtaSecondary">
              Flytterengøring
            </Link>
          </div>
        </div>
      </main>
      <RenzenEditorialFooter />
    </div>
  );
}

type BookingConfirmationPageProps = {
  previewPayload?: BookingConfirmationPayload;
  skipTracking?: boolean;
  showPreviewBanner?: boolean;
};

export function BookingConfirmationPage({
  previewPayload,
  skipTracking = false,
  showPreviewBanner = false,
}: BookingConfirmationPageProps = {}) {
  const [payload, setPayload] = useState<BookingConfirmationPayload | null | undefined>(
    previewPayload ?? undefined,
  );

  useEffect(() => {
    if (previewPayload) return;
    setPayload(consumeBookingConfirmation());
  }, [previewPayload]);

  if (payload === undefined) {
    return (
      <div className="bcPage" data-page="booking-confirmation">
        <RenzenEditorialHeader />
        <main className="bcMain">
          <div className="bcInner bcFallback">
            <p className="bcLead">Indlæser…</p>
          </div>
        </main>
        <RenzenEditorialFooter />
      </div>
    );
  }

  if (!payload) {
    return <FallbackContent />;
  }

  return (
    <ConfirmationContent
      payload={payload}
      skipTracking={skipTracking}
      showPreviewBanner={showPreviewBanner}
    />
  );
}
