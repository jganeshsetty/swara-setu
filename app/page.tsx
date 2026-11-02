"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import InteractiveHeroMap from "@/components/InteractiveHeroMap";
import { Sparkles, ArrowRight, Volume2, CheckCircle2, ChevronRight, Layers, Radio } from "lucide-react";

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
    regionKannada: "ಧಾರವಾಡ / ಕಿತ್ತೂರು",
    query: "ಉತ್ತರ ಕರ್ನಾಟಕದ ಬಯಲಾಟ ಮತ್ತು ಯಕ್ಷಗಾನ ನಡುವಿನ ಕಲಾತ್ಮಕ ವ್ಯತ್ಯಾಸವೇನು?",
    verifiedAnswer: "ಉತ್ತರ ಕರ್ನಾಟಕದ ಬಯಲಾಟ (ವಿಶೇಷವಾಗಿ ಶ್ರೀಕೃಷ್ಣ ಪಾರಿಜಾತ ಮತ್ತು ಸಣ್ಣಾಟ) ಬಯಲು ರಂಗಭೂಮಿಯ ಮುಕ್ತ ಸಂಭಾಷಣೆ ಮತ್ತು ದೇಶಿ ಜಾನಪದ ಲಯವನ್ನು ಆಧರಿಸಿದ್ದರೆ, ಕರಾವಳಿಯ ಯಕ್ಷಗಾನ (ತೆಂಕು ಮತ್ತು ಬಡಗುತಿಟ್ಟು) ಕಟ್ಟುನಿಟ್ಟಾದ ಶಾಸ್ತ್ರೀಯ ಛಂದಸ್ಸು, ತಾಳ ಮತ್ತು ಯಕ್ಷಗಾನ ಪ್ರಸಂಗಗಳ ಕಾವ್ಯ ಪರಂಪರೆಗೆ ಬದ್ಧವಾಗಿರುತ್ತದೆ.",
    citations: ["ಕರ್ನಾಟಕ ಜನಪದ ರಂಗಭೂಮಿ ಅಧ್ಯಯನ (ಪು. ೮೪)", "ಧಾರವಾಡ ಸಾಂಸ್ಕೃತಿಕ ಗೆಜೆಟಿಯರ್"],
  },
  {
    id: "karavali",
    regionKannada: "ಕರಾವಳಿ / ಕುಂದಗನ್ನಡ",
    query: "ಕರಾವಳಿ ಭಾಗದಲ್ಲಿ ಮಳೆ ಮತ್ತು ಕೃಷಿ ಬಗ್ಗೆ ಬಳಸುವ ಪ್ರಾದೇಶಿಕ ನುಡಿಗಟ್ಟುಗಳಾವುವು?",
    verifiedAnswer: "ಕರಾವಳಿ ಪ್ರದೇಶದಲ್ಲಿ ಮಳೆಯನ್ನು 'ಮುಂಗಾರು ಜಡಿ' ಅಥವಾ 'ಜೋರು ಬರ್ಸ' ಎನ್ನಲಾಗುತ್ತದೆ. ಭತ್ತದ ಕೃಷಿಗೆ ಸಂಬಂಧಿಸಿದಂತೆ 'ಏಣೆಲು' (ಮುಂಗಾರು ಬೆಳೆ) ಮತ್ತು 'ಸುಗ್ಗಿ' (ಹಿಂಗಾರು ಬೆಳೆ) ಎಂಬ ವಿಶಿಷ್ಟ ಕೃಷಿ ಪದಗಳು ಬಳಕೆಯಲ್ಲಿವೆ.",
    citations: ["ಕರಾವಳಿ ಜಾನಪದ ನಿಘಂಟು (ಸಂಪುಟ ೨)", "ದಕ್ಷಿಣ ಕನ್ನಡ ಗೆಜೆಟಿಯರ್ (೧೯೭೩)"],
  },
  {
    id: "mysuru",
    regionKannada: "ಹಳೆ ಮೈಸೂರು",
    query: "ಹಳೆ ಮೈಸೂರು ಭಾಗದ ನುಡಿಗಟ್ಟುಗಳಲ್ಲಿ ಗೌರವ ಸೂಚಕ ಪದಪ್ರಯೋಗ ಹೇಗಿರುತ್ತದೆ?",
    verifiedAnswer: "ಹಳೆ ಮೈಸೂರು ಭಾಗದಲ್ಲಿ ಹಿರಿಯರನ್ನು ಅಥವಾ ಅತಿಥಿಗಳನ್ನು ಗೌರವಿಸಲು 'ಬನ್ನಿ ಸ್ವಾಮಿ', 'ಊಟವಾಯ್ತಾ ಕಣ್ರೀ', 'ದಯಮಾಡಿ' ಎಂಬ ಮೃದುವಾದ ಸ್ವರಭಾರ ಹಾಗೂ ಗೌರವಾರ್ಥಕ ಪ್ರತ್ಯಯಗಳನ್ನು ಸಹಜವಾಗಿ ಪ್ರಯೋಗಿಸಲಾಗುತ್ತದೆ.",
    citations: ["ಮೈಸೂರು ಪ್ರಾಂತ್ಯ ಭಾಷಾ ವರದಿ", "ಕರ್ನಾಟಕ ರಾಜ್ಯ ಗೆಜೆಟಿಯರ್ (೧೯೮೮)"],
  },
];

