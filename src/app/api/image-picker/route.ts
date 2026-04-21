import { NextResponse } from "next/server";
import featuredSnapshot from "@/data/empathy-ledger-featured.generated.json";

export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = featuredSnapshot as {
    projects: Record<
      string,
      {
        project: { slug: string; title: string };
        media?: {
          items?: Array<{
            id: string;
            url: string;
            thumbnail_url: string | null;
            preview_url: string | null;
            kind: string;
            title: string | null;
            alt: string | null;
            caption: string | null;
            credit: string | null;
          }>;
        };
      } | null
    >;
  };

  const projects = Object.entries(snapshot.projects)
    .filter(([, p]) => p !== null)
    .map(([slug, p]) => {
      const images = (p!.media?.items || []).filter(
        (m) => m.kind === "image"
      );
      return {
        slug,
        title: p!.project?.title || slug,
        images,
      };
    })
    .filter((p) => p.images.length > 0)
    .sort((a, b) => b.images.length - a.images.length);

  return NextResponse.json({ projects });
}
