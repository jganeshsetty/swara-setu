/**
 * Old Mysuru dialect entries.
 * Mysuru, Mandya, Hassan, Chamarajanagar, Bengaluru, Tumakuru.
 *
 * Region signature: vowel elongation, Wodeyar royal court linguistic norms,
 * Kaveri agrarian idioms, affectionate -kano/kane suffixes.
 */

export const oldMysuruEntries = [
  {
    regionSlug: "old_mysuru",
    district: "Mysuru",
    category: "phrase",
    regionalKannada: "ಊಟ ಆಯ್ತಾ?",
    regionalPhonetic: "oot aayta?",
    standardKannada: "ಊಟ ಆಯ್ತಾ?",
    standardPhonetic: "oot aayta?",
    englishMeaning: "Did you have your meal?",
    culturalContext:
      "The quintessential Mysuru household greeting. More than a question — it is social glue. " +
      "The elongated 'aayta' with falling intonation signals genuine care. " +
      "Mysuru's Wodeyar royal heritage embedded this into urban culture — households still " +
      "ask this even when both people are at the same table.",
    audioPitchProfile: "falling, elongated 'ta'",
    upvotes: 56,
    verified: true,
    contributorName: "Linguistic Field Collection",
  },
  {
    regionSlug: "old_mysuru",
    district: "Mandya",
    category: "idiom",
    regionalKannada: "ಹಸಿರು ಹುಲ್ಲು",
    regionalPhonetic: "hasiru hullu",
    standardKannada: "ಹಸಿರು ಹುಲ್ಲು",
    standardPhonetic: "hasiru hullu",
    englishMeaning: "Green field",
    culturalContext:
      "Refers to lush agricultural land. In Mysuru district, 'Hasiru' describes fertile fields " +
      "near the Kaveri River. The phrase also symbolizes prosperity and is used in festive " +
      "contexts, especially during harvest festivals.",
    audioPitchProfile: "rising-falling",
    upvotes: 42,
    verified: true,
    contributorName: "Linguistic Field Collection",
  },
  {
    regionSlug: "old_mysuru",
    district: "Hassan",
    category: "word",
    regionalKannada: "ತುಂಬಾ",
    regionalPhonetic: "tumbha",
    standardKannada: "ತುಂಬಾ / ಅಪಾರವಾದ",
    standardPhonetic: "tumbha / aparavaada",
    englishMeaning: "Very / Awesome",
    culturalContext:
      "Hassan district's agricultural community uses 'tumbha' as an intensifier with a " +
      "distinctive retroflex 'bha' sound. It conveys admiration for a well-prepared dish or a " +
      "beautiful sunrise. The elongated 'ba' is characteristic of Hassan's phonetic profile.",
    audioPitchProfile: "short, clipped, with retroflex 'bha'",
    upvotes: 39,
    verified: true,
    contributorName: "Linguistic Field Collection",
  },
  {
    regionSlug: "old_mysuru",
    district: "Chamarajanagar",
    category: "word",
    regionalKannada: "ಕಣೋ",
    regionalPhonetic: "kano",
    standardKannada: "ಕಣೋ",
    standardPhonetic: "kano",
    englishMeaning: "Affectionate term for younger person",
    culturalContext:
      "A Mysuru district hallmark. 'Kano' is a diminutive suffix used for children, young adults, " +
      "or beloved elders. It is not just affectionate — it is culturally specific to the Mysuru " +
      "region's traditional family structure. Often heard in family gatherings and temple festivals.",
    audioPitchProfile: "mid-range, gentle rise on 'no'",
    upvotes: 31,
    verified: true,
    contributorName: "Linguistic Field Collection",
  },
  {
    regionSlug: "old_mysuru",
    district: "Bengaluru",
    category: "phrase",
    regionalKannada: "ಮನೆಗೆ ಬಂದಿದ್ದೀನಿ",
    regionalPhonetic: "manege bandidini",
    standardKannada: "ಮನೆಗೆ ಬಂದಿದ್ದೀನಿ",
    standardPhonetic: "manege bandidini",
    englishMeaning: "Come home",
    culturalContext:
      "A common Mysuru phrase used to invite someone, often after a meal. The 'ni' ending is a " +
      "Mysuru dialect marker — northern regions use 'nanna' or 'nannaa'. The phrase carries a warm, " +
      "familial tone, reflecting Mysuru's reputation for hospitality.",
    audioPitchProfile: "rising on 'ni', falling on 'dini'",
    upvotes: 44,
    verified: true,
    contributorName: "Linguistic Field Collection",
  },
  {
    regionSlug: "old_mysuru",
    district: "Tumakuru",
    category: "word",
    regionalKannada: "ಕಣೇ",
    regionalPhonetic: "kane",
    standardKannada: "ಕಣೋ",
    standardPhonetic: "kano",
    englishMeaning: "Affectionate suffix for younger person",
    culturalContext:
      "Used to show endearment, especially for children or young adults. 'Kane' is a Mysuru- " +
      "specific variant of 'kano' — the vowel 'e' is distinctive. Used in family settings: 'Kane, " +
      "iddare?' (Kane, what are you doing?).",
    audioPitchProfile: "mid, rising on 'ne'",
    upvotes: 29,
    verified: true,
    contributorName: "Linguistic Field Collection",
  },
];

export type OldMysuruEntry = (typeof oldMysuruEntries)[number];
