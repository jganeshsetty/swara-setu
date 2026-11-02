"use client";

import { useEffect, useRef, useState, useTransition, useMemo } from "react";
import { geoMercator, geoPath } from "d3-geo";
import type { FeatureCollection, Geometry } from "geojson";
import { Play, Volume2, X, Compass, Sparkles, MapPin, ChevronRight, ChevronLeft, Layers, RotateCcw, ZoomIn, ZoomOut, Info, BookOpen, MousePointer, HelpCircle, Users, Landmark, Languages, Radio, CheckCircle2 } from "lucide-react";

import { DISTRICT_TO_REGION_MAP, KANNADA_DISTRICT_NAMES } from "@/lib/districtMapping";
import { dispatchMapDistrictSelect } from "@/lib/agentMapSync";
import { STATIC_REGION_MAP, STATIC_REGIONS_LIST } from "@/lib/staticRegionData";
import RegionBentoOverlay from "./RegionBentoOverlay";

export interface RegionData {
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

export default function KarnatakaMap3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapSvgGroupRef = useRef<SVGGElement>(null);

  // GeoJSON & Regions state
  const [geoData, setGeoData] = useState<FeatureCollection<Geometry> | null>(null);
  const [regionsList, setRegionsList] = useState<RegionData[]>(STATIC_REGIONS_LIST);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [hoveredDistrictName, setHoveredDistrictName] = useState<string | null>(null);
  const [activeRegionData, setActiveRegionData] = useState<RegionData | null>(null);
  const [clickedDistrict, setClickedDistrict] = useState<string | null>(null);
  const [clickOrigin, setClickOrigin] = useState<{ x: number; y: number } | null>(null);
  const [isLoadingSentences, setIsLoadingSentences] = useState(false);
  const [playingSentenceText, setPlayingSentenceText] = useState<string | null>(null);

  // Side parts card hide/see controls with arrow buttons (collapsed by default on mobile for clean UX)
  const [isGuideVisible, setIsGuideVisible] = useState(false);
  const [isZoomControlsVisible, setIsZoomControlsVisible] = useState(false);

  // 3D rotation & isometric angle state
  // Carefully calibrated dynamic presentation angle:
  // rotateX: 20deg (tilts surface towards viewer to show dramatic 3D thickness and bevel cliffs)
  // rotateY: -14deg (natural diagonal slant making the map look artistic and gallery-grade)
  // rotateZ: -2.5deg (slight counter-clockwise tilt creating a striking editorial angle)
  const isDraggingRef = useRef(false);
  const dragDistanceRef = useRef(0);
  const previousPosRef = useRef({ x: 0, y: 0 });
  const rotationRef = useRef({ x: 20, y: -14, z: -2.5 });
  // Default scale at 1.0x - fully visible on screen without forced overflow
  const scaleRef = useRef(1.0);
  const [currentScale, setCurrentScale] = useState(1.0);
  const initialPinchDistRef = useRef<number | null>(null);
  const initialScaleRef = useRef(1.0);
  const [isGrabbing, setIsGrabbing] = useState(false);

  const [, startTransition] = useTransition();

