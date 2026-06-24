import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { INTRO_CLEANING_FROM_KR } from "@/data/pricing";
import styles from "@/components/home/RenzenHomePage.module.css";

type BentoCell = {
  title: string;
  description?: string;
  href: string;
  image?: string;
  price?: string;
  eyebrow?: string;
  ctaLabel?: string;
  /** Title plus description row with arrow on the right (no price line). */
  inlineArrow?: boolean;
  imagePosition?: "center" | "gardener";
  variant: "lead" | "dark" | "compact" | "text";
  layout: "lead" | "tall" | "wide" | "small" | "half" | "text";
};

const bentoServices: BentoCell[] = [
  {
    title: "Fast rengøring",
    description:
      "En fast Zenmester lærer dit hjem og dine rutiner at kende. Vælg hver uge, hver anden uge eller hver fjerde uge.",
    href: "/privat-rengoring",
    image: "/flytterengoring-hero.jpg",
    eyebrow: "Mest valgt",
    inlineArrow: true,
    variant: "lead",
    layout: "lead",
  },
  {
    title: "Haveservice",
    description: "Græsslåning, hækklipning og havepleje",
    href: "/havearbejde/",
    image: "/havearbejde-3.png",
    imagePosition: "gardener",
    variant: "dark",
    layout: "tall",
  },
  {
    title: "Flytterengøring",
    href: "/flytterengoring",
    image: "/services/flyt-2.jpg",
    price: "Få fast pris",
    variant: "compact",
    layout: "wide",
  },
  {
    title: "Hovedrengøring",
    description: "Grundig rengøring fra top til bund",
    href: "/hovedrengoring",
    image: "/services/hovedrengoering-2.jpg",
    variant: "dark",
    layout: "half",
  },
  {
    title: `Første rengøring fra ${INTRO_CLEANING_FROM_KR} kr.`,
    description:
      "Som nyt medlem får du 200 kr. i velkomstkredit til din første rengøring — plus adgang til alle fordelene i Renzen Klub.",
    href: "/klub/",
    eyebrow: "Nyt medlem",
    ctaLabel: "Start med introtilbuddet",
    variant: "text",
    layout: "text",
  },
];

const bentoFeaturedHrefs = new Set(
  bentoServices
    .filter((cell) => cell.variant !== "text")
    .map((cell) => cell.href.replace(/\/$/, "")),
);

const moreServices = [
  { label: "Vinduespudsning", href: "/vinduespudsning" },
  { label: "Airbnb rengøring", href: "/airbnb-rengoring" },
  { label: "Forårs- og efterårsklargøring", href: "/foraars-og-efteraarsklargoering" },
  { label: "Ferieservice til haven", href: "/ferieservice-til-haven" },
  { label: "Fliserens", href: "/fliserens" },
  { label: "Tagrenderens", href: "/tagrenderens" },
  { label: "Flytning & flyttehjælp", href: "/flytning-og-flyttehjaelp" },
  { label: "Malerarbejde", href: "/malerarbejde" },
  { label: "Bortkørsel & affald", href: "/bortkoersel-og-affald" },
  { label: "Montering & ophængning", href: "/montering-og-ophaengning" },
  { label: "Møbelmontering", href: "/moebelmontering" },
  { label: "Kontorrengøring", href: "/kontorrengoring" },
  { label: "Boligforeninger", href: "/boligforeninger" },
  { label: "Flyttesyn", href: "/flyttesyn" },
  { label: "Rengøring som personalegode", href: "/personalegode" },
].filter((service) => !bentoFeaturedHrefs.has(service.href.replace(/\/$/, "")));

