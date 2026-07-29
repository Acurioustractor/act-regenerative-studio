import { NextResponse, type NextRequest } from "next/server";
import {
  INTERNAL_COOKIE,
  INTERNAL_HEADER,
  evaluateInternalAccess,
  isInternalPath,
} from "@/lib/auth/internal-access";

/**
 * Gates the internal surfaces of the site.
 *
 * Before this existed, all twenty /admin pages and sixteen /prototypes pages
 * returned 200 to anyone on the public internet. robots.txt disallowed them,
 * but that is a request to well-behaved crawlers, not access control.
 *
 * Unauthorised requests get a 404 rather than a 401. There is no login form to
 * offer, and a 404 does not confirm to a scanner that something is there.
 */
export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (!isInternalPath(pathname)) return NextResponse.next();

  const queryKey = searchParams.get("key");
  const mode = evaluateInternalAccess([
    request.cookies.get(INTERNAL_COOKIE)?.value,
    request.headers.get(INTERNAL_HEADER),
    queryKey,
  ]);

  if (mode === "denied") {
    return new NextResponse(null, { status: 404 });
  }

  // Arriving with ?key=... exchanges the token for a cookie, then strips it
  // from the URL so the secret does not sit in history, logs or a shared link.
  if (mode === "granted" && queryKey) {
    const clean = request.nextUrl.clone();
    clean.searchParams.delete("key");
    const response = NextResponse.redirect(clean);
    response.cookies.set(INTERNAL_COOKIE, queryKey, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/prototypes/:path*"],
};
