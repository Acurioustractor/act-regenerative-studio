import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { mediaReviewCatalog } from "@/lib/media-review/catalog";
import { MediaScreeningRoom } from "./screening-room";

export const metadata: Metadata = { title: "Private media screening room", robots: { index: false, follow: false } };

export default function MediaReviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  const items = mediaReviewCatalog.map(({ sourcePath: _sourcePath, sourceRepo: _sourceRepo, ...item }) => ({ ...item, url: item.publicUrl ?? `/api/prototypes/media-review/${item.id}` }));
  return <MediaScreeningRoom items={items} />;
}
