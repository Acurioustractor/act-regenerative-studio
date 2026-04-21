import { NextResponse } from "next/server";
import featuredSnapshot from "@/data/empathy-ledger-featured.generated.json";

export const dynamic = "force-dynamic";

interface PickerImage {
  id: string;
  url: string;
  thumbnail_url: string | null;
  preview_url: string | null;
  kind: string;
  title: string | null;
  alt: string | null;
  caption: string | null;
  credit: string | null;
}

interface OrgBlock {
  org: { slug: string; name: string; id: string };
  media?: { items?: PickerImage[] };
}

interface ProjectBlock {
  project: { slug: string; title: string; organization_id?: string | null };
  media?: { items?: PickerImage[] };
}

export async function GET() {
  const snapshot = featuredSnapshot as unknown as {
    projects: Record<string, ProjectBlock | null>;
    organizations?: Record<string, OrgBlock | null>;
  };

  const organizations = Object.entries(snapshot.organizations || {})
    .filter(([, o]) => o !== null)
    .map(([slug, o]) => {
      const images = (o!.media?.items || []).filter((m) => m.kind === "image");
      return {
        slug,
        name: o!.org?.name || slug,
        id: o!.org?.id || null,
        images,
      };
    })
    .filter((o) => o.images.length > 0)
    .sort((a, b) => b.images.length - a.images.length);

  const projects = Object.entries(snapshot.projects)
    .filter(([, p]) => p !== null)
    .map(([slug, p]) => {
      const images = (p!.media?.items || []).filter((m) => m.kind === "image");
      return {
        slug,
        title: p!.project?.title || slug,
        images,
      };
    })
    .filter((p) => p.images.length > 0)
    .sort((a, b) => b.images.length - a.images.length);

  const projectOrgIdMap: Record<string, string | null> = {};
  for (const [slug, p] of Object.entries(snapshot.projects)) {
    if (p) projectOrgIdMap[slug] = p.project?.organization_id || null;
  }

  return NextResponse.json({ organizations, projects, projectOrgIdMap });
}
