import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { TranslationSweeper } from "@/components/shared/i18n/translation-sweeper";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { getLocaleDirection } from "@/i18n/locales";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

// Resolution order:
//   1. NEXT_PUBLIC_SITE_URL — explicit override (set on Vercel prod env vars)
//   2. VERCEL_PROJECT_PRODUCTION_URL — auto-injected by Vercel on the prod deploy
//   3. VERCEL_URL — auto-injected on every Vercel deploy (preview/branch URLs)
//   4. Hardcoded production canonical — covers any env where the above are missing
//   5. localhost — dev fallback
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : null) ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
  (process.env.VERCEL_ENV === "production"
    ? "https://scoutingreportafrica.com"
    : null) ||
  "http://localhost:3000";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t("siteName"),
      template: `%s · ${t("siteName")}`,
    },
    description: t("description"),
    openGraph: {
      type: "website",
      siteName: t("siteName"),
      url: siteUrl,
      description: t("description"),
    },
    twitter: { card: "summary_large_image", description: t("description") },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const dir = getLocaleDirection(locale);

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <TranslationSweeper />
          {/* The product is designed dark throughout — the marketing site,
              player profiles and scout workspace all paint their own dark
              surfaces. Following the OS preference put light-theme tokens
              (near-white cards, dark text) inside those hardcoded dark shells,
              so pages using shared components rendered unreadable. Pin dark
              until a real light palette exists. */}
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            forcedTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <TooltipProvider delay={200}>
              {children}
              <Toaster richColors closeButton />
            </TooltipProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
