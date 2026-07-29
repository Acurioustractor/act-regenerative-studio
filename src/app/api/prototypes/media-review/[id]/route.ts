import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { Readable } from "node:stream";
import { resolveReviewSource } from "@/lib/media-review/catalog";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (process.env.NODE_ENV === "production") return new Response("Not found", { status: 404 });

  const { id } = await params;
  const source = resolveReviewSource(id);
  if (!source) return new Response("Unknown review film", { status: 404 });

  try {
    const file = await stat(source.resolved);
    const range = request.headers.get("range");
    const commonHeaders = { "Accept-Ranges": "bytes", "Cache-Control": "private, no-store", "Content-Type": "video/mp4" };

    if (range) {
      const match = /^bytes=(\d+)-(\d*)$/.exec(range);
      if (!match) return new Response("Invalid range", { status: 416 });
      const start = Number(match[1]);
      const end = match[2] ? Math.min(Number(match[2]), file.size - 1) : file.size - 1;
      if (start > end || start >= file.size) return new Response("Range not satisfiable", { status: 416, headers: { "Content-Range": `bytes */${file.size}` } });
      const stream = createReadStream(source.resolved, { start, end });
      return new Response(Readable.toWeb(stream) as ReadableStream, { status: 206, headers: { ...commonHeaders, "Content-Length": String(end - start + 1), "Content-Range": `bytes ${start}-${end}/${file.size}` } });
    }

    const stream = createReadStream(source.resolved);
    return new Response(Readable.toWeb(stream) as ReadableStream, { headers: { ...commonHeaders, "Content-Length": String(file.size) } });
  } catch {
    return new Response("Source film is unavailable", { status: 404 });
  }
}
