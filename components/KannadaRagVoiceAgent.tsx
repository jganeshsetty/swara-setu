"use client";

import { useState, useRef, useEffect } from "react";
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  Bot,
  ChevronUp,
  ChevronDown,
  RefreshCw,
  HelpCircle,
  CornerDownLeft,
  X,
  Radio,
  CheckCircle2,
  MapPin,
} from "lucide-react";

import {
  detectLocationFromText,
  dispatchAgentLocationHighlight,
  subscribeMapDistrictSelect,
  type MapDistrictSelectEvent,
} from "@/lib/agentMapSync";

interface RagResponse {
  answer?: string;
  error?: string;
}

const KANNADA_SAMPLE_PROMPTS = [
  "ಹೇಗಿದ್ದೀರಿ ಎಂದು ಉತ್ತರ ಕಲ್ಯಾಣದಲ್ಲಿ ಹೇಗೆ ಕೇಳುತ್ತಾರೆ?",
  "ಮಳೆ ಬಾರದಿದ್ದರೆ ಬೆಳೆ ಏನಾಗುತ್ತದೆ?",
  "ಈರುಳ್ಳಿ ಮತ್ತು ಟೊಮ್ಯಾಟೊ ಬೆಲೆ ಹೆಚ್ಚಾಗಿದೆಯೇ?",
  "ಎಲ್ಲಿಗೆ ಹೋಗುತ್ತಿದ್ದೀರಿ ಎಂದು ತುಂಗಭದ್ರಾ ತೀರದಲ್ಲಿ ಹೇಗೆ ಹೇಳುತ್ತಾರೆ?",
  "ಕರಾವಳಿ ಕನ್ನಡದಲ್ಲಿ ನೀರುಳ್ಳಿ ಬೆಲೆ ಬಗ್ಗೆ ಏನು ಹೇಳಿದ್ದಾರೆ?",
];

