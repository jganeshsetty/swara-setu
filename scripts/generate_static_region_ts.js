const fs = require('fs');

const extractedPhrases = JSON.parse(fs.readFileSync('scripts/extracted_region_phrases.json', 'utf8'));

const GROUP_META = {
  uttara_kalyana: {
    regionId: "uttara_kalyana",
    name: "ಉತ್ತರ ಕಲ್ಯಾಣ",
    nameKannada: "ಉತ್ತರ ಕಲ್ಯಾಣ (ಬೀದರ್ - ಕಲಬುರಗಿ - ಯಾದಗಿರಿ)",
    districts: ["Bidar", "Kalaburagi", "Yadgir"],
    colorClass: "text-amber-800",
    badgeBg: "bg-amber-100 text-amber-950 border-amber-300",
    highlightHex: "#FFE500",
    description: "ದಖ್ಖನ್ ಬಹಮನಿ-ಸೂಫಿ ಹಾಗೂ ಶರಣರ ವಚನ ಸಂಸ್ಕೃತಿಯ ಸಂಗಮ. ಗೌರವಾರ್ಥಕ '-ರೀ' ಪ್ರತ್ಯಯ ಹಾಗೂ ನೇರ, ಸರಳ ವ್ಯಾಪಾರಿ ಮಾತುಗಾರಿಕೆ ಇಲ್ಲಿನ ವೈಶಿಷ್ಟ್ಯ.",
  },
  tungabhadra_belt: {
    regionId: "tungabhadra_belt",
    name: "ತುಂಗಭದ್ರಾ ತೀರ",
    nameKannada: "ತುಂಗಭದ್ರಾ ತೀರ (ರಾಯಚೂರು - ಕೊಪ್ಪಳ - ಬಳ್ಳಾರಿ - ವಿಜಯನಗರ)",
    districts: ["Raichur", "Koppal", "Ballari", "Vijayanagara"],
    colorClass: "text-amber-800",
    badgeBg: "bg-amber-100 text-amber-950 border-amber-300",
    highlightHex: "#FFE500",
    description: "ತುಂಗಭದ್ರಾ ನದಿ ತೀರ ಹಾಗೂ ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯದ ಗಣಿಗಾರಿಕೆ ನೆಲ. ಇಲ್ಲಿನ ಭಾಷೆಯಲ್ಲಿ ವೇಗದ ಗತಿ ಹಾಗೂ ಆಪ್ತ ಕರೆಯ ನಾದವಿದೆ.",
  },
  krishna_valley: {
    regionId: "krishna_valley",
    name: "ಕೃಷ್ಣಾ ಕಣಿವೆ",
    nameKannada: "ಕೃಷ್ಣಾ ಕಣಿವೆ (ಬೆಳಗಾವಿ - ಬಾಗಲಕೋಟೆ - ವಿಜಯಪುರ)",
    districts: ["Belagavi", "Bagalkote", "Vijayapura"],
    colorClass: "text-amber-800",
    badgeBg: "bg-amber-100 text-amber-950 border-amber-300",
    highlightHex: "#FFE500",
    description: "ಘಟಪ್ರಭಾ-ಮಲಪ್ರಭಾ ಕೃಷಿ ಸಂಸ್ಕೃತಿ ಹಾಗೂ ಮರಾಠಿ ಗಡಿ ಸಂಪರ್ಕದ ಪ್ರಭಾವ. ಧ್ವನಿಯ ಹ್ರಸ್ವತೆ ಮತ್ತು ಗಟ್ಟಿ ನುಡಿಗಟ್ಟುಗಳು ಇಲ್ಲಿನ ಹೆಗ್ಗುರುತು.",
  },
  hubballi_heartland: {
    regionId: "hubballi_heartland",
    name: "ಮಧ್ಯ ಕರ್ನಾಟಕ ವಾಣಿಜ್ಯ ಸೀಮೆ",
    nameKannada: "ಮಧ್ಯ ಕರ್ನಾಟಕ ವಾಣಿಜ್ಯ ಸೀಮೆ (ಧಾರವಾಡ - ಗದಗ - ಹಾವೇರಿ)",
    districts: ["Dharwad", "Gadag", "Haveri"],
    colorClass: "text-amber-800",
    badgeBg: "bg-amber-100 text-amber-950 border-amber-300",
    highlightHex: "#FFE500",
    description: "ಹುಬ್ಬಳ್ಳಿ-ಧಾರವಾಡ ಅವಳಿ ನಗರಗಳ ವ್ಯಾಪಾರಿ ಭಾಷೆ, ಪೇಡಾದ ಮಾಧುರ್ಯ ಮತ್ತು ಚಹಾ ಅಡ್ಡಾದ ಸಾಹಿತ್ಯಕ ಹಾಸ್ಯ ಚಟಾಕಿಗಳು.",
  },
  karavali_coast: {
    regionId: "karavali_coast",
    name: "ಕರಾವಳಿ ಕರ್ನಾಟಕ",
    nameKannada: "ಕರಾವಳಿ ಕರ್ನಾಟಕ (ಉತ್ತರ ಕನ್ನಡ - ಉಡುಪಿ - ದಕ್ಷಿಣ ಕನ್ನಡ)",
    districts: ["Uttara Kannada", "Udupi", "Dakshina Kannada"],
    colorClass: "text-red-700",
    badgeBg: "bg-red-100 text-red-950 border-red-300",
    highlightHex: "#FFE500",
    description: "ಅರಬ್ಬಿ ಸಮುದ್ರದ ತೀರದ ನಾದ. ತುಳು-ಕೊಂಕಣಿ ಮಿಶ್ರಿತ ಶಬ್ದಗಳು, ಅಂತಿಮ ಸ್ವರ ಲೋಪ ಮತ್ತು ಪ್ರೀತಿಯ 'ಮಾರಾಯ' ಸಂಬೋಧನೆ.",
  },
  malnad_ghats: {
    regionId: "malnad_ghats",
    name: "ಮಲೆನಾಡು ಗಿರಿಧಾಮ",
    nameKannada: "ಮಲೆನಾಡು ಗಿರಿಧಾಮ (ಶಿವಮೊಗ್ಗ - ಚಿಕ್ಕಮಗಳೂರು - ಕೊಡಗು)",
    districts: ["Shivamogga", "Chikkamagaluru", "Kodagu"],
    colorClass: "text-red-700",
    badgeBg: "bg-red-100 text-red-950 border-red-300",
    highlightHex: "#FFE500",
    description: "ಪಶ್ಚಿಮ ಘಟ್ಟಗಳ ಹಸಿರು ಕಾಫಿ-ಅಡಿಕೆ ತೋಟಗಳ ನೆಲ. ಹಳಗನ್ನಡದ ಪದಗಳು, ಮಳೆಗಾಲದ ಜಡಿಮಳೆಯ ನುಡಿಗಟ್ಟುಗಳ ಶ್ರೀಮಂತ ಸಂಸ್ಕೃತಿ.",
  },
  bayalu_seeme: {
    regionId: "bayalu_seeme",
    name: "ಮಧ್ಯ ಬಯಲು ಸೀಮೆ",
    nameKannada: "ಮಧ್ಯ ಬಯಲು ಸೀಮೆ (ದಾವಣಗೆರೆ - ಚಿತ್ರದುರ್ಗ - ತುಮಕೂರು)",
    districts: ["Davanagere", "Chitradurga", "Tumakuru"],
    colorClass: "text-red-700",
    badgeBg: "bg-red-100 text-red-950 border-red-300",
    highlightHex: "#FFE500",
    description: "ಕೋಟೆಗಳ ನಾಡು ಮತ್ತು ಬೆಣ್ಣೆ ದೋಸೆಯ ತವರು. ಗಟ್ಟಿ ನುಡಿ, ನೇರ ಮಾತು ಹಾಗೂ ಕೃಷಿಕರ ಮಣ್ಣಿನ ಸೊಗಡಿನ ಕನ್ನಡ.",
  },
  kaveri_basin: {
    regionId: "kaveri_basin",
    name: "ಕಾವೇರಿ ಕಣಿವೆ",
    nameKannada: "ಕಾವೇರಿ ಕಣಿವೆ (ಮೈಸೂರು - ಮಂಡ್ಯ - ಚಾಮರಾಜನಗರ)",
    districts: ["Mysuru", "Mandya", "Chamarajanagara"],
    colorClass: "text-red-700",
    badgeBg: "bg-red-100 text-red-950 border-red-300",
    highlightHex: "#FFE500",
    description: "ಒಡೆಯರ್ ರಾಜಪರಂಪರೆ ಹಾಗೂ ಕಬ್ಬಿನ ಗದ್ದೆಗಳ ಸೊಬಗು. ಸ್ವರಗಳ ಉದ್ದನೆ ಉಚ್ಚಾರಣೆ ಹಾಗೂ ಪ್ರೀತಿಯ 'ಕಣೋ/ಕಣ್ರೀ' ಸಂಬೋಧನೆಯ ಕನ್ನಡ.",
  },
  dakshina_ghats: {
    regionId: "dakshina_ghats",
    name: "ದಕ್ಷಿಣ ಹೆಬ್ಬಾಗಿಲು",
    nameKannada: "ದಕ್ಷಿಣ ಹೆಬ್ಬಾಗಿಲು (ಹಾಸನ - ರಾಮನಗರ)",
    districts: ["Hassan", "Ramanagara"],
    colorClass: "text-red-700",
    badgeBg: "bg-red-100 text-red-950 border-red-300",
    highlightHex: "#FFE500",
    description: "ಹೊಯ್ಸಳ ಶಿಲ್ಪಕಲೆ ಹಾಗೂ ರೇಷ್ಮೆ ಗೂಡಿನ ನಾಡು. ಮಲೆನಾಡಿನ ಶಾಂತತೆ ಮತ್ತು ರಾಜಧಾನಿ ಗಡಿಯ ವೇಗದ ನುಡಿ ಸಂಗಮ.",
  },
  kolar_bengaluru: {
    regionId: "kolar_bengaluru",
    name: "ಪೂರ್ವ ಗಡಿ ಪ್ರಸ್ಥಭೂಮಿ",
    nameKannada: "ಪೂರ್ವ ಗಡಿ ಪ್ರಸ್ಥಭೂಮಿ (ಬೆಂಗಳೂರು - ಕೋಲಾರ - ಚಿಕ್ಕಬಳ್ಳಾಪುರ)",
    districts: ["Bengaluru Urban", "Bengaluru Rural", "Kolar", "Chikkaballapura"],
    colorClass: "text-red-700",
    badgeBg: "bg-red-100 text-red-950 border-red-300",
    highlightHex: "#FFE500",
    description: "ರಾಜಧಾನಿ ಮಹಾನಗರ ಹಾಗೂ ಪೂರ್ವ ಪ್ರಸ್ಥಭೂಮಿ. ತೆಲುಗು-ತಮಿಳು ಗಡಿ ಸಂಪರ್ಕ, ಆಧುನಿಕ ಆಡುಮಾತು ಹಾಗೂ 'ಮಚ್ಚಾ/ಗುರು' ಶೈಲಿಯ ಬೆಂಗಳೂರು ಕನ್ನಡ.",
  },
};

const result = {};
for (const [k, meta] of Object.entries(GROUP_META)) {
  result[k] = {
    ...meta,
    phrases: extractedPhrases[k] || []
  };
}

const fileContent = `/**
 * Standalone Offline & Production Regional Data Store
 * Provides guaranteed dialect phrases, metadata, and monument associations
 * for all 10 Karnataka cultural linguistic zones without requiring MongoDB.
 */

export interface StaticPhrase {
  textbook: string;
  regional: string;
  meaning: string;
  audioUrl?: string;
}

export interface StaticRegionData {
  regionId: string;
  name: string;
  nameKannada: string;
  districts: string[];
  colorClass: string;
  badgeBg: string;
  highlightHex: string;
  description: string;
  phrases: StaticPhrase[];
}

export const STATIC_REGION_MAP: Record<string, StaticRegionData> = ${JSON.stringify(result, null, 2)};

export const STATIC_REGIONS_LIST: StaticRegionData[] = Object.values(STATIC_REGION_MAP);
`;

fs.writeFileSync('lib/staticRegionData.ts', fileContent, 'utf8');
console.log('Generated lib/staticRegionData.ts successfully!');

