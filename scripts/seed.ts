/**
 * Swara-Setu seed script.
 *
 * Loads 50+ authentic Karnataka regional dialect entries into the database.
 * If a real MongoDB connection is available, it writes to it;
 * otherwise, it falls back to an in-memory store for a crash‑free demo.
 */

const path = require("path");
const { fileURLToPath } = require("url");
const { connectDb, disconnectDb, dbStatus, getMemoryStoreSingleton } = require("../lib/db");
const { DialectEntry } = require("../models/DialectEntry");
const { ParallelPhrase } = require("../models/ParallelPhrase");
const { Region } = require("../models/Region");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Check if there is already data in the collection. The user can pass `--force`
 * to skip this check and overwrite.
 */
async function hasData() {
  const conn = await connectDb();
  if (conn) {
    // Real MongoDB connection
    const counts = await Promise.all([
      Region.countDocuments(),
      DialectEntry.countDocuments(),
      ParallelPhrase.countDocuments(),
    ]);
    return counts.some((c) => c > 0);
  } else {
    // In-memory fallback
    const store = getMemoryStoreSingleton();
    return store.collections.size > 0 &&
      (store.collections.get("regions")?.length || 0) > 0;
  }
}

/**
 * Load region data and write to the database.
 */
async function seedRegions() {
  console.log("🌍 Loading Region data…");
  const { ZONES } = require("../lib/constants");

  const cleaned = ZONES.map((zone: any) => ({
    slug: zone.slug,
    nameEnglish: zone.nameEnglish,
    nameKannada: zone.nameKannada,
    colorHex: zone.color,
    districts: zone.districts,
    linguisticCharacteristics: [],
    culturalHistory: zone.description,
    coordinates: [76.1, 15.0],
  }));

  const conn = await connectDb();
  if (conn) {
    // Real MongoDB connection
    const operations = cleaned.map((region: any) => (
      Region.replaceOne({ slug: region.slug }, region, { upsert: true })
    ));
    await Promise.all(operations);
  } else {
    // In-memory fallback
    const store = getMemoryStoreSingleton();
    store.collections.set("regions", cleaned);
  }
  console.log(`✅ Region data: ${cleaned.length} entries loaded`);
}

/**
 * Load all regional dialect entries and write them.
 */
async function seedDialectEntries() {
  console.log("🗣 Loading DialectEntry data…");

  const {
    kalyanaUttaraEntries,
    oldMysuruEntries,
    karavaliEntries,
    malnadEntries,
    kitturEntries,
  } = require("../lib/seedData/index");

  const dialectArrays = [
    ...kalyanaUttaraEntries,
    ...oldMysuruEntries,
    ...karavaliEntries,
    ...malnadEntries,
    ...kitturEntries,
  ];

  const dialectData = dialectArrays.map((entry) => ({
    regionSlug: entry.regionSlug,
    district: entry.district,
    category: entry.category,
    regionalKannada: entry.regionalKannada,
    regionalPhonetic: entry.regionalPhonetic,
    standardKannada: entry.standardKannada,
    standardPhonetic: entry.standardPhonetic,
    englishMeaning: entry.englishMeaning,
    culturalContext: entry.culturalContext,
    audioPitchProfile: entry.audioPitchProfile,
    upvotes: entry.upvotes || 0,
    verified: Boolean(entry.verified),
    contributorName: entry.contributorName?.trim() || undefined,
  }));

  const conn = await connectDb();
  if (conn) {
    // Real MongoDB connection
    const operations = dialectData.map((entry) => (
      DialectEntry.replaceOne(
        { regionSlug: entry.regionSlug, district: entry.district, category: entry.category },
        entry,
        { upsert: true }
      )
    ));
    await Promise.all(operations);
  } else {
    // In-memory fallback
    const store = getMemoryStoreSingleton();
    store.collections.set("dialectentries", dialectData);
  }
  console.log(`✅ DialectEntry data: ${dialectData.length} entries loaded`);
}

/**
 * Load ParallelPhrase entries for the 5 regional variants matrix.
 */
