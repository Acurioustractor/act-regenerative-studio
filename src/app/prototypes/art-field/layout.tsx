import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Art + CONTAINED | A Curious Tractor",
  description: "An art-led field story about CONTAINED and the alternatives beyond detention.",
};

export default function ArtFieldLayout({ children }: { children: React.ReactNode }) {
  return children;
}
