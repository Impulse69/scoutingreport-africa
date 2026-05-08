import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/core/supabase/middleware";

// Auth-gated route prefixes. /scout/* and /admin/* were removed during the
// dashboard teardown — anything that needs a signed-in user goes here.
const PROTECTED_PREFIXES = ["/watchlists", "/dashboard", "/scout"];

export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request);

  const pathname = request.nextUrl.pathname;
  const needsUser = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  if (!needsUser) return response;

  if (!user) {
    const redirectUrl = new URL("/auth/sign-in", request.nextUrl);
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|.*\\.(?:png|jpg|jpeg|svg|webp|ico|gif|css|js|woff2?)$).*)",
  ],
};
