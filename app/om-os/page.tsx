import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, CheckCircle2, Scale } from "lucide-react";
import { createStaticPageMetadata } from "@/lib/siteMetadata";
import { siteConfig } from "@/lib/siteConfig";
import {
  RenzenEditorialFooter,
  RenzenEditorialHeader,
} from "@/components/site/RenzenEditorialChrome";

export const metadata: Metadata = createStaticPageMetadata({
  title: "Om Renzen",
  description:
    "Læs om Renzen — din professionelle rengøringsplatform med godkendte Zenmestre, forsikring og tilfredshedsgaranti.",
  path: "/om-os",
});

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fbfaf5] text-[#203129]">
      <RenzenEditorialHeader />
      <main>
        <section className="bg-brand-bg px-6 py-20 sm:py-28">
          <div className="mx-auto grid max-w-[1100px] items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-brand-green">
                <CheckCircle2 size={15} aria-hidden="true" />
                Om Renzen
              </div>
              <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight text-brand-blue sm:text-5xl">
                Din professionelle rengøringsplatform
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-brand-blue/75">
                Renzen er en dansk platform for professionel rengøring. Vi
                matcher private og erhverv med godkendte Zenmestre — med
                booking, forsikring og kundeservice samlet ét sted.
              </p>
              <Link
                href="/#sadan-virker-det"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-green px-6 py-3 font-bold text-white hover:bg-emerald-800"
              >
                Sådan virker Renzen
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
            <div className="rounded-3xl border border-white/70 bg-white p-8 shadow-lg">
              <Image
                src={siteConfig.logo}
                alt="Renzen"
                width={180}
                height={45}
                className="h-auto w-40"
              />
              <dl className="mt-8 space-y-5 text-sm">
                <div>
                  <dt className="font-bold text-brand-blue">Kontakt</dt>
                  <dd className="mt-1">
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="text-brand-green underline"
                    >
                      {siteConfig.email}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="mx-auto grid max-w-[1100px] gap-6 md:grid-cols-3">
            {[
              {
                icon: Building2,
                title: "Godkendte Zenmestre",
                text: "Rengøringen udføres af verificerede Zenmestre i Renzens netværk — med screening, forsikring og løbende kvalitetssikring.",
              },
              {
                icon: Scale,
                title: "Ét samlet brand",
                text: "Du booker og betaler gennem Renzen og får kundeservice, forsikring og tilfredshedsgaranti — uden at skulle koordinere med flere aktører.",
              },
              {
                icon: CheckCircle2,
                title: "Tydelige vilkår",
                text: "Vores handelsbetingelser og persondatapolitik forklarer, hvordan formidlingen og behandlingen af oplysninger foregår.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className="rounded-2xl border border-zinc-200 bg-white p-7"
              >
                <Icon className="text-brand-green" aria-hidden="true" />
                <h2 className="mt-4 font-display text-xl font-bold text-brand-blue">
                  {title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <RenzenEditorialFooter />
    </div>
  );
}
