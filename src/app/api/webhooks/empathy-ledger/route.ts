import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { revalidateTag } from "next/cache";
import { EMPATHY_LEDGER_CACHE_TAG } from "@/lib/empathy-ledger-runtime";

export const dynamic = "force-dynamic";

/**
 * Receive withdrawal and publication events from Empathy Ledger.
 *
 * Why this exists. This site reads Empathy Ledger with a 300 second revalidate
 * window, so when a storyteller withdrew consent their work stayed visible here
 * for up to five minutes. Five minutes is not long, but it is five minutes of
 * showing a story after the person said stop, and it is avoidable.
 *
 * It is also the first webhook receiver in the estate. Measured on 2026-07-30,
 * Empathy Ledger had made two webhook attempts in its entire life, both
 * consent.revoked, both failed: every configured URL pointed at a domain that did
 * not resolve or an endpoint that did not exist. Four consent revocations had
 * happened and not one reached a destination. Empathy Ledger's own sender was
 * verified working; there was simply nothing on this end listening.
 *
 * What it does: verifies the signature, then drops the whole Empathy Ledger cache
 * tag. Blunt on purpose. The alternative is mapping each event to the exact paths
 * it touches, which means this file holding a second copy of knowledge about which
 * pages show which content, and going stale the first time a page is added. One tag
 * cannot go stale.
 *
 * Fails CLOSED on the signature. An unsigned or wrongly signed request is refused
 * even though refusing means a withdrawal might not land, because the alternative
 * is that anyone who learns this URL can flush the cache at will, and worse, that
 * we act on unverified claims about what a person decided.
 */

/** Events that change what may be shown. Anything else is acknowledged, not acted on. */
const CACHE_AFFECTING_EVENTS = new Set([
  "consent.revoked",
  "consent.granted",
  "content.updated",
  "content.unpublished",
  "gallery.updated",
  "gallery.photos.added",
  "gallery.photos.removed",
  "storyteller.linked",
  "storyteller.unlinked",
  "webhook.test",
]);

function signatureMatches(raw: string, header: string, secret: string): boolean {
  const expected = `sha256=${createHmac("sha256", secret).update(raw).digest("hex")}`;
  const a = Buffer.from(header);
  const b = Buffer.from(expected);
  // timingSafeEqual throws on length mismatch, so compare lengths first.
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  const secret = process.env.EMPATHY_LEDGER_WEBHOOK_SECRET;
  if (!secret) {
    // Refusing is the honest answer. A receiver with no secret cannot tell an
    // Empathy Ledger event from anybody else's POST, and silently accepting would
    // make this endpoint look like it works while trusting whatever arrives.
    console.error("[webhooks/empathy-ledger] EMPATHY_LEDGER_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook receiver is not configured" },
      { status: 503 },
    );
  }

  const raw = await request.text();
  const provided = request.headers.get("x-webhook-signature");

  if (!provided) {
    return NextResponse.json({ error: "Missing signature" }, { status: 401 });
  }
  if (!signatureMatches(raw, provided, secret)) {
    console.warn("[webhooks/empathy-ledger] rejected a request with a bad signature");
    return NextResponse.json({ error: "Bad signature" }, { status: 401 });
  }

  let event: string | null = null;
  try {
    event = (JSON.parse(raw) as { event?: string }).event ?? null;
  } catch {
    return NextResponse.json({ error: "Body is not JSON" }, { status: 400 });
  }
  if (!event) {
    return NextResponse.json({ error: "No event in payload" }, { status: 400 });
  }

  if (!CACHE_AFFECTING_EVENTS.has(event)) {
    // 202: heard, deliberately not acted on. Distinct from 200 so the sender's log
    // records the difference between "handled" and "ignored".
    return NextResponse.json({ received: true, event, revalidated: false }, { status: 202 });
  }

  revalidateTag(EMPATHY_LEDGER_CACHE_TAG);
  console.log(`[webhooks/empathy-ledger] ${event} → revalidated ${EMPATHY_LEDGER_CACHE_TAG}`);

  return NextResponse.json({
    received: true,
    event,
    revalidated: true,
    tag: EMPATHY_LEDGER_CACHE_TAG,
  });
}

/** A GET so the endpoint's existence can be checked without sending an event. */
export async function GET() {
  return NextResponse.json({
    receiver: "empathy-ledger",
    configured: !!process.env.EMPATHY_LEDGER_WEBHOOK_SECRET,
    signatureRequired: true,
  });
}
