"use client";

import Link from "next/link";
import { Fragment, useState, type ReactNode } from "react";
import {
  ArrowRight,
  ChevronDown,
  Copy,
  Sparkles,
  Tag,
} from "lucide-react";
import {
  RenzenEditorialFooter,
  RenzenEditorialHeader,
} from "@/components/site/RenzenEditorialChrome";
import { RenzenKlubPromoSection } from "@/components/site/RenzenKlubIntro";
import {
  BOOKINGS_TO_REVENUE,
  DEALS,
  DEAL_CATEGORIES,
  KLUB_ANNUAL_KR,
  KLUB_MODEL_VIABILITY,
  MARGIN_30_IMPACT,
  MARGIN_MODEL,
  PATH_TO_200_PER_BOOKING,
  PATH_TO_50K,
  REALISTIC_CREDIT_USAGE,
  REALISTIC_EARNINGS,
  ZEN_CREDIT_PARTNER_MODEL,
  type Deal,
  type DealCategory,
  ZEN_CREDIT_ANNUAL_KR,
  ZEN_CREDIT_MONTHLY_KR,
} from "@/lib/deals/dealsData";
import { INTRO_CLEANING_FROM_KR } from "@/data/pricing";
import styles from "./RenzenDealsHubPage.module.css";

function formatKr(amount: number) {
  return amount.toLocaleString("da-DK");
}

function DealEconomicsExpandable({ deal }: { deal: Deal }) {
  const [open, setOpen] = useState(false);
  const { economics: e } = deal;

  return (
    <div className="mt-5 border-t border-[#e8ebe4] pt-4">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`${styles.economicsToggle} flex w-full items-center justify-between gap-2`}
        aria-expanded={open}
      >
        <span>Økonomi (intern)</span>
        <ChevronDown
          size={14}
          className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className={`${styles.economicsPanel} mt-3 rounded-xl p-4`}>
          <div className={styles.economicsGrid}>
            <div className={styles.economicsCell}>
              <p className={styles.economicsLabel}>Kundepris</p>
              <p className={styles.economicsValue}>{e.customerPriceLabel}</p>
            </div>
            <div className={styles.economicsCell}>
              <p className={styles.economicsLabel}>Renzen brutto (20%)</p>
              <p className={styles.economicsValue}>
                {e.renzenGrossKr > 0
                  ? `${formatKr(e.renzenGrossKr)} kr.`
                  : "0 kr."}
              </p>
            </div>
            <div className={styles.economicsCell}>
              <p className={styles.economicsLabel}>Klub-bidrag</p>
              <p className={styles.economicsValue}>{e.klubContribution}</p>
            </div>
            <div className={styles.economicsCell}>
              <p className={styles.economicsLabel}>Formål</p>
              <p className={styles.economicsValue}>{e.purpose}</p>
            </div>
          </div>
          {e.notes && <p className={styles.economicsNotes}>{e.notes}</p>}
        </div>
      )}
    </div>
  );
}

function EconomicsExpandableShell({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="mt-8 overflow-hidden rounded-xl border border-[#dfe2da] bg-[#fffdf9]">
      <button
        type="button"
        onClick={onToggle}
        className={`${styles.economicsToggle} flex w-full items-center justify-between gap-3 px-5 py-4 text-left`}
        aria-expanded={open}
      >
        <span className="font-display text-base normal-case tracking-[-0.02em] text-[#173c2c]">
          {title}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-[#41614f] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className={`${styles.economicsPanel} border-t border-[#e2e6df] px-5 py-5`}>
          {children}
        </div>
      )}
    </div>
  );
}

function formatKrRange(low: number, high: number) {
  if (low === high) {
    return `${formatKr(low)} kr.`;
  }
  return `${formatKr(low)}–${formatKr(high)} kr.`;
}

function RealisticCreditUsageExpandable() {
  const [open, setOpen] = useState(false);
  const data = REALISTIC_CREDIT_USAGE;

  return (
    <EconomicsExpandableShell
      title={data.title}
      open={open}
      onToggle={() => setOpen((prev) => !prev)}
    >
      <p className="max-w-3xl text-sm font-medium leading-6 text-[#536159]">
        {data.summary}
      </p>

      <div className={`${styles.economicsGrid} mt-6`}>
        <div className={styles.economicsCell}>
          <p className={styles.economicsLabel}>Kreditter brugt</p>
          <p className={styles.economicsValue}>
            {data.creditsUsedCount}/10 = {formatKr(data.creditsUsedKr)} kr./år
          </p>
        </div>
        <div className={styles.economicsCell}>
          <p className={styles.economicsLabel}>Ubrugt pulje</p>
          <p className={styles.economicsValue}>
            {formatKr(data.creditsUnusedKr)} kr. ({data.unusedShareLabel})
          </p>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-[#dfe2da] bg-[#fffdf9]">
        <table className={styles.modelTable}>
          <thead>
            <tr>
              <th>Service</th>
              <th>Andel</th>
              <th>Kr./år</th>
              <th>Typisk jobpris</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row) => (
              <tr key={row.service}>
                <td>{row.service}</td>
                <td>{row.shareLabel}</td>
                <td>{formatKr(row.krPerYear)} kr.</td>
                <td>{formatKr(row.typicalJobKr)} kr.</td>
              </tr>
            ))}
            <tr>
              <td className="text-[#657169]">Ubrugt kredit</td>
              <td>{data.unusedShareLabel}</td>
              <td>{formatKr(data.creditsUnusedKr)} kr.</td>
              <td className="font-medium text-[#657169]">—</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className={`${styles.economicsNotes} mt-4`}>{data.footnote}</p>
    </EconomicsExpandableShell>
  );
}

