import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { Region } from "@/models/Region";
import { Phrase } from "@/models/Phrase";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestedRegionId = searchParams.get("regionId");

  try {
    const conn = await connectDb();

    if (!conn || conn.readyState !== 1) {
      return NextResponse.json(
        {
          error: "Database connection failed. Please ensure MongoDB is running.",
          source: "database_error",
          regions: [],
        },
        { status: 503 }
      );
    }

    // Filter regions if a specific regionId was requested
    const query = requestedRegionId ? { regionId: requestedRegionId } : {};
    const regions = await Region.find(query).lean();

    if (!regions || regions.length === 0) {
      return NextResponse.json({
        source: "mongodb",
        regions: [],
        message: "No regions found in database. Run 'npm run seed:excel' to seed.",
      });
    }

    // Populate phrases directly from MongoDB Phrase collection
    const regionsWithPhrases = await Promise.all(
      regions.map(async (reg) => {
        const phrases = await Phrase.find({ regionId: reg.regionId })
          .sort({ recordId: 1 })
          .lean();
        return {
          ...reg,
          phrases,
        };
      })
    );

    return NextResponse.json({
      source: "mongodb",
      regions: regionsWithPhrases,
    });
  } catch (error: any) {
    console.error("[api/regions] MongoDB error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch regions from database",
        source: "database_error",
        regions: [],
      },
      { status: 500 }
    );
  }
}
