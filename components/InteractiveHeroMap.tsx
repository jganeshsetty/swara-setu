"use client";

import { useState } from "react";
import Link from "next/link";
import { Compass, Sparkles, MapPin, ArrowRight } from "lucide-react";

interface DialectPreview {
  id: string;
  name: string;
  kannadaName: string;
  sampleColloquial: string;
  standardMeaning: string;
  regionColor: string;
  regionTag: string;
}

const DIALECT_PREVIEWS: DialectPreview[] = [
  {
    id: "uttara_kalyana",
    name: "Kalyana Karnataka",
    kannadaName: "ಕಲ್ಯಾಣ ಕರ್ನಾಟಕ (ಬೀದರ್ / ಕಲಬುರಗಿ)",
    sampleColloquial: "ನೀವ್ ಹ್ಯಾಂಗಿದ್ದೀರಿ? ಚೊಲೊ ಇದ್ದೀರೇನು?",
    standardMeaning: "ಹೇಗಿದ್ದೀರಿ? ಚೆನ್ನಾಗಿದ್ದೀರಾ?",
    regionColor: "#FFE500",
    regionTag: "ಉತ್ತರ ಭಾಗ",
  },
  {
    id: "karavali_coast",
    name: "Coastal & Karavali",
    kannadaName: "ಕರಾವಳಿ & ಕುಂದಗನ್ನಡ (ಉಡುಪಿ / ಮಂಗಳೂರು)",
    sampleColloquial: "ಎಂಚ ಉಲ್ಲರ್? ಊಟ ಆತೇನ್ ನಿಕ್ಲೆಗ್?",
    standardMeaning: "ಹೇಗಿದ್ದೀರಿ? ಊಟವಾಯಿತೇ ನಿಮಗೆ?",
    regionColor: "#0EA5E9",
    regionTag: "ಕರಾವಳಿ ಭಾಗ",
  },
  {
    id: "krishna_valley",
    name: "Kittur & Belagavi",
    kannadaName: "ಕಿತ್ತೂರು & ಬೆಳಗಾವಿ (ಧಾರವಾಡ / ಬೆಳಗಾವಿ)",
    sampleColloquial: "ಖರೆ ಹೇಳತೇನ್ ಕೇಳ್ರಿ, ಧಾರವಾಡ ಪೇಢಾ ಮಸ್ತ್ ಐತಿ!",
    standardMeaning: "ನಿಜ ಹೇಳುತ್ತೇನೆ ಕೇಳಿ, ಧಾರವಾಡ ಪೇಡ ಅದ್ಭುತವಾಗಿದೆ!",
    regionColor: "#F59E0B",
    regionTag: "ಧಾರವಾಡ ಶೈಲಿ",
  },
  {
    id: "malnad_ghats",
    name: "Malenadu & Western Ghats",
    kannadaName: "ಮಲೆನಾಡು (ಶಿವಮೊಗ್ಗ / ಚಿಕ್ಕಮಗಳೂರು)",
    sampleColloquial: "ಮಲೆನಾಡಿನಲ್ಲಿ ಮಳೆ ಜೋರಾಗಿ ಸುರಿತಿದೆ ಕಣ್ರೀ!",
    standardMeaning: "ಮಲೆನಾಡಿನಲ್ಲಿ ಮಳೆ ರಭಸವಾಗಿ ಸುರಿಯುತ್ತಿದೆ!",
    regionColor: "#10B981",
    regionTag: "ಮಲೆನಾಡು ಶೈಲಿ",
  },
  {
    id: "kaveri_basin",
    name: "Old Mysuru",
    kannadaName: "ಹಳೆ ಮೈಸೂರು (ಮೈಸೂರು / ಮಂಡ್ಯ)",
    sampleColloquial: "ಅರಮನೆ ನಗರಿಗೆ ಬಂದಾಗ ಆರಾಮಾಗಿದ್ದೀರಾ ಸ್ವಾಮಿ?",
    standardMeaning: "ಮೈಸೂರಿಗೆ ಬಂದಾಗ ಸುಖವಾಗಿದ್ದೀರಾ?",
    regionColor: "#D92D20",
    regionTag: "ಮೈಸೂರು ಶೈಲಿ",
  },
];

