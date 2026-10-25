/**
 * Karavali / Coastal Karnataka dialect entries.
 * Mangaluru, Udupi, Kundapura, Uttara Kannada.
 *
 * Region signature: Tulu-Konkani substrate, dropped final vowels,
 * unique pronouns (entha, onkanda), spice-trade loanwords.
 */

const karavaliEntries = [
  {
    regionSlug: "karavali_coastal",
    district: "Mangaluru",
    category: "phrase",
    regionalKannada: "ಎಂತ ಮಾಡ್ತಾ?idde?",
    regionalPhonetic: "entha maadtha idde?",
    standardKannada: "ಎಂತರಾ ಮಾಡುತ್ತಿದ್ದೀರಿ?",
    standardPhonetic: "enu maaduttiddiri?",
    englishMeaning: "What are you doing?",
    culturalContext:
      "Mangaluru's cosmopolitan port culture leaves traces. The clipped 'maadtha' and dropped final vowel " +
      "('idde?' vs 'idde?') is Tulu substrate influence. 'Entha' is the coastal-specific 'what' — " +
      "Karavali speakers say 'entha' more frequently than Old Mysuru 'entha'.",
    audioPitchProfile: "falling, clipped",
    upvotes: 41,
    verified: true,
    contributorName: "Linguistic Field Collection",
  },
  {
    regionSlug: "karavali_coastal",
    district: "Udupi",
    category: "word",
    regionalKannada: "ಮಾರಾಯ",
    regionalPhonetic: "maaraya",
    standardKannada: "ಮಾರಾಯ",
    standardPhonetic: "maaraya",
    englishMeaning: "Friendly address / brother / comrade",
    culturalContext:
      "A uniquely Udupi term of endearment. 'Maaraya' is borrowed from Tulu but has been integrated " +
      "into coastal Kannada with a warm, equal-status connotation. Unlike 'kano/kane' in Old Mysuru, " +
      "'Maaraya' signals camaraderie rather than generational inferiority.",
    audioPitchProfile: "mid-range, flat, warm",
    upvotes: 33,
    verified: true,
    contributorName: "Linguistic Field Collection",
  },
  {
    regionSlug: "karavali_coastal",
    district: "Kundapura",
    category: "phrase",
    regionalKannada: "urgendra?",
    regionalPhonetic: "onkandra?",
    standardKannada: "akaṁdā agiḍḍēēḍu",
    standardPhonetic: "ākaṁdā agiḍḍēēḍu",
    englishMeaning: "Did you eat?",
    culturalContext:
      "Kundapura's Konkani-influenced dialect uses 'onkandra?' with a rising intonation. " +
      "The dropped final vowel characteristic of Karavali. It's a quick, casual " +
      "check-in among fishing and areca-nut plantation communities. " +
      "The 'u' at the end is a Konkani loanword marker.",
    audioPitchProfile: "rising, inquisitive",
    upvotes: 37,
    verified: true,
    contributorName: "Linguistic Field Collection",
  },
  {
    regionSlug: "karavali_coastal",
    district: "Uttara Kannada",
    category: "word",
    regionalKannada: "ಗೇಜೆ",
    regionalPhonetic: "geje",
    standardKannada: "ಕೆಳಗ ವಸ್ತು",
    standardPhonetic: "keḷaga",
    englishMeaning: "Deep / Intense",
    culturalContext:
      "A Kundapura-distinct term used especially for describing flavors (\\\"geje chutney\\\"), emotions, " +
      "or terrain. The 'ge' sound is a Konkani substrate marker shared with some Tulu dialects. " +
      "Used to intensify: \\\"Geje baath\\\" (intense work / very deep).",
    audioPitchProfile: "short, guttural",
    upvotes: 28,
    verified: true,
    contributorName: "Linguistic Field Collection",
  },
  {
    regionSlug: "karavali_coastal",
    district: "Mangaluru",
    category: "idiom",
    regionalKannada: "ಬರಿ ಚಂದ ಇತ್ತ್",
    regionalPhonetic: "bari chanda idd",
    standardKannada: "ಚಂದ ಇಂದ ಓತ್ರ candida",
    standardPhonetic: "canda ind ōtara",
    englishMeaning: "Butter / Ghee is better / It's all good",
    culturalContext:
      "A coastal idiom of reassurance. 'Bari chanda idd' (butter/ghee went / it's fine) is " +
      "used to downplay a mistake or assure someone it's not a problem. The phrase reflects the " +
      "coastal community's pragmatic acceptance — the sea gives and takes, so there's no use crying. " +
      "Also used in markets to close a deal with a smile.",
    audioPitchProfile: "falling, reassuring",
    upvotes: 44,
    verified: true,
    contributorName: "Linguistic Field Collection",
  },
  {
    regionSlug: "karavali_coastal",
    district: "Udupi",
    category: "word",
    regionalKannada: "ಎಂಟಿನ",
    regionalPhonetic: "entina",
    standardKannada: "ಎಂಟಿ",
    standardPhonetic: "enti",
    englishMeaning: "That one / That there",
    culturalContext:
      "A Udupi-distinct demonstrative pronoun. 'Entina' (this one / that one) is softer than " +
      "standard 'enti', with a drawn-out 'i'. It reflects the slower, more deliberate speech " +
      "rhythm of Udupi's temple-town culture. Used when pointing at something across a room or " +
      "across the dining table.",
    audioPitchProfile: "mid, gently rising on 'na'",
    upvotes: 32,
    verified: true,
    contributorName: "Linguistic Field Collection",
  },
];

module.exports = { karavaliEntries };