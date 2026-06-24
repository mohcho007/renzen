"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Check,
  Clock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  RenzenEditorialFooter,
  RenzenEditorialHeader,
} from "@/components/site/RenzenEditorialChrome";
import editorialStyles from "@/components/site/RenzenEditorial.module.css";
import styles from "@/components/kontakt/KontaktPage.module.css";
import { siteConfig } from "@/lib/siteConfig";

const openingHours = "Mandag–fredag 08:00–17:00";

const trustSignals = [
  "Forsikrede Zenmestre",
  "100% tilfredshedsgaranti",
  "Dansk kundeservice",
];

const quickPaths = [
  {
    eyebrow: "Booking",
    title: "Beregn pris og book",
    text: "Se din pris med det samme og book rengøring på under 60 sekunder.",
    href: "/book-rengoering",
    label: "Beregn pris",
  },
  {
    eyebrow: "Renzen Klub",
    title: "Se introtilbud",
    text: "Medlemsfordele, Zen-kreditter og intropris fra 199 kr.",
    href: "/klub/",
    label: "Gå til Renzen Klub",
  },
  {
    eyebrow: "FAQ",
    title: "Find svar med det samme",
    text: "Priser, booking, forsikring, aflysning og meget mere.",
    href: "/faq",
    label: "Gå til FAQ",
  },
  {
    eyebrow: "Karriere",
    title: "Bliv Zenmester",
    text: "Arbejd sammen med Renzen — fair vilkår og fleksible opgaver.",
    href: "/bliv-zenmester",
    label: "Læs mere",
  },
];

