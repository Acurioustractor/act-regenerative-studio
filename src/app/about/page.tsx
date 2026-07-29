import type { Metadata } from "next";
import FieldHistory from "@/app/prototypes/field-history/page";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "About A Curious Tractor | The field between us",
  description:
    "The history, philosophy and living projects of A Curious Tractor. Two people learning what to build, what to hold and what to give away.",
  path: "/about",
  image: {
    url: "/media/field-stills/hero-farm-aerial.jpg",
    alt: "A Curious Tractor's work seen from above",
  },
});

export default function AboutPage() {
  return <FieldHistory />;
}
