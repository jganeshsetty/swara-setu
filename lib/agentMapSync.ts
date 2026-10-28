/**
 * Agent-to-Map Event Bus & Geographic Keyword Detection Dictionary
 * Synchronizes real-time conversational agent outputs with 3D Karnataka map navigation.
 */

export interface LocationHighlightEvent {
  districtName: string;
  kannadaName: string;
  regionCode: string;
  aliasMatched: string;
  coordinates?: [number, number]; // [centroidX, centroidY] on SVG canvas
}

// Predefined dictionary of Karnataka districts, major cities, and heritage sites
export const KARNATAKA_GEO_ENTITIES: Array<{
  districtName: string;
  regionCode: string;
  kannadaName: string;
  keywords: string[];
}> = [
  {
    districtName: "Mysuru",
    regionCode: "kaveri_basin",
    kannadaName: "ಮೈಸೂರು",
    keywords: ["mysuru", "mysore", "ಮೈಸೂರು", "ಚಾಮುಂಡಿ", "ಕೃಷ್ಣರಾಜ", "ಅರಮನೆ"],
  },
  {
    districtName: "Bengaluru Urban",
    regionCode: "kolar_bengaluru",
    kannadaName: "ಬೆಂಗಳೂರು ನಗರ",
    keywords: ["bengaluru", "bangalore", "ಬೆಂಗಳೂರು", "ಸಿಲಿಕಾನ್ ಸಿಟಿ", "ವಿಧಾನಸೌಧ"],
  },
  {
    districtName: "Bengaluru Rural",
    regionCode: "kolar_bengaluru",
    kannadaName: "ಬೆಂಗಳೂರು ಗ್ರಾ.",
    keywords: ["ದೇವನಹಳ್ಳಿ", "ನೆಲಮಂಗಲ", "ದೊಡ್ಡಬಳ್ಳಾಪುರ"],
  },
  {
    districtName: "Vijayanagara",
    regionCode: "tungabhadra_belt",
    kannadaName: "ವಿಜಯನಗರ",
    keywords: ["vijayanagara", "hampi", "ಹಂಪಿ", "ವಿಜಯನಗರ", "ಹೊಸಪೇಟೆ", "hosapete", "ಹಂಪೆ"],
  },
  {
    districtName: "Ballari",
    regionCode: "tungabhadra_belt",
    kannadaName: "ಬಳ್ಳಾರಿ",
    keywords: ["ballari", "bellary", "ಬಳ್ಳಾರಿ", "ಸಂಡೂರು"],
  },
  {
    districtName: "Dharwad",
    regionCode: "hubballi_heartland",
    kannadaName: "ಧಾರವಾಡ",
    keywords: ["dharwad", "hubballi", "hubli", "ಧಾರವಾಡ", "ಹುಬ್ಬಳ್ಳಿ", "ಪೇಡ"],
  },
  {
    districtName: "Belagavi",
    regionCode: "krishna_valley",
    kannadaName: "ಬೆಳಗಾವಿ",
    keywords: ["belagavi", "belgaum", "ಬೆಳಗಾವಿ", "ಕುಂದಾ", "ಸುವರ್ಣಸೌಧ", "ಕಿತ್ತೂರು"],
  },
  {
    districtName: "Kalaburagi",
    regionCode: "uttara_kalyana",
    kannadaName: "ಕಲಬುರಗಿ",
    keywords: ["kalaburagi", "gulbarga", "ಕಲಬುರಗಿ", "ಗುಲ್ಬರ್ಗ", "ಖವಾಜಾ", "ಶರಣಬಸವೇಶ್ವರ"],
  },
  {
    districtName: "Bidar",
    regionCode: "uttara_kalyana",
    kannadaName: "ಬೀದರ್",
    keywords: ["bidar", "ಬೀದರ್", "ಗುರುನಾನಕ್ ಝೀರಾ", "ಬೀದ್ರಿ"],
  },
  {
    districtName: "Yadgir",
    regionCode: "uttara_kalyana",
    kannadaName: "ಯಾದಗಿರಿ",
    keywords: ["yadgir", "ಯಾದಗಿರಿ", "ಸುರಪುರ"],
  },
  {
    districtName: "Raichur",
    regionCode: "tungabhadra_belt",
    kannadaName: "ರಾಯಚೂರು",
    keywords: ["raichur", "ರಾಯಚೂರು", "ದೋಆಬ್", "ಮಂತ್ರಾಲಯ"],
  },
  {
    districtName: "Koppal",
    regionCode: "tungabhadra_belt",
    kannadaName: "ಕೊಪ್ಪಳ",
    keywords: ["koppal", "ಕೊಪ್ಪಳ", "ಕಿನ್ನಾಳ", "ಆನೆಗೊಂದಿ", "anegundi"],
  },
  {
    districtName: "Gadag",
    regionCode: "hubballi_heartland",
    kannadaName: "ಗದಗ",
    keywords: ["gadag", "ಗದಗ", "ಲಕ್ಕುಂಡಿ", "ರೋಣ"],
  },
  {
    districtName: "Haveri",
    regionCode: "hubballi_heartland",
    kannadaName: "ಹಾವೇರಿ",
    keywords: ["haveri", "ಹಾವೇರಿ", "ಬ್ಯಾಡಗಿ", "ಕಾಗಿನೆಲೆ"],
  },
  {
    districtName: "Bagalkote",
    regionCode: "krishna_valley",
    kannadaName: "ಬಾಗಲಕೋಟೆ",
    keywords: ["bagalkote", "bagalkot", "ಬಾಗಲಕೋಟೆ", "ಬಾದಾಮಿ", "ಪಟ್ಟದಕಲ್ಲು", "ಐಹೊಳೆ", "badami", "aihole"],
  },
  {
    districtName: "Vijayapura",
    regionCode: "krishna_valley",
    kannadaName: "ವಿಜಯಪುರ",
    keywords: ["vijayapura", "bijapur", "ವಿಜಯಪುರ", "ಬಿಜಾಪುರ", "ಗೋಳಗುಮ್ಮಟ", "gol gumbaz"],
  },
  {
    districtName: "Dakshina Kannada",
    regionCode: "karavali_coast",
    kannadaName: "ದಕ್ಷಿಣ ಕನ್ನಡ",
    keywords: ["dakshina kannada", "mangaluru", "mangalore", "ದಕ್ಷಿಣ ಕನ್ನಡ", "ಮಂಗಳೂರು", "ತುಳುನಾಡು", "ಧರ್ಮಸ್ಥಳ", "ಕುಕ್ಕೆ"],
  },
  {
    districtName: "Udupi",
    regionCode: "karavali_coast",
    kannadaName: "ಉಡುಪಿ",
    keywords: ["udupi", "ಉಡುಪಿ", "ಶ್ರೀಕೃಷ್ಣ", "ಮಲ್ಪೆ", "ಕಾರ್ಕಳ", "ಮಣಿಪಾಲ"],
  },
  {
    districtName: "Uttara Kannada",
    regionCode: "karavali_coast",
    kannadaName: "ಉತ್ತರ ಕನ್ನಡ",
    keywords: ["uttara kannada", "ಉತ್ತರ ಕನ್ನಡ", "ಕಾರವಾರ", "ಗೋಕರ್ಣ", "ಮುರುಡೇಶ್ವರ", "ದಾಂಡೇಲಿ"],
  },
  {
    districtName: "Shivamogga",
    regionCode: "malnad_ghats",
    kannadaName: "ಶಿವಮೊಗ್ಗ",
    keywords: ["shivamogga", "shimoga", "ಶಿವಮೊಗ್ಗ", "ಜೋಗ ಜಲಪಾತ", "ತೀರ್ಥಹಳ್ಳಿ", "jog falls"],
  },
  {
    districtName: "Chikkamagaluru",
    regionCode: "malnad_ghats",
    kannadaName: "ಚಿಕ್ಕಮಗಳೂರು",
    keywords: ["chikkamagaluru", "chikmagalur", "ಚಿಕ್ಕಮಗಳೂರು", "ಮುಳ್ಳಯ್ಯನಗಿರಿ", "ಕಾಫಿ ನಾಡು", "ಬಾಬಾಬುಡನ್‌ಗಿರಿ"],
  },
  {
    districtName: "Kodagu",
    regionCode: "malnad_ghats",
    kannadaName: "ಕೊಡಗು",
    keywords: ["kodagu", "coorg", "ಕೊಡಗು", "ಮಡಿಕೇರಿ", "ತಲಕಾವೇರಿ"],
  },
  {
    districtName: "Davanagere",
    regionCode: "bayalu_seeme",
    kannadaName: "ದಾವಣಗೆರೆ",
    keywords: ["davanagere", "ದಾವಣಗೆರೆ", "ಬೆಣ್ಣೆ ದೋಸೆ"],
  },
  {
    districtName: "Chitradurga",
    regionCode: "bayalu_seeme",
    kannadaName: "ಚಿತ್ರದುರ್ಗ",
    keywords: ["chitradurga", "ಚಿತ್ರದುರ್ಗ", "ಏಳು ಸುತ್ತಿನ ಕೋಟೆ", "ಓಬವ್ವ"],
  },
  {
    districtName: "Tumakuru",
    regionCode: "bayalu_seeme",
    kannadaName: "ತುಮಕೂರು",
    keywords: ["tumakuru", "tumkur", "ತುಮಕೂರು", "ಸಿದ್ಧಗಂಗಾ", "ದೇವರಾಯನದುರ್ಗ"],
  },
  {
    districtName: "Mandya",
    regionCode: "kaveri_basin",
    kannadaName: "ಮಂಡ್ಯ",
    keywords: ["mandya", "ಮಂಡ್ಯ", "ಸಕ್ಕರೆ ನಾಡು", "ಶ್ರೀರಂಗಪಟ್ಟಣ", "ಕೆಆರ್‌ಎಸ್"],
  },
  {
    districtName: "Chamarajanagara",
    regionCode: "kaveri_basin",
    kannadaName: "ಚಾಮರಾಜನಗರ",
    keywords: ["chamarajanagara", "ಚಾಮರಾಜನಗರ", "ಬಂಡೀಪುರ", "ಮಲೆಯ ಮಹದೇಶ್ವರ"],
  },
  {
    districtName: "Hassan",
    regionCode: "dakshina_ghats",
    kannadaName: "ಹಾಸನ",
    keywords: ["hassan", "ಹಾಸನ", "ಬೇಲೂರು", "ಹಳೇಬೀಡು", "ಶ್ರವಣಬೆಳಗೊಳ", "belur", "halebidu"],
  },
  {
    districtName: "Ramanagara",
    regionCode: "dakshina_ghats",
    kannadaName: "ರಾಮನಗರ",
    keywords: ["ramanagara", "ರಾಮನಗರ", "ರೇಷ್ಮೆ ನಗರಿ", "ಚನ್ನಪಟ್ಟಣ"],
  },
  {
    districtName: "Kolar",
    regionCode: "kolar_bengaluru",
    kannadaName: "ಕೋಲಾರ",
    keywords: ["kolar", "ಕೋಲಾರ", "ಚಿನ್ನದ ಗಣಿ", "ಕೆಜಿಎಫ್", "kgf"],
  },
  {
    districtName: "Chikkaballapura",
    regionCode: "kolar_bengaluru",
    kannadaName: "ಚಿಕ್ಕಬಳ್ಳಾಪುರ",
    keywords: ["chikkaballapura", "ಚಿಕ್ಕಬಳ್ಳಾಪುರ", "ನಂದಿ ಬೆಟ್ಟ", "nandi hills"],
  },
];

