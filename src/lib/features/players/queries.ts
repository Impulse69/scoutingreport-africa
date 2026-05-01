import { createClient } from "@/lib/core/supabase/server";

export type AttributeGroup = {
  category: string;
  attributes: { name: string; rating: number | null }[];
};

export type PlayerProfile = {
  id: string;
  fullName: string;
  nationalityCode: string | null;
  primaryPositionCode: string | null;
  groups: AttributeGroup[];
};

/**
 * Load a player and their aggregated category ratings (driven by the
 * `player_category_ratings` materialized view from migration 0007). Returns
 * null when the player doesn't exist or isn't published. Phase 3 wires the
 * full radar / report list.
 */
export async function getPlayerProfile(id: string): Promise<PlayerProfile | null> {
  const supabase = await createClient();

  const { data: player } = await supabase
    .from("players")
    .select("id, full_name, nationality_code, primary_position_code, status")
    .eq("id", id)
    .single();

  if (!player || player.status !== "published") return null;

  return {
    id: player.id as string,
    fullName: player.full_name as string,
    nationalityCode: (player.nationality_code as string) ?? null,
    primaryPositionCode: (player.primary_position_code as string) ?? null,
    groups: [],
  };
}
