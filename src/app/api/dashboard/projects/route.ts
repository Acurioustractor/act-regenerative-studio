import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface Project {
  name: string;
  slug: string;
  url: string;
  status: "healthy" | "degraded" | "down" | "unknown";
  lastDeployed: string;
  registryStatus: "active" | "stale" | "error" | "none";
  githubRepo: string;
  vercelProject: string;
}

export async function GET() {
  try {
    // TODO: See issue #27 in act-regenerative-studio: Fetch real deployment status from Vercel API
    // TODO: See issue #28 in act-regenerative-studio: Check actual site health with HEAD requests
    // For now, returning static project list

    const projects: Project[] = [
      {
        name: "Empathy Ledger",
        slug: "empathy-ledger",
        url: "https://empathy-ledger-v2.vercel.app",
        status: "unknown",
        lastDeployed: new Date().toISOString(),
        registryStatus: "active",
        githubRepo: "Acurioustractor/empathy-ledger-v2",
        vercelProject: "acurioustractor/empathy-ledger-v2",
      },
      {
        name: "JusticeHub",
        slug: "justicehub",
        url: "https://justicehub-vert.vercel.app",
        status: "unknown",
        lastDeployed: new Date().toISOString(),
        registryStatus: "active",
        githubRepo: "Acurioustractor/justicehub-platform",
        vercelProject: "acurioustractor/justicehub-platform",
      },
      {
        name: "The Harvest",
        slug: "harvest",
        url: "https://witta-swot-analysis.vercel.app",
        status: "unknown",
        lastDeployed: new Date().toISOString(),
        registryStatus: "active",
        githubRepo: "Acurioustractor/the-harvest-website",
        vercelProject: "acurioustractor/the-harvest-website",
      },
      {
        name: "Goods on Country",
        slug: "goods",
        url: "https://goodsoncountry.netlify.app",
        status: "unknown",
        lastDeployed: new Date().toISOString(),
        registryStatus: "active",
        githubRepo: "Acurioustractor/goods-on-country",
        vercelProject: "",
      },
      {
        name: "ACT Farm",
        slug: "act-farm",
        url: "https://act.farm",
        status: "unknown",
        lastDeployed: new Date().toISOString(),
        registryStatus: "active",
        githubRepo: "Acurioustractor/act-farm",
        vercelProject: "acurioustractor/act-farm",
      },
      {
        name: "ACT Hub",
        slug: "act-hub",
        url: "https://act.place",
        status: "unknown",
        lastDeployed: new Date().toISOString(),
        registryStatus: "active",
        githubRepo: "Acurioustractor/act-hub",
        vercelProject: "acurioustractor/act-hub",
      },
    ];

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
