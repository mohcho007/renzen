"use client";

import { useEffect, useState } from "react";
import styles from "@/components/dealside/DealTypeformWizard.module.css";

const TESTIMONIALS = [
  {
    name: "Marie S.",
    city: "Frederiksberg",
    initials: "MS",
    text: "Vi har fået gjort rent fast hver 2. uge i næsten et år nu, og det er den bedste beslutning, vi har taget. Vores faste Zenmester leverer altid et fantastisk stykke arbejde.",
  },
  {
    name: "Kasper D.",
    city: "København Ø",
    initials: "KD",
    text: "Fantastisk service! Det er utrolig nemt at booke, og lejligheden er skinnende ren hver gang.",
  },
  {
    name: "Sofie L.",
    city: "Valby",
    initials: "SL",
    text: "Pålidelig og grundig rengøring. Rigtig rart med den samme faste rengøringsassistent hver gang.",
  },
  {
    name: "Thomas M.",
    city: "København S",
    initials: "TM",
    text: "Super tilfreds. Rengøringen er i top, og fakturaen indeholder alt det nødvendige til at få servicefradrag nemt og hurtigt.",
  },
  {
    name: "Morten B.",
    city: "Lyngby",
    initials: "MB",
    text: "Utrolig venlig Zenmester og meget grundig rengøring af både køkken og badeværelse. Kan varmt anbefales!",
  },
] as const;

type Testimonial = (typeof TESTIMONIALS)[number] & { timestamp: string };

function withTimestamps(items: (typeof TESTIMONIALS)[number][]): Testimonial[] {
  return items.map((item, index) => {
    let timestamp = "";
    if (index === 0) timestamp = "ca. 49 min. siden";
    else if (index === 1) timestamp = "I går";
    else if (index < 4) timestamp = `${index} dage siden`;
    else timestamp = "1 uge siden";
    return { ...item, timestamp };
  });
}

export default function DealSummaryTrustPanel() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const shuffled = [...TESTIMONIALS].sort(() => Math.random() - 0.5);
    setTestimonials(withTimestamps(shuffled));
  }, []);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials]);

  if (testimonials.length === 0) return null;

  const current = testimonials[currentIdx];

  return (
    <div className={styles.summaryTrust}>
      <div className={styles.summaryLiveReviews}>
        <h4 className={styles.summaryLiveReviewsTitle}>
          <span className={styles.summaryLiveDot} aria-hidden />
          Live anmeldelser
        </h4>
        <div className={styles.summaryReviewCard}>
          <div className={styles.summaryReviewAvatar}>{current.initials}</div>
          <div className={styles.summaryReviewBody}>
            <div className={styles.summaryReviewHeader}>
              <strong>{current.name}</strong>
              <span>· {current.timestamp}</span>
            </div>
            <span className={styles.summaryReviewCity}>{current.city}</span>
            <div className={styles.summaryReviewStars} aria-hidden>
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
            <p>{current.text}</p>
          </div>
        </div>
      </div>

      <div className={styles.summaryRenCover}>
        <p className={styles.summaryRenCoverTitle}>
          Bookingen beskyttes af <strong>Ren</strong>
          <em>Cover</em>
        </p>
        <div className={styles.summaryRenCoverRow}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
              fill="#e6f4f1"
              stroke="#206d69"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 14l-0.6-0.5c-2-1.8-3.4-3.1-3.4-4.7 0-1.3 1-2.3 2.3-2.3.7 0 1.4 0.3 1.7 0.9.3-0.6 1-0.9 1.7-0.9 1.3 0 2.3 1 2.3 2.3 0 1.6-1.4 2.9-3.4 4.7l-0.6 0.5z"
              fill="#206d69"
            />
          </svg>
          <p>
            Din rengøring er forsikret for <strong>10.000.000 kr.</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
