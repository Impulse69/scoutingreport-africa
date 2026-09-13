import type { Database } from "@/lib/core/supabase/types";
import { createClient } from "@/lib/core/supabase/server";

export type CompetitionType =
  Database["public"]["Enums"]["competition_type"];

export type CompetitionListItem = {
  id: string;
  name: string;
  type: CompetitionType;
  countryCode: string | null;
  countryName: string | null;
  flagEmoji: string | null;
};

export type CompetitionListResult = {
  competitions: CompetitionListItem[];
  unavailable: boolean;
};

type CompetitionRow = {
  id: string;
  name: string;
  type: CompetitionType;
  country_code: string | null;
  countries: {
    name: string;
    flag_emoji: string | null;
  } | null;
};

/**
 * Return the admin-maintained competition reference catalogue.
 *
 * The public-read RLS policy covers this table. Keeping the query here means
 * the leagues page cannot drift back to presenting editorial rankings or
 * unverified club lists as database-backed facts.
 */
export async function listCompetitions(): Promise<CompetitionListResult> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("competitions")
      .select("id, name, type, country_code, countries(name, flag_emoji)")
      .order("type")
      .order("name")
      .limit(100);

    if (error) {
      return { competitions: [], unavailable: true };
    }

    return {
      unavailable: false,
      competitions: ((data ?? []) as CompetitionRow[]).map((competition) => ({
        id: competition.id,
        name: competition.name,
        type: competition.type,
        countryCode: competition.country_code,
        countryName: competition.countries?.name ?? null,
        flagEmoji: competition.countries?.flag_emoji ?? null,
      })),
    };
  } catch {
    return { competitions: [], unavailable: true };
  }
}
