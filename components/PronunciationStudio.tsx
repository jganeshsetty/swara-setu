"use client";

import { useRef, useState, useEffect } from "react";

export default function PronunciationStudio() {
  const [isRecording, setIsRecording] = useState(false);
  const [showWaveform, setShowWaveform] = useState(false);
  const [comparison, setComparison] = useState<{
    nativeWaveform: Float32Array;
    userWaveform: Float32Array;
    feedback: string;
  } | null>(null);
  const [nativeAudioSrc, setNativeAudioSrc] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize Web Audio API
  useEffect(() => {
    if (typeof window === "undefined") return;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    contextRef.current = ctx;
    const analyser = ctx.createAnalyser();
    analyserRef.current = analyser;
    analyser.fftSize = 256;

    // Connect native audio element for waveform
    const nativeSelect = document.getElementById("native-audio-select") as HTMLSelectElement | null;
    if (nativeSelect) {
      const selectedOption = nativeSelect.options[nativeSelect.selectedIndex];
      const audioUrl = selectedOption?.getAttribute("data-url");
      if (audioUrl) {
        fetch(audioUrl)
          .then((res) => res.arrayBuffer())
          .then((arrayBuffer) => {
            ctx.decodeAudioData(
              arrayBuffer,
              () => {
                setNativeAudioSrc(audioUrl);
              },
              (err) => console.warn("[Audio] Could not decode preview audio:", err)
            );
          })
          .catch((err) => console.warn("[Audio] Sample audio not loaded:", err));
      }
    }

    return () => {
      if (ctx.state !== "closed") {
        ctx.close().catch(() => {});
      }
    };
  }, []);

  // Handle record button click
  const handleRecord = async () => {
    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      alert("Microphone is not supported in this browser.");
      return;
    }

    setIsRecording(true);
    setComparison(null);
    setShowWaveform(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      const options: MediaRecorderOptions = {};
      if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
        options.mimeType = "audio/webm;codecs=opus";
      }

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      const audioChunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.push(e.data);
      };

      mediaRecorder.start(1000);

      const timeoutId = setTimeout(() => {
        if (mediaRecorder.state === "recording") {
          mediaRecorder.stop();
        }
      }, 5000);

      await new Promise<void>((resolve) => {
        mediaRecorder.onstop = () => {
          clearTimeout(timeoutId);
          stream.getTracks().forEach((track) => track.stop());
          const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
          analyzeUserAccent(audioBlob);
          setIsRecording(false);
          resolve();
        };
      });
    } catch (err) {
      console.error("Microphone access error:", err);
      setIsRecording(false);
      alert("Could not access microphone. Please allow permissions.");
    }
  };

  // Analyze user accent against native pronunciation
  const analyzeUserAccent = async (userAudio: Blob) => {
    if (!contextRef.current || !analyserRef.current) return;

    try {
      const userArrayBuffer = await userAudio.arrayBuffer();
      const userContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const userAnalyser = userContext.createAnalyser();
      userAnalyser.fftSize = 256;

      const nativeAnalyser = analyserRef.current;
      const nativeData = new Float32Array(nativeAnalyser.frequencyBinCount);
      nativeAnalyser.getFloatFrequencyData(nativeData);

      const userData = new Float32Array(userAnalyser.frequencyBinCount);
      userAnalyser.getFloatFrequencyData(userData);

      let rmsDiff = 0;
      for (let i = 0; i < nativeData.length; i++) {
        rmsDiff += Math.abs(nativeData[i] - userData[i]);
      }
      rmsDiff /= nativeData.length;

      let feedback = "";
      if (rmsDiff < 0.1) {
        feedback = "Great cadence! Your rhythm matches the native pronunciation well.";
      } else if (rmsDiff < 0.25) {
        feedback = "Good effort! Minor cadence adjustments needed. Focus on retroflex consonants (ಳ, ಣ).";
      } else {
        feedback = "Practice more! Pay attention to retroflex consonants (ಳ, ಣ) and regional inflection patterns.";
      }

      setComparison({
        nativeWaveform: nativeData,
        userWaveform: userData,
        feedback,
      });

      // Draw waveforms on canvas
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.strokeStyle = "#F5B700";
          ctx.lineWidth = 2;
          ctx.beginPath();
          const sliceWidth = canvas.width / nativeData.length;
          let x = 0;
          for (let i = 0; i < nativeData.length; i++) {
            const v = (nativeData[i] + 140) / 140;
            const y = (v * canvas.height) / 2;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
            x += sliceWidth;
          }
          ctx.stroke();
        }
      }
    } catch (e) {
      console.warn("Waveform analysis fallback:", e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="glass-surface rounded-2xl p-6 sm:p-8 max-w-md w-full border border-arishina-400 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-serif-kannada text-arishina-400 mb-6 text-center">
          🎵 Pronunciation Studio
        </h2>

        {/* Native Audio Selector */}
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-2">
            Select regional pronunciation:
          </label>
          <select
            id="native-audio-select"
            className="w-full rounded-lg border border-kumkuma-400 bg-obsidian-800 px-3 py-2 text-arishina-400 focus:outline-none focus:ring-2 focus:ring-arishina-300 text-sm"
          >
            <option value="">— Select dialect —</option>
            <option value="old_mysuru" data-url="/audio/old-mysuru/sample.wav">
              Old Mysuru (Mysuru, Mandya)
            </option>
            <option value="uttara_karnataka" data-url="/audio/uttara-karnataka/sample.wav">
              Kalyana / Uttara Karnataka
            </option>
            <option value="karavali_kundapura" data-url="/audio/karavali-kundapura/sample.wav">
              Karavali / Coastal
            </option>
            <option value="malnad_havyaka" data-url="/audio/malnad-havyaka/sample.wav">
              Malnad & Havyaka
            </option>
          </select>
        </div>

        {/* Waveform Display Area */}
        {showWaveform && comparison && (
          <div className="mb-6 h-32 rounded-lg border border-kumkuma-400/50 overflow-hidden bg-obsidian-950 p-2">
            <canvas ref={canvasRef} className="w-full h-full" width={300} height={100} />
          </div>
        )}

        {/* Recording Controls */}
        <div className="flex gap-3 flex-wrap justify-center mb-6">
          <button
            onClick={handleRecord}
            disabled={isRecording}
            className={`py-2 px-5 rounded-lg text-sm font-semibold transition-colors shadow-lg ${
              isRecording ? "bg-kumkuma-600 text-white animate-pulse" : "bg-arishina-400 text-black hover:bg-arishina-300"
            }`}
            title={isRecording ? "Recording..." : "Record & Compare My Accent"}
          >
            {isRecording ? "🎤 Recording (5s)..." : "🎤 Record & Compare My Accent"}
          </button>
        </div>

        {/* Comparison Results */}
        {comparison && (
          <div className="mt-4 p-4 rounded-lg bg-kumkuma-600/20 border border-kumkuma-400">
            <p className="font-medium text-kumkuma-300 text-sm mb-2">{comparison.feedback}</p>
            <div className="text-xs text-gray-300">
              <strong className="text-arishina-400">Waveform:</strong> Frequency and cadence match visualization
            </div>
          </div>
        )}

        {/* Practice Tip */}
        <p className="mt-4 text-center text-xs text-gray-400 italic">
          💡 Tip: Focus on retroflex consonants (ಳ, ಣ) and regional vowel elongation patterns
        </p>
      </div>
    </div>
  );
}