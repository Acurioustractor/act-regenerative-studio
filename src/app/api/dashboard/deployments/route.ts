import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // TODO: Integrate with Vercel API to fetch real deployment data
    // Requires VERCEL_ACCESS_TOKEN environment variable

    const deployments: any[] = [];

    /* Example Vercel API integration:
    const VERCEL_TOKEN = process.env.VERCEL_ACCESS_TOKEN;
    const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;

    if (VERCEL_TOKEN) {
      const response = await fetch(
        `https://api.vercel.com/v6/deployments?teamId=${VERCEL_TEAM_ID}&limit=20`,
        {
          headers: {
            Authorization: `Bearer ${VERCEL_TOKEN}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        deployments = data.deployments.map((d: any) => ({
          id: d.uid,
          project: d.name,
          status: d.state, // ready, building, error, canceled
          createdAt: new Date(d.created).toISOString(),
          url: d.url,
          commitMessage: d.meta?.githubCommitMessage || "",
          commitSha: d.meta?.githubCommitSha || "",
          branch: d.meta?.githubCommitRef || "",
          duration: d.buildingAt ? Date.now() - d.buildingAt : undefined,
        }));
      }
    }
    */

    return NextResponse.json(deployments);
  } catch (error) {
    console.error("Failed to fetch deployments:", error);
    return NextResponse.json(
      { error: "Failed to fetch deployments" },
      { status: 500 }
    );
  }
}
