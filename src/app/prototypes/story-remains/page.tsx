import type { Metadata } from "next";
import { StoryRemainsExperience } from "./story-remains-experience";

export const metadata: Metadata = {
  title: "A story remains with its storyteller | A Curious Tractor",
  description: "An interactive field story about consent, context, credit and return.",
  robots: { index: false, follow: false },
};

export default function StoryRemainsPage() {
  return <StoryRemainsExperience />;
}
