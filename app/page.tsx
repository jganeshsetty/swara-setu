"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import InteractiveHeroMap from "@/components/InteractiveHeroMap";
import ThemeToggle from "@/components/ThemeToggle";
import { Sparkles, ArrowRight, Volume2, CheckCircle2 } from "lucide-react";

interface TerminalDemoQuery {
  id: string;
  regionKannada: string;
  query: string;
  verifiedAnswer: string;
  citations: string[];
}

const TERMINAL_QUERIES: TerminalDemoQuery[] = [
  {
    id: "dharwad",
    regionKannada: "ಧಾರವಾಡ / ಉತ್ತರ ಕರ್ನಾಟಕ",
    query: "ಧಾರವಾಡ ಕಡೆ 'ಮಸ್ತ್' ಮತ್ತು 'ಬ್ಯಾಡ' ಅಂದ್ರೆ ಏನು?",
    verifiedAnswer: "'ಮಸ್ತ್' ಎಂದರೆ ತುಂಬಾ ಚೆನ್ನಾಗಿದೆ ಅಥವಾ ಅದ್ಭುತ (A lot / Awesome) ಎಂದರ್ಥ. 'ಬ್ಯಾಡ' ಎಂದರೆ ಬೇಡ ಅಥವಾ ಮಾಡಬೇಡಿ ಎಂದರ್ಥ. ಉದಾಹರಣೆಗೆ: 'ಧಾರವಾಡ ಪೇಡಾ ಮಸ್ತ್ ಐತಿ, ಅದಕ್ಕ ಬೇರೆ ಪ್ರಯತ್ನಾನ ಬ್ಯಾಡ'.",
    citations: ["ಉತ್ತರ ಕರ್ನಾಟಕ ಆಡುಭಾಷಾ ಸಂಗ್ರಹ", "ಧಾರವಾಡ ಪ್ರಾದೇಶಿಕ ನುಡಿಗಟ್ಟುಗಳು"],
  },
  {
    id: "karavali",
    regionKannada: "ಕರಾವಳಿ / ಕುಂದಗನ್ನಡ",
    query: "ಕರಾವಳಿ ಭಾಗದಲ್ಲಿ 'ಎಂಚ ಉಲ್ಲರ್' ಮತ್ತು 'ಬೊಜ್ಜ' ಅಂದ್ರೆ ಏನು?",
    verifiedAnswer: "'ಎಂಚ ಉಲ್ಲರ್' ಎಂದರೆ 'ಹೇಗಿದ್ದೀರಿ?' ಎಂದರ್ಥ. 'ಬೊಜ್ಜ' ಎಂದರೆ ಕರಾವಳಿ ಭಾಗದ ಆಡುಮಾತಿನಲ್ಲಿ ಸಾಮೂಹಿಕ ಊಟ ಅಥವಾ ಔತಣ (Feast) ಎಂದರ್ಥ.",
    citations: ["ಕರಾವಳಿ ಜಾನಪದ ನಿಘಂಟು", "ದಕ್ಷಿಣ ಕನ್ನಡ ಆಡುಮಾತು ಸಂಪುಟ"],
  },
  {
    id: "mysuru",
    regionKannada: "ಹಳೆ ಮೈಸೂರು",
    query: "ಮೈಸೂರು-ಮಂಡ್ಯ ಭಾಗದಲ್ಲಿ 'ಆರಾಮಾಗಿದ್ದೀರಾ ಸ್ವಾಮಿ' ಅಂತ ಹೇಗೆ ಮಾತನಾಡಿಸುತ್ತಾರೆ?",
    verifiedAnswer: "ಹಳೆ ಮೈಸೂರು ಭಾಗದಲ್ಲಿ ಅತಿಥಿಗಳನ್ನು ಅಥವಾ ನೆರೆಹೊರೆಯವರನ್ನು ಮೃದುವಾದ ಗೌರವದಿಂದ 'ಬನ್ನಿ ಸ್ವಾಮಿ, ಆರಾಮಾಗಿದ್ದೀರಾ?' ಎಂದು ಆತ್ಮೀಯವಾಗಿ ವಿಚಾರಿಸುತ್ತಾರೆ. ಇದು ಈ ಭಾಗದ ವಿಶಿಷ್ಟ ಸ್ನೇಹಪರ ಶೈಲಿ.",
    citations: ["ಮೈಸೂರು ಪ್ರಾಂತ್ಯ ಭಾಷಾ ವರದಿ", "ಕರ್ನಾಟಕ ಗೆಜೆಟಿಯರ್ ಸಾಂಸ್ಕೃತಿಕ ಅಧ್ಯಯನ"],
  },
];

