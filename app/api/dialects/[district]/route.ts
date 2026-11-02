import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { Region } from "@/models/Region";
import { Phrase } from "@/models/Phrase";
import { DISTRICT_TO_REGION_MAP, KANNADA_DISTRICT_NAMES } from "@/lib/districtMapping";
import { STATIC_REGION_MAP } from "@/lib/staticRegionData";

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
    )?.[1] ||
    "kaveri_basin";

  try {
    const conn = await connectDb();

    if (conn && conn.readyState === 1) {
      // Find phrases in MongoDB matching the district directly or through the region cluster
      const query = {
        $or: [
          { districts: { $regex: new RegExp(`^${rawDistrict}$`, "i") } },
          ...(mappedRegionId ? [{ regionId: mappedRegionId }] : []),
        ],
      };

      const phrases = await Phrase.find(query).sort({ recordId: 1 }).lean();

      if (phrases && phrases.length > 0) {
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
      }
    }
  } catch (error: any) {
    console.warn(`[api/dialects/${rawDistrict}] MongoDB unavailable, serving static region data:`, error?.message);
  }

  // Standalone fallback: guaranteed high-quality regional data
  const staticRegion = STATIC_REGION_MAP[mappedRegionId] || STATIC_REGION_MAP["kaveri_basin"];

  return NextResponse.json({
    source: "static_dataset",
    district: rawDistrict,
    districtKannada: KANNADA_DISTRICT_NAMES[rawDistrict] || rawDistrict,
    regionId: mappedRegionId,
    region: {
      regionId: staticRegion.regionId,
      name: staticRegion.name,
      nameKannada: staticRegion.nameKannada,
      districts: staticRegion.districts,
      colorClass: staticRegion.colorClass,
      badgeBg: staticRegion.badgeBg,
      highlightHex: staticRegion.highlightHex,
      description: staticRegion.description,
    },
    count: staticRegion.phrases.length,
    phrases: staticRegion.phrases,
  });
}
