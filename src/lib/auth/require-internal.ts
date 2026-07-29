import { NextResponse, type NextRequest } from "next/server";
import {
  INTERNAL_COOKIE,
  INTERNAL_HEADER,
  internalAccessAllowed,
} from "@/lib/auth/internal-access";

/**
 * Guard for API routes that write, spend money, or expose internal data.
 *
 * Returns a 401 response when the caller is not authorised, or `null` when the
 * request may proceed. Use it as the first statement in the handler:
 *
 *   export async function POST(request: NextRequest) {
 *     const denied = requireInternal(request);
 *     if (denied) return denied;
 *     ...
 *   }
 *
 * Unlike the page middleware this answers 401 rather than 404, because the
 * caller is a script that benefits from knowing the difference between "wrong
 * credentials" and "wrong URL".
 */
export function requireInternal(request: NextRequest): NextResponse | null {
  const allowed = internalAccessAllowed([
    request.cookies.get(INTERNAL_COOKIE)?.value,
    request.headers.get(INTERNAL_HEADER),
  ]);

  if (allowed) return null;

  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401, headers: { "cache-control": "no-store" } },
  );
}
