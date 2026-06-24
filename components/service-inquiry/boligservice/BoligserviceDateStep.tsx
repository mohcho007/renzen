"use client";

import { useCallback, useMemo } from "react";
import styles from "@/components/dealside/DealTypeformWizard.module.css";
import wizardStyles from "@/components/service-inquiry/ServiceInquiryWizard.module.css";
import {
  DATE_FLEXIBILITY_OPTIONS,
  PREFERRED_TIME_WINDOW_OPTIONS,
  type DateFlexibility,
  type PreferredTimeWindow,
} from "@/lib/boligserviceInquiry";
import { OptionButton, OptionGrid } from "./OptionCard";

function toLocalYmd(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getMaxSelectableDate() {
  const max = new Date();
  max.setHours(0, 0, 0, 0);
  max.setFullYear(max.getFullYear() + 1);
  return max;
}

function isDateInPast(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

function isWeekday(date: Date) {
  const day = date.getDay();
  return day >= 1 && day <= 5;
}

function getMondayOfWeek(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + mondayOffset);
  return d;
}

function getWeekOffsetForDate(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentMonday = getMondayOfWeek(today);
  const selectedMonday = getMondayOfWeek(date);
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  return Math.round(
    (selectedMonday.getTime() - currentMonday.getTime()) / msPerWeek,
  );
}

function nextWeekdays(weekOffset: number) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset + weekOffset * 7);

  const weekdays: Date[] = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    weekdays.push(d);
  }
  return weekdays;
}

function getDaysInMonth(viewDate: Date) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  let startDow = firstOfMonth.getDay();
  startDow = (startDow + 6) % 7;

  const startDate = new Date(year, month, 1);
  startDate.setDate(startDate.getDate() - startDow);

  const days: Date[] = [];
  const current = new Date(startDate);
  for (let i = 0; i < 42; i++) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
}

type BoligserviceDateStepProps = {
  title?: string;
  hint?: string;
  preferredDate: string;
  setPreferredDate: (value: string) => void;
  weekOffset: number;
  setWeekOffset: (value: number | ((prev: number) => number)) => void;
  viewDate: Date;
  setViewDate: (value: Date | ((prev: Date) => Date)) => void;
  showFlexibility?: boolean;
  dateFlexibility?: DateFlexibility;
  setDateFlexibility?: (value: DateFlexibility) => void;
  preferredTimeWindow?: PreferredTimeWindow;
  setPreferredTimeWindow?: (value: PreferredTimeWindow) => void;
};

