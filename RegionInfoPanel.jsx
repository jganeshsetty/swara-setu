/**
 * RegionInfoPanel.jsx - Glassmorphic Bento Box overlay for the Swara-Setu map.
 *
 * This component displays regional Kannada sentences with glassmorphic styling,
 * backdrop-blur, semi-transparent backgrounds, and plays audio via the
 * useVoiceAgent custom hook using edge-tts Microsoft neural voices.
 *
 * Props:
 *   regionalText: string - The Kannada sentence to display and play
 *   onPlay: function - Callback when user clicks play or close
 *   regionName: string - Region name for display (e.g. "ಧಾರವಾಡ")
 *   isPlaying: boolean - Current playing state
 */

import React, { useState, useEffect, useRef } from "react";
import { useVoiceAgent } from "./useVoiceAgent";

/**
 * RegionInfoPanel - Glassmorphic info panel with audio playback
 */
const RegionInfoPanel = ({
  regionalText = "",
  onPlay,
  regionName = "ಕರ್ನಾಟಕ",
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSpeaking, setShowSpeaking] = useState(false);
  const panelRef = useRef(null);

  // Use the custom hook for audio management
  const {
    isPlaying: hookIsPlaying,
    play,
    stop,
    error,
  } = useVoiceAgent();

  // Sync playing state from hook
  useEffect(() => {
    setIsPlaying(hookIsPlaying);
  }, [hookIsPlaying]);

  const handlePlay = async () => {
    if (isPlaying) {
      stop();
      setIsPlaying(false);
      setShowSpeaking(false);
      return;
    }

    setShowSpeaking(true);
    if (onPlay) onPlay(regionalText);
    await play(regionalText);
    setShowSpeaking(false);
  };

  return (
    <div
      ref={panelRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden pointer-events-auto"
    >
      {/* Glassmorphic panel */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-[560px] bg-black/75 backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.65),inset_0_1px_1px_rgba(255,255,255,0.2)] text-white overflow-hidden"
      >
        {/* Top accent gradient */}
        <div
          className="h-1.5 w-full shrink-0"
          style={{ background: "linear-gradient(90deg, #F5B700, #FF5F03, #F5B700)" }}
        />

        {/* Header */}
        <div className="px-5 py-3.5 border-b border-white/10 bg-white/5 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-3.5 h-3.5 rounded-full ring-2 ring-white/30 shadow-xs shrink-0"
              style={{ backgroundColor: "#F5B700" }}
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-white tracking-tight truncate">
                  {regionName}
                </h2>
              </div>
              <p className="text-[11px] text-stone-300 font-sans flex items-center gap-1.5 mt-0.5">
                <svg
                  className="w-3.5 h-3.5 text-amber-400 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeWidth="2"
                    strokeLineCap="round"
                    strokeLineJoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeWidth="2"
                    strokeLineCap="round"
                    strokeLineJoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>ಪ್ರಾದೇಶಿಕ ನುಡಿಗಟ್ಟು</span>
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={() => {
              stop();
              if (onPlay) onPlay("close");
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-stone-300 hover:text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
            title="ಮುಚ್ಚಿರಿ"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeWidth="2"
                strokeLineCap="round"
                strokeLineJoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="space-y-3">
            {/* Playing state indicator */}
            {showSpeaking && (
              <div className="flex items-center gap-2 text-sm text-stone-300">
                <svg
                  className="w-3 h-3 text-amber-400 animate-pulse"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeWidth="2"
                    strokeLineCap="round"
                    strokeLineJoin="round"
                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  />
                </svg>
                <span>ಧ್ವನಿ ಆರಂಭವಾಗುತ್ತಿದೆ...</span>
              </div>
            )}

            {/* Regional text */}
            <div>
              <p className="font-serif text-base sm:text-lg font-bold text-amber-100 leading-relaxed">
                "{regionalText}"
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
              <button
                type="button"
                onClick={handlePlay}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isPlaying
                    ? "bg-red-600 text-white animate-pulse"
                    : "bg-amber-400 hover:bg-amber-300 text-stone-950"
                }`}
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeWidth="2"
                    strokeLineCap="round"
                    strokeLineJoin="round"
                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  />
                </svg>
                <span>{isPlaying ? "ಆಲಿಸುತ್ತಿದೆ..." : "ಆಲಿಸಿ"}</span>
              </button>
            </div>
          </div>

          {/* Status messages */}
          {error && (
            <div className="p-3 rounded-xl bg-red-600/20 border border-red-500/30 text-red-300 text-xs font-serif">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-black/50 border-t border-white/10 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2 text-stone-300">
            <svg
              className="w-3.5 h-3.5 text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeWidth="2"
                strokeLineCap="round"
                strokeLineJoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-[10px] font-mono">kn-IN neural voice enabled</span>
          </div>

          <button
            type="button"
            onClick={() => {
              stop();
              if (onPlay) onPlay("close");
            }}
            className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/20 text-white font-medium text-xs transition-all cursor-pointer"
          >
            ಮುಚ್ಚಿರಿ
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegionInfoPanel;