const AGENT_LOCATION_EVENT = "swara-setu:agent-location-highlight";

/**
 * Dispatch an event when the AI agent mentions a district/heritage site.
 */
export function dispatchAgentLocationHighlight(eventData: LocationHighlightEvent) {
  if (typeof window === "undefined") return;
  const customEvent = new CustomEvent(AGENT_LOCATION_EVENT, { detail: eventData });
  window.dispatchEvent(customEvent);
}

/**
 * Subscribe to agent location highlight events.
 */
export function subscribeAgentLocationHighlight(callback: (eventData: LocationHighlightEvent) => void) {
  if (typeof window === "undefined") return () => {};
  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<LocationHighlightEvent>;
    if (customEvent.detail) {
      callback(customEvent.detail);
    }
  };
  window.addEventListener(AGENT_LOCATION_EVENT, handler);
  return () => window.removeEventListener(AGENT_LOCATION_EVENT, handler);
}

/**
 * Parses raw text from the AI Agent in real-time to detect Karnataka geographic locations.
 * Returns the primary (first matched) location or null.
 */
export function detectLocationFromText(text: string): LocationHighlightEvent | null {
  if (!text || text.length < 2) return null;
  const lower = text.toLowerCase();

  for (const entity of KARNATAKA_GEO_ENTITIES) {
    for (const kw of entity.keywords) {
      if (lower.includes(kw)) {
        return {
          districtName: entity.districtName,
          kannadaName: entity.kannadaName,
          regionCode: entity.regionCode,
          aliasMatched: kw,
        };
      }
    }
  }
  return null;
}

const MAP_DISTRICT_SELECT_EVENT = "swara-setu:map-district-select";

export interface MapDistrictSelectEvent {
  district: string | null;
  regionCode: string | null;
  regionNameKannada?: string | null;
}

/**
 * Dispatch an event when the user clicks a district or region on the 3D map.
 */
export function dispatchMapDistrictSelect(eventData: MapDistrictSelectEvent) {
  if (typeof window === "undefined") return;
  const customEvent = new CustomEvent(MAP_DISTRICT_SELECT_EVENT, { detail: eventData });
  window.dispatchEvent(customEvent);
}

/**
 * Subscribe to map district / region click events.
 */
export function subscribeMapDistrictSelect(callback: (eventData: MapDistrictSelectEvent) => void) {
  if (typeof window === "undefined") return () => {};
  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<MapDistrictSelectEvent>;
    if (customEvent.detail) {
      callback(customEvent.detail);
    }
  };
  window.addEventListener(MAP_DISTRICT_SELECT_EVENT, handler);
  return () => window.removeEventListener(MAP_DISTRICT_SELECT_EVENT, handler);
}

