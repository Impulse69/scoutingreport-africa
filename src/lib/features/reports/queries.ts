import { createClient } from "@/lib/core/supabase/server";
import type {
  ObservationType,
  RatingCategory,
  RecommendedLevel,
  RecruitmentDecision,
  ReportStatus,
} from "@/lib/shared/constants";

export type ReportRatingRow = {
  category: RatingCategory;
  sub_area: string;
  rating: number;
  notes: string | null;
};

export type ScoutReportRow = {
  id: string;
  player_id: string;
  author_id: string;
  status: ReportStatus;
  match_description: string | null;
  match_date: string | null;
  competition_id: string | null;
  role_observed_code: string | null;
  minutes_observed: number | null;
  observation_type: ObservationType;
  strengths: { text: string }[];
  improvements: { text: string }[];
  projection: string | null;
  role_fit: string | null;
  recruitment_decision: RecruitmentDecision | null;
  recommended_level: RecommendedLevel | null;
  recommendation_notes: string | null;
  scout_notes: string | null;
  technical_notes: string | null;
  tactical_notes: string | null;
  physical_notes: string | null;
  mentality_notes: string | null;
  improvements_notes: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  ratings: ReportRatingRow[];
};

export type ReportWithJoins = ScoutReportRow & {
  competition: { id: string; name: string } | null;
  player: {
    id: string;
    slug: string;
    full_name: string;
    common_name: string | null;
    nationality_code: string | null;
    primary_position_code: string | null;
  } | null;
  author: {
    id: string;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
};

const REPORT_SELECT = `
  id, player_id, author_id, status,
  match_description, match_date, competition_id,
  role_observed_code, minutes_observed, observation_type,
  strengths, improvements, projection, role_fit,
  recruitment_decision, recommended_level, recommendation_notes,
  scout_notes,
  technical_notes, tactical_notes, physical_notes, mentality_notes,
  improvements_notes,
  created_at, updated_at, published_at
`;

const FULL_SELECT = `
  ${REPORT_SELECT},
  player:players!scout_reports_player_id_fkey (
    id, slug, full_name, common_name, nationality_code, primary_position_code
  ),
  author:profiles!scout_reports_author_id_fkey (
    id, display_name, avatar_url
  ),
  competition:competitions!scout_reports_competition_id_fkey (
    id, name
  ),
  ratings:scout_report_ratings (
    category, sub_area, rating, notes
  )
`;

export type CompetitionOption = {
  id: string;
  name: string;
  type: string;
  countryCode: string | null;
};

/**
 * Competitions for the report's §2 Match Context "Competition" field.
 *
 * `scout_reports.competition_id` has existed since migration 0004 but nothing
 * ever populated it — there was no picker on the form and no query to feed one.
 */
export async function listCompetitions(): Promise<CompetitionOption[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("competitions")
    .select("id, name, type, country_code")
    .order("type")
    .order("name");

  return (data ?? []).map((c) => ({
    id: c.id as string,
    name: c.name as string,
    type: c.type as string,
    countryCode: (c.country_code as string) ?? null,
  }));
}

export async function getReportById(id: string): Promise<ReportWithJoins | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("scout_reports")
    .select(FULL_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return data as unknown as ReportWithJoins;
}

export async function listReportsForPlayer(
  playerId: string,
  opts: { onlyPublished?: boolean; limit?: number } = {},
): Promise<ReportWithJoins[]> {
  const supabase = await createClient();
  let q = supabase
    .from("scout_reports")
    .select(FULL_SELECT)
    .eq("player_id", playerId)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("updated_at", { ascending: false });

  if (opts.onlyPublished) q = q.eq("status", "published");
  if (opts.limit) q = q.limit(opts.limit);

  const { data } = await q;
  return (data ?? []) as unknown as ReportWithJoins[];
}

export async function listMyReports(
  authorId: string,
  status?: ReportStatus,
): Promise<ReportWithJoins[]> {
  const supabase = await createClient();
  let q = supabase
    .from("scout_reports")
    .select(FULL_SELECT)
    .eq("author_id", authorId)
    .order("updated_at", { ascending: false });

  if (status) q = q.eq("status", status);

  const { data } = await q;
  return (data ?? []) as unknown as ReportWithJoins[];
}

/**
 * Convenience for the public player profile: takes a slug, looks up the
 * matching Supabase player, and returns their published reports. Empty
 * array for ESPN-fetched players (which have no Supabase row).
 */
export async function listPublishedReportsForPlayerSlug(
  slug: string,
  limit = 5,
): Promise<ReportWithJoins[]> {
  const supabase = await createClient();
  const { data: player } = await supabase
    .from("players")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (!player?.id) return [];
  return listReportsForPlayer(player.id as string, {
    onlyPublished: true,
    limit,
  });
}

export async function listLatestPublishedReports(
  limit = 12,
): Promise<ReportWithJoins[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("scout_reports")
    .select(FULL_SELECT)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as unknown as ReportWithJoins[];
}
