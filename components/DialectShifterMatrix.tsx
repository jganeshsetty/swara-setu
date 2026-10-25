"use client";

import { useState } from "react";
import { ZONES, ZoneDef } from "@/lib/constants";

interface DialectVariation {
  script: string;
  phonetic: string;
  grammarNote: string;
}

interface ComparisonCard {
  regionKey: string;
  region: ZoneDef;
  variations: DialectVariation[];
}

export default function DialectShifterMatrix({ englishPrompt }: { englishPrompt: string }) {
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [showMatrix, setShowMatrix] = useState(false);

  // Simulated lookup results based on the prompt type
  const matrixData: ComparisonCard[] = [
    {
      regionKey: "old_mysuru",
      region: ZONES.find(z => z.slug === "old_mysuru") || ZONES[0],
      variations: [
        {
          script: "ತುಂಬಾ ಚೆನ್ನಾಗಿದೆ",
          phonetic: "tumbha chennagide",
          grammarNote: "Vowel elongation + affectionate suffix -kano/kane",
        },
        {
          script: "ಕಣೋ ಕೇಡ",
          phonetic: "kano kede",
          grammarNote: "Casual 'kano' address, retroflex consonant drop",
        },
      ],
    },
    {
      regionKey: "kalyana_uttara",
      region: ZONES.find(z => z.slug === "kalyana_uttara") || ZONES[1],
      variations: [
        {
          script: "ಚೊಲೊ ಐತಿ",
          phonetic: "cholo aithi",
          grammarNote: "Respectful -ri suffix on verbs, vowel elongation",
        },
        {
          script: "ಆಖತ್ತೈತಿ",
          phonetic: "aakattheti",
          grammarNote: "Verb ending -ri contracted to -tte",
        },
      ],
    },
    {
      regionKey: "karavali_coastal",
      region: ZONES.find(z => z.slug === "karavali_coastal") || ZONES[3],
      variations: [
        {
          script: "ಎಂತ ಮಾರ್ರೆ",
          phonetic: "entha maarre",
          grammarNote: "Dropped final vowels, Tulu substrate pronouns 'entha'/'onkanda'",
        },
        {
          script: "ಎಂತ ಅತ್ತ",
          phonetic: "entha atta",
          grammarNote: "Casual 'entha' what, vowel reduction",
        },
      ],
    },
    {
      regionKey: "malnad_ghats",
      region: ZONES.find(z => z.slug === "malnad_ghats") || ZONES[4],
      variations: [
        {
          script: "ಹೋಗಿವೆ",
          phonetic: "hogive",
          grammarNote: "Preserved Halegannada case endings, monsoon vocabulary",
        },
        {
          script: "ಜಡಿ ಮಳೆ",
          phonetic: "jadi male",
          grammarNote: "Continuous rain term unchanged",
        },
      ],
    },
    {
      regionKey: "kittur_northwest",
      region: ZONES.find(z => z.slug === "kittur_northwest") || ZONES[2],
      variations: [
        {
          script: "ಹಂಗ ಬಾವ!",
          phonetic: "hang bava",
          grammarNote: "Street expression 'like that, bro!' with Marathi 'bava'",
        },
        {
          script: "ಬಹಳ ಚೊಲೋ",
          phonetic: "bahala cholo",
          grammarNote: "Belagavi borderland Marathi-Kannada convergence",
        },
      ],
    },
  ];

  const handleRegionSelect = (regionKey: string) => {
    setActiveRegion(regionKey);
  };

  return (
    <div className="hidden sm:block sm:fixed sm:bottom-4 sm:left-1/2 sm:-translate-x-1/2 sm:z-50">
      <button
        className={`glass-surface border border-arishina-400 rounded-lg px-4 py-3 text-sm font-medium hover:bg-arishina-400/20 transition-colors cursor-pointer ${
          activeRegion === null ? "bg-arishina-50 text-arishina-400" : "bg-arishina-900 text-arishina-100"
        }`}
        onClick={() => setShowMatrix(!showMatrix)}
        style={{ minWidth: "200px" }}
        title="Open Dialect Shifter Matrix"
      >
        📊 Dialect Shifter
      </button>

      {/* Matrix Modal */}
      {showMatrix && (
        <div
          className="fixed inset-0 z-50 backdrop-blur-xl bg-black/60 flex items-center justify-center p-4"
          onClick={() => setShowMatrix(false)}
        >
          <div
            className="glass-surface max-w-2xl w-full max-h-[80vh] rounded-2xl overflow-y-auto p-6 transform transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif-kannada text-arishina-400">
                5-Region Dialect Comparison
              </h2>
              <button
                className="text-gray-400 hover:text-arishina-400 p-2"
                onClick={() => setShowMatrix(false)}
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* Prompt preview */}
            <div className="mb-4 p-3 rounded-lg bg-obsidian-800 border border-arishina-400/20 text-sm text-gray-300">
              <span className="text-arishina-400 font-semibold">Prompt: </span>
              {englishPrompt || "Everyday greetings & common expressions"}
            </div>

            {/* Active region card */}
            {activeRegion && (
              <div className="mb-6 p-4 rounded-lg bg-kumkuma-600/20 border border-kumkuma-500">
                <h3 className="text-lg font-semibold text-kumkuma-400 mb-2">
                  {ZONES.find((z) => z.slug === activeRegion)?.nameEnglish || activeRegion}
                </h3>
                <p className="text-sm text-kumkuma-300">
                  {matrixData.find((m) => m.regionKey === activeRegion)?.variations[0]?.grammarNote}
                </p>
              </div>
            )}

            {/* Comparison Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {matrixData.map((card) => (
                <div
                  key={card.regionKey}
                  className={`glass-surface rounded-lg p-4 hover:bg-arishina-400/10 transition-colors cursor-pointer border ${
                    activeRegion === card.regionKey ? "border-arishina-400" : "border-arishina-400/20"
                  }`}
                  onClick={() => handleRegionSelect(card.regionKey)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xs"
                      style={{ background: card.region.color }}
                    >
                      {card.region.nameKannada.substring(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-arishina-400 text-sm">{card.region.nameEnglish}</p>
                      <p className="text-xs text-gray-400 capitalize">{card.region.slug}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {card.variations.map((v, vi) => (
                      <div
                        key={vi}
                        className="p-2 rounded bg-kumkuma-600/10 border border-kumkuma-500 text-xs"
                      >
                        <p className="font-medium text-kumkuma-400">{v.script}</p>
                        <p className="text-gray-300 italic">{v.phonetic}</p>
                        <p className="text-gray-400 mt-1 text-[11px]">{v.grammarNote}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}