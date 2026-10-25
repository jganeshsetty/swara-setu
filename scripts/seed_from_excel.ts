/**
 * Seed Script for Swara-Setu (ಸ್ವರಸೇತು)
 * Reads `kannada_regional_sentence_corpus_300_FIXED.xlsx`,
 * parses 370 regional phrases across the 10 defined Karnataka regional groups,
 * and populates MongoDB (Region & Phrase collections).
 *
 * Usage:
 *   npm run seed:excel
 *   npx tsx scripts/seed_from_excel.ts [--force]
 */

import path from "path";
import fs from "fs";
import * as xlsx from "xlsx";
import mongoose from "mongoose";
import { connectDb, disconnectDb } from "../lib/db";
import { Region } from "../models/Region";
import { Phrase } from "../models/Phrase";

// Group mapping from Excel group_id (1-10) to regionId and styling
const GROUP_META: Record<
  number,
  {
    regionId: string;
    nameKannada: string;
    districtsEn: string[];
    districtsKn: string[];
    colorClass: string;
    badgeBg: string;
    highlightHex: string;
    description: string;
  }
> = {
  1: {
    regionId: "uttara_kalyana",
    nameKannada: "ಉತ್ತರ ಕಲ್ಯಾಣ (ಬೀದರ್ - ಕಲಬುರಗಿ - ಯಾದಗಿರಿ)",
    districtsEn: ["Bidar", "Kalaburagi", "Yadgir"],
    districtsKn: ["ಬೀದರ್", "ಕಲಬುರಗಿ", "ಯಾದಗಿರಿ"],
    colorClass: "text-amber-800",
    badgeBg: "bg-amber-100 text-amber-950 border-amber-300",
    highlightHex: "#FFE500",
    description: "ದಖ್ಖನ್ ಬಹಮನಿ-ಸೂಫಿ ಹಾಗೂ ಶರಣರ ವಚನ ಸಂಸ್ಕೃತಿಯ ಸಂಗಮ. ಗೌರವಾರ್ಥಕ '-ರೀ' ಪ್ರತ್ಯಯ ಹಾಗೂ ನೇರ, ಸರಳ ವ್ಯಾಪಾರಿ ಮಾತುಗಾರಿಕೆ ಇಲ್ಲಿನ ವೈಶಿಷ್ಟ್ಯ.",
  },
  2: {
    regionId: "tungabhadra_belt",
    nameKannada: "ತುಂಗಭದ್ರಾ ತೀರ (ರಾಯಚೂರು - ಕೊಪ್ಪಳ - ಬಳ್ಳಾರಿ - ವಿಜಯನಗರ)",
    districtsEn: ["Raichur", "Koppal", "Ballari", "Vijayanagara"],
    districtsKn: ["ರಾಯಚೂರು", "ಕೊಪ್ಪಳ", "ಬಳ್ಳಾರಿ", "ವಿಜಯನಗರ"],
    colorClass: "text-amber-800",
    badgeBg: "bg-amber-100 text-amber-950 border-amber-300",
    highlightHex: "#FFE500",
    description: "ತುಂಗಭದ್ರಾ ನದಿ ತೀರ ಹಾಗೂ ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯದ ಗಣಿಗಾರಿಕೆ ನೆಲ. ಇಲ್ಲಿನ ಭಾಷೆಯಲ್ಲಿ ವೇಗದ ಗತಿ ಹಾಗೂ ಆಪ್ತ ಕರೆಯ ನಾದವಿದೆ.",
  },
  3: {
    regionId: "krishna_valley",
    nameKannada: "ಕೃಷ್ಣಾ ಕಣಿವೆ (ಬೆಳಗಾವಿ - ಬಾಗಲಕೋಟೆ - ವಿಜಯಪುರ)",
    districtsEn: ["Belagavi", "Bagalkote", "Vijayapura"],
    districtsKn: ["ಬೆಳಗಾವಿ", "ಬಾಗಲಕೋಟೆ", "ವಿಜಯಪುರ"],
    colorClass: "text-amber-800",
    badgeBg: "bg-amber-100 text-amber-950 border-amber-300",
    highlightHex: "#FFE500",
    description: "ಘಟಪ್ರಭಾ-ಮಲಪ್ರಭಾ ಕೃಷಿ ಸಂಸ್ಕೃತಿ ಹಾಗೂ ಮರಾಠಿ ಗಡಿ ಸಂಪರ್ಕದ ಪ್ರಭಾವ. ಧ್ವನಿಯ ಹ್ರಸ್ವತೆ ಮತ್ತು ಗಟ್ಟಿ ನುಡಿಗಟ್ಟುಗಳು ಇಲ್ಲಿನ ಹೆಗ್ಗುರುತು.",
  },
  4: {
    regionId: "hubballi_heartland",
    nameKannada: "ಮಧ್ಯ ಕರ್ನಾಟಕ ವಾಣಿಜ್ಯ ಸೀಮೆ (ಧಾರವಾಡ - ಗದಗ - ಹಾವೇರಿ)",
    districtsEn: ["Dharwad", "Gadag", "Haveri"],
    districtsKn: ["ಧಾರವಾಡ", "ಗದಗ", "ಹಾವೇರಿ"],
    colorClass: "text-amber-800",
    badgeBg: "bg-amber-100 text-amber-950 border-amber-300",
    highlightHex: "#FFE500",
    description: "ಹುಬ್ಬಳ್ಳಿ-ಧಾರವಾಡ ಅವಳಿ ನಗರಗಳ ವ್ಯಾಪಾರಿ ಭಾಷೆ, ಪೇಡಾದ ಮಾಧುರ್ಯ ಮತ್ತು ಚಹಾ ಅಡ್ಡಾದ ಸಾಹಿತ್ಯಕ ಹಾಸ್ಯ ಚಟಾಕಿಗಳು.",
  },
  5: {
    regionId: "karavali_coast",
    nameKannada: "ಕರಾವಳಿ ಕರ್ನಾಟಕ (ಉತ್ತರ ಕನ್ನಡ - ಉಡುಪಿ - ದಕ್ಷಿಣ ಕನ್ನಡ)",
    districtsEn: ["Uttara Kannada", "Udupi", "Dakshina Kannada"],
    districtsKn: ["ಉತ್ತರ ಕನ್ನಡ", "ಉಡುಪಿ", "ದಕ್ಷಿಣ ಕನ್ನಡ"],
    colorClass: "text-red-700",
    badgeBg: "bg-red-100 text-red-950 border-red-300",
    highlightHex: "#FFE500",
    description: "ಅರಬ್ಬಿ ಸಮುದ್ರದ ತೀರದ ನಾದ. ತುಳು-ಕೊಂಕಣಿ ಮಿಶ್ರಿತ ಶಬ್ದಗಳು, ಅಂತಿಮ ಸ್ವರ ಲೋಪ ಮತ್ತು ಪ್ರೀತಿಯ 'ಮಾರಾಯ' ಸಂಬೋಧನೆ.",
  },
  6: {
    regionId: "malnad_ghats",
    nameKannada: "ಮಲೆನಾಡು ಗಿರಿಧಾಮ (ಶಿವಮೊಗ್ಗ - ಚಿಕ್ಕಮಗಳೂರು - ಕೊಡಗು)",
    districtsEn: ["Shivamogga", "Chikkamagaluru", "Kodagu"],
    districtsKn: ["ಶಿವಮೊಗ್ಗ", "ಚಿಕ್ಕಮಗಳೂರು", "ಕೊಡಗು"],
    colorClass: "text-red-700",
    badgeBg: "bg-red-100 text-red-950 border-red-300",
    highlightHex: "#FFE500",
    description: "ಪಶ್ಚಿಮ ಘಟ್ಟಗಳ ಹಸಿರು ಕಾಫಿ-ಅಡಿಕೆ ತೋಟಗಳ ನೆಲ. ಹಳಗನ್ನಡದ ಪದಗಳು, ಮಳೆಗಾಲದ ಜಡಿಮಳೆಯ ನುಡಿಗಟ್ಟುಗಳ ಶ್ರೀಮಂತ ಸಂಸ್ಕೃತಿ.",
  },
  7: {
    regionId: "bayalu_seeme",
    nameKannada: "ಮಧ್ಯ ಬಯಲು ಸೀಮೆ (ದಾವಣಗೆರೆ - ಚಿತ್ರದುರ್ಗ - ತುಮಕೂರು)",
    districtsEn: ["Davanagere", "Chitradurga", "Tumakuru"],
    districtsKn: ["ದಾವಣಗೆರೆ", "ಚಿತ್ರದುರ್ಗ", "ತುಮಕೂರು"],
    colorClass: "text-red-700",
    badgeBg: "bg-red-100 text-red-950 border-red-300",
    highlightHex: "#FFE500",
    description: "ಕೋಟೆಗಳ ನಾಡು ಮತ್ತು ಬೆಣ್ಣೆ ದೋಸೆಯ ತವರು. ಗಟ್ಟಿ ನುಡಿ, ನೇರ ಮಾತು ಹಾಗೂ ಕೃಷಿಕರ ಮಣ್ಣಿನ ಸೊಗಡಿನ ಕನ್ನಡ.",
  },
  8: {
    regionId: "kaveri_basin",
    nameKannada: "ಕಾವೇರಿ ಕಣಿವೆ (ಮೈಸೂರು - ಮಂಡ್ಯ - ಚಾಮರಾಜನಗರ)",
    districtsEn: ["Mysuru", "Mandya", "Chamarajanagara"],
    districtsKn: ["ಮೈಸೂರು", "ಮಂಡ್ಯ", "ಚಾಮರಾಜನಗರ"],
    colorClass: "text-red-700",
    badgeBg: "bg-red-100 text-red-950 border-red-300",
    highlightHex: "#FFE500",
    description: "ಒಡೆಯರ್ ರಾಜಪರಂಪರೆ ಹಾಗೂ ಕಬ್ಬಿನ ಗದ್ದೆಗಳ ಸೊಬಗು. ಸ್ವರಗಳ ಉದ್ದನೆ ಉಚ್ಚಾರಣೆ ಹಾಗೂ ಪ್ರೀತಿಯ 'ಕಣೋ/ಕಣ್ರೀ' ಸಂಬೋಧನೆಯ ಕನ್ನಡ.",
  },
  9: {
    regionId: "dakshina_ghats",
    nameKannada: "ದಕ್ಷಿಣ ಹೆಬ್ಬಾಗಿಲು (ಹಾಸನ - ರಾಮನಗರ)",
    districtsEn: ["Hassan", "Ramanagara"],
    districtsKn: ["ಹಾಸನ", "ರಾಮನಗರ"],
    colorClass: "text-red-700",
    badgeBg: "bg-red-100 text-red-950 border-red-300",
    highlightHex: "#FFE500",
    description: "ಹೊಯ್ಸಳ ಶಿಲ್ಪಕಲೆ ಹಾಗೂ ರೇಷ್ಮೆ ಗೂಡಿನ ನಾಡು. ಮಲೆನಾಡಿನ ಶಾಂತತೆ ಮತ್ತು ರಾಜಧಾನಿ ಗಡಿಯ ವೇಗದ ನುಡಿ ಸಂಗಮ.",
  },
  10: {
    regionId: "kolar_bengaluru",
    nameKannada: "ಪೂರ್ವ ಗಡಿ ಪ್ರಸ್ಥಭೂಮಿ (ಬೆಂಗಳೂರು - ಕೋಲಾರ - ಚಿಕ್ಕಬಳ್ಳಾಪುರ)",
    districtsEn: ["Bengaluru Urban", "Bengaluru Rural", "Kolar", "Chikkaballapura"],
    districtsKn: ["ಬೆಂಗಳೂರು ನಗರ", "ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ", "ಕೋಲಾರ", "ಚಿಕ್ಕಬಳ್ಳಾಪುರ"],
    colorClass: "text-red-700",
    badgeBg: "bg-red-100 text-red-950 border-red-300",
    highlightHex: "#FFE500",
    description: "ರಾಜಧಾನಿ ಮಹಾನಗರ ಹಾಗೂ ಪೂರ್ವ ಪ್ರಸ್ಥಭೂಮಿ. ತೆಲುಗು-ತಮಿಳು ಗಡಿ ಸಂಪರ್ಕ, ಆಧುನಿಕ ಆಡುಮಾತು ಹಾಗೂ 'ಮಚ್ಚಾ/ಗುರು' ಶೈಲಿಯ ಬೆಂಗಳೂರು ಕನ್ನಡ.",
  },
};

