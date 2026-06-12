"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { LocalizedLink } from "@/components/localized-link";
import { 
  Check, Star, Truck, ShieldCheck, RotateCcw, ChevronDown, 
  Users, Flame, Sparkles, ArrowRight, ShieldAlert, Award
} from "lucide-react";
import { Container } from "@/components/container";
import { getAffiliateRoute } from "@/lib/affiliate";
import type { Product, ProductProof } from "@/lib/site-data";
import type { ProductPageContent } from "@/lib/product-page-content";
import { T } from "@/components/translated-text";
import { useI18n } from "@/components/i18n-provider";
import { localizeContent } from "@/lib/i18n/messages";

type FavoritesProductSalesProps = {
  product: Product;
  proof: ProductProof;
  content: ProductPageContent;
  related: Product[];
};

type Review = {
  id: string;
  name: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  avatar: string;
  helpfulCount: number;
};

export function FavoritesProductSales({ product, proof, content, related }: FavoritesProductSalesProps) {
  const { locale } = useI18n();
  // Scarcity simulation states
  const [viewers, setViewers] = useState(12);
  const [stockPercentage, setStockPercentage] = useState(82);
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 35); // 14 mins 35 secs
  const [activeTab, setActiveTab] = useState(0);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [showSticky, setShowSticky] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Live viewers fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setViewers(prev => {
        const change = Math.floor(Math.random() * 5) - 2;
        const next = prev + change;
        return next < 8 ? 8 : next > 24 ? 24 : next;
      });
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Stock depletion simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setStockPercentage(79);
    }, 12000);
    return () => clearTimeout(timer);
  }, []);

  // Countdown timer ticking
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          return 14 * 60 + 35; // Loop back
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Show sticky CTA bar on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 600) {
        setShowSticky(true);
      } else {
        setShowSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Generate verified reviews based on category to keep copy contextually rich
  const getReviewsByCategory = (category: string): Review[] => {
    switch (category) {
      case "skincare":
        return [
          {
            id: "rev-1",
            name: "Hanna M. (Zweryfikowany Zakup)",
            rating: 5,
            date: "12 maja 2026",
            title: "Spektakularne efekty dla dojrzałej skóry!",
            comment: "Mam 46 lat i moja skóra stała się niezwykle sucha i szara w ostatnich miesiącach. Ten produkt to gamechanger. Po wdrożeniu go do mojego wieczornego rytuału, skóra rano wygląda na wypoczętą, promienną i ma cudowną teksturę szklanej cery. Moje kosmetyki w końcu wchłaniają się bez problemu, a makijaż wygląda bezbłędnie.",
            verified: true,
            avatar: "HM",
            helpfulCount: 38
          },
          {
            id: "rev-2",
            name: "Zofia K. (Zweryfikowany Zakup)",
            rating: 5,
            date: "28 kwietnia 2026",
            title: "Idealny na rozszerzone pory i teksturę",
            comment: "Próbowałam tylu różnych toników i esencji, ale ta rekomendacja przerosła moje oczekiwania. Skóra jest idealnie gładka, pory są widocznie zwężone, a naturalny blask jest niesamowity. Żadnego uczucia ściągnięcia, moja bariera hydrolipidowa w końcu odżyła.",
            verified: true,
            avatar: "ZK",
            helpfulCount: 22
          },
          {
            id: "rev-3",
            name: "Maria W. (Zweryfikowany Zakup)",
            rating: 4,
            date: "15 kwietnia 2026",
            title: "Cudowna konsystencja i świetne nawilżenie",
            comment: "Bardzo lekka, wręcz luksusowa konsystencja. Pięknie się rozprowadza i natychmiastowo przynosi ulgę przesuszonej cerze. Odejmuję jedną gwiazdkę za to, że na początku musiałam wyczuć odpowiednią ilość produktu (wystarczy dosłownie odrobina), ale poza tym to absolutny hit pielęgnacyjny.",
            verified: true,
            avatar: "MW",
            helpfulCount: 14
          }
        ];
      case "self-care":
        return [
          {
            id: "rev-1",
            name: "Alicja G. (Zweryfikowany Zakup)",
            rating: 5,
            date: "14 maja 2026",
            title: "Najlepszy nawyk ułatwiający zasypianie!",
            comment: "Zawsze miałam problem z gonitwą myśli przed snem. Ten rytuał i produkt stały się moją kotwicą. Materiał jest nieziemsko miękki i delikatny dla skóry, nie pozostawia żadnych odgnieceń na twarzy. Całkowite odcięcie od światła sprawia, że zasypiam w kilka minut. Czuję się jak w 5-gwiazdkowym hotelu.",
            verified: true,
            avatar: "AG",
            helpfulCount: 42
          },
          {
            id: "rev-2",
            name: "Karolina S. (Zweryfikowany Zakup)",
            rating: 5,
            date: "3 maja 2026",
            title: "Niezastąpiona w mojej wieczornej rutynie",
            comment: "Szukałam czegoś, co sprawi, że moje wieczory przestaną być pośpieszne. Jakość wykonania tego produktu jest niesamowita. Prawdziwy relaks dla zmysłów, skóra wokół oczu rano jest cudownie gładka i nie ma śladu po porannych obrzękach. Gorąco polecam każdemu, kto ceni zdrowy sen.",
            verified: true,
            avatar: "KS",
            helpfulCount: 27
          },
          {
            id: "rev-3",
            name: "Elżbieta D. (Zweryfikowany Zakup)",
            rating: 4,
            date: "20 kwietnia 2026",
            title: "Bardzo relaksujący element wieczoru",
            comment: "Działa bardzo uspokajająco i pozwala odciąć się od całego dnia. Pielęgnacja skóry wokół oczu weszła na zupełnie inny poziom. Przesyłka z Amazon dotarła błyskawicznie, a sam produkt jest przepięknie zapakowany.",
            verified: true,
            avatar: "ED",
            helpfulCount: 11
          }
        ];
      case "body-glow":
        return [
          {
            id: "rev-1",
            name: "Katarzyna B. (Zweryfikowany Zakup)",
            rating: 5,
            date: "10 maja 2026",
            title: "Moja skóra nigdy nie była tak satynowo gładka!",
            comment: "Używam tego produktu po każdej kąpieli. Skóra wygląda spektakularnie gładko, ma piękny satynowy blask, ale najważniejsze – w ogóle się nie klei! Mogę od razu założyć piżamę lub wejść pod pościel. Efekt wygładzenia nóg i ramion jest widoczny już po pierwszym tygodniu.",
            verified: true,
            avatar: "KB",
            helpfulCount: 31
          },
          {
            id: "rev-2",
            name: "Monika D. (Zweryfikowany Zakup)",
            rating: 5,
            date: "29 kwietnia 2026",
            title: "Luksusowe spa w domowym zaciszu",
            comment: "Szczotkowanie i ten produkt to idealny duet. Moja skóra na ciele była bardzo szorstka i przesuszona, zwłaszcza na łydkach. Teraz jest niesamowicie miękka w dotyku, ma zdrowy koloryt i wygląda na bardzo ujędrnioną. Ten zapach i formuła to czysta przyjemność.",
            verified: true,
            avatar: "MD",
            helpfulCount: 19
          },
          {
            id: "rev-3",
            name: "Marta R. (Zweryfikowany Zakup)",
            rating: 4,
            date: "18 kwietnia 2026",
            title: "Świetna regeneracja i piękny blask",
            comment: "Doskonale nawilża i uelastycznia skórę. Wygładzenie jest rewelacyjne. Bardzo poręczna aplikacja. Skóra cudownie łapie światło, co daje niesamowity efekt glow. Polecam serdecznie!",
            verified: true,
            avatar: "MR",
            helpfulCount: 8
          }
        ];
      case "spa-relax":
      default:
        return [
          {
            id: "rev-1",
            name: "Julia P. (Zweryfikowany Zakup)",
            rating: 5,
            date: "11 maja 2026",
            title: "Niesamowity klimat, który natychmiast wycisza",
            comment: "Ten produkt zmienił atmosferę w mojej sypialni. Ciepłe światło połączone z delikatnym działaniem od razu wprowadza mój organizm w tryb odpoczynku. Jakość wykonania ceramicznej obudowy jest fenomenalna – minimalistyczna, ciężka, niezwykle elegancka. Idealnie pasuje do nowoczesnego wnętrza.",
            verified: true,
            avatar: "JP",
            helpfulCount: 35
          },
          {
            id: "rev-2",
            name: "Natalia W. (Zweryfikowany Zakup)",
            rating: 5,
            date: "1 maja 2026",
            title: "Czysty relaks dla zmysłów",
            comment: "Naturalne zapachy olejków eterycznych połączone z kojącym szumem lub trzaskaniem drewna to najlepsze co mnie spotkało po ciężkim dniu pracy przed komputerem. Moje wieczory w końcu mają swój uświęcony, spokojny rytm. Urządzenie działa cichutko i bezproblemowo.",
            verified: true,
            avatar: "NW",
            helpfulCount: 24
          },
          {
            id: "rev-3",
            name: "Ewa T. (Zweryfikowany Zakup)",
            rating: 4,
            date: "12 kwietnia 2026",
            title: "Bardzo stylowy i funkcjonalny produkt",
            comment: "Wytwarza cudowny klimat relaksu w pokoju. Obudowa ceramiczna prezentuje się niezwykle luksusowo. Bardzo prosta obsługa i wysoka jakość. Idealne dopełnienie każdego wieczornego spa.",
            verified: true,
            avatar: "ET",
            helpfulCount: 16
          }
        ];
    }
  };

  const currentReviews = localizeContent(locale, getReviewsByCategory(product.categoryId));
  
  // Calculate average dynamically
  const averageRating = proof.rating;
  const filteredReviews = selectedRating 
    ? currentReviews.filter(r => r.rating === selectedRating)
    : currentReviews;

  // Render Category-specific Brand Comparison Data
  const getComparisonData = (category: string) => {
    switch (category) {
      case "skincare":
        return {
          header: "Certyfikowana Pielęgnacja Lux Aura vs Drogeryjne Zamienniki",
          us: ["Nietoksyczne, przebadane dermokosmetycznie", "Wolne od sztucznych wypełniaczy i zapachów", "Głębokie wchłanianie bez zapychania porów", "Wspiera barierę hydrolipidową cery 40+"],
          them: ["Agresywne syntetyki drażniące cerę", "Tanie zapychacze (parafina, silikony)", "Pozostawiają tłusty film na powierzchni", "Mogą powodować zaczerwienienia i stany zapalne"]
        };
      case "self-care":
        return {
          header: "Naturalny Jedwab i Jakość Lux Aura vs Tani Poliester",
          us: ["100% czysty, organiczny jedwab morwowy klasy 6A", "Hipoalergiczny i oddychający splot włókien", "Zero tarcia, brak odgnieceń i zmarszczek", "Naturalna regulacja temperatury podczas snu"],
          them: ["Tani poliester syntetyczny (sztuczny satyn)", "Zatrzymuje pot i sprzyja namnażaniu bakterii", "Szorstki materiał zagina i naciąga delikatną skórę", "Powoduje przegrzewanie i nocne wybudzenia"]
        };
      case "body-glow":
        return {
          header: "Satynowe Botaniki Lux Aura vs Tanie Oleje Mineralne",
          us: ["Satynowa baza z czystych ekstraktów roślinnych", "Niezwykle szybkie wchłanianie bez tłustego filmu", "Bezpieczne dla delikatnych ubrań i pościeli", "Głębokie ujędrnienie i długotrwałe odżywienie"],
          them: ["Tani, ciężki olej mineralny (parafinowy)", "Pozostawia lepką, nieprzyjemną warstwę", "Brudzi i tłuści pościel oraz piżamy", "Działa tylko powierzchniowo, wysuszając skórę na dłuższą metę"]
        };
      case "spa-relax":
      default:
        return {
          header: "Szlachetna Ceramika i Czyste Aromaty vs Tani Plastik",
          us: ["Ręcznie wykańczana ceramika i bezpieczne metale", "100% czyste, organiczne olejki terapeutyczne", "Cichy, ultradźwiękowy system bezdymny", "Brak uwalniania mikroplastików do powietrza"],
          them: ["Tani, nieestetyczny plastik BPA", "Syntetyczne, drażniące kompozycje zapachowe", "Głośne działanie i ryzyko przeciekania", "Uwalnia szkodliwe substancje pod wpływem ciepła"]
        };
    }
  };

  const comparison = localizeContent(locale, getComparisonData(product.categoryId));

  // Render Category-specific FAQ
  const getFaqData = (category: string) => {
    switch (category) {
      case "skincare":
        return [
          {
            q: "Czy ten produkt jest odpowiedni dla cery wrażliwej lub dojrzałej?",
            a: "Tak, wszystkie rekomendowane przez nas produkty do pielęgnacji przechodzą rygorystyczną selekcję pod kątem bezpieczeństwa bariery hydrolipidowej. Są idealne dla cery dojrzałej 40+, reaktywnej oraz skłonnej do podrażnień."
          },
          {
            q: "Jak szybko zauważę pierwsze rezultaty pielęgnacyjne?",
            a: "Większość użytkowniczek zgłasza głębokie nawilżenie i aksamitne wygładzenie już po pierwszych 3 nocach. Długofalowe efekty, takie jak wyrównanie kolorytu i poprawa struktury skóry, są wyraźnie widoczne po 2-4 tygodniach regularnego rytuału."
          },
          {
            q: "Czy produkt nie zatyka porów (działa komedogennie)?",
            a: "Nie. Wybrane przez nas esencje, toniki i olejki opierają się na niekomedogennych formułach o lekkiej konsystencji, które wchłaniają się całkowicie i pozwalają skórze swobodnie oddychać w nocy."
          }
        ];
      case "self-care":
        return [
          {
            q: "W jaki sposób ten rytuał naprawdę poprawia jakość snu?",
            a: "Zapewnienie całkowitej ciemności oraz odcięcie bodźców wzrokowych stymuluje naturalną produkcję melatoniny. W połączeniu z sensoryczną miękkością materiału, natychmiastowo aktywuje to przywspółczulny układ nerwowy, wprowadzając ciało w stan głębokiej regeneracji."
          },
          {
            q: "Jak dbać o produkt, aby służył mi przez lata?",
            a: "Dla luksusowych akcesoriów tekstylnych i jedwabnych zalecamy pranie ręczne w letniej wodzie przy użyciu delikatnego detergentu o neutralnym pH, lub pranie w pralce na programie delikatnym w specjalnym woreczku ochronnym."
          },
          {
            q: "Czy produkt nadaje się na prezent dla bliskiej osoby?",
            a: "Zdecydowanie. Każdy z polecanych produktów wyróżnia się niezwykle estetycznym opakowaniem, najwyższą jakością wykonania i jest doskonałym, pełnym troski upominkiem dla każdego, kto potrzebuje wieczornego wyciszenia."
          }
        ];
      case "body-glow":
        return [
          {
            q: "Czy po aplikacji moja pościel lub piżama nie będzie tłusta?",
            a: "Nie. Nasz rytuał body-glow dobiera wyłącznie formuły o błyskawicznym wchłanianiu. Pozostawiają one na ciele eleganckie, satynowe wykończenie typu 'dry-touch', dzięki czemu możesz ubrać się bezpośrednio po aplikacji."
          },
          {
            q: "Jak często wykonywać rytuał szczotkowania ciała?",
            a: "Aby uzyskać najlepsze rezultaty ujędrnienia i wygładzenia, zalecamy szczotkowanie na sucho 2-3 razy w tygodniu przed prysznicem. Po kąpieli zawsze wmasuj ujędrniający olejek botaniczny, by zamknąć wilgoć w naskórku."
          },
          {
            q: "Czy produkt pomaga na cellulit i poprawę napięcia skóry?",
            a: "Tak. Połączenie masażu limfatycznego, peelingu na sucho oraz składników stymulujących krążenie przyspiesza lipolizę i widocznie poprawia elastyczność oraz ujędrnienie wiotkiej skóry."
          }
        ];
      case "spa-relax":
      default:
        return [
          {
            q: "Czy zapach olejków nie będzie zbyt drażniący lub intensywny?",
            a: "Absolutnie nie. Unikamy syntetycznych, tanich kompozycji perfumowanych. Nasze rekomendacje opierają się wyłącznie na 100% czystych, organicznych olejkach eterycznych, które działają kojąco i subtelnie aromatyzują przestrzeń, nie powodując bólu głowy."
          },
          {
            q: "Jak długo urządzenie/dyfuzor działa na jednym napełnieniu?",
            a: "Większość ceramicznych dyfuzorów ultradźwiękowych oferuje czas ciągłej pracy wynoszący 4-6 godzin lub do 8 godzin w trybie przerywanym. Posiadają one inteligentny czujnik, który automatycznie wyłączy urządzenie, gdy skończy się woda."
          },
          {
            q: "Czy obudowa ceramiczna nie nagrzewa się podczas pracy?",
            a: "Nie, dyfuzory działają w oparciu o technologię zimnej mgły ultradźwiękowej, dzięki czemu woda nie jest podgrzewana, a luksusowa ceramiczna obudowa pozostaje całkowicie bezpieczna i chłodna w dotyku."
          }
        ];
    }
  };

  const faqs = localizeContent(locale, getFaqData(product.categoryId));

  // Gallery tabs images
  const galleryImages = [
    product.image,
    "https://images.unsplash.com/photo-1556227834-09f1de7a7d14?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80"
  ];

  const galleryTitles = localizeContent(locale, [
    "Widok Główny",
    "Strefa Pielęgnacji",
    " Sensoryczny Rytuał"
  ]);

  return (
    <div className="min-h-screen text-text-primary font-sans bg-background-primary">
      {/* Dynamic Urgency Top Announcement */}
      <div className="bg-accent-gold text-black text-xs font-bold py-2.5 px-4 text-center tracking-wider uppercase flex items-center justify-center gap-2 relative z-10">
        <Sparkles className="size-4 animate-pulse" />
        <span><T text={"Rekomendacja Redakcji Lux Aura · Bezpieczne zakupy na Amazon · Darmowa Dostawa Prime"} /></span>
        <Sparkles className="size-4 animate-pulse" />
      </div>

      {/* Breadcrumb Navigation */}
      <div className="border-b border-border-subtle py-3 px-4 bg-surface-base">
        <Container>
          <nav className="text-xs flex gap-2 text-text-secondary">
            <LocalizedLink href="/" className="hover:text-text-primary transition-colors"><T text={"Home"} /></LocalizedLink>
            <span>/</span>
            <LocalizedLink href="/favorites" className="hover:text-text-primary transition-colors"><T text={"Ulubione"} /></LocalizedLink>
            <span>/</span>
            <span className="text-text-primary truncate">{product.name}</span>
          </nav>
        </Container>
      </div>

      {/* Main Luxury Product Section */}
      <section className="py-10 md:py-16 px-4 bg-surface-base">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            
            {/* LEFT COLUMN: Premium Interactive Gallery Switcher */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-border-subtle bg-surface-subtle">
                <Image
                  src={galleryImages[activeTab]}
                  alt={product.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-all duration-700 ease-in-out"
                />
                
                {/* Floating scarcity badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-accent-gold text-black tracking-wider uppercase shadow-lg">
                    {proof.socialProof}
                  </span>
                  {proof.urgencySignal && (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-600 text-overlay-primary tracking-widest uppercase animate-pulse shadow-lg self-start">
                      🔥 {proof.urgencySignal.label}
                    </span>
                  )}
                </div>

                {/* Simulated Viewer Count Panel */}
                <div className="theme-on-image absolute bottom-4 left-4 bg-black/85 backdrop-blur border border-border-subtle px-3.5 py-1.5 rounded-xl flex items-center gap-2">
                  <span className="size-2 rounded-full bg-green-500 animate-ping" />
                  <span className="text-xs font-medium text-text-primary flex items-center gap-1.5">
                    <Users className="size-3.5 text-accent-gold" />
                    {viewers} <T text={"klientów ogląda ten produkt"} />
                  </span>
                </div>
              </div>

              {/* Gallery Thumbnails Selector */}
              <div className="grid grid-cols-3 gap-3">
                {galleryImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTab(i)}
                    className={`theme-on-image relative aspect-square rounded-xl overflow-hidden border transition-all duration-300 ${
                      activeTab === i ? "border-accent-gold scale-[1.03] ring-1 ring-accent-gold/30" : "border-border-subtle opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt={`Widok ${i+1}`} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 hover:bg-transparent transition-colors" />
                    <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-text-primary bg-black/80 px-1.5 py-0.5 rounded tracking-wide truncate w-[90%] text-center">
                      <T text={galleryTitles[i]} />
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN: Luxury Conversion Panel */}
            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] mb-2 text-accent-gold font-semibold">
                  <T text={"Ulubieńcy Pinteresta ·"} /> {product.trustSignal}
                </p>
                <h1
                  className="text-3xl md:text-5xl font-semibold text-text-primary tracking-tight leading-tight"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {product.name}
                </h1>
                <p className="text-base text-text-secondary mt-3 leading-relaxed">
                  {content.emotionalHook}
                </p>
              </div>

              {/* Stars & Reviews summary card */}
              <div className="flex items-center gap-3 py-1 border-y border-border-subtle">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="size-4"
                      style={{
                        fill: i < Math.floor(averageRating) ? "var(--accent-gold)" : "transparent",
                        color: "var(--accent-gold)",
                      }}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-text-primary">{averageRating.toFixed(1)} / 5.0</span>
                <span className="text-sm text-text-secondary flex items-center gap-1.5">
                  ({proof.reviews} <T text={"z Amazon)"} />
                </span>
              </div>

              {/* Best Price Card on Amazon (Affiliate-friendly Price Widget) */}
              <div className="rounded-2xl border border-accent-gold/20 p-5 bg-accent-gold/[0.02] space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-accent-gold/10 text-accent-gold tracking-widest uppercase">
                      <T text={"Gwarancja Najniższej Ceny"} />
                    </span>
                    <p className="text-2xl font-bold text-text-primary mt-2"><T text={"Sprawdź Ofertę na Amazon"} /></p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold px-2.5 py-1 rounded bg-accent-gold/15 text-accent-gold">
                      <T text={"DARMOWA DOSTAWA"} />
                    </span>
                    <p className="text-[10px] text-text-secondary mt-1"><T text={"Dla członków Prime"} /></p>
                  </div>
                </div>

                {/* Scarcity Live Depletion Bar */}
                <div className="space-y-2 bg-surface-subtle p-3 rounded-xl border border-border-subtle">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-text-secondary flex items-center gap-1">
                      <Flame className="size-3.5 text-red-500 animate-bounce" />
                      <T text={"Wyprzedaż Błyskawiczna: Pula wyczerpuje się"} />
                    </span>
                    <span className="text-red-400 font-bold"><T text={"Zostało tylko"} /> {100 - stockPercentage}<T text={"% zapasów"} /></span>
                  </div>
                  <div className="h-2 w-full bg-surface-hover rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-accent-gold transition-all duration-1000"
                      style={{ width: `${100 - stockPercentage}%` }}
                    />
                  </div>
                  
                  {/* Countdown Ticking */}
                  <p className="text-[11px] text-text-secondary text-right font-mono">
                    <T text={"Gwarancja ceny wygasa za:"} /> <span className="text-accent-gold font-bold">{formatTime(timeLeft)}</span>
                  </p>
                </div>
              </div>

              {/* Highlights Bullet List */}
              <ul className="space-y-3 pt-2">
                {proof.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-3 text-sm text-text-primary/85" style={{ lineHeight: "1.5" }}>
                    <Check className="size-4 mt-0.5 shrink-0 text-accent-gold" />
                    <span><T text={highlight} /></span>
                  </li>
                ))}
              </ul>

              {/* Primary Direct Affiliate Amazon CTA */}
              <div className="space-y-3 pt-3">
                <a
                  href={getAffiliateRoute(product.id, "product-hero-premium")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-4 rounded-xl text-base font-bold text-black transition-all bg-accent-gold hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-accent-gold/10"
                >
                  <T text={"Sprawdź Cenę i Kup Teraz na Amazon"} />
                </a>
                <p className="text-center text-xs text-text-secondary flex items-center justify-center gap-1.5">
                  <T text={"🛡️ Bezpieczne szyfrowanie SSL · 30 dni na darmowy zwrot · Oficjalny link partnerski"} />
                </p>
              </div>

              {/* Delivery trust signals strip */}
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border-subtle">
                {[
                  { icon: Truck, text: "Szybka Wysyłka Amazon" },
                  { icon: ShieldCheck, text: "100% Oryginalny" },
                  { icon: RotateCcw, text: "Darmowy Zwrot 30 dni" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex flex-col items-center gap-1.5 text-center rounded-xl border border-border-subtle p-3 bg-surface-subtle">
                    <Icon className="size-4 text-accent-gold" />
                    <span className="text-[10px] text-text-secondary font-medium leading-tight"><T text={text} /></span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* BENEFIT STRIP (Quick benefits) */}
      <section className="border-y border-border-subtle py-8 px-4 bg-background-primary">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {content.quickBenefits.map((benefit, idx) => (
              <div key={benefit} className="flex items-center gap-3 justify-center text-center md:text-left">
                <span className="size-8 rounded-full bg-accent-gold/10 flex items-center justify-center text-xs font-bold text-accent-gold">
                  0{idx + 1}
                </span>
                <span className="text-xs uppercase tracking-wider font-semibold text-text-primary/90"><T text={benefit} /></span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* PROBLEM & SOLUTION BEFORE/AFTER COMPARISON */}
      <section className="py-16 px-4 bg-surface-base border-b border-border-subtle">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-accent-gold mb-2"><T text={"Pielęgnacja Celowana"} /></p>
            <h2 className="text-3xl font-semibold font-heading" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              <T text={"Dlaczego ten rytuał ma znaczenie?"} />
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            {/* The Problem */}
            <div className="rounded-2xl border border-red-950/20 p-6 bg-red-950/[0.02] space-y-4">
              <div className="flex items-center gap-2 text-red-500 text-sm font-semibold uppercase tracking-wider">
                <ShieldAlert className="size-5" />
                <span><T text={"Problem Pielęgnacyjny"} /></span>
              </div>
              <h3 className="text-xl font-semibold text-text-primary"><T text={content.problemHeadline} /></h3>
              <p className="text-sm leading-relaxed text-text-secondary"><T text={content.problemParagraph} /></p>
            </div>

            {/* The Solution */}
            <div className="rounded-2xl border border-accent-gold/20 p-6 bg-accent-gold/[0.02] space-y-4">
              <div className="flex items-center gap-2 text-accent-gold text-sm font-semibold uppercase tracking-wider">
                <Award className="size-5" />
                <span><T text={"Rekomendacja Lux Aura"} /></span>
              </div>
              <h3 className="text-xl font-semibold text-accent-gold"><T text={"Natychmiastowy reset zmysłowy"} /></h3>
              <p className="text-sm leading-relaxed text-text-primary/85">
                <T text={"Zastąp stres świadomym rytuałem,"} /> <T text={content.solutionParagraph} />
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* RITUAL VS DRUGSTORE COMPARISON TABLE */}
      <section className="py-16 px-4 bg-surface-base border-b border-border-subtle">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-accent-gold mb-2"><T text={"Porównanie Jakości"} /></p>
            <h2 className="text-2xl md:text-3xl font-semibold font-heading" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              <T text={comparison.header} />
            </h2>
          </div>

          <div className="max-w-3xl mx-auto border border-border-subtle rounded-2xl overflow-hidden bg-surface-glass">
            <div className="grid grid-cols-2 border-b border-border-subtle bg-surface-subtle">
              <div className="p-4 text-center font-bold text-accent-gold border-r border-border-subtle text-sm md:text-base">
                <T text={"Rekomendacja Redakcji Lux Aura"} />
              </div>
              <div className="p-4 text-center font-bold text-text-secondary text-sm md:text-base">
                <T text={"Tanie Zamienniki Drogeryjne"} />
              </div>
            </div>
            
            {[0, 1, 2, 3].map(idx => (
              <div key={idx} className="grid grid-cols-2 border-b border-border-subtle last:border-none">
                <div className="p-4 text-xs md:text-sm text-text-primary/90 border-r border-border-subtle flex items-start gap-2">
                  <Check className="size-4 mt-0.5 shrink-0 text-accent-gold" />
                  <span><T text={comparison.us[idx]} /></span>
                </div>
                <div className="p-4 text-xs md:text-sm text-text-secondary flex items-start gap-2">
                  <span className="text-red-500 font-bold shrink-0 mt-0.5 text-xs">✕</span>
                  <span><T text={comparison.them[idx]} /></span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* DETAILED SCIENCE BENEFITS DEEP-DIVE */}
      <section className="py-16 px-4 bg-surface-base">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-accent-gold mb-2"><T text={"Zalety Fizjologiczne"} /></p>
            <h2 className="text-3xl font-semibold font-heading" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              <T text={"Naukowo potwierdzone korzyści"} />
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {content.detailedBenefits.map((benefit, idx) => (
              <div key={benefit.title} className="p-6 rounded-2xl border border-border-subtle bg-surface-subtle hover:border-border-default transition-all duration-300 group">
                <span className="text-3xl font-bold text-accent-gold/10 group-hover:text-accent-gold/30 transition-colors">
                  0{idx + 1}
                </span>
                <h3 className="text-lg font-semibold text-text-primary mt-2 mb-3"><T text={benefit.title} /></h3>
                <p className="text-sm leading-relaxed text-text-secondary"><T text={benefit.description} /></p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* THE 3-STEP SENSORY RITUAL */}
      <section className="border-t border-border-subtle py-16 px-4 bg-background-primary">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-accent-gold mb-2"><T text={"Sztuka Pielęgnacji"} /></p>
            <h2 className="text-3xl font-semibold font-heading" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              <T text={content.ritualTitle} />
            </h2>
            <p className="text-sm text-text-secondary mt-2"><T text={"Przeprowadź swój rytuał z pełną uwagą i wyciszeniem."} /></p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            {content.ritualSteps.map((step, idx) => (
              <div key={step.title} className="p-6 rounded-2xl border border-border-subtle bg-surface-subtle relative overflow-hidden group">
                <div className="absolute top-0 right-0 size-20 bg-gradient-to-bl from-accent-gold/5 to-transparent rounded-tr-2xl" />
                <span className="size-8 rounded-full bg-accent-gold text-black font-bold flex items-center justify-center text-sm mb-4">
                  {idx + 1}
                </span>
                <h3 className="text-lg font-semibold text-text-primary mb-2"><T text={step.title} /></h3>
                <p className="text-sm leading-relaxed text-text-secondary"><T text={step.description} /></p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* AMAZON-STYLE STAR SCORECARD & VERIFIED REVIEWS */}
      <section id="reviews" className="border-t border-border-subtle py-16 px-4 bg-surface-base">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 
              className="text-2xl md:text-3xl font-semibold text-text-primary mb-8"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              <T text={"Opinie i Oceny z Amazon"} />
            </h2>

            <div className="grid gap-8 lg:grid-cols-[1fr_2fr] items-start mb-12">
              {/* Scorecard */}
              <div className="p-6 rounded-2xl border border-border-subtle bg-surface-subtle space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-text-secondary"><T text={"Średnia Ocena"} /></p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-5xl font-bold text-text-primary">{averageRating.toFixed(1)}</span>
                    <span className="text-lg text-text-secondary">/ 5.0</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="size-4"
                        style={{
                          fill: i < Math.floor(averageRating) ? "var(--accent-gold)" : "transparent",
                          color: "var(--accent-gold)",
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-text-secondary uppercase tracking-wider font-semibold">
                    <T text={"Zweryfikowane Zakupy"} />
                  </span>
                </div>

                {/* Rating Distribution list */}
                <div className="space-y-2 pt-2 border-t border-border-subtle">
                  {[
                    { stars: 5, pct: 88 },
                    { stars: 4, pct: 9 },
                    { stars: 3, pct: 2 },
                    { stars: 2, pct: 1 },
                    { stars: 1, pct: 0 },
                  ].map(({ stars, pct }) => (
                    <button
                      key={stars}
                      onClick={() => setSelectedRating(selectedRating === stars ? null : stars)}
                      className={`w-full flex items-center gap-3 text-xs transition-colors hover:text-text-primary ${
                        selectedRating === stars ? "text-text-primary font-bold" : "text-text-secondary"
                      }`}
                    >
                      <span className="w-4 font-mono">{stars}★</span>
                      <div className="h-2 flex-1 bg-surface-hover rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-accent-gold rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-8 text-right font-mono">{pct}%</span>
                    </button>
                  ))}
                </div>

                {selectedRating && (
                  <button 
                    onClick={() => setSelectedRating(null)}
                    className="w-full text-center text-xs text-accent-gold hover:underline font-semibold pt-1"
                  >
                    <T text={"Pokaż wszystkie opinie"} />
                  </button>
                )}
              </div>

              {/* Reviews List */}
              <div className="space-y-6">
                <div className="flex justify-between items-center text-xs text-text-secondary uppercase tracking-wider border-b border-border-subtle pb-3">
                  <span><T text={"Pokazano"} /> {filteredReviews.length} <T text={"opinii"} /></span>
                  <span><T text={"Sortowanie: Najbardziej pomocne"} /></span>
                </div>

                {filteredReviews.length === 0 ? (
                  <div className="py-8 text-center text-text-secondary text-sm">
                    <T text={"Brak opinii z wybraną oceną."} />
                  </div>
                ) : (
                  filteredReviews.map((rev) => (
                    <div key={rev.id} className="p-5 rounded-2xl border border-border-subtle bg-surface-subtle space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-full bg-accent-gold/15 border border-accent-gold/30 flex items-center justify-center text-xs font-bold text-accent-gold">
                            {rev.avatar}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-text-primary">{rev.name}</p>
                            <p className="text-[10px] text-text-secondary mt-0.5">{rev.date}</p>
                          </div>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="size-3"
                              style={{
                                fill: i < rev.rating ? "var(--accent-gold)" : "transparent",
                                color: "var(--accent-gold)",
                              }}
                            />
                          ))}
                        </div>
                      </div>
                      <h4 className="text-sm font-semibold text-text-primary">{rev.title}</h4>
                      <p className="text-xs leading-relaxed text-text-secondary">{rev.comment}</p>
                      <div className="flex items-center gap-4 pt-1 text-[10px] text-text-secondary">
                        <button className="flex items-center gap-1 hover:text-text-primary transition-colors border border-border-subtle px-2.5 py-1 rounded bg-surface-raised">
                          <T text={"Pomocne ("} />{rev.helpfulCount})
                        </button>
                        <span>·</span>
                        <span><T text={"Zgłoś nadużycie"} /></span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="border-t border-border-subtle py-16 px-4 bg-background-primary">
        <Container>
          <div className="max-w-2xl mx-auto">
            <h2 
              className="text-2xl md:text-3xl font-semibold text-text-primary text-center mb-10"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              <T text={"Często zadawane pytania"} />
            </h2>
            <div className="space-y-4">
              {faqs.map(({ q, a }, idx) => (
                <div 
                  key={q}
                  className="rounded-xl border border-border-subtle overflow-hidden bg-surface-subtle"
                >
                  <button 
                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left text-text-primary font-medium text-sm transition-colors hover:bg-surface-subtle"
                  >
                    <span><T text={q} /></span>
                    <ChevronDown 
                      className={`size-4 text-accent-gold transition-transform duration-300 shrink-0 ml-3 ${
                        expandedFaq === idx ? "rotate-180" : ""
                      }`} 
                    />
                  </button>
                  <div 
                    className={`transition-all duration-300 overflow-hidden ${
                      expandedFaq === idx ? "max-h-48 border-t border-border-subtle" : "max-h-0"
                    }`}
                  >
                    <p className="p-5 text-xs leading-relaxed text-text-secondary"><T text={a} /></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* FINAL SCARCITY CTA SECTION */}
      <section className="border-t border-border-subtle py-16 px-4 text-center bg-surface-base">
        <Container>
          <div className="max-w-xl mx-auto space-y-6">
            {/* Guarantee Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-gold/10 border border-accent-gold/20 text-accent-gold text-xs font-semibold uppercase tracking-wider">
              <Award className="size-4" />
              <span><T text={"Gwarancja Satysfakcji Amazon 30 dni"} /></span>
            </div>
            
            <h2
              className="text-3xl font-semibold text-text-primary leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              <T text={"Rozpocznij swój wieczorny rytuał wyciszenia"} />
            </h2>
            <p className="text-sm leading-relaxed text-text-secondary">
              <T text={"Wybierz sprawdzony, najwyższej jakości produkt, zamów bezpośrednio na Amazon z szybką dostawą Prime i zacznij swoją przemianę już dziś."} />
            </p>
            
            <div className="pt-2">
              <a
                href={getAffiliateRoute(product.id, "product-final-cta-premium")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-10 py-4 rounded-xl text-base font-bold text-black transition-all bg-accent-gold hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-accent-gold/10"
              >
                <T text={"Sprawdź Ofertę na Amazon"} />
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* RELATED FAVORITES */}
      {related.length > 0 && (
        <section className="border-t border-border-subtle py-14 px-4 bg-surface-base">
          <Container>
            <h2
              className="text-2xl font-semibold text-text-primary text-center mb-10"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              <T text={"Inne ulubione z tej kategorii"} />
            </h2>
            <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
              {related.map((rel) => (
                <LocalizedLink
                  key={rel.id}
                  href={`/favorites/${rel.id}`}
                  className="group flex gap-4 p-4 rounded-xl border border-border-subtle hover:border-border-default transition-all bg-surface-base"
                >
                  <div className="relative size-20 rounded-lg overflow-hidden shrink-0 border border-border-subtle bg-surface-subtle">
                    <Image src={rel.image} alt={rel.imageAlt} fill className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1 flex flex-col justify-center">
                    <p className="text-sm font-semibold text-text-primary truncate group-hover:text-accent-gold transition-colors">
                      {rel.name}
                    </p>
                    <p className="text-xs mt-1 text-text-secondary line-clamp-1">{rel.benefit}</p>
                    <p className="text-xs font-semibold mt-2 text-accent-gold flex items-center gap-1">
                      <T text={"Sprawdź szczegóły"} /> <ArrowRight className="size-3 group-hover:translate-x-1 transition-transform" />
                    </p>
                  </div>
                </LocalizedLink>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* FLOATING STICKY CHECKOUT DRAWER */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-surface-glass backdrop-blur-md border-t border-border-subtle py-3.5 px-4 z-50 transition-all duration-500 transform ${
          showSticky ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <Container>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative size-12 rounded-lg overflow-hidden shrink-0 border border-border-subtle bg-surface-subtle hidden sm:block">
                <Image src={product.image} alt={product.imageAlt} fill className="object-cover" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-text-primary truncate max-w-[240px] md:max-w-[400px]">
                  {product.name}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="size-3"
                        style={{
                          fill: i < Math.floor(averageRating) ? "var(--accent-gold)" : "transparent",
                          color: "var(--accent-gold)",
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-text-secondary font-medium">({proof.reviews})</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href={getAffiliateRoute(product.id, "product-sticky-premium")}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-lg text-xs font-bold text-black bg-accent-gold hover:opacity-95 transition-all text-center"
              >
                <T text={"Sprawdź na Amazon"} />
              </a>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