export default function StitchLandingPage() {
  const [lang, setLang] = useState<"en" | "kn">("en");
  const [mounted, setMounted] = useState(false);
  const [activeQueryIndex, setActiveQueryIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("swara_lang");
    if (saved === "kn" || saved === "en") {
      setLang(saved);
    }
    setMounted(true);
  }, []);

  const handleLanguageChange = (newLang: "en" | "kn") => {
    setLang(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("swara_lang", newLang);
      document.documentElement.setAttribute("lang", newLang);
      document.documentElement.setAttribute("data-lang", newLang);
    }
  };

  const isKn = mounted && lang === "kn";
  const currentDemo = TERMINAL_QUERIES[activeQueryIndex];

  return (
    <div className="min-h-screen bg-paper text-ink-900 selection:bg-karnataka-gold-light selection:text-ink-900 font-sans relative overflow-x-hidden">
      {/* ── 1. Top Cultural Flag Stripe ── */}
      <div className="h-1.5 w-full flex pointer-events-none shadow-xs sticky top-0 z-60">
        <div className="h-full w-1/2 bg-karnataka-gold" title="ಅರಿಶಿನ (ಹಳದಿ)" />
        <div className="h-full w-1/2 bg-karnataka-crimson" title="ಕುಂಕುಮ (ಕೆಂಪು)" />
      </div>

      {/* ── 2. Refined Global Navbar with Correct Shape Logo ── */}
      <header className="sticky top-1.5 z-50 backdrop-blur-md bg-paper/95 border-b border-hairline/80 py-2.5 transition-all duration-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo with Geographically Correct Karnataka Logo */}
          <Link href="/" className="flex items-center gap-3 group py-1" data-purpose="brand-logo">
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400/20 via-amber-500/10 to-red-600/15 border border-amber-500/40 p-1 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 group-hover:border-amber-500 transition-all">
              <img
                src="/karnataka-logo.svg"
                alt="ಕರ್ನಾಟಕ ನಕಾಶೆ ಲಾಂಛನ"
                className="w-full h-full object-contain filter drop-shadow-xs select-none"
              />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-lg sm:text-xl tracking-tight text-ink-900 group-hover:text-karnataka-crimson transition-colors">
                  Swara-Setu
                </span>
                <span className="kannada-text text-xs px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-200/80 to-amber-300/80 text-ink-900 font-bold border border-amber-300">
                  ಸ್ವರಸೇತು
                </span>
              </div>
              <span className="text-[10px] text-ink-500 font-mono tracking-wider uppercase hidden sm:block">
                Regional Kannada RAG AI • 3D Map
              </span>
            </div>
          </Link>

          {/* Right Header Actions: Bilingual Toggle + Prominent Workspace CTA */}
          <div className="flex items-center gap-3 sm:gap-4" data-purpose="header-actions">
            {/* Language Switcher */}
            <div
              className="flex items-center p-0.5 rounded-full border border-hairline bg-surface shadow-xs text-xs font-semibold"
              data-purpose="language-toggle"
            >
              <button
                type="button"
                onClick={() => handleLanguageChange("en")}
                className={`px-3 py-1 rounded-full transition-all duration-200 text-xs ${
                  !isKn
                    ? "bg-ink-900 text-white shadow-xs font-semibold"
                    : "text-ink-500 hover:text-ink-900 font-medium"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange("kn")}
                className={`px-3 py-1 rounded-full transition-all duration-200 text-xs kannada-text ${
                  isKn
                    ? "bg-karnataka-crimson text-white shadow-xs font-semibold"
                    : "text-ink-500 hover:text-ink-900 font-medium"
                }`}
              >
                ಕನ್ನಡ
              </button>
            </div>

            {/* Glowing Interactive Workspace CTA */}
            <Link
              href="/workspace"
              className="relative inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-ink-900 via-neutral-900 to-ink-900 hover:from-karnataka-crimson hover:to-karnataka-crimson-dark active:scale-[0.98] text-white text-xs sm:text-sm font-semibold tracking-tight shadow-md hover:shadow-lg transition-all group overflow-hidden border border-neutral-700/60 hover:border-transparent"
              data-purpose="nav-primary-cta"
            >
              {/* Shimmer light effect */}
              <span className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-12 -translate-x-full group-hover:translate-x-[250%] transition-transform duration-1000 ease-out" />
              <span>{isKn ? "ಕಾರ್ಯಕ್ಷೇತ್ರ ಪ್ರವೇಶಿಸಿ" : "Enter Workspace"}</span>
              <span className="text-karnataka-gold group-hover:text-white transition-transform group-hover:translate-x-1 font-bold">
                →
              </span>
            </Link>
          </div>
        </div>
      </header>

      <main id="main-content">
        {/* ── 3. Hero Section with Authentic Vector Backside Karnataka Map ── */}
        <section className="relative pt-10 pb-16 md:pt-14 md:pb-20 border-b border-hairline bg-grid-editorial overflow-hidden">
          {/* Backside Geographically Correct Karnataka Map Watermark */}
          <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center overflow-hidden">
            <img
              src="/karnataka-real-map.svg"
              alt=""
              aria-hidden="true"
              className="w-[620px] max-w-[85vw] max-h-[85vh] object-contain opacity-[0.06] md:opacity-[0.07] select-none pointer-events-none filter blur-[0.2px]"
            />
            {/* Ambient Radial Color Lights */}
            <div className="absolute top-1/4 right-1/4 w-[420px] h-[340px] bg-gradient-to-b from-karnataka-gold/15 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/4 w-[420px] h-[340px] bg-gradient-to-t from-karnataka-crimson/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Left Column: Focused Copy & Action */}
              <div className="lg:col-span-7 flex flex-col items-start" data-purpose="hero-copy">
                {/* Live Status Pill with Radar Pulse */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-300/80 bg-surface/90 shadow-2xs mb-5 backdrop-blur-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 status-pulse" />
                  <span className="text-xs font-semibold text-ink-800 tracking-wide">
                    {isKn
                      ? "೧೦ ಪ್ರಾದೇಶಿಕ ಭಾಷಾ ವಲಯಗಳು • ೩೧ ಜಿಲ್ಲೆಗಳು"
                      : "10 Regional Dialect Zones • 31 Districts"}
                  </span>
                  <span className="text-neutral-300">|</span>
                  <span className="text-xs text-karnataka-crimson font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500 animate-spin" style={{ animationDuration: "10s" }} />
                    {isKn ? "ಶಾಸನಬದ್ಧ RAG" : "Deterministic RAG"}
                  </span>
                </div>

                {/* Main Headline */}
                <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-ink-900 leading-[1.22] tracking-tight mb-4">
                  {isKn ? (
                    <span className="kannada-text block">
                      ಕರ್ನಾಟಕದ ಪ್ರಾದೇಶಿಕ ನುಡಿಗಟ್ಟುಗಳ ಸಂರಕ್ಷಣೆ, <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-karnataka-crimson via-red-600 to-amber-600">
                        ಶಾಸನಬದ್ಧ ನಿಖರ ಜ್ಞಾನ ಸೇತು.
                      </span>
                    </span>
                  ) : (
                    <span className="block">
                      Preserving Living Dialects, <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-karnataka-crimson via-red-600 to-amber-600">
                        Grounding Authentic Knowledge.
                      </span>
                    </span>
                  )}
                </h1>

                {/* Subtitle */}
                <p className="text-sm sm:text-base text-ink-600 leading-relaxed font-normal max-w-xl mb-7">
                  {isKn ? (
                    <span className="kannada-text">
                      ಕಲ್ಯಾಣ ಕರ್ನಾಟಕ, ಕಿತ್ತೂರು, ಕರಾವಳಿ ಮತ್ತು ಮಲೆನಾಡಿನ ವಿಶಿಷ್ಟ ನುಡಿಗಟ್ಟುಗಳನ್ನು ಕೃತಕ
                      ಬುದ್ಧಿಮತ್ತೆಯ ಭ್ರಮೆಗಳಿಲ್ಲದೆ (Zero Hallucination) ಅಧಿಕೃತ ದಾಖಲೆಗಳು ಮತ್ತು 3D
                      ಸಂವಾದಾತ್ಮಕ ನಕಾಶೆಯೊಂದಿಗೆ ಅನ್ವೇಷಿಸಿ.
                    </span>
                  ) : (
                    <span>
                      Navigate Karnataka’s living dialectal spectrum across 10 regions. Built with
                      context-locked cultural grounding to eliminate AI hallucination, bringing
                      authentic regional voices and 3D map exploration to your fingertips.
                    </span>
                  )}
                </p>

                {/* Interactive CTAs with Shimmer Hover */}
                <div className="flex flex-wrap items-center gap-3.5 mb-7 w-full sm:w-auto">
                  <Link
                    href="/workspace"
                    className="relative inline-flex items-center justify-center px-6 sm:px-7 py-3 rounded-xl bg-gradient-to-r from-karnataka-crimson via-red-600 to-karnataka-crimson-dark hover:from-karnataka-crimson-dark hover:to-red-800 text-white text-sm font-semibold tracking-tight shadow-md hover:shadow-xl transition-all active:scale-[0.98] group overflow-hidden"
                  >
                    <span className="absolute inset-0 w-1/2 h-full bg-white/15 skew-x-12 -translate-x-full group-hover:translate-x-[250%] transition-transform duration-700 ease-out" />
                    <span>{isKn ? "ಕಾರ್ಯಕ್ಷೇತ್ರ ಪ್ರವೇಶಿಸಿ" : "Enter Interactive Workspace"}</span>
                    <span className="ml-2 font-bold transition-transform group-hover:translate-x-1">→</span>
                  </Link>

                  <a
                    href="#preview"
                    className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-hairline bg-surface hover:bg-neutral-50 text-ink-700 text-sm font-medium tracking-tight shadow-2xs hover:border-amber-400 hover:shadow-sm transition-all group"
                  >
                    <span>{isKn ? "ಮಾದರಿ ಸಂವಾದ ವೀಕ್ಷಿಸಿ" : "Explore Live Demo"}</span>
                    <span className="ml-1.5 text-xs text-ink-400 group-hover:translate-y-0.5 transition-transform">↓</span>
                  </a>
                </div>

                {/* Verification Metric Badge */}
                <div className="flex items-center gap-2.5 pt-4 border-t border-hairline/80 w-full text-xs text-ink-500">
                  <div className="flex items-center justify-center w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] shrink-0">
                    ✓
                  </div>
                  <div>
                    <span className="font-semibold text-ink-800">
                      {isKn ? "೧೦೦% ಅಧಿಕೃತ ದಾಖಲೆಗಳು:" : "100% Deterministic Corpus:"}
                    </span>
                    <span className="ml-1 text-ink-500">
                      {isKn
                        ? "ಶಾಸನ ಸಾಹಿತ್ಯ, ಜಾನಪದ ನಿಘಂಟು ಹಾಗೂ ರಾಜ್ಯ ಗೆಜೆಟಿಯರ್ ಮಾಹಿತಿ."
                        : "State gazetteers, folk lexicons & epigraphic sources."}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Dynamic Interactive Hero Map */}
              <div className="lg:col-span-5 relative" data-purpose="hero-cartography">
                <InteractiveHeroMap />
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. Pillars with Dynamic Hover Animations ── */}
        <section className="py-16 md:py-20 border-b border-hairline bg-surface" id="dialects">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="max-w-2xl mb-12" data-purpose="pillars-header">
              <p className="text-xs font-mono uppercase tracking-widest text-karnataka-crimson mb-2 font-semibold">
                {isKn ? "ತಂತ್ರಜ್ಞಾನದ ವೈಶಿಷ್ಟ್ಯಗಳು" : "Core Capabilities"}
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink-900 leading-snug">
                {isKn
                  ? "ಸಾಂಸ್ಕೃತಿಕ ನಿಷ್ಠೆ ಮತ್ತು ನಿಖರತೆಗಾಗಿ ರೂಪಿಸಲಾದ ವಾಸ್ತುಶಿಲ್ಪ"
                  : "A linguistic architecture built for cultural fidelity"}
              </h2>
              <p className="text-ink-500 text-sm leading-relaxed mt-2">
                {isKn
                  ? "ಸಾಮಾನ್ಯ ಭಾಷಾ ಮಾದರಿಗಳು ಪ್ರಾದೇಶಿಕತೆಯ ನೈಜತೆಯನ್ನು ಕಳೆದುಕೊಳ್ಳುತ್ತವೆ. ಸ್ವರ-ಸೇತು ಸ್ಥಳೀಯ ನುಡಿಗಟ್ಟು ಮತ್ತು ಅರ್ಥವ್ಯಾಪ್ತಿಯನ್ನು ರಕ್ಷಿಸುತ್ತದೆ."
                  : "Generic models homogenize regional vernaculars. Swara-Setu preserves semantic depth, nuances, and authentic spoken registers."}
              </p>
            </div>

            {/* 3-Column Compact Bento Grid with Lively Hover Micro-Interactions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-purpose="pillars-grid">
              {/* Card 1 */}
              <article className="p-6 rounded-2xl border border-hairline bg-paper flex flex-col justify-between hover:border-amber-400 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs text-ink-400 tracking-wider">
                      01 / DIALECT REGISTERS
                    </span>
                    <span className="w-3 h-3 rounded-full bg-karnataka-gold group-hover:scale-125 transition-transform" />
                  </div>
                  <h3 className="text-lg font-bold text-ink-900 mb-2 leading-snug group-hover:text-karnataka-crimson transition-colors">
                    {isKn ? "೧೦ ಪ್ರಾದೇಶಿಕ ಭಾಷಾ ವಲಯಗಳು" : "10 Regional Dialect Zones"}
                  </h3>
                  <p className="kannada-text text-xs text-karnataka-crimson font-semibold mb-2.5">
                    ಕಲ್ಯಾಣ ಕರ್ನಾಟಕ, ಕಿತ್ತೂರು, ಅರೆಭಾಷೆ, ಕುಂದಗನ್ನಡ ಮತ್ತು ಹಳೆ ಮೈಸೂರು.
                  </p>
                  <p className="text-xs sm:text-sm text-ink-500 leading-relaxed">
                    {isKn
                      ? "ಪ್ರತಿಯೊಂದು ವಲಯದ ವಿಶಿಷ್ಟ ನುಡಿಮುತ್ತುಗಳು ಹಾಗೂ ಸಂಭಾಷಣಾ ಶೈಲಿಗಳನ್ನು ಪ್ರತ್ಯೇಕವಾಗಿ ಗುರುತಿಸಿ ವಿಶ್ಲೇಷಿಸುತ್ತದೆ."
                      : "Parses colloquial variations distinct to North Karnataka, Kundagannada, Arebhashe, and Old Mysuru spoken forms."}
                  </p>
                </div>
                <div className="mt-6 pt-3.5 border-t border-hairline flex items-center justify-between text-xs text-ink-400 font-mono">
                  <span>{isKn ? "ವ್ಯಾಪ್ತಿ" : "COVERAGE"}</span>
                  <span className="text-ink-900 font-semibold">10 Zones • 31 Districts</span>
                </div>
              </article>

              {/* Card 2 */}
              <article className="p-6 rounded-2xl border border-hairline bg-paper flex flex-col justify-between hover:border-red-400 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs text-ink-400 tracking-wider">
                      02 / DETERMINISTIC RAG
                    </span>
                    <span className="w-3 h-3 rounded-full bg-karnataka-crimson group-hover:scale-125 transition-transform" />
                  </div>
                  <h3 className="text-lg font-bold text-ink-900 mb-2 leading-snug group-hover:text-karnataka-crimson transition-colors">
                    {isKn ? "೧೦೦% ಶಾಸನಬದ್ಧ ದಾಖಲೆಗಳು" : "100% Context-Locked Retrieval"}
                  </h3>
                  <p className="kannada-text text-xs text-karnataka-crimson font-semibold mb-2.5">
                    ಆಧಾರರಹಿತ ಕಲ್ಪನೆಗಳಿಲ್ಲದ ನಿಖರ ಮಾಹಿತಿ ಸಂಶ್ಲೇಷಣೆ (Zero Hallucination).
                  </p>
                  <p className="text-xs sm:text-sm text-ink-500 leading-relaxed">
                    {isKn
                      ? "ಎಐ ತಪ್ಪು ಮಾಹಿತಿ ನೀಡುವುದನ್ನು ತಡೆಹಿಡಿದು, ಅಧಿಕೃತ ಕೃತಿಗಳು ಮತ್ತು ರಾಜ್ಯ ಗೆಜೆಟಿಯರ್ ಮೂಲಗಳಿಂದ ಮಾತ್ರ ಉತ್ತರ ಒದಗಿಸುತ್ತದೆ."
                      : "Strict context boundary ensures inferences rely solely on authenticated regional records and government gazetteers."}
                  </p>
                </div>
                <div className="mt-6 pt-3.5 border-t border-hairline flex items-center justify-between text-xs text-ink-400 font-mono">
                  <span>{isKn ? "ದೋಷ ಪ್ರಮಾಣ" : "HALLUCINATIONS"}</span>
                  <span className="text-karnataka-crimson font-semibold">0.00% Zero Error</span>
                </div>
              </article>

              {/* Card 3 */}
              <article className="p-6 rounded-2xl border border-hairline bg-paper flex flex-col justify-between hover:border-amber-500 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs text-ink-400 tracking-wider">
                      03 / MULTIMODAL VOICE
                    </span>
                    <span className="w-3 h-3 rounded-full bg-ink-900 group-hover:scale-125 transition-transform" />
                  </div>
                  <h3 className="text-lg font-bold text-ink-900 mb-2 leading-snug group-hover:text-karnataka-crimson transition-colors">
                    {isKn ? "ಕನ್ನಡ ಧ್ವನಿ & ಪಠ್ಯ ಸಂವಾದ" : "Bilingual Voice & Kanglish Normalizer"}
                  </h3>
                  <p className="kannada-text text-xs text-karnataka-crimson font-semibold mb-2.5">
                    ಆಂಗ್ಲ-ಕನ್ನಡ (ಕ್ಯಾಂಗ್ಲಿಷ್) ಲಿಪ್ಯಂತರಣ ಹಾಗೂ ನೈಜ ಧ್ವನಿ ಸಂಭಾಷಣೆ.
                  </p>
                  <p className="text-xs sm:text-sm text-ink-500 leading-relaxed">
                    {isKn
                      ? "ದೈನಂದಿನ ಇಂಗ್ಲಿಷ್ ಲಿಪಿಯ ಕನ್ನಡ (ಕ್ಯಾಂಗ್ಲಿಷ್) ಪ್ರಶ್ನೆಗಳು ಮತ್ತು ಸ್ಪಷ್ಟ ಕನ್ನಡ ಧ್ವನಿ ಇನ್‌ಪುಟ್‌ಗಳನ್ನು ಸುಲಭವಾಗಿ ಗುರುತಿಸುತ್ತದೆ."
                      : "Accepts spoken conversational Kannada as well as Latin-script Kanglish queries, mapping them into pure Kannada responses."}
                  </p>
                </div>
                <div className="mt-6 pt-3.5 border-t border-hairline flex items-center justify-between text-xs text-ink-400 font-mono">
                  <span>{isKn ? "ವೇಗ" : "LATENCY"}</span>
                  <span className="text-ink-900 font-semibold">Real-Time Interactive</span>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ── 5. Execution Protocol (Workflow) ── */}
        <section className="py-16 md:py-20 border-b border-hairline bg-paper" id="workflow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <p className="text-xs font-mono uppercase tracking-widest text-ink-400 mb-2 font-semibold">
                {isKn ? "ಕಾರ್ಯವಿಧಾನದ ೩ ಹಂತಗಳು" : "3-Stage Pipeline"}
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink-900 leading-snug">
                {isKn
                  ? "ಮಾಹಿತಿಯು ಸ್ವರ-ಸೇತು ತಂತ್ರಜ್ಞಾನದಲ್ಲಿ ಹೇಗೆ ಸಂಚರಿಸುತ್ತದೆ"
                  : "How regional queries traverse the Swara-Setu engine"}
              </h2>
            </div>

            {/* 3 Step Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-purpose="workflow-pipeline">
              <div className="p-6 rounded-2xl bg-surface border border-hairline shadow-2xs hover:border-amber-300 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-neutral-100 text-ink-900 font-mono text-xs font-bold">
                    01
                  </span>
                  <span className="text-xs font-mono text-ink-400">INGESTION</span>
                </div>
                <h4 className="font-bold text-ink-900 text-base mb-2">
                  {isKn ? "ಧ್ವನಿರೂಪ ಸಮನ್ವಯ" : "Phonetic Normalization"}
                </h4>
                <p className="text-xs sm:text-sm text-ink-500 leading-relaxed">
                  {isKn
                    ? "ಕ್ಯಾಂಗ್ಲಿಷ್ ಮತ್ತು ಪ್ರಾದೇಶಿಕ ಉಚ್ಚಾರಣೆಗಳನ್ನು ಪ್ರಮಾಣೀಕರಿಸಿ, ಪ್ರಶ್ನೆಯ ನೈಜ ಆಶಯವನ್ನು ಗುರುತಿಸುತ್ತದೆ."
                    : "Decodes spoken audio and Latin-script Kanglish into normalized Kannada search intent."}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-surface border border-hairline shadow-2xs hover:border-red-300 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-neutral-100 text-ink-900 font-mono text-xs font-bold">
                    02
                  </span>
                  <span className="text-xs font-mono text-karnataka-crimson font-medium">GATEKEEPER</span>
                </div>
                <h4 className="font-bold text-ink-900 text-base mb-2">
                  {isKn ? "ಹೈಬ್ರಿಡ್ ಶ್ರೇಯಾಂಕ ಪರಿಶೀಲನೆ" : "Hybrid Context Retrieval"}
                </h4>
                <p className="text-xs sm:text-sm text-ink-500 leading-relaxed">
                  {isKn
                    ? "ವೆಕ್ಟರ್ ಎಂಬೆಡ್ಡಿಂಗ್ ಮತ್ತು ಕೀವರ್ಡ್ ಶೋಧನೆಯ ಮೂಲಕ ಅಧಿಕೃತ ದಾಖಲೆಗಳನ್ನು ಮಾತ್ರ ಹಿಂಪಡೆಯುತ್ತದೆ."
                    : "Dense semantic vectors combined with exact keyword matching isolate verified local chunks."}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-surface border border-hairline shadow-2xs hover:border-emerald-300 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-neutral-100 text-ink-900 font-mono text-xs font-bold">
                    03
                  </span>
                  <span className="text-xs font-mono text-emerald-600 font-medium">VALIDATED</span>
                </div>
                <h4 className="font-bold text-ink-900 text-base mb-2">
                  {isKn ? "ಶಾಸನಬದ್ಧ ಸಂಶ್ಲೇಷಣೆ" : "Grounded Kannada Response"}
                </h4>
                <p className="text-xs sm:text-sm text-ink-500 leading-relaxed">
                  {isKn
                    ? "ಆಧಾರ ಸಹಿತ ಪರಿಪೂರ್ಣ ಶುದ್ಧ ಕನ್ನಡದಲ್ಲಿ ನಿಖರ ಉತ್ತರವನ್ನು ಒದಗಿಸುತ್ತದೆ ಮತ್ತು ಆಲಿಸಲು ಧ್ವನಿ ಸೌಲಭ್ಯ ನೀಡುತ್ತದೆ."
                    : "Synthesizes pure Kannada answers strictly locked to verified regional evidence."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. Interactive Live Query Showcase (Terminal Workbench with Moving Tabs) ── */}
        <section className="py-16 md:py-20 border-b border-hairline bg-surface" id="preview">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-mono uppercase tracking-widest text-karnataka-crimson font-semibold">
                {isKn ? "ಪ್ರತ್ಯಕ್ಷ ಶೋಧನಾ ನಿದರ್ಶನ" : "Live Query Workbench"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink-900 mt-2 leading-snug">
                {isKn
                  ? "ಆಧಾರಬದ್ಧ ಪ್ರಾದೇಶಿಕ ಶೋಧನೆಯನ್ನು ವೀಕ್ಷಿಸಿ"
                  : "Observe Context-Bound Regional Retrieval"}
              </h2>
              <p className="text-xs sm:text-sm text-ink-500 mt-2 leading-relaxed">
                {isKn
                  ? "ವಿಭಿನ್ನ ಪ್ರಾದೇಶಿಕ ಪ್ರಶ್ನೆಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಿ ಭ್ರಮಾರಹಿತ ನಿಖರ ಪ್ರತ್ಯುತ್ತರವನ್ನು ಪರೀಕ್ಷಿಸಿ."
                  : "Toggle across regional dialect queries to experience verified synthesis in action."}
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
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                    activeQueryIndex === idx
                      ? "bg-ink-900 text-white shadow-sm ring-2 ring-karnataka-crimson/50 scale-105"
                      : "bg-paper text-ink-700 border border-hairline hover:bg-neutral-100"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${activeQueryIndex === idx ? "bg-karnataka-gold animate-ping" : "bg-neutral-400"}`} />
                  <span className="kannada-text">{demo.regionKannada}</span>
                </button>
              ))}
            </div>

            {/* Terminal Window Mockup */}
            <div
              className="max-w-3xl mx-auto rounded-3xl border border-hairline bg-paper shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
              data-purpose="query-workbench"
            >
              {/* Terminal Title Bar */}
              <div className="px-5 py-3 bg-neutral-100/95 border-b border-hairline flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="ml-2 font-mono text-ink-600 font-medium text-[11px]">
                    swara-setu // regional-query-engine-v2
                  </span>
                </div>
                <div className="flex items-center gap-3 font-mono text-xs text-ink-500">
                  <span className="text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded font-semibold text-[11px] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    RAG: LOCKED
                  </span>
                </div>
              </div>

              {/* Terminal Content Body */}
              <div className="p-6 sm:p-8 space-y-6">
                {/* User Input Prompt */}
                <div className="space-y-2">
                  <div className="text-[11px] font-mono uppercase text-ink-400 tracking-wider flex items-center justify-between">
                    <span>{isKn ? "ಬಳಕೆದಾರರ ಪ್ರಶ್ನೆ" : "User Dialect Query"}</span>
                    <span className="text-karnataka-crimson font-mono text-[11px] font-semibold">
                      {currentDemo.regionKannada}
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-surface border border-hairline font-mono text-xs sm:text-sm text-ink-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
                    <div>
                      <span className="text-karnataka-crimson font-bold">&gt; </span>
                      <span className="kannada-text">&quot;{currentDemo.query}&quot;</span>
                    </div>
                  </div>
                </div>

                {/* Grounded Synthesis */}
                <div className="space-y-2">
                  <div className="text-[11px] font-mono uppercase text-ink-400 tracking-wider flex items-center justify-between">
                    <span>{isKn ? "ದೃಢೀಕೃತ ಪ್ರತ್ಯುತ್ತರ" : "Verified Response"}</span>
                    <button
                      type="button"
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-[11px] font-semibold transition-all cursor-pointer"
                    >
                      <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? "text-red-600 animate-pulse" : "text-amber-700"}`} />
                      <span>{isPlayingAudio ? "ಆಲಿಸಲಾಗುತ್ತಿದೆ (Playing)..." : "ಆಲಿಸಿ (Listen)"}</span>
                      {isPlayingAudio && (
                        <div className="flex items-center gap-0.5 ml-1">
                          <span className="w-1 h-2.5 rounded-full bg-red-600 animate-waveform" style={{ animationDelay: "0ms" }} />
                          <span className="w-1 h-3.5 rounded-full bg-amber-500 animate-waveform" style={{ animationDelay: "150ms" }} />
                          <span className="w-1 h-2 rounded-full bg-red-600 animate-waveform" style={{ animationDelay: "300ms" }} />
                        </div>
                      )}
                    </button>
                  </div>
                  <div className="p-5 rounded-2xl bg-surface border border-hairline space-y-3.5 shadow-2xs">
                    <p className="kannada-text text-ink-900 text-xs sm:text-sm leading-relaxed">
                      {currentDemo.verifiedAnswer}
                    </p>

                    {/* Citations */}
                    <div className="pt-3 border-t border-hairline flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-mono text-ink-400 font-medium">ಮೂಲ ದಾಖಲೆಗಳು:</span>
                      {currentDemo.citations.map((cite, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-neutral-100 text-ink-700 border border-hairline"
                        >
                          {cite}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Direct CTA Strip */}
              <div className="px-6 py-4 bg-neutral-50/90 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span className="text-ink-500 font-mono flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {isKn ? "೩೧ ಜಿಲ್ಲೆಗಳ RAG ನೇರ ಸಂಪರ್ಕ ಸಿದ್ಧವಾಗಿದೆ" : "31 District Corpora Online & Grounded"}
                </span>
                <Link
                  href="/workspace"
                  className="px-4 py-2 rounded-xl bg-karnataka-crimson hover:bg-karnataka-crimson-dark text-white font-bold hover:shadow-md inline-flex items-center gap-1.5 transition-all group"
                >
                  <span>{isKn ? "ಪೂರ್ಣ 3D ಮ್ಯಾಪ್ & ಧ್ವನಿ ಸಂವಾದ ತೆರೆಯಿರಿ" : "Launch Interactive Workspace"}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-karnataka-gold group-hover:text-white transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7. Call To Action (Streamlined & Focused) ── */}
        <section className="py-16 md:py-20 bg-paper relative">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <div className="w-12 h-1 mx-auto mb-6 karnataka-stripe rounded-full" />
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink-900 mb-4 leading-snug">
              {isKn
                ? "ಪ್ರಾದೇಶಿಕ ಕನ್ನಡ ಜ್ಞಾನ ಶೋಧನೆ ಆರಂಭಿಸಲು ಸಿದ್ಧರೇ?"
                : "Ready to explore regional Kannada intelligence?"}
            </h2>
            <p className="text-ink-500 text-xs sm:text-sm max-w-xl mx-auto mb-7 leading-relaxed">
              {isKn
                ? "ಕರ್ನಾಟಕದ ೧೦ ಭಾಷಾ ವಲಯಗಳ 3D ನಕಾಶೆ ಮತ್ತು AI ಧ್ವನಿ ಸಂವಾದವನ್ನು ಈಗಲೇ ಉಚಿತವಾಗಿ ಅನುಭವಿಸಿ."
                : "Experience the spatial 3D dialect map and context-locked AI voice assistant now."}
            </p>
            <div className="flex items-center justify-center">
              <Link
                href="/workspace"
                className="relative inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-ink-900 via-neutral-900 to-ink-900 hover:from-karnataka-crimson hover:to-karnataka-crimson-dark text-white font-semibold text-sm shadow-md hover:shadow-xl transition-all active:scale-[0.98] group overflow-hidden"
              >
                <span className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-12 -translate-x-full group-hover:translate-x-[250%] transition-transform duration-700 ease-out" />
                <span>{isKn ? "ಕಾರ್ಯಕ್ಷೇತ್ರ ತೆರೆಯಿರಿ" : "Enter Interactive Workspace"}</span>
                <span className="text-karnataka-gold font-bold transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── 8. Refined Footer with Geographically Correct Logo ── */}
      <footer className="relative bg-surface border-t border-hairline" data-purpose="site-footer">
        <div className="h-[2px] w-full bg-gradient-to-r from-karnataka-gold via-karnataka-crimson to-karnataka-gold" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
            {/* Brand Summary */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 p-1 flex items-center justify-center shrink-0">
                  <img
                    src="/karnataka-logo.svg"
                    alt="ಕರ್ನಾಟಕ ಲಾಂಛನ"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="font-bold text-base tracking-tight text-ink-900">Swara-Setu</span>
                <span className="kannada-text text-xs text-ink-500">| ಸ್ವರಸೇತು</span>
              </div>
              <p className="text-xs text-ink-500 leading-relaxed max-w-sm">
                {isKn
                  ? "ಕನ್ನಡ ಭಾಷಾ ಪರಿಸರಕ್ಕಾಗಿ ರೂಪಿಸಲಾದ ನಿಖರ RAG ವೇದಿಕೆ. ಸಾಂಸ್ಕೃತಿಕ ಪರಂಪರೆಯ ಶೂನ್ಯ-ನಷ್ಟ ಸಂರಕ್ಷಣೆಗೆ ಸಮರ್ಪಿತ."
                  : "Deterministic Regional Retrieval-Augmented Generation for the Kannada linguistic ecosystem."}
              </p>
              <div className="pt-1">
                <span className="kannada-classic text-xs font-semibold text-karnataka-crimson">
                  &quot;ಸಿರಿಗನ್ನಡಂ ಗೆಲ್ಗೆ, ಸಿರಿಗನ್ನಡಂ ಬಾಳ್ಗೆ&quot;
                </span>
              </div>
            </div>

            {/* Navigation Columns */}
            <div className="md:col-span-2 space-y-2">
              <h5 className="text-[11px] font-mono uppercase text-ink-900 font-semibold tracking-wider">
                {isKn ? "ಪ್ರದೇಶಗಳು" : "Regions"}
              </h5>
              <ul className="text-xs space-y-1.5 text-ink-500">
                <li>ಕಲ್ಯಾಣ ಕರ್ನಾಟಕ</li>
                <li>ಕರಾವಳಿ & ಮಲೆನಾಡು</li>
                <li>ಹಳೆ ಮೈಸೂರು</li>
                <li>ಕಿತ್ತೂರು ಕರ್ನಾಟಕ</li>
              </ul>
            </div>

            <div className="md:col-span-2 space-y-2">
              <h5 className="text-[11px] font-mono uppercase text-ink-900 font-semibold tracking-wider">
                {isKn ? "ತಂತ್ರಜ್ಞಾನ" : "Technology"}
              </h5>
              <ul className="text-xs space-y-1.5 text-ink-500">
                <li>Vector Search</li>
                <li>Context Lock RAG</li>
                <li>Voice Transcriber</li>
                <li>State Gazetteers</li>
              </ul>
            </div>

            <div className="md:col-span-3 space-y-2">
              <h5 className="text-[11px] font-mono uppercase text-ink-900 font-semibold tracking-wider">
                {isKn ? "ಕಾರ್ಯಕ್ಷೇತ್ರ" : "Workspace"}
              </h5>
              <ul className="text-xs space-y-1.5 text-ink-500">
                <li>
                  <Link href="/workspace" className="text-karnataka-crimson font-medium hover:underline">
                    {isKn ? "ಕಾರ್ಯಕ್ಷೇತ್ರ ತೆರೆಯಿರಿ ↗" : "Launch Workspace ↗"}
                  </Link>
                </li>
                <li>3D Spatial Map</li>
                <li>Bhashini Kannada TTS</li>
                <li>Open Regional Corpus</li>
              </ul>
            </div>
          </div>

          {/* Copyright Bar */}
          <div className="pt-6 border-t border-hairline flex flex-col sm:flex-row items-center justify-between text-xs text-ink-400 gap-3">
            <div>
              © {new Date().getFullYear()} Swara-Setu Project. Grounded in Karnataka.
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>31 DISTRICT CORPUS ONLINE</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
