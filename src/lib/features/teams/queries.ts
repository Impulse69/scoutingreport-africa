import { createClient } from "@/lib/core/supabase/server";

export type TeamSquadPlayer = {
  id: string;
  slug: string;
  fullName: string;
  commonName: string | null;
  primaryPositionCode: string;
  nationalityCode: string;
  photoUrl: string | null;
};

export type TeamSquadResult = {
  players: TeamSquadPlayer[];
  unavailable: boolean;
};

/**
 * Load the public roster represented by ScoutingReport dossiers.
 *
 * Club membership is currently stored as the player's free-text
 * `current_club`, so matching is deliberately exact. This avoids silently
 * merging similarly named clubs. The explicit published filter mirrors the
 * public RLS policy and prevents an authenticated scout's own drafts appearing
 * on a public team page.
 */
export async function listPublishedTeamPlayers(
  clubName: string,
): Promise<TeamSquadResult> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("players")
    .select(
      "id, slug, full_name, common_name, primary_position_code, nationality_code, photo_url",
    )
    .eq("status", "published")
    .eq("current_club", clubName)
    .order("primary_position_code")
    .order("full_name");

  if (error) {
    return { players: [], unavailable: true };
  }

  return {
    unavailable: false,
    players: (data ?? []).map((player) => ({
      id: player.id,
      slug: player.slug,
      fullName: player.full_name,
      commonName: player.common_name,
      primaryPositionCode: player.primary_position_code,
      nationalityCode: player.nationality_code,
      photoUrl: player.photo_url,
    })),
  };
}

export type PositionGroup = "GK" | "DEF" | "MID" | "FWD";

const POSITION_GROUPS: Record<PositionGroup, readonly string[]> = {
  GK: ["GK"],
  DEF: ["CB", "LB", "RB", "LWB", "RWB"],
  MID: ["DM", "CM", "AM", "LM", "RM"],
  FWD: ["LW", "RW", "SS", "ST"],
};

export function positionGroup(code: string): PositionGroup {
  return (
    (Object.entries(POSITION_GROUPS).find(([, codes]) =>
      codes.includes(code),
    )?.[0] as PositionGroup | undefined) ?? "MID"
  );
}
