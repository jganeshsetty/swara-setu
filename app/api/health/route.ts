import { dbStatus } from "@/lib/db";
import { Region } from "@/models/Region";
import { DialectEntry } from "@/models/DialectEntry";
import { ParallelPhrase } from "@/models/ParallelPhrase";

export const runtime = "nodejs";

export async function GET() {
  const status = dbStatus();
  let counts: { regions: number; entries: number; phrases: number } = {
    regions: 0,
    entries: 0,
    phrases: 0,
  };

  if (status === "connected") {
    try {
      counts = {
        regions: await Region.estimatedDocumentCount(),
        entries: await DialectEntry.estimatedDocumentCount(),
        phrases: await ParallelPhrase.estimatedDocumentCount(),
      };
    } catch (error) {
      console.warn("[health] Count failed:", error);
    }
  }

  return Response.json({
    status,
    db: status === "connected" ? "mongodb" : status === "memory" ? "in-memory" : "unconfigured",
    dataset: counts,
    timestamp: new Date().toISOString(),
  });
}