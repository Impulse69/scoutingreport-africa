import { NextResponse } from "next/server";
import { createClient } from "@/lib/core/supabase/server";

function safeNext(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }
  return value;
}

function getRedirectOrigin(request: Request, fallbackOrigin: string) {
  if (process.env.NODE_ENV === "development") {
    return fallbackOrigin;
  }

  const forwardedHost = request.headers.get("x-forwarded-host");
  if (forwardedHost) {
    return `https://${forwardedHost}`;
  }

  return fallbackOrigin;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const providerError =
    url.searchParams.get("error_description") ??
    url.searchParams.get("error") ??
    null;
  const next = safeNext(url.searchParams.get("next"));
  const redirectOrigin = getRedirectOrigin(request, url.origin);

  if (providerError) {
    return NextResponse.redirect(
      new URL(`/auth/sign-in?error=${encodeURIComponent(providerError)}`, redirectOrigin),
    );
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(
        new URL(`/auth/sign-in?error=${encodeURIComponent(error.message)}`, redirectOrigin),
      );
    }

    return NextResponse.redirect(new URL(next, redirectOrigin));
  }

  return NextResponse.redirect(
    new URL(
      `/auth/sign-in?error=${encodeURIComponent("Missing OAuth callback code")}`,
      redirectOrigin,
    ),
  );
}