export default function InteractiveHeroMap() {
  const [selectedDialect, setSelectedDialect] = useState<DialectPreview>(DIALECT_PREVIEWS[0]);

  return (
    <div className="relative bg-surface/95 dark:bg-[#161310]/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3 sm:p-6 border border-hairline dark:border-stone-800/80 shadow-md hover:shadow-lg transition-all duration-300 w-full max-w-full overflow-hidden">
      {/* ── 1. Floating Quick Badges (Safely bounded for mobile & dark mode) ── */}
      <div className="flex items-center justify-between gap-1.5 mb-2.5 sm:mb-3">
        <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-full bg-white dark:bg-stone-900 border border-amber-300 dark:border-amber-500/40 shadow-2xs text-[10px] sm:text-[11px] font-bold text-stone-900 dark:text-stone-100">
          <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-500 animate-pulse shrink-0" />
          <span className="kannada-text">೧೦ ಪ್ರಾದೇಶಿಕ ಶೈಲಿಗಳು</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-full bg-white dark:bg-stone-900 border border-karnataka-crimson/30 dark:border-red-500/30 shadow-2xs text-[10px] sm:text-[11px] font-bold text-ink-900 dark:text-stone-100">
          <div className="flex items-center gap-0.5">
            <span className="w-1 h-2 sm:h-2.5 rounded-full bg-karnataka-crimson animate-waveform" style={{ animationDelay: "0ms" }} />
            <span className="w-1 h-3 sm:h-3.5 rounded-full bg-karnataka-gold animate-waveform" style={{ animationDelay: "150ms" }} />
            <span className="w-1 h-2 sm:h-2.5 rounded-full bg-karnataka-crimson animate-waveform" style={{ animationDelay: "300ms" }} />
          </div>
          <span className="kannada-text">ಧ್ವನಿ ಸಂವಾದ</span>
        </div>
      </div>

      {/* ── 2. Header Status Strip ── */}
      <div className="flex items-center justify-between pb-2 sm:pb-2.5 mb-2.5 sm:mb-3 border-b border-hairline dark:border-stone-800 text-xs font-mono text-ink-500 dark:text-stone-400">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Compass className="w-3.5 h-3.5 text-karnataka-crimson animate-spin" style={{ animationDuration: "18s" }} />
          <span className="tracking-wider text-[10px] sm:text-[11px] font-semibold text-ink-700 dark:text-stone-300">
            ಕರ್ನಾಟಕ • 31 DISTRICTS
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-emerald-700 dark:text-emerald-400 font-bold text-[10px] sm:text-[11px]">ಲೈವ್ ನಕಾಶೆ</span>
        </div>
      </div>

      {/* ── 3. Geographically Correct Karnataka Vector Map ── */}
      <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-neutral-50/80 dark:bg-stone-950/80 border border-neutral-200/80 dark:border-stone-800 p-2 sm:p-4 flex items-center justify-center transition-all group">
        {/* Soft Map Aura */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 dark:from-amber-400/10 via-transparent to-red-600/5 dark:to-red-600/10 pointer-events-none" />

        {/* The Exact Geographically Correct Vector Map SVG */}
        <div className="relative w-full max-h-[220px] sm:max-h-[340px] flex items-center justify-center">
          <img
            src="/karnataka-real-map.svg"
            alt="ಕರ್ನಾಟಕ ನಕಾಶೆ"
            className="w-full h-auto max-h-[210px] sm:max-h-[330px] object-contain drop-shadow-sm select-none group-hover:scale-[1.02] transition-transform duration-500 ease-out"
          />

          {/* Interactive Radar Beacon on the Map */}
          <div className="absolute top-[32%] left-[45%] pointer-events-none flex items-center justify-center">
            <span className="w-3.5 h-3.5 rounded-full bg-karnataka-crimson animate-ping opacity-75" />
            <span className="absolute w-2 h-2 rounded-full bg-karnataka-crimson shadow-xs" />
          </div>

          <div className="absolute bottom-[28%] right-[38%] pointer-events-none flex items-center justify-center">
            <span className="w-3.5 h-3.5 rounded-full bg-karnataka-gold animate-ping opacity-75" style={{ animationDelay: "400ms" }} />
            <span className="absolute w-2 h-2 rounded-full bg-karnataka-gold shadow-xs" />
          </div>
        </div>

        {/* Floating Quick Hint overlay on Map */}
        <div className="absolute bottom-2 inset-x-2 text-center pointer-events-none">
          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-black/70 text-white backdrop-blur-xs border border-white/10">
            <MapPin className="w-3 h-3 text-karnataka-gold" />
            <span className="kannada-text">3D ನಕಾಶೆಯಲ್ಲಿ ಪೂರ್ಣ ವಿವರ ನೋಡಿ</span>
          </span>
        </div>
      </div>

      {/* ── 4. Interactive Dialect Selector Chips ── */}
      <div className="mt-3.5 space-y-2.5">
        <div className="flex items-center justify-between text-[11px] text-ink-500 dark:text-stone-400">
          <span className="font-semibold kannada-text text-ink-700 dark:text-stone-300">ಪ್ರದೇಶವನ್ನು ಆರಿಸಿ:</span>
          <span className="text-emerald-700 dark:text-emerald-400 font-bold kannada-text">ನೈಜ ಆಡುಮಾತು</span>
        </div>

        {/* Horizontal Scrollable Dialect Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none touch-pan-x">
          {DIALECT_PREVIEWS.map((dialect) => {
            const isSelected = selectedDialect.id === dialect.id;
            return (
              <button
                key={dialect.id}
                type="button"
                onClick={() => setSelectedDialect(dialect)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? "bg-ink-900 dark:bg-stone-100 text-white dark:text-stone-950 shadow-xs scale-102 ring-2 ring-karnataka-crimson/50 dark:ring-amber-400/50"
                    : "bg-paper dark:bg-stone-900 text-ink-700 dark:text-stone-300 border border-hairline dark:border-stone-800 hover:bg-neutral-100 dark:hover:bg-stone-800"
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: dialect.regionColor }}
                />
                <span className="kannada-text text-[11px]">{dialect.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Dialect Live Preview Box */}
        <div className="p-3 rounded-xl border border-hairline dark:border-stone-800 bg-paper/90 dark:bg-stone-900/90 transition-all duration-300">
          <div className="flex items-center justify-between mb-1.5 text-xs">
            <span className="font-bold text-ink-900 dark:text-stone-100 kannada-text truncate pr-2">
              {selectedDialect.kannadaName}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border border-amber-300/60 dark:border-amber-700/60 font-semibold shrink-0 kannada-text">
              {selectedDialect.regionTag}
            </span>
          </div>

          <div className="bg-surface dark:bg-stone-950/80 p-2.5 rounded-lg border border-hairline/80 dark:border-stone-800/80 space-y-1">
            <div className="flex items-start gap-1.5 text-xs text-karnataka-crimson dark:text-red-400 font-medium">
              <span className="font-bold shrink-0">&gt;</span>
              <p className="kannada-text leading-snug">
                &ldquo;{selectedDialect.sampleColloquial}&rdquo;
              </p>
            </div>
            <div className="text-[11px] text-ink-500 dark:text-stone-400 pl-3.5 border-l-2 border-karnataka-gold/60">
              <span className="text-ink-400 dark:text-stone-500 font-medium">ಅರ್ಥ: </span>
              <span className="kannada-text font-normal text-ink-800 dark:text-stone-200">{selectedDialect.standardMeaning}</span>
            </div>
          </div>
        </div>

        {/* Direct Link to Enter the Full 3D Map */}
        <Link
          href="/workspace"
          className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-ink-900 via-neutral-900 to-ink-900 dark:from-stone-800 dark:via-stone-900 dark:to-stone-800 hover:from-karnataka-crimson hover:to-karnataka-crimson-dark dark:hover:from-karnataka-crimson dark:hover:to-red-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs hover:shadow-md transition-all group border border-transparent dark:border-stone-700"
        >
          <span className="kannada-text">ಪೂರ್ಣ 3D ನಕಾಶೆ ಮತ್ತು ಧ್ವನಿ ಸಂವಾದ ತೆರೆಯಿರಿ</span>
          <ArrowRight className="w-3.5 h-3.5 text-karnataka-gold group-hover:text-white transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
