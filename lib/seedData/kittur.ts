/**
 * Kittur / Northwestern Karnataka dialect entries.
 * Hubballi-Dharwad (shared), Belagavi, Vijayapura, Bagalkot, Gadag, Haveri.
 *
 * Region signature: dropped final vowels, unique pronouns,
 * Marathi–Konkani trading vocabulary, assertive speech patterns.
 */

const kitturEntries = [
  {
    regionSlug: "kittur_northwest",
    district: "Belagavi",
    category: "word",
    regionalKannada: "ಗಡಿಯೆ",
    regionalPhonetic: "gadiye",
    standardKannada: "ಸಮಯ",
    standardPhonetic: "samaya",
    englishMeaning: "Time",
    culturalContext:
      "A Belagavi marker. Instead of 'samaya', speakers say 'gadiye' — a Marathi-influenced " +
      "term from the Chhatrapati-era trade routes. It is heard in workshops: 'Iddira gadiye " +
      "aagdu' (We'll do it on time). The soft 'g' at the beginning and the dropped final " +
      "'a' are distinctly Northwestern Kannada.",
    audioPitchProfile: "low, decisive",
    upvotes: 35,
    verified: true,
    contributorName: "Linguistic Field Collection",
  },
  {
    regionSlug: "kittur_northwest",
    district: "Bagalkot",
    category: "phrase",
    regionalKannada: "ನೀವು ಯಾರಾಗಿ?",
    regionalPhonetic: "nivu yaaragi?",
    standardKannada: "ನೀವು ಯಾರು?",
    standardPhonetic: "nivu yaaru?",
    englishMeaning: "What is your name?",
    culturalContext:
      "In Bagalkot and the surrounding regions of the Krishna river basin, 'yaaragi' replaces " +
      "the standard 'yaaru'. The extended '-gi' is not grammatically necessary but adds a " +
      "softness — it's a polite form of inquiry, less blunt than the direct 'yaaru'. Common in " +
      "village squares and during the annual Yellamma fair.",
    audioPitchProfile: "rising, polite ending",
    upvotes: 30,
    verified: true,
    contributorName: "Linguistic Field Collection",
  },
  {
    regionSlug: "kittur_northwest",
    district: "Vijayapura",
    category: "idiom",
    regionalKannada: "ಹಾಗಾದರೂ ಹೋಗೋಣ",
    regionalPhonetic: "haagadu rū hōgōṇa",
    standardKannada: "ಆದರೂ ಹೋಗಿ",
    standardPhonetic: "aadaru hōgi",
    englishMeaning: "Still go / Even so, proceed",
    culturalContext:
      "A Vijayapura–Bagalkot staple. 'Haagadu' is a contracted form of 'aagadu' (become), " +
      "with the initial 'h' soft and almost whispered — a Northwestern trait. The extended 'ōṇa' " +
      "at the end gives it resolve. Used by farmers in the Tungabhadra flats when conditions " +
      "are uncertain, but duty must persist: 'Magaadu hōgali, haagadu hōgōṇa' " +
      "(The river may be low, but still we go).",
    audioPitchProfile: "settling, resolved",
    upvotes: 37,
    verified: true,
    contributorName: "Linguistic Field Collection",
  },
  {
    regionSlug: "kittur_northwest",
    district: "Gadag",
    category: "word",
    regionalKannada: "ಬೊಮ್ಮ",
    regionalPhonetic: "bomma",
    standardKannada: "ಬೊಮ್ಮ",
    standardPhonetic: "bomma",
    englishMeaning: "Doll / Image / Puppet",
    culturalContext:
      "In Gadag, 'bomma' is specifically tied to the Gombe (doll) tradition of the " +
      "Vijayanagara ruins. The term is used in the Gombe dance — a folk art where women " +
      "balance a basket of dolls on their heads during festivals. " +
      "Unlike urban Kannada 'bommai' (toy), 'bomma' has a ceremonial heft, and is " +
      "also used affectionately: 'Eenu bomma!' (Hey doll!) to a child.",
    audioPitchProfile: "short, crisp 'mma'",
    upvotes: 26,
    verified: true,
    contributorName: "Linguistic Field Collection",
  },
  {
    regionSlug: "kittur_northwest",
    district: "Haveri",
    category: "word",
    regionalKannada: "ಗಂಜಿನ",
    regionalPhonetic: "ganjina",
    standardKannada: "ಬೆಳಕು",
    standardPhonetic: "belaku",
    englishMeaning: "Light / Lamp",
    culturalContext:
      "A unique Haveri term. 'Ganjina' (from Kannada 'ganj' = cluster of light) refers " +
      "specifically to the oil lamp inside a household shrine. It is a deeply religious " +
      "word — used during evening prayers: 'Ittina ganjina alli' (Light the lamp now). " +
      "It carries the weight of daily puja rituals in North Karnataka households.",
    audioPitchProfile: "soft, reverent",
    upvotes: 39,
    verified: true,
    contributorName: "Linguistic Field Collection",
  },
];

module.exports = { kitturEntries };