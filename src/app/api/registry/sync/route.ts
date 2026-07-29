import { NextResponse, type NextRequest } from "next/server";
import { syncAllRegistries } from "@/lib/registry-sync";
import { requireInternal } from "@/lib/auth/require-internal";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const denied = requireInternal(request);
  if (denied) return denied;

  try {
    const results = await syncAllRegistries();

    const successCount = results.filter((r) => r.status === "success").length;
    const errorCount = results.filter((r) => r.status === "error").length;

    return NextResponse.json({
      success: true,
      summary: {
        total: results.length,
        successful: successCount,
        failed: errorCount,
      },
      results,
    });
  } catch (error) {
    console.error("Failed to sync registries:", error);
    return NextResponse.json(
      { error: "Failed to sync registries" },
      { status: 500 }
    );
  }
}
