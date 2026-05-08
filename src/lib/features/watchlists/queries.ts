import { createClient } from "@/lib/core/supabase/server";

export type WatchlistSummary = {
  id: string;
  name: string;
  ownerId: string;
  playerCount: number;
  createdAt: string;
};

export type WatchlistPlayer = {
  id: string;
  slug: string;
  fullName: string;
  primaryPositionCode: string | null;
  nationalityCode: string | null;
  currentClub: string | null;
  photoUrl: string | null;
  addedAt: string;
};

export async function getWatchlist(id: string): Promise<WatchlistSummary | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("watchlists")
    .select("id, name, owner_id, created_at")
    .eq("id", id)
    .maybeSingle();

  if (!data) return null;

  const { count } = await supabase
    .from("watchlist_players")
    .select("player_id", { count: "exact", head: true })
    .eq("watchlist_id", id);

  return {
    id: data.id as string,
    name: data.name as string,
    ownerId: data.owner_id as string,
    playerCount: count ?? 0,
    createdAt: data.created_at as string,
  };
}

type WatchlistPlayerRow = {
  added_at: string;
  players: {
    id: string;
    slug: string;
    full_name: string;
    primary_position_code: string | null;
    nationality_code: string | null;
    current_club: string | null;
    photo_url: string | null;
  } | null;
};

export async function listWatchlistPlayers(
  watchlistId: string,
): Promise<WatchlistPlayer[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("watchlist_players")
    .select(`
      added_at,
      players!inner (
        id, slug, full_name, primary_position_code,
        nationality_code, current_club, photo_url
      )
    `)
    .eq("watchlist_id", watchlistId)
    .order("added_at", { ascending: false });

  return ((data ?? []) as unknown as WatchlistPlayerRow[])
    .filter((row) => row.players !== null)
    .map((row) => ({
      id: row.players!.id,
      slug: row.players!.slug,
      fullName: row.players!.full_name,
      primaryPositionCode: row.players!.primary_position_code,
      nationalityCode: row.players!.nationality_code,
      currentClub: row.players!.current_club,
      photoUrl: row.players!.photo_url,
      addedAt: row.added_at,
    }));
}

export async function listWatchlistsForUser(userId: string): Promise<WatchlistSummary[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("watchlists")
    .select("id, name, owner_id, created_at")
    .eq("owner_id", userId)
    .order("created_at", { ascending: false });

  if (!data) return [];

  const ids = data.map((w) => w.id as string);
  const counts = await Promise.all(
    ids.map((id) =>
      supabase
        .from("watchlist_players")
        .select("player_id", { count: "exact", head: true })
        .eq("watchlist_id", id)
        .then((res) => ({ id, count: res.count ?? 0 })),
    ),
  );
  const countMap = new Map(counts.map((c) => [c.id, c.count]));

  return data.map((w) => ({
    id: w.id as string,
    name: w.name as string,
    ownerId: w.owner_id as string,
    playerCount: countMap.get(w.id as string) ?? 0,
    createdAt: w.created_at as string,
  }));
}
