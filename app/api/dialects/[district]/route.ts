import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { Region } from "@/models/Region";
import { Phrase } from "@/models/Phrase";
import { DISTRICT_TO_REGION_MAP, KANNADA_DISTRICT_NAMES } from "@/lib/districtMapping";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: { district: string } }
) {
  const rawDistrict = decodeURIComponent(params.district || "").trim();

  if (!rawDistrict) {
    return NextResponse.json(
      { error: "District name parameter is required" },
      { status: 400 }
    );
  }

  // Determine region ID based on district name mapping
  const mappedRegionId =
    DISTRICT_TO_REGION_MAP[rawDistrict] ||
    Object.entries(DISTRICT_TO_REGION_MAP).find(
      ([d]) => d.toLowerCase() === rawDistrict.toLowerCase()
    )?.[1];

  try {
    const conn = await connectDb();

    if (!conn || conn.readyState !== 1) {
      return NextResponse.json(
        {
          error: "Database not connected. Please ensure MongoDB is running.",
          source: "database_error",
          district: rawDistrict,
          phrases: [],
        },
        { status: 503 }
      );
    }

    // Find phrases in MongoDB matching the district directly or through the region cluster
    const query = {
      $or: [
        { districts: { $regex: new RegExp(`^${rawDistrict}$`, "i") } },
        ...(mappedRegionId ? [{ regionId: mappedRegionId }] : []),
      ],
    };

    const phrases = await Phrase.find(query).sort({ recordId: 1 }).lean();

    // Retrieve region metadata directly from Region collection
    let regionInfo = mappedRegionId
      ? await Region.findOne({ regionId: mappedRegionId }).lean()
      : null;

    if (!regionInfo && phrases.length > 0) {
      regionInfo = await Region.findOne({ regionId: phrases[0].regionId }).lean();
    }

    return NextResponse.json({
      source: "mongodb",
      district: rawDistrict,
      districtKannada: KANNADA_DISTRICT_NAMES[rawDistrict] || rawDistrict,
      regionId: regionInfo?.regionId || mappedRegionId,
      region: regionInfo,
      count: phrases.length,
      phrases,
    });
  } catch (error: any) {
    console.error(`[api/dialects/${rawDistrict}] MongoDB query error:`, error);
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch dialect phrases from database",
        source: "database_error",
        district: rawDistrict,
        phrases: [],
      },
      { status: 500 }
    );
  }
}