export default function StitchLandingPage() {
  // Primary default application language is strictly Kannada ('kn')
  const [lang, setLang] = useState<"en" | "kn">("kn");
  const [mounted, setMounted] = useState(false);
  const [activeQueryIndex, setActiveQueryIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    try {
      // Clear legacy key to avoid old English default persisting in users' browsers
      localStorage.removeItem("swara_lang");

      const saved = localStorage.getItem("swara_user_lang_v2");
      if (saved === "en") {
        setLang("en");
        document.documentElement.setAttribute("lang", "en");
        document.documentElement.setAttribute("data-lang", "en");
      } else {
        // Strict default is Kannada
        setLang("kn");
        localStorage.setItem("swara_user_lang_v2", "kn");
        document.documentElement.setAttribute("lang", "kn");
        document.documentElement.setAttribute("data-lang", "kn");
      }
    } catch {
      setLang("kn");
    }
    setMounted(true);
  }, []);

  const handleLanguageChange = (newLang: "en" | "kn") => {
    setLang(newLang);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("swara_user_lang_v2", newLang);
        document.documentElement.setAttribute("lang", newLang);
        document.documentElement.setAttribute("data-lang", newLang);
      } catch {}
    }
  };

  const isKn = !mounted || lang === "kn";
  const currentDemo = TERMINAL_QUERIES[activeQueryIndex];

  return (
    <div className="min-h-screen bg-paper dark:bg-[#0E0D0B] text-ink-900 dark:text-stone-100 selection:bg-karnataka-gold-light dark:selection:bg-amber-900/50 selection:text-ink-900 dark:selection:text-amber-100 font-sans relative overflow-x-hidden transition-colors duration-300">
      {/* ── 1. Cultural Flag Stripe ── */}
      <div className="h-1.5 w-full flex pointer-events-none sticky top-0 z-60 shadow-2xs">
        <div className="h-full w-1/2 bg-karnataka-gold" title="ಅರಿಶಿನ (ಹಳದಿ)" />
        <div className="h-full w-1/2 bg-karnataka-crimson" title="ಕುಂಕುಮ (ಕೆಂಪು)" />
      </div>

      {/* ── 2. Mobile-Friendly Global Navbar with Theme Toggle ── */}
      <header className="sticky top-1.5 z-50 backdrop-blur-md bg-paper/95 dark:bg-[#12100E]/95 border-b border-hairline/80 dark:border-stone-800 py-2 sm:py-2.5 transition-all duration-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo with Karnataka Map Shape Badge */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0" data-purpose="brand-logo">
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-400/20 via-amber-500/10 to-red-600/15 border border-amber-500/40 dark:border-amber-400/30 p-1 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-all">
              <img
                src="/karnataka-logo.svg"
                alt="ಕರ್ನಾಟಕ ಲಾಂಛನ"
                className="w-full h-full object-contain filter drop-shadow-2xs select-none"
              />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-stone-900 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5 sm:gap-2">
                <span className="font-bold text-base sm:text-xl tracking-tight text-ink-900 dark:text-stone-100 group-hover:text-karnataka-crimson transition-colors">
                  Swara-Setu
                </span>
                <span className="kannada-text text-[11px] sm:text-xs px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/70 text-ink-900 dark:text-amber-200 font-bold border border-amber-300 dark:border-amber-700/60">
                  ಸ್ವರಸೇತು
                </span>
              </div>
              <span className="text-[10px] text-ink-500 dark:text-stone-400 font-medium tracking-wide hidden sm:block">
                ಕನ್ನಡ ಪ್ರಾದೇಶಿಕ ಆಡುಭಾಷೆ ಸಹಾಯಕ
              </span>
            </div>
          </Link>

          {/* Right Header Actions: Theme Toggle + Bilingual Switcher + Compact Mobile CTA */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0" data-purpose="header-actions">
            {/* Dark / Light Mode Toggle Button */}
            <ThemeToggle />

            {/* Language Switcher */}
            <div
              className="flex items-center p-0.5 rounded-full border border-hairline dark:border-stone-800 bg-surface dark:bg-stone-900/80 shadow-2xs text-xs font-semibold"
              data-purpose="language-toggle"
            >
              <button
                type="button"
                onClick={() => handleLanguageChange("kn")}
                className={`px-2.5 sm:px-3 py-1 rounded-full transition-all duration-200 text-xs kannada-text ${
                  isKn
                    ? "bg-karnataka-crimson text-white shadow-2xs font-semibold"
                    : "text-ink-500 dark:text-stone-400 hover:text-ink-900 dark:hover:text-stone-100 font-medium"
                }`}
              >
                ಕನ್ನಡ
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange("en")}
                className={`px-2.5 sm:px-3 py-1 rounded-full transition-all duration-200 text-xs ${
                  !isKn
                    ? "bg-ink-900 dark:bg-stone-100 text-white dark:text-stone-950 shadow-2xs font-semibold"
                    : "text-ink-500 dark:text-stone-400 hover:text-ink-900 dark:hover:text-stone-100 font-medium"
                }`}
              >
                EN
              </button>
            </div>

            {/* Glowing Interactive Workspace CTA - Adaptive for Mobile */}
            <Link
              href="/workspace"
              className="relative inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-xl bg-gradient-to-r from-ink-900 via-neutral-900 to-ink-900 dark:from-stone-800 dark:via-stone-900 dark:to-stone-800 hover:from-karnataka-crimson hover:to-karnataka-crimson-dark active:scale-[0.98] text-white text-xs sm:text-sm font-semibold tracking-tight shadow-sm hover:shadow-md transition-all group overflow-hidden border border-neutral-700/60 dark:border-stone-700"
              data-purpose="nav-primary-cta"
            >
              <span className="hidden sm:inline">
                {isKn ? "ಕಾರ್ಯಕ್ಷೇತ್ರ ಪ್ರವೇಶಿಸಿ" : "Enter Workspace"}
              </span>
              <span className="sm:hidden kannada-text">
                {isKn ? "ಪ್ರವೇಶಿಸಿ" : "Enter"}
              </span>
              <span className="text-karnataka-gold group-hover:text-white transition-transform group-hover:translate-x-0.5 font-bold">
                →
              </span>
            </Link>
          </div>
        </div>
      </header>

      <main id="main-content">
        {/* ── 3. Hero Section with Authentic Karnataka Vector Map ── */}
        <section className="relative pt-6 pb-12 sm:pt-10 sm:pb-16 md:pt-14 md:pb-20 border-b border-hairline dark:border-stone-800 bg-grid-editorial overflow-hidden">
          {/* Subtle Karnataka Map Watermark in Background */}
          <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center overflow-hidden">
            <img
              src="/karnataka-real-map.svg"
              alt=""
              aria-hidden="true"
              className="w-[580px] max-w-[85vw] max-h-[75vh] object-contain opacity-[0.05] dark:opacity-[0.07] select-none pointer-events-none"
            />
            <div className="absolute top-1/4 right-1/4 w-[320px] h-[300px] bg-gradient-to-b from-karnataka-gold/15 dark:from-karnataka-gold/20 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/4 w-[320px] h-[300px] bg-gradient-to-t from-karnataka-crimson/10 dark:from-karnataka-crimson/15 to-transparent rounded-full blur-3xl pointer-events-none" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Clear & Simple Everyday Copy */}
              <div className="lg:col-span-7 flex flex-col items-start" data-purpose="hero-copy">
                {/* Live Simple Status Pill */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-300 dark:border-amber-500/40 bg-surface dark:bg-stone-900/90 shadow-2xs mb-4">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span className="text-xs font-semibold text-ink-800 dark:text-stone-200 tracking-wide">
                    {isKn
                      ? "೧೦ ಪ್ರಾದೇಶಿಕ ಆಡುಭಾಷೆಗಳು • ೩೧ ಜಿಲ್ಲೆಗಳು"
                      : "10 Dialect Regions • 31 Districts"}
                  </span>
                  <span className="text-neutral-300 dark:text-stone-600">|</span>
                  <span className="text-xs text-karnataka-crimson dark:text-red-400 font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    {isKn ? "ನೈಜ ಆಡುಮಾತು" : "Authentic Kannada"}
                  </span>
                </div>

                {/* Main Headline - Simple & Inspiring */}
                <h1 className="text-2xl sm:text-4xl lg:text-[44px] font-extrabold text-ink-900 dark:text-stone-100 leading-[1.22] tracking-tight mb-3 sm:mb-4">
                  {isKn ? (
                    <span className="kannada-heading block">
                      ಕರ್ನಾಟಕದ ಪ್ರಾದೇಶಿಕ ಆಡುಭಾಷೆಗಳು, <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-karnataka-crimson via-red-600 to-amber-600 dark:from-red-400 dark:via-amber-400 dark:to-yellow-400">
                        ಈಗ ಸರಳವಾಗಿ ಎಲ್ಲರಿಗೂ ತಿಳಿಯುವಂತೆ.
                      </span>
                    </span>
                  ) : (
                    <span className="block font-bold">
                      Explore Karnataka&apos;s Dialects, <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-karnataka-crimson via-red-600 to-amber-600 dark:from-red-400 dark:via-amber-400 dark:to-yellow-400">
                        Made Simple for Everyone.
                      </span>
                    </span>
                  )}
                </h1>

                {/* Subtitle - Simple everyday language */}
                <p className="text-sm sm:text-base text-ink-600 dark:text-stone-300 leading-relaxed font-normal max-w-xl mb-6">
                  {isKn ? (
                    <span className="kannada-text">
                      ಉತ್ತರ ಕರ್ನಾಟಕ, ಕರಾವಳಿ, ಮಲೆನಾಡು ಹಾಗೂ ಮೈಸೂರು ಭಾಗದ ವಿಶಿಷ್ಟ ಪದಗಳು, ವಾಕ್ಯಗಳು ಮತ್ತು
                      ದಿನನಿತ್ಯದ ಮಾತುಗಳನ್ನು ಸುಲಭವಾಗಿ ತಿಳಿಯಿರಿ. ನಿಮ್ಮದೇ ಧ್ವನಿಯಲ್ಲಿ ಮಾತನಾಡಿ ಅಥವಾ ಟೈಪ್
                      ಮಾಡಿ ಸರಿಯಾದ ಉತ್ತರ ಪಡೆಯಿರಿ.
                    </span>
                  ) : (
                    <span>
                      Discover the unique words, phrases, and speaking styles of North Karnataka,
                      Karavali, Malenadu, and Old Mysuru. Ask naturally by speaking or typing, and get
                      clear answers with spoken audio.
                    </span>
                  )}
                </p>

                {/* Mobile-Friendly CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6 w-full sm:w-auto">
                  <Link
                    href="/workspace"
                    className="relative inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-karnataka-crimson via-red-600 to-karnataka-crimson-dark hover:from-karnataka-crimson-dark hover:to-red-800 text-white text-sm font-semibold tracking-tight shadow-md hover:shadow-lg transition-all active:scale-[0.98] group"
                  >
                    <span>{isKn ? "ಕಾರ್ಯಕ್ಷೇತ್ರ ಪ್ರವೇಶಿಸಿ" : "Start Exploring Now"}</span>
                    <span className="ml-2 font-bold transition-transform group-hover:translate-x-1">→</span>
                  </Link>

                  <a
                    href="#preview"
                    className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-hairline dark:border-stone-800 bg-surface dark:bg-stone-900/90 hover:bg-neutral-50 dark:hover:bg-stone-800 text-ink-700 dark:text-stone-300 text-sm font-medium tracking-tight shadow-2xs hover:border-amber-400 dark:hover:border-amber-500/50 transition-all text-center"
                  >
                    <span>{isKn ? "ಉದಾಹರಣೆಗಳನ್ನು ನೋಡಿ" : "See Examples"}</span>
                    <span className="ml-1 text-xs text-ink-400 dark:text-stone-400">↓</span>
                  </a>
                </div>

                {/* Verification Simple Metric */}
                <div className="flex items-center gap-2 pt-3 border-t border-hairline/80 dark:border-stone-800/80 w-full text-xs text-ink-500 dark:text-stone-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-semibold text-ink-800 dark:text-stone-200">
                      {isKn ? "ಪುಸ್ತಕ ಮತ್ತು ನಿಘಂಟುಗಳಿಂದ ನೇರ ಉತ್ತರಗಳು:" : "Directly from books and dictionaries:"}
                    </span>
                    <span className="ml-1 text-ink-500 dark:text-stone-400">
                      {isKn
                        ? "ಜಾನಪದ ಕೃತಿಗಳು, ಜಿಲ್ಲಾ ಗೆಜೆಟಿಯರ್ ಹಾಗೂ ನೈಜ ಆಡುಭಾಷಾ ದಾಖಲೆಗಳು."
                        : "State gazetteers, regional folk dictionaries, and everyday speech records."}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Hero Map */}
              <div className="lg:col-span-5 relative w-full" data-purpose="hero-cartography">
                <InteractiveHeroMap />
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. Simple Feature Cards ── */}
        <section className="py-12 sm:py-16 md:py-20 border-b border-hairline dark:border-stone-800 bg-surface dark:bg-[#12100E]" id="dialects">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="max-w-2xl mb-8 sm:mb-12" data-purpose="pillars-header">
              <p className="text-xs font-mono uppercase tracking-widest text-karnataka-crimson dark:text-red-400 mb-2 font-semibold">
                {isKn ? "ಪ್ರಮುಖ ವೈಶಿಷ್ಟ್ಯಗಳು" : "Key Highlights"}
              </p>
              <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-ink-900 dark:text-stone-100 leading-snug font-kannada">
                {isKn
                  ? "ನಮ್ಮ ನಾಡಿನ ನುಡಿಗಳನ್ನು ತಿಳಿಯಲು ಸರಳ ವೇದಿಕೆ"
                  : "A simple way to understand Karnataka's living dialects"}
              </h2>
              <p className="text-ink-500 dark:text-stone-400 text-xs sm:text-sm leading-relaxed mt-2">
                {isKn
                  ? "ಯಾವುದೇ ಗೊಂದಲವಿಲ್ಲದೆ ಆಯಾ ಪ್ರಾಂತ್ಯದ ನೈಜ ಪದಗಳ ಸ್ಪಷ್ಟ ಅರ್ಥ, ಉಚ್ಚಾರಣೆ ಮತ್ತು ಬಳಕೆಯನ್ನು ತಿಳಿದುಕೊಳ್ಳಿ."
                  : "Understand the true meanings, sounds, and contexts of regional Kannada words without confusion."}
              </p>
            </div>

            {/* 3-Column Simple Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6" data-purpose="pillars-grid">
              {/* Card 1 */}
              <article className="p-5 sm:p-6 rounded-2xl border border-hairline dark:border-stone-800 bg-paper dark:bg-[#181512] flex flex-col justify-between hover:border-amber-400 dark:hover:border-amber-500/60 hover:shadow-md transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs text-ink-400 dark:text-stone-400 font-semibold">01 / REGIONS</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-karnataka-gold" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-ink-900 dark:text-stone-100 mb-2 leading-snug">
                    {isKn ? "೧೦ ಪ್ರಾದೇಶಿಕ ಆಡುಭಾಷೆಗಳು" : "10 Regional Dialects"}
                  </h3>
                  <p className="kannada-text text-xs text-karnataka-crimson dark:text-red-400 font-medium mb-2">
                    ಉತ್ತರ ಕರ್ನಾಟಕ, ಕರಾವಳಿ, ಮಲೆನಾಡು ಹಾಗೂ ಹಳೆ ಮೈಸೂರು.
                  </p>
                  <p className="text-xs sm:text-sm text-ink-500 dark:text-stone-400 leading-relaxed">
                    {isKn
                      ? "ಪ್ರತಿಯೊಂದು ಊರಿನ ಆಡುಮಾತಿನ ಶೈಲಿ ಮತ್ತು ವಿಶಿಷ್ಟ ನುಡಿಗಟ್ಟುಗಳನ್ನು ಸುಲಭವಾಗಿ ಗುರುತಿಸುತ್ತದೆ."
                      : "Explores distinct everyday phrases and conversational habits across each district of Karnataka."}
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-hairline dark:border-stone-800 flex items-center justify-between text-xs text-ink-400 dark:text-stone-400">
                  <span className="kannada-text">{isKn ? "ವ್ಯಾಪ್ತಿ" : "Scope"}</span>
                  <span className="text-ink-900 dark:text-stone-200 font-semibold">31 ಜಿಲ್ಲೆಗಳು (Districts)</span>
                </div>
              </article>

              {/* Card 2 */}
              <article className="p-5 sm:p-6 rounded-2xl border border-hairline dark:border-stone-800 bg-paper dark:bg-[#181512] flex flex-col justify-between hover:border-red-400 dark:hover:border-red-500/60 hover:shadow-md transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs text-ink-400 dark:text-stone-400 font-semibold">02 / ACCURACY</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-karnataka-crimson" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-ink-900 dark:text-stone-100 mb-2 leading-snug">
                    {isKn ? "ನೈಜ ಮತ್ತು ಖಚಿತ ಮಾಹಿತಿ" : "Clear & Verified Answers"}
                  </h3>
                  <p className="kannada-text text-xs text-karnataka-crimson dark:text-red-400 font-medium mb-2">
                    ತಪ್ಪು ಕಲ್ಪನೆಗಳಿಲ್ಲದೆ ಪುಸ್ತಕಗಳಿಂದ ನೇರ ಉತ್ತರ.
                  </p>
                  <p className="text-xs sm:text-sm text-ink-500 dark:text-stone-400 leading-relaxed">
                    {isKn
                      ? "ಅಧಿಕೃತ ನಿಘಂಟುಗಳು ಮತ್ತು ಸಾಂಸ್ಕೃತಿಕ ದಾಖಲೆಗಳನ್ನು ಮಾತ್ರ ಬಳಸಿ ವಿಶ್ವಾಸಾರ್ಹ ಉತ್ತರ ನೀಡುತ್ತದೆ."
                      : "Answers are grounded directly in regional dictionaries and cultural gazetteers, avoiding made-up answers."}
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-hairline dark:border-stone-800 flex items-center justify-between text-xs text-ink-400 dark:text-stone-400">
                  <span className="kannada-text">{isKn ? "ವಿಶ್ವಾಸಾರ್ಹತೆ" : "Trust"}</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold">೧೦೦% ಅಧಿಕೃತ ಮಾಹಿತಿ</span>
                </div>
              </article>

              {/* Card 3 */}
              <article className="p-5 sm:p-6 rounded-2xl border border-hairline dark:border-stone-800 bg-paper dark:bg-[#181512] flex flex-col justify-between hover:border-amber-500 dark:hover:border-amber-500/60 hover:shadow-md transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs text-ink-400 dark:text-stone-400 font-semibold">03 / VOICE & TEXT</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-ink-900 dark:bg-amber-400" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-ink-900 dark:text-stone-100 mb-2 leading-snug">
                    {isKn ? "ಧ್ವನಿ ಮತ್ತು ಟೈಪಿಂಗ್ ಮೂಲಕ ಪ್ರಶ್ನಿಸಿ" : "Ask by Voice or Text"}
                  </h3>
                  <p className="kannada-text text-xs text-karnataka-crimson dark:text-red-400 font-medium mb-2">
                    ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ.
                  </p>
                  <p className="text-xs sm:text-sm text-ink-500 dark:text-stone-400 leading-relaxed">
                    {isKn
                      ? "ಕ್ಯಾಂಗ್ಲಿಷ್ (ಇಂಗ್ಲಿಷ್ ಅಕ್ಷರಗಳಲ್ಲಿ ಕನ್ನಡ) ಅಥವಾ ನೇರ ಧ್ವನಿ ಪ್ರಶ್ನೆಗಳನ್ನು ಗ್ರಹಿಸಿ ಸ್ಪಷ್ಟ ಉತ್ತರ ನೀಡುತ್ತದೆ."
                      : "Speak naturally in Kannada or type phonetically in English (Kanglish) to receive clear answers."}
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-hairline dark:border-stone-800 flex items-center justify-between text-xs text-ink-400 dark:text-stone-400">
                  <span className="kannada-text">{isKn ? "ಧ್ವನಿ" : "Audio"}</span>
                  <span className="text-ink-900 dark:text-stone-200 font-semibold">ಕನ್ನಡ ಸ್ಪಷ್ಟ ಧ್ವನಿ ಸೌಲಭ್ಯ</span>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ── 5. Simple 3-Step Process ── */}
        <section className="py-12 sm:py-16 md:py-20 border-b border-hairline dark:border-stone-800 bg-paper dark:bg-[#0E0D0B]" id="workflow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-8 sm:mb-12">
              <p className="text-xs font-mono uppercase tracking-widest text-ink-400 dark:text-stone-400 mb-2 font-semibold">
                {isKn ? "ಸರಳ ಬಳಕೆ" : "How It Works"}
              </p>
              <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-ink-900 dark:text-stone-100 leading-snug font-kannada">
                {isKn ? "೩ ಸರಳ ಹಂತಗಳಲ್ಲಿ ಉತ್ತರ ಪಡೆಯಿರಿ" : "Get answers in 3 simple steps"}
              </h2>
            </div>

            {/* 3 Step Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6" data-purpose="workflow-pipeline">
              <div className="p-5 sm:p-6 rounded-2xl bg-surface dark:bg-[#181512] border border-hairline dark:border-stone-800 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-neutral-100 dark:bg-stone-800 text-ink-900 dark:text-stone-100 font-mono text-xs font-bold">
                    01
                  </span>
                  <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 kannada-text">ಹಂತ ೧</span>
                </div>
                <h4 className="font-bold text-ink-900 dark:text-stone-100 text-sm sm:text-base mb-2">
                  {isKn ? "ಪ್ರಶ್ನೆ ಕೇಳಿ ಅಥವಾ ಮಾತನಾಡಿ" : "Ask or Speak Naturally"}
                </h4>
                <p className="text-xs sm:text-sm text-ink-500 dark:text-stone-400 leading-relaxed">
                  {isKn
                    ? "ನಿಮಗೆ ತಿಳಿದುಕೊಳ್ಳಬೇಕಾದ ಯಾವುದೇ ಪ್ರಾದೇಶಿಕ ಪದ ಅಥವಾ ವಾಕ್ಯದ ಬಗ್ಗೆ ಮಾತನಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ."
                    : "Type or speak any local word or phrase you are curious about."}
                </p>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-surface dark:bg-[#181512] border border-hairline dark:border-stone-800 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-neutral-100 dark:bg-stone-800 text-ink-900 dark:text-stone-100 font-mono text-xs font-bold">
                    02
                  </span>
                  <span className="text-xs font-semibold text-karnataka-crimson dark:text-red-400 kannada-text">ಹಂತ ೨</span>
                </div>
                <h4 className="font-bold text-ink-900 dark:text-stone-100 text-sm sm:text-base mb-2">
                  {isKn ? "ಆಡುಭಾಷೆಯ ಶೈಲಿ ಗುರುತಿಸುವುದು" : "Identifies the Region"}
                </h4>
                <p className="text-xs sm:text-sm text-ink-500 dark:text-stone-400 leading-relaxed">
                  {isKn
                    ? "ಆ ಪದ ಯಾವ ಊರಿನ ಅಥವಾ ಪ್ರಾಂತ್ಯದ ಆಡುಮಾತಿಗೆ ಸೇರಿದ್ದು ಎಂಬುದನ್ನು ನಿಖರವಾಗಿ ಪತ್ತೆಹಚ್ಚುತ್ತದೆ."
                    : "Finds the exact region and cultural context of the dialect term."}
                </p>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-surface dark:bg-[#181512] border border-hairline dark:border-stone-800 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-neutral-100 dark:bg-stone-800 text-ink-900 dark:text-stone-100 font-mono text-xs font-bold">
                    03
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 kannada-text">ಹಂತ ೩</span>
                </div>
                <h4 className="font-bold text-ink-900 dark:text-stone-100 text-sm sm:text-base mb-2">
                  {isKn ? "ಸ್ಪಷ್ಟ ಉತ್ತರ ಮತ್ತು ಧ್ವನಿ" : "Clear Meaning & Audio"}
                </h4>
                <p className="text-xs sm:text-sm text-ink-500 dark:text-stone-400 leading-relaxed">
                  {isKn
                    ? "ಸರಳ ಕನ್ನಡದಲ್ಲಿ ಅರ್ಥ, ಬಳಕೆಯ ಉದಾಹರಣೆ ಹಾಗೂ ಆಲಿಸಲು ಸ್ಪಷ್ಟ ಧ್ವನಿಯನ್ನು ಒದಗಿಸುತ್ತದೆ."
                    : "Provides a clean explanation, everyday example, and audio pronunciation."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. Interactive Live Query Showcase ── */}
        <section className="py-12 sm:py-16 md:py-20 border-b border-hairline dark:border-stone-800 bg-surface dark:bg-[#12100E]" id="preview">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
              <span className="text-xs font-mono uppercase tracking-widest text-karnataka-crimson dark:text-red-400 font-semibold">
                {isKn ? "ದಿನನಿತ್ಯದ ಮಾದರಿ ಪ್ರಶ್ನೆಗಳು" : "Everyday Examples"}
              </span>
              <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-ink-900 dark:text-stone-100 mt-2 leading-snug font-kannada">
                {isKn ? "ಆಡುಭಾಷೆಯ ಕೆಲವು ಉದಾಹರಣೆಗಳು" : "Try these regional dialect examples"}
              </h2>
              <p className="text-xs sm:text-sm text-ink-500 dark:text-stone-400 mt-2 leading-relaxed">
                {isKn
                  ? "ಕೆಳಗಿನ ಪ್ರದೇಶಗಳನ್ನು ಆರಿಸಿ, ಆಯಾ ಭಾಗದ ವಿಶಿಷ್ಟ ಪ್ರಶ್ನೆ ಮತ್ತು ಉತ್ತರಗಳನ್ನು ನೋಡಿ."
                  : "Select a region below to see real questions, verified answers, and word meanings."}
              </p>
            </div>

            {/* Dialect Selector Tab Buttons */}
            <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
              {TERMINAL_QUERIES.map((demo, idx) => (
                <button
                  key={demo.id}
                  type="button"
                  onClick={() => {
                    setActiveQueryIndex(idx);
                    setIsPlayingAudio(false);
                  }}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                    activeQueryIndex === idx
                      ? "bg-ink-900 dark:bg-stone-100 text-white dark:text-stone-950 shadow-xs ring-2 ring-karnataka-crimson/50 dark:ring-amber-400/50"
                      : "bg-paper dark:bg-[#181512] text-ink-700 dark:text-stone-300 border border-hairline dark:border-stone-800 hover:bg-neutral-100 dark:hover:bg-stone-800"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${activeQueryIndex === idx ? "bg-karnataka-gold animate-pulse" : "bg-neutral-400 dark:bg-stone-600"}`} />
                  <span className="kannada-text">{demo.regionKannada}</span>
                </button>
              ))}
            </div>

            {/* Example Card Box */}
            <div
              className="max-w-3xl mx-auto rounded-2xl sm:rounded-3xl border border-hairline dark:border-stone-800 bg-paper dark:bg-[#181512] shadow-md dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
              data-purpose="query-workbench"
            >
              {/* Card Title Bar */}
              <div className="px-4 sm:px-5 py-2.5 bg-neutral-100/90 dark:bg-stone-900/90 border-b border-hairline dark:border-stone-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="ml-2 font-semibold text-ink-700 dark:text-stone-300 text-xs kannada-text">
                    ಸ್ವರಸೇತು ಮಾದರಿ ಸಂವಾದ
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-800 dark:text-emerald-300 font-semibold bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300/40 dark:border-emerald-700/50 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] kannada-text">ನಿಖರ ಉತ್ತರ</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-6 space-y-4">
                {/* User Input Prompt */}
                <div className="space-y-1.5">
                  <div className="text-[11px] text-ink-500 dark:text-stone-400 font-semibold flex items-center justify-between">
                    <span className="kannada-text">{isKn ? "ಕೇಳಲಾದ ಪ್ರಶ್ನೆ:" : "Question asked:"}</span>
                    <span className="text-karnataka-crimson dark:text-red-400 text-xs font-semibold kannada-text">
                      {currentDemo.regionKannada}
                    </span>
                  </div>
                  <div className="p-3 sm:p-3.5 rounded-xl bg-surface dark:bg-[#12100E] border border-hairline dark:border-stone-800 text-xs sm:text-sm text-ink-900 dark:text-stone-100 shadow-2xs">
                    <span className="text-karnataka-crimson dark:text-red-400 font-bold">&gt; </span>
                    <span className="kannada-text font-medium">&quot;{currentDemo.query}&quot;</span>
                  </div>
                </div>

                {/* Grounded Response */}
                <div className="space-y-1.5">
                  <div className="text-[11px] text-ink-500 dark:text-stone-400 font-semibold flex items-center justify-between">
                    <span className="kannada-text">{isKn ? "ಸರಳ ವಿವರಣೆ:" : "Simple answer:"}</span>
                    <button
                      type="button"
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-xs font-semibold transition-all cursor-pointer"
                    >
                      <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? "text-red-600 animate-pulse" : "text-amber-700 dark:text-amber-400"}`} />
                      <span className="kannada-text">{isPlayingAudio ? "ಆಲಿಸಲಾಗುತ್ತಿದೆ..." : "ಆಲಿಸಿ (Listen)"}</span>
                    </button>
                  </div>

                  <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-surface dark:bg-[#12100E] border border-hairline dark:border-stone-800 space-y-3 shadow-2xs">
                    <p className="kannada-text text-ink-900 dark:text-stone-100 text-xs sm:text-sm leading-relaxed">
                      {currentDemo.verifiedAnswer}
                    </p>

                    {/* Citations */}
                    <div className="pt-2.5 border-t border-hairline dark:border-stone-800 flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="text-[11px] text-ink-400 dark:text-stone-400 font-medium kannada-text">ಆಧಾರ ಗ್ರಂಥಗಳು:</span>
                      {currentDemo.citations.map((cite, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center text-[11px] px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-stone-800 text-ink-700 dark:text-stone-300 border border-hairline dark:border-stone-700 kannada-text"
                        >
                          {cite}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Direct CTA Strip */}
              <div className="px-4 sm:px-6 py-3 bg-neutral-50/90 dark:bg-stone-900/90 border-t border-hairline dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
                <span className="text-ink-500 dark:text-stone-400 flex items-center gap-1.5 kannada-text text-center sm:text-left">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  {isKn ? "೩೧ ಜಿಲ್ಲೆಗಳ ಮಾಹಿತಿ ಸಿದ್ಧವಾಗಿದೆ" : "31 Districts dialect knowledge ready"}
                </span>
                <Link
                  href="/workspace"
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-karnataka-crimson hover:bg-karnataka-crimson-dark text-white font-bold inline-flex items-center justify-center gap-1.5 transition-all text-xs"
                >
                  <span className="kannada-text">{isKn ? "ಪೂರ್ಣ ಕಾರ್ಯಕ್ಷೇತ್ರ ತೆರೆಯಿರಿ" : "Open Full Workspace"}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-karnataka-gold font-bold" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7. Call To Action ── */}
        <section className="py-12 sm:py-16 md:py-20 bg-paper dark:bg-[#0E0D0B] relative">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <div className="w-12 h-1 mx-auto mb-5 karnataka-stripe rounded-full" />
            <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-ink-900 dark:text-stone-100 mb-3 leading-snug font-kannada">
              {isKn
                ? "ಕನ್ನಡದ ಆಡುಭಾಷೆಗಳನ್ನು ಅನ್ವೇಷಿಸಲು ಸಿದ್ಧರೇ?"
                : "Ready to explore Karnataka's living dialects?"}
            </h2>
            <p className="text-ink-500 dark:text-stone-400 text-xs sm:text-sm max-w-xl mx-auto mb-6 leading-relaxed">
              {isKn
                ? "ಕರ್ನಾಟಕದ ೧೦ ಭಾಷಾ ವಲಯಗಳ 3D ನಕಾಶೆ ಮತ್ತು ಧ್ವನಿ ಸಂವಾದವನ್ನು ಈಗಲೇ ಉಚಿತವಾಗಿ ಬಳಸಿ ನೋಡಿ."
                : "Try the 3D dialect map and voice assistant directly in your browser."}
            </p>
            <div className="flex items-center justify-center">
              <Link
                href="/workspace"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-ink-900 via-neutral-900 to-ink-900 dark:from-stone-800 dark:via-stone-900 dark:to-stone-800 hover:from-karnataka-crimson hover:to-karnataka-crimson-dark text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98] border border-neutral-700/60 dark:border-stone-700"
              >
                <span>{isKn ? "ಕಾರ್ಯಕ್ಷೇತ್ರ ಪ್ರವೇಶಿಸಿ" : "Enter Workspace"}</span>
                <span className="text-karnataka-gold font-bold">→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── 8. Mobile-Friendly Footer with Dark Theme ── */}
      <footer className="relative bg-surface dark:bg-[#12100E] border-t border-hairline dark:border-stone-800 transition-colors duration-300" data-purpose="site-footer">
        <div className="h-[2px] w-full bg-gradient-to-r from-karnataka-gold via-karnataka-crimson to-karnataka-gold" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-6 sm:gap-8 mb-8">
            {/* Brand Summary */}
            <div className="sm:col-span-2 md:col-span-5 space-y-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 dark:bg-amber-400/15 border border-amber-500/30 dark:border-amber-400/30 p-1 flex items-center justify-center shrink-0">
                  <img
                    src="/karnataka-logo.svg"
                    alt="ಕರ್ನಾಟಕ ಲಾಂಛನ"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="font-bold text-base tracking-tight text-ink-900 dark:text-stone-100">Swara-Setu</span>
                <span className="kannada-text text-xs text-ink-500 dark:text-stone-400">| ಸ್ವರಸೇತು</span>
              </div>
              <p className="text-xs text-ink-500 dark:text-stone-400 leading-relaxed max-w-sm">
                {isKn
                  ? "ಕರ್ನಾಟಕದ ವಿವಿಧ ಆಡುಭಾಷೆ ಮತ್ತು ನುಡಿಗಟ್ಟುಗಳನ್ನು ಎಲ್ಲರಿಗೂ ತಲುಪಿಸುವ ಸರಳ ಡಿಜಿಟಲ್ ಸೇತು."
                  : "A digital bridge preserving and celebrating Karnataka's diverse living dialects."}
              </p>
              <div className="pt-1">
                <span className="kannada-classic text-xs font-semibold text-karnataka-crimson dark:text-red-400">
                  &quot;ಸಿರಿಗನ್ನಡಂ ಗೆಲ್ಗೆ, ಸಿರಿಗನ್ನಡಂ ಬಾಳ್ಗೆ&quot;
                </span>
              </div>
            </div>

            {/* Regions */}
            <div className="md:col-span-2 space-y-1.5">
              <h5 className="text-[11px] font-semibold uppercase text-ink-900 dark:text-stone-200 tracking-wider">
                {isKn ? "ಪ್ರದೇಶಗಳು" : "Regions"}
              </h5>
              <ul className="text-xs space-y-1 text-ink-500 dark:text-stone-400">
                <li>ಕಲ್ಯಾಣ ಕರ್ನಾಟಕ</li>
                <li>ಕರಾವಳಿ & ಮಲೆನಾಡು</li>
                <li>ಹಳೆ ಮೈಸೂರು</li>
                <li>ಕಿತ್ತೂರು ಕರ್ನಾಟಕ</li>
              </ul>
            </div>

            {/* Features */}
            <div className="md:col-span-2 space-y-1.5">
              <h5 className="text-[11px] font-semibold uppercase text-ink-900 dark:text-stone-200 tracking-wider">
                {isKn ? "ಸೌಲಭ್ಯಗಳು" : "Features"}
              </h5>
              <ul className="text-xs space-y-1 text-ink-500 dark:text-stone-400">
                <li>3D ಸಂವಾದ ನಕಾಶೆ</li>
                <li>ಧ್ವನಿ ಸಂಭಾಷಣೆ</li>
                <li>ಆಡುಮಾತಿನ ಅರ್ಥ</li>
                <li>ಜಿಲ್ಲಾ ವಿವರಗಳು</li>
              </ul>
            </div>

            {/* Workspace Link */}
            <div className="md:col-span-3 space-y-1.5">
              <h5 className="text-[11px] font-semibold uppercase text-ink-900 dark:text-stone-200 tracking-wider">
                {isKn ? "ಕಾರ್ಯಕ್ಷೇತ್ರ" : "Workspace"}
              </h5>
              <ul className="text-xs space-y-1 text-ink-500 dark:text-stone-400">
                <li>
                  <Link href="/workspace" className="text-karnataka-crimson dark:text-red-400 font-medium hover:underline">
                    {isKn ? "ಕಾರ್ಯಕ್ಷೇತ್ರ ಪ್ರವೇಶಿಸಿ ↗" : "Launch Workspace ↗"}
                  </Link>
                </li>
                <li>3D ನಕಾಶೆ ವೀಕ್ಷಣೆ</li>
                <li>ಕನ್ನಡ ಧ್ವನಿ ಆಲಿಕೆ</li>
              </ul>
            </div>
          </div>

          {/* Copyright Bar */}
          <div className="pt-4 border-t border-hairline dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-ink-400 dark:text-stone-500 gap-2 text-center sm:text-left">
            <div>
              © {new Date().getFullYear()} Swara-Setu Project.
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
              <span>ಕರ್ನಾಟಕದ ೩೧ ಜಿಲ್ಲೆಗಳ ಮಾಹಿತಿ ಸಕ್ರಿಯ</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
