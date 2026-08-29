import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Public_Sans } from "next/font/google";
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

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

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
      className={`${inter.variable} ${publicSans.variable} ${jetbrainsMono.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-[#CC5500] selection:text-white">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <TranslationSweeper />
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