  // 1. Fetch GeoJSON and Region Definitions
  useEffect(() => {
    fetch("/karnataka_districts.geojson")
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error("Error loading karnataka_districts.geojson:", err));

    fetch("/api/regions")
      .then((res) => res.json())
      .then((data) => {
        if (data.regions) {
          setRegionsList(data.regions);
        }
      })
      .catch((err) => console.error("Error fetching regions from /api/regions:", err));
  }, []);

  // 2. Project GeoJSON into SVG Paths via D3 Geo
  const projectedDistricts = useMemo(() => {
    if (!geoData) return [];

    const projection = geoMercator().fitSize([800, 1000], geoData);
    const pathGenerator = geoPath().projection(projection);

    return geoData.features.map((feature, index) => {
      const districtName = (feature.properties as any)?.district || `District-${index}`;
      const pathD = pathGenerator(feature) || "";
      const [cx, cy] = pathGenerator.centroid(feature) || [0, 0];
      const regionCode = DISTRICT_TO_REGION_MAP[districtName] || "kaveri_basin";

      return {
        id: districtName,
        districtName,
        kannadaName: KANNADA_DISTRICT_NAMES[districtName] || districtName,
        pathD,
        centroid: [cx, cy] as [number, number],
        regionCode,
        centroidY: cy,
      };
    });
  }, [geoData]);

  // 3. Audio Text-to-Speech (kn-IN) - Neural Edge-TTS with SpeechSynthesis fallback
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const playSentence = async (text: string) => {
    if (!text || !text.trim()) return;

    const trimmed = text.trim();

    // Toggle stop if user clicks the button for the currently playing sentence
    if (playingSentenceText === trimmed && audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
      setPlayingSentenceText(null);
      return;
    }

    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setPlayingSentenceText(trimmed);

    const fallbackSpeech = () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        const clean = trimmed
          .replace(/[•*#_"`]/g, "")
          .replace(/\(.*?\)/g, "")
          .replace(/\s+/g, " ")
          .trim();
        const speech = new SpeechSynthesisUtterance(clean || trimmed);
        speech.lang = "kn-IN";
        speech.rate = 0.95;
        const voices = window.speechSynthesis.getVoices();
        const kannadaVoice = voices.find(
          (v) => v.lang.includes("kn") || v.lang.toLowerCase().includes("kannada")
        );
        if (kannadaVoice) speech.voice = kannadaVoice;

        speech.onstart = () => setPlayingSentenceText(trimmed);
        speech.onend = () => setPlayingSentenceText(null);
        speech.onerror = () => setPlayingSentenceText(null);
        window.speechSynthesis.speak(speech);
      } else {
        setPlayingSentenceText(null);
      }
    };

    try {
      const response = await fetch("/api/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed, voice: "kn-IN-SapnaNeural" }),
      });

      if (!response.ok) {
        fallbackSpeech();
        return;
      }

      const blob = await response.blob();
      if (!blob || blob.size === 0) {
        fallbackSpeech();
        return;
      }

      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioPlayerRef.current = audio;

      audio.onended = () => {
        setPlayingSentenceText(null);
        URL.revokeObjectURL(url);
        audioPlayerRef.current = null;
      };

      audio.onerror = () => {
        URL.revokeObjectURL(url);
        audioPlayerRef.current = null;
        fallbackSpeech();
      };

      await audio.play();
    } catch {
      fallbackSpeech();
    }
  };

  const applyTransform = () => {
    if (mapSvgGroupRef.current) {
      mapSvgGroupRef.current.style.transform = `scale(${scaleRef.current}) rotateX(${rotationRef.current.x}deg) rotateY(${rotationRef.current.y}deg) rotateZ(${rotationRef.current.z}deg)`;
    }
  };

  useEffect(() => {
    applyTransform();
  }, []);

  // 4. Mouse Drag & 3D Rotation Event Listeners
  useEffect(() => {
    const rotationSensitivity = 0.45;

    const getDistance = (touch1: Touch, touch2: Touch) => {
      const dx = touch1.clientX - touch2.clientX;
      const dy = touch1.clientY - touch2.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const handleDragStart = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      // Do not initiate map drag if user is touching buttons, inputs, modals, or controls
      if (
        target.closest(".glass-overlay-modal") ||
        target.closest("button") ||
        target.closest("input") ||
        target.closest("aside") ||
        target.closest("header") ||
        target.closest(".pointer-events-auto")
      ) {
        return;
      }

      dragDistanceRef.current = 0;

      if ("touches" in e) {
        if (e.touches.length === 2) {
          initialPinchDistRef.current = getDistance(e.touches[0], e.touches[1]);
          initialScaleRef.current = scaleRef.current;
          isDraggingRef.current = false;
          setIsGrabbing(false);
          return;
        }
        if (e.touches.length === 1) {
          isDraggingRef.current = true;
          setIsGrabbing(true);
          previousPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
      } else {
        isDraggingRef.current = true;
        setIsGrabbing(true);
        previousPosRef.current = { x: e.clientX, y: e.clientY };
      }

      if (mapSvgGroupRef.current) {
        mapSvgGroupRef.current.style.transition = "none";
      }
    };

    const handleDragEnd = (e: MouseEvent | TouchEvent) => {
      if ("touches" in e && e.touches.length === 1) {
        initialPinchDistRef.current = null;
        isDraggingRef.current = true;
        setIsGrabbing(true);
        previousPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        return;
      }

      isDraggingRef.current = false;
      setIsGrabbing(false);
      initialPinchDistRef.current = null;

      if (mapSvgGroupRef.current) {
        mapSvgGroupRef.current.style.transition = "transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)";
      }
    };

    const handleDragMove = (e: MouseEvent | TouchEvent) => {
      if ("touches" in e) {
        if (e.touches.length === 2 && initialPinchDistRef.current !== null) {
          if (e.cancelable) e.preventDefault();
          const currentDist = getDistance(e.touches[0], e.touches[1]);
          const ratio = currentDist / initialPinchDistRef.current;
          // Clamp pinch zoom to comfortable zone: 0.85x to 1.45x
          const newScale = Math.min(1.45, Math.max(0.85, initialScaleRef.current * ratio));
          scaleRef.current = newScale;
          setCurrentScale(newScale);
          applyTransform();
          return;
        }

        if (e.touches.length === 1 && isDraggingRef.current) {
          if (e.cancelable) e.preventDefault();
          const clientX = e.touches[0].clientX;
          const clientY = e.touches[0].clientY;

          const deltaX = clientX - previousPosRef.current.x;
          const deltaY = clientY - previousPosRef.current.y;
          dragDistanceRef.current += Math.abs(deltaX) + Math.abs(deltaY);

          if (dragDistanceRef.current > 4) {
            rotationRef.current.y += deltaX * rotationSensitivity;
            rotationRef.current.x -= deltaY * rotationSensitivity;

            // Clamp 3D rotation strictly between -180 and 180 degrees
            rotationRef.current.x = Math.max(-180, Math.min(180, rotationRef.current.x));
            rotationRef.current.y = Math.max(-180, Math.min(180, rotationRef.current.y));

            applyTransform();
          }
          previousPosRef.current = { x: clientX, y: clientY };
        }
        return;
      }

      if (isDraggingRef.current) {
        const clientX = e.clientX;
        const clientY = e.clientY;

        const deltaX = clientX - previousPosRef.current.x;
        const deltaY = clientY - previousPosRef.current.y;
        dragDistanceRef.current += Math.abs(deltaX) + Math.abs(deltaY);

        rotationRef.current.y += deltaX * rotationSensitivity;
        rotationRef.current.x -= deltaY * rotationSensitivity;

        rotationRef.current.x = Math.max(-180, Math.min(180, rotationRef.current.x));
        rotationRef.current.y = Math.max(-180, Math.min(180, rotationRef.current.y));

        applyTransform();
        previousPosRef.current = { x: clientX, y: clientY };
      }
    };

    // Zoom via mouse wheel - constrained strictly to comfortable zone (0.85x to 1.45x)
    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(".glass-overlay-modal")) return;

      e.preventDefault();
      const zoomFactor = 1 - e.deltaY * 0.0012;
      const newScale = Math.min(1.45, Math.max(0.85, Number((scaleRef.current * zoomFactor).toFixed(2))));
      scaleRef.current = newScale;
      setCurrentScale(newScale);

      if (mapSvgGroupRef.current) {
        mapSvgGroupRef.current.style.transition = "none";
      }
      applyTransform();
    };

    const containerEl = containerRef.current;
    if (!containerEl) return;

    containerEl.addEventListener("mousedown", handleDragStart);
    window.addEventListener("mouseup", handleDragEnd);
    window.addEventListener("mousemove", handleDragMove);
    containerEl.addEventListener("wheel", handleWheel, { passive: false });

    containerEl.addEventListener("touchstart", handleDragStart, { passive: false });
    window.addEventListener("touchend", handleDragEnd);
    window.addEventListener("touchmove", handleDragMove, { passive: false });

    return () => {
      containerEl.removeEventListener("mousedown", handleDragStart);
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("mousemove", handleDragMove);
      containerEl.removeEventListener("wheel", handleWheel);
      containerEl.removeEventListener("touchstart", handleDragStart);
      window.removeEventListener("touchend", handleDragEnd);
      window.removeEventListener("touchmove", handleDragMove);
    };
  }, []);

  // 5. On Click: Dynamically fetch regional dialect data for the clicked district from MongoDB API
  const handleDistrictClick = async (
    districtName: string,
    regionCode: string,
    originCoords?: { x: number; y: number } | null
  ) => {
    if (dragDistanceRef.current > 12) return;

    if (originCoords) {
      setClickOrigin(originCoords);
    }
    setClickedDistrict(districtName);
    setIsLoadingSentences(true);

    dispatchMapDistrictSelect({
      district: districtName,
      regionCode,
      regionNameKannada: KANNADA_DISTRICT_NAMES[districtName] || districtName,
    });

    try {
      // Dynamic query to our RESTful district endpoint
      const res = await fetch(`/api/dialects/${encodeURIComponent(districtName)}`);
      const data = await res.json();

      if (data && data.phrases && data.phrases.length > 0) {
        startTransition(() => {
          setActiveRegionData({
            regionId: data.regionId || regionCode,
            name: data.region?.name || districtName,
            nameKannada:
              data.region?.nameKannada ||
              KANNADA_DISTRICT_NAMES[districtName] ||
              districtName,
            districts: data.region?.districts || [districtName],
            colorClass: data.region?.colorClass || "text-amber-800",
            badgeBg:
              data.region?.badgeBg ||
              "bg-amber-100 text-amber-950 border-amber-300",
            highlightHex: data.region?.highlightHex || "#FFE500",
            description:
              data.region?.description ||
              `${districtName} ಜಿಲ್ಲೆಯ ಅಧಿಕೃತ ಪ್ರಾದೇಶಿಕ ನುಡಿಗಟ್ಟುಗಳು.`,
            phrases: data.phrases,
          });
        });
      } else {
        // Fallback to static region data
        const fallback = STATIC_REGION_MAP[regionCode] || STATIC_REGION_MAP["kaveri_basin"];
        startTransition(() => {
          setActiveRegionData({ ...fallback });
        });
      }
    } catch (err) {
      console.warn("Falling back to local region cache:", err);
      const fallback = STATIC_REGION_MAP[regionCode] || regionsList.find((r) => r.regionId === regionCode) || STATIC_REGION_MAP["kaveri_basin"];
      if (fallback) setActiveRegionData({ ...fallback });
    } finally {
      setIsLoadingSentences(false);
    }
  };

  const setZoomLevel = (newVal: number) => {
    // Comfortable zone: 0.85x to 1.45x
    const clamped = Math.min(1.45, Math.max(0.85, newVal));
    scaleRef.current = clamped;
    setCurrentScale(clamped);
    if (mapSvgGroupRef.current) {
      mapSvgGroupRef.current.style.transition = "transform 0.1s ease-out";
      applyTransform();
    }
  };

  const resetView = () => {
    rotationRef.current = { x: 20, y: -14, z: -2.5 };
    scaleRef.current = 1.0;
    setCurrentScale(1.0);
    if (mapSvgGroupRef.current) {
      mapSvgGroupRef.current.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
      applyTransform();
    }
  };

  const isNorthernDistrict = (centroidY: number) => {
    return centroidY < 600; // North of Davanagere/Chitradurga
  };

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 w-full h-full bg-gradient-to-b from-[#FFFDF2] via-[#FCFBF7] to-[#FFF4F4] flex justify-center items-center overflow-hidden select-none ${
        isGrabbing ? "cursor-grabbing" : "cursor-grab"
      }`}
      style={{
        perspective: "1350px",
        touchAction: "none",
      }}
    >
      {/* ── 1. Top Karnataka Flag Duo-Tone Cultural Stripe ── */}
      <div className="absolute top-0 inset-x-0 h-1.5 z-30 flex shadow-xs pointer-events-none">
        <div className="h-full w-1/2 bg-[#FFE500]" title="ಅರಿಶಿನ (ಹಳದಿ)" />
        <div className="h-full w-1/2 bg-[#D1262B]" title="ಕುಂಕುಮ (ಕೆಂಪು)" />
      </div>

      {/* ── 2. Subtle Ambient Cultural Background Layers ── */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Top Arishina / Golden Yellow Ambient Aura */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] max-w-[98vw] h-[380px] bg-gradient-to-b from-[#FFE500]/16 via-[#F5B700]/7 to-transparent rounded-full blur-3xl" />
        
        {/* Bottom Kumkuma / Vermilion Red Warm Aura */}
        <div className="absolute -bottom-36 left-1/2 -translate-x-1/2 w-[850px] max-w-[98vw] h-[380px] bg-gradient-to-t from-[#D1262B]/12 via-[#E63946]/5 to-transparent rounded-full blur-3xl" />

        {/* Subtle Heritage Dot Grid Matrix */}
        <div className="absolute inset-0 opacity-[0.25] bg-[radial-gradient(#b45309_0.8px,transparent_0.8px)] [background-size:26px_26px]" />
      </div>

      {/* ── 3. Top Header & Info Guide Toggle (Fixed at Top, Never Disturbs Map) ── */}
      {!activeRegionData && (
        <>
          <header className="absolute top-2.5 sm:top-5 left-3 sm:left-6 z-20 pointer-events-auto flex items-center gap-2 sm:gap-3 transition-opacity duration-300">
            <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-amber-400/20 border border-amber-500/40 backdrop-blur-xl flex items-center justify-center text-amber-700 shadow-[0_8px_20px_rgba(255,183,0,0.22)] shrink-0">
              <Compass className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="font-serif text-sm sm:text-lg font-bold text-stone-900 tracking-tight flex items-center gap-1.5">
                  ಸ್ವರಸೇತು
                  <span className="font-sans text-[9px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-[#FFE500] to-[#E63946] text-stone-950 shadow-xs border border-amber-300/80">
                    ನಮ್ಮ ಕನ್ನಡ
                  </span>
                </h1>
              </div>
              <p className="text-[9px] sm:text-[11px] text-stone-600 tracking-wide font-medium hidden xs:block">
                ಪ್ರಾದೇಶಿಕ ಉಪಭಾಷಾ ಪರಿಶೋಧಕ • ತಿರುಗಿಸಲು ಮೌಸ್ / ಟಚ್ ಎಳೆಯಿರಿ
              </p>
            </div>
          </header>

          {/* Right Top Header Actions (Info Guide Button & Hovered Badge) */}
          <div className="absolute top-2.5 sm:top-5 right-3 sm:right-6 z-20 pointer-events-auto flex items-center gap-2">
            {hoveredRegion && (
              <div className="hidden sm:flex backdrop-blur-xl bg-white/90 px-3 py-1.5 rounded-xl border border-amber-300/60 shadow-sm items-center gap-2 animate-in fade-in">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <span className="text-xs font-bold text-stone-900">
                  {KANNADA_DISTRICT_NAMES[hoveredDistrictName || ""] || hoveredDistrictName}
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsGuideVisible(!isGuideVisible)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-2xl backdrop-blur-xl bg-white/90 hover:bg-white text-stone-800 border border-amber-300/60 shadow-[0_4px_16px_rgba(255,183,0,0.18)] text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer"
              title={isGuideVisible ? "ಮಾಹಿತಿ ಮುಚ್ಚಿರಿ" : "ಯೋಜನೆ ಮಾಹಿತಿ ಮತ್ತು ಬಳಕೆ ವಿಧಾನ"}
            >
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
              <span>ಮಾಹಿತಿ (Info)</span>
            </button>
          </div>
        </>
      )}

      {/* ── 4. Mobile Quick Adjust Controls (Compact Pill, Non-Disturbing) ── */}
      {!activeRegionData && (
        <div className="absolute top-14 left-3 z-20 sm:hidden flex items-center gap-1 pointer-events-auto backdrop-blur-xl bg-white/90 border border-amber-300/60 rounded-xl px-2 py-1 shadow-md">
          <button
            type="button"
            onClick={() => setZoomLevel(Number((scaleRef.current - 0.08).toFixed(2)))}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-amber-50 active:bg-amber-200 text-stone-800"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-bold text-stone-700 px-1">
            {Math.round(currentScale * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoomLevel(Number((scaleRef.current + 0.08).toFixed(2)))}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-amber-50 active:bg-amber-200 text-stone-800"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <div className="w-[1px] h-4 bg-stone-300 mx-0.5" />
          <button
            type="button"
            onClick={resetView}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-amber-50 active:bg-amber-200 text-stone-800"
            title="Reset View"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
          </button>
        </div>
      )}

      {/* ── 5. Desktop-Only Left Zoom Slider Bar ── */}
      {!activeRegionData && (
        <div className="hidden sm:flex absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 items-center transition-all duration-300 pointer-events-auto">
          {/* Toggle Arrow Button */}
          <button
            type="button"
            onClick={() => setIsZoomControlsVisible(!isZoomControlsVisible)}
            className={`w-6 h-10 sm:w-7 sm:h-12 rounded-r-xl backdrop-blur-xl bg-white/90 hover:bg-white text-stone-800 border-y border-r border-amber-300/60 shadow-[0_4px_16px_rgba(0,0,0,0.12)] flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer ${
              isZoomControlsVisible ? "order-2 -ml-1" : "order-1 ml-0"
            }`}
            title={isZoomControlsVisible ? "ಜೂಮ್ ಬಾರ್ ಮರೆಮಾಡಿ" : "ಜೂಮ್ ಬಾರ್ ತೋರಿಸಿ"}
            aria-label={isZoomControlsVisible ? "ಜೂಮ್ ಬಾರ್ ಮರೆಮಾಡಿ" : "ಜೂಮ್ ಬಾರ್ ತೋರಿಸಿ"}
          >
            {isZoomControlsVisible ? (
              <ChevronLeft className="w-4 h-4 text-amber-900" />
            ) : (
              <ChevronRight className="w-4 h-4 text-amber-900" />
            )}
          </button>

          {isZoomControlsVisible && (
            <div className="order-1 backdrop-blur-2xl bg-white/85 border border-amber-300/50 shadow-[0_12px_32px_rgba(255,95,3,0.12)] rounded-2xl px-1.5 sm:px-2 py-2.5 sm:py-3 flex flex-col items-center gap-2.5 transition-all duration-300 animate-in fade-in slide-in-from-left-4">
              <button
                type="button"
                onClick={() => setZoomLevel(Number((scaleRef.current + 0.08).toFixed(2)))}
                className="w-6 h-6 rounded-lg bg-amber-50 hover:bg-[#FFE500]/40 text-stone-900 border border-amber-300/60 flex items-center justify-center transition-all hover:scale-105 active:scale-90 shadow-xs cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5 text-stone-900" />
              </button>

              <div className="h-32 sm:h-36 flex items-center justify-center relative">
                <input
                  type="range"
                  min="0.85"
                  max="1.45"
                  step="0.02"
                  value={currentScale}
                  onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                  style={{
                    background: "linear-gradient(to right, #D1262B, #FFE500)",
                  }}
                  className="accent-[#D1262B] cursor-pointer h-1 w-24 sm:w-28 -rotate-90 rounded-full border border-stone-300/40 shadow-inner outline-none transition-all"
                  title={`ಜೂಮ್: ${Math.round(currentScale * 100)}%`}
                />
              </div>

              <button
                type="button"
                onClick={() => setZoomLevel(Number((scaleRef.current - 0.08).toFixed(2)))}
                className="w-6 h-6 rounded-lg bg-amber-50 hover:bg-[#D1262B]/20 text-stone-900 border border-amber-300/60 flex items-center justify-center transition-all hover:scale-105 active:scale-90 shadow-xs cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5 text-stone-900" />
              </button>

              <div className="pt-1 border-t border-amber-200/50 text-[9px] font-bold text-stone-700 tracking-tighter">
                {Math.round(currentScale * 100)}%
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── 6. Desktop-Only Floating View Reset Control (Bottom-Left) ── */}
      {!activeRegionData && (
        <div className="hidden sm:flex absolute bottom-4 sm:bottom-6 left-3 sm:left-6 z-20 items-center gap-2 transition-all duration-300 pointer-events-auto">
          <button
            type="button"
            onClick={resetView}
            className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl backdrop-blur-xl bg-white/80 hover:bg-white border border-amber-300/50 shadow-[0_8px_25px_rgba(0,0,0,0.08)] text-xs font-bold text-stone-800 transition-all flex items-center gap-1.5 sm:gap-2 hover:scale-105 active:scale-95 cursor-pointer"
            title="ಕೋನ ಮರುಹೊಂದಿಸಿ"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
            <span>ಕೋನ ಮರುಹೊಂದಿಸಿ (Reset)</span>
          </button>
        </div>
      )}

      {/* ── 7. Responsive Info Guide: Side Drawer on Desktop, Slide-Up Sheet on Mobile ── */}
      {!activeRegionData && isGuideVisible && (
        <div className="fixed inset-0 z-50 pointer-events-none flex sm:justify-end items-end sm:items-center p-0 sm:p-6 sm:pr-8">
          {/* Mobile Backdrop */}
          <div
            className="sm:hidden absolute inset-0 bg-black/40 backdrop-blur-xs pointer-events-auto"
            onClick={() => setIsGuideVisible(false)}
          />

          <aside className="pointer-events-auto w-full sm:w-80 max-h-[82vh] sm:max-h-[86vh] flex flex-col transition-all duration-300 animate-in fade-in slide-in-from-bottom sm:slide-in-from-right-4 z-10">
            <div className="backdrop-blur-2xl bg-white/95 sm:bg-white/90 border border-amber-200/80 shadow-[0_16px_50px_rgba(0,0,0,0.20)] rounded-t-3xl sm:rounded-3xl p-4 sm:p-5 flex flex-col gap-3 sm:gap-4 text-stone-800 overflow-y-auto drawer-scrollbar">
              {/* Header Badge & Close Button */}
              <div className="flex items-center justify-between border-b border-stone-200/70 pb-2.5 sm:pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-[#FFE500] to-[#D1262B] flex items-center justify-center text-stone-950 shadow-xs shrink-0">
                    <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xs sm:text-sm font-bold text-stone-900">
                      ಸ್ವರಸೇತು ಪರಿಚಯ
                    </h2>
                    <p className="text-[9px] sm:text-[10px] text-stone-600 font-medium">
                      ಕರ್ನಾಟಕ ಉಪಭಾಷಾ ಸಂಶೋಧಕ
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsGuideVisible(false)}
                  className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-all cursor-pointer"
                  title="ಮುಚ್ಚಿರಿ (Close)"
                  aria-label="ಮುಚ್ಚಿರಿ"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* About the Project */}
              <div className="space-y-1 sm:space-y-1.5">
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-amber-950">
                  <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-600" />
                  <span>ಈ ಯೋಜನೆಯ ಬಗ್ಗೆ (About)</span>
                </div>
                <p className="text-[11px] sm:text-xs text-stone-700 leading-relaxed font-normal bg-amber-50/50 p-2 sm:p-2.5 rounded-xl border border-amber-200/50">
                  <strong className="text-stone-900">ಸ್ವರಸೇತು</strong> ಕರ್ನಾಟಕದ ೧೦ ಸಾಂಸ್ಕೃತಿಕ ಪ್ರಾದೇಶಿಕ ನುಡಿಗಟ್ಟುಗಳನ್ನು, ಪ್ರಮಾಣಿತ ಪಠ್ಯಪುಸ್ತಕ ರೂಪದೊಂದಿಗೆ ಹೋಲಿಸಿ ಅನ್ವೇಷಿಸುವ ಕಲಾವಂತ ೩ಡಿ ಸಂವಾದಾತ್ಮಕ ವೇದಿಕೆ.
                </p>
              </div>

              {/* How to Use Step-by-Step */}
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-stone-900">
                  <MousePointer className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-600" />
                  <span>ಬಳಸುವುದು ಹೇಗೆ? (How to Use)</span>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  {/* Step 1 */}
                  <div className="flex items-start gap-2 p-1.5 sm:p-2 rounded-xl bg-amber-50/60 border border-amber-200/60">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#FFE500] text-stone-950 flex items-center justify-center text-[9px] sm:text-[10px] font-bold shrink-0 mt-0.5 shadow-xs">
                      ೧
                    </div>
                    <div className="text-[10px] sm:text-[11px] leading-snug">
                      <strong className="text-stone-900">ಜಿಲ್ಲೆಯ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ:</strong>
                      <p className="text-stone-600 mt-0.5">
                        ಭೂಪಟದಲ್ಲಿ ಯಾವುದೇ ಭಾಗವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ ೩೦ ಅಧಿಕೃತ ಆಡುಭಾಷೆಯ ವಾಕ್ಯಗಳ ವಿಂಡೋ ತೆರೆಯಿರಿ.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-start gap-2 p-1.5 sm:p-2 rounded-xl bg-rose-50/60 border border-rose-200/60">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#D1262B] text-white flex items-center justify-center text-[9px] sm:text-[10px] font-bold shrink-0 mt-0.5 shadow-xs">
                      ೨
                    </div>
                    <div className="text-[10px] sm:text-[11px] leading-snug">
                      <strong className="text-stone-900">೩ಡಿ ಕೋನ ತಿರುಗಿಸಿ (±೧೮೦°):</strong>
                      <p className="text-stone-600 mt-0.5">
                        ಮೌಸ್ ಎಳೆದು ಅಥವಾ ಮೊಬೈಲ್ ಪರದೆ ಮೇಲೆ ಬೆರಳಾಡಿಸಿ ಮೂರು ಆಯಾಮದ ಮೇಲ್ಮೈ ವೀಕ್ಷಿಸಿ.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-start gap-2 p-1.5 sm:p-2 rounded-xl bg-amber-50/60 border border-amber-200/60">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#FFE500] text-stone-950 flex items-center justify-center text-[9px] sm:text-[10px] font-bold shrink-0 mt-0.5 shadow-xs">
                      ೩
                    </div>
                    <div className="text-[10px] sm:text-[11px] leading-snug">
                      <strong className="text-stone-900">ಆಡಿಯೋ ಧ್ವನಿ ಆಲಿಸಿ:</strong>
                      <p className="text-stone-600 mt-0.5">
                        ವಾಕ್ಯಗಳ ಪಕ್ಕದಲ್ಲಿರುವ <strong>ಆಲಿಸಿ</strong> ಗುಂಡಿ ಒತ್ತಿ ನೇಟಿವ್ ಕನ್ನಡ ಉಚ್ಚಾರಣೆಯನ್ನು ಆಲಿಸಿ.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cultural Palette Badge Footer */}
              <div className="pt-2 border-t border-stone-200/70 flex items-center justify-between text-[9px] sm:text-[10px] text-stone-600">
                <span className="flex items-center gap-1 font-semibold text-stone-700">
                  <span className="w-2 h-2 rounded-full bg-[#FFE500] border border-amber-400" />
                  ಉತ್ತರ: ಅರಿಶಿನ (ಹಳದಿ)
                </span>
                <span className="flex items-center gap-1 font-semibold text-stone-700">
                  <span className="w-2 h-2 rounded-full bg-[#D1262B]" />
                  ದಕ್ಷಿಣ: ಕುಂಕುಮ (ಕೆಂಪು)
                </span>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* 3D Map SVG Canvas */}
      <div
        className="w-full h-full flex justify-center items-center"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {!geoData ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <p className="font-serif text-sm font-semibold text-stone-800">
              ಕಲಾವಂತ ೩ಡಿ ಕರ್ನಾಟಕ ಭೂಪಟ ಸಿದ್ಧವಾಗುತ್ತಿದೆ...
            </p>
          </div>
        ) : (
          <svg
            viewBox="0 0 800 1000"
            className="max-w-[90vw] max-h-[94vh]"
            style={{
              transformStyle: "preserve-3d",
              overflow: "visible",
            }}
          >
            <defs>
              {/* 1. Ambient Ground Shadow */}
              <radialGradient id="plateauGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#1A0D08" stopOpacity="0.35" />
                <stop offset="50%" stopColor="#2E170E" stopOpacity="0.18" />
                <stop offset="85%" stopColor="#3D2012" stopOpacity="0.04" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>

              {/* 2. Shiny Glossy Bright Yellow Gradient (North) - #FFFF00 */}
              <linearGradient id="glossyYellow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
                <stop offset="14%" stopColor="#FFFF66" />
                <stop offset="35%" stopColor="#FFFF00" />
                <stop offset="85%" stopColor="#FFFF00" />
                <stop offset="100%" stopColor="#E6E600" />
              </linearGradient>

              {/* 3. Shiny Glossy Bright Red/Orange-Red Gradient (South) - #FF5F03 */}
              <linearGradient id="glossyRed" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFA673" stopOpacity="0.80" />
                <stop offset="14%" stopColor="#FF7A29" />
                <stop offset="35%" stopColor="#FF5F03" />
                <stop offset="85%" stopColor="#FF5F03" />
                <stop offset="100%" stopColor="#D94800" />
              </linearGradient>

              {/* 4. Active Region Ultra-Luminous Yellow Glow Shader */}
              <linearGradient id="activeGlowYellow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="30%" stopColor="#FFFF80" />
                <stop offset="70%" stopColor="#FFFF00" />
                <stop offset="100%" stopColor="#FFE600" />
              </linearGradient>

              {/* 5. Active Region Ultra-Luminous Red/Orange-Red Glow Shader */}
              <linearGradient id="activeGlowRed" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="25%" stopColor="#FF8540" />
                <stop offset="65%" stopColor="#FF5F03" />
                <stop offset="100%" stopColor="#E65200" />
              </linearGradient>

              {/* 6. Realistic 3D Glow Filter */}
              <filter id="karnataka3DGlow" x="-25%" y="-25%" width="150%" height="150%">
                <feGaussianBlur stdDeviation="8" result="blurGlow" />
                <feMerge>
                  <feMergeNode in="blurGlow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* 7. Hover Active Raised Shadow */}
              <filter id="raisedTileShadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="16" stdDeviation="12" floodColor="#000000" floodOpacity="0.55" />
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#FFFF00" floodOpacity="0.50" />
              </filter>

              {/* 8. Synchronized Agent Radar Ping Glow */}
              <filter id="agentActiveRadarGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* 3D Rotating Transform Group */}
            <g
              ref={mapSvgGroupRef}
              style={{
                transformStyle: "preserve-3d",
                transformOrigin: "400px 500px",
              }}
            >
              {/* Ambient Ground Shadow Floor */}
              <ellipse
                cx="400"
                cy="560"
                rx="390"
                ry="460"
                fill="url(#plateauGlow)"
                style={{
                  transform: "translateZ(-48px)",
                }}
              />

              {/* Ambient Warm Base Glow Halo using exact colors */}
              <g
                opacity="0.52"
                filter="url(#karnataka3DGlow)"
                style={{
                  transform: "translate3d(0px, 12px, -36px)",
                }}
              >
                {projectedDistricts.map((d) => (
                  <path
                    key={`halo-${d.id}`}
                    d={d.pathD}
                    fill={isNorthernDistrict(d.centroidY) ? "#FFFF00" : "#FF5F03"}
                  />
                ))}
              </g>

              {/* ── 3D THICKNESS LAYERS (Deep Extruded Cliffs) ── */}

              {/* Layer 7: Deep Ground Shadow (-36px) */}
              <g
                opacity="0.38"
                style={{
                  transform: "translate3d(22px, 38px, -36px)",
                  filter: "blur(7px)",
                }}
              >
                {projectedDistricts.map((d) => (
                  <path key={`ext7-${d.id}`} d={d.pathD} fill="#050302" />
                ))}
              </g>

              {/* Layer 6: Deep Base Cliff (-30px) */}
              <g style={{ transform: "translate3d(18px, 30px, -30px)" }}>
                {projectedDistricts.map((d) => (
                  <path key={`ext6-${d.id}`} d={d.pathD} fill="#120A07" stroke="#000000" strokeWidth="1.6" />
                ))}
              </g>

              {/* Layer 5: Lower Cliff Wall (-24px) */}
              <g style={{ transform: "translate3d(14px, 24px, -24px)" }}>
                {projectedDistricts.map((d) => (
                  <path key={`ext5-${d.id}`} d={d.pathD} fill="#24140C" stroke="#000000" strokeWidth="1.5" />
                ))}
              </g>

              {/* Layer 4: Mid-Low Cliff Wall (-18px) */}
              <g style={{ transform: "translate3d(10px, 18px, -18px)" }}>
                {projectedDistricts.map((d) => (
                  <path key={`ext4-${d.id}`} d={d.pathD} fill="#381D10" stroke="#000000" strokeWidth="1.5" />
                ))}
              </g>

              {/* Layer 3: Mid Cliff Wall (-12px) */}
              <g style={{ transform: "translate3d(7px, 12px, -12px)" }}>
                {projectedDistricts.map((d) => (
                  <path key={`ext3-${d.id}`} d={d.pathD} fill="#4F2A17" stroke="#000000" strokeWidth="1.4" />
                ))}
              </g>

              {/* Layer 2: Upper Bevel Wall (-6px) */}
              <g style={{ transform: "translate3d(4px, 7px, -6px)" }}>
                {projectedDistricts.map((d) => (
                  <path key={`ext2-${d.id}`} d={d.pathD} fill="#69371C" stroke="#000000" strokeWidth="1.3" />
                ))}
              </g>

              {/* Layer 1: Rim Edge Highlight (-2px) */}
              <g style={{ transform: "translate3d(1.5px, 2.5px, -2px)" }}>
                {projectedDistricts.map((d) => (
                  <path
                    key={`ext1-${d.id}`}
                    d={d.pathD}
                    fill={isNorthernDistrict(d.centroidY) ? "#997300" : "#B33D00"}
                    stroke="#000000"
                    strokeWidth="1.2"
                  />
                ))}
              </g>

              {/* ── TOP SURFACE: Shiny, Glossy 2-Tone District Tiles ── */}
              {projectedDistricts.map((district) => {
                const isRegionActive = hoveredRegion === district.regionCode;
                const isHoveredSingle = hoveredDistrictName === district.districtName;
                const isSelected = activeRegionData?.regionId === district.regionCode;

                const isNorth = isNorthernDistrict(district.centroidY);

                // Pure Shiny 2-Tone Colors:
                // Base: url(#glossyYellow) for North, url(#glossyRed) for South
                // Active cluster on hover: url(#activeGlowYellow) or url(#activeGlowRed)
                let fill = isNorth ? "url(#glossyYellow)" : "url(#glossyRed)";
                if (isRegionActive || isSelected || isHoveredSingle) {
                  fill = isNorth ? "url(#activeGlowYellow)" : "url(#activeGlowRed)";
                }

                return (
                  <g
                    key={district.id}
                    className="transition-all duration-300"
                    style={{
                      transformStyle: "preserve-3d",
                      // Realistic dynamic elevation on hover
                      transform: isRegionActive || isHoveredSingle
                        ? "translate3d(0, -8px, 52px) scale(1.03)"
                        : isSelected
                        ? "translate3d(0, -4px, 30px) scale(1.015)"
                        : "translate3d(0, 0, 0px) scale(1)",
                      filter: isRegionActive || isHoveredSingle
                        ? "url(#raisedTileShadow)"
                        : "none",
                    }}
                    onMouseEnter={() => {
                      setHoveredRegion(district.regionCode);
                      setHoveredDistrictName(district.districtName);
                    }}
                    onMouseLeave={() => {
                      setHoveredRegion(null);
                      setHoveredDistrictName(null);
                    }}
                    onClick={(e) =>
                      handleDistrictClick(district.districtName, district.regionCode, {
                        x: e.clientX,
                        y: e.clientY,
                      })
                    }
                  >
                    {/* Shiny Top Tile Surface with Solid Black Borders */}
                    <path
                      d={district.pathD}
                      fill={fill}
                      stroke="#000000"
                      strokeWidth={isRegionActive ? "2.8" : isHoveredSingle ? "2.4" : "1.8"}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      className="cursor-pointer transition-all duration-200"
                      style={{
                        filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.15))",
                      }}
                    />

                    {/* Glassy Specular Top Sheen (Inner Highlight Arc) */}
                    <path
                      d={district.pathD}
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.45)"
                      strokeWidth="1.2"
                      style={{
                        transform: "translate(-1px, -1px)",
                        pointerEvents: "none",
                      }}
                    />

                    {/* District Centroid Centered Kannada Typography */}
                    <text
                      x={district.centroid[0]}
                      y={district.centroid[1]}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="text-[11px] font-serif font-bold pointer-events-none select-none tracking-tight"
                      fill={isNorth ? "#000000" : "#FFFFFF"}
                      style={{
                        textShadow: isNorth
                          ? "0 1px 2px rgba(255,255,255,0.95)"
                          : "0 1px 3px rgba(0,0,0,0.95)",
                      }}
                    >
                      {district.kannadaName}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        )}
      </div>

      {/* 3D Glassmorphic Bento Box Overlay with Dynamic Full-screen Backgrounds */}
      <RegionBentoOverlay
        activeRegionData={activeRegionData}
        clickedDistrict={clickedDistrict}
        clickOrigin={clickOrigin}
        isLoadingSentences={isLoadingSentences}
        playingSentenceText={playingSentenceText}
        onPlaySentence={playSentence}
        onClose={() => {
          setActiveRegionData(null);
          setClickedDistrict(null);
          setClickOrigin(null);
          dispatchMapDistrictSelect({ district: null, regionCode: null });
        }}
        onSelectDistrict={(districtName, regionCode) => {
          handleDistrictClick(districtName, regionCode);
        }}
      />
    </div>
  );
}