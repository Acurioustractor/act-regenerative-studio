"use client";

import { useParams } from "next/navigation";
import { FieldStoryPrototype, fieldStories } from "../field-story";

export default function FieldStoryPage() {
  const { field } = useParams<{ field: string }>();
  const story = fieldStories[field as keyof typeof fieldStories];
  if (!story) return null;
  return <FieldStoryPrototype story={story} />;
}
