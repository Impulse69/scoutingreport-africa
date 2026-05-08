"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { DEFAULT_LOCALE, LOCALE_OPTIONS, isSupportedLocale, type Locale } from "@/i18n/locales";

const COOKIE_NAME = "NEXT_LOCALE";

function writeCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
}

type LanguagePickerProps = {
  tone?: "default" | "dark";
};

export function LanguagePicker({ tone = "default" }: LanguagePickerProps) {
  const t = useTranslations("language");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current: Locale = isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;
  const triggerClass =
    tone === "dark"
      ? "flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
      : "flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const choose = (code: Locale) => {
    writeCookie(COOKIE_NAME, code);
    setOpen(false);
    window.location.reload();
  };

  const active = LOCALE_OPTIONS.find((l) => l.code === current) ?? LOCALE_OPTIONS[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={t("change")}
        onClick={() => setOpen((v) => !v)}
        className={triggerClass}
      >
        <Globe className="h-3.5 w-3.5" />
        <span className="font-mono uppercase">{active.code}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-white/10 bg-[#111]/95 shadow-2xl backdrop-blur-md">
          <div className="border-b border-white/5 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500">
              {t("label")}
            </p>
            <p className="mt-1 text-[11px] text-zinc-500">{t("tip")}</p>
          </div>
          <ul className="max-h-80 overflow-y-auto py-1.5">
            {LOCALE_OPTIONS.map((lang) => {
              const isActive = lang.code === current;
              return (
                <li key={lang.code}>
                  <button
                    type="button"
                    onClick={() => choose(lang.code)}
                    className={`flex w-full items-center justify-between gap-3 px-4 py-2 text-left text-sm transition-colors ${
                      isActive
                        ? "bg-orange-500/10 text-white"
                        : "text-zinc-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span className="flex flex-col">
                      <span dir={lang.dir}>{lang.native}</span>
                      <span className="text-[10px] text-zinc-500">{lang.label}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="font-mono text-[10px] uppercase text-zinc-500">
                        {lang.code}
                      </span>
                      {isActive ? <Check className="h-3.5 w-3.5 text-orange-500" /> : null}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="border-t border-white/5 px-4 py-2.5 text-[10px] text-zinc-500">
            {t("footerTip")}
          </div>
        </div>
      ) : null}
    </div>
  );
}
