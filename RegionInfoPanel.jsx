/**
 * RegionInfoPanel.jsx - Glassmorphic Bento Box overlay for the Swara-Setu map.
 *
 * This component displays regional Kannada sentences with glassmorphic styling,
 * backdrop-blur, semi-transparent backgrounds, and plays audio via the
 * useVoiceAgent custom hook using edge-tts Microsoft neural voices.
 *
 * Props:
 *   regionalText: string - The Kannada sentence to display and play
 *   onPlay: function - Callback when user clicks play
 *   regionName: string - Region name for display (e.g. "ಧಾರವಾಡ")
 *   isPlaying: boolean - Current playing state
 *
 * Features:
 * - Glassmorphic design with backdrop-blur, bg-black/40, border-white/20
 * - Loading, speaking, and play states
 * - Disabled button while audio plays to prevent overlap
 * - Proper cleanup on unmount
 * - Tailwind CSS styling consistent with existing UI
 */

import React, { useState, useEffect, useRef } from "react";
import { useVoiceAgent } from "./useVoiceAgent";

/**
 * RegionInfoPanel - Glassmorphic info panel with audio playback
 */
const RegionInfoPanel = ({
  regionalText,
  onPlay,
  regionName = " Karnataka",
}: {
  regionalText: string;
  onPlay?: (text: string) => void;
  regionName?: string;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showSpeaking, setShowSpeaking] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Use the custom hook for audio management
  const {
    audioUrl,
    isPlaying: hookIsPlaying,
    play,
    stop,
    error,
  } = useVoiceAgent();

  // Sync playing state from hook
  useEffect(() => {
    setIsPlaying(hookIsPlaying);
  }, [hookIsPlaying]);

  // Handle audio state changes
  useEffect(() => {
    if (showSpeaking) {
      setShowSpeaking(false);
      play(regionalText).then(() => {
        setIsPlaying(true);
        setShowSpeaking(false);
        // Auto-stop after a reasonable time (8 seconds)
        const timer = setTimeout(() => {
          stop();
          setIsPlaying(false);
        }, 8000);
        return () => clearTimeout(timer);
      });
    }
  }, [play, stop, regionalText]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
      if (audioUrl) {
        const url = audioUrl;
        // Can't revoke here since we don't have direct access,
        // but the hook handles it on end
      }
    };
  }, [stop, audioUrl]);

  // Disable play button while audio is already playing
  const isDisabled = isPlaying || showLoading || showSpeaking;

  return (
    <div
      ref={panelRef}
      className="
        fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden
        pointer-events-auto
      "
    >
      {/* Glassmorphic panel */}
      <div
        role="dialog"
        aria-modal="true"
        className="
          relative w-full max-w-[560px] bg-black/40 backdrop-blur-xl border border-white/20
          rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.65),inset_0_1px_1px_rgba(255,255,255,0.2)]
          text-white backdrop-filter backdrop-blur-lg
        "
      >
        {/* Top accent gradient */}
        <div
          className="h-1.5 w-full shrink-0"
          style={{ background: "linear-gradient(90deg, #F5B700, #FF5F03, #F5B700)" }}
        />

        {/* Header */}
        <div className="px-5 py-3.5 border-b border-white/10 bg-white/5 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-3.5 h-3.5 rounded-full ring-2 ring-white/30 shadow-xs shrink-0"
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
                  className="w-3 h-3 text-amber-400 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    className="stroke-2"
                    strokeLineCap="round"
                    strokeLineJoin="round"
                    d="M13 16l-4-4 4-4M21 21l-5-5 5-5M13 21l-4-4 4-4M2 6l2.29 2.29m13.71 13.71l2.29 2.29M2 2l2.29 2.29m7.71 7.71l2.29 2.29M13 10l-4-4l4-4M21 10l-5-5l5-5M10 21l-4-4 4-4M10 10l-4-4 4-4"
                  />
                </svg>
                {regionName}
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={() => onPlay && onPlay("close")}
            className="
              w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/15
              text-stone-300 hover:text-white flex items-center justify-center
              transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0
            "
            title="ಮುಚ್ಚಿರಿ"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                className="stroke-2"
                strokeLineCap="round"
                strokeLineJoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Regional sentence display */}
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
                    className="stroke-2"
                    strokeLineCap="round"
                    strokeLineJoin="round"
                    d="M13 16l-4-4 4-4M21 21l-5-5 5-5M13 21l-4-4 4-4M2 6l2.29 2.29m13.71 13.71l2.29 2.29M2 2l2.29 2.29m7.71 7.71l2.29 2.29M13 10l-4-4l4-4M21 10l-5-5l5-5M10 21l-4-4 4-4M10 10l-4-4 4-4"
                  />
                </svg>
                <span>Speaking... "{regionalText.substring(0, 50)}{regionalText.length > 50 ? "..." : ""}"</span>
              </div>
            )}

            {/* Regional text */}
            <div>
              <p className="font-serif text-base sm:text-lg font-bold text-amber-100 leading-relaxed">
                "{regionalText}"
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <button
                type="button"
                onClick={() => {
                  if (!isPlaying && !showLoading && !showSpeaking) {
                    setShowSpeaking(true);
                    setIsPlaying(true);
                    play(regionalText).then(() => {
                      // Audio will auto-manage state
                    });
                  }
                }}
                disabled={isDisabled}
                className="
                  flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold
                  transition-all cursor-pointer ${
                    isPlaying
                      ? "bg-red-600 text-white animate-pulse"
                      : "bg-amber-400 hover:bg-amber-300 text-stone-950 hover:text-white"
                  }
                "
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    className="stroke-2"
                    strokeLineCap="round"
                    strokeLineJoin="round"
                    d="M13 16l-4-4 4-4M21 21l-5-5 5-5M13 21l-4-4 4-4M2 6l2.29 2.29m13.71 13.71l2.29 2.29M2 2l2.29 2.29m7.71 7.71l2.29 2.29M13 10l-4-4l4-4M21 10l-5-5l5-5M10 21l-4-4 4-4M10 10l-4-4 4-4"
                  />
                </svg>
                {isPlaying ? "ಆಲಿಸುತ್ತಿದೆ..." : "ಆಲಿ"}
              </button>
            </div>
          </div>

          {/* Status messages */}
          {error && (
            <div className="p-3 rounded-xl bg-red-600/20 border border-red-500/30 text-red-300 text-sm font-serif mb-3">
              {error}
            </div>
          )}

          {showLoading && (
            <div className="py-8 text-center text-sm font-serif text-stone-300 animate-pulse">
              ವಾಕ್ಯಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...
            </div>
          )}
        </div>

        {/* Footer */
        <div className="px-5 py-3 bg-black/50 border-t border-white/10 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2 text-stone-300">
            <svg
              className="w-3.5 h-3.5 text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                className="stroke-2"
                strokeLineCap="round"
                strokeLineJoin="round"
                d="M12 9v2m0 0v2m0-2h.01M5.5 16l1.5-5.5m1.5 5.5l1.5-5.5M12 10v6M12 10l.01-.01m6.99 6l-.01-.01M5.5 8.5l1.5 5.5m1.5-5.5l1.5 5.5"
              />
            </span>
            <span className="text-[10px] font-mono">kn-IN neural voice enabled</span>
          </div>

          <button
            type="button"
            onClick={() => onPlay && onPlay("close")}
            className="
              px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/20 text-white font-medium text-xs
              transition-all cursor-pointer
            "
          >
            ಮುಚ್ಚಿರಿ
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Export the component and utility types
 */
export default RegionInfoPanel;

export type { RegionInfoPanel };