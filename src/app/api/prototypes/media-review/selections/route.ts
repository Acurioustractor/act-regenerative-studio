import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { mediaReviewCatalog } from "@/lib/media-review/catalog";
import type { LivingFieldId } from "@/data/living-field";

export const dynamic = "force-dynamic";

type Selection = { mediaId: string; videoUrl: string; posterUrl: string; title: string; field: string };
type Selections = { homepage: Selection; fields: Record<LivingFieldId, Selection> };
const configPath = path.join(process.cwd(), "src/data/hero-media-selections.json");
const fieldIds = new Set<LivingFieldId>(["art", "empathy", "justice", "goods", "harvest"]);

function unavailable() {
  return NextResponse.json({ error: "This editor is only available locally." }, { status: 404 });
}

async function readSelections() {
  return JSON.parse(await fs.readFile(configPath, "utf8")) as Selections;
}

export async function GET() {
  if (process.env.NODE_ENV === "production") return unavailable();
  return NextResponse.json(await readSelections());
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") return unavailable();

  const body = await request.json().catch(() => null) as { slot?: string; mediaId?: string } | null;
  const slot = body?.slot;
  const item = mediaReviewCatalog.find((candidate) => candidate.id === body?.mediaId);
  if (!item?.publicUrl || !item.posterUrl) {
    return NextResponse.json({ error: "That approved film still needs to be imported into the ACT media library." }, { status: 400 });
  }
  if (slot !== "homepage" && !fieldIds.has(slot as LivingFieldId)) {
    return NextResponse.json({ error: "Choose a valid hero location." }, { status: 400 });
  }

  const selections = await readSelections();
  const selection = { mediaId: item.id, videoUrl: item.publicUrl, posterUrl: item.posterUrl, title: item.title, field: item.field };
  if (slot === "homepage") selections.homepage = selection;
  else selections.fields[slot as LivingFieldId] = selection;

  await fs.writeFile(configPath, `${JSON.stringify(selections, null, 2)}\n`, "utf8");
  return NextResponse.json(selections);
}
