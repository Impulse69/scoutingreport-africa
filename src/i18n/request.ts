import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";
import { DEFAULT_LOCALE, isSupportedLocale, type Locale } from "./locales";

function pickFromHeader(value: string | null): Locale | null {
  if (!value) return null;
  // Accept-Language: "en-US,en;q=0.9,fr;q=0.8"
  const candidates = value.split(",").map((p) => p.split(";")[0].trim().toLowerCase());
  for (const c of candidates) {
    const base = c.split("-")[0];
    if (isSupportedLocale(base)) return base;
  }
  return null;
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const fromCookie = cookieStore.get("NEXT_LOCALE")?.value;
  const fromHeader = pickFromHeader(headerStore.get("accept-language"));

  const locale: Locale = isSupportedLocale(fromCookie)
    ? fromCookie
    : (fromHeader ?? DEFAULT_LOCALE);

  const messages = (await import(`../../messages/${locale}.json`)).default;

  return {
    locale,
    messages,
  };
});
