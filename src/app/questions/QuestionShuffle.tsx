"use client";

import { useRouter } from "next/navigation";
import { Wheel, rolls } from "@/components/pieces/Onward";
import styles from "./questions.module.css";

/** "Give me a question": goes to one of the questions at random. */
export function QuestionShuffle({ slugs }: { slugs: string[] }) {
  const router = useRouter();
  return (
    <button
      type="button"
      className={`${styles.shuffle} ${rolls}`}
      onClick={() => router.push(`/questions/${slugs[Math.floor(Math.random() * slugs.length)]}`)}
    >
      <span>Give me a question</span>
      <Wheel />
    </button>
  );
}
