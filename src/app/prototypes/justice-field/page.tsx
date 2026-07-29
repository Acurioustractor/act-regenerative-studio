import type { Metadata } from "next";
import { JusticeFieldExperience } from "./justice-field-experience";

export const metadata: Metadata = {
  title: "Justice moves through three rooms | A Curious Tractor",
  description: "An interactive field story connecting CONTAINED, justice reinvestment and the Justice Matrix.",
  robots: { index: false, follow: false },
};

export default function JusticeFieldPage() {
  return <JusticeFieldExperience />;
}
