/**
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

export const STATIC_REGION_MAP: Record<string, StaticRegionData> = {
  "uttara_kalyana": {
    "regionId": "uttara_kalyana",
    "name": "ಉತ್ತರ ಕಲ್ಯಾಣ",
    "nameKannada": "ಉತ್ತರ ಕಲ್ಯಾಣ (ಬೀದರ್ - ಕಲಬುರಗಿ - ಯಾದಗಿರಿ)",
    "districts": [
      "Bidar",
      "Kalaburagi",
      "Yadgir"
    ],
    "colorClass": "text-amber-800",
    "badgeBg": "bg-amber-100 text-amber-950 border-amber-300",
    "highlightHex": "#FFE500",
    "description": "ದಖ್ಖನ್ ಬಹಮನಿ-ಸೂಫಿ ಹಾಗೂ ಶರಣರ ವಚನ ಸಂಸ್ಕೃತಿಯ ಸಂಗಮ. ಗೌರವಾರ್ಥಕ '-ರೀ' ಪ್ರತ್ಯಯ ಹಾಗೂ ನೇರ, ಸರಳ ವ್ಯಾಪಾರಿ ಮಾತುಗಾರಿಕೆ ಇಲ್ಲಿನ ವೈಶಿಷ್ಟ್ಯ.",
    "phrases": [
      {
        "textbook": "ನಾನು",
        "regional": "ನಾ",
        "meaning": "I"
      },
      {
        "textbook": "ಹೆಚ್ಚು",
        "regional": "ಜಾಸ್ತಿ",
        "meaning": "more; much"
      },
      {
        "textbook": "ಕಡಿಮೆ",
        "regional": "ಕಮ್ಮಿ",
        "meaning": "less; little"
      },
      {
        "textbook": "ತುಂಬಾ",
        "regional": "ಭಾಳ",
        "meaning": "very; a lot"
      },
      {
        "textbook": "ಇಂದು",
        "regional": "ಇವತ್",
        "meaning": "today"
      },
      {
        "textbook": "ನಿನ್ನೆ",
        "regional": "ನಿನ್ನಿ",
        "meaning": "yesterday"
      },
      {
        "textbook": "ಬೆಳಿಗ್ಗೆ",
        "regional": "ಮುಂಜಾನಿ",
        "meaning": "morning"
      },
      {
        "textbook": "ಮಳೆ",
        "regional": "ಮಳಿ",
        "meaning": "rain"
      },
      {
        "textbook": "ಈರುಳ್ಳಿ",
        "regional": "ಉಳ್ಳಾಗಡ್ಡಿ",
        "meaning": "onion"
      },
      {
        "textbook": "ಮಾರುಕಟ್ಟೆ",
        "regional": "ಸಂತೆ",
        "meaning": "market"
      },
      {
        "textbook": "ಬೆಲೆ",
        "regional": "ರೇಟ್",
        "meaning": "price"
      },
      {
        "textbook": "ನೀವು ಹೇಗಿದ್ದೀರಿ?",
        "regional": "ನೀವ್ ಹ್ಯಾಂಗದೀರಿ?",
        "meaning": "How are you?"
      }
    ]
  },
  "tungabhadra_belt": {
    "regionId": "tungabhadra_belt",
    "name": "ತುಂಗಭದ್ರಾ ತೀರ",
    "nameKannada": "ತುಂಗಭದ್ರಾ ತೀರ (ರಾಯಚೂರು - ಕೊಪ್ಪಳ - ಬಳ್ಳಾರಿ - ವಿಜಯನಗರ)",
    "districts": [
      "Raichur",
      "Koppal",
      "Ballari",
      "Vijayanagara"
    ],
    "colorClass": "text-amber-800",
    "badgeBg": "bg-amber-100 text-amber-950 border-amber-300",
    "highlightHex": "#FFE500",
    "description": "ತುಂಗಭದ್ರಾ ನದಿ ತೀರ ಹಾಗೂ ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯದ ಗಣಿಗಾರಿಕೆ ನೆಲ. ಇಲ್ಲಿನ ಭಾಷೆಯಲ್ಲಿ ವೇಗದ ಗತಿ ಹಾಗೂ ಆಪ್ತ ಕರೆಯ ನಾದವಿದೆ.",
    "phrases": [
      {
        "textbook": "ನಾನು",
        "regional": "ನಾ",
        "meaning": "I"
      },
      {
        "textbook": "ಹೆಚ್ಚು",
        "regional": "ಜಾಸ್ತಿ",
        "meaning": "more; much"
      },
      {
        "textbook": "ಕಡಿಮೆ",
        "regional": "ಕಮ್ಮಿ",
        "meaning": "less; little"
      },
      {
        "textbook": "ತುಂಬಾ",
        "regional": "ಭಾಳ",
        "meaning": "very; a lot"
      },
      {
        "textbook": "ಇಂದು",
        "regional": "ಇವತ್",
        "meaning": "today"
      },
      {
        "textbook": "ನಿನ್ನೆ",
        "regional": "ನಿನ್ನಿ",
        "meaning": "yesterday"
      },
      {
        "textbook": "ಬೆಳಿಗ್ಗೆ",
        "regional": "ಮುಂಜಾನೆ",
        "meaning": "morning"
      },
      {
        "textbook": "ಮಳೆ",
        "regional": "ಮಳಿ",
        "meaning": "rain"
      },
      {
        "textbook": "ಈರುಳ್ಳಿ",
        "regional": "ಉಳ್ಳಾಗಡ್ಡಿ",
        "meaning": "onion"
      },
      {
        "textbook": "ಮಾರುಕಟ್ಟೆ",
        "regional": "ಸಂತೆ",
        "meaning": "market"
      },
      {
        "textbook": "ಬೆಲೆ",
        "regional": "ರೇಟ್",
        "meaning": "price"
      },
      {
        "textbook": "ನೀವು ಹೇಗಿದ್ದೀರಿ?",
        "regional": "ನೀವ್ ಹೆಂಗಿದೀರಿ?",
        "meaning": "How are you?"
      }
    ]
  },
  "krishna_valley": {
    "regionId": "krishna_valley",
    "name": "ಕೃಷ್ಣಾ ಕಣಿವೆ",
    "nameKannada": "ಕೃಷ್ಣಾ ಕಣಿವೆ (ಬೆಳಗಾವಿ - ಬಾಗಲಕೋಟೆ - ವಿಜಯಪುರ)",
    "districts": [
      "Belagavi",
      "Bagalkote",
      "Vijayapura"
    ],
    "colorClass": "text-amber-800",
    "badgeBg": "bg-amber-100 text-amber-950 border-amber-300",
    "highlightHex": "#FFE500",
    "description": "ಘಟಪ್ರಭಾ-ಮಲಪ್ರಭಾ ಕೃಷಿ ಸಂಸ್ಕೃತಿ ಹಾಗೂ ಮರಾಠಿ ಗಡಿ ಸಂಪರ್ಕದ ಪ್ರಭಾವ. ಧ್ವನಿಯ ಹ್ರಸ್ವತೆ ಮತ್ತು ಗಟ್ಟಿ ನುಡಿಗಟ್ಟುಗಳು ಇಲ್ಲಿನ ಹೆಗ್ಗುರುತು.",
    "phrases": [
      {
        "textbook": "ನಾನು",
        "regional": "ನಾ",
        "meaning": "I"
      },
      {
        "textbook": "ಹೆಚ್ಚು",
        "regional": "ಜಾಸ್ತಿ",
        "meaning": "more; much"
      },
      {
        "textbook": "ಕಡಿಮೆ",
        "regional": "ಕಮ್ಮಿ",
        "meaning": "less; little"
      },
      {
        "textbook": "ತುಂಬಾ",
        "regional": "ಬಾಳ",
        "meaning": "very; a lot"
      },
      {
        "textbook": "ಇಂದು",
        "regional": "ಇವತ್ತ",
        "meaning": "today"
      },
      {
        "textbook": "ನಿನ್ನೆ",
        "regional": "ನಿನ್ನಿ",
        "meaning": "yesterday"
      },
      {
        "textbook": "ಬೆಳಿಗ್ಗೆ",
        "regional": "ಮುಂಜಾನಿ",
        "meaning": "morning"
      },
      {
        "textbook": "ಮಳೆ",
        "regional": "ಮಳಿ",
        "meaning": "rain"
      },
      {
        "textbook": "ಈರುಳ್ಳಿ",
        "regional": "ಉಳ್ಳಾಗಡ್ಡಿ",
        "meaning": "onion"
      },
      {
        "textbook": "ಮಾರುಕಟ್ಟೆ",
        "regional": "ಸಂತೆ",
        "meaning": "market"
      },
      {
        "textbook": "ಬೆಲೆ",
        "regional": "ರೇಟು",
        "meaning": "price"
      },
      {
        "textbook": "ನೀವು ಹೇಗಿದ್ದೀರಿ?",
        "regional": "ನೀವು ಹ್ಯಾಂಗಿದ್ದೀರಿ?",
        "meaning": "How are you?"
      }
    ]
  },
  "hubballi_heartland": {
    "regionId": "hubballi_heartland",
    "name": "ಮಧ್ಯ ಕರ್ನಾಟಕ ವಾಣಿಜ್ಯ ಸೀಮೆ",
    "nameKannada": "ಮಧ್ಯ ಕರ್ನಾಟಕ ವಾಣಿಜ್ಯ ಸೀಮೆ (ಧಾರವಾಡ - ಗದಗ - ಹಾವೇರಿ)",
    "districts": [
      "Dharwad",
      "Gadag",
      "Haveri"
    ],
    "colorClass": "text-amber-800",
    "badgeBg": "bg-amber-100 text-amber-950 border-amber-300",
    "highlightHex": "#FFE500",
    "description": "ಹುಬ್ಬಳ್ಳಿ-ಧಾರವಾಡ ಅವಳಿ ನಗರಗಳ ವ್ಯಾಪಾರಿ ಭಾಷೆ, ಪೇಡಾದ ಮಾಧುರ್ಯ ಮತ್ತು ಚಹಾ ಅಡ್ಡಾದ ಸಾಹಿತ್ಯಕ ಹಾಸ್ಯ ಚಟಾಕಿಗಳು.",
    "phrases": [
      {
        "textbook": "ನಾನು",
        "regional": "ನಾ",
        "meaning": "I"
      },
      {
        "textbook": "ಹೆಚ್ಚು",
        "regional": "ಜಾಸ್ತಿ",
        "meaning": "more; much"
      },
      {
        "textbook": "ಕಡಿಮೆ",
        "regional": "ಕಮ್ಮಿ",
        "meaning": "less; little"
      },
      {
        "textbook": "ತುಂಬಾ",
        "regional": "ಭಾಳ",
        "meaning": "very; a lot"
      },
      {
        "textbook": "ಇಂದು",
        "regional": "ಇವತ್",
        "meaning": "today"
      },
      {
        "textbook": "ನಿನ್ನೆ",
        "regional": "ನಿನ್ನಿ",
        "meaning": "yesterday"
      },
      {
        "textbook": "ಬೆಳಿಗ್ಗೆ",
        "regional": "ಮುಂಜಾನಿ",
        "meaning": "morning"
      },
      {
        "textbook": "ಮಳೆ",
        "regional": "ಮಳಿ",
        "meaning": "rain"
      },
      {
        "textbook": "ಈರುಳ್ಳಿ",
        "regional": "ಉಳ್ಳಾಗಡ್ಡಿ",
        "meaning": "onion"
      },
      {
        "textbook": "ಮಾರುಕಟ್ಟೆ",
        "regional": "ಸಂತೆ",
        "meaning": "market"
      },
      {
        "textbook": "ಬೆಲೆ",
        "regional": "ರೇಟ್",
        "meaning": "price"
      },
      {
        "textbook": "ನೀವು ಹೇಗಿದ್ದೀರಿ?",
        "regional": "ಹೆಂಗಿದಿಪಾ?",
        "meaning": "How are you?"
      }
    ]
  },
  "karavali_coast": {
    "regionId": "karavali_coast",
    "name": "ಕರಾವಳಿ ಕರ್ನಾಟಕ",
    "nameKannada": "ಕರಾವಳಿ ಕರ್ನಾಟಕ (ಉತ್ತರ ಕನ್ನಡ - ಉಡುಪಿ - ದಕ್ಷಿಣ ಕನ್ನಡ)",
    "districts": [
      "Uttara Kannada",
      "Udupi",
      "Dakshina Kannada"
    ],
    "colorClass": "text-red-700",
    "badgeBg": "bg-red-100 text-red-950 border-red-300",
    "highlightHex": "#FFE500",
    "description": "ಅರಬ್ಬಿ ಸಮುದ್ರದ ತೀರದ ನಾದ. ತುಳು-ಕೊಂಕಣಿ ಮಿಶ್ರಿತ ಶಬ್ದಗಳು, ಅಂತಿಮ ಸ್ವರ ಲೋಪ ಮತ್ತು ಪ್ರೀತಿಯ 'ಮಾರಾಯ' ಸಂಬೋಧನೆ.",
    "phrases": [
      {
        "textbook": "ನಾನು",
        "regional": "ನಾನ್",
        "meaning": "I"
      },
      {
        "textbook": "ಹೆಚ್ಚು",
        "regional": "ಜಾಸ್ತಿ",
        "meaning": "more; much"
      },
      {
        "textbook": "ಕಡಿಮೆ",
        "regional": "ಕಮ್ಮಿ",
        "meaning": "less; little"
      },
      {
        "textbook": "ತುಂಬಾ",
        "regional": "ಫುಲ್",
        "meaning": "very; a lot"
      },
      {
        "textbook": "ಇಂದು",
        "regional": "ಇವತ್ತು",
        "meaning": "today"
      },
      {
        "textbook": "ಈರುಳ್ಳಿ",
        "regional": "ನೀರುಳ್ಳಿ",
        "meaning": "onion"
      },
      {
        "textbook": "ಮಾರುಕಟ್ಟೆ",
        "regional": "ಪೇಟೆ",
        "meaning": "market"
      },
      {
        "textbook": "ಬೆಲೆ",
        "regional": "ರೇಟು",
        "meaning": "price"
      },
      {
        "textbook": "ನೀವು ಹೇಗಿದ್ದೀರಿ?",
        "regional": "ನೀವು ಹೆಂಗಿದ್ದೀರಿ?",
        "meaning": "How are you?"
      },
      {
        "textbook": "ನೀವು ಎಲ್ಲಿಗೆ ಹೋಗುತ್ತಿದ್ದೀರಿ?",
        "regional": "ಎಲ್ಲಿಗ್ ಹೋಪದು?",
        "meaning": "Where are you going?"
      },
      {
        "textbook": "ನೀವು ಊಟ ಮಾಡಿದ್ದೀರಾ?",
        "regional": "ಊಟ ಆತಾ?",
        "meaning": "Have you eaten?"
      },
      {
        "textbook": "ನೀವು ಏನು ಮಾಡುತ್ತಿದ್ದೀರಿ?",
        "regional": "ಎಂತ ಮಾಡ್ತಾ ಇದ್ದೀರಿ?",
        "meaning": "What are you doing?"
      }
    ]
  },
  "malnad_ghats": {
    "regionId": "malnad_ghats",
    "name": "ಮಲೆನಾಡು ಗಿರಿಧಾಮ",
    "nameKannada": "ಮಲೆನಾಡು ಗಿರಿಧಾಮ (ಶಿವಮೊಗ್ಗ - ಚಿಕ್ಕಮಗಳೂರು - ಕೊಡಗು)",
    "districts": [
      "Shivamogga",
      "Chikkamagaluru",
      "Kodagu"
    ],
    "colorClass": "text-red-700",
    "badgeBg": "bg-red-100 text-red-950 border-red-300",
    "highlightHex": "#FFE500",
    "description": "ಪಶ್ಚಿಮ ಘಟ್ಟಗಳ ಹಸಿರು ಕಾಫಿ-ಅಡಿಕೆ ತೋಟಗಳ ನೆಲ. ಹಳಗನ್ನಡದ ಪದಗಳು, ಮಳೆಗಾಲದ ಜಡಿಮಳೆಯ ನುಡಿಗಟ್ಟುಗಳ ಶ್ರೀಮಂತ ಸಂಸ್ಕೃತಿ.",
    "phrases": [
      {
        "textbook": "ನಾನು",
        "regional": "ನಾನ್",
        "meaning": "I"
      },
      {
        "textbook": "ಹೆಚ್ಚು",
        "regional": "ಜಾಸ್ತಿ",
        "meaning": "more; much"
      },
      {
        "textbook": "ಕಡಿಮೆ",
        "regional": "ಕಮ್ಮಿ",
        "meaning": "less; little"
      },
      {
        "textbook": "ತುಂಬಾ",
        "regional": "ಫುಲ್",
        "meaning": "very; a lot"
      },
      {
        "textbook": "ಇಂದು",
        "regional": "ಇವತ್",
        "meaning": "today"
      },
      {
        "textbook": "ಮಾರುಕಟ್ಟೆ",
        "regional": "ಪೇಟೆ",
        "meaning": "market"
      },
      {
        "textbook": "ಬೆಲೆ",
        "regional": "ರೇಟ್",
        "meaning": "price"
      },
      {
        "textbook": "ನೀವು ಹೇಗಿದ್ದೀರಿ?",
        "regional": "ನೀವ್ ಹೆಂಗಿದ್ದೀರಿ?",
        "meaning": "How are you?"
      },
      {
        "textbook": "ನೀವು ಎಲ್ಲಿಗೆ ಹೋಗುತ್ತಿದ್ದೀರಿ?",
        "regional": "ಎಲ್ಲಿಗ್ ಹೋಗ್ತಿದ್ದೀಯಾ?",
        "meaning": "Where are you going?"
      },
      {
        "textbook": "ನೀವು ಊಟ ಮಾಡಿದ್ದೀರಾ?",
        "regional": "ಊಟ ಆಯ್ತಾ?",
        "meaning": "Have you eaten?"
      },
      {
        "textbook": "ನೀವು ಏನು ಮಾಡುತ್ತಿದ್ದೀರಿ?",
        "regional": "ಏನ್ ಮಾಡ್ತಿದ್ದೀಯಾ?",
        "meaning": "What are you doing?"
      },
      {
        "textbook": "ಇಲ್ಲಿಗೆ ಬನ್ನಿ",
        "regional": "ಇಲ್ಲಿಗೆ ಬಾ",
        "meaning": "Come here"
      }
    ]
  },
  "bayalu_seeme": {
    "regionId": "bayalu_seeme",
    "name": "ಮಧ್ಯ ಬಯಲು ಸೀಮೆ",
    "nameKannada": "ಮಧ್ಯ ಬಯಲು ಸೀಮೆ (ದಾವಣಗೆರೆ - ಚಿತ್ರದುರ್ಗ - ತುಮಕೂರು)",
    "districts": [
      "Davanagere",
      "Chitradurga",
      "Tumakuru"
    ],
    "colorClass": "text-red-700",
    "badgeBg": "bg-red-100 text-red-950 border-red-300",
    "highlightHex": "#FFE500",
    "description": "ಕೋಟೆಗಳ ನಾಡು ಮತ್ತು ಬೆಣ್ಣೆ ದೋಸೆಯ ತವರು. ಗಟ್ಟಿ ನುಡಿ, ನೇರ ಮಾತು ಹಾಗೂ ಕೃಷಿಕರ ಮಣ್ಣಿನ ಸೊಗಡಿನ ಕನ್ನಡ.",
    "phrases": [
      {
        "textbook": "ನಾನು",
        "regional": "ನಾನ್",
        "meaning": "I"
      },
      {
        "textbook": "ಹೆಚ್ಚು",
        "regional": "ಜಾಸ್ತಿ",
        "meaning": "more; much"
      },
      {
        "textbook": "ಕಡಿಮೆ",
        "regional": "ಕಮ್ಮಿ",
        "meaning": "less; little"
      },
      {
        "textbook": "ಇಂದು",
        "regional": "ಇವತ್",
        "meaning": "today"
      },
      {
        "textbook": "ಮಾರುಕಟ್ಟೆ",
        "regional": "ಸಂತೆ",
        "meaning": "market"
      },
      {
        "textbook": "ಬೆಲೆ",
        "regional": "ರೇಟ್",
        "meaning": "price"
      },
      {
        "textbook": "ನೀವು ಹೇಗಿದ್ದೀರಿ?",
        "regional": "ನೀವ್ ಹೆಂಗಿದ್ದೀರಾ?",
        "meaning": "How are you?"
      },
      {
        "textbook": "ನೀವು ಎಲ್ಲಿಗೆ ಹೋಗುತ್ತಿದ್ದೀರಿ?",
        "regional": "ಎಲ್ಲಿಗ್ ಹೋಗ್ತಾ ಇದ್ದೀಯಾ?",
        "meaning": "Where are you going?"
      },
      {
        "textbook": "ನೀವು ಊಟ ಮಾಡಿದ್ದೀರಾ?",
        "regional": "ಊಟ ಆಯ್ತಾ?",
        "meaning": "Have you eaten?"
      },
      {
        "textbook": "ನೀವು ಏನು ಮಾಡುತ್ತಿದ್ದೀರಿ?",
        "regional": "ಏನ್ ಮಾಡ್ತಾ ಇದ್ದೀಯಾ?",
        "meaning": "What are you doing?"
      },
      {
        "textbook": "ಇಲ್ಲಿಗೆ ಬನ್ನಿ",
        "regional": "ಇಲ್ ಬಾ",
        "meaning": "Come here"
      },
      {
        "textbook": "ನನಗೆ ತಿಳಿದಿಲ್ಲ",
        "regional": "ನಂಗೆ ಗೊತ್ತಿಲ್ಲ",
        "meaning": "I don't know"
      }
    ]
  },
  "kaveri_basin": {
    "regionId": "kaveri_basin",
    "name": "ಕಾವೇರಿ ಕಣಿವೆ",
    "nameKannada": "ಕಾವೇರಿ ಕಣಿವೆ (ಮೈಸೂರು - ಮಂಡ್ಯ - ಚಾಮರಾಜನಗರ)",
    "districts": [
      "Mysuru",
      "Mandya",
      "Chamarajanagara"
    ],
    "colorClass": "text-red-700",
    "badgeBg": "bg-red-100 text-red-950 border-red-300",
    "highlightHex": "#FFE500",
    "description": "ಒಡೆಯರ್ ರಾಜಪರಂಪರೆ ಹಾಗೂ ಕಬ್ಬಿನ ಗದ್ದೆಗಳ ಸೊಬಗು. ಸ್ವರಗಳ ಉದ್ದನೆ ಉಚ್ಚಾರಣೆ ಹಾಗೂ ಪ್ರೀತಿಯ 'ಕಣೋ/ಕಣ್ರೀ' ಸಂಬೋಧನೆಯ ಕನ್ನಡ.",
    "phrases": [
      {
        "textbook": "ಹೆಚ್ಚು",
        "regional": "ತುಂಬಾ",
        "meaning": "more; much"
      },
      {
        "textbook": "ಇಂದು",
        "regional": "ಇವತ್ತು",
        "meaning": "today"
      },
      {
        "textbook": "ಮಾರುಕಟ್ಟೆ",
        "regional": "ಸಂತೆ",
        "meaning": "market"
      },
      {
        "textbook": "ನೀವು ಹೇಗಿದ್ದೀರಿ?",
        "regional": "ನೀವು ಹೇಗಿದ್ದೀರಾ?",
        "meaning": "How are you?"
      },
      {
        "textbook": "ನೀವು ಎಲ್ಲಿಗೆ ಹೋಗುತ್ತಿದ್ದೀರಿ?",
        "regional": "ಎಲ್ಲಿಗೆ ಹೋಗ್ತಾ ಇದ್ದೀರಾ?",
        "meaning": "Where are you going?"
      },
      {
        "textbook": "ನೀವು ಊಟ ಮಾಡಿದ್ದೀರಾ?",
        "regional": "ಊಟ ಆಯ್ತಾ?",
        "meaning": "Have you eaten?"
      },
      {
        "textbook": "ನೀವು ಏನು ಮಾಡುತ್ತಿದ್ದೀರಿ?",
        "regional": "ಏನ್ ಮಾಡ್ತಾ ಇದ್ದೀರಾ?",
        "meaning": "What are you doing?"
      },
      {
        "textbook": "ಇಲ್ಲಿಗೆ ಬನ್ನಿ",
        "regional": "ಇಲ್ಲಿಗೆ ಬನ್ನಿ",
        "meaning": "Come here"
      },
      {
        "textbook": "ನನಗೆ ತಿಳಿದಿಲ್ಲ",
        "regional": "ನನಗೆ ಗೊತ್ತಿಲ್ಲ",
        "meaning": "I don't know"
      },
      {
        "textbook": "ನಾನು ಮನೆಗೆ ಹೋಗುತ್ತಿದ್ದೇನೆ",
        "regional": "ನಾನು ಮನೆಗೆ ಹೋಗ್ತಾ ಇದೀನಿ",
        "meaning": "I am going home"
      },
      {
        "textbook": "ನಿಮ್ಮ ಹೆಸರು ಏನು?",
        "regional": "ನಿಮ್ಮ ಹೆಸರೇನು?",
        "meaning": "What is your name?"
      },
      {
        "textbook": "ಇದರ ಬೆಲೆ ಎಷ್ಟು?",
        "regional": "ಇದಕ್ಕೆ ಎಷ್ಟು?",
        "meaning": "How much does this cost?"
      }
    ]
  },
  "dakshina_ghats": {
    "regionId": "dakshina_ghats",
    "name": "ದಕ್ಷಿಣ ಹೆಬ್ಬಾಗಿಲು",
    "nameKannada": "ದಕ್ಷಿಣ ಹೆಬ್ಬಾಗಿಲು (ಹಾಸನ - ರಾಮನಗರ)",
    "districts": [
      "Hassan",
      "Ramanagara"
    ],
    "colorClass": "text-red-700",
    "badgeBg": "bg-red-100 text-red-950 border-red-300",
    "highlightHex": "#FFE500",
    "description": "ಹೊಯ್ಸಳ ಶಿಲ್ಪಕಲೆ ಹಾಗೂ ರೇಷ್ಮೆ ಗೂಡಿನ ನಾಡು. ಮಲೆನಾಡಿನ ಶಾಂತತೆ ಮತ್ತು ರಾಜಧಾನಿ ಗಡಿಯ ವೇಗದ ನುಡಿ ಸಂಗಮ.",
    "phrases": [
      {
        "textbook": "ಹೆಚ್ಚು",
        "regional": "ಜಾಸ್ತಿ",
        "meaning": "more; much"
      },
      {
        "textbook": "ಕಡಿಮೆ",
        "regional": "ಕಮ್ಮಿ",
        "meaning": "less; little"
      },
      {
        "textbook": "ಇಂದು",
        "regional": "ಇವತ್ತು",
        "meaning": "today"
      },
      {
        "textbook": "ಮಾರುಕಟ್ಟೆ",
        "regional": "ಸಂತೆ",
        "meaning": "market"
      },
      {
        "textbook": "ನೀವು ಹೇಗಿದ್ದೀರಿ?",
        "regional": "ನೀವ್ ಹೆಂಗಿದೀರಾ?",
        "meaning": "How are you?"
      },
      {
        "textbook": "ನೀವು ಎಲ್ಲಿಗೆ ಹೋಗುತ್ತಿದ್ದೀರಿ?",
        "regional": "ಎಲ್ಲಿಗ್ ಹೋಗ್ತಾಯಿದ್ದೀಯಪ್ಪ?",
        "meaning": "Where are you going?"
      },
      {
        "textbook": "ನೀವು ಊಟ ಮಾಡಿದ್ದೀರಾ?",
        "regional": "ಊಟ ಆಯ್ತೇನಪ್ಪ?",
        "meaning": "Have you eaten?"
      },
      {
        "textbook": "ನೀವು ಏನು ಮಾಡುತ್ತಿದ್ದೀರಿ?",
        "regional": "ಏನ್ ಮಾಡ್ತಾಯಿದೀಯಾ?",
        "meaning": "What are you doing?"
      },
      {
        "textbook": "ಇಲ್ಲಿಗೆ ಬನ್ನಿ",
        "regional": "ಇಲ್ ಬಾರಪ್ಪ",
        "meaning": "Come here"
      },
      {
        "textbook": "ನನಗೆ ತಿಳಿದಿಲ್ಲ",
        "regional": "ನಂಗ್ ಗೊತ್ತಿಲ್ಲ ಕಣಪ್ಪ",
        "meaning": "I don't know"
      },
      {
        "textbook": "ನಾನು ಮನೆಗೆ ಹೋಗುತ್ತಿದ್ದೇನೆ",
        "regional": "ನಾನ್ ಮನೆಗ್ ಹೋಯ್ತಾಯಿದೀನಿ",
        "meaning": "I am going home"
      },
      {
        "textbook": "ನಿಮ್ಮ ಹೆಸರು ಏನು?",
        "regional": "ನಿನ್ ಹೆಸರೇನಪ್ಪಾ?",
        "meaning": "What is your name?"
      }
    ]
  },
  "kolar_bengaluru": {
    "regionId": "kolar_bengaluru",
    "name": "ಪೂರ್ವ ಗಡಿ ಪ್ರಸ್ಥಭೂಮಿ",
    "nameKannada": "ಪೂರ್ವ ಗಡಿ ಪ್ರಸ್ಥಭೂಮಿ (ಬೆಂಗಳೂರು - ಕೋಲಾರ - ಚಿಕ್ಕಬಳ್ಳಾಪುರ)",
    "districts": [
      "Bengaluru Urban",
      "Bengaluru Rural",
      "Kolar",
      "Chikkaballapura"
    ],
    "colorClass": "text-red-700",
    "badgeBg": "bg-red-100 text-red-950 border-red-300",
    "highlightHex": "#FFE500",
    "description": "ರಾಜಧಾನಿ ಮಹಾನಗರ ಹಾಗೂ ಪೂರ್ವ ಪ್ರಸ್ಥಭೂಮಿ. ತೆಲುಗು-ತಮಿಳು ಗಡಿ ಸಂಪರ್ಕ, ಆಧುನಿಕ ಆಡುಮಾತು ಹಾಗೂ 'ಮಚ್ಚಾ/ಗುರು' ಶೈಲಿಯ ಬೆಂಗಳೂರು ಕನ್ನಡ.",
    "phrases": [
      {
        "textbook": "ನಾನು",
        "regional": "ನಾನ್",
        "meaning": "I"
      },
      {
        "textbook": "ಹೆಚ್ಚು",
        "regional": "ಜಾಸ್ತಿ",
        "meaning": "more; much"
      },
      {
        "textbook": "ಕಡಿಮೆ",
        "regional": "ಕಮ್ಮಿ",
        "meaning": "less; little"
      },
      {
        "textbook": "ತುಂಬಾ",
        "regional": "ಫುಲ್",
        "meaning": "very; a lot"
      },
      {
        "textbook": "ಇಂದು",
        "regional": "ಇವತ್ತು",
        "meaning": "today"
      },
      {
        "textbook": "ಮಾರುಕಟ್ಟೆ",
        "regional": "ಮಾರ್ಕೆಟ್",
        "meaning": "market"
      },
      {
        "textbook": "ಬೆಲೆ",
        "regional": "ರೇಟ್",
        "meaning": "price"
      },
      {
        "textbook": "ನೀವು ಹೇಗಿದ್ದೀರಿ?",
        "regional": "ನೀವ್ ಹೆಂಗಿದ್ದೀರಾ?",
        "meaning": "How are you?"
      },
      {
        "textbook": "ನೀವು ಎಲ್ಲಿಗೆ ಹೋಗುತ್ತಿದ್ದೀರಿ?",
        "regional": "ಎಲ್ಲಿಗ್ ಹೋಗ್ತಿದೀಯಾ?",
        "meaning": "Where are you going?"
      },
      {
        "textbook": "ನೀವು ಊಟ ಮಾಡಿದ್ದೀರಾ?",
        "regional": "ಊಟ ಆಯ್ತಾ?",
        "meaning": "Have you eaten?"
      },
      {
        "textbook": "ನೀವು ಏನು ಮಾಡುತ್ತಿದ್ದೀರಿ?",
        "regional": "ಏನ್ ಮಾಡ್ತಿದೀಯಾ?",
        "meaning": "What are you doing?"
      },
      {
        "textbook": "ಇಲ್ಲಿಗೆ ಬನ್ನಿ",
        "regional": "ಇಲ್ ಬನ್ನಿ",
        "meaning": "Come here"
      }
    ]
  }
};

export const STATIC_REGIONS_LIST: StaticRegionData[] = Object.values(STATIC_REGION_MAP);
