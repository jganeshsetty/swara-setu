"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2,
  X,
  MapPin,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Landmark,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { DISTRICT_TO_REGION_MAP, KANNADA_DISTRICT_NAMES } from "@/lib/districtMapping";

export interface RegionBentoData {
  regionId: string;
  name: string;
  nameKannada: string;
  districts: string[];
  colorClass: string;
  badgeBg: string;
  highlightHex: string;
  description: string;
  phrases: Array<{
    textbook: string;
    regional: string;
    meaning: string;
    audioUrl?: string;
  }>;
}

// Exact 1-to-1 Mapping to public/images/
export const REGION_IMAGE_METADATA: Record<
  string,
  {
    image: string;
    monumentName: string;
    monumentKannada: string;
    districtOrigin: string;
  }
> = {
  uttara_kalyana: {
    image: "/images/1.jpg",
    monumentName: "Bidar Fort",
    monumentKannada: "ಬೀದರ್ ಕೋಟೆ",
    districtOrigin: "ಬೀದರ್",
  },
  krishna_valley: {
    image: "/images/2.jpg",
    monumentName: "Gol Gumbaz",
    monumentKannada: "ಗೋಲ್ ಗುಂಬಜ್",
    districtOrigin: "ವಿಜಯಪುರ",
  },
  tungabhadra_belt: {
    image: "/images/3.jpg",
    monumentName: "Stone Chariot, Hampi",
    monumentKannada: "ಕಲ್ಲಿನ ರಥ, ಹಂಪಿ",
    districtOrigin: "ಹೊಸಪೇಟೆ / ವಿಜಯನಗರ",
  },
  hubballi_heartland: {
    image: "/images/4.jpg",
    monumentName: "Chalukyan Temple",
    monumentKannada: "ಕಲ್ಯಾಣ ಚಾಲುಕ್ಯ ದೇಗುಲ",
    districtOrigin: "ಧಾರವಾಡ / ಗದಗ",
  },
  karavali_coast: {
    image: "/images/5.jpg",
    monumentName: "Murudeshwara",
    monumentKannada: "ಮುರುಡೇಶ್ವರ ಕರಾವಳಿ ಶಿವ",
    districtOrigin: "ಉತ್ತರ ಕನ್ನಡ",
  },
  malnad_ghats: {
    image: "/images/6.jpg",
    monumentName: "Western Ghats",
    monumentKannada: "ಮಲೆನಾಡ ಪಶ್ಚಿಮ ಘಟ್ಟ",
    districtOrigin: "ಚಿಕ್ಕಮಗಳೂರು",
  },
  bayalu_seeme: {
    image: "/images/7.jpg",
    monumentName: "Chitradurga Fort",
    monumentKannada: "ಚಿತ್ರದುರ್ಗದ ಕಲ್ಲಿನ ಕೋಟೆ",
    districtOrigin: "ಚಿತ್ರದುರ್ಗ",
  },
  kaveri_basin: {
    image: "/images/8.jpg",
    monumentName: "Mysuru Palace",
    monumentKannada: "ಮೈಸೂರು ಅರಮನೆ",
    districtOrigin: "ಮೈಸೂರು",
  },
  dakshina_ghats: {
    image: "/images/9.jpg",
    monumentName: "BR Hills",
    monumentKannada: "ಬಿಳಿಗಿರಿರಂಗನ ಬೆಟ್ಟ",
    districtOrigin: "ಚಾಮರಾಜನಗರ",
  },
  kolar_bengaluru: {
    image: "/images/10.jpg",
    monumentName: "Vidhana Soudha",
    monumentKannada: "ವಿಧಾನ ಸೌಧ",
    districtOrigin: "ಬೆಂಗಳೂರು",
  },
};

interface RegionBentoOverlayProps {
  activeRegionData: RegionBentoData | null;
  clickedDistrict: string | null;
  clickOrigin?: { x: number; y: number } | null;
  isLoadingSentences?: boolean;
  playingSentenceText: string | null;
  onPlaySentence: (text: string) => void;
  onClose: () => void;
  onSelectDistrict?: (districtName: string, regionCode: string) => void;
}

