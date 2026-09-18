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
  currentCompetition: { id: string; name: string } | null;
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
  height_cm, weight_kg, current_club,
  current_club_record:clubs!players_current_club_id_fkey(id, name, slug),
  current_competition:competitions!players_current_competition_id_fkey(id, name),
  photo_url, bio, date_of_birth,
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
  current_club_record: { id: string; name: string; slug: string } | null;
  current_competition: { id: string; name: string } | null;
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

import { getPlayerPhoto } from "./photos";

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
    currentClub: row.current_club_record?.name ?? row.current_club,
    currentCompetition: row.current_competition,
    photoUrl: getPlayerPhoto(row.slug, row.photo_url),
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
    .select(
      `id, slug, full_name, primary_position_code, nationality_code,
       current_club, current_club_record:clubs!players_current_club_id_fkey(name),
       photo_url`,
    )
    .eq("status", "published")
    .order("full_name")
    .limit(limit);

  const rows = (data ?? []) as unknown as Array<{
    id: string;
    slug: string;
    full_name: string;
    primary_position_code: string | null;
    nationality_code: string | null;
    current_club: string | null;
    current_club_record: { name: string } | null;
    photo_url: string | null;
  }>;

  return rows.map((p) => ({
    id: p.id,
    slug: p.slug,
    fullName: p.full_name,
    primaryPositionCode: p.primary_position_code,
    nationalityCode: p.nationality_code,
    currentClub: p.current_club_record?.name ?? p.current_club,
    photoUrl: getPlayerPhoto(p.slug, p.photo_url),
  }));
}

/** Search the public catalogue without loading every published player. */
export async function searchPublishedPlayers(
  query: string,
  limit = 8,
): Promise<PlayerListItem[]> {
  const term = query.trim();
  if (term.length < 2) return [];

  const supabase = await createClient();
  const columns = `id, slug, full_name, primary_position_code, nationality_code,
    current_club, current_club_record:clubs!players_current_club_id_fkey(name), photo_url`;
  const baseQuery = () =>
    supabase
      .from("players")
      .select(columns)
      .eq("status", "published")
      .order("full_name")
      .limit(limit);

  const [nameResult, legacyClubResult, nationalityResult, clubLookup] = await Promise.all([
    baseQuery().ilike("full_name", `%${term}%`),
    baseQuery().ilike("current_club", `%${term}%`),
    term.length === 2
      ? baseQuery().eq("nationality_code", term.toUpperCase())
      : Promise.resolve({ data: [] }),
    supabase.from("clubs").select("id").ilike("name", `%${term}%`).limit(limit),
  ]);

  const clubIds = (clubLookup.data ?? []).map((club) => club.id);
  const linkedClubResult =
    clubIds.length > 0
      ? await baseQuery().in("current_club_id", clubIds)
      : { data: [] };

  const unique = new Map<string, (typeof nameResult.data extends (infer Row)[] | null ? Row : never)>();
  for (const player of [
    ...(nameResult.data ?? []),
    ...(legacyClubResult.data ?? []),
    ...(linkedClubResult.data ?? []),
    ...(nationalityResult.data ?? []),
  ]) {
    unique.set(player.id as string, player);
  }

  return [...unique.values()].slice(0, limit).map((player) => {
    const p = player as unknown as {
      id: string;
      slug: string;
      full_name: string;
      primary_position_code: string | null;
      nationality_code: string | null;
      current_club: string | null;
      current_club_record: { name: string } | null;
      photo_url: string | null;
    };

    return {
      id: p.id,
      slug: p.slug,
      fullName: p.full_name,
      primaryPositionCode: p.primary_position_code,
      nationalityCode: p.nationality_code,
      currentClub: p.current_club_record?.name ?? p.current_club,
      photoUrl: p.photo_url,
    };
  });
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

export type PlatformCounts = {
  publishedPlayers: number;
  publishedReports: number;
  countriesIndexed: number;
};

/**
 * Real headline counts for the marketing page.
 *
 * The landing page previously advertised invented figures ("2,400+ scouted
 * dossiers", "€180M+ tracked transfer value"). Numbers shown to the public have
 * to come from the database.
 */
export async function getPlatformCounts(): Promise<PlatformCounts> {
  const supabase = await createClient();

  const [players, reports, countries] = await Promise.all([
    supabase
      .from("players")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),
    supabase
      .from("scout_reports")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),
    supabase.from("countries").select("code", { count: "exact", head: true }),
  ]);

  return {
    publishedPlayers: players.count ?? 0,
    publishedReports: reports.count ?? 0,
    countriesIndexed: countries.count ?? 0,
  };
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