function RealisticEarningsExpandable() {
  const [open, setOpen] = useState(false);
  const data = REALISTIC_EARNINGS;

  return (
    <EconomicsExpandableShell
      title={data.title}
      open={open}
      onToggle={() => setOpen((prev) => !prev)}
    >
      <p className="max-w-3xl text-sm font-medium leading-6 text-[#536159]">
        {data.summary}
      </p>
      <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-[#7b8781]">
        {data.marginNote}
      </p>

      <h3 className="mt-6 font-display text-lg font-semibold tracking-[-0.02em] text-[#173c2c]">
        {data.scenarioTitle}
      </h3>

      <div className="mt-4 overflow-x-auto rounded-xl border border-[#dfe2da] bg-[#fffdf9]">
        <table className={styles.modelTable}>
          <thead>
            <tr>
              <th>Post</th>
              <th>Beløb</th>
            </tr>
          </thead>
          <tbody>
            {data.lines.map((line) => (
              <tr key={line.label}>
                <td>
                  <span className="block">{line.label}</span>
                  {line.detail && (
                    <span className="mt-1 block text-xs font-medium leading-5 text-[#657169]">
                      {line.detail}
                    </span>
                  )}
                </td>
                <td
                  className={
                    line.emphasis === "negative"
                      ? "text-[#8b3a3a]"
                      : line.emphasis === "positive"
                        ? "text-[#173c2c]"
                        : undefined
                  }
                >
                  {line.amountKr >= 0 ? "+" : "−"}{" "}
                  {formatKr(Math.abs(line.amountKr))} kr.
                  {line.label.includes("kredit") && (
                    <span className="mt-1 block text-xs font-medium text-[#657169]">
                      (interval: {formatKr(data.creditSubsidyRangeKr.low)}–
                      {formatKr(data.creditSubsidyRangeKr.high)} kr.)
                    </span>
                  )}
                </td>
              </tr>
            ))}
            <tr>
              <td className="font-display font-semibold text-[#173c2c]">
                Netto realistisk Renzen/medlem/år
              </td>
              <td className="font-display font-semibold text-[#173c2c]">
                {formatKrRange(data.netWithCleaningKr.low, data.netWithCleaningKr.high)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[#e8d4d4] bg-[#fff9f9] p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8b3a3a]">
            {data.withoutCleaning.title}
          </p>
          <p className="mt-2 text-sm font-medium leading-6 text-[#536159]">
            {data.withoutCleaning.summary}
          </p>
          <p className="mt-3 font-display text-xl font-bold text-[#8b3a3a]">
            {formatKrRange(
              data.withoutCleaning.netKr.low,
              data.withoutCleaning.netKr.high,
            )}
          </p>
        </div>
        <div className="rounded-xl border border-[#c5d3c4] bg-[#f8fbf7] p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#41614f]">
            {data.withCleaning.title}
          </p>
          <p className="mt-2 text-sm font-medium leading-6 text-[#536159]">
            {data.withCleaning.summary}
          </p>
          <p className="mt-3 font-display text-xl font-bold text-[#173c2c]">
            {formatKrRange(data.withCleaning.netKr.low, data.withCleaning.netKr.high)}
          </p>
        </div>
      </div>

      <div className={`${styles.economicsCell} mt-6`}>
        <p className={styles.economicsLabel}>Break-even</p>
        <p className={styles.economicsValue}>
          {formatKr(data.breakEven.listBookingKr)} kr. listepris-booking/år
        </p>
        <p className="mt-2 text-xs font-medium leading-5 text-[#657169]">
          {data.breakEven.detail}
        </p>
      </div>
    </EconomicsExpandableShell>
  );
}

function BookingsToRevenueExpandable() {
  const [open, setOpen] = useState(false);
  const data = BOOKINGS_TO_REVENUE;

  return (
    <EconomicsExpandableShell
      title={data.title}
      open={open}
      onToggle={() => setOpen((prev) => !prev)}
    >
      <p className="max-w-3xl text-sm font-medium leading-6 text-[#536159]">
        {data.summary}
      </p>
      <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-[#7b8781]">
        {data.marginNote}
      </p>
      <p className="mt-1 text-xs font-medium leading-5 text-[#657169]">
        {data.netModelNote}
      </p>

      <div className={`${styles.economicsGrid} mt-6`}>
        {data.scenarios.map((scenario) => (
          <div key={scenario.id} className={styles.economicsCell}>
            <p className={styles.economicsLabel}>{scenario.label}</p>
            <p className={styles.economicsValue}>
              {formatKr(scenario.renzenBruttoKr)} kr. brutto ·{" "}
              {formatKr(scenario.renzenNetKr)} kr. netto
            </p>
            <p className="mt-1 text-xs font-medium leading-5 text-[#657169]">
              {scenario.detail}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-[#dfe2da] bg-[#fffdf9]">
        <table className={styles.modelTable}>
          <thead>
            <tr>
              <th>Bookinger/md.</th>
              <th>Kunder (~)</th>
              {data.scenarios.map((s) => (
                <th key={`${s.id}-brutto`} colSpan={2}>
                  {s.shortLabel}
                </th>
              ))}
            </tr>
            <tr>
              <th aria-hidden="true" />
              <th aria-hidden="true" />
              {data.scenarios.map((s) => (
                <Fragment key={`${s.id}-headers`}>
                  <th className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#7b8781]">
                    Brutto
                  </th>
                  <th className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#7b8781]">
                    Netto
                  </th>
                </Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.volumeRows.map((row) => (
              <tr key={row.bookingsPerMonth}>
                <td>{formatKr(row.bookingsPerMonth)}</td>
                <td>{formatKr(row.customersNeeded)}</td>
                {data.scenarios.map((s) => (
                  <Fragment key={s.id}>
                    <td>
                      {formatKr(row.renzenBruttoByScenarioKr[s.id])} kr.
                    </td>
                    <td>
                      {formatKr(row.renzenNetByScenarioKr[s.id])} kr.
                    </td>
                  </Fragment>
                ))}
              </tr>
            ))}
            <tr>
              <td className="font-display font-semibold text-[#173c2c]">
                {data.baseline.bookingsPerMonth} (nu)
              </td>
              <td className="font-medium text-[#536159]">
                {data.baseline.customersActive} aktive
              </td>
              {data.scenarios.map((s) => (
                <Fragment key={s.id}>
                  <td
                    className={
                      s.id === "current"
                        ? "font-display font-semibold text-[#173c2c]"
                        : undefined
                    }
                  >
                    {s.id === "current"
                      ? `~${formatKr(data.baseline.renzenMonthlyApproxKr)} kr.`
                      : `${formatKr(
                          data.baseline.bookingsPerMonth * s.renzenBruttoKr,
                        )} kr.`}
                  </td>
                  <td
                    className={
                      s.id === "current"
                        ? "font-display font-semibold text-[#173c2c]"
                        : undefined
                    }
                  >
                    {s.id === "current"
                      ? `~${formatKr(data.baseline.renzenNetMonthlyApproxKr)} kr.`
                      : `${formatKr(
                          data.baseline.bookingsPerMonth * s.renzenNetKr,
                        )} kr.`}
                  </td>
                </Fragment>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <p className={`${styles.economicsNotes} mt-4`}>
        {data.baseline.detail}. Beregnet: {formatKr(data.baseline.renzenBruttoMonthlyKr)}{" "}
        kr./md. brutto · {formatKr(data.baseline.renzenNetMonthlyKr)} kr./md. netto ved
        scenario A.
      </p>
      <p className={`${styles.economicsNotes} mt-2`}>{data.footnote}</p>
    </EconomicsExpandableShell>
  );
}

function PathTo200PerBookingExpandable() {
  const [open, setOpen] = useState(false);
  const data = PATH_TO_200_PER_BOOKING;

  return (
    <EconomicsExpandableShell
      title={data.title}
      open={open}
      onToggle={() => setOpen((prev) => !prev)}
    >
      <p className="max-w-3xl text-sm font-medium leading-6 text-[#536159]">
        {data.summary}
      </p>
      <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-[#41614f]">
        {data.tagline}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[#dfe2da] bg-[#fffdf9] p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#7b8781]">
            {data.current.label}
          </p>
          <p className="mt-3 font-display text-2xl font-bold tracking-[-0.03em] text-[#173c2c]">
            {formatKr(data.current.renzenNetKr)} kr. net
          </p>
          <p className="mt-2 text-xs font-medium leading-5 text-[#657169]">
            {formatKr(data.current.avgSaleKr)} kr. kundebetaling ·{" "}
            {formatKr(data.current.renzenBruttoKr)} kr. brutto
          </p>
          <p className="mt-1 text-xs font-medium text-[#657169]">
            {data.current.detail}
          </p>
        </div>
        <div className="rounded-xl border border-[#dfe2da] bg-[#fffdf9] p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#7b8781]">
            {data.newPrice80m2.label}
          </p>
          <p className="mt-3 font-display text-2xl font-bold tracking-[-0.03em] text-[#173c2c]">
            {formatKr(data.newPrice80m2.renzenNetKr)} kr. net
          </p>
          <p className="mt-2 text-xs font-medium leading-5 text-[#657169]">
            {formatKr(data.newPrice80m2.customerKr)} kr. kundebetaling ·{" "}
            {formatKr(data.newPrice80m2.renzenBruttoKr)} kr. brutto
          </p>
          <p className="mt-1 text-xs font-medium text-[#657169]">
            {data.newPrice80m2.detail}
          </p>
        </div>
        <div className="rounded-xl border border-[#c5d3c4] bg-[#f8fbf7] p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#41614f]">
            Mål
          </p>
          <p className="mt-3 font-display text-2xl font-bold tracking-[-0.03em] text-[#173c2c]">
            {formatKr(data.targetNetKr)} kr. net
          </p>
          <p className="mt-2 text-xs font-medium leading-5 text-[#657169]">
            ≈ {formatKr(data.targetBooking.customerKr)} kr. kundebetaling
          </p>
          <p className="mt-1 text-xs font-medium text-[#657169]">
            {data.targetBooking.detail}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-[#e8d4d4] bg-[#fff9f9] p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8b3a3a]">
          Gap fra i dag
        </p>
        <p className="mt-3 font-display text-xl font-bold tracking-[-0.02em] text-[#173c2c]">
          +{formatKr(data.gap.netKr)} kr. net · ca. +{formatKr(data.gap.customerKr)}{" "}
          kr. kundebetaling
        </p>
        <p className="mt-2 text-sm font-medium leading-6 text-[#536159]">
          {data.gap.detail}
        </p>
        <p className="mt-2 text-xs font-medium leading-5 text-[#657169]">
          {data.gap.newPriceStillShortDetail}
        </p>
      </div>

      <h3 className="mt-8 font-display text-lg font-semibold tracking-[-0.02em] text-[#173c2c]">
        Scenarier — {data.pricingFormula.label}
      </h3>
      <p className="mt-2 text-xs font-medium leading-5 text-[#657169]">
        Listepris efter frekvensrabat + tillæg (kæledyr, afkalkning m.m.). Grøn =
        rammer {formatKr(data.targetNetKr)} kr. net.
      </p>

      <div className="mt-4 overflow-x-auto rounded-xl border border-[#dfe2da] bg-[#fffdf9]">
        <table className={styles.modelTable}>
          <thead>
            <tr>
              <th>m²</th>
              <th>Listepris</th>
              <th>Frekvens</th>
              <th>Basis</th>
              <th>Tillæg</th>
              <th>Total kunde</th>
              <th>Renzen net</th>
              <th>Gap til 200</th>
            </tr>
          </thead>
          <tbody>
            {data.scenarioRows.map((row) => (
              <tr
                key={row.id}
                className={
                  row.hitsTarget ? "bg-[#f8fbf7]" : undefined
                }
              >
                <td>{formatKr(row.sqm)}</td>
                <td>{formatKr(row.listKr)} kr.</td>
                <td>
                  {row.frequencyLabel}
                  <span className="mt-0.5 block text-xs font-medium text-[#657169]">
                    −{row.discountPct}%
                  </span>
                </td>
                <td>{formatKr(row.customerKr)} kr.</td>
                <td>
                  {row.extrasKr > 0
                    ? `+${formatKr(row.extrasKr)} kr.`
                    : "—"}
                </td>
                <td className="font-medium">{formatKr(row.totalCustomerKr)} kr.</td>
                <td
                  className={
                    row.hitsTarget
                      ? "font-display font-semibold text-[#173c2c]"
                      : undefined
                  }
                >
                  {formatKr(row.renzenNetKr)} kr.
                </td>
                <td
                  className={
                    row.gapToTargetKr > 0
                      ? "text-[#8b3a3a]"
                      : "font-medium text-[#41614f]"
                  }
                >
                  {row.gapToTargetKr > 0
                    ? `−${formatKr(row.gapToTargetKr)} kr.`
                    : "✓"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="mt-8 font-display text-lg font-semibold tracking-[-0.02em] text-[#173c2c]">
        Greb der kan lukke gapet
      </h3>
      <ul className="mt-4 space-y-3">
        {data.levers.map((lever) => (
          <li
            key={lever.id}
            className="rounded-xl border border-[#dfe2da] bg-[#fffdf9] p-4"
          >
            <p className="font-display text-sm font-semibold text-[#173c2c]">
              {lever.title}
            </p>
            <p className="mt-2 text-sm font-medium leading-6 text-[#536159]">
              {lever.detail}
            </p>
          </li>
        ))}
      </ul>

      <p className={`${styles.economicsNotes} mt-6`}>{data.marginFootnote}</p>
      <p className={`${styles.economicsNotes} mt-2`}>{data.footnote}</p>
    </EconomicsExpandableShell>
  );
}

function Margin30ImpactExpandable() {
  const [open, setOpen] = useState(false);
  const data = MARGIN_30_IMPACT;

  return (
    <EconomicsExpandableShell
      title={data.title}
      open={open}
      onToggle={() => setOpen((prev) => !prev)}
    >
      <div className="inline-flex items-center rounded-lg border border-[#c5d3c4] bg-[#f8fbf7] px-3 py-2 text-xs font-bold uppercase tracking-[0.1em] text-[#41614f]">
        {data.policyCallout}
      </div>
      <p className="mt-4 max-w-3xl text-sm font-medium leading-6 text-[#536159]">
        {data.summary}
      </p>
      <p className="mt-3 max-w-3xl text-sm font-medium leading-6 text-[#536159]">
        {data.tradeoffNote}
      </p>
      <p className="mt-3 max-w-3xl text-sm font-medium leading-6 text-[#536159]">
        {data.policyNote}
      </p>
      <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-[#7b8781]">
        {data.partnerNote}
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-[#dfe2da] bg-[#fffdf9]">
        <table className={styles.modelTable}>
          <thead>
            <tr>
              <th>Metric</th>
              <th>Kontekst</th>
              <th>
                {data.scenarios.current.renzenShareLabel} Renzen (
                {formatKr(data.avgSaleKr)} kr.)
              </th>
              <th>
                {data.scenarios.alternative30.renzenShareLabel} Renzen (
                {formatKr(data.avgSaleKr)} kr.)
              </th>
            </tr>
          </thead>
          <tbody>
            {data.comparisonRows.map((row) => (
              <tr key={row.id}>
                <td className="font-medium text-[#173c2c]">{row.metric}</td>
                <td className="text-xs font-medium leading-5 text-[#657169]">
                  {row.context}
                </td>
                <td>
                  ~{formatKr(row.value20)} {row.unitLabel}
                </td>
                <td
                  className={
                    row.id === "customer-200-net" ||
                    row.id === "net-per-booking" ||
                    row.id === "sub-payout-ex-moms"
                      ? "font-display font-semibold text-[#173c2c]"
                      : "font-medium text-[#2d5a42]"
                  }
                >
                  ~{formatKr(row.value30)} {row.unitLabel}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        className={`mt-6 rounded-xl border p-5 ${
          data.newPrice80m2.hits200At30
            ? "border-[#c5d3c4] bg-[#f8fbf7]"
            : "border-[#dfe2da] bg-[#fffdf9]"
        }`}
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#41614f]">
          Ny pris 80 m² — {data.newPrice80m2.customerKr.toLocaleString("da-DK")} kr.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium text-[#657169]">
              Eksisterende: {data.scenarios.current.renzenShareLabel} Renzen ·{" "}
              {data.scenarios.current.partnerShareLabel} sub · gns.{" "}
              {formatKr(data.avgSaleKr)} kr.
            </p>
            <p className="mt-2 font-display text-xl font-bold text-[#173c2c]">
              ~{formatKr(data.newPrice80m2.net20Kr)} kr. Renzen-netto
            </p>
            <p className="mt-1 text-sm font-medium text-[#536159]">
              Sub: ~{formatKr(data.newPrice80m2.subPayout20Kr)} kr. ex moms
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-[#657169]">
              Nye subs: {data.scenarios.alternative30.renzenShareLabel} Renzen ·{" "}
              {data.scenarios.alternative30.partnerShareLabel} sub ·{" "}
              {formatKr(data.newPrice80m2.customerKr)} kr.
            </p>
            <p className="mt-2 font-display text-xl font-bold text-[#173c2c]">
              ~{formatKr(data.newPrice80m2.net30Kr)} kr. Renzen-netto
            </p>
            <p className="mt-1 text-sm font-medium text-[#536159]">
              Sub: ~{formatKr(data.newPrice80m2.subPayout30Kr)} kr. ex moms
              {data.newPrice80m2.subPayoutDeltaKr > 0 && (
                <>
                  {" "}
                  (+{formatKr(data.newPrice80m2.subPayoutDeltaKr)} kr. vs. gns.)
                </>
              )}
            </p>
            {data.newPrice80m2.hits200At30 && (
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.1em] text-[#41614f]">
                Over 200 kr.-tærsklen
              </p>
            )}
          </div>
        </div>
        <p className="mt-3 text-sm font-medium leading-6 text-[#536159]">
          {data.newPrice80m2.detail}
        </p>
      </div>

      <p className={`${styles.economicsNotes} mt-4`}>{data.footnote}</p>
    </EconomicsExpandableShell>
  );
}

function PathTo50kExpandable() {
  const [open, setOpen] = useState(false);
  const data = PATH_TO_50K;

  return (
    <EconomicsExpandableShell
      title={data.title}
      open={open}
      onToggle={() => setOpen((prev) => !prev)}
    >
      <p className="max-w-3xl text-sm font-medium leading-6 text-[#536159]">
        {data.summary}
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {data.scenarios.map((scenario) => {
          const isMemberBased = scenario.id === "cleaning-klub";

          return (
            <div
              key={scenario.id}
              className="rounded-xl border border-[#c5d3c4] bg-[#f8fbf7] p-5"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#41614f]">
                {scenario.label}
              </p>
              <p className="mt-2 text-xs font-medium leading-5 text-[#657169]">
                {scenario.detail}
              </p>

              {isMemberBased ? (
                <>
                  <p className="mt-4 font-display text-2xl font-bold tracking-[-0.03em] text-[#173c2c]">
                    ~{formatKr(scenario.customersNeeded)} aktive Klub-medlemmer
                  </p>
                  <p className="mt-2 text-sm font-medium leading-6 text-[#536159]">
                    med fast bi-weekly rengøring
                  </p>
                  <p className="mt-3 text-xs font-medium leading-5 text-[#657169]">
                    ~{formatKr(scenario.bookingsNeeded)} bookinger/md. er afledt (
                    {formatKr(scenario.customersNeeded)} × 2,17) — ikke et ekstra krav ud
                    over kunderne
                  </p>
                  <p className="mt-3 text-xs font-medium leading-5 text-[#657169]">
                    Du skal ikke finde {formatKr(scenario.bookingsNeeded)} bookinger — du
                    skal have ~{formatKr(scenario.customersNeeded)} loyale medlemmer;
                    bookingerne følger automatisk ved hver 2. uge
                  </p>
                </>
              ) : (
                <p className="mt-4 font-display text-2xl font-bold tracking-[-0.03em] text-[#173c2c]">
                  {scenario.answer}
                </p>
              )}

              <p className="mt-4 font-display text-xl font-bold tracking-[-0.02em] text-[#2d5a42]">
                Total månedlig omsætning (kundebetalinger): ~
                {formatKr(scenario.monthlyGrossRevenueKr)} kr.
              </p>
              <p className="mt-2 text-xs font-medium leading-5 text-[#657169]">
                {data.grossRevenueNote}
              </p>

              <div className="mt-4 space-y-2 border-t border-[#dfe2da] pt-4 text-sm font-medium text-[#536159]">
                <p>
                  <span className="text-[#657169]">Brutto / netto: </span>
                  {formatKr(scenario.renzenBruttoPerUnitKr)} kr. ·{" "}
                  {formatKr(scenario.renzenNetPerUnitKr)} kr. {scenario.unitLabel}
                </p>
                {isMemberBased ? (
                  <>
                    <p>
                      <span className="text-[#657169]">Kunder (~): </span>
                      ~{formatKr(scenario.customersNeeded)}
                    </p>
                    <p className="text-xs font-medium leading-5 text-[#657169]">
                      <span className="text-[#657169]">Bookinger/md. (afledt): </span>
                      ~{formatKr(scenario.bookingsNeeded)} ={" "}
                      {formatKr(scenario.customersNeeded)} × 2,17
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      <span className="text-[#657169]">Bookinger/md.: </span>
                      ~{formatKr(scenario.bookingsNeeded)}
                    </p>
                    <p>
                      <span className="text-[#657169]">Kunder (~): </span>
                      ~{formatKr(scenario.customersNeeded)}
                    </p>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className={`${styles.economicsCell} mt-6`}>
        <p className={styles.economicsLabel}>Mål</p>
        <p className={styles.economicsValue}>
          {formatKr(data.targetKr)} kr./md. {data.targetLabel}
        </p>
        <p className="mt-2 text-xs font-medium leading-5 text-[#657169]">
          Før øvrige driftsomkostninger — kombinerer 20% rengøringsmargin ex moms
          (minus Stripe) og Klub nettoindtægt hvor relevant.
        </p>
      </div>

      <p className={`${styles.economicsNotes} mt-4`}>{data.footnote}</p>
    </EconomicsExpandableShell>
  );
}

function KlubModelViabilityExpandable() {
  const [open, setOpen] = useState(false);
  const data = KLUB_MODEL_VIABILITY;

  return (
    <EconomicsExpandableShell
      title={data.title}
      open={open}
      onToggle={() => setOpen((prev) => !prev)}
    >
      <p className="max-w-3xl text-sm font-medium leading-6 text-[#536159]">
        {data.summary}
      </p>

      <h3 className="mt-6 font-display text-lg font-semibold tracking-[-0.02em] text-[#173c2c]">
        1. {data.cleaningOnly.title}
      </h3>
      <p className="mt-3 max-w-3xl text-sm font-medium leading-6 text-[#536159]">
        {data.cleaningOnly.netPerMemberDetail}. {data.cleaningOnly.thinMarginNote}
      </p>

      <div className={`${styles.economicsGrid} mt-5`}>
        <div className={styles.economicsCell}>
          <p className={styles.economicsLabel}>Netto pr. medlem/md.</p>
          <p className={styles.economicsValue}>
            ~{formatKr(data.cleaningOnly.netPerMemberMonthlyKr)} kr.
          </p>
        </div>
        <div className={styles.economicsCell}>
          <p className={styles.economicsLabel}>
            Ved ~{formatKr(data.cleaningOnly.atMembers)} medlemmer
          </p>
          <p className={styles.economicsValue}>
            ~{formatKr(data.cleaningOnly.grossMonthlyAtTargetKr)} kr./md.
          </p>
          <p className="mt-1 text-xs font-medium leading-5 text-[#657169]">
            Før driftsomkostninger
          </p>
        </div>
        <div className={styles.economicsCell}>
          <p className={styles.economicsLabel}>Total kundebetalinger/md.</p>
          <p className={styles.economicsValue}>
            ~{formatKr(data.cleaningOnly.monthlyGrossRevenueAtTargetKr)} kr.
          </p>
          <p className="mt-1 text-xs font-medium leading-5 text-[#657169]">
            {PATH_TO_50K.grossRevenueNote}
          </p>
        </div>
      </div>
      <p className="mt-3 text-xs font-medium leading-5 text-[#657169]">
        {data.cleaningOnly.grossNote}
      </p>

      <h3 className="mt-8 font-display text-lg font-semibold tracking-[-0.02em] text-[#173c2c]">
        Skønnede driftsomkostninger
      </h3>
      <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-[#7b8781]">
        {data.opsEstimates.disclaimer}
      </p>

      <div className={`${styles.economicsGrid} mt-4`}>
        <div className={styles.economicsCell}>
          <p className={styles.economicsLabel}>{data.opsEstimates.support.label}</p>
          <p className={styles.economicsValue}>
            {formatKr(data.opsEstimates.support.lowKr)}–
            {formatKr(data.opsEstimates.support.highKr)}{" "}
            {data.opsEstimates.support.unitLabel}
          </p>
          <p className="mt-1 text-xs font-medium leading-5 text-[#657169]">
            {data.opsEstimates.support.detail}
          </p>
        </div>
        <div className={styles.economicsCell}>
          <p className={styles.economicsLabel}>{data.opsEstimates.platform.label}</p>
          <p className={styles.economicsValue}>
            {formatKr(data.opsEstimates.platform.lowKr)}–
            {formatKr(data.opsEstimates.platform.highKr)}{" "}
            {data.opsEstimates.platform.unitLabel}
          </p>
          <p className="mt-1 text-xs font-medium leading-5 text-[#657169]">
            {data.opsEstimates.platform.detail}
          </p>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-xl border border-[#dfe2da] bg-[#fffdf9]">
        <table className={styles.modelTable}>
          <thead>
            <tr>
              <th>Scenario</th>
              <th>Support/md.</th>
              <th>Platform/md.</th>
              <th>Efter skøn ved ~{formatKr(data.cleaningOnly.atMembers)} medlemmer</th>
            </tr>
          </thead>
          <tbody>
            {data.opsEstimates.scenarios.map((scenario) => (
              <tr key={scenario.id}>
                <td>{scenario.label}</td>
                <td>{formatKr(scenario.supportKr)} kr./medlem</td>
                <td>{formatKr(scenario.platformKr)} kr.</td>
                <td className="font-medium text-[#536159]">
                  ~{formatKr(scenario.netAt331Kr)} kr./md.
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 rounded-xl border border-[#e8d4d4] bg-[#fff9f9] p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8b3a3a]">
          Efter skønnede driftsomkostninger
        </p>
        <p className="mt-2 text-sm font-medium leading-6 text-[#536159]">
          {data.opsEstimates.pocketMoneyNote} Estimat: ~
          {formatKr(data.opsEstimates.membersFor50kPocketLowOps)}–
          {formatKr(data.opsEstimates.membersFor50kPocketHighOps)} aktive medlemmer for
          ~50.000 kr./md. i lommen (afhængigt af support-niveau og platform).
        </p>
        <p className="mt-3 font-display text-lg font-bold tracking-[-0.02em] text-[#2d5a42]">
          Total månedlig omsætning (kundebetalinger): ~
          {formatKr(data.opsEstimates.monthlyGrossRevenuePocketLowKr)}–
          {formatKr(data.opsEstimates.monthlyGrossRevenuePocketHighKr)} kr.
        </p>
        <p className="mt-2 text-xs font-medium leading-5 text-[#657169]">
          {PATH_TO_50K.grossRevenueNote}
        </p>
      </div>

      <h3 className="mt-8 font-display text-lg font-semibold tracking-[-0.02em] text-[#173c2c]">
        2. {data.whyItCanWork.title}
      </h3>
      <p className="mt-3 max-w-3xl text-sm font-medium leading-6 text-[#536159]">
        {data.whyItCanWork.summary}
      </p>
      <ul className="mt-4 space-y-2">
        {data.whyItCanWork.points.map((point) => (
          <li
            key={point}
            className="flex gap-3 text-sm font-medium leading-6 text-[#536159]"
          >
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#41614f]" />
            {point}
          </li>
        ))}
      </ul>

      <div className="mt-5 overflow-x-auto rounded-xl border border-[#dfe2da] bg-[#fffdf9]">
        <table className={styles.modelTable}>
          <thead>
            <tr>
              <th>Deal (Klub-tilknyttet)</th>
              <th>Kundepris</th>
              <th>Renzen 20%</th>
              <th>Rolle</th>
            </tr>
          </thead>
          <tbody>
            {data.whyItCanWork.crossSellDeals.map((deal) => (
              <tr key={deal.dealId}>
                <td>{deal.label}</td>
                <td>{formatKr(deal.customerKr)} kr.</td>
                <td>{formatKr(deal.renzenMarginKr)} kr.</td>
                <td className="font-medium text-[#536159]">{deal.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={`${styles.economicsNotes} mt-4`}>
        {data.whyItCanWork.engagedExample}
      </p>

      <h3 className="mt-8 font-display text-lg font-semibold tracking-[-0.02em] text-[#173c2c]">
        3. {data.ltvSketch.title}
      </h3>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[#dfe2da] bg-[#fffdf9] p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#7b8781]">
            {data.ltvSketch.conservative.label}
          </p>
          <p className="mt-2 text-xs font-medium leading-5 text-[#657169]">
            {data.ltvSketch.conservative.detail}
          </p>
          <p className="mt-3 font-display text-xl font-bold text-[#173c2c]">
            ~{formatKr(data.ltvSketch.conservative.annualNetKr)} kr./år net
          </p>
          <p className="mt-2 text-xs font-medium text-[#657169]">
            {data.ltvSketch.conservative.formula}
          </p>
        </div>
        <div className="rounded-xl border border-[#c5d3c4] bg-[#f8fbf7] p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#41614f]">
            {data.ltvSketch.engaged.label}
          </p>
          <p className="mt-2 text-xs font-medium leading-5 text-[#657169]">
            {data.ltvSketch.engaged.detail}
          </p>
          <p className="mt-3 font-display text-xl font-bold text-[#173c2c]">
            {formatKrRange(
              data.ltvSketch.engaged.annualNetKrLow,
              data.ltvSketch.engaged.annualNetKrHigh,
            )}
            /år net
          </p>
          <p className="mt-2 text-xs font-medium text-[#657169]">
            {data.ltvSketch.engaged.formula}
          </p>
        </div>
      </div>

      <div className={`${styles.economicsCell} mt-6`}>
        <p className={styles.economicsLabel}>{data.ltvSketch.cacBreakeven.label}</p>
        <p className={styles.economicsValue}>
          Intro: ~{formatKr(data.ltvSketch.cacBreakeven.introMarginKr)} kr. Renzen-brutto
        </p>
        <p className="mt-2 text-xs font-medium leading-5 text-[#657169]">
          {data.ltvSketch.cacBreakeven.introNote}. {data.ltvSketch.cacBreakeven.detail}
        </p>
      </div>

      <p className={`${styles.economicsNotes} mt-4`}>{data.footnote}</p>
    </EconomicsExpandableShell>
  );
}

function ZenCreditPartnerExpandable() {
  const [open, setOpen] = useState(false);
  const { modelLabel, title, summary, points, example } = ZEN_CREDIT_PARTNER_MODEL;

  return (
    <EconomicsExpandableShell
      title="Zen-kredit & partnere"
      open={open}
      onToggle={() => setOpen((prev) => !prev)}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#7b8781]">
        {modelLabel}
      </p>
      <h3 className="mt-2 font-display text-xl font-semibold tracking-[-0.03em] text-[#173c2c]">
        {title}
      </h3>
      <p className="mt-3 max-w-3xl text-sm font-medium leading-6 text-[#536159]">
        {summary}
      </p>

      <ul className="mt-5 space-y-3">
        {points.map((point) => (
          <li
            key={point}
            className="flex gap-3 text-sm font-medium leading-6 text-[#536159]"
          >
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#41614f]" />
            {point}
          </li>
        ))}
      </ul>

      <div className={`${styles.economicsGrid} mt-6`}>
        <div className={styles.economicsCell}>
          <p className={styles.economicsLabel}>Aftalt listepris</p>
          <p className={styles.economicsValue}>
            {formatKr(example.listPriceKr)} kr.
          </p>
        </div>
        <div className={styles.economicsCell}>
          <p className={styles.economicsLabel}>Zen-kredit (Klub)</p>
          <p className={styles.economicsValue}>
            − {formatKr(example.creditKr)} kr.
          </p>
        </div>
        <div className={styles.economicsCell}>
          <p className={styles.economicsLabel}>Kunde betaler kontant</p>
          <p className={styles.economicsValue}>
            {formatKr(example.customerPaysKr)} kr.
          </p>
        </div>
        <div className={styles.economicsCell}>
          <p className={styles.economicsLabel}>Zenmester udbetaling (80%)</p>
          <p className={styles.economicsValue}>
            {formatKr(example.partnerPayoutKr)} kr.
          </p>
        </div>
      </div>
    </EconomicsExpandableShell>
  );
}

function DealCard({ deal }: { deal: Deal }) {
  return (
    <article
      className={`flex h-full flex-col rounded-[22px] border bg-[#fffdf9] p-6 shadow-[0_8px_28px_rgba(32,70,52,0.06)] ${
        deal.featured
          ? "border-[#c5d3c4] ring-1 ring-[#dfe9dc]"
          : "border-[#e5e7e1]"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <span className="inline-flex rounded-full bg-[#dfe9dc] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#41614f]">
          {deal.discountLabel}
        </span>
        {deal.klubGated && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#173c2c] px-3 py-1 text-[11px] font-bold text-white">
            <Sparkles size={12} />
            Klub
          </span>
        )}
      </div>

      <h2 className="mt-4 font-display text-[22px] font-semibold leading-tight tracking-[-0.03em] text-[#173c2c]">
        {deal.title}
      </h2>
      <p className="mt-3 flex-1 text-sm font-medium leading-6 text-[#536159]">
        {deal.description}
      </p>

      {deal.code && (
        <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-dashed border-[#c5d3c4] bg-[#f6f4ed] px-3 py-2 text-xs font-bold text-[#41614f]">
          <Tag size={13} />
          Kode: {deal.code}
        </div>
      )}

      <Link
        href={deal.ctaHref}
        className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#17251f] px-5 text-sm font-bold text-white transition-colors hover:bg-black"
      >
        {deal.ctaLabel}
        <ArrowRight size={15} />
      </Link>

      <DealEconomicsExpandable deal={deal} />
    </article>
  );
}

export default function RenzenDealsHubPage() {
  const [activeCategory, setActiveCategory] = useState<DealCategory>("alle");

  const filteredDeals =
    activeCategory === "alle"
      ? DEALS
      : DEALS.filter((deal) => deal.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#fbfaf5] text-[#203129]">
      <RenzenEditorialHeader />

      <main>
        <section className="bg-[#dfe9dc]">
          <div className="mx-auto max-w-[1340px] px-6 py-16 sm:px-10 lg:py-20">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#41614f]">
              Tilbud & fordele
            </p>
            <h1 className="mt-5 max-w-3xl font-display text-[42px] font-semibold leading-[0.98] tracking-[-0.05em] text-[#173c2c] sm:text-[56px]">
              Renzen Deals Hub
            </h1>
            <p className="mt-6 max-w-2xl text-base font-medium leading-7 text-[#536159] sm:text-lg">
              Overblik over aktuelle tilbud, Klub-fordele og rabatkoder — med
              gennemsigtig økonomi bag hver deal, så du kan vurdere struktur og
              margin.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/dealpage2"
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#17251f] px-6 text-sm font-bold text-white transition-colors hover:bg-black"
              >
                Book intro fra {INTRO_CLEANING_FROM_KR} kr.
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/klub/"
                className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[#173c2c]/20 bg-white/60 px-6 text-sm font-bold text-[#173c2c] transition-colors hover:bg-white"
              >
                Læs om Renzen Klub
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1340px] px-6 py-12 sm:px-10">
          <div className="flex flex-wrap gap-2">
            {DEAL_CATEGORIES.map((cat) => {
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                    active
                      ? "bg-[#173c2c] text-white"
                      : "bg-[#e8ebe4] text-[#536159] hover:bg-[#dfe9dc] hover:text-[#173c2c]"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredDeals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>

          {filteredDeals.length === 0 && (
            <p className="mt-10 text-center text-sm font-medium text-[#657169]">
              Ingen tilbud i denne kategori lige nu.
            </p>
          )}
        </section>

        <section className="border-t border-[#e2e6df] bg-[#f6f4ed]">
          <div className="mx-auto max-w-[1340px] px-6 py-14 sm:px-10 lg:py-16">
            <div className="flex items-start gap-3">
              <Copy size={18} className="mt-1 shrink-0 text-[#41614f]" />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#657169]">
                  For ejer / forretning
                </p>
                <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em] text-[#173c2c]">
                  Deal-økonomi — marginmodel
                </h2>
                <p className="mt-4 max-w-3xl text-sm font-medium leading-6 text-[#536159]">
                  Renzen tager {MARGIN_MODEL.renzenShare} af kundebetalingen;
                  Zenmester/partner får {MARGIN_MODEL.partnerShare}. Klub
                  medlemskab ({formatKr(MARGIN_MODEL.klubAnnual)} kr./år) og
                  Zen-kreditter ({formatKr(MARGIN_MODEL.zenCreditsAnnual)} kr./år)
                  finansierer CAC-tilbud og retention — intro fra{" "}
                  {formatKr(MARGIN_MODEL.introFrom)} kr. er tabsgivende alene,
                  men dækkes via LTV.
                </p>
              </div>
            </div>

            <div className="mt-8 overflow-x-auto rounded-xl border border-[#dfe2da] bg-[#fffdf9]">
              <table className={styles.modelTable}>
                <thead>
                  <tr>
                    <th>Deal</th>
                    <th>Kundepris</th>
                    <th>Renzen 20%</th>
                    <th>Formål</th>
                  </tr>
                </thead>
                <tbody>
                  {DEALS.map((deal) => (
                    <tr key={deal.id}>
                      <td>{deal.title.split("—")[0].trim()}</td>
                      <td>{deal.economics.customerPriceLabel}</td>
                      <td>
                        {deal.economics.renzenGrossKr > 0
                          ? `${formatKr(deal.economics.renzenGrossKr)} kr.`
                          : "0 kr."}
                      </td>
                      <td className="font-medium text-[#536159]">
                        {deal.economics.purpose.split("—")[0].trim()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                {
                  label: "Bundle-eksempel",
                  value: "7.600 kr. → 1.520 kr. Renzen",
                  detail: "Flyt (5.000) + rengøring (3.000) − 400 kr.",
                },
                {
                  label: "Klub LTV",
                  value: `${formatKr(KLUB_ANNUAL_KR)} kr./år`,
                  detail: "Plus løbende 20% margin på gentagne besøg",
                },
                {
                  label: "Zen-kreditter",
                  value: `${formatKr(ZEN_CREDIT_ANNUAL_KR)} kr./år`,
                  detail: `${ZEN_CREDIT_ANNUAL_KR / ZEN_CREDIT_MONTHLY_KR} × ${formatKr(ZEN_CREDIT_MONTHLY_KR)} kr. — driver cross-salg uden kontant udbetaling`,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-[#dfe2da] bg-[#fffdf9] p-5"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#7b8781]">
                    {item.label}
                  </p>
                  <p className="mt-2 font-display text-xl font-bold text-[#173c2c]">
                    {item.value}
                  </p>
                  <p className="mt-2 text-xs font-medium leading-5 text-[#657169]">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>

            <BookingsToRevenueExpandable />
            <PathTo200PerBookingExpandable />
            <PathTo50kExpandable />
            <Margin30ImpactExpandable />
            <KlubModelViabilityExpandable />
            <ZenCreditPartnerExpandable />
            <RealisticCreditUsageExpandable />
            <RealisticEarningsExpandable />
          </div>
        </section>

        <RenzenKlubPromoSection description={`Alle Klub-tilbud samlet — intro fra ${INTRO_CLEANING_FROM_KR} kr., Zen-kreditter og medlemsrabatter på tværs af services.`} />
      </main>

      <RenzenEditorialFooter />
    </div>
  );
}
