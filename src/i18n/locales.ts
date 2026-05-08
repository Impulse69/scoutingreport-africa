export const SUPPORTED_LOCALES = ["en", "es", "fr", "pt", "ar"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export type LocaleOption = {
  code: Locale;
  label: string;
  native: string;
  dir: "ltr" | "rtl";
};

export const LOCALE_OPTIONS: LocaleOption[] = [
  { code: "en", label: "English", native: "English", dir: "ltr" },
  { code: "es", label: "Spanish", native: "Español", dir: "ltr" },
  { code: "fr", label: "French", native: "Français", dir: "ltr" },
  { code: "pt", label: "Portuguese", native: "Português", dir: "ltr" },
  { code: "ar", label: "Arabic", native: "العربية", dir: "rtl" },
];

export function isSupportedLocale(value: string | undefined | null): value is Locale {
  return !!value && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export function getLocaleDirection(locale: string | undefined | null): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}
