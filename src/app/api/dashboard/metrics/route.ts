import { NextResponse } from "next/server";
import { REGISTRIES, syncRegistry } from "@/lib/registry-sync";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Sync all registries to get current status
    const activeRegistries = REGISTRIES.filter((r) => r.enabled);
    const syncResults = await Promise.all(
      activeRegistries.map((registry) => syncRegistry(registry))
    );

    const activeCount = syncResults.filter((r) => r.status === "success").length;

    // TODO: See issue #29 in act-regenerative-studio: Fetch real deployment and form submission data
    // For now, returning placeholder metrics
    const metrics = {
      totalProjects: 6, // Empathy Ledger, JusticeHub, Harvest, ACT Farm, Goods, BCV
      activeRegistries: activeCount,
      recentDeployments: 0, // Will be populated by Vercel API integration
      formSubmissions24h: 0, // Will be populated by GHL webhook data
    };

    return NextResponse.json(metrics);
  } catch (error) {
    console.error("Failed to fetch dashboard metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch metrics" },
      { status: 500 }
    );
  }
}
