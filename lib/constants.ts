/**
 * Static constants for Swara-Setu.
 * Every color, region definition, and zone config lives here so it is shared
 * between the 3D map component, the seed data, and the AI prompts.
 */

// ── Color palette ──────────────────────────────────────────────────────────────
export const COLORS = {
  // Deep Hampi Chariot Stone Obsidian canvas background
  CANVAS: "#0B0908",
  CANVAS_GLOW: "#1A0F0A",

  // Karnataka Primary Yellow (Arishina)
  ARISHINA: {
    DEFAULT: "#F5B700",
    LIGHT: "#FFD13B",
    DARK: "#E6A800",
    SOFT: "rgba(245, 183, 0, 0.18)",
  },

  // Karnataka Primary Red (Kumkuma)
  KUMKUMA: {
    DEFAULT: "#C81D25",
    LIGHT: "#E63946",
    DARK: "#A0161C",
    SOFT: "rgba(200, 29, 37, 0.18)",
  },

  // Border
  BORDER: "rgba(245, 183, 0, 0.22)",

  // Surface glass backdrop
  GLASS: "rgba(20, 14, 12, 0.72)",
} as const;

// ── Typographic scale ─────────────────────────────────────────────────────────
export const FONTS = {
  SERIF_KANNADA: "'Noto Serif Kannada', Noto Serif, Georgia, serif",
  SANS: "'Plus Jakarta Sans', system-ui, sans-serif",
  MONO: "'JetBrains Mono', ui-monospace, monospace",
} as const;

// ── Five Kannada dialect zones ─────────────────────────────────────────────────
export interface ZoneDef {
  slug: string;
  nameEnglish: string;
  nameKannada: string;
  color: string;
  description: string;
  districts: string[];
}

export const ZONES: ZoneDef[] = [
  {
    slug: "old_mysuru",
    nameEnglish: "Old Mysuru",
    nameKannada: "ಹ old ಮೈಸೂರು",
    color: COLORS.KUMKUMA.DARK,
    description:
      "Royal Wodeyar patronage, Kaveri agrarian heritage, and centuries-old temple towns. " +
      "Speech features vowel elongation, affectionate suffixes (-kano/kane), and unique " +
      "idioms rooted in temple and riverine culture.",
    districts: [
      "Mysuru",
      "Mandya",
      "Hassan",
      "Chamarajanagar",
      "Bengaluru",
      "Tumakuru",
    ],
  },
  {
    slug: "kalyana_uttara",
    nameEnglish: "Kalyana / Uttara Karnataka",
    nameKannada: "ಕಲ್ಯಾಣ / ಉತ್ತರ ಕರ್ನಾಟಕ",
    color: COLORS.ARISHINA.DEFAULT,
    description:
      "Historic Vijayanagara empire heartland. Distinctive respectful -ri suffix in verbs, " +
      "Dravidian substrate influences, and words borrowed from Marathi and Telugu trading " +
      "communities. Towns like Hubballi and Hosapete carry strong mercantile dialect DNA.",
    districts: [
      "Hosapete",
      "Vijayanagara",
      "Ballari",
      "Raichur",
      "Kalaburagi",
      "Bidar",
      "Koppal",
      "Yadgir",
    ],
  },
  {
    slug: "kittur_northwest",
    nameEnglish: "Kittur / Northwestern",
    nameKannada: "kit್ತೂರು / ವಾಯುವ್ಯ ಕರ್ನಾಟಕ",
    color: "#D62828",
    description:
      "Hubballi-Dharwad twin-city mercantile culture, Belagavi's borderland identity, " +
      "and the historic Ghataprabha river valley. Features unique pronouns ( filma/g filma style " +
      "address), dropped final vowels in casual speech, and strong Marathi-Konkani contact " +
      "vocabulary in border areas.",
    districts: [
      "Hubballi-Dharwad",
      "Belagavi",
      "Vijayapura",
      "Bagalkot",
      "Gadag",
      "Haveri",
    ],
  },
  {
    slug: "karavali_coastal",
    nameEnglish: "Karavali / Coastal",
    nameKannada: "ಕರಾವಳಿ / coast ಕರ್ನಾಟಕ",
    color: "#FFB703",
    description:
      "Tulu-Konkani substrate dominates here. Final vowels are often dropped in casual speech, " +
      "unique pronouns like 'entha' and 'onkanda', and expressions heavily influenced by the " +
      "historical spice trade. Mangaluru's cosmopolitan port culture adds Persian and Arabic " +
      "loanwords.",
    districts: [
      "Mangaluru",
      "Dakshina Kannada",
      "Udupi",
      "Kundapura",
      "Uttara Kannada",
    ],
  },
  {
    slug: "malnad_ghats",
    nameEnglish: "Malnad & Ghats",
    nameKannada: "ಮಲೆನಾಡು / Ghats ಕರ್ನಾಟಕ",
    color: "#E05A2B",
    description:
      "Western Ghats hill culture. Havyaka dialect preserves ancient Halegannada case endings " +
      "and Dravidian forest vocabulary. Monsoon-specific lexicon (jadi male = continuous rain), " +
      "coffee/areca estate heritage terms, and unique kinship terms (appi, ammi). Shivamogga " +
      "and Chikkamagaluru carry strong agricultural and forest-dwelling linguistic DNA.",
    districts: [
      "Shivamogga",
      "Chikkamagaluru",
      "Kodagu",
    ],
  },
] as const;

// ── Geo center for d3-geo projection ──────────────────────────────────────────
export const MAP_PROJECTION = {
  center: [76.1, 15.0],
  scale: 2400,
};

// ── Retroflex consonants used in pronunciation feedback ────────────────────────
export const RETROFLEX = ["ಳ", "ண", "ಱ"] as const;

// ── Key phonetic features for dialect matrix ───────────────────────────────────
export const PHONETIC_FEATURES = {
  old_mysuru: {
    features: ["Vowel elongation", "Affectionate -kano/-kane suffixes", "Double consonant clusters"],
    example: "ಕಣೋ (kano) — affectionate address to a younger person",
  },
  uttara_karnataka: {
    features: ["Respectful -ri verb suffix", "aakatte ending", "Marathi-Telugu loanwords"],
    example: "ಏನ್ ಮಾಡಾಕತ್ತೀರಿ? (yen maakattiri?) — What are you doing? (respectful)",
  },
  karavali_kundapura: {
    features: ["Dropped final vowels", "Unique pronouns (entha, onkanda)", "Tulu substrate markers"],
    example: "ಎಂತ ಮಾಡ್ತಾ ಇದ್ದೆ? (entha maakta idde?) — What were you doing?",
  },
  malnad_havyaka: {
    features: ["Preserved Halegannada case endings", "Monsoon forest vocabulary", "Kinship terms (appi, ammi)"],
    example: "ஜಡ(URL) ಮಳೆ (jadi male) — continuous/steady rain",
  },
  kalyana_hosapete: {
    features: ["Dravidian substrate influence", "Marathi-Telugu trade vocabulary", "Hard retroflex cluster"],
    example: "ಹಂಗ ಬಾವ! (hang bava!) — Like that, bro! (Hubballi street)",
  },
} as const;