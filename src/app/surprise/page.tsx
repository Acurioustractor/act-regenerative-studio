import { redirect } from "next/navigation";

// Force dynamic so each request picks a fresh destination.
// If we ever statically generate this route, every visitor gets the same "random".
export const dynamic = "force-dynamic";

// Curated pool. Only routes that actually render well and feel like a small gift
// to land on. Kept intentionally small so nothing weird or half-built slips in.
const DESTINATIONS = [
  "/art/contained",
  "/art/gold-phone",
  "/art/the-confessional",
  "/harvest",
  "/farm",
  "/goods",
  "/empathy-ledger",
  "/justicehub",
  "/ecosystem",
  "/storytellers",
  "/wiki/barry-rodgerig",
  "/wiki/lcaa-method",
  "/vision",
  "/principles",
  "/method",
  "/blog/seeds-of-change-walking-with-elders-and-youth-on-kalkadoon-country",
] as const;

export default function SurprisePage() {
  const next = DESTINATIONS[Math.floor(Math.random() * DESTINATIONS.length)];
  redirect(next);
}
