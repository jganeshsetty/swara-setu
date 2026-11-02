import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { Region } from "@/models/Region";
import { Phrase } from "@/models/Phrase";
import { STATIC_REGIONS_LIST, STATIC_REGION_MAP } from "@/lib/staticRegionData";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestedRegionId = searchParams.get("regionId");

  try {
    const conn = await connectDb();

    if (conn && conn.readyState === 1) {
      // Filter regions if a specific regionId was requested
      const query = requestedRegionId ? { regionId: requestedRegionId } : {};
      const regions = await Region.find(query).lean();

      if (regions && regions.length > 0) {
        // Populate phrases directly from MongoDB Phrase collection
        const regionsWithPhrases = await Promise.all(
          regions.map(async (reg) => {
            const phrases = await Phrase.find({ regionId: reg.regionId })
              .sort({ recordId: 1 })
              .lean();
            return {
              ...reg,
              phrases: phrases.length > 0 ? phrases : (STATIC_REGION_MAP[reg.regionId]?.phrases || []),
            };
          })
        );

        return NextResponse.json({
          source: "mongodb",
          regions: regionsWithPhrases,
        });
      }
    }
  } catch (error: any) {
    console.warn("[api/regions] MongoDB unavailable, serving static region data:", error?.message);
  }

  // Standalone fallback: always return guaranteed regional dataset
  const fallbackRegions = requestedRegionId
    ? STATIC_REGIONS_LIST.filter((r) => r.regionId === requestedRegionId)
    : STATIC_REGIONS_LIST;

  return NextResponse.json({
    source: "static_dataset",
    regions: fallbackRegions,
  });
}
