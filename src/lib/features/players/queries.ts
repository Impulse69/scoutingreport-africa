import { createClient } from "@/lib/core/supabase/server";

export type AttributeGroup = {
  category: string;
  attributes: { name: string; rating: number | null }[];
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
  groups: AttributeGroup[];
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

/**
 * Load a player and their aggregated category ratings (driven by the
 * `player_category_ratings` materialized view from migration 0007). Returns
 * null when the player doesn't exist or isn't published. Phase 3 wires the
 * full radar / report list.
 */
const PLAYER_SELECT = `
  id, slug, full_name, common_name, nationality_code,
  primary_position_code, secondary_position_codes, preferred_foot,
  height_cm, weight_kg, current_club, photo_url, bio, date_of_birth, status
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
  status: string;
};

function mapPlayer(row: PlayerRow): PlayerProfile {
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
    groups: [],
  };
}

async function loadCategoryRatings(playerId: string): Promise<AttributeGroup[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("player_category_ratings")
    .select("category, sub_area, avg_rating")
    .eq("player_id", playerId);

  if (!data) return [];

  const groups = new Map<string, AttributeGroup>();
  for (const row of data as unknown as Array<{
    category: string;
    sub_area: string;
    avg_rating: number | null;
  }>) {
    if (!groups.has(row.category)) {
      groups.set(row.category, { category: row.category, attributes: [] });
    }
    groups.get(row.category)!.attributes.push({
      name: row.sub_area,
      rating: row.avg_rating,
    });
  }
  return Array.from(groups.values());
}

export async function getPlayerProfile(idOrSlug: string): Promise<PlayerProfile | null> {
  const supabase = await createClient();

  // Try by id first (uuid), then fall back to slug
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}/i.test(idOrSlug);
  const { data } = isUuid
    ? await supabase.from("players").select(PLAYER_SELECT).eq("id", idOrSlug).maybeSingle()
    : await supabase.from("players").select(PLAYER_SELECT).eq("slug", idOrSlug).maybeSingle();

  if (!data) return null;
  const row = data as unknown as PlayerRow;
  if (row.status !== "published") return null;

  const profile = mapPlayer(row);
  profile.groups = await loadCategoryRatings(row.id);
  return profile;
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
