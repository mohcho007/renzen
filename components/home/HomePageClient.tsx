"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { HomeFaqSection } from "@/components/home/HomeFaqSection";
import { HeroImageFrame } from "@/components/site/HeroImageFrame";
import { SiteHeader } from "@/components/site/SiteHeader";
import { 
  CheckCircle2, 
  MapPin, 
  Sparkles, 
  ArrowRight,
  Home as HomeIcon,
  Building2,
  LayoutList,
  Package
} from "lucide-react";

type CustomerType = "private" | "company" | "community" | "outdoor";
type DawaSuggestion = { tekst: string };

function FadeInSection({ 
  children, 
  className = "", 
  delayClass = "", 
  style,
  onClick
}: { 
  children: React.ReactNode; 
  className?: string; 
  delayClass?: string; 
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    
    const current = domRef.current;
    if (current) {
      observer.observe(current);
    }
    
    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, []);

  return (
    <div
      ref={domRef}
      onClick={onClick}
      style={style}
      className={`fade-in-section ${isVisible ? "is-visible" : ""} ${delayClass} ${className}`}
    >
      {children}
    </div>
  );
}

const PAST_TASKS = [
  {
    id: "task-1",
    category: "regular",
    title: "Fast ugentlig privat rengøring",
    city: "Valby, Storkøbenhavn",
    description: "Vi søger hjælp til rengøring af vores 2-værelses lejlighed på 58 kvm. Rengøringen skal finde sted enten mandag eller torsdag efter kl. 16. Vi har selv rengøringsmidler. Bemærk venligst, at vi har både hund og kat. Vi leder efter en pålidelig person, der er god til at overholde aftaler og møde op hver uge.",
    rating: 5,
    price: "750 kr."
  },
  {
    id: "task-2",
    category: "regular",
    title: "Ugentlig husholderse til villa",
    city: "Hellerup",
    description: "Rengøring af nyopført villa på 154 m². Omfatter støvsugning, gulvvask af alle trægulve, grundig rengøring af 2 badeværelser samt skift af sengetøj, foldning af vasketøj, og generel afstøvning. Vi ønsker en fast ugedag, og vi stiller alle midler til rådighed.",
    rating: 5,
    price: "1.200 kr."
  },
  {
    id: "task-3",
    category: "regular",
    title: "Gentagende rengøring hver uge",
    city: "Aarhus N",
    description: "Vi søger hjælp til almindelig rengøring af vores rækkehus på 72 kvm. Opgaven omfatter støvsugning, gulvvask, fjernelse af støv og spindelvæv, samt rengøring af et lille badeværelse og køkken. Skraldespande og pantspand skal tømmes.",
    rating: 5,
    price: "900 kr."
  },
  {
    id: "task-4",
    category: "regular",
    title: "Månedlig rengøring",
    city: "Odense M",
    description: "Hjælp søges til fast månedlig rengøring af vores hus på 140 kvm, hvor vi ønsker den samme person hver gang. Rengøringen omfatter aftørring af støv, støvsugning, gulvvask, afkalkning af overflader på badeværelset, samt skift af sengetøj.",
    rating: 5,
    price: "1.050 kr."
  },
  {
    id: "task-5",
    category: "regular",
    title: "Privat rengøring af villa",
    city: "Roskilde",
    description: "Vi søger hjælp til grundig rengøring af vores villa på cirka 200 m², som inkluderer to badeværelser. Opgaven omfatter fuld rengøring af alle rum, herunder afsyring af brusenicher samt aftørring og afstøvning af overflader.",
    rating: 5,
    price: "1.500 kr."
  },
  {
    id: "task-6",
    category: "regular",
    title: "Fast privat rengøring",
    city: "Esbjerg",
    description: "Vi søger en pålidelig rengøringshjælp til vores hus på 112 m². Opgaven omfatter almindelig rengøring af husets bad, wc, 3 værelser samt køkken, herunder støvsugning, gulvvask og rengøring af flader hver fredag.",
    rating: 5,
    price: "750 kr."
  },
  {
    id: "task-7",
    category: "regular",
    title: "Ugentlig badeværelsesrengøring",
    city: "Vejle",
    description: "Ugentlig rengøring af vores hus på 130 m². Særligt fokus på husets 2 store badeværelser, herunder vask af fliser, afkalkning af brusekabiner og aftørring af alle overflader. Forventet arbejdstid er cirka 2 timer.",
    rating: 5,
    price: "600 kr."
  },
  {
    id: "task-8",
    category: "regular",
    title: "Rengøring af rækkehus",
    city: "Kolding",
    description: "Fast privat rengøring ønskes til et lille rækkehus med 1. og 2. sal. Der skal være særligt fokus på trappevask og grundig gulvrengøring. Vi ønsker gerne den samme hjælper hver gang, så personen kender rengøringsflowet.",
    rating: 5,
    price: "900 kr."
  },
  {
    id: "task-9",
    category: "regular",
    title: "Fast ugentlig rengøring",
    city: "Randers",
    description: "Vi leder efter en stabil person, der kan gøre rent hos os fast ugentligt. Det drejer sig om en villa på 150 m², og det inkluderer aftørring af paneler, afstøvning af møbler og grundig rengøring af 2 badeværelser.",
    rating: 5,
    price: "900 kr."
  },
  {
    id: "task-10",
    category: "regular",
    title: "Fredagsrengøring",
    city: "Silkeborg",
    description: "Vi leder efter en grundig hjælper, der kan komme hver fredag formiddag. Rengøringen består af almindelig rengøring med støvsugning, aftørring af støv og vask af overflader i køkken og bad. Vi foretrækker den samme hjælper.",
    rating: 5,
    price: "750 kr."
  },
  {
    id: "task-11",
    category: "move_out",
    title: "Grundig flytterengøring",
    city: "København V",
    description: "Komplet flytterengøring af en 3-værelses lejlighed på 78 kvm. Omfatter grundig rengøring af ovn, køleskab, emhætte, paneler, døre, og komplet afkalkning af badeværelse. Alt skal være klar til syn.",
    rating: 5,
    price: "2.400 kr."
  },
  {
    id: "task-12",
    category: "move_out",
    title: "Flytterengøring af villa",
    city: "Køge",
    description: "Flytterengøring af en stor villa på 160 m² efter fraflytning. Vi har brug for komplet rengøring af alle flader, indvendig skabsrengøring, vinduespudsning samt afkalkning af to badeværelser. Højeste kvalitet påkrævet.",
    rating: 5,
    price: "3.500 kr."
  },
  {
    id: "task-13",
    category: "move_out",
    title: "Flytterengøring af lejlighed",
    city: "Aarhus C",
    description: "Flytterengøring af tom 2-værelses lejlighed på 62 kvm. Omfatter aftørring af alle flader, vask af køkkenelementer, rengøring af ovn og emhætte, samt komplet rengøring af badeværelse. Alt skal afleveres rent.",
    rating: 5,
    price: "1.900 kr."
  },
  {
    id: "task-14",
    category: "company",
    title: "Ugentlig kontorrengøring",
    city: "København S",
    description: "Rengøring af kontorlokaler på 140 m² to gange om ugen (tirsdag og torsdag) efter kl. 17. Omfatter tømning af skraldespande, aftørring af skriveborde og fællesborde, støvsugning samt gulvvask.",
    rating: 5,
    price: "2.100 kr. / uge"
  },
  {
    id: "task-15",
    category: "company",
    title: "Erhvervsrengøring af klinik",
    city: "Aarhus C",
    description: "Vi søger professionel erhvervsrengøring til vores kliniklokaler. Rengøringen skal udføres tre gange om ugen efter lukketid og skal overholde høje hygiejnestandarder. Erhvervsansvarsforsikring er et krav.",
    rating: 5,
    price: "3.800 kr. / uge"
  },
  {
    id: "task-16",
    category: "company",
    title: "Kontorrengøring hver 14. dag",
    city: "Odense C",
    description: "Kontorrengøring af mindre tegnestue på 95 m². Opgaven omfatter støvsugning, gulvvask, afstøvning af kontorpladser og rengøring af et lille tekøkken og toilet. Udføres hver anden fredag efter kl. 16.",
    rating: 5,
    price: "1.050 kr."
  },
  {
    id: "task-17",
    category: "window",
    title: "Vinduespolering af villa",
    city: "Hillerød",
    description: "Fik pudset alle vinduer både indvendigt og udvendigt i vores to-plans hus på 140 kvm. Professionel og stribefrit arbejde. Vi har nu lavet en uforpligtende fast aftale om pudsning hver 8. uge.",
    rating: 5,
    price: "550 kr."
  },
  {
    id: "task-18",
    category: "window",
    title: "Vinduespudsning af lejlighed",
    city: "København Ø",
    description: "Hurtig og effektiv vinduespudsning af vores 4. sals lejlighed. Svært tilgængelige ruder på altan og i stue blev klaret til perfektion. Super tilfreds med den hurtige levering.",
    rating: 5,
    price: "350 kr."
  },
  {
    id: "task-19",
    category: "window",
    title: "Udvendig vinduespolering",
    city: "Horsens",
    description: "Udvendig vinduespudsning af parcelhus på 120 kvm. Pålideligt firma, der kommer hver anden måned som aftalt. Flot stribefrit resultat og hurtig afregning.",
    rating: 5,
    price: "300 kr."
  },
  {
    id: "task-20",
    category: "window",
    title: "Ruderens af sommerhus",
    city: "Gilleleje",
    description: "Rensning og pudsning af alle ruder i sommerhuset efter vintersæsonen. Vinduerne var dækket af salt og sand, men fremstår nu helt klare. God service til en yderst pris.",
    rating: 5,
    price: "450 kr."
  },
  {
    id: "task-21",
    category: "outdoor",
    title: "Fliserens og imprægnering",
    city: "Roskilde",
    description: "Vores terrasse på 55 kvm var hårdt ramt af alger og flisepest. Professionel mekanisk fliserens, efterfulgt af desinficering, imprægnering og indfejning af nyt fugesand. Terrassen ser ud som ny.",
    rating: 5,
    price: "1.800 kr."
  },
  {
    id: "task-22",
    category: "outdoor",
    title: "Algebehandling af indkørsel",
    city: "Silkeborg",
    description: "Professionel algebehandling af vores fliseindkørsel på 90 kvm. Algerne visnede væk efter et par uger, og fliserne ser nu pæne og rene ud igen. Hurtigt udført.",
    rating: 5,
    price: "1.200 kr."
  },
  {
    id: "task-23",
    category: "outdoor",
    title: "Træterrasserens for alger",
    city: "Vejle",
    description: "Dybdegående rensning af vores træterrasse for grønne alger og skidt. Terrassen blev renset skånsomt uden at beskadige træet og er nu klar til sommerområdet. Meget professionelt.",
    rating: 5,
    price: "1.500 kr."
  }
];