export default function KannadaRagVoiceAgent() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState<Array<{ role: "user" | "assistant"; text: string }>>([
    {
      role: "assistant",
      text: "ನಮಸ್ಕಾರ! ನಾನು ಸ್ವರಸೇತು AI ಸಹಾಯಕ (Swara-Setu RAG). ಕರ್ನಾಟಕದ ೧೦ ಪ್ರಾದೇಶಿಕ ಉಪಭಾಷೆಗಳು ಮತ್ತು ವಾಕ್ಯಗಳ ಬಗ್ಗೆ ನೀವು ಕನ್ನಡದಲ್ಲಿ ಧ್ವನಿಯ ಮೂಲಕ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ ಪ್ರಶ್ನಿಸಬಹುದು.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [serverOnline, setServerOnline] = useState<boolean | null>(null);
  const [backendUrl, setBackendUrl] = useState("http://localhost:8000");

  const [agentStatusText, setAgentStatusText] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedRegionCode, setSelectedRegionCode] = useState<string | null>(null);
  const [selectedRegionName, setSelectedRegionName] = useState<string | null>(null);

  // Subscribe to Map clicks to lock RAG search to selected region
  useEffect(() => {
    const unsubscribe = subscribeMapDistrictSelect((data: MapDistrictSelectEvent) => {
      setSelectedDistrict(data.district);
      setSelectedRegionCode(data.regionCode);
      setSelectedRegionName(data.regionNameKannada || data.district);
    });
    return () => unsubscribe();
  }, []);

  const recognitionRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll messages when expanded
  useEffect(() => {
    if (isExpanded) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation, isExpanded, isLoading]);

  // Check backend server status
  useEffect(() => {
    let active = true;
    const checkHealth = async () => {
      try {
        const res = await fetch(`${backendUrl}/health`, { method: "GET", signal: AbortSignal.timeout(2000) });
        if (active) {
          setServerOnline(res.ok);
        }
      } catch {
        if (active) setServerOnline(false);
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 8000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [backendUrl]);

  // Stop any active audio
  const stopSpeaking = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setAgentStatusText("");
  };

  // Kannada Speech Recognition Setup (Web Speech API)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "kn-IN";

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => setIsListening(false);
        recognition.onresult = (event: any) => {
          const transcript = event.results[0]?.[0]?.transcript;
          if (transcript) {
            setQuestion(transcript);
            handleSubmit(transcript);
          }
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleVoiceListening = () => {
    if (!recognitionRef.current) {
      alert("ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ Web Speech API ಬೆಂಬಲ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು Chrome ಅಥವಾ Edge ಬಳಸಿ.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Kannada Text to Speech (Neural /api/speak with SpeechSynthesis fallback)
  const speakKannada = async (text: string) => {
    if (!text || !text.trim()) return;

    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    stopSpeaking();
    setIsSpeaking(true);
    setAgentStatusText("ಮಾತನಾಡುತ್ತಿದೆ (Speaking)...");

    const fallbackWebSpeech = () => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        setIsSpeaking(false);
        setAgentStatusText("");
        return;
      }

      window.speechSynthesis.cancel();
      const cleanSpeechText = text
        .replace(/[•*#_"`]/g, "")
        .replace(/\(.*?\)/g, "")
        .replace(/ಇಂಗ್ಲಿಷ್ ಅರ್ಥ:.*$/gm, "")
        .replace(/English:.*$/gm, "")
        .replace(/\s+/g, " ")
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanSpeechText || text);
      utterance.lang = "kn-IN";
      utterance.rate = 0.93;

      const voices = window.speechSynthesis.getVoices();
      const kannadaVoice = voices.find((v) => v.lang.includes("kn") || v.lang.toLowerCase().includes("kannada"));
      if (kannadaVoice) utterance.voice = kannadaVoice;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setAgentStatusText("ಮಾತನಾಡುತ್ತಿದೆ (Speaking)...");
      };
      utterance.onend = () => {
        setIsSpeaking(false);
        setAgentStatusText("");
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        setAgentStatusText("");
      };

      window.speechSynthesis.speak(utterance);
    };

    try {
      const res = await fetch("/api/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice: "kn-IN-SapnaNeural" }),
      });

      if (!res.ok) {
        fallbackWebSpeech();
        return;
      }

      const blob = await res.blob();
      if (!blob || blob.size === 0) {
        fallbackWebSpeech();
        return;
      }

      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioPlayerRef.current = audio;

      audio.onended = () => {
        setIsSpeaking(false);
        setAgentStatusText("");
        URL.revokeObjectURL(url);
        audioPlayerRef.current = null;
      };

      audio.onerror = () => {
        URL.revokeObjectURL(url);
        audioPlayerRef.current = null;
        fallbackWebSpeech();
      };

      await audio.play();
    } catch {
      fallbackWebSpeech();
    }
  };

  const handleSubmit = async (queryText?: string) => {
    const q = (queryText || question).trim();
    if (!q || isLoading) return;

    setQuestion("");
    setIsExpanded(true);
    setConversation((prev) => [...prev, { role: "user", text: q }]);
    setIsLoading(true);
    setAgentStatusText("ಉತ್ತರ ಹುಡುಕಲಾಗುತ್ತಿದೆ (Querying RAG)...");

    try {
      const payload: Record<string, any> = { question: q };
      if (selectedDistrict) payload.district = selectedDistrict;
      if (selectedRegionCode) payload.region = selectedRegionCode;

      const response = await fetch(`${backendUrl}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: RagResponse = await response.json();

      if (data.answer) {
        setConversation((prev) => [...prev, { role: "assistant", text: data.answer! }]);
        
        // Agent-to-Map real-time synchronization
        const detectedLoc = detectLocationFromText(data.answer) || detectLocationFromText(q);
        if (detectedLoc) {
          dispatchAgentLocationHighlight(detectedLoc);
        }

        speakKannada(data.answer);
      } else if (data.error) {
        setConversation((prev) => [
          ...prev,
          {
            role: "assistant",
            text: `ದೋಷ (Error): ${data.error}`,
          },
        ]);
      } else {
        setConversation((prev) => [
          ...prev,
          {
            role: "assistant",
            text: "ಕ್ಷಮಿಸಿ, ದತ್ತಾಂಶದಲ್ಲಿ ಉತ್ತರ ಲಭ್ಯವಿಲ್ಲ.",
          },
        ]);
      }
    } catch {
      setConversation((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `ಸರ್ವರ್ ಸಂಪರ್ಕ ವಿಫಲವಾಗಿದೆ (Server Offline). ದಯವಿಟ್ಟು ಬ್ಯಾಕೆಂಡ್ ಸರ್ವರ್ ಚಾಲನೆ ಮಾಡಿ:\n\ncd backend\n.\\venv\\Scripts\\uvicorn.exe app:app --reload`,
        },
      ]);
    } finally {
      setIsLoading(false);
      setAgentStatusText("");
    }
  };

  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-40 flex flex-col items-center pointer-events-none px-3 sm:px-6 pb-2 sm:pb-3 transition-all duration-300 ${
        selectedDistrict
          ? "opacity-0 translate-y-12 pointer-events-none"
          : "opacity-100 translate-y-0"
      }`}
    >
      {/* Container: Human-crafted glassmorphism matching Swara-Setu Karnataka aesthetic */}
      <div className="w-full max-w-3xl pointer-events-auto flex flex-col rounded-3xl bg-white/80 dark:bg-stone-900/85 backdrop-blur-2xl border border-stone-200/90 dark:border-stone-700/70 shadow-[0_16px_50px_rgba(0,0,0,0.22)] overflow-hidden transition-all duration-300">
        
        {/* Expandable Chat Drawer */}
        {isExpanded && (
          <div className="flex flex-col h-[320px] sm:h-[380px] border-b border-stone-200/80 dark:border-stone-800">
            {/* Drawer Top Header */}
            <div className="px-4 py-2.5 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border-b border-stone-200/60 dark:border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#FF5F03] to-amber-400 flex items-center justify-center text-white shadow-xs">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <span className="font-serif font-bold text-xs text-stone-900 dark:text-stone-100">
                  ಸ್ವರಸೇತು RAG ಸಂವಾದ (Kannada AI Assistant)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300/70">
                  ಸ್ವರಸೇತು AI
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {isSpeaking && (
                  <button
                    onClick={stopSpeaking}
                    className="p-1 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-[11px] flex items-center gap-1"
                    title="ಧ್ವನಿ ನಿಲ್ಲಿಸಿ"
                  >
                    <VolumeX className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">ನಿಲ್ಲಿಸಿ</span>
                  </button>
                )}
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1.5 rounded-xl hover:bg-stone-200/70 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400 hover:text-stone-900 transition-colors"
                  title="ಚಿಕ್ಕದಾಗಿಸಿ"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Prompt Pill Carousel */}
            <div className="px-3.5 py-1.5 bg-stone-100/50 dark:bg-stone-950/40 border-b border-stone-200/50 dark:border-stone-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold shrink-0">ಉದಾಹರಣೆ:</span>
              {KANNADA_SAMPLE_PROMPTS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuestion(q);
                    handleSubmit(q);
                  }}
                  className="text-[10px] whitespace-nowrap bg-white/90 dark:bg-stone-800/90 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-stone-700 dark:text-stone-300 hover:text-amber-900 dark:hover:text-amber-200 px-2.5 py-1 rounded-full border border-stone-200 dark:border-stone-700 transition-all shadow-2xs"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Message Stream */}
            <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3 text-xs">
              {conversation.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-6 h-6 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-amber-500 via-[#FF5F03] to-red-600 text-white rounded-br-xs shadow-sm font-medium"
                        : "bg-white dark:bg-stone-800/90 text-stone-800 dark:text-stone-100 border border-stone-200/80 dark:border-stone-700 rounded-bl-xs shadow-2xs"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    {msg.role === "assistant" && (
                      <button
                        onClick={() => speakKannada(msg.text)}
                        className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>ಆಲಿಸಿ (Listen)</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs py-1">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
                  <span className="font-serif">
                    {agentStatusText || "ಉತ್ತರ ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ (Processing query)..."}
                  </span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {/* Active Regional Pre-Filter Indicator */}
        {selectedDistrict && (
          <div className="mx-2.5 mt-1.5 px-3 py-1 rounded-xl bg-amber-500/15 dark:bg-amber-400/15 border border-amber-500/30 flex items-center justify-between text-[11px] text-amber-950 dark:text-amber-200">
            <div className="flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span>
                ಪ್ರಾದೇಶಿಕ ಶೋಧನೆ: <strong>{selectedRegionName || selectedDistrict}</strong> ({selectedDistrict})
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedDistrict(null);
                setSelectedRegionCode(null);
                setSelectedRegionName(null);
              }}
              className="p-0.5 rounded-full hover:bg-amber-500/25 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
              title="ಫಿಲ್ಟರ್ ತೆರವುಗೊಳಿಸಿ (Clear filter)"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Persistent Bottom Bar with Kannada Voice + Enter Buttons */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="p-2 sm:p-2.5 flex items-center gap-2"
        >
          {/* Collapse/Expand Toggle Pill */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "ಚಿಕ್ಕದಾಗಿಸಿ" : "ಸಂವಾದ ವೀಕ್ಷಿಸಿ"}
            className="flex items-center gap-1 px-2.5 py-2 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors text-[11px] font-serif shrink-0 border border-stone-200 dark:border-stone-700"
          >
            <div className="relative">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span
                className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
                  serverOnline ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                }`}
              />
            </div>
            <span className="font-semibold hidden sm:inline">ಸ್ವರಸೇತು AI</span>
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>

          {/* Voice Input Button */}
          <button
            type="button"
            onClick={toggleVoiceListening}
            title={isListening ? "ಧ್ವನಿ ನಿಲ್ಲಿಸಿ (Stop)" : "ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ (Speak Kannada)"}
            className={`p-2.5 rounded-2xl transition-all duration-200 shrink-0 ${
              isListening
                ? "bg-red-600 text-white shadow-md animate-pulse ring-2 ring-red-400"
                : "bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800"
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Text Input */}
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onFocus={() => {
                if (conversation.length > 1) setIsExpanded(true);
              }}
              placeholder={
                isListening
                  ? "ಧ್ವನಿಯನ್ನು ಆಲಿಸಲಾಗುತ್ತಿದೆ... ಮಾತನಾಡಿ (Listening in Kannada...)"
                  : "ಕನ್ನಡದಲ್ಲಿ ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಿ ಅಥವಾ ಮಾತನಾಡಿ..."
              }
              className="w-full bg-stone-100/90 dark:bg-stone-950/80 border border-stone-300/80 dark:border-stone-700/80 focus:border-amber-500 dark:focus:border-amber-400 rounded-2xl px-3.5 py-2 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden transition-all"
            />
            {question && (
              <button
                type="button"
                onClick={() => setQuestion("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Enter / Send Button */}
          <button
            type="submit"
            disabled={isLoading || !question.trim()}
            title="ಕಳುಹಿಸಿ (Enter)"
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 via-[#FF5F03] to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-bold text-xs shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 active:scale-95 cursor-pointer"
          >
            <span className="font-serif hidden sm:inline">ಕೇಳಿ</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