export function KontaktPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const addressLine = [siteConfig.address.postalCode, siteConfig.address.city]
    .filter(Boolean)
    .join(" ");

  const phoneHref = `tel:+45${siteConfig.phone.replace(/\s/g, "")}`;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const subject = String(data.get("subject") ?? "Henvendelse fra renzen.dk");
    const message = String(data.get("message") ?? "");

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/kontakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const result = (await response.json()) as {
        success?: boolean;
        message?: string;
      };

      if (!response.ok || !result.success) {
        setSubmitError(
          result.message ?? "Noget gik galt. Prøv igen eller ring til os.",
        );
        return;
      }

      setSubmittedEmail(email);
      setIsSuccess(true);
      form.reset();
    } catch {
      setSubmitError("Noget gik galt. Prøv igen eller ring til os.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fbfaf5] text-[#203129]">
      <RenzenEditorialHeader />

      <main>
        <section className="relative overflow-hidden bg-[#dfe9dc]">
          <div className="grid min-h-[690px] w-full lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative z-10 order-2 flex flex-col justify-center px-6 py-16 sm:px-10 lg:order-1 lg:pl-[114px] lg:pr-16 lg:py-20">
              <Image
                src="/shapes/hero-vector.svg"
                alt=""
                width={160}
                height={134}
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 right-0 z-0 hidden h-auto w-[120px] opacity-70 sm:block lg:w-[160px]"
              />
              <p className="relative z-10 mb-6 text-xs font-bold uppercase tracking-[0.18em] text-[#41614f]">
                Kontakt os
              </p>
              <h1 className="relative z-10 max-w-[680px] font-display text-[48px] font-semibold leading-[0.98] tracking-[-0.05em] text-[#173c2c] sm:text-[66px] lg:text-[78px]">
                Personlig service, når du har brug for os
              </h1>
              <p className="relative z-10 mt-7 max-w-[560px] text-base font-medium leading-7 text-[#536159] sm:text-lg">
                Spørgsmål til booking, din aftale eller en af vores services?
                Ring, skriv eller send en besked — vi vender tilbage hurtigst
                muligt.
              </p>
              <div className="relative z-10 mt-9 flex flex-wrap gap-3">
                <a
                  href={phoneHref}
                  className="inline-flex min-h-[62px] items-center gap-2 rounded-[2px] bg-[#173c2c] px-7 text-sm font-bold text-white transition-colors hover:bg-[#0f2d20]"
                >
                  Ring {siteConfig.phone}
                  <Phone size={15} aria-hidden="true" />
                </a>
                <Link
                  href="/book-rengoering"
                  className="inline-flex min-h-[62px] items-center gap-2 rounded-[2px] border border-[#173c2c] px-7 text-sm font-bold text-[#173c2c] transition-colors hover:bg-white"
                >
                  Beregn pris
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
              <div className="relative z-10 mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-[#536159]">
                {trustSignals.map((item) => (
                  <span key={item} className="flex items-center gap-2">
                    <Check size={14} aria-hidden="true" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div
              className={`relative order-1 min-h-[290px] lg:order-2 lg:min-h-full ${editorialStyles.heroImage}`}
            >
              <Image
                src="/hand.jpg"
                alt="Renzen kundeservice"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover object-right"
              />
            </div>
          </div>
        </section>

        <section className="border-b border-[#dfe2da] bg-[#e7e4da] px-6 py-12 sm:px-10 lg:px-14">
          <div className="mx-auto grid max-w-[1100px] gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <a
              href={phoneHref}
              className={`${styles.contactCard} flex gap-4 rounded-[4px] border border-[#d5dbd2] bg-white p-6`}
            >
              <Phone size={22} className="mt-0.5 shrink-0 text-[#41614f]" aria-hidden="true" />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6b7a72]">
                  Telefon
                </p>
                <p className="mt-2 font-display text-xl font-semibold text-[#173c2c]">
                  {siteConfig.phone}
                </p>
                <p className="mt-1 text-sm text-[#536159]">
                  Ring i åbningstiden — vi tager telefonen.
                </p>
              </div>
            </a>

            <a
              href={`mailto:${siteConfig.email}`}
              className={`${styles.contactCard} flex gap-4 rounded-[4px] border border-[#d5dbd2] bg-white p-6`}
            >
              <Mail size={22} className="mt-0.5 shrink-0 text-[#41614f]" aria-hidden="true" />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6b7a72]">
                  E-mail
                </p>
                <p className="mt-2 font-display text-xl font-semibold text-[#173c2c]">
                  {siteConfig.email}
                </p>
                <p className="mt-1 text-sm text-[#536159]">
                  Skriv når det passer dig — vi svarer inden for 24 timer.
                </p>
              </div>
            </a>

            <div
              className={`${styles.contactCard} flex gap-4 rounded-[4px] border border-[#d5dbd2] bg-white p-6 sm:col-span-2 lg:col-span-1`}
            >
              <Clock size={22} className="mt-0.5 shrink-0 text-[#41614f]" aria-hidden="true" />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6b7a72]">
                  Åbningstider
                </p>
                <p className="mt-2 font-display text-xl font-semibold text-[#173c2c]">
                  {openingHours}
                </p>
                {addressLine && (
                  <p className="mt-1 flex items-start gap-1.5 text-sm text-[#536159]">
                    <MapPin size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
                    <span>
                      {siteConfig.address.street && (
                        <>
                          {siteConfig.address.street}
                          <br />
                        </>
                      )}
                      {addressLine}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-16 sm:px-10 sm:py-20 lg:px-14">
          <div className="mx-auto grid max-w-[1100px] gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div
              className={`${styles.formPanel} relative overflow-hidden rounded-[4px] p-6 sm:p-8 lg:p-10`}
            >
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#41614f]">
                Skriv til os
              </p>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.03em] text-[#173c2c] sm:text-4xl">
                Send en besked
              </h2>
              <p className="mt-3 max-w-[480px] text-sm leading-relaxed text-[#536159] sm:text-base">
                Udfyld formularen — vi sender en bekræftelse til din e-mail og
                svarer inden for 24 timer på hverdage.
              </p>

              {isSuccess ? (
                <div
                  className="mt-8 rounded-[4px] border border-[#d5dbd2] bg-[#eef2eb] p-6 sm:p-8"
                  role="status"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#173c2c] text-lg font-bold text-white">
                    ✓
                  </div>
                  <h3 className="mt-4 font-display text-2xl font-semibold tracking-[-0.03em] text-[#173c2c]">
                    Tak for din besked
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#536159] sm:text-base">
                    Vi har modtaget din henvendelse. Du hører fra os inden for
                    24 timer på{" "}
                    {submittedEmail ? (
                      <span className="font-semibold text-[#173c2c]">
                        {submittedEmail}
                      </span>
                    ) : (
                      "din e-mail"
                    )}
                    .
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSuccess(false);
                      setSubmittedEmail("");
                    }}
                    className="mt-6 text-sm font-bold text-[#41614f] underline underline-offset-2 hover:text-[#173c2c]"
                  >
                    Send en ny besked
                  </button>
                </div>
              ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="kontakt-name"
                      className="block text-sm font-bold text-[#173c2c]"
                    >
                      Navn
                    </label>
                    <input
                      id="kontakt-name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      className="mt-2 w-full rounded-[4px] border border-[#d5dbd2] bg-[#fbfaf5] px-4 py-3 text-sm outline-none ring-[#173c2c] transition-shadow focus:bg-white focus:ring-2"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="kontakt-email"
                      className="block text-sm font-bold text-[#173c2c]"
                    >
                      E-mail
                    </label>
                    <input
                      id="kontakt-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      className="mt-2 w-full rounded-[4px] border border-[#d5dbd2] bg-[#fbfaf5] px-4 py-3 text-sm outline-none ring-[#173c2c] transition-shadow focus:bg-white focus:ring-2"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="kontakt-subject"
                    className="block text-sm font-bold text-[#173c2c]"
                  >
                    Emne
                  </label>
                  <input
                    id="kontakt-subject"
                    name="subject"
                    type="text"
                    defaultValue="Henvendelse fra renzen.dk"
                    className="mt-2 w-full rounded-[4px] border border-[#d5dbd2] bg-[#fbfaf5] px-4 py-3 text-sm outline-none ring-[#173c2c] transition-shadow focus:bg-white focus:ring-2"
                  />
                </div>
                <div>
                  <label
                    htmlFor="kontakt-message"
                    className="block text-sm font-bold text-[#173c2c]"
                  >
                    Besked
                  </label>
                  <textarea
                    id="kontakt-message"
                    name="message"
                    required
                    rows={6}
                    placeholder="Fortæl os, hvad vi kan hjælpe med..."
                    className="mt-2 w-full resize-y rounded-[4px] border border-[#d5dbd2] bg-[#fbfaf5] px-4 py-3 text-sm outline-none ring-[#173c2c] transition-shadow placeholder:text-[#8a968f] focus:bg-white focus:ring-2"
                  />
                </div>
                {submitError && (
                  <p
                    className="rounded-[4px] border border-[#e8c4c4] bg-[#fdf3f3] px-4 py-3 text-sm text-[#8b3a3a]"
                    role="alert"
                  >
                    {submitError}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[4px] bg-[#173c2c] px-5 text-sm font-bold text-white hover:bg-[#0f2d20] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {isSubmitting ? "Sender..." : "Send besked"}
                  <ArrowRight size={15} aria-hidden="true" />
                </button>
              </form>
              )}
            </div>

            <div className="space-y-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6b7a72]">
                  Tryghed
                </p>
                <h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.03em] text-[#173c2c]">
                  Du er i gode hænder
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-[#536159] sm:text-base">
                  Renzen samler booking, forsikring og kundeservice ét sted —
                  så du slipper for at koordinere med flere aktører.
                </p>
              </div>

              <div className="space-y-4">
                <article className="flex gap-4 rounded-[4px] border border-[#dfe2da] bg-white p-5">
                  <ShieldCheck
                    size={22}
                    className="mt-0.5 shrink-0 text-[#41614f]"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-display text-lg font-semibold text-[#173c2c]">
                      Fuldt forsikret
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-[#536159]">
                      Renzen er dækket med ansvars- og indboforsikring, så du
                      er tryg, hvis der sker uheld under rengøringen.
                    </p>
                  </div>
                </article>

                <article className="flex gap-4 rounded-[4px] border border-[#dfe2da] bg-white p-5">
                  <Sparkles
                    size={22}
                    className="mt-0.5 shrink-0 text-[#41614f]"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-display text-lg font-semibold text-[#173c2c]">
                      Tilfredshedsgaranti
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-[#536159]">
                      Er du ikke tilfreds, kontakter du os inden for 24 timer —
                      så udbedrer vi det kvit og frit.
                    </p>
                  </div>
                </article>
              </div>

              <div className="rounded-[4px] border border-[#dfe2da] bg-[#eef2eb] p-6">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6b7a72]">
                  CVR
                </p>
                <p className="mt-2 font-display text-lg font-semibold text-[#173c2c]">
                  {siteConfig.legalName}
                </p>
                <p className="mt-1 text-sm text-[#536159]">
                  CVR {siteConfig.cvr}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[#dfe2da] bg-[#eef2eb] px-6 py-16 sm:px-10 lg:px-14">
          <div className="mx-auto max-w-[1100px]">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6b7a72]">
              Hurtige veje
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.03em] text-[#173c2c]">
              Find det, du leder efter
            </h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {quickPaths.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className={`${styles.pathCard} group block rounded-[4px] border border-[#d5dbd2] bg-white p-6`}
                >
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#41614f]">
                    {item.eyebrow}
                  </p>
                  <h3 className="mt-3 font-display text-xl font-semibold text-[#173c2c]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#536159]">
                    {item.text}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#173c2c]">
                    {item.label}
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-[#dfe2da] bg-[#173c2c] px-6 py-16 text-white sm:px-10 lg:px-14">
          <div className="mx-auto flex max-w-[900px] flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-[-0.03em]">
                Klar til at komme i gang?
              </h2>
              <p className="mt-3 text-sm text-white/75">
                Beregn din pris og book rengøring — eller ring os på{" "}
                <a
                  href={phoneHref}
                  className="font-semibold text-white underline underline-offset-2 hover:text-white/90"
                >
                  {siteConfig.phone}
                </a>
                .
              </p>
            </div>
            <Link
              href="/klub/"
              className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-[4px] bg-white px-5 text-sm font-bold text-[#173c2c] hover:bg-[#f4f1e8]"
            >
              Se introtilbud
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <RenzenEditorialFooter />
    </div>
  );
}
