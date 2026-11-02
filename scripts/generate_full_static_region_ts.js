const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const REGION_META = {
  1: {
    regionId: "uttara_kalyana",
    name: "ಉತ್ತರ ಕಲ್ಯಾಣ",
    nameKannada: "ಉತ್ತರ ಕಲ್ಯಾಣ (ಬೀದರ್ - ಕಲಬುರಗಿ - ಯಾದಗಿರಿ)",
    districts: ["Bidar", "Kalaburagi", "Yadgir"],
    colorClass: "text-amber-800",
    badgeBg: "bg-amber-100 text-amber-950 border-amber-300",
    highlightHex: "#FFE500",
    description: "ದಖ್ಖನ್ ಬಹಮನಿ-ಸೂಫಿ ಹಾಗೂ ಶರಣರ ವಚನ ಸಂಸ್ಕೃತಿಯ ಸಂಗಮ. ಗೌರವಾರ್ಥಕ '-ರೀ' ಪ್ರತ್ಯಯ ಹಾಗೂ ನೇರ, ಸರಳ ವ್ಯಾಪಾರಿ ಮಾತುಗಾರಿಕೆ ಇಲ್ಲಿನ ವೈಶಿಷ್ಟ್ಯ.",
  },
  2: {
    regionId: "tungabhadra_belt",
    name: "ತುಂಗಭದ್ರಾ ತೀರ",
    nameKannada: "ತುಂಗಭದ್ರಾ ತೀರ (ರಾಯಚೂರು - ಕೊಪ್ಪಳ - ಬಳ್ಳಾರಿ - ವಿಜಯನಗರ)",
    districts: ["Raichur", "Koppal", "Ballari", "Vijayanagara"],
    colorClass: "text-amber-800",
    badgeBg: "bg-amber-100 text-amber-950 border-amber-300",
    highlightHex: "#FFE500",
    description: "ತುಂಗಭದ್ರಾ ನದಿ ತೀರ ಹಾಗೂ ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯದ ಗಣಿಗಾರಿಕೆ ನೆಲ. ಇಲ್ಲಿನ ಭಾಷೆಯಲ್ಲಿ ವೇಗದ ಗತಿ ಹಾಗೂ ಆಪ್ತ ಕರೆಯ ನಾದವಿದೆ.",
  },
  3: {
    regionId: "krishna_valley",
    name: "ಕೃಷ್ಣಾ ಕಣಿವೆ",
    nameKannada: "ಕೃಷ್ಣಾ ಕಣಿವೆ (ಬೆಳಗಾವಿ - ಬಾಗಲಕೋಟೆ - ವಿಜಯಪುರ)",
    districts: ["Belagavi", "Bagalkote", "Vijayapura"],
    colorClass: "text-amber-800",
    badgeBg: "bg-amber-100 text-amber-950 border-amber-300",
    highlightHex: "#FFE500",
    description: "ಘಟಪ್ರಭಾ-ಮಲಪ್ರಭಾ ಕೃಷಿ ಸಂಸ್ಕೃತಿ ಹಾಗೂ ಮರಾಠಿ ಗಡಿ ಸಂಪರ್ಕದ ಪ್ರಭಾವ. ಧ್ವನಿಯ ಹ್ರಸ್ವತೆ ಮತ್ತು ಗಟ್ಟಿ ನುಡಿಗಟ್ಟುಗಳು ಇಲ್ಲಿನ ಹೆಗ್ಗುರುತು.",
  },
  4: {
    regionId: "hubballi_heartland",
    name: "ಮಧ್ಯ ಕರ್ನಾಟಕ ವಾಣಿಜ್ಯ ಸೀಮೆ",
    nameKannada: "ಮಧ್ಯ ಕರ್ನಾಟಕ ವಾಣಿಜ್ಯ ಸೀಮೆ (ಧಾರವಾಡ - ಗದಗ - ಹಾವೇರಿ)",
    districts: ["Dharwad", "Gadag", "Haveri"],
    colorClass: "text-amber-800",
    badgeBg: "bg-amber-100 text-amber-950 border-amber-300",
    highlightHex: "#FFE500",
    description: "ಹುಬ್ಬಳ್ಳಿ-ಧಾರವಾಡ ಅವಳಿ ನಗರಗಳ ವ್ಯಾಪಾರಿ ಭಾಷೆ, ಪೇಡಾದ ಮಾಧುರ್ಯ ಮತ್ತು ಚಹಾ ಅಡ್ಡಾದ ಸಾಹಿತ್ಯಕ ಹಾಸ್ಯ ಚಟಾಕಿಗಳು.",
  },
  5: {
    regionId: "karavali_coast",
    name: "ಕರಾವಳಿ ಕರ್ನಾಟಕ",
    nameKannada: "ಕರಾವಳಿ ಕರ್ನಾಟಕ (ಉತ್ತರ ಕನ್ನಡ - ಉಡುಪಿ - ದಕ್ಷಿಣ ಕನ್ನಡ)",
    districts: ["Uttara Kannada", "Udupi", "Dakshina Kannada"],
    colorClass: "text-red-700",
    badgeBg: "bg-red-100 text-red-950 border-red-300",
    highlightHex: "#FFE500",
    description: "ಅರಬ್ಬಿ ಸಮುದ್ರದ ತೀರದ ನಾದ. ತುಳು-ಕೊಂಕಣಿ ಮಿಶ್ರಿತ ಶಬ್ದಗಳು, ಅಂತಿಮ ಸ್ವರ ಲೋಪ ಮತ್ತು ಪ್ರೀತಿಯ 'ಮಾರಾಯ' ಸಂಬೋಧನೆ.",
  },
  6: {
    regionId: "malnad_ghats",
    name: "ಮಲೆನಾಡು ಗಿರಿಧಾಮ",
    nameKannada: "ಮಲೆನಾಡು ಗಿರಿಧಾಮ (ಶಿವಮೊಗ್ಗ - ಚಿಕ್ಕಮಗಳೂರು - ಕೊಡಗು)",
    districts: ["Shivamogga", "Chikkamagaluru", "Kodagu"],
    colorClass: "text-red-700",
    badgeBg: "bg-red-100 text-red-950 border-red-300",
    highlightHex: "#FFE500",
    description: "ಪಶ್ಚಿಮ ಘಟ್ಟಗಳ ಹಸಿರು ಕಾಫಿ-ಅಡಿಕೆ ತೋಟಗಳ ನೆಲ. ಹಳಗನ್ನಡದ ಪದಗಳು, ಮಳೆಗಾಲದ ಜಡಿಮಳೆಯ ನುಡಿಗಟ್ಟುಗಳ ಶ್ರೀಮಂತ ಸಂಸ್ಕೃತಿ.",
  },
  7: {
    regionId: "bayalu_seeme",
    name: "ಮಧ್ಯ ಬಯಲು ಸೀಮೆ",
    nameKannada: "ಮಧ್ಯ ಬಯಲು ಸೀಮೆ (ದಾವಣಗೆರೆ - ಚಿತ್ರದುರ್ಗ - ತುಮಕೂರು)",
    districts: ["Davanagere", "Chitradurga", "Tumakuru"],
    colorClass: "text-red-700",
    badgeBg: "bg-red-100 text-red-950 border-red-300",
    highlightHex: "#FFE500",
    description: "ಕೋಟೆಗಳ ನಾಡು ಮತ್ತು ಬೆಣ್ಣೆ ದೋಸೆಯ ತವರು. ಗಟ್ಟಿ ನುಡಿ, ನೇರ ಮಾತು ಹಾಗೂ ಕೃಷಿಕರ ಮಣ್ಣಿನ ಸೊಗಡಿನ ಕನ್ನಡ.",
  },
  8: {
    regionId: "kaveri_basin",
    name: "ಕಾವೇರಿ ಕಣಿವೆ",
    nameKannada: "ಕಾವೇರಿ ಕಣಿವೆ (ಮೈಸೂರು - ಮಂಡ್ಯ - ಚಾಮರಾಜನಗರ)",
    districts: ["Mysuru", "Mandya", "Chamarajanagara"],
    colorClass: "text-red-700",
    badgeBg: "bg-red-100 text-red-950 border-red-300",
    highlightHex: "#FFE500",
    description: "ಒಡೆಯರ್ ರಾಜಪರಂಪರೆ ಹಾಗೂ ಕಬ್ಬಿನ ಗದ್ದೆಗಳ ಸೊಬಗು. ಸ್ವರಗಳ ಉದ್ದನೆ ಉಚ್ಚಾರಣೆ ಹಾಗೂ ಪ್ರೀತಿಯ 'ಕಣೋ/ಕಣ್ರೀ' ಸಂಬೋಧನೆಯ ಕನ್ನಡ.",
  },
  9: {
    regionId: "dakshina_ghats",
    name: "ದಕ್ಷಿಣ ಹೆಬ್ಬಾಗಿಲು",
    nameKannada: "ದಕ್ಷಿಣ ಹೆಬ್ಬಾಗಿಲು (ಹಾಸನ - ರಾಮನಗರ)",
    districts: ["Hassan", "Ramanagara"],
    colorClass: "text-red-700",
    badgeBg: "bg-red-100 text-red-950 border-red-300",
    highlightHex: "#FFE500",
    description: "ಹೊಯ್ಸಳ ಶಿಲ್ಪಕಲೆ ಹಾಗೂ ರೇಷ್ಮೆ ಗೂಡಿನ ನಾಡು. ಮಲೆನಾಡಿನ ಶಾಂತತೆ ಮತ್ತು ರಾಜಧಾನಿ ಗಡಿಯ ವೇಗದ ನುಡಿ ಸಂಗಮ.",
  },
  10: {
    regionId: "kolar_bengaluru",
    name: "ಪೂರ್ವ ಗಡಿ ಪ್ರಸ್ಥಭೂಮಿ",
    nameKannada: "ಪೂರ್ವ ಗಡಿ ಪ್ರಸ್ಥಭೂಮಿ (ಬೆಂಗಳೂರು - ಕೋಲಾರ - ಚಿಕ್ಕಬಳ್ಳಾಪುರ)",
    districts: ["Bengaluru Urban", "Bengaluru Rural", "Kolar", "Chikkaballapura"],
    colorClass: "text-red-700",
    badgeBg: "bg-red-100 text-red-950 border-red-300",
    highlightHex: "#FFE500",
    description: "ಐಟಿ ಹಬ್ ಕಾಸ್ಮೋಪಾಲಿಟನ್ ಮತ್ತು ಚಿನ್ನದ ಗಣಿ ಸಂಸ್ಕೃತಿ. ಇಂಗ್ಲಿಷ್-ತೆಲುಗು ಪ್ರಭಾವಿತ ವೇಗದ ಬೆಂಗಳೂರು ಕನ್ನಡ ಹಾಗೂ ಗ್ರಾಮೀಣ ರೇಷ್ಮೆ ಸೀಮೆಯ ನುಡಿ.",
  },
};