export function BoligserviceDateStep({
  title = "Hvornår ønsker du opgaven udført?",
  hint = "Vælg din foretrukne dato. Vi bekræfter tidspunktet i tilbuddet.",
  preferredDate,
  setPreferredDate,
  weekOffset,
  setWeekOffset,
  viewDate,
  setViewDate,
  showFlexibility = false,
  dateFlexibility = "plus_minus_3",
  setDateFlexibility,
  preferredTimeWindow = "fleksibel",
  setPreferredTimeWindow,
}: BoligserviceDateStepProps) {
  const maxSelectableDate = useMemo(() => getMaxSelectableDate(), []);
  const maxWeekOffset = useMemo(
    () => Math.max(0, getWeekOffsetForDate(maxSelectableDate)),
    [maxSelectableDate],
  );
  const weekdayDates = useMemo(() => nextWeekdays(weekOffset), [weekOffset]);
  const calendarDays = useMemo(() => getDaysInMonth(viewDate), [viewDate]);
  const calendarMonthLabel = viewDate.toLocaleDateString("da-DK", {
    month: "long",
    year: "numeric",
  });

  const selectedDateOutsideWeek = useMemo(() => {
    if (!preferredDate) return false;
    return !weekdayDates.some((d) => toLocalYmd(d) === preferredDate);
  }, [preferredDate, weekdayDates]);

  const weekLabel = useMemo(() => {
    const monday = weekdayDates[0];
    if (!monday) return "";
    const month = monday.toLocaleDateString("da-DK", { month: "long" });
    const capitalized = month.charAt(0).toUpperCase() + month.slice(1);
    if (weekOffset === 0) return `${capitalized} · denne uge`;
    if (weekOffset === 1) return `${capitalized} · næste uge`;
    return `${capitalized} · om ${weekOffset} uger`;
  }, [weekdayDates, weekOffset]);

  const isDateSelectable = useCallback(
    (date: Date) => {
      if (isDateInPast(date)) return false;
      return date <= maxSelectableDate;
    },
    [maxSelectableDate],
  );

  const handleDateSelect = useCallback(
    (dateStr: string) => {
      setPreferredDate(dateStr);
      setViewDate(
        new Date(
          Number.parseInt(dateStr.slice(0, 4), 10),
          Number.parseInt(dateStr.slice(5, 7), 10) - 1,
          1,
        ),
      );
    },
    [setPreferredDate, setViewDate],
  );

  return (
    <>
      <h2 className={styles.question}>{title}</h2>
      <p className={styles.hint}>{hint}</p>

      <div className={wizardStyles.calendarSection}>
        <div className={styles.dateWeekNav}>
          <button
            type="button"
            className={styles.dateWeekBtn}
            disabled={weekOffset === 0}
            onClick={() => setWeekOffset((w) => Math.max(0, w - 1))}
          >
            ← Forrige uge
          </button>
          <span className={styles.dateWeekLabel}>{weekLabel}</span>
          <button
            type="button"
            className={styles.dateWeekBtn}
            disabled={weekOffset >= maxWeekOffset}
            onClick={() =>
              setWeekOffset((w) => Math.min(maxWeekOffset, w + 1))
            }
          >
            Næste uge →
          </button>
        </div>

        <div className={wizardStyles.weekdayRow}>
          {weekdayDates.map((date) => {
            const dateStr = toLocalYmd(date);
            const past = isDateInPast(date);
            const beyondRange = date > maxSelectableDate;
            const isSelected =
              preferredDate === dateStr && !selectedDateOutsideWeek;
            const weekday = date
              .toLocaleDateString("da-DK", { weekday: "short" })
              .replace(".", "");
            const month = date
              .toLocaleDateString("da-DK", { month: "short" })
              .replace(".", "");

            return (
              <button
                key={dateStr}
                type="button"
                className={`${styles.dateChip} ${isSelected ? styles.dateChipSelected : ""}`}
                disabled={past || beyondRange}
                onClick={() => handleDateSelect(dateStr)}
              >
                <span className={styles.dateWeekday}>{weekday}</span>
                <span className={styles.dateDay}>{date.getDate()}</span>
                <span className={styles.dateMonth}>{month}</span>
              </button>
            );
          })}
        </div>

        <div
          className={`${styles.calendarPanel} ${wizardStyles.calendarPanelOpen}`}
        >
          <div className={styles.calendarHeader}>
            <button
              type="button"
              className={styles.calendarNav}
              onClick={() =>
                setViewDate(
                  (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
                )
              }
              aria-label="Forrige måned"
            >
              ‹
            </button>
            <span className={styles.calendarMonth}>
              {calendarMonthLabel.charAt(0).toUpperCase() +
                calendarMonthLabel.slice(1)}
            </span>
            <button
              type="button"
              className={styles.calendarNav}
              onClick={() =>
                setViewDate(
                  (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
                )
              }
              aria-label="Næste måned"
            >
              ›
            </button>
          </div>
          <div className={styles.calendarGrid}>
            {["Ma", "Ti", "On", "To", "Fr", "Lø", "Sø"].map((d) => (
              <div key={d} className={styles.calendarDow}>
                {d}
              </div>
            ))}
            {calendarDays.map((dayDate) => {
              const dateStr = toLocalYmd(dayDate);
              const isCurrentMonth =
                dayDate.getMonth() === viewDate.getMonth();
              const isWeekend = !isWeekday(dayDate);
              const isSelected = preferredDate === dateStr;
              const selectable = isDateSelectable(dayDate);

              return (
                <button
                  key={dateStr}
                  type="button"
                  className={`${styles.calendarDay} ${!isCurrentMonth ? styles.calendarDayOut : ""} ${isSelected ? styles.calendarDaySelected : ""} ${isWeekend ? styles.calendarDayWeekend : ""}`}
                  disabled={!selectable}
                  onClick={() => handleDateSelect(dateStr)}
                >
                  {dayDate.getDate()}
                </button>
              );
            })}
          </div>
        </div>

        {preferredDate && (
          <p className={wizardStyles.selectedDateLabel}>
            Valgt:{" "}
            {new Date(preferredDate + "T12:00:00").toLocaleDateString("da-DK", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
        )}
      </div>

      {showFlexibility && setDateFlexibility && (
        <div className={wizardStyles.flexSection}>
          <p className={styles.fieldLabel}>Fleksibilitet omkring datoen</p>
          <OptionGrid>
            {DATE_FLEXIBILITY_OPTIONS.map((option) => (
              <OptionButton
                key={option.id}
                selected={dateFlexibility === option.id}
                onClick={() => setDateFlexibility(option.id)}
                label={option.label}
                sub={option.sub}
              />
            ))}
          </OptionGrid>
        </div>
      )}

      {setPreferredTimeWindow && (
        <div className={wizardStyles.flexSection}>
          <p className={styles.fieldLabel}>Foretrukket tidspunkt</p>
          <OptionGrid>
            {PREFERRED_TIME_WINDOW_OPTIONS.map((option) => (
              <OptionButton
                key={option.id}
                selected={preferredTimeWindow === option.id}
                onClick={() => setPreferredTimeWindow(option.id)}
                label={option.label}
                sub={option.sub}
              />
            ))}
          </OptionGrid>
        </div>
      )}
    </>
  );
}
