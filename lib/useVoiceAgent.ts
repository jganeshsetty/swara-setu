"use client";

import { useEffect, useState, useCallback, useRef } from "react";

export interface UseVoiceAgentReturn {
  audioUrl: string | null;
  isPlaying: boolean;
  play: (text: string, voiceName?: string) => Promise<void>;
  stop: () => void;
  error: string | null;
  voice: string;
  setVoice: (voice: string) => void;
}

/**
 * Custom hook for streaming TTS audio from the Swara-Setu backend.
 * Fetches audio from /api/speak (Microsoft neural Kannada voice),
 * creates a blob URL, and plays it via the browser's native Audio API.
 * Gracefully falls back to browser SpeechSynthesis if the backend TTS is unavailable.
 */
export function useVoiceAgent(): UseVoiceAgentReturn {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voice, setVoice] = useState<string>("kn-IN-SapnaNeural");

  const audioRef = useRef<HTMLAudioElement | null>(null);

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
  const playBrowserSpeech = useCallback((text: string) => {
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
    async (text: string, voiceName?: string) => {
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

export default useVoiceAgent;

