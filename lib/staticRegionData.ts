/**
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
        "textbook": "ನೀವು ಹೇಗಿದ್ದೀರಿ?",
        "regional": "ನೀವ್ ಹ್ಯಾಂಗದೀರಿ?",
        "meaning": "How are you?"
      },
      {
        "textbook": "ನೀವು ಎಲ್ಲಿಗೆ ಹೋಗುತ್ತಿದ್ದೀರಿ?",
        "regional": "ಎಲ್ಲಿಗ್ ಹೊಂಟೀರಿ?",
        "meaning": "Where are you going?"
      },
      {
        "textbook": "ನೀವು ಊಟ ಮಾಡಿದ್ದೀರಾ?",
        "regional": "ಉಂಡೀರಾ?",
        "meaning": "Have you eaten?"
      },
      {
        "textbook": "ನೀವು ಏನು ಮಾಡುತ್ತಿದ್ದೀರಿ?",
        "regional": "ಏನ್ ಮಾಡಕತ್ತೀರಿ?",
        "meaning": "What are you doing?"
      },
      {
        "textbook": "ಇಲ್ಲಿಗೆ ಬನ್ನಿ.",
        "regional": "ಇಲ್ ಬನ್ರಿ.",
        "meaning": "Come here."
      },
      {
        "textbook": "ನನಗೆ ತಿಳಿದಿಲ್ಲ.",
        "regional": "ನನಗ್ ಗೊತ್ತಿಲ್ರಿ.",
        "meaning": "I don't know."
      },
      {
        "textbook": "ನಾನು ಮನೆಗೆ ಹೋಗುತ್ತಿದ್ದೇನೆ.",
        "regional": "ನಾ ಮನೆಗ್ ಹೊಂಟೇನಿ.",
        "meaning": "I am going home."
      },
      {
        "textbook": "ನಿಮ್ಮ ಹೆಸರು ಏನು?",
        "regional": "ನಿಮ್ ಹೆಸರೇನ್ರಿ?",
        "meaning": "What is your name?"
      },
      {
        "textbook": "ಇದರ ಬೆಲೆ ಎಷ್ಟು?",
        "regional": "ಇದಕ್ಕ ಎಷ್ಟ್ರಿ?",
        "meaning": "How much does this cost?"
      },
      {
        "textbook": "ನನಗೆ ನೀರು ಬೇಕು.",
        "regional": "ನನಗ್ ನೀರ್ ಬೇಕ್ರಿ.",
        "meaning": "I want water."
      },
      {
        "textbook": "ನಿಮಗೆ ಅರ್ಥವಾಯಿತೇ?",
        "regional": "ತಿಳೀತ್ರಿ?",
        "meaning": "Did you understand?"
      },
      {
        "textbook": "ಕುಳಿತುಕೊಳ್ಳಿ.",
        "regional": "ಕುಂದ್ರಿ.",
        "meaning": "Sit down."
      },
      {
        "textbook": "ಅದನ್ನು ನನಗೆ ಕೊಡಿ.",
        "regional": "ಅದನ್ನ ನನಗ್ ಕೊಡ್ರಿ.",
        "meaning": "Give it to me."
      },
      {
        "textbook": "ಮಳೆ ಬರುತ್ತಿದೆಯೇ?",
        "regional": "ಮಳಿ ಬರಕತ್ತೈತ್ರಿ?",
        "meaning": "Is it raining?"
      },
      {
        "textbook": "ನಾಳೆ ಸಿಗೋಣ.",
        "regional": "ನಾಳಿ ಭೆಟ್ಟಿ ಆಗೋಣ.",
        "meaning": "See you tomorrow."
      },
      {
        "textbook": "ಮಾತನಾಡಬೇಡಿ.",
        "regional": "ಮಾತಾಡಬ್ಯಾಡ್ರಿ.",
        "meaning": "Don't talk."
      },
      {
        "textbook": "ನನಗೆ ಹಸಿವಾಗುತ್ತಿದೆ.",
        "regional": "ನನಗ್ ಹಸಿವ್ ಆಗೈತ್ರಿ.",
        "meaning": "I am hungry."
      },
      {
        "textbook": "ನೀವು ಏಕೆ ಬಂದಿರಿ?",
        "regional": "ಯಾಕ್ ಬಂದ್ರಿ?",
        "meaning": "Why did you come?"
      },
      {
        "textbook": "ಅವನು ಏನು ಹೇಳಿದನು?",
        "regional": "ಅವಾ ಏನ್ ಅಂದ್ರಾ?",
        "meaning": "What did he say?"
      },
      {
        "textbook": "ಇದನ್ನು ತೆಗೆದುಕೊಳ್ಳಿ.",
        "regional": "ಇದನ್ ತಗೋರಿ.",
        "meaning": "Take this."
      },
      {
        "textbook": "ನನಗೆ ಇದು ಬೇಡ.",
        "regional": "ನನಗ್ ಬ್ಯಾಡ್ರಿ.",
        "meaning": "I don't want it."
      },
      {
        "textbook": "ಒಂದು ನಿಮಿಷ ಕಾಯಿರಿ.",
        "regional": "ಒಂದ್ ನಿಮಿಷ ತಡೀರಿ.",
        "meaning": "Wait a minute."
      },
      {
        "textbook": "ನೀವು ನನ್ನೊಂದಿಗೆ ಬರುತ್ತೀರಾ?",
        "regional": "ನನ್ ಜೋಡಿ ಬರ್ತೀರಾ?",
        "meaning": "Will you come with me?"
      },
      {
        "textbook": "ನೀವು ಯಾವಾಗ ಬರುತ್ತೀರಿ?",
        "regional": "ಯಾವಾಗ್ ಬರ್ತೀರಿ?",
        "meaning": "When will you come?"
      },
      {
        "textbook": "ಬಸ್ / ರೈಲು ಎಲ್ಲಿದೆ?",
        "regional": "ಬಸ್/ಟ್ರೈನ್ ಎಲ್ಲಿ ಐತ್ರಿ?",
        "meaning": "Where is the bus/train?"
      },
      {
        "textbook": "ವೇಗವಾಗಿ ಹೋಗಿ.",
        "regional": "ಜಲ್ದಿ ಹೋಗ್ರಿ.",
        "meaning": "Go fast."
      },
      {
        "textbook": "ನಾನು ಮರೆತುಬಿಟ್ಟೆ.",
        "regional": "ನಾ ಮರ್ತೇನ್ರಿ.",
        "meaning": "I forgot."
      },
      {
        "textbook": "ನಾವು ಹೋಗೋಣ.",
        "regional": "ನಡ್ರಿ ಹೋಗೋಣ.",
        "meaning": "Let's go."
      },
      {
        "textbook": "ಏನು ನಡೆಯುತ್ತಿದೆ?",
        "regional": "ಏನ್ ನಡದೈತ್ರಿ?",
        "meaning": "What is happening?"
      },
      {
        "textbook": "ಅವನು ಮಲಗಿದ್ದಾನೆ.",
        "regional": "ಅವಾ ಮಕ್ಕೊಂಡಾನ್ರಿ.",
        "meaning": "He is sleeping."
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
        "textbook": "ನೀವು ಹೇಗಿದ್ದೀರಿ?",
        "regional": "ನೀವ್ ಹೆಂಗಿದೀರಿ?",
        "meaning": "How are you?"
      },
      {
        "textbook": "ನೀವು ಎಲ್ಲಿಗೆ ಹೋಗುತ್ತಿದ್ದೀರಿ?",
        "regional": "ಎಲ್ಲಿಗ್ ಹೊಂಟಿ?",
        "meaning": "Where are you going?"
      },
      {
        "textbook": "ನೀವು ಊಟ ಮಾಡಿದ್ದೀರಾ?",
        "regional": "ಉಂಡ್ಯಾ?",
        "meaning": "Have you eaten?"
      },
      {
        "textbook": "ನೀವು ಏನು ಮಾಡುತ್ತಿದ್ದೀರಿ?",
        "regional": "ಏನ್ ಮಾಡಕತ್ತಿ?",
        "meaning": "What are you doing?"
      },
      {
        "textbook": "ಇಲ್ಲಿಗೆ ಬನ್ನಿ.",
        "regional": "ಇಲ್ ಬಾ.",
        "meaning": "Come here."
      },
      {
        "textbook": "ನನಗೆ ತಿಳಿದಿಲ್ಲ.",
        "regional": "ನನಗ್ ಗೊತ್ತಿಲ್ಲ.",
        "meaning": "I don't know."
      },
      {
        "textbook": "ನಾನು ಮನೆಗೆ ಹೋಗುತ್ತಿದ್ದೇನೆ.",
        "regional": "ನಾ ಮನೆಗ್ ಹೊಂಟೇನಿ.",
        "meaning": "I am going home."
      },
      {
        "textbook": "ನಿಮ್ಮ ಹೆಸರು ಏನು?",
        "regional": "ನಿನ್ ಹೆಸರೇನು?",
        "meaning": "What is your name?"
      },
      {
        "textbook": "ಇದರ ಬೆಲೆ ಎಷ್ಟು?",
        "regional": "ಇದಕ್ಕ ಎಷ್ಟು?",
        "meaning": "How much does this cost?"
      },
      {
        "textbook": "ನನಗೆ ನೀರು ಬೇಕು.",
        "regional": "ನನಗ್ ನೀರ್ ಬೇಕು.",
        "meaning": "I want water."
      },
      {
        "textbook": "ನಿಮಗೆ ಅರ್ಥವಾಯಿತೇ?",
        "regional": "ತಿಳೀತಾ?",
        "meaning": "Did you understand?"
      },
      {
        "textbook": "ಕುಳಿತುಕೊಳ್ಳಿ.",
        "regional": "ಕುಂದ್ರು.",
        "meaning": "Sit down."
      },
      {
        "textbook": "ಅದನ್ನು ನನಗೆ ಕೊಡಿ.",
        "regional": "ಅದನ್ನ ನನಗ್ ಕೊಡು.",
        "meaning": "Give it to me."
      },
      {
        "textbook": "ಮಳೆ ಬರುತ್ತಿದೆಯೇ?",
        "regional": "ಮಳಿ ಬರಕತ್ತೈತಾ?",
        "meaning": "Is it raining?"
      },
      {
        "textbook": "ನಾಳೆ ಸಿಗೋಣ.",
        "regional": "ನಾಳಿ ಭೆಟ್ಟಿ ಆಗೋಣ.",
        "meaning": "See you tomorrow."
      },
      {
        "textbook": "ಮಾತನಾಡಬೇಡಿ.",
        "regional": "ಮಾತಾಡಬ್ಯಾಡ.",
        "meaning": "Don't talk."
      },
      {
        "textbook": "ನನಗೆ ಹಸಿವಾಗುತ್ತಿದೆ.",
        "regional": "ನನಗ್ ಹಸಿವ್ ಆಗೈತಿ.",
        "meaning": "I am hungry."
      },
      {
        "textbook": "ನೀವು ಏಕೆ ಬಂದಿರಿ?",
        "regional": "ಯಾಕ್ ಬಂದಿ?",
        "meaning": "Why did you come?"
      },
      {
        "textbook": "ಅವನು ಏನು ಹೇಳಿದನು?",
        "regional": "ಅವ ಏನ್ ಅಂದ?",
        "meaning": "What did he say?"
      },
      {
        "textbook": "ಇದನ್ನು ತೆಗೆದುಕೊಳ್ಳಿ.",
        "regional": "ಇದನ್ ತಗೋ.",
        "meaning": "Take this."
      },
      {
        "textbook": "ನನಗೆ ಇದು ಬೇಡ.",
        "regional": "ನನಗ್ ಬ್ಯಾಡ.",
        "meaning": "I don't want it."
      },
      {
        "textbook": "ಒಂದು ನಿಮಿಷ ಕಾಯಿರಿ.",
        "regional": "ಒಂದ್ ನಿಮಿಷ ತಡಿ.",
        "meaning": "Wait a minute."
      },
      {
        "textbook": "ನೀವು ನನ್ನೊಂದಿಗೆ ಬರುತ್ತೀರಾ?",
        "regional": "ನನ್ ಜೋಡಿ ಬರ್ತಿಯಾ?",
        "meaning": "Will you come with me?"
      },
      {
        "textbook": "ನೀವು ಯಾವಾಗ ಬರುತ್ತೀರಿ?",
        "regional": "ಯಾವಾಗ್ ಬರ್ತಿ?",
        "meaning": "When will you come?"
      },
      {
        "textbook": "ಬಸ್ / ರೈಲು ಎಲ್ಲಿದೆ?",
        "regional": "ಬಸ್/ಟ್ರೈನ್ ಎಲ್ಲಿ ಐತಿ?",
        "meaning": "Where is the bus/train?"
      },
      {
        "textbook": "ವೇಗವಾಗಿ ಹೋಗಿ.",
        "regional": "ಜಲ್ದಿ ಹೋಗು.",
        "meaning": "Go fast."
      },
      {
        "textbook": "ನಾನು ಮರೆತುಬಿಟ್ಟೆ.",
        "regional": "ನಾ ಮರ್ತೆ.",
        "meaning": "I forgot."
      },
      {
        "textbook": "ನಾವು ಹೋಗೋಣ.",
        "regional": "ನಡಿ ಹೋಗೋಣ.",
        "meaning": "Let's go."
      },
      {
        "textbook": "ಏನು ನಡೆಯುತ್ತಿದೆ?",
        "regional": "ಏನ್ ನಡದೈತಿ?",
        "meaning": "What is happening?"
      },
      {
        "textbook": "ಅವನು ಮಲಗಿದ್ದಾನೆ.",
        "regional": "ಅವ ಮಕ್ಕೊಂಡಾನ.",
        "meaning": "He is sleeping."
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
        "textbook": "ನೀವು ಹೇಗಿದ್ದೀರಿ?",
        "regional": "ನೀವು ಹ್ಯಾಂಗಿದ್ದೀರಿ?",
        "meaning": "How are you?"
      },
      {
        "textbook": "ನೀವು ಎಲ್ಲಿಗೆ ಹೋಗುತ್ತಿದ್ದೀರಿ?",
        "regional": "ಎಲ್ಲಿಗ್ಯಾ ಹೊಂಟೀದಿ?",
        "meaning": "Where are you going?"
      },
      {
        "textbook": "ನೀವು ಊಟ ಮಾಡಿದ್ದೀರಾ?",
        "regional": "ಉಂಡಿಯೇನೆ?",
        "meaning": "Have you eaten?"
      },
      {
        "textbook": "ನೀವು ಏನು ಮಾಡುತ್ತಿದ್ದೀರಿ?",
        "regional": "ಏನ್ ಮಾಡತೀದಿ?",
        "meaning": "What are you doing?"
      },
      {
        "textbook": "ಇಲ್ಲಿಗೆ ಬನ್ನಿ.",
        "regional": "ಇಲ್ಲಿಗ್ ಬಾರಾ.",
        "meaning": "Come here."
      },
      {
        "textbook": "ನನಗೆ ತಿಳಿದಿಲ್ಲ.",
        "regional": "ನನಗೇನ್ ಗೊತ್ತದ.",
        "meaning": "I don't know."
      },
      {
        "textbook": "ನಾನು ಮನೆಗೆ ಹೋಗುತ್ತಿದ್ದೇನೆ.",
        "regional": "ನಾ ಮನ್ಯಾಗ ಹೊಂಟೇನಿ.",
        "meaning": "I am going home."
      },
      {
        "textbook": "ನಿಮ್ಮ ಹೆಸರು ಏನು?",
        "regional": "ನಿನ್ನ ಹೆಸರೇನಪಾ?",
        "meaning": "What is your name?"
      },
      {
        "textbook": "ಇದರ ಬೆಲೆ ಎಷ್ಟು?",
        "regional": "ಇದಕ್ಕ ಎಷ್ಟಾಗೇದ?",
        "meaning": "How much does this cost?"
      },
      {
        "textbook": "ನನಗೆ ನೀರು ಬೇಕು.",
        "regional": "ನನಗ ನೀರ್ ಬೇಕ್ರಿ.",
        "meaning": "I want water."
      },
      {
        "textbook": "ನಿಮಗೆ ಅರ್ಥವಾಯಿತೇ?",
        "regional": "ತಿಳಿಯಿತೇನು?",
        "meaning": "Did you understand?"
      },
      {
        "textbook": "ಕುಳಿತುಕೊಳ್ಳಿ.",
        "regional": "ಕುಂತ್ಕೋ.",
        "meaning": "Sit down."
      },
      {
        "textbook": "ಅದನ್ನು ನನಗೆ ಕೊಡಿ.",
        "regional": "ಅದನ್ ನನಗ ಕೊಡು.",
        "meaning": "Give it to me."
      },
      {
        "textbook": "ಮಳೆ ಬರುತ್ತಿದೆಯೇ?",
        "regional": "ಮಳಿ ಬರತೈತೇನು?",
        "meaning": "Is it raining?"
      },
      {
        "textbook": "ನಾಳೆ ಸಿಗೋಣ.",
        "regional": "ನಾಳಿಗ ಭೆಟ್ಟಿ ಆಗೋಣ.",
        "meaning": "See you tomorrow."
      },
      {
        "textbook": "ಮಾತನಾಡಬೇಡಿ.",
        "regional": "ಮಾತಾಡಬ್ಯಾಡ.",
        "meaning": "Don't talk."
      },
      {
        "textbook": "ನನಗೆ ಹಸಿವಾಗುತ್ತಿದೆ.",
        "regional": "ನನಗ ಹಸಿವ್ ಆಗೇದ.",
        "meaning": "I am hungry."
      },
      {
        "textbook": "ನೀವು ಏಕೆ ಬಂದಿರಿ?",
        "regional": "ಯಾಕ ಬಂದಿದ್ದಿ?",
        "meaning": "Why did you come?"
      },
      {
        "textbook": "ಅವನು ಏನು ಹೇಳಿದನು?",
        "regional": "ಅವಾ ಏನ್ ಅಂದಾ?",
        "meaning": "What did he say?"
      },
      {
        "textbook": "ಇದನ್ನು ತೆಗೆದುಕೊಳ್ಳಿ.",
        "regional": "ಇದನ್ನ ತಗೋ.",
        "meaning": "Take this."
      },
      {
        "textbook": "ನನಗೆ ಇದು ಬೇಡ.",
        "regional": "ನನಗ ಬ್ಯಾಡ.",
        "meaning": "I don't want it."
      },
      {
        "textbook": "ಒಂದು ನಿಮಿಷ ಕಾಯಿರಿ.",
        "regional": "ಒಂದ್ ನಿಮಿಷ ತಡಿ.",
        "meaning": "Wait a minute."
      },
      {
        "textbook": "ನೀವು ನನ್ನೊಂದಿಗೆ ಬರುತ್ತೀರಾ?",
        "regional": "ನನ್ ಸಂಗಟ ಬರ್ತೀಯೇನು?",
        "meaning": "Will you come with me?"
      },
      {
        "textbook": "ನೀವು ಯಾವಾಗ ಬರುತ್ತೀರಿ?",
        "regional": "ಯಾವಾಗ ಬರ್ತಿದಿ?",
        "meaning": "When will you come?"
      },
      {
        "textbook": "ಬಸ್ / ರೈಲು ಎಲ್ಲಿದೆ?",
        "regional": "ಬಸ್/ಟ್ರೈನ್ ಎಲ್ಲಿ ಅದ?",
        "meaning": "Where is the bus/train?"
      },
      {
        "textbook": "ವೇಗವಾಗಿ ಹೋಗಿ.",
        "regional": "ಜಲ್ದಿ ಹೋಗು.",
        "meaning": "Go fast."
      },
      {
        "textbook": "ನಾನು ಮರೆತುಬಿಟ್ಟೆ.",
        "regional": "ನಾ ಮರೆತುಬಿಟ್ಟೆ.",
        "meaning": "I forgot."
      },
      {
        "textbook": "ನಾವು ಹೋಗೋಣ.",
        "regional": "ನಡಿ ಹೋಗೋಣ.",
        "meaning": "Let's go."
      },
      {
        "textbook": "ಏನು ನಡೆಯುತ್ತಿದೆ?",
        "regional": "ಏನು ನಡೆಯಕತ್ತೇದ?",
        "meaning": "What is happening?"
      },
      {
        "textbook": "ಅವನು ಮಲಗಿದ್ದಾನೆ.",
        "regional": "ಅವಾ ಮಕ್ಕೊಂಡಾನ.",
        "meaning": "He is sleeping."
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
        "textbook": "ನೀವು ಹೇಗಿದ್ದೀರಿ?",
        "regional": "ಹೆಂಗಿದಿಪಾ?",
        "meaning": "How are you?"
      },
      {
        "textbook": "ನೀವು ಎಲ್ಲಿಗೆ ಹೋಗುತ್ತಿದ್ದೀರಿ?",
        "regional": "ಎಲ್ಲಿಗ್ ಹೊಂಟಿದಿ?",
        "meaning": "Where are you going?"
      },
      {
        "textbook": "ನೀವು ಊಟ ಮಾಡಿದ್ದೀರಾ?",
        "regional": "ಊಟ ಆತೇನ್ರಿ?",
        "meaning": "Have you eaten?"
      },
      {
        "textbook": "ನೀವು ಏನು ಮಾಡುತ್ತಿದ್ದೀರಿ?",
        "regional": "ಏನ್ ಮಾಡಕತ್ತಿದಿ?",
        "meaning": "What are you doing?"
      },
      {
        "textbook": "ಇಲ್ಲಿಗೆ ಬನ್ನಿ.",
        "regional": "ಇಲ್ ಬಾಪಾ.",
        "meaning": "Come here."
      },
      {
        "textbook": "ನನಗೆ ತಿಳಿದಿಲ್ಲ.",
        "regional": "ನನಗ ಗೊತ್ತಿಲ್ರಿ.",
        "meaning": "I don't know."
      },
      {
        "textbook": "ನಾನು ಮನೆಗೆ ಹೋಗುತ್ತಿದ್ದೇನೆ.",
        "regional": "ನಾ ಮನೆಗ್ ಹೊಂಟೀನಿ.",
        "meaning": "I am going home."
      },
      {
        "textbook": "ನಿಮ್ಮ ಹೆಸರು ಏನು?",
        "regional": "ನಿಮ್ ಹೆಸರೇನ್ರಿ?",
        "meaning": "What is your name?"
      },
      {
        "textbook": "ಇದರ ಬೆಲೆ ಎಷ್ಟು?",
        "regional": "ಇದಕ್ಕ ಎಷ್ಟ್ರಿ?",
        "meaning": "How much does this cost?"
      },
      {
        "textbook": "ನನಗೆ ನೀರು ಬೇಕು.",
        "regional": "ನನಗ ನೀರ್ ಬೇಕು.",
        "meaning": "I want water."
      },
      {
        "textbook": "ನಿಮಗೆ ಅರ್ಥವಾಯಿತೇ?",
        "regional": "ತಿಳೀತಾ?",
        "meaning": "Did you understand?"
      },
      {
        "textbook": "ಕುಳಿತುಕೊಳ್ಳಿ.",
        "regional": "ಕುಂದ್ರಪಾ.",
        "meaning": "Sit down."
      },
      {
        "textbook": "ಅದನ್ನು ನನಗೆ ಕೊಡಿ.",
        "regional": "ಅದನ್ನ ನನಗ ಕೊಡು.",
        "meaning": "Give it to me."
      },
      {
        "textbook": "ಮಳೆ ಬರುತ್ತಿದೆಯೇ?",
        "regional": "ಮಳಿ ಬರಕತ್ತೈತಾ?",
        "meaning": "Is it raining?"
      },
      {
        "textbook": "ನಾಳೆ ಸಿಗೋಣ.",
        "regional": "ನಾಳಿ ಭೆಟ್ಟಿ ಆಗೋಣ.",
        "meaning": "See you tomorrow."
      },
      {
        "textbook": "ಮಾತನಾಡಬೇಡಿ.",
        "regional": "ಮಾತಾಡಬ್ಯಾಡ್ರಿ.",
        "meaning": "Don't talk."
      },
      {
        "textbook": "ನನಗೆ ಹಸಿವಾಗುತ್ತಿದೆ.",
        "regional": "ನನಗ ಹಸಿವ್ ಆಗೇತಿ.",
        "meaning": "I am hungry."
      },
      {
        "textbook": "ನೀವು ಏಕೆ ಬಂದಿರಿ?",
        "regional": "ಯಾಕ್ ಬಂದಿಪಾ?",
        "meaning": "Why did you come?"
      },
      {
        "textbook": "ಅವನು ಏನು ಹೇಳಿದನು?",
        "regional": "ಅವ ಏನ್ ಅಂದ?",
        "meaning": "What did he say?"
      },
      {
        "textbook": "ಇದನ್ನು ತೆಗೆದುಕೊಳ್ಳಿ.",
        "regional": "ಇದನ್ ತಗೋ.",
        "meaning": "Take this."
      },
      {
        "textbook": "ನನಗೆ ಇದು ಬೇಡ.",
        "regional": "ನನಗ ಬ್ಯಾಡ್ರಿ.",
        "meaning": "I don't want it."
      },
      {
        "textbook": "ಒಂದು ನಿಮಿಷ ಕಾಯಿರಿ.",
        "regional": "ಒಂದ್ ನಿಮಿಷ ತಡಿಪಾ.",
        "meaning": "Wait a minute."
      },
      {
        "textbook": "ನೀವು ನನ್ನೊಂದಿಗೆ ಬರುತ್ತೀರಾ?",
        "regional": "ನನ್ ಜೋಡಿ ಬರ್ತಿಯಾ?",
        "meaning": "Will you come with me?"
      },
      {
        "textbook": "ನೀವು ಯಾವಾಗ ಬರುತ್ತೀರಿ?",
        "regional": "ಯಾವಾಗ್ ಬರ್ತಿ?",
        "meaning": "When will you come?"
      },
      {
        "textbook": "ಬಸ್ / ರೈಲು ಎಲ್ಲಿದೆ?",
        "regional": "ಬಸ್/ಟ್ರೈನ್ ಎಲ್ಲಿ ಐತಿ?",
        "meaning": "Where is the bus/train?"
      },
      {
        "textbook": "ವೇಗವಾಗಿ ಹೋಗಿ.",
        "regional": "ಜಲ್ದಿ ಹೋಗು.",
        "meaning": "Go fast."
      },
      {
        "textbook": "ನಾನು ಮರೆತುಬಿಟ್ಟೆ.",
        "regional": "ನಾ ಮರ್ತೀನಿ.",
        "meaning": "I forgot."
      },
      {
        "textbook": "ನಾವು ಹೋಗೋಣ.",
        "regional": "ನಡಿಪಾ ಹೋಗೋಣ.",
        "meaning": "Let's go."
      },
      {
        "textbook": "ಏನು ನಡೆಯುತ್ತಿದೆ?",
        "regional": "ಏನ್ ನಡದೈತಿ?",
        "meaning": "What is happening?"
      },
      {
        "textbook": "ಅವನು ಮಲಗಿದ್ದಾನೆ.",
        "regional": "ಅವ ಮಕ್ಕೊಂಡಾನ.",
        "meaning": "He is sleeping."
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
      },
      {
        "textbook": "ಇಲ್ಲಿಗೆ ಬನ್ನಿ.",
        "regional": "ಇಲ್ಲಿ ಬನ್ನಿ.",
        "meaning": "Come here."
      },
      {
        "textbook": "ನನಗೆ ತಿಳಿದಿಲ್ಲ.",
        "regional": "ನಂಗೆ ಗೊತ್ತಿಲ್ಲೆ.",
        "meaning": "I don't know."
      },
      {
        "textbook": "ನಾನು ಮನೆಗೆ ಹೋಗುತ್ತಿದ್ದೇನೆ.",
        "regional": "ನಾನು ಮನೆಗೆ ಹೋಪದು.",
        "meaning": "I am going home."
      },
      {
        "textbook": "ನಿಮ್ಮ ಹೆಸರು ಏನು?",
        "regional": "ನಿಮ್ಮ ಹೆಸರೆಂತಾ?",
        "meaning": "What is your name?"
      },
      {
        "textbook": "ಇದರ ಬೆಲೆ ಎಷ್ಟು?",
        "regional": "ಇದಕ್ಕೆ ಎಷ್ಟು?",
        "meaning": "How much does this cost?"
      },
      {
        "textbook": "ನನಗೆ ನೀರು ಬೇಕು.",
        "regional": "ನಂಗೆ ನೀರು ಬೇಕು.",
        "meaning": "I want water."
      },
      {
        "textbook": "ನಿಮಗೆ ಅರ್ಥವಾಯಿತೇ?",
        "regional": "ಗೊತ್ತಾಯ್ತಾ?",
        "meaning": "Did you understand?"
      },
      {
        "textbook": "ಕುಳಿತುಕೊಳ್ಳಿ.",
        "regional": "ಕೂತ್ಕೊಳ್ಳಿ.",
        "meaning": "Sit down."
      },
      {
        "textbook": "ಅದನ್ನು ನನಗೆ ಕೊಡಿ.",
        "regional": "ಅದನ್ನ ನಂಗೆ ಕೊಡಿ.",
        "meaning": "Give it to me."
      },
      {
        "textbook": "ಮಳೆ ಬರುತ್ತಿದೆಯೇ?",
        "regional": "ಮಳೆ ಬರ್ತಾ ಉಂಟಾ?",
        "meaning": "Is it raining?"
      },
      {
        "textbook": "ನಾಳೆ ಸಿಗೋಣ.",
        "regional": "ನಾಳೆ ಸಿಗುವಾ.",
        "meaning": "See you tomorrow."
      },
      {
        "textbook": "ಮಾತನಾಡಬೇಡಿ.",
        "regional": "ಮಾತಾಡಬೇಡಿ.",
        "meaning": "Don't talk."
      },
      {
        "textbook": "ನನಗೆ ಹಸಿವಾಗುತ್ತಿದೆ.",
        "regional": "ನಂಗೆ ಹಸಿವೆ ಆಗ್ತಾ ಉಂಟು.",
        "meaning": "I am hungry."
      },
      {
        "textbook": "ನೀವು ಏಕೆ ಬಂದಿರಿ?",
        "regional": "ಯಾಕೆ ಬಂದ್ರಿ?",
        "meaning": "Why did you come?"
      },
      {
        "textbook": "ಅವನು ಏನು ಹೇಳಿದನು?",
        "regional": "ಅವನು ಎಂತ ಹೇಳ್ದಾ?",
        "meaning": "What did he say?"
      },
      {
        "textbook": "ಇದನ್ನು ತೆಗೆದುಕೊಳ್ಳಿ.",
        "regional": "ಇದನ್ನ ತಗೊಳ್ಳಿ.",
        "meaning": "Take this."
      },
      {
        "textbook": "ನನಗೆ ಇದು ಬೇಡ.",
        "regional": "ನಂಗೆ ಬೇಡ.",
        "meaning": "I don't want it."
      },
      {
        "textbook": "ಒಂದು ನಿಮಿಷ ಕಾಯಿರಿ.",
        "regional": "ಒಂದು ನಿಮಿಷ ಇರಿ.",
        "meaning": "Wait a minute."
      },
      {
        "textbook": "ನೀವು ನನ್ನೊಂದಿಗೆ ಬರುತ್ತೀರಾ?",
        "regional": "ನನ್ನ ಜೊತೆ ಬರ್ತೀರಾ?",
        "meaning": "Will you come with me?"
      },
      {
        "textbook": "ನೀವು ಯಾವಾಗ ಬರುತ್ತೀರಿ?",
        "regional": "ಯಾವಾಗ ಬರ್ತೀರಿ?",
        "meaning": "When will you come?"
      },
      {
        "textbook": "ಬಸ್ / ರೈಲು ಎಲ್ಲಿದೆ?",
        "regional": "ಬಸ್/ಟ್ರೈನ್ ಎಲ್ಲಿ ಉಂಟು?",
        "meaning": "Where is the bus/train?"
      },
      {
        "textbook": "ವೇಗವಾಗಿ ಹೋಗಿ.",
        "regional": "ಬೇಗ ಹೋಗಿ.",
        "meaning": "Go fast."
      },
      {
        "textbook": "ನಾನು ಮರೆತುಬಿಟ್ಟೆ.",
        "regional": "ನಾನು ಮರೆತುಹೋದೆ.",
        "meaning": "I forgot."
      },
      {
        "textbook": "ನಾವು ಹೋಗೋಣ.",
        "regional": "ಹೋಗೋಣ ಬನ್ನಿ.",
        "meaning": "Let's go."
      },
      {
        "textbook": "ಏನು ನಡೆಯುತ್ತಿದೆ?",
        "regional": "ಎಂತ ಆಗ್ತಾ ಉಂಟು?",
        "meaning": "What is happening?"
      },
      {
        "textbook": "ಅವನು ಮಲಗಿದ್ದಾನೆ.",
        "regional": "ಅವನು ಮಲಗಿದ್ದಾನೆ.",
        "meaning": "He is sleeping."
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
        "textbook": "ಇಲ್ಲಿಗೆ ಬನ್ನಿ.",
        "regional": "ಇಲ್ಲಿಗೆ ಬಾ.",
        "meaning": "Come here."
      },
      {
        "textbook": "ನನಗೆ ತಿಳಿದಿಲ್ಲ.",
        "regional": "ನಂಗ್ ಗೊತ್ತಿಲ್ಲ.",
        "meaning": "I don't know."
      },
      {
        "textbook": "ನಾನು ಮನೆಗೆ ಹೋಗುತ್ತಿದ್ದೇನೆ.",
        "regional": "ನಾನ್ ಮನೆಗೆ ಹೋಗ್ತಿದ್ದೀನಿ.",
        "meaning": "I am going home."
      },
      {
        "textbook": "ನಿಮ್ಮ ಹೆಸರು ಏನು?",
        "regional": "ನಿನ್ ಹೆಸರೇನು?",
        "meaning": "What is your name?"
      },
      {
        "textbook": "ಇದರ ಬೆಲೆ ಎಷ್ಟು?",
        "regional": "ಇದಕ್ಕೆ ಎಷ್ಟು?",
        "meaning": "How much does this cost?"
      },
      {
        "textbook": "ನನಗೆ ನೀರು ಬೇಕು.",
        "regional": "ನಂಗೆ ನೀರು ಬೇಕು.",
        "meaning": "I want water."
      },
      {
        "textbook": "ನಿಮಗೆ ಅರ್ಥವಾಯಿತೇ?",
        "regional": "ಅರ್ಥ ಆಯ್ತಾ?",
        "meaning": "Did you understand?"
      },
      {
        "textbook": "ಕುಳಿತುಕೊಳ್ಳಿ.",
        "regional": "ಕೂತ್ಕೋ.",
        "meaning": "Sit down."
      },
      {
        "textbook": "ಅದನ್ನು ನನಗೆ ಕೊಡಿ.",
        "regional": "ಅದನ್ನ ನಂಗೆ ಕೊಡು.",
        "meaning": "Give it to me."
      },
      {
        "textbook": "ಮಳೆ ಬರುತ್ತಿದೆಯೇ?",
        "regional": "ಮಳೆ ಬರ್ತಿದ್ಯಾ?",
        "meaning": "Is it raining?"
      },
      {
        "textbook": "ನಾಳೆ ಸಿಗೋಣ.",
        "regional": "ನಾಳೆ ಸಿಗೋಣ.",
        "meaning": "See you tomorrow."
      },
      {
        "textbook": "ಮಾತನಾಡಬೇಡಿ.",
        "regional": "ಮಾತಾಡ್ಬೇಡ.",
        "meaning": "Don't talk."
      },
      {
        "textbook": "ನನಗೆ ಹಸಿವಾಗುತ್ತಿದೆ.",
        "regional": "ನಂಗ್ ಹಸಿವಾಗ್ತಿದೆ.",
        "meaning": "I am hungry."
      },
      {
        "textbook": "ನೀವು ಏಕೆ ಬಂದಿರಿ?",
        "regional": "ಯಾಕ್ ಬಂದೆ?",
        "meaning": "Why did you come?"
      },
      {
        "textbook": "ಅವನು ಏನು ಹೇಳಿದನು?",
        "regional": "ಅವ್ನು ಏನ್ ಹೇಳ್ದ?",
        "meaning": "What did he say?"
      },
      {
        "textbook": "ಇದನ್ನು ತೆಗೆದುಕೊಳ್ಳಿ.",
        "regional": "ಇದನ್ನ ತಗೋ.",
        "meaning": "Take this."
      },
      {
        "textbook": "ನನಗೆ ಇದು ಬೇಡ.",
        "regional": "ನಂಗ್ ಬೇಡ.",
        "meaning": "I don't want it."
      },
      {
        "textbook": "ಒಂದು ನಿಮಿಷ ಕಾಯಿರಿ.",
        "regional": "ಒಂದ್ ನಿಮಿಷ ಇರು.",
        "meaning": "Wait a minute."
      },
      {
        "textbook": "ನೀವು ನನ್ನೊಂದಿಗೆ ಬರುತ್ತೀರಾ?",
        "regional": "ನನ್ ಜೊತೆ ಬರ್ತೀಯಾ?",
        "meaning": "Will you come with me?"
      },
      {
        "textbook": "ನೀವು ಯಾವಾಗ ಬರುತ್ತೀರಿ?",
        "regional": "ಯಾವಾಗ್ ಬರ್ತೀಯಾ?",
        "meaning": "When will you come?"
      },
      {
        "textbook": "ಬಸ್ / ರೈಲು ಎಲ್ಲಿದೆ?",
        "regional": "ಬಸ್/ಟ್ರೈನ್ ಎಲ್ಲಿದೆ?",
        "meaning": "Where is the bus/train?"
      },
      {
        "textbook": "ವೇಗವಾಗಿ ಹೋಗಿ.",
        "regional": "ಬೇಗ ಹೋಗು.",
        "meaning": "Go fast."
      },
      {
        "textbook": "ನಾನು ಮರೆತುಬಿಟ್ಟೆ.",
        "regional": "ನಾನ್ ಮರೆತುಹೋದೆ.",
        "meaning": "I forgot."
      },
      {
        "textbook": "ನಾವು ಹೋಗೋಣ.",
        "regional": "ಹೋಗೋಣ ನಡಿ.",
        "meaning": "Let's go."
      },
      {
        "textbook": "ಏನು ನಡೆಯುತ್ತಿದೆ?",
        "regional": "ಏನ್ ನಡೀತಿದೆ?",
        "meaning": "What is happening?"
      },
      {
        "textbook": "ಅವನು ಮಲಗಿದ್ದಾನೆ.",
        "regional": "ಅವ್ನು ಮಲ್ಕೊಂಡಿದ್ದಾನೆ.",
        "meaning": "He is sleeping."
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
        "textbook": "ಇಲ್ಲಿಗೆ ಬನ್ನಿ.",
        "regional": "ಇಲ್ ಬಾ.",
        "meaning": "Come here."
      },
      {
        "textbook": "ನನಗೆ ತಿಳಿದಿಲ್ಲ.",
        "regional": "ನಂಗೆ ಗೊತ್ತಿಲ್ಲ.",
        "meaning": "I don't know."
      },
      {
        "textbook": "ನಾನು ಮನೆಗೆ ಹೋಗುತ್ತಿದ್ದೇನೆ.",
        "regional": "ನಾನ್ ಮನೆಗೆ ಹೋಗ್ತಾ ಇದೀನಿ.",
        "meaning": "I am going home."
      },
      {
        "textbook": "ನಿಮ್ಮ ಹೆಸರು ಏನು?",
        "regional": "ನಿನ್ ಹೆಸರೇನು?",
        "meaning": "What is your name?"
      },
      {
        "textbook": "ಇದರ ಬೆಲೆ ಎಷ್ಟು?",
        "regional": "ಇದಕ್ ಎಷ್ಟು?",
        "meaning": "How much does this cost?"
      },
      {
        "textbook": "ನನಗೆ ನೀರು ಬೇಕು.",
        "regional": "ನಂಗೆ ನೀರ್ ಬೇಕು.",
        "meaning": "I want water."
      },
      {
        "textbook": "ನಿಮಗೆ ಅರ್ಥವಾಯಿತೇ?",
        "regional": "ಅರ್ಥ ಆಯ್ತಾ?",
        "meaning": "Did you understand?"
      },
      {
        "textbook": "ಕುಳಿತುಕೊಳ್ಳಿ.",
        "regional": "ಕೂತ್ಕೋ.",
        "meaning": "Sit down."
      },
      {
        "textbook": "ಅದನ್ನು ನನಗೆ ಕೊಡಿ.",
        "regional": "ಅದನ್ನ ನಂಗೆ ಕೊಡು.",
        "meaning": "Give it to me."
      },
      {
        "textbook": "ಮಳೆ ಬರುತ್ತಿದೆಯೇ?",
        "regional": "ಮಳೆ ಬರ್ತಾ ಇದ್ಯಾ?",
        "meaning": "Is it raining?"
      },
      {
        "textbook": "ನಾಳೆ ಸಿಗೋಣ.",
        "regional": "ನಾಳೆ ಸಿಗೋಣ.",
        "meaning": "See you tomorrow."
      },
      {
        "textbook": "ಮಾತನಾಡಬೇಡಿ.",
        "regional": "ಮಾತಾಡ್ಬೇಡ.",
        "meaning": "Don't talk."
      },
      {
        "textbook": "ನನಗೆ ಹಸಿವಾಗುತ್ತಿದೆ.",
        "regional": "ನಂಗೆ ಹಸಿವಾಗ್ತಿದೆ.",
        "meaning": "I am hungry."
      },
      {
        "textbook": "ನೀವು ಏಕೆ ಬಂದಿರಿ?",
        "regional": "ಯಾಕ್ ಬಂದೆ?",
        "meaning": "Why did you come?"
      },
      {
        "textbook": "ಅವನು ಏನು ಹೇಳಿದನು?",
        "regional": "ಅವ್ನು ಏನ್ ಹೇಳ್ದ?",
        "meaning": "What did he say?"
      },
      {
        "textbook": "ಇದನ್ನು ತೆಗೆದುಕೊಳ್ಳಿ.",
        "regional": "ಇದನ್ನ ತಗೋ.",
        "meaning": "Take this."
      },
      {
        "textbook": "ನನಗೆ ಇದು ಬೇಡ.",
        "regional": "ನಂಗೆ ಬೇಡ.",
        "meaning": "I don't want it."
      },
      {
        "textbook": "ಒಂದು ನಿಮಿಷ ಕಾಯಿರಿ.",
        "regional": "ಒಂದ್ ನಿಮಿಷ ಇರು.",
        "meaning": "Wait a minute."
      },
      {
        "textbook": "ನೀವು ನನ್ನೊಂದಿಗೆ ಬರುತ್ತೀರಾ?",
        "regional": "ನನ್ ಜೊತೆ ಬರ್ತೀಯಾ?",
        "meaning": "Will you come with me?"
      },
      {
        "textbook": "ನೀವು ಯಾವಾಗ ಬರುತ್ತೀರಿ?",
        "regional": "ಯಾವಾಗ್ ಬರ್ತೀಯಾ?",
        "meaning": "When will you come?"
      },
      {
        "textbook": "ಬಸ್ / ರೈಲು ಎಲ್ಲಿದೆ?",
        "regional": "ಬಸ್/ಟ್ರೈನ್ ಎಲ್ಲಿದೆ?",
        "meaning": "Where is the bus/train?"
      },
      {
        "textbook": "ವೇಗವಾಗಿ ಹೋಗಿ.",
        "regional": "ಬೇಗ ಹೋಗು.",
        "meaning": "Go fast."
      },
      {
        "textbook": "ನಾನು ಮರೆತುಬಿಟ್ಟೆ.",
        "regional": "ನಾನ್ ಮರೆತುಹೋದೆ.",
        "meaning": "I forgot."
      },
      {
        "textbook": "ನಾವು ಹೋಗೋಣ.",
        "regional": "ಹೋಗೋಣ ನಡಿ.",
        "meaning": "Let's go."
      },
      {
        "textbook": "ಏನು ನಡೆಯುತ್ತಿದೆ?",
        "regional": "ಏನ್ ನಡೀತಾ ಇದೆ?",
        "meaning": "What is happening?"
      },
      {
        "textbook": "ಅವನು ಮಲಗಿದ್ದಾನೆ.",
        "regional": "ಅವ್ನು ಮಲ್ಕೊಂಡಿದ್ದಾನೆ.",
        "meaning": "He is sleeping."
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
        "textbook": "ಇಲ್ಲಿಗೆ ಬನ್ನಿ.",
        "regional": "ಇಲ್ಲಿಗೆ ಬನ್ನಿ.",
        "meaning": "Come here."
      },
      {
        "textbook": "ನನಗೆ ತಿಳಿದಿಲ್ಲ.",
        "regional": "ನನಗೆ ಗೊತ್ತಿಲ್ಲ.",
        "meaning": "I don't know."
      },
      {
        "textbook": "ನಾನು ಮನೆಗೆ ಹೋಗುತ್ತಿದ್ದೇನೆ.",
        "regional": "ನಾನು ಮನೆಗೆ ಹೋಗ್ತಾ ಇದೀನಿ.",
        "meaning": "I am going home."
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
      },
      {
        "textbook": "ನನಗೆ ನೀರು ಬೇಕು.",
        "regional": "ನನಗೆ ನೀರು ಬೇಕು.",
        "meaning": "I want water."
      },
      {
        "textbook": "ನಿಮಗೆ ಅರ್ಥವಾಯಿತೇ?",
        "regional": "ಅರ್ಥ ಆಯ್ತಾ?",
        "meaning": "Did you understand?"
      },
      {
        "textbook": "ಕುಳಿತುಕೊಳ್ಳಿ.",
        "regional": "ಕೂತ್ಕೊಳ್ಳಿ.",
        "meaning": "Sit down."
      },
      {
        "textbook": "ಅದನ್ನು ನನಗೆ ಕೊಡಿ.",
        "regional": "ಅದನ್ನ ನನಗೆ ಕೊಡಿ.",
        "meaning": "Give it to me."
      },
      {
        "textbook": "ಮಳೆ ಬರುತ್ತಿದೆಯೇ?",
        "regional": "ಮಳೆ ಬರ್ತಾ ಇದೆಯಾ?",
        "meaning": "Is it raining?"
      },
      {
        "textbook": "ನಾಳೆ ಸಿಗೋಣ.",
        "regional": "ನಾಳೆ ಸಿಗೋಣ.",
        "meaning": "See you tomorrow."
      },
      {
        "textbook": "ಮಾತನಾಡಬೇಡಿ.",
        "regional": "ಮಾತಾಡಬೇಡಿ.",
        "meaning": "Don't talk."
      },
      {
        "textbook": "ನನಗೆ ಹಸಿವಾಗುತ್ತಿದೆ.",
        "regional": "ನನಗೆ ಹಸಿವಾಗ್ತಾ ಇದೆ.",
        "meaning": "I am hungry."
      },
      {
        "textbook": "ನೀವು ಏಕೆ ಬಂದಿರಿ?",
        "regional": "ಯಾಕೆ ಬಂದ್ರಿ?",
        "meaning": "Why did you come?"
      },
      {
        "textbook": "ಅವನು ಏನು ಹೇಳಿದನು?",
        "regional": "ಅವನು ಏನ್ ಹೇಳ್ದ?",
        "meaning": "What did he say?"
      },
      {
        "textbook": "ಇದನ್ನು ತೆಗೆದುಕೊಳ್ಳಿ.",
        "regional": "ಇದನ್ನ ತಗೊಳ್ಳಿ.",
        "meaning": "Take this."
      },
      {
        "textbook": "ನನಗೆ ಇದು ಬೇಡ.",
        "regional": "ನನಗೆ ಬೇಡ.",
        "meaning": "I don't want it."
      },
      {
        "textbook": "ಒಂದು ನಿಮಿಷ ಕಾಯಿರಿ.",
        "regional": "ಒಂದು ನಿಮಿಷ ಇರಿ.",
        "meaning": "Wait a minute."
      },
      {
        "textbook": "ನೀವು ನನ್ನೊಂದಿಗೆ ಬರುತ್ತೀರಾ?",
        "regional": "ನನ್ನ ಜೊತೆ ಬರ್ತೀರಾ?",
        "meaning": "Will you come with me?"
      },
      {
        "textbook": "ನೀವು ಯಾವಾಗ ಬರುತ್ತೀರಿ?",
        "regional": "ಯಾವಾಗ ಬರ್ತೀರಾ?",
        "meaning": "When will you come?"
      },
      {
        "textbook": "ಬಸ್ / ರೈಲು ಎಲ್ಲಿದೆ?",
        "regional": "ಬಸ್/ಟ್ರೈನ್ ಎಲ್ಲಿದೆ?",
        "meaning": "Where is the bus/train?"
      },
      {
        "textbook": "ವೇಗವಾಗಿ ಹೋಗಿ.",
        "regional": "ಬೇಗ ಹೋಗಿ.",
        "meaning": "Go fast."
      },
      {
        "textbook": "ನಾನು ಮರೆತುಬಿಟ್ಟೆ.",
        "regional": "ನಾನು ಮರೆತುಹೋದೆ.",
        "meaning": "I forgot."
      },
      {
        "textbook": "ನಾವು ಹೋಗೋಣ.",
        "regional": "ಹೋಗೋಣ ಬನ್ನಿ.",
        "meaning": "Let's go."
      },
      {
        "textbook": "ಏನು ನಡೆಯುತ್ತಿದೆ?",
        "regional": "ಏನ್ ನಡೀತಾ ಇದೆ?",
        "meaning": "What is happening?"
      },
      {
        "textbook": "ಅವನು ಮಲಗಿದ್ದಾನೆ.",
        "regional": "ಅವನು ಮಲಗಿದ್ದಾನೆ.",
        "meaning": "He is sleeping."
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
        "textbook": "ಇಲ್ಲಿಗೆ ಬನ್ನಿ.",
        "regional": "ಇಲ್ ಬಾರಪ್ಪ.",
        "meaning": "Come here."
      },
      {
        "textbook": "ನನಗೆ ತಿಳಿದಿಲ್ಲ.",
        "regional": "ನಂಗ್ ಗೊತ್ತಿಲ್ಲ ಕಣಪ್ಪ.",
        "meaning": "I don't know."
      },
      {
        "textbook": "ನಾನು ಮನೆಗೆ ಹೋಗುತ್ತಿದ್ದೇನೆ.",
        "regional": "ನಾನ್ ಮನೆಗ್ ಹೋಯ್ತಾಯಿದೀನಿ.",
        "meaning": "I am going home."
      },
      {
        "textbook": "ನಿಮ್ಮ ಹೆಸರು ಏನು?",
        "regional": "ನಿನ್ ಹೆಸರೇನಪ್ಪಾ?",
        "meaning": "What is your name?"
      },
      {
        "textbook": "ಇದರ ಬೆಲೆ ಎಷ್ಟು?",
        "regional": "ಇದಕ್ಕ ಎಷ್ಟಪ್ಪ?",
        "meaning": "How much does this cost?"
      },
      {
        "textbook": "ನನಗೆ ನೀರು ಬೇಕು.",
        "regional": "ನಂಗ್ ನೀರ್ ಬೇಕು.",
        "meaning": "I want water."
      },
      {
        "textbook": "ನಿಮಗೆ ಅರ್ಥವಾಯಿತೇ?",
        "regional": "ಅರ್ಥ ಆಯ್ತೇನಪ್ಪ?",
        "meaning": "Did you understand?"
      },
      {
        "textbook": "ಕುಳಿತುಕೊಳ್ಳಿ.",
        "regional": "ಕೂತ್ಕಳಪ್ಪ.",
        "meaning": "Sit down."
      },
      {
        "textbook": "ಅದನ್ನು ನನಗೆ ಕೊಡಿ.",
        "regional": "ಅದನ್ ನಂಗ್ ಕೊಡಪ್ಪ.",
        "meaning": "Give it to me."
      },
      {
        "textbook": "ಮಳೆ ಬರುತ್ತಿದೆಯೇ?",
        "regional": "ಮಳೆ ಬರ್ತಾಯಿದೆಯಾ?",
        "meaning": "Is it raining?"
      },
      {
        "textbook": "ನಾಳೆ ಸಿಗೋಣ.",
        "regional": "ನಾಳೆ ಸಿಗೋಣ ಕಣಪ್ಪ.",
        "meaning": "See you tomorrow."
      },
      {
        "textbook": "ಮಾತನಾಡಬೇಡಿ.",
        "regional": "ಮಾತಾಡ್ಬೇಡ ಕಣಪ್ಪ.",
        "meaning": "Don't talk."
      },
      {
        "textbook": "ನನಗೆ ಹಸಿವಾಗುತ್ತಿದೆ.",
        "regional": "ನಂಗ್ ಹಸೀಕತ್ತೈದೆ.",
        "meaning": "I am hungry."
      },
      {
        "textbook": "ನೀವು ಏಕೆ ಬಂದಿರಿ?",
        "regional": "ಯಾಕ್ ಬಂದ್ಯಪ್ಪ?",
        "meaning": "Why did you come?"
      },
      {
        "textbook": "ಅವನು ಏನು ಹೇಳಿದನು?",
        "regional": "ಅವ್ನು ಏನ್ ಅಂದಪ್ಪ?",
        "meaning": "What did he say?"
      },
      {
        "textbook": "ಇದನ್ನು ತೆಗೆದುಕೊಳ್ಳಿ.",
        "regional": "ಇದನ್ ತಗಳಪ್ಪ.",
        "meaning": "Take this."
      },
      {
        "textbook": "ನನಗೆ ಇದು ಬೇಡ.",
        "regional": "ನಂಗ್ ಬ್ಯಾಡ ಕಣಪ್ಪ.",
        "meaning": "I don't want it."
      },
      {
        "textbook": "ಒಂದು ನಿಮಿಷ ಕಾಯಿರಿ.",
        "regional": "ಒಂದ್ ನಿಮಿಷ ಇರಪ್ಪ.",
        "meaning": "Wait a minute."
      },
      {
        "textbook": "ನೀವು ನನ್ನೊಂದಿಗೆ ಬರುತ್ತೀರಾ?",
        "regional": "ನನ್ ಜೊತೆ ಬರ್ತೀಯಪ್ಪ?",
        "meaning": "Will you come with me?"
      },
      {
        "textbook": "ನೀವು ಯಾವಾಗ ಬರುತ್ತೀರಿ?",
        "regional": "ಯಾವಾಗ್ ಬರ್ತೀಯಪ್ಪ?",
        "meaning": "When will you come?"
      },
      {
        "textbook": "ಬಸ್ / ರೈಲು ಎಲ್ಲಿದೆ?",
        "regional": "ಬಸ್/ಟ್ರೈನ್ ಎಲ್ಲೈತಪ್ಪ?",
        "meaning": "Where is the bus/train?"
      },
      {
        "textbook": "ವೇಗವಾಗಿ ಹೋಗಿ.",
        "regional": "ಬೇಗ ಹೋಗಪ್ಪ.",
        "meaning": "Go fast."
      },
      {
        "textbook": "ನಾನು ಮರೆತುಬಿಟ್ಟೆ.",
        "regional": "ನಾನ್ ಮರೆತೋದೆ ಕಣಪ್ಪ.",
        "meaning": "I forgot."
      },
      {
        "textbook": "ನಾವು ಹೋಗೋಣ.",
        "regional": "ಹೋಗೋಣ ನಡೀಯಪ್ಪ.",
        "meaning": "Let's go."
      },
      {
        "textbook": "ಏನು ನಡೆಯುತ್ತಿದೆ?",
        "regional": "ಏನ್ ನಡೀತಾಯಿದೆಯಪ್ಪ?",
        "meaning": "What is happening?"
      },
      {
        "textbook": "ಅವನು ಮಲಗಿದ್ದಾನೆ.",
        "regional": "ಅವ್ನು ಮಲ್ಕೊಂಡವನೆ ಕಣಪ್ಪ.",
        "meaning": "He is sleeping."
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
    "description": "ಐಟಿ ಹಬ್ ಕಾಸ್ಮೋಪಾಲಿಟನ್ ಮತ್ತು ಚಿನ್ನದ ಗಣಿ ಸಂಸ್ಕೃತಿ. ಇಂಗ್ಲಿಷ್-ತೆಲುಗು ಪ್ರಭಾವಿತ ವೇಗದ ಬೆಂಗಳೂರು ಕನ್ನಡ ಹಾಗೂ ಗ್ರಾಮೀಣ ರೇಷ್ಮೆ ಸೀಮೆಯ ನುಡಿ.",
    "phrases": [
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
        "textbook": "ಇಲ್ಲಿಗೆ ಬನ್ನಿ.",
        "regional": "ಇಲ್ ಬನ್ನಿ.",
        "meaning": "Come here."
      },
      {
        "textbook": "ನನಗೆ ತಿಳಿದಿಲ್ಲ.",
        "regional": "ನಂಗೆ ಗೊತ್ತಿಲ್ಲ.",
        "meaning": "I don't know."
      },
      {
        "textbook": "ನಾನು ಮನೆಗೆ ಹೋಗುತ್ತಿದ್ದೇನೆ.",
        "regional": "ನಾನ್ ಮನೆಗ್ ಹೋಗ್ತಿದೀನಿ.",
        "meaning": "I am going home."
      },
      {
        "textbook": "ನಿಮ್ಮ ಹೆಸರು ಏನು?",
        "regional": "ನಿಮ್ ಹೆಸರೇನು?",
        "meaning": "What is your name?"
      },
      {
        "textbook": "ಇದರ ಬೆಲೆ ಎಷ್ಟು?",
        "regional": "ಇದಕ್ಕೆ ಎಷ್ಟು?",
        "meaning": "How much does this cost?"
      },
      {
        "textbook": "ನನಗೆ ನೀರು ಬೇಕು.",
        "regional": "ನಂಗೆ ನೀರ್ ಬೇಕು.",
        "meaning": "I want water."
      },
      {
        "textbook": "ನಿಮಗೆ ಅರ್ಥವಾಯಿತೇ?",
        "regional": "ಅರ್ಥ ಆಯ್ತಾ?",
        "meaning": "Did you understand?"
      },
      {
        "textbook": "ಕುಳಿತುಕೊಳ್ಳಿ.",
        "regional": "ಕೂತ್ಕೊಳ್ಳಿ.",
        "meaning": "Sit down."
      },
      {
        "textbook": "ಅದನ್ನು ನನಗೆ ಕೊಡಿ.",
        "regional": "ಅದನ್ನ ನಂಗೆ ಕೊಡಿ.",
        "meaning": "Give it to me."
      },
      {
        "textbook": "ಮಳೆ ಬರುತ್ತಿದೆಯೇ?",
        "regional": "ಮಳೆ ಬರ್ತಿದ್ಯಾ?",
        "meaning": "Is it raining?"
      },
      {
        "textbook": "ನಾಳೆ ಸಿಗೋಣ.",
        "regional": "ನಾಳೆ ಸಿಗೋಣ.",
        "meaning": "See you tomorrow."
      },
      {
        "textbook": "ಮಾತನಾಡಬೇಡಿ.",
        "regional": "ಮಾತಾಡಬೇಡಿ.",
        "meaning": "Don't talk."
      },
      {
        "textbook": "ನನಗೆ ಹಸಿವಾಗುತ್ತಿದೆ.",
        "regional": "ನಂಗೆ ಹಸಿವಾಗ್ತಿದೆ.",
        "meaning": "I am hungry."
      },
      {
        "textbook": "ನೀವು ಏಕೆ ಬಂದಿರಿ?",
        "regional": "ಯಾಕ್ ಬಂದ್ರಿ?",
        "meaning": "Why did you come?"
      },
      {
        "textbook": "ಅವನು ಏನು ಹೇಳಿದನು?",
        "regional": "ಅವ್ನು ಏನ್ ಹೇಳ್ದ?",
        "meaning": "What did he say?"
      },
      {
        "textbook": "ಇದನ್ನು ತೆಗೆದುಕೊಳ್ಳಿ.",
        "regional": "ಇದನ್ನ ತಗೊಳ್ಳಿ.",
        "meaning": "Take this."
      },
      {
        "textbook": "ನನಗೆ ಇದು ಬೇಡ.",
        "regional": "ನಂಗೆ ಬೇಡ.",
        "meaning": "I don't want it."
      },
      {
        "textbook": "ಒಂದು ನಿಮಿಷ ಕಾಯಿರಿ.",
        "regional": "ಒಂದ್ ನಿಮಿಷ ಇರಿ.",
        "meaning": "Wait a minute."
      },
      {
        "textbook": "ನೀವು ನನ್ನೊಂದಿಗೆ ಬರುತ್ತೀರಾ?",
        "regional": "ನನ್ ಜೊತೆ ಬರ್ತೀರಾ?",
        "meaning": "Will you come with me?"
      },
      {
        "textbook": "ನೀವು ಯಾವಾಗ ಬರುತ್ತೀರಿ?",
        "regional": "ಯಾವಾಗ್ ಬರ್ತೀರಾ?",
        "meaning": "When will you come?"
      },
      {
        "textbook": "ಬಸ್ / ರೈಲು ಎಲ್ಲಿದೆ?",
        "regional": "ಬಸ್/ಟ್ರೈನ್ ಎಲ್ಲಿದೆ?",
        "meaning": "Where is the bus/train?"
      },
      {
        "textbook": "ವೇಗವಾಗಿ ಹೋಗಿ.",
        "regional": "ಬೇಗ ಹೋಗಿ.",
        "meaning": "Go fast."
      },
      {
        "textbook": "ನಾನು ಮರೆತುಬಿಟ್ಟೆ.",
        "regional": "ನಾನ್ ಮರೆತುಹೋದೆ.",
        "meaning": "I forgot."
      },
      {
        "textbook": "ನಾವು ಹೋಗೋಣ.",
        "regional": "ಹೋಗೋಣ ಬನ್ನಿ.",
        "meaning": "Let's go."
      },
      {
        "textbook": "ಏನು ನಡೆಯುತ್ತಿದೆ?",
        "regional": "ಏನ್ ನಡೀತಿದೆ?",
        "meaning": "What is happening?"
      },
      {
        "textbook": "ಅವನು ಮಲಗಿದ್ದಾನೆ.",
        "regional": "ಅವ್ನು ಮಲ್ಕೊಂಡಿದ್ದಾನೆ.",
        "meaning": "He is sleeping."
      }
    ]
  }
};

export const STATIC_REGIONS_LIST: StaticRegionData[] = Object.values(STATIC_REGION_MAP);