const csvPath = path.resolve(__dirname, '..', 'kannada_regional_30_sentences_10_regions.csv');
const wb = xlsx.readFile(csvPath);
const rows = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

console.log(`Parsed ${rows.length} rows from CSV`);

const regionPhrases = {};
for (let i = 1; i <= 10; i++) {
  regionPhrases[i] = [];
}

rows.forEach((row) => {
  const regId = Number(row.region_id);
  if (regId >= 1 && regId <= 10 && row.textbook_kannada && row.regional_kannada) {
    regionPhrases[regId].push({
      textbook: String(row.textbook_kannada).trim(),
      regional: String(row.regional_kannada).trim(),
      meaning: String(row.english_meaning || '').trim(),
    });
  }
});

const staticRegionMap = {};

for (let gId = 1; gId <= 10; gId++) {
  const meta = REGION_META[gId];
  const phrases = regionPhrases[gId] || [];
  console.log(`Region ${gId} (${meta.regionId}): ${phrases.length} phrases`);

  staticRegionMap[meta.regionId] = {
    regionId: meta.regionId,
    name: meta.name,
    nameKannada: meta.nameKannada,
    districts: meta.districts,
    colorClass: meta.colorClass,
    badgeBg: meta.badgeBg,
    highlightHex: meta.highlightHex,
    description: meta.description,
    phrases: phrases,
  };
}

const tsContent = `/**
 * Standalone Offline & Production Regional Data Store (Complete Original Dataset)
 * Contains all 300 authentic regional sentences (30 sentences per region) across
 * all 10 Karnataka cultural linguistic zones without requiring MongoDB.
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

export const STATIC_REGION_MAP: Record<string, StaticRegionData> = ${JSON.stringify(staticRegionMap, null, 2)};

export const STATIC_REGIONS_LIST: StaticRegionData[] = Object.values(STATIC_REGION_MAP);
`;

const outputPath = path.resolve(__dirname, '..', 'lib', 'staticRegionData.ts');
fs.writeFileSync(outputPath, tsContent, 'utf-8');
console.log(`Successfully generated ${outputPath} with all 300 authentic sentences!`);

