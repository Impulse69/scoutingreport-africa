"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/core/supabase/server";
import { getCurrentUser, hasRole } from "@/lib/core/auth-helpers";
import { playerSchema, type PlayerInput } from "@/lib/shared/schemas/player";
import { playerSlug } from "@/lib/shared/slug";
import type { PlayerStatus } from "@/lib/shared/constants";

export type PlayerSearchResult = {
  id: string;
  fullName: string;
  nationalityCode: string | null;
  primaryPositionCode: string | null;
  status: PlayerStatus;
};

/**
 * Fuzzy search players by name for the report subject picker.
 *
 * Returns published players plus the caller's own drafts. Restricting this to
 * `status = 'published'` meant a scout who saved a new player as a draft could
 * never find them again to write the report — the draft was invisible to its
 * own author. RLS already scopes the rows to published + own + admin, so no
 * status filter is needed here at all.
 */
export async function searchPlayers(query: string): Promise<PlayerSearchResult[]> {
  if (query.trim().length < 2) return [];

  const supabase = await createClient();
  const escaped = query.replace(/[%_]/g, (m) => `\\${m}`);

  const { data, error } = await supabase
    .from("players")
    .select("id, full_name, common_name, nationality_code, primary_position_code, status")
    .or(`full_name.ilike.%${escaped}%,common_name.ilike.%${escaped}%`)
    .order("status", { ascending: true })
    .order("full_name")
    .limit(10);

  if (error || !data) return [];

  return data.map((p) => ({
    id: p.id as string,
    fullName: p.full_name as string,
    nationalityCode: (p.nationality_code as string) ?? null,
    primaryPositionCode: (p.primary_position_code as string) ?? null,
    status: p.status as PlayerStatus,
  }));
}

/**
 * Create a player. Scout or admin only. Auto-generates a slug from the
 * `full_name`; falls back to a short random suffix when there's a clash.
 */
export async function createPlayer(
  input: PlayerInput,
): Promise<{ ok: true; id: string; slug: string } | { error: string; details?: unknown }> {
  const user = await getCurrentUser();
  if (!hasRole(user, "scout")) return { error: "Not authorized" };

  const parsed = playerSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid data", details: parsed.error.format() };
  }

  const supabase = await createClient();
  const baseSlug = playerSlug(parsed.data.full_name);

  const { data: existing } = await supabase
    .from("players")
    .select("id")
    .eq("slug", baseSlug)
    .maybeSingle();

  const finalSlug = existing
    ? `${baseSlug}-${Math.random().toString(36).slice(2, 8)}`
    : baseSlug;

  const { data, error } = await supabase
    .from("players")
    .insert({
      ...parsed.data,
      slug: finalSlug,
      created_by: user!.id,
    })
    .select("id, slug")
    .single();

  if (error || !data) return { error: error?.message ?? "Insert failed" };

  revalidatePath("/players");
  return { ok: true, id: data.id as string, slug: data.slug as string };
}

/**
 * Update an existing player. Row ownership is enforced by RLS — the creating
 * scout or an admin. The slug is left alone so published URLs stay stable.
 */
export async function updatePlayer(
  id: string,
  input: PlayerInput,
): Promise<{ ok: true; slug: string } | { error: string; details?: unknown }> {
  const user = await getCurrentUser();
  if (!hasRole(user, "scout")) return { error: "Not authorized" };

  const parsed = playerSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid data", details: parsed.error.format() };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("players")
    .update(parsed.data)
    .eq("id", id)
    .select("slug")
    .maybeSingle();

  if (error) return { error: error.message };
  if (!data) return { error: "Player not found, or you can't edit it" };

  const slug = data.slug as string;
  revalidatePath("/players");
  revalidatePath(`/players/${slug}`);
  revalidatePath("/scout");
  return { ok: true, slug };
}

/**
 * Publish or unpublish a player. Publishing is what puts them on the public
 * roster and makes their reports reachable; without it a player created as a
 * draft could never be promoted.
 */
export async function setPlayerStatus(
  id: string,
  status: PlayerStatus,
): Promise<{ ok: true; slug: string } | { error: string }> {
  const user = await getCurrentUser();
  if (!hasRole(user, "scout")) return { error: "Not authorized" };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("players")
    .update({ status })
    .eq("id", id)
    .select("slug")
    .maybeSingle();

  if (error) return { error: error.message };
  if (!data) return { error: "Player not found, or you can't edit it" };

  const slug = data.slug as string;
  revalidatePath("/players");
  revalidatePath(`/players/${slug}`);
  revalidatePath("/scout");
  return { ok: true, slug };
}

/** Players this scout created — the "my players" list in the workspace. */
export async function listMyPlayers(): Promise<
  {
    id: string;
    slug: string;
    fullName: string;
    status: PlayerStatus;
    primaryPositionCode: string | null;
    currentClub: string | null;
  }[]
> {
  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("players")
    .select("id, slug, full_name, status, primary_position_code, current_club")
    .eq("created_by", user.id)
    .order("updated_at", { ascending: false });

  return (data ?? []).map((p) => ({
    id: p.id as string,
    slug: p.slug as string,
    fullName: p.full_name as string,
    status: p.status as PlayerStatus,
    primaryPositionCode: (p.primary_position_code as string) ?? null,
    currentClub: (p.current_club as string) ?? null,
  }));
}
