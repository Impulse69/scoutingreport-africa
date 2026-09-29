import { createClient } from "@/lib/core/supabase/server";

export type ClubOption = {
  id: string;
  name: string;
  countryCode: string | null;
  competitionId: string | null;
};

/** Public, RLS-visible club records for player assignment. */
export async function listClubs(): Promise<ClubOption[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("clubs")
    .select("id, name, country_code, competition_id")
    .order("name");

  return (data ?? []).map((club) => ({
    id: club.id,
    name: club.name,
    countryCode: club.country_code,
    competitionId: club.competition_id,
  }));
}
