"use client";

import { useState } from "react";

import { FallbackImage } from "@/components/media/FallbackImage";

/**
 * A storyteller's portrait beside their words, or nothing.
 *
 * The portrait comes through Empathy Ledger's consent gate, which can refuse
 * it while the quote stays public: on 30 Sep 2026 the gate answered 403 for
 * the portrait beside the lead quote on /harvest. A refused portrait showed as
 * a broken frame next to a named person's words. The words and the name stay;
 * the frame goes.
 */
export function LeadVoicePortrait({ src, name }: { src: string; name: string }) {
  const [refused, setRefused] = useState(false);
  if (refused) return null;
  return (
    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-[var(--site-clay)]/30">
      <FallbackImage src={src} alt={name} fill sizes="64px" className="object-cover" onGiveUp={() => setRefused(true)} />
    </div>
  );
}
