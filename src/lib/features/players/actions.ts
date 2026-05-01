"use server";

import { createClient } from "@/lib/core/supabase/server";

export type PlayerSearchResult = {
  id: string;
  fullName: string;
  nationalityCode: string | null;
  primaryPositionCode: string | null;
};

/**
 * Fuzzy search players by full_name / common_name. Public — only returns
 * players whose `status='published'`. Real implementation lands in Phase 3
 * (search + filters); for Phase 0 this returns an empty list so consumer
 * pages typecheck and render their empty states.
 */
export async function searchPlayers(query: string): Promise<PlayerSearchResult[]> {
  if (query.trim().length < 2) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("players")
    .select("id, full_name, nationality_code, primary_position_code")
    .eq("status", "published")
    .ilike("full_name", `%${query}%`)
    .limit(8);

  if (error || !data) return [];

  return data.map((p) => ({
    id: p.id as string,
    fullName: p.full_name as string,
    nationalityCode: (p.nationality_code as string) ?? null,
    primaryPositionCode: (p.primary_position_code as string) ?? null,
  }));
}