async function seedParallelPhrases() {
  console.log("🔀 Loading ParallelPhrase data…");

  const parallelData = [
    {
      intentCategory: "Greeting",
      englishPrompt: "Hello! How are you?",
      standardKannada: "ನಮಸ್ಕಾರ? ಹೇಗಿದ್ದೀರಿ?",
      standardPhonetic: "namaskaara? hegi dindiri?",
      variations: {
        old_mysuru: {
          script: "ನಮಸ್ಕಾರ? ಹಾಗೀಗೆ?",
          phonetic: "namaskaara? haagigu?",
          grammarNote: "Vowel elongation + respect",
        },
        uttara_karnataka: {
          script: "ನಮಸ್ಕಾರ? ಹೆ إنಾ ಚುಂಡೆ?",
          phonetic: "namaskaara? hentē chumdē?",
          grammarNote: "Shortened 'ಹೆ' + '-ೆ' suffix",
        },
        karavali_kundapura: {
          script: "ನಿರವು ಚುಂಡೆ?",
          phonetic: "nirava chumdē?",
          grammarNote: "Dropped final vowel",
        },
        malnad_havyaka: {
          script: "ನೆಮಸ್ಕಾರ? ಹೇಗಿದ್ದಾ?",
          phonetic: "nemaaskaara? hegi ditta?",
          grammarNote: "Preserved Halegannada case endings",
        },
        kalyana_hosapete: {
          script: "ನಂಕಾರ ಮಾರಾಯ?",
          phonetic: "namkaara maaraya?",
          grammarNote: "Marathi loanword 'maaraya'",
        },
      },
    },
    {
      intentCategory: "Share Meal",
      englishPrompt: "Would you like some food?",
      standardKannada: "ಏನು ಆಹಾರ?",
      standardPhonetic: "aenu aahaara?",
      variations: {
        old_mysuru: {
          script: "ಏಂತ ಆಹಾರ?",
          phonetic: "emtha aahaara?",
          grammarNote: "Vowel elongation, respectful",
        },
        uttara_karnataka: {
          script: "ಎಂತ ಆಹಾರ?",
          phonetic: "emtha aahaara?",
          grammarNote: "Same vowel profile, distinct -ri respect marker",
        },
        karavali_kundapura: {
          script: "ಎಂತ ಅತ್ತ?",
          phonetic: "emtha atta?",
          grammarNote: "Dropped final vowel, Tulu influence",
        },
        malnad_havyaka: {
          script: "ಏಂತ ಆಹಾರ?",
          phonetic: "emtha aahaara?",
          grammarNote: "Preserved case endings",
        },
        kalyana_hosapete: {
          script: "ಎಂತ ಆಹಾರ?",
          phonetic: "emtha aahaara?",
          grammarNote: "Marathi 'aahaara' pluralization",
        },
      },
    },
    {
      intentCategory: "Wayfinding",
      englishPrompt: "Where is the bazaar?",
      standardKannada: "ಬಾಜಾರ್ ಎಲ್ಲಿದ್ದೀರಿ?",
      standardPhonetic: "bajaar elliddivi?",
      variations: {
        old_mysuru: {
          script: "ಬಾಜಾರ್ ಎಲ್ಲೇ?",
          phonetic: "bajaara emdu illeye?",
          grammarNote: "Elongated 'ar' at end",
        },
        uttara_karnataka: {
          script: "ಬಾಜಾರ್ ಎಲ್ಲಿದ್ದೆ?",
          phonetic: "bajaara ellide?",
          grammarNote: "Simplified vowel",
        },
        karavali_kundapura: {
          script: "ಬಾಜಾರ್ ಎಲ್ಲಿನೆ?",
          phonetic: "bajaara elline?",
          grammarNote: "Coastal dropping final vowel",
        },
        malnad_havyaka: {
          script: "ಬಾಜಾರ್ ಎಲ್ಲಿಗ್ಗದೆ?",
          phonetic: "bajaara elliggade?",
          grammarNote: "Preserved plural ending",
        },
        kalyana_hosapete: {
          script: "ಬಾಜಾರ್ ಎಂದೆ ಇಲ್ಲೆ?",
          phonetic: "bajaara emta ille?",
          grammarNote: "Emphasized interrogative",
        },
      },
    },
  ];

  const conn = await connectDb();
  if (conn) {
    // Real MongoDB connection
    const operations = parallelData.map((phrase) => (
      ParallelPhrase.replaceOne(
        { intentCategory: phrase.intentCategory },
        phrase,
        { upsert: true }
      )
    ));
    await Promise.all(operations);
  } else {
    // In-memory fallback
    const store = getMemoryStoreSingleton();
    store.collections.set("parallelphrases", parallelData);
  }
  console.log(`✅ ParallelPhrase data: ${parallelData.length} entries loaded`);
}

/**
 * Main entry point. Orchestrates region, dialect entry, and phrase seeding.
 */
async function runSeed() {
  try {
    console.log("🔄 Swara-Setu seed running…");
    console.log("📊 DB status:", await dbStatus());

    const existing = await hasData();
    const force = process.argv.includes("--force") || process.argv.includes("-f");

    if (existing && !force) {
      console.log("⚠️  Database already contains data. Use --force to overwrite.");
      process.exit(0);
    }

    if (force) {
      console.log("♻️  Force mode — clearing existing collections…");
      const conn = await connectDb();
      if (conn) {
        // Real MongoDB connection
        await Promise.all([
          Region.deleteMany({}),
          DialectEntry.deleteMany({}),
          ParallelPhrase.deleteMany({}),
        ]);
      } else {
        // In-memory fallback
        const store = getMemoryStoreSingleton();
        store.collections.clear();
      }
    }

    await seedRegions();
    await seedDialectEntries();
    await seedParallelPhrases();

    console.log("✅ Seeding complete.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during seed:", error);
    process.exit(1);
  } finally {
    await disconnectDb();
  }
}

// Run the seed script when executed directly
if (require.main === module) {
  runSeed();
}

module.exports = { runSeed };