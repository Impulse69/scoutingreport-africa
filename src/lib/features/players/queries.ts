import { createClient } from "@/lib/core/supabase/server";
import {
  RATING_CATEGORIES,
  RATING_SUB_AREAS_BY_CATEGORY,
  type RatingCategory,
} from "@/lib/shared/constants";

export type SubAreaAverage = {
  key: string;
  label: string;
  avg: number;
  sampleSize: number;
};

export type CategoryAverage = {
  category: RatingCategory;
  /** Average of the `overall` sub-area across published reports, 1–5. */
  overall: number | null;
  subAreas: SubAreaAverage[];
};

export type PlayerProfile = {
  id: string;
  slug: string;
  fullName: string;
  commonName: string | null;
  nationalityCode: string | null;
  primaryPositionCode: string | null;
  secondaryPositionCodes: string[];
  preferredFoot: string | null;
  heightCm: number | null;
  weightKg: number | null;
  currentClub: string | null;
  photoUrl: string | null;
  bio: string | null;
  dateOfBirth: string | null;
  status: "draft" | "published";
  createdBy: string | null;
  publishedReportCount: number;
  ratings: CategoryAverage[];
};

export type PlayerListItem = {
  id: string;
  slug: string;
  fullName: string;
  primaryPositionCode: string | null;
  nationalityCode: string | null;
  currentClub: string | null;
  photoUrl: string | null;
};

const PLAYER_SELECT = `
  id, slug, full_name, common_name, nationality_code,
  primary_position_code, secondary_position_codes, preferred_foot,
  height_cm, weight_kg, current_club, photo_url, bio, date_of_birth,
  status, created_by
`;

type PlayerRow = {
  id: string;
  slug: string;
  full_name: string;
  common_name: string | null;
  nationality_code: string | null;
  primary_position_code: string | null;
  secondary_position_codes: string[] | null;
  preferred_foot: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  current_club: string | null;
  photo_url: string | null;
  bio: string | null;
  date_of_birth: string | null;
  status: "draft" | "published";
  created_by: string | null;
};

/**
 * Aggregate published-report ratings for a player into per-category averages.
 *
 * Reads `scout_report_ratings` directly rather than the
 * `player_category_ratings` materialized view. The view only carries the
 * `overall` sub-area and goes stale between refreshes; the underlying table is
 * small, always current, and gives us the sub-area breakdown the profile needs
 * in the same round trip.
 */
async function loadRatingAverages(playerId: string): Promise<CategoryAverage[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("scout_report_ratings")
    .select("category, sub_area, rating, scout_reports!inner(player_id, status)")
    .eq("scout_reports.player_id", playerId)
    .eq("scout_reports.status", "published");

  if (error || !data) return emptyRatingAverages();

  const rows = data as unknown as Array<{
    category: RatingCategory;
    sub_area: string;
    rating: number;
  }>;

  // (category → sub_area → running total)
  const buckets = new Map<string, { sum: number; n: number }>();
  for (const row of rows) {
    const key = `${row.category}::${row.sub_area}`;
    const bucket = buckets.get(key) ?? { sum: 0, n: 0 };
    bucket.sum += row.rating;
    bucket.n += 1;
    buckets.set(key, bucket);
  }

  const round1 = (n: number) => Math.round(n * 10) / 10;

  return RATING_CATEGORIES.map((category) => {
    const overallBucket = buckets.get(`${category}::overall`);

    const subAreas = RATING_SUB_AREAS_BY_CATEGORY[category]
      .filter((sub) => sub.key !== "overall")
      .map((sub) => {
        const bucket = buckets.get(`${category}::${sub.key}`);
        return bucket
          ? {
              key: sub.key,
              label: sub.label,
              avg: round1(bucket.sum / bucket.n),
              sampleSize: bucket.n,
            }
          : null;
      })
      .filter((s): s is SubAreaAverage => s !== null);

    return {
      category,
      overall: overallBucket ? round1(overallBucket.sum / overallBucket.n) : null,
      subAreas,
    };
  });
}

function emptyRatingAverages(): CategoryAverage[] {
  return RATING_CATEGORIES.map((category) => ({
    category,
    overall: null,
    subAreas: [],
  }));
}

function mapPlayer(row: PlayerRow): Omit<PlayerProfile, "ratings" | "publishedReportCount"> {
  return {
    id: row.id,
    slug: row.slug,
    fullName: row.full_name,
    commonName: row.common_name,
    nationalityCode: row.nationality_code,
    primaryPositionCode: row.primary_position_code,
    secondaryPositionCodes: row.secondary_position_codes ?? [],
    preferredFoot: row.preferred_foot,
    heightCm: row.height_cm,
    weightKg: row.weight_kg,
    currentClub: row.current_club,
    photoUrl: row.photo_url,
    bio: row.bio,
    dateOfBirth: row.date_of_birth,
    status: row.status,
    createdBy: row.created_by,
  };
}

/**
 * Load a player by uuid or slug, with aggregated ratings and a published-report
 * count.
 *
 * Draft players are returned rather than hidden — RLS already restricts the
 * `select` to published rows plus the creator's own drafts and admins, so
 * anything that comes back is something the caller is entitled to see. The
 * profile page shows a "draft" banner instead of a 404 so a scout can preview
 * their own work before publishing.
 */
export async function getPlayerProfile(
  idOrSlug: string,
): Promise<PlayerProfile | null> {
  const supabase = await createClient();

  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

  const { data } = isUuid
    ? await supabase.from("players").select(PLAYER_SELECT).eq("id", idOrSlug).maybeSingle()
    : await supabase.from("players").select(PLAYER_SELECT).eq("slug", idOrSlug).maybeSingle();

  if (!data) return null;
  const row = data as unknown as PlayerRow;

  const [ratings, { count }] = await Promise.all([
    loadRatingAverages(row.id),
    supabase
      .from("scout_reports")
      .select("id", { count: "exact", head: true })
      .eq("player_id", row.id)
      .eq("status", "published"),
  ]);

  return {
    ...mapPlayer(row),
    publishedReportCount: count ?? 0,
    ratings,
  };
}

export async function listPublishedPlayers(limit = 60): Promise<PlayerListItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("players")
    .select("id, slug, full_name, primary_position_code, nationality_code, current_club, photo_url")
    .eq("status", "published")
    .order("full_name")
    .limit(limit);

  return (data ?? []).map((p) => ({
    id: p.id as string,
    slug: p.slug as string,
    fullName: p.full_name as string,
    primaryPositionCode: (p.primary_position_code as string) ?? null,
    nationalityCode: (p.nationality_code as string) ?? null,
    currentClub: (p.current_club as string) ?? null,
    photoUrl: (p.photo_url as string) ?? null,
  }));
}

/**
 * Of the given slugs, which ones have a published player page.
 *
 * Lets listings built from external/mock rosters (a club squad, a standings
 * table) link only the names that actually resolve — and start linking them
 * automatically once a scout adds that player.
 */
export async function filterExistingPlayerSlugs(
  slugs: string[],
): Promise<Set<string>> {
  const unique = [...new Set(slugs.filter(Boolean))];
  if (unique.length === 0) return new Set();

  const supabase = await createClient();
  const { data } = await supabase
    .from("players")
    .select("slug")
    .eq("status", "published")
    .in("slug", unique);

  return new Set((data ?? []).map((p) => p.slug as string));
}

/** Every published slug — used by the sitemap. */
export async function listPublishedPlayerSlugs(): Promise<
  { slug: string; updatedAt: string }[]
> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("players")
    .select("slug, updated_at")
    .eq("status", "published");

  return (data ?? []).map((p) => ({
    slug: p.slug as string,
    updatedAt: p.updated_at as string,
  }));
}
