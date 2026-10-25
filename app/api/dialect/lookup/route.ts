import { DialectEntry } from "@/models/DialectEntry";
import { Region } from "@/models/Region";
import { connectDb, disconnectDb } from "@/lib/db";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const phrase = searchParams.get("phrase") || "";
  const region = searchParams.get("region") || "";

  try {
    await connectDb();

    // Search dialect entries
    let filter: any = {};
    if (phrase) {
      filter.$or = [
        { regionalKannada: { $regex: phrase, $options: "i" } },
        { standardKannada: { $regex: phrase, $options: "i" } },
        { englishMeaning: { $regex: phrase, $options: "i" } },
      ];
    }
    if (region) {
      filter.regionSlug = region;
    }

    const results = await DialectEntry.find(filter)
      .sort({ upvotes: -1, verified: -1 })
      .limit(20);

    // If no results, fall back to Gemini API grounded by lexicon
    let aiEnrichment = null;
    if (results.length === 0 && process.env.GEMINI_API_KEY) {
      // Placeholder for AI enrichment
      aiEnrichment = await enrichWithGemini(phrase, region);
    }

    return NextResponse.json({
      success: true,
      results,
      aiEnrichment,
      count: results.length,
    });
  } catch (error) {
    console.error("[api/dialect/lookup] Error:", error);
    return NextResponse.json(
      { success: false, error: "Database query failed" },
      { status: 500 }
    );
  } finally {
    await disconnectDb();
  }
}

async function enrichWithGemini(phrase: string, region: string | null) {
  // Placeholder - would use @google/genai grounded by MongoDB lexicon
  return {
    method: "gemini-grounded",
    message: "AI linguistic verification pending",
    verified: false,
  };
}