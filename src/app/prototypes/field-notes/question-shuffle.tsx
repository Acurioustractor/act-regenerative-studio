"use client";

import { useRouter } from "next/navigation";

export function QuestionShuffle({ slugs, basePath = "/prototypes/field-notes" }: { slugs: string[]; basePath?: string }) {
  const router = useRouter();
  function wander() {
    const slug = slugs[Math.floor(Math.random() * slugs.length)];
    router.push(`${basePath}/${slug}`);
  }
  return <button type="button" onClick={wander}>Give me a question <span aria-hidden="true">↝</span></button>;
}
