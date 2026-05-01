import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/core/supabase/middleware";
import type { ProfileRole } from "@/lib/shared/constants";

const PROTECTED_USER_PREFIXES = ["/watchlists"];
const SCOUT_PREFIXES = ["/scout"];
const ADMIN_PREFIXES = ["/admin"];

function roleAtLeast(role: ProfileRole, minimum: ProfileRole): boolean {
  const order: ProfileRole[] = ["user", "scout", "admin"];
  return order.indexOf(role) >= order.indexOf(minimum);
}

export async function middleware(request: NextRequest) {
  const { response, supabase, user } = await updateSession(request);

  const pathname = request.nextUrl.pathname;
  const needsUser = PROTECTED_USER_PREFIXES.some((p) => pathname.startsWith(p));
  const needsScout = SCOUT_PREFIXES.some((p) => pathname.startsWith(p));
  const needsAdmin = ADMIN_PREFIXES.some((p) => pathname.startsWith(p));

  if (!(needsUser || needsScout || needsAdmin)) {
    return response;
  }

  if (!user) {
    const redirectUrl = new URL("/auth/sign-in", request.nextUrl);
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (needsScout || needsAdmin) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single<{ role: ProfileRole }>();

    const role: ProfileRole = profile?.role ?? "user";
    const minimum: ProfileRole = needsAdmin ? "admin" : "scout";

    if (!roleAtLeast(role, minimum)) {
      return NextResponse.redirect(new URL("/", request.nextUrl));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|.*\\.(?:png|jpg|jpeg|svg|webp|ico|gif|css|js|woff2?)$).*)",
  ],
};
