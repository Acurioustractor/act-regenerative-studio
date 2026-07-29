import type { Metadata } from "next";
import { HarvestFieldExperience } from "./harvest-field-experience";

export const metadata: Metadata = {
  title: "Come before it is finished | A Curious Tractor",
  description: "An interactive field story about making, growing and gathering at The Harvest.",
  robots: { index: false, follow: false },
};

export default function HarvestFieldPage() {
  return <HarvestFieldExperience />;
}
