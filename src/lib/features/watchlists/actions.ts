"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/core/supabase/server";
import { getCurrentUser } from "@/lib/core/auth-helpers";

export async function addPlayerToWatchlist(
  watchlistId: string,
  playerId: string,
): Promise<{ ok: true } | { error: string }> {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("watchlist_players")
    .insert({ watchlist_id: watchlistId, player_id: playerId });

  if (error) return { error: error.message };

  revalidatePath(`/watchlists/${watchlistId}`);
  return { ok: true };
}

export async function removePlayerFromWatchlist(
  watchlistId: string,
  playerId: string,
): Promise<{ ok: true } | { error: string }> {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("watchlist_players")
    .delete()
    .eq("watchlist_id", watchlistId)
    .eq("player_id", playerId);

  if (error) return { error: error.message };

  revalidatePath(`/watchlists/${watchlistId}`);
  return { ok: true };
}

export async function createWatchlist(
  name: string,
): Promise<{ ok: true; id: string } | { error: string }> {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  if (!name.trim() || name.length > 120) return { error: "Invalid name" };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("watchlists")
    .insert({ owner_id: user.id, name: name.trim() })
    .select("id")
    .single();

  if (error || !data) return { error: error?.message ?? "Insert failed" };

  revalidatePath("/watchlists");
  return { ok: true, id: data.id as string };
}
