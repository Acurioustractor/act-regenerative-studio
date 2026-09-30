import withdrawn from "../../../../config/withdrawn-editorial.json";

/**
 * Is this slug in the withdrawal tombstone (config/withdrawn-editorial.json)? The consent gate in
 * empathy-ledger-editorial.ts already keeps a withdrawn article out of every read; this is read again at the route
 * so the address can say so instead of answering as if the story never existed. The file is only read, never changed.
 */
const WITHDRAWN = new Set<string>(Array.isArray(withdrawn.slugs) ? withdrawn.slugs : []);

export function isWithdrawnSlug(slug: string): boolean {
  return WITHDRAWN.has(slug);
}

/**
 * The withdrawn stories whose page may say they went back to their owner ("It was theirs to take back, and they
 * have."). A story belongs here only when Empathy Ledger records that its storyteller took it back: its
 * syndication_consent row for this site revoked by the storyteller. As at 30 Sep 2026 none is. Six of the nine
 * withdrawals are ACT's own editorial decisions, and the one revocation Empathy Ledger holds for this site records no
 * role. Every other withdrawn slug answers 404, as it always has.
 */
const RETURNED_TO_OWNER = new Set<string>([]);

export function isReturnedSlug(slug: string): boolean {
  return RETURNED_TO_OWNER.has(slug) && WITHDRAWN.has(slug);
}