const row1 = PAST_TASKS.slice(0, 12);
const row2 = PAST_TASKS.slice(12);
const row1Repeated = [...row1, ...row1];
const row2Repeated = [...row2, ...row2];

export default function HomePageClient({
  introSections,
  pricingSection,
  coverageAndAppSections,
  closingSections,
}: {
  introSections: React.ReactNode;
  pricingSection: React.ReactNode;
  coverageAndAppSections: React.ReactNode;
  closingSections: React.ReactNode;
}) {
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [postalCode, setPostalCode] = useState('');
  const [suggestions, setSuggestions] = useState<DawaSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Geolocate lookup via Danish DAWA API
  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      alert("Geolokalisering er ikke understøttet af din enhed.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://api.dataforsyningen.dk/adgangsadresser/reverse?x=${longitude}&y=${latitude}`
          );
          if (res.ok) {
            const data = await res.json();
            if (data && data.postnummer) {
              setPostalCode(`${data.postnummer.nr} ${data.postnummer.navn}`);
              setSuggestions([]);
              setShowSuggestions(false);
            } else {
              alert("Kunne ikke finde postnummer for din placering.");
            }
          } else {
            alert("Fejl ved kommunikation med adresseregisteret.");
          }
        } catch {
          alert("Netværksfejl under placeringssøgning.");
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        alert("Giv adgang til din placering i browseren for at hente postnummer.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handlePostalCodeChange = async (val: string) => {
    setPostalCode(val);
    if (val.trim().length >= 2) {
      try {
        const res = await fetch(
          `https://api.dataforsyningen.dk/postnumre/autocomplete?q=${encodeURIComponent(val)}`
        );
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data);
          setShowSuggestions(true);
        }
      } catch (err) {
        console.error("Error fetching DAWA suggestions:", err);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const match = postalCode.match(/\b\d{4}\b/);
    const code = match ? match[0] : "";

    if (!code || code.length !== 4) {
      alert("Indtast venligst et gyldigt 4-cifret postnummer eller vælg fra listen.");
      return;
    }
    router.push(`/book-rengoering?postcode=${code}`);
  };

  return (
    <div className="min-h-screen bg-white text-foreground flex flex-col font-sans">
      {/* Sticky Header Outside Hero Section */}
      <SiteHeader />

      {/* Floating Hero Canvas */}
      <div className="px-0 sm:px-5 w-full sm:mt-2 mb-5">
        <section className="bg-brand-bg rounded-none sm:rounded-[18px] pt-4 pb-[16px] md:pb-[20px] relative overflow-hidden">

          {/* Floating Aura Blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute -top-[20%] -left-[10%] w-[55%] h-[65%] rounded-full bg-blue-300/25 blur-[120px] animate-blob" />
            <div className="absolute -bottom-[20%] -right-[10%] w-[55%] h-[65%] rounded-full bg-emerald-200/15 blur-[120px] animate-blob animation-delay-2000 xl:hidden" />
            <div className="absolute top-[30%] left-[25%] w-[40%] h-[45%] rounded-full bg-violet-200/15 blur-[120px] animate-blob animation-delay-4000" />
            <HeroImageFrame
              src="/rengoering-video-renzen-hero.mp4"
              alt="Skinnende rent hjem med Renzen"
              imagePosition="right"
              imageOffsetX={0}
              priority
            />
          </div>

          <div className="max-w-[1300px] xl:max-w-[1380px] mx-auto px-6 xl:pl-4 flex flex-col lg:grid lg:grid-cols-12 gap-10 lg:gap-16 items-center lg:items-start relative z-10">
          
          {/* Top Left Text Content */}
          <div className="order-1 lg:col-span-7 lg:col-start-1 xl:col-span-7 xl:col-start-1 lg:row-start-1 flex flex-col gap-6 text-left lg:mt-0 w-full relative z-20">
            <div className="inline-flex items-center gap-2 bg-brand-badge text-brand-blue px-3.5 py-1.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider w-fit">
              <CheckCircle2 size={16} className="text-brand-green" />
              <span>100% Tilfredshedsgaranti</span>
            </div>

            <h1 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-[28px] xl:text-[32px] text-brand-blue tracking-tight leading-[1.2]">
              Beregn pris og book din <span className="bg-[#FFE376] text-brand-blue px-3 py-1 rounded-xl inline-block">rengøring</span> på 2 minutter
            </h1>

            <p className="text-lg leading-relaxed text-brand-blue/80 max-w-xl font-medium">
              Vores dygtige Zenmestre sikrer et skinnende rent hjem eller kontor. Få en fast pris og online booking uden binding.
            </p>
            {/* Postcode Form with DAWA Autocomplete and Geolocation */}
            <form onSubmit={handleSearch} className="w-full max-w-md mt-2 mb-4 z-20 relative space-y-4">
              <div className="space-y-1.5" ref={dropdownRef}>
                <label htmlFor="hero-postal-code" className="text-[15px] font-bold text-brand-blue block">
                  Indtast dit postnummer
                </label>
                <div className="relative flex items-center">
                  <input
                    id="hero-postal-code"
                    type="text"
                    placeholder="F.eks. 2650 eller Hvidovre"
                    value={postalCode}
                    onChange={(e) => handlePostalCodeChange(e.target.value)}
                    className="w-full h-12 bg-white border border-stone-300 rounded-xl px-4 text-[15px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3B7965] focus:border-[#3B7965] transition-all font-medium"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleGeolocate}
                    disabled={isLocating}
                    className="absolute right-4 p-1.5 text-brand-green hover:text-emerald-800 disabled:opacity-50 cursor-pointer z-10"
                    title="Brug min placering"
                  >
                    {isLocating ? (
                      <div className="h-4 w-4 border-2 border-stone-200 border-t-brand-green rounded-full animate-spin" />
                    ) : (
                      <MapPin size={18} />
                    )}
                  </button>

                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-stone-200 rounded-xl shadow-xl mt-1.5 z-30 max-h-60 overflow-y-auto font-medium text-sm text-slate-700">
                      {suggestions.map((s, idx) => (
                        <div
                          key={idx}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setPostalCode(s.tekst);
                            setShowSuggestions(false);
                          }}
                          className="px-4 py-3 hover:bg-stone-50 cursor-pointer border-b border-stone-100 last:border-0 flex justify-between items-center transition-colors duration-150"
                        >
                          <span>{s.tekst}</span>
                          <span className="text-xs text-slate-400 font-mono bg-stone-100 px-2 py-0.5 rounded">Postnummer</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#3B7965] hover:bg-emerald-800 text-white font-display font-bold h-12 rounded-xl text-[15px] flex items-center justify-center gap-2 shadow-md transition-all scale-100 hover:scale-[1.02] active:scale-[0.98] btn-shimmer-container cursor-pointer uppercase tracking-wider"
              >
                <span>Beregn pris</span>
                <ArrowRight size={18} />
              </button>
            </form>


            {/* Bullets med Renzen fordele */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 mb-4 max-w-xl">
              <div className="flex items-center gap-2.5 text-zinc-700 text-sm font-semibold">
                <span className="w-5 h-5 bg-[#3b7965]/10 text-[#3b7965] flex items-center justify-center rounded-md text-xs font-bold shrink-0">✓</span>
                <span>Fast pris med det samme</span>
              </div>
              <div className="flex items-center gap-2.5 text-zinc-700 text-sm font-semibold">
                <span className="w-5 h-5 bg-[#3b7965]/10 text-[#3b7965] flex items-center justify-center rounded-md text-xs font-bold shrink-0">✓</span>
                <span>Fast Zenmester (Rengøringshjælp)</span>
              </div>
              <div className="flex items-center gap-2.5 text-zinc-700 text-sm font-semibold">
                <span className="w-5 h-5 bg-[#3b7965]/10 text-[#3b7965] flex items-center justify-center rounded-md text-xs font-bold shrink-0">✓</span>
                <span>Miljøvenlig rengøring</span>
              </div>
              <div className="flex items-center gap-2.5 text-zinc-700 text-sm font-semibold">
                <span className="w-5 h-5 bg-[#3b7965]/10 text-[#3b7965] flex items-center justify-center rounded-md text-xs font-bold shrink-0">✓</span>
                <span>Gør brug af servicefradraget</span>
              </div>
            </div>

          </div>

          
        </div>
      </section>
      </div>

      {introSections}

      {/* Services Section */}
      <div className="px-0 sm:px-5 w-full my-6 sm:my-8">
        <section id="services" className="py-16 sm:py-20 bg-zinc-50/50 rounded-none sm:rounded-[18px] border-y sm:border border-zinc-200/50 relative overflow-hidden">
          <div className="max-w-[1300px] mx-auto px-6">
          <FadeInSection className="max-w-2xl mx-auto text-center mb-16 flex flex-col gap-3">

            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-blue">
              Professionel <span className="bg-[#FFE376] text-brand-blue px-3 py-1 rounded-xl inline-block">rengøring</span> til alle behov
            </h2>
            <p className="text-zinc-600 font-medium text-lg leading-relaxed">
              Vi matcher alle typer opgaver inden for indendørs rengøring og udendørs vedligeholdelse.
            </p>
          </FadeInSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Privat rengøring",
                desc: "Regelmæssig eller enkeltstående rengøring af dit hjem, så du får mere fritid.",
                category: "private",
                service: "regular_cleaning",
                img: "/privat-rengoring.png",
                bgColor: "#f0f4ff",
                icon: HomeIcon
              },
              {
                title: "Flytterengøring",
                desc: "Grundig rengøring ved fraflytning, der gør boligen klar til flyttesyn.",
                category: "private",
                service: "move_out_cleaning",
                img: "/flytterengoring-2.png",
                bgColor: "#fff0f0",
                icon: Package
              },
              {
                title: "Erhvervsrengøring",
                desc: "Kontorer, butikker, og erhvervslokaler – skræddersyet til jeres åbningstider.",
                category: "company",
                service: "regular_cleaning",
                img: "/erhvervsrengøring-2.png",
                bgColor: "#f0fdf4",
                icon: Building2
              },
              {
                title: "Trappevask",
                desc: "Rene opgange og fællesarealer for andels-, ejer- og lejeboligforeninger.",
                category: "community",
                service: "stairs_cleaning",
                img: "/trappevask.png",
                bgColor: "#f5f3ff",
                icon: LayoutList
              },
              {
                title: "Fliserens",
                desc: "Afrensning af alger og flisepest, så dine fliser og udearealer ser ud som nye.",
                category: "outdoor",
                service: "tile_cleaning",
                img: "/fliserens-2.png",
                bgColor: "#fef9ee",
                icon: Sparkles
              },
              {
                title: "Vinduespudsning",
                desc: "Krystalklare ruder og pudsning af rammer, både indvendigt og udvendigt.",
                category: "private",
                service: "window_cleaning",
                img: "/vinduespudsning.png",
                bgColor: "#e8f7f5",
                icon: Sparkles
              }
            ].map((service, idx) => {
              const IconComponent = service.icon;
              const delayClass = idx % 3 === 0 ? "fade-in-delay-100" : idx % 3 === 1 ? "fade-in-delay-200" : "fade-in-delay-300";
              return (
                <FadeInSection 
                  key={idx} 
                  delayClass={delayClass}
                >
                  <a
                    href={`/book-rengoering/?type=${service.category}&service=${service.service}`}
                    className="relative z-10 flex flex-row items-center justify-between text-left cursor-pointer transition-all duration-400 ease-out select-none border border-zinc-200/50 shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-3xl overflow-hidden h-[240px] w-full group hover:border-primary/40 active:scale-[0.96] active:duration-100 active:shadow-xs before:content-[''] before:absolute before:-top-1/2 before:-right-[10%] before:w-[50%] before:h-[200%] before:bg-black/5 before:rounded-full before:rotate-[35deg] before:z-0 before:pointer-events-none before:transition-transform before:duration-400 hover:before:rotate-[40deg] hover:before:scale-[1.05] block"
                    style={{ backgroundColor: service.bgColor }}
                  >
                    {/* Left Content */}
                    <div className="pl-6 pr-4 py-6 flex flex-col justify-between h-full w-[60%] z-20 relative box-border">
                      <div>
                        <div className="flex items-center gap-2.5 mb-2.5">
                          <div className="w-9 h-9 rounded-full bg-white/70 flex items-center justify-center text-zinc-900 shrink-0 shadow-xs">
                            <IconComponent size={18} />
                          </div>
                          <h3 className="font-display font-bold text-[18px] leading-tight text-zinc-900 tracking-tight">
                            {service.title}
                          </h3>
                        </div>
                        <p className="text-zinc-700 text-[14px] opacity-90 leading-relaxed line-clamp-4 font-medium">
                          {service.desc}
                        </p>
                      </div>
                      
                      <div className="mt-auto w-fit bg-primary text-white px-4 py-2 rounded-full text-[12px] font-display font-bold flex items-center justify-center gap-1 shadow-sm transition-all duration-200 group-hover:bg-white group-hover:text-primary group-hover:-translate-y-px group-hover:shadow-md">
                        <span>Se pris</span>
                      </div>
                    </div>
                    
                    {/* Right Image Wrapper */}
                    <div className="absolute right-0 bottom-0 top-0 w-[50%] z-10 pointer-events-none overflow-hidden rounded-r-3xl">
                      <Image 
                        src={service.img} 
                        alt={`Professionel ${service.title.toLowerCase()} illustration hos Renzen`} 
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="w-full h-full object-contain object-right-bottom bg-transparent block relative z-10 transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </a>
                </FadeInSection>
              );
            })}
            </div>
          </div>
        </section>
      </div>

      {pricingSection}

      {/* Tidligere Opgaver (Marquee Section) */}
      <section className="py-16 sm:py-20 bg-[#f8fafc]/50 border-y border-zinc-200/40 relative overflow-hidden">
        {/* Style block for smooth infinite horizontal scrolling marquee */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes scroll-left {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-50%, 0, 0); }
          }
          @keyframes scroll-right {
            0% { transform: translate3d(-50%, 0, 0); }
            100% { transform: translate3d(0, 0, 0); }
          }
          .animate-scroll-left {
            animation: scroll-left 200s linear infinite;
          }
          .animate-scroll-right {
            animation: scroll-right 200s linear infinite;
          }
          .mask-gradient {
            mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
          }
          /* Pause entire marquee when hover on container, only active when no card is expanded */
          .marquee-container:hover .animate-scroll-left,
          .marquee-container:hover .animate-scroll-right {
            animation-play-state: paused;
          }
        `}} />

        <div className="max-w-[1300px] mx-auto px-6 mb-16">
          <FadeInSection className="max-w-2xl mx-auto text-center flex flex-col gap-3">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-blue">
              Tidligere <span className="bg-[#FFE376] text-brand-blue px-3 py-1 rounded-xl inline-block">opgaver</span> løst gennem Renzen
            </h2>
            <p className="text-zinc-650 font-medium text-lg leading-relaxed">
              Her kan du se et udvalg af de mange rengørings- og vedligeholdelsesopgaver, vores partnere udfører hver dag i hele landet.
            </p>
          </FadeInSection>
        </div>

        {/* Marquee Rows Container */}
        {useMemo(() => {
          return (
            <div className="relative w-full flex flex-col gap-8 overflow-hidden py-4 marquee-container">
              
              {/* Row 1: Leftward Scrolling */}
              <div className="flex overflow-hidden select-none w-full mask-gradient">
                <div 
                  className="flex gap-6 pr-6 w-max animate-scroll-left"
                  style={{
                    animationPlayState: expandedCardId !== null ? 'paused' : undefined
                  }}
                >
                  {row1Repeated.map((task, idx) => {
                    const isExpanded = expandedCardId === task.id;
                    return (
                      <div
                        key={`${task.id}-r1-${idx}`}
                        className="bg-white border border-zinc-200/60 rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-zinc-300 flex flex-col justify-between h-[220px] w-[350px] shrink-0 select-none relative group/card"
                      >
                        <div className="flex flex-col gap-2 h-full overflow-hidden">
                          {/* Top Header */}
                          <div className="flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-0.5 shrink-0">
                              {[...Array(task.rating)].map((_, i) => (
                                <svg key={i} className="h-4 w-4 text-amber-500 fill-current" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin size={13} className="text-[#3b7965] shrink-0" />
                              <span className="text-[12px] font-semibold text-zinc-500 uppercase tracking-wider truncate max-w-[180px]">
                                {task.city}
                              </span>
                            </div>
                          </div>

                          {/* Title */}
                          <h4 className="font-display font-bold text-base text-brand-blue truncate shrink-0">
                            {task.title}
                          </h4>

                          {/* Description body */}
                          <div className={`text-zinc-650 text-sm font-medium leading-relaxed flex-grow overflow-hidden ${isExpanded ? "overflow-y-auto pr-1" : ""}`}>
                            {isExpanded ? (
                              <p className="text-zinc-700 whitespace-pre-wrap">{task.description}</p>
                            ) : (
                              <p className="line-clamp-3 text-zinc-650">{task.description}</p>
                            )}
                          </div>
                        </div>

                        {/* Card Footer */}
                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-zinc-100 shrink-0">
                          {!isExpanded && (
                            <div className="bg-[#e6fbf3] text-[#2d5e4d] px-2.5 py-1 rounded-md text-[13px] font-bold">
                              {task.price}
                            </div>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedCardId(isExpanded ? null : task.id);
                            }}
                            className={`text-xs font-bold font-display transition-colors py-1 px-3 rounded-full ${
                              isExpanded 
                                ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-600 ml-auto" 
                                : "text-[#3b7965] hover:bg-[#e6fbf3]"
                            }`}
                          >
                            {isExpanded ? "Luk" : "Læs mere"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Row 2: Rightward Scrolling */}
              <div className="flex overflow-hidden select-none w-full mask-gradient">
                <div 
                  className="flex gap-6 pr-6 w-max animate-scroll-right"
                  style={{
                    animationPlayState: expandedCardId !== null ? 'paused' : undefined
                  }}
                >
                  {row2Repeated.map((task, idx) => {
                    const isExpanded = expandedCardId === task.id;
                    return (
                      <div
                        key={`${task.id}-r2-${idx}`}
                        className="bg-white border border-zinc-200/60 rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-zinc-300 flex flex-col justify-between h-[220px] w-[350px] shrink-0 select-none relative group/card"
                      >
                        <div className="flex flex-col gap-2 h-full overflow-hidden">
                          {/* Top Header */}
                          <div className="flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-0.5 shrink-0">
                              {[...Array(task.rating)].map((_, i) => (
                                <svg key={i} className="h-4 w-4 text-amber-500 fill-current" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin size={13} className="text-[#3b7965] shrink-0" />
                              <span className="text-[12px] font-semibold text-zinc-500 uppercase tracking-wider truncate max-w-[180px]">
                                {task.city}
                              </span>
                            </div>
                          </div>

                          {/* Title */}
                          <h4 className="font-display font-bold text-base text-brand-blue truncate shrink-0">
                            {task.title}
                          </h4>

                          {/* Description body */}
                          <div className={`text-zinc-650 text-sm font-medium leading-relaxed flex-grow overflow-hidden ${isExpanded ? "overflow-y-auto pr-1" : ""}`}>
                            {isExpanded ? (
                              <p className="text-zinc-700 whitespace-pre-wrap">{task.description}</p>
                            ) : (
                              <p className="line-clamp-3 text-zinc-650">{task.description}</p>
                            )}
                          </div>
                        </div>

                        {/* Card Footer */}
                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-zinc-100 shrink-0">
                          {!isExpanded && (
                            <div className="bg-[#e6fbf3] text-[#2d5e4d] px-2.5 py-1 rounded-md text-[13px] font-bold">
                              {task.price}
                            </div>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedCardId(isExpanded ? null : task.id);
                            }}
                            className={`text-xs font-bold font-display transition-colors py-1 px-3 rounded-full ${
                              isExpanded 
                                ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-600 ml-auto" 
                                : "text-[#3b7965] hover:bg-[#e6fbf3]"
                            }`}
                          >
                            {isExpanded ? "Luk" : "Læs mere"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          );
        }, [expandedCardId])}
      </section>

      {coverageAndAppSections}

      <HomeFaqSection />

      {closingSections}

      
    </div>
  );
}


