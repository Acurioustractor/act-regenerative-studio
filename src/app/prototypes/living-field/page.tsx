import type { Metadata } from "next";
import { LivingFieldPrototype } from "./prototype";

export const metadata: Metadata = {
  title: "Living Field prototype",
  description: "An experimental homepage direction for A Curious Tractor.",
  robots: { index: false, follow: false },
};

export default function LivingFieldPrototypePage() {
  return <LivingFieldPrototype />;
}
