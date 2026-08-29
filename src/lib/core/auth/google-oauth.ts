"use client";

import { createClient } from "@/lib/core/supabase/client";

function safeNext(next: string) {
  return next.startsWith("/") ? next : "/";
}

function getPublicSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const fallback = window.location.origin;
  return (configured || fallback).replace(/\/+$/, "");
}

export async function startGoogleOAuth(next: string) {
  const supabase = createClient();
  const redirectTo = new URL("/auth/callback", getPublicSiteUrl());
  redirectTo.searchParams.set("next", safeNext(next));

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectTo.toString(),
      skipBrowserRedirect: true,
      queryParams: {
        prompt: "select_account",
      },
    },
  });

  if (error) {
    throw error;
  }

  if (!data.url) {
    throw new Error("Supabase did not return a Google authorization URL.");
  }

  window.location.assign(data.url);
}
