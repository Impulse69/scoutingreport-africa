import type { MetadataRoute } from "next";
import { listPublishedPlayerSlugs } from "@/lib/features/players/queries";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://scoutingreportafrica.com");

/**
 * Only routes that actually resolve. The previous version advertised `/compare`
 * and `/about` to crawlers while neither had a page.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/players`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/leagues`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/scouting`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/auth/sign-in`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/auth/sign-up`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/cookies`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  let playerRoutes: MetadataRoute.Sitemap = [];
  try {
    const players = await listPublishedPlayerSlugs();
    playerRoutes = players.map((p) => ({
      url: `${SITE_URL}/players/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // Database unreachable at build time — still emit the static routes.
  }

  return [...staticRoutes, ...playerRoutes];
}
