import { cache } from "react";
import { unstable_rethrow } from "next/navigation";
import { createClient } from "@/lib/core/supabase/server";

export const COVERAGE_LIMIT = 24;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type CompetitionPlayer = {
  id: string;
  slug: string;
  full_name: string;
  current_club: string | null;
  primary_position_code: string | null;
};
export type CompetitionReport = {
  id: string;
  match_description: string | null;
  match_date: string | null;
  players: { slug: string; full_name: string };
};
type Coverage<T> = { rows: T[]; total: number | null; unavailable: boolean };
export type CompetitionDetail =
  | { state: "missing" }
  | { state: "unavailable" }
  | {
      state: "ready";
      competition: {
        id: string;
        name: string;
        type: string;
        countries: { name: string; flag_emoji: string | null } | null;
      };
      players: Coverage<CompetitionPlayer>;
      reports: Coverage<CompetitionReport>;
    };

/** Session-scoped client + explicit publication filters, including report parents.
 * A scout/admin's broader RLS access must never turn this into a draft directory.
 * React cache only deduplicates metadata/page calls within the current render.
 */
export const getCompetitionDetail = cache(async (id: string): Promise<CompetitionDetail> => {
  if (!UUID.test(id)) return { state: "missing" };
  try {
    const supabase = await createClient();
    const { data: competition, error } = await supabase.from("competitions")
      .select("id, name, type, countries(name, flag_emoji)")
      .eq("id", id).maybeSingle();
    if (error) return { state: "unavailable" };
    if (!competition) return { state: "missing" };

    const [players, reports] = await Promise.all([
      supabase.from("players")
        .select("id, slug, full_name, current_club, primary_position_code", { count: "exact" })
        .eq("current_competition_id", id).eq("status", "published")
        .order("full_name").order("id").limit(COVERAGE_LIMIT),
      supabase.from("scout_reports")
        .select("id, match_description, match_date, players!inner(slug, full_name)", { count: "exact" })
        .eq("competition_id", id).eq("status", "published")
        .eq("players.status", "published")
        .order("published_at", { ascending: false, nullsFirst: false })
        .order("id").limit(COVERAGE_LIMIT),
    ]);
    return {
      state: "ready", competition,
      players: { rows: players.error ? [] : players.data ?? [], total: players.error ? null : players.count, unavailable: !!players.error },
      reports: { rows: reports.error ? [] : reports.data ?? [], total: reports.error ? null : reports.count, unavailable: !!reports.error },
    };
  } catch (error) {
    unstable_rethrow(error);
    return { state: "unavailable" };
  }
});
