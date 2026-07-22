import { after, NextResponse } from "next/server";
import {
  EMPATHY_LEDGER_EDITORIAL_EVENTS,
  isValidEmpathyLedgerSignature,
} from "@/lib/webhooks/empathy-ledger-editorial";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secret = process.env.EMPATHY_LEDGER_WEBHOOK_SECRET;
  const deployHook = process.env.ACT_EDITORIAL_DEPLOY_HOOK_URL;
  if (!secret || !deployHook) return NextResponse.json({ error: "Editorial webhook is not configured" }, { status: 503 });

  const body = await request.text();
  if (!isValidEmpathyLedgerSignature(body, request.headers.get("x-empathy-ledger-signature"), secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: { event?: string; article?: { slug?: string } };
  try { payload = JSON.parse(body); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  if (!payload.event || !EMPATHY_LEDGER_EDITORIAL_EVENTS.has(payload.event)) {
    return NextResponse.json({ ignored: true }, { status: 202 });
  }

  after(async () => {
    try {
      const response = await fetch(deployHook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          source: "empathy-ledger",
          event: payload.event,
          slug: payload.article?.slug || null,
        }),
      });
      if (!response.ok) {
        console.error("ACT editorial refresh could not be queued", {
          event: payload.event,
          status: response.status,
        });
      }
    } catch {
      console.error("ACT editorial refresh could not be queued", {
        event: payload.event,
      });
    }
  });

  return NextResponse.json({ accepted: true, event: payload.event, slug: payload.article?.slug || null }, { status: 202 });
}
