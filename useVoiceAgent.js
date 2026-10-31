"use client";

import { useEffect, useState, useCallback, useRef } from "react";

/**
 * Custom hook for streaming TTS audio from the Swara-Setu backend.
 * Fetches audio from /api/speak (Microsoft neural Kannada voice),
 * creates a blob URL, and plays it via the browser's native Audio API.
 * Gracefully falls back to browser SpeechSynthesis if the backend TTS is unavailable.
 *
 * Usage:
 *   const { audioUrl, isPlaying, play, stop, error } = useVoiceAgent();
 *   return <button onClick={() => play("ನಮಸ್ಕಾರ")}>Play Voice</button>;
 */
export function useVoiceAgent() {
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);
  const [voice, setVoice] = useState("kn-IN-SapnaNeural");

  const audioRef = useRef(null);

  // Stop current audio and cleanup
  const stop = useCallback(() => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
  }, [audioUrl]);

  // Fallback to browser SpeechSynthesis API
  const playBrowserSpeech = useCallback((text) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setError("Speech synthesis is not supported in this browser.");
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text
      .replace(/[•*#_"`]/g, "")
      .replace(/\(.*?\)/g, "")
      .replace(/\s+/g, " ")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText || text);
    utterance.lang = "kn-IN";
    utterance.rate = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const kannadaVoice = voices.find(
      (v) => v.lang.includes("kn") || v.lang.toLowerCase().includes("kannada")
    );
    if (kannadaVoice) utterance.voice = kannadaVoice;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  // Create and play audio from backend stream (with speech synthesis fallback)
  const play = useCallback(
    async (text, voiceName) => {
      if (!text || !text.trim()) return;

      stop();
      setError(null);
      setIsPlaying(true);

      const selectedVoice = voiceName || voice;

      try {
        const response = await fetch("/api/speak", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: text.trim(),
            voice: selectedVoice,
          }),
        });

        if (!response.ok) {
          throw new Error(`TTS server returned status ${response.status}`);
        }

        const blob = await response.blob();
        if (!blob || blob.size === 0) {
          throw new Error("Received empty audio response from TTS server");
        }

        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        const audio = new Audio(url);
        audioRef.current = audio;

        audio.onplay = () => setIsPlaying(true);
        audio.onpause = () => setIsPlaying(false);
        audio.onended = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(url);
          setAudioUrl(null);
          audioRef.current = null;
        };

        audio.onerror = (e) => {
          console.warn("Audio playback error, falling back to browser voice:", e);
          URL.revokeObjectURL(url);
          setAudioUrl(null);
          audioRef.current = null;
          playBrowserSpeech(text);
        };

        await audio.play();
      } catch (err) {
        console.warn("Backend TTS unavailable, using browser speech synthesis fallback:", err);
        playBrowserSpeech(text);
      }
    },
    [voice, stop, playBrowserSpeech]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

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
 * Reusable Voice button component
 */
export function VoiceButton({
  text = "ಆಲಿಸಿ",
  disabled = false,
  onClick,
  className = "",
}) {
  return (
    <button
      type="button"
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
          strokeWidth="2"
          strokeLineCap="round"
          strokeLineJoin="round"
          d="M13 16l-4-4 4-4M21 21l-5-5 5-5M13 21l-4-4 4-4M2 6l2.29 2.29m13.71 13.71l2.29 2.29M2 2l2.29 2.29m7.71 7.71l2.29 2.29M13 10l-4-4l4-4M21 10l-5-5l5-5M10 21l-4-4 4-4M10 10l-4-4 4-4"
        />
      </svg>
      <span>{text}</span>
    </button>
  );
}

export default useVoiceAgent;
