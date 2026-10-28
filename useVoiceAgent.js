"use client";

import { useEffect, useState, useCallback } from "react";

/**
 * Custom hook for streaming TTS audio from the Swara-Setu backend.
 * Fetches audio from /api/speak, creates a blob URL, and plays it via the
 * browser's native Audio API. Handles loading/playing/cleanup states.
 *
 * Usage:
 *   const { audioUrl, isPlaying, play, stop, error } = useVoiceAgent();
 *   return <button onClick={play}>Play Voice</button>;
 */
export function useVoiceAgent() {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voice, setVoice] = useState<string>("kn-IN-SapnaNeural");

  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);

  // Create and play audio from backend stream
  const play = useCallback(async (text: string, voiceName?: string) => {
    if (isPlaying) {
      // Stop current audio first
      stop();
    }

    setError(null);
    setIsPlaying(true);

    try {
      const selectedVoice = voiceName || voice;
      const response = await fetch("/api/speak", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          voice: selectedVoice,
        }),
        // Don't include credentials since edge-tts is public
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || `HTTP ${response.status}`);
      }

      // Get the audio blob data and create a URL
      const blob = await response.arrayBuffer();
      const url = URL.createObjectURL(new Blob([blob], { type: "audio/mpeg" }));

      setAudioUrl(url);
      setAudioRef(null); // Reset ref, we'll use the URL directly

      // Play the audio
      const audio = new Audio(url);
      setAudioRef(audio);

      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);
      audio.on ended = () => {
        setIsPlaying(false);
        // Clean up the object URL when done
        if (url) {
          URL.revokeObjectURL(url);
        }
      };

      audio.onerror = (e) => {
        setIsPlaying(false);
        setError("Could not play audio. Please try again.");
        console.error("Audio error:", e);
      };

      audio.play().catch((playError) => {
        setIsPlaying(false);
        setError("Could not start audio playback. " + (playError instanceof Error ? playError.message : String(playError)));
        console.error("Play failed:", playError);
      });

    } catch (err: any) {
      setIsPlaying(false);
      setError(err.message || "Failed to generate voice");
      console.error("TTS error:", err);
    }
  }, [isPlaying, voice]);

  // Stop current audio and cleanup
  const stop = useCallback(() => {
    setIsPlaying(false);
    if (audioRef) {
      audioRef.pause();
      audioRef.currentTime = 0;
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
  }, [audioUrl, audioRef]);

  // Update playing state based on audio element
  useEffect(() => {
    if (audioRef) {
      setIsPlaying(!audioRef.paused);
      audioRef.onplay = () => setIsPlaying(true);
      audioRef.onpause = () => setIsPlaying(false);
      audioRef.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl || "");
        setAudioUrl(null);
      };
      audioRef.onerror = (e) => {
        setIsPlaying(false);
        console.error("Audio element error:", e);
      };
    }
  }, [audioRef, audioUrl]);

  // Set the voice default
  useEffect(() => {
    setVoice("kn-IN-SapnaNeural");
  }, []);

  return {
    audioUrl,
    isPlaying,
    play,
    stop,
    error,
    voice,
    setVoice,
  };
}

/**
 * Voice button component styles using Tailwind CSS
 * Can be used inline or as a separate component
 */
export const VoiceButton = ({
  text = "ಆಲಿಸಿ",
  disabled,
  onClick,
  className,
}: {
  text?: string;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
        disabled
          ? "bg-amber-400/50 text-amber-300 disabled:opacity-50 disabled:pointer-events-none border border-white/15"
          : "bg-amber-400 hover:bg-amber-300 text-stone-950 hover:text-white transition-colors"
      } ${className}`}
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
      <span>{text}</span>
    </button>
  );
};