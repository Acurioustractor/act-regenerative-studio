import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { requireInternal } from "@/lib/auth/require-internal";

export const dynamic = "force-dynamic";

const OVERRIDES_PATH = join(
  process.cwd(),
  "src/data/image-overrides.json"
);

const imageUrlPattern = /\.(jpe?g|png|webp|gif)(\?|#|$)/i;

function isImageUrl(url: string) {
  return imageUrlPattern.test(url);
}

async function loadOverrides(): Promise<Record<string, string>> {
  try {
    const raw = await readFile(OVERRIDES_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export async function GET() {
  const overrides = await loadOverrides();
  return NextResponse.json({ overrides });
}

export async function POST(request: NextRequest) {
  const denied = requireInternal(request);
  if (denied) return denied;
  const { slot, url } = await request.json();
  if (!slot || !url) {
    return NextResponse.json({ error: "slot and url required" }, { status: 400 });
  }
  if (!isImageUrl(url)) {
    return NextResponse.json({ error: "url must point to an image file" }, { status: 400 });
  }

  const overrides = await loadOverrides();
  overrides[slot] = url;
  await writeFile(OVERRIDES_PATH, JSON.stringify(overrides, null, 2));

  return NextResponse.json({ success: true, overrides });
}