export function HomeServicesBento() {
  return (
    <>
    <div className={styles.bentoGrid}>
      {bentoServices.map((cell) => {
        const layoutClass = styles[`bento${cell.layout[0].toUpperCase()}${cell.layout.slice(1)}`];

        if (cell.variant === "text") {
          return (
            <Link
              key={cell.title}
              href={cell.href}
              className={`${styles.bentoCell} ${styles.bentoTextCell} ${layoutClass}`}
            >
              {cell.eyebrow ? (
                <p className={styles.bentoEyebrow}>{cell.eyebrow}</p>
              ) : null}
              <h3 className={styles.bentoTextTitle}>{cell.title}</h3>
              {cell.description ? (
                <p className={styles.bentoTextBody}>{cell.description}</p>
              ) : null}
              <span className={styles.bentoTextCta}>
                {cell.ctaLabel ?? "Se introtilbud"}
                <ArrowRight size={15} />
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={cell.title}
            href={cell.href}
            className={`group ${styles.bentoCell} ${layoutClass} ${
              cell.variant === "lead"
                ? styles.bentoLeadCell
                : cell.variant === "dark"
                  ? styles.bentoDarkCell
                  : styles.bentoCompactCell
            }`}
          >
            {cell.image ? (
              <Image
                src={cell.image}
                alt={cell.title}
                fill
                sizes={
                  cell.layout === "lead"
                    ? "(max-width: 1024px) 100vw, 58vw"
                    : cell.layout === "half"
                      ? "(max-width: 1024px) 100vw, 50vw"
                      : "(max-width: 1024px) 100vw, 33vw"
                }
                className={`${styles.bentoImage} ${
                  cell.imagePosition === "gardener" ? styles.bentoImageGardener : ""
                }`}
              />
            ) : null}

            {cell.variant === "lead" ? (
              <div className={styles.bentoLeadPanel}>
                {cell.eyebrow ? (
                  <p className={styles.bentoEyebrow}>{cell.eyebrow}</p>
                ) : null}
                {cell.inlineArrow ? (
                  <div className={styles.bentoLeadHead}>
                    <h3 className={styles.bentoLeadTitle}>{cell.title}</h3>
                    <ArrowRight size={17} className={styles.bentoLeadHeadArrow} />
                  </div>
                ) : (
                  <h3 className={styles.bentoLeadTitle}>{cell.title}</h3>
                )}
                {cell.description ? (
                  <p className={styles.bentoLeadBody}>{cell.description}</p>
                ) : null}
                {!cell.inlineArrow && cell.price ? (
                  <span className={styles.bentoPrice}>
                    {cell.price}
                    <ArrowRight size={15} />
                  </span>
                ) : null}
              </div>
            ) : null}

            {cell.variant === "dark" ? (
              <div className={styles.bentoDarkBar}>
                <h3 className={styles.bentoDarkTitle}>{cell.title}</h3>
                <div className={styles.bentoDarkMeta}>
                  {cell.description ? (
                    <p className={styles.bentoDarkBody}>{cell.description}</p>
                  ) : null}
                  <ArrowRight size={17} className={styles.bentoDarkArrow} />
                </div>
              </div>
            ) : null}

            {cell.variant === "compact" ? (
              <div
                className={
                  cell.layout === "wide"
                    ? styles.bentoCompactPanelRight
                    : styles.bentoCompactPanel
                }
              >
                <h3 className={styles.bentoCompactTitle}>{cell.title}</h3>
                {cell.inlineArrow ? (
                  <div className={styles.bentoCompactMeta}>
                    {cell.description ? (
                      <p className={styles.bentoCompactBody}>{cell.description}</p>
                    ) : (
                      <span />
                    )}
                    <ArrowRight size={17} className={styles.bentoCompactMetaArrow} />
                  </div>
                ) : (
                  <>
                    {cell.description ? (
                      <p className={styles.bentoCompactBody}>{cell.description}</p>
                    ) : null}
                    {cell.price ? (
                      <span className={styles.bentoPrice}>
                        {cell.price}
                        <ArrowRight size={15} />
                      </span>
                    ) : (
                      <ArrowRight size={15} className={styles.bentoCompactArrow} />
                    )}
                  </>
                )}
              </div>
            ) : null}
          </Link>
        );
      })}
    </div>

    <div className={styles.bentoMoreServices}>
      {moreServices.map((service) => (
        <Link
          key={service.href}
          href={service.href}
          className={styles.bentoMoreServiceBtn}
        >
          {service.label}
        </Link>
      ))}
    </div>
    </>
  );
}