export default function RegionBentoOverlay({
  activeRegionData,
  clickedDistrict,
  clickOrigin,
  isLoadingSentences = false,
  playingSentenceText,
  onPlaySentence,
  onClose,
  onSelectDistrict,
}: RegionBentoOverlayProps) {
  // Pagination state: Exactly 2 sentences per page
  const [currentPage, setCurrentPage] = useState(1);
  const sentencesPerPage = 2;

  // Reset page when region or clicked district changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeRegionData?.regionId, clickedDistrict]);

  // Determine current background image and monument details
  const activeMeta = useMemo(() => {
    if (!activeRegionData) return null;

    let regionKey = activeRegionData.regionId;
    if (clickedDistrict && DISTRICT_TO_REGION_MAP[clickedDistrict]) {
      regionKey = DISTRICT_TO_REGION_MAP[clickedDistrict];
    }

    return REGION_IMAGE_METADATA[regionKey] || REGION_IMAGE_METADATA["tungabhadra_belt"];
  }, [activeRegionData, clickedDistrict]);

  const phrases = activeRegionData?.phrases || [];
  const totalPages = Math.max(1, Math.ceil(phrases.length / sentencesPerPage));

  // Current 2 sentences for the active page
  const currentPhrases = useMemo(() => {
    const startIndex = (currentPage - 1) * sentencesPerPage;
    return phrases.slice(startIndex, startIndex + sentencesPerPage);
  }, [phrases, currentPage]);

  if (!activeRegionData || !activeMeta) return null;

  // Calculate pop-out initial position relative to viewport center
  const initialX = clickOrigin && typeof window !== "undefined"
    ? clickOrigin.x - window.innerWidth / 2
    : 0;
  const initialY = clickOrigin && typeof window !== "undefined"
    ? clickOrigin.y - window.innerHeight / 2
    : 0;

  return (
    <>
      {/* ── 1. Dynamic Background Layer (Vividly Visible Monument Image) ── */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMeta.image}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Monument Photo with slow 15s Ken Burns animation */}
            <div
              className="w-full h-full bg-cover bg-center animate-ken-burns transform origin-center transition-all duration-700"
              style={{
                backgroundImage: `url(${activeMeta.image})`,
                filter: "brightness(0.78) contrast(1.08) saturate(1.15)",
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Soft, Non-Obtrusive Ambient Vignette (Landmark remains bright & visible) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-black/10 to-black/45 pointer-events-none" />
      </div>

      {/* ── 2. Medium-Sized Clean Popup Window (Centered, No Clutter) ── */}
      <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-3 sm:p-6 overflow-hidden">
        <AnimatePresence>
          <motion.div
            key={activeRegionData.regionId + (clickedDistrict || "")}
            role="dialog"
            aria-modal="true"
            initial={{
              scale: 0.1,
              opacity: 0,
              x: initialX,
              y: initialY,
            }}
            animate={{
              scale: 1,
              opacity: 1,
              x: 0,
              y: 0,
              transition: {
                type: "spring",
                damping: 25,
                stiffness: 270,
                mass: 0.8,
              },
            }}
            exit={{
              scale: 0.15,
              opacity: 0,
              transition: { duration: 0.2, ease: "easeIn" },
            }}
            className="pointer-events-auto relative w-full max-w-[560px] flex flex-col rounded-3xl backdrop-blur-2xl bg-stone-950/85 border border-white/20 shadow-[0_24px_64px_rgba(0,0,0,0.65),inset_0_1px_1px_rgba(255,255,255,0.2)] text-white overflow-hidden"
          >
            {/* Top Accent Gradient Line */}
            <div
              className="h-1.5 w-full shrink-0"
              style={{
                background: `linear-gradient(90deg, ${activeRegionData.highlightHex || "#F5B700"}, #FF5F03, #F5B700)`,
              }}
            />

            {/* ── 1. Clean Header (Region Name & District Pill) ── */}
            <div className="px-5 py-3.5 border-b border-white/10 bg-white/5 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className="w-3.5 h-3.5 rounded-full ring-2 ring-white/30 shadow-xs shrink-0"
                  style={{ backgroundColor: activeRegionData.highlightHex || "#F5B700" }}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-serif text-lg sm:text-xl font-bold text-white tracking-tight truncate">
                      {activeRegionData.nameKannada}
                    </h2>
                    {clickedDistrict && (
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-600/30 border border-red-400/40 text-red-200 flex items-center gap-1 shrink-0">
                        <MapPin className="w-3 h-3 text-red-400" />
                        {KANNADA_DISTRICT_NAMES[clickedDistrict] || clickedDistrict}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-300 font-sans flex items-center gap-1.5 mt-0.5">
                    <Landmark className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>{activeMeta.monumentKannada} ({activeMeta.districtOrigin})</span>
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-stone-300 hover:text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
                title="ಮುಚ್ಚಿರಿ (Close)"
                aria-label="ಮುಚ್ಚಿರಿ"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ── 2. Top Page Navigation Bar (Clean & Aligned) ── */}
            <div className="px-5 py-2.5 bg-black/40 border-b border-white/10 flex items-center justify-between shrink-0">
              <span className="text-xs font-serif font-bold text-amber-200">
                ವಾಕ್ಯಗಳ ಪುಟ {currentPage} / {totalPages}
              </span>

              {/* Prev / Next Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer border border-white/15 text-stone-200"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>ಹಿಂದಿನದು</span>
                </button>

                {/* Page Indicator Dot Pills */}
                <div className="flex items-center gap-1 px-1">
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    const isActive = pageNum === currentPage;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setCurrentPage(pageNum)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          isActive
                            ? "bg-amber-400 w-5 shadow-xs"
                            : "bg-white/25 hover:bg-white/50 w-2"
                        }`}
                        title={`ಪುಟ ${pageNum}`}
                      />
                    );
                  })}
                </div>

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer border border-white/15 text-stone-200"
                >
                  <span>ಮುಂದಿನದು</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* ── 3. Content Body: Exactly 2 Sentences, Perfectly Spaced & Aligned ── */}
            <div className="p-4 sm:p-5 space-y-3.5 shrink-0">
              {isLoadingSentences ? (
                <div className="py-12 text-center text-sm font-serif text-stone-300 animate-pulse">
                  ವಾಕ್ಯಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...
                </div>
              ) : currentPhrases.length > 0 ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPage}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="space-y-3.5"
                  >
                    {currentPhrases.map((item, index) => {
                      const isPlayingRegional = playingSentenceText === item.regional;
                      const isPlayingTextbook = playingSentenceText === item.textbook;

                      return (
                        <div
                          key={index}
                          className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 transition-all duration-200 space-y-2.5 shadow-sm"
                        >
                          {/* Regional Dialect Statement (The Highlight) */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-amber-400" />
                                ಆಡುಮಾತು ({activeRegionData.name})
                              </span>
                              <p className="font-serif text-lg sm:text-xl font-bold text-amber-100 mt-1 leading-snug">
                                "{item.regional}"
                              </p>
                            </div>

                            {/* Regional Audio Play Button */}
                            <button
                              type="button"
                              onClick={() => onPlaySentence(item.regional)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-xs ${
                                isPlayingRegional
                                  ? "bg-red-600 text-white animate-pulse"
                                  : "bg-amber-400 hover:bg-amber-300 text-stone-950"
                              }`}
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>{isPlayingRegional ? "ಆಲಿಸುತ್ತಿದೆ..." : "ಆಲಿಸಿ"}</span>
                            </button>
                          </div>

                          {/* Standard Textbook Kannada Equivalent */}
                          <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 text-xs text-stone-200 font-sans min-w-0">
                              <span className="text-[10px] font-mono text-stone-400 shrink-0">📖 ಪ್ರಮಾಣಿತ:</span>
                              <span className="font-serif font-medium text-stone-200 truncate">
                                "{item.textbook}"
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => onPlaySentence(item.textbook)}
                              className={`p-1 rounded-lg text-xs transition-all cursor-pointer shrink-0 ${
                                isPlayingTextbook
                                  ? "bg-red-600 text-white"
                                  : "text-stone-300 hover:text-white hover:bg-white/15"
                              }`}
                              title="ಪ್ರಮಾಣಿತ ರೂಪ ಆಲಿಸಿ"
                            >
                              <Volume2 className="w-3 h-3" />
                            </button>
                          </div>

                          {/* English Meaning */}
                          <div className="flex items-center gap-1.5 text-[11px] text-stone-300 font-sans">
                            <ArrowRight className="w-3 h-3 text-amber-400 shrink-0" />
                            <span className="text-stone-400 font-medium">English:</span>
                            <span className="italic text-amber-200 font-serif">{item.meaning}</span>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="py-8 text-center text-stone-400 font-serif">
                  ಈ ಪ್ರದೇಶಕ್ಕೆ ವಾಕ್ಯಗಳು ಲಭ್ಯವಿಲ್ಲ.
                </div>
              )}
            </div>

            {/* ── 4. Clean Footer Bar (No Clutter, Simply Status & Close) ── */}
            <div className="px-5 py-3 bg-black/50 border-t border-white/10 flex items-center justify-between text-xs shrink-0">
              <div className="flex items-center gap-2 text-stone-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] font-mono">kn-IN ನೇಟಿವ್ ಧ್ವನಿ ಸೌಲಭ್ಯ</span>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-medium text-xs transition-all cursor-pointer"
              >
                ಮುಚ್ಚಿರಿ
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