interface ExcelRow {
  record_id?: string;
  group_id?: number | string;
  group_name_kn?: string;
  districts_in_project_cluster?: string;
  standard_kannada?: string;
  regional_kannada_draft?: string;
  english_meaning?: string;
  topic?: string;
  sentence_length_class?: string;
  candidate_feature?: string;
  evidence_status?: string;
  native_speaker_validation?: string;
  confidence?: string;
  notes?: string;
}

export async function seedDatabaseFromExcel() {
  console.log("🚀 Starting Swara-Setu Excel Database Seeding...");

  // Load environment variables if needed
  if (!process.env.MONGODB_URI) {
    const envLocalPath = path.resolve(process.cwd(), ".env.local");
    if (fs.existsSync(envLocalPath)) {
      const content = fs.readFileSync(envLocalPath, "utf-8");
      content.split("\n").forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
          const [k, ...v] = trimmed.split("=");
          process.env[k.trim()] = v.join("=").trim();
        }
      });
    }
    if (!process.env.MONGODB_URI) {
      process.env.MONGODB_URI = "mongodb://127.0.0.1:27017/swara_setu";
    }
  }

  const conn = await connectDb();
  if (!conn || conn.readyState !== 1) {
    console.error("❌ Failed to establish connection with MongoDB. Check MONGODB_URI.");
    process.exit(1);
  }

  console.log("✅ Connected to MongoDB:", conn.name);

  const excelFilePath = path.resolve(
    process.cwd(),
    "kannada_regional_sentence_corpus_300_FIXED.xlsx"
  );

  if (!fs.existsSync(excelFilePath)) {
    console.error(`❌ Excel file not found at: ${excelFilePath}`);
    process.exit(1);
  }

  console.log(`📖 Reading Excel file: ${path.basename(excelFilePath)}`);
  const workbook = xlsx.readFile(excelFilePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json<ExcelRow>(worksheet);

  console.log(`📊 Successfully parsed ${rows.length} rows from Excel sheet "${sheetName}"`);

  const force = process.argv.includes("--force") || process.argv.includes("-f");

  // 1. Seed or Upsert Regions (10 regions)
  console.log("📍 Upserting 10 Karnataka Cultural Regions...");
  for (let gId = 1; gId <= 10; gId++) {
    const meta = GROUP_META[gId];
    if (!meta) continue;

    const regionDoc = {
      regionId: meta.regionId,
      name: meta.nameKannada.split("(")[0].trim(),
      nameKannada: meta.nameKannada,
      districts: meta.districtsKn,
      colorClass: meta.colorClass,
      badgeBg: meta.badgeBg,
      highlightHex: meta.highlightHex,
      description: meta.description,
    };

    await Region.findOneAndUpdate({ regionId: meta.regionId }, regionDoc, {
      upsert: true,
      new: true,
    });
  }
  console.log("✅ 10 Regions populated successfully.");

  // 2. Prepare and Seed Phrases
  console.log("💬 Processing and inserting regional phrases...");
  if (force) {
    console.log("♻️  --force flag passed: clearing existing Phrase collection...");
    await Phrase.deleteMany({});
  }

  const phraseDocs = [];
  for (const row of rows) {
    if (!row.standard_kannada || !row.regional_kannada_draft) continue;

    const groupId = Number(row.group_id);
    const meta = GROUP_META[groupId];
    const regionId = meta ? meta.regionId : "kaveri_basin";

    // Split districts into list of strings (both English and Kannada)
    const rawDistricts = (row.districts_in_project_cluster || "")
      .split(";")
      .map((d) => d.trim())
      .filter(Boolean);

    const allDistrictKeys = Array.from(
      new Set([...rawDistricts, ...(meta?.districtsEn || []), ...(meta?.districtsKn || [])])
    );

    phraseDocs.push({
      regionId,
      districts: allDistrictKeys,
      recordId: row.record_id || "",
      textbook: row.standard_kannada.trim(),
      regional: row.regional_kannada_draft.trim(),
      meaning: (row.english_meaning || "").trim(),
      topic: (row.topic || "").trim(),
      sentenceLengthClass: (row.sentence_length_class || "").trim(),
      candidateFeature: (row.candidate_feature || "").trim(),
      evidenceStatus: (row.evidence_status || "").trim(),
      nativeSpeakerValidation: (row.native_speaker_validation || "").trim(),
      confidence: (row.confidence || "").trim(),
      notes: (row.notes || "").trim(),
      audioUrl: "",
    });
  }

  // Insert or update in bulk operations
  if (force) {
    await Phrase.insertMany(phraseDocs);
    console.log(`✅ Bulk inserted ${phraseDocs.length} phrases.`);
  } else {
    const ops = phraseDocs.map((p) => ({
      updateOne: {
        filter: { recordId: p.recordId },
        update: { $set: p },
        upsert: true,
      },
    }));
    const res = await Phrase.bulkWrite(ops);
    console.log(
      `✅ Bulk upsert complete: ${res.upsertedCount} inserted, ${res.modifiedCount} modified.`
    );
  }

  const totalPhrases = await Phrase.countDocuments();
  const totalRegions = await Region.countDocuments();
  console.log(`\n🎉 Summary:`);
  console.log(`   - Total Regions in DB: ${totalRegions}`);
  console.log(`   - Total Phrases in DB: ${totalPhrases}`);

  await disconnectDb();
  console.log("👋 Database connection closed.");
}

// Allow direct CLI execution
if (require.main === module || process.argv[1]?.includes("seed_from_excel")) {
  seedDatabaseFromExcel()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("❌ Seeding failed:", err);
      process.exit(1);
    });
}
