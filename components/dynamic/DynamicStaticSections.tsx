import Image from "next/image";
import { Reveal } from "@/components/dynamic/Reveal";
import {
  getServiceNameInSentence,
  type Service,
} from "@/lib/services";
import { siteConfig } from "@/lib/siteConfig";
import { SiteFooter } from "@/components/site/SiteFooter";

export function DynamicPricingSection({
  service,
  locationPhrase,
}: {
  service: Service;
  locationPhrase?: string;
}) {
  const serviceName = getServiceNameInSentence(service);
  return (
    <section className="w-full bg-white py-16 sm:py-20 border-b border-stone-100 relative z-20">
      <div className="max-w-[1300px] mx-auto px-6">
        <div className="text-center mb-10 max-w-xl mx-auto flex flex-col gap-3">
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-[#192251]">
            Hvad koster {serviceName}
            {locationPhrase ? ` ${locationPhrase}` : ""}?
          </h2>
          <p className="text-zinc-500 font-semibold text-sm">
            Se vejledende gennemsnitspriser for de forskellige rengøringsydelser.
          </p>
        </div>
        <div className="max-w-2xl mx-auto border border-stone-200/90 rounded-2xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-2 bg-stone-50 border-b border-stone-200 px-6 py-3 font-bold text-sm text-[#192251]">
            <div>Opgavetype</div>
            <div className="text-right">Vejledende pris</div>
          </div>
          {service.pricingTable.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-2 border-b border-stone-100 last:border-0 px-6 py-4 text-sm font-semibold text-zinc-700"
            >
              <div>{row.label}</div>
              <div className="text-right text-[#192251]">{row.price}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DynamicComparisonSection() {
  return (
    <div className="px-0 sm:px-5 w-full my-6 sm:my-8">
      <section className="py-16 sm:py-20 bg-stone-50 rounded-none sm:rounded-[18px] border-y sm:border border-zinc-200/50 relative overflow-hidden">
        <div className="max-w-[1300px] mx-auto px-6 text-center">
          <Reveal className="max-w-3xl mx-auto mb-16 flex flex-col gap-3">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-[40px] text-brand-blue tracking-tight leading-[1.2]">
              Det har aldrig været nemmere at finde et rengøringsfirma
            </h2>
            <p className="text-zinc-600 font-medium text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Glem alt om ubesvarede mails, endeløse opkald og uoverskuelige
              priser. Med {siteConfig.name} klares det hele digitalt på under 2 minutter.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 max-w-[1200px] mx-auto">
            <Reveal className="flex flex-col items-center w-full">
              <h3 className="font-display font-bold text-lg sm:text-xl text-zinc-800 mb-6">
                Rengøring på den gamle måde
              </h3>
              <div className="relative w-full aspect-[1.5/1] max-w-[404px] flex items-center justify-center mt-[60px]">
                <Image
                  src="/foer-renzen.png"
                  alt="Rengøring på den gamle måde - Besværligt og stressende"
                  width={500}
                  height={333}
                  className="object-contain w-full h-auto"
                />
              </div>
            </Reveal>

            <Reveal className="flex flex-col items-center w-full">
              <h3 className="font-display font-bold text-lg sm:text-xl text-zinc-800 mb-6">
                Rengøring med {siteConfig.name}
              </h3>
              <div className="relative w-full aspect-[1.5/1] max-w-[404px] flex items-center justify-center mt-[63px]">
                <Image
                  src="/efter-renzen.png"
                  alt={`Rengøring med ${siteConfig.name} - Nemt og overskueligt`}
                  width={500}
                  height={333}
                  className="object-contain w-full h-auto"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}

export function DynamicHowItWorksSection() {
  const steps = [
    {
      imagePath: "/3d_step1_blue.png",
      bgColor: "#f0f4ff",
      title: "1. Beskriv din opgave",
      description:
        "Vælg opgavetype, indtast dit postnummer og tilføj et par hurtige detaljer om dine rengøringsønsker.",
    },
    {
      imagePath: "/3d_step2_violet.png",
      bgColor: "#f5f3ff",
      title: "2. Modtag tilbud",
      description:
        "Vi matcher din forespørgsel med op til 3 kvalitetssikrede, lokale firmaer. De vender tilbage med tilbud.",
    },
    {
      imagePath: "/3d_step3_green.png",
      bgColor: "#f0fdf4",
      title: "3. Vælg det bedste",
      description:
        "Sammenlign de modtagne tilbud på pris, fleksibilitet og tidligere kunders anmeldelser. Vælg frit.",
    },
  ];

  return (
    <div className="px-0 sm:px-5 w-full my-6 sm:my-8">
      <section
        id="sadan-virker-det"
        className="py-16 sm:py-20 bg-[#f8fafc] rounded-none sm:rounded-[18px] border-y sm:border border-zinc-200/50 relative overflow-hidden"
      >
        <div className="max-w-[1300px] mx-auto px-6 text-center">
          <Reveal className="max-w-2xl mx-auto mb-16 flex flex-col gap-3">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-blue">
              Sådan virker {siteConfig.name}
            </h2>
            <p className="text-zinc-600 font-medium text-lg leading-relaxed">
              Vi har gjort det så let som muligt for dig at hente tilbud og
              spare penge på din rengøring.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {steps.map((step, index) => (
              <Reveal
                key={step.title}
                style={{ backgroundColor: step.bgColor }}
                className="border border-zinc-200/50 p-8 rounded-3xl flex flex-col items-center gap-4 text-center min-h-[300px] justify-center transition-all duration-300 hover:shadow-md hover:border-primary/20"
              >
                <div className="relative h-[120px] w-32 mb-2">
                  <Image
                    src={step.imagePath}
                    alt={`Illustration af trin ${index + 1}: ${step.title}`}
                    fill
                    sizes="128px"
                    className="object-contain"
                  />
                </div>
                <h3 className="font-display font-bold text-lg text-brand-blue">
                  {step.title}
                </h3>
                <p className="text-zinc-600 font-medium text-sm leading-relaxed max-w-[240px]">
                  {step.description}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function AppStoreBadge({ compact = false }: { compact?: boolean }) {
  return (
    <a
      href="https://apps.apple.com"
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center bg-black hover:bg-zinc-900 border border-white/10 text-white transition-colors shadow-xs ${
        compact
          ? "gap-1.5 px-3 py-1.5 rounded-lg"
          : "gap-1.5 px-3.5 py-2.5 rounded-xl"
      }`}
    >
      <svg
        className={compact ? "w-5.5 h-5.5 text-white" : "w-5.5 h-5.5 text-white"}
        viewBox="0 0 384 512"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-48.4-19.3-76.5-19.3-36.9 0-77.8 23.7-96.6 57-39.6 69.6-10.2 172.7 27.6 226.7 18.6 26.9 40.6 56.7 69.6 55.6 27.9-1.1 38.4-18.2 72.2-18.2 33.6 0 43.1 18.2 72.2 17.6 29.6-.5 49-26.9 67.3-53.7 21.2-30.8 29.7-60.8 30.2-62.3-.6-.3-57.4-22-57.8-87.1zM302.2 120c15.2-18.6 25.8-44.1 22.5-70.1-23.7 1-52.7 15.6-69.7 35.5-14.8 17.1-27.7 42.6-24.1 68 26.2 2 53.7-14.8 71.3-33.4z" />
      </svg>
      <span className="text-left flex flex-col justify-center -mt-0.5">
        <span className={compact ? "text-[8px] leading-tight" : "text-[8px] leading-tight"}>
          Hent i
        </span>
        <span className={compact ? "text-[13px] leading-none font-semibold" : "text-[13px] leading-none font-semibold"}>
          App Store
        </span>
      </span>
    </a>
  );
}

function GooglePlayBadge({ compact = false }: { compact?: boolean }) {
  return (
    <a
      href="https://play.google.com"
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center bg-black hover:bg-zinc-900 border border-white/10 text-white transition-colors shadow-xs ${
        compact
          ? "gap-1.5 px-3 py-1.5 rounded-lg"
          : "gap-1.5 px-3.5 py-2.5 rounded-xl"
      }`}
    >
      <svg className="w-5.5 h-5.5" viewBox="0 0 512 512" aria-hidden="true">
        <path fill="#2196f3" d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1z" />
        <path fill="#4caf50" d="M47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0z" />
        <path fill="#ffeb3b" d="M425.2 225.6l-58 33.3-60.1-60.1 60.1-60.1 58 33.3c13 7.5 21.7 19.9 21.7 33.6s-8.7 26.1-21.7 33.1z" />
        <path fill="#f44336" d="M385.4 337.8L104.6 499l220.7-221.3 60.1 60.1z" />
      </svg>
      <span className="text-left flex flex-col justify-center -mt-0.5">
        <span className="text-[8px] leading-tight font-medium opacity-80">
          NU PÅ
        </span>
        <span className="text-[13px] leading-none font-semibold tracking-tight mt-0.5">
          Google Play
        </span>
      </span>
    </a>
  );
}

export function DynamicAppDownloadSection() {
  return (
    <div className="px-0 sm:px-5 w-full my-6 sm:my-8 lg:my-16">
      <section
        id="download-app"
        className="pt-16 pb-0 lg:py-0 lg:h-[450px] bg-gradient-to-br from-[#192251] to-[#243377] rounded-none sm:rounded-[18px] border-y sm:border border-blue-400/10 relative text-white flex items-center overflow-hidden"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 rounded-none sm:rounded-[18px]">
          <div className="absolute left-0 top-0 w-80 h-80 opacity-[0.2]">
            <Image
              src="/shapes/structure-section-line1.svg"
              fill
              sizes="320px"
              className="object-contain object-left-top"
              alt=""
            />
          </div>
          <div className="absolute right-0 bottom-0 w-80 h-80 opacity-[0.05]">
            <Image
              src="/shapes/cubes.svg"
              fill
              sizes="320px"
              className="object-contain object-right-bottom"
              alt=""
            />
          </div>
          <div className="absolute -top-[30%] -right-[10%] w-[60%] h-[70%] rounded-full bg-white/5 blur-[100px]" />
          <div className="absolute -bottom-[30%] -left-[10%] w-[50%] h-[60%] rounded-full bg-blue-300/5 blur-[100px]" />
        </div>

        <div className="max-w-[1300px] mx-auto px-6 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 flex flex-col gap-6 text-left">
              <Reveal className="flex flex-col gap-2">
                <span className="text-[14px] font-bold uppercase tracking-wider text-sky-300">
                  Hent {siteConfig.name} Appen
                </span>
                <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-[42px] leading-tight text-white tracking-tight">
                  Bestil din rengøring <br /> på under et minut
                </h2>
                <p className="text-slate-200 font-medium text-base sm:text-lg leading-relaxed max-w-xl mt-1">
                  Planlæg, følg og betal for din rengøringshjælp – alt sammen i
                  én og samme app.
                </p>
              </Reveal>
              <Reveal className="flex items-center gap-3 mt-2">
                <AppStoreBadge />
                <GooglePlayBadge />
              </Reveal>
            </div>

            <div className="lg:col-span-5 relative h-full flex items-end justify-center lg:hidden w-full">
              <div className="relative w-full aspect-[4/3] max-w-full mx-auto mt-6 pointer-events-none scale-135 translate-x-[2%] origin-bottom">
                <Image
                  src="/renzen mobil mockup.png"
                  alt="Mobiltelefon der viser Renzens rengøringsapplikation og tilbudsoversigt"
                  fill
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-contain object-bottom"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block absolute bottom-[-1px] top-[-55px] right-[1%] xl:right-[3%] w-[800px] pointer-events-none z-20">
          <Image
            src="/renzen mobil mockup.png"
            alt="To mobiltelefoner der viser Renzens applikation med tilbud på rengøring"
            fill
            sizes="800px"
            className="object-contain object-bottom"
          />
        </div>
      </section>
    </div>
  );
}

export function DynamicFooterSection() {
  return <SiteFooter />;
}
