"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const t = useTranslations("theme");
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Until mounted, render a stable label that matches the SSR output. The
  // resolved theme depends on cookies/localStorage and isn't known at SSR
  // time — flipping it on hydration would mismatch the aria-label.
  const isDark = mounted ? resolvedTheme !== "light" : false;
  const label = mounted ? (isDark ? t("light") : t("dark")) : t("toggle");

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      suppressHydrationWarning
    >
      <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
    </Button>
  );
}
