"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/core/supabase/server";
import { getCurrentUser, hasRole } from "@/lib/core/auth-helpers";
import { playerSchema, type PlayerInput } from "@/lib/shared/schemas/player";
import { playerSlug } from "@/lib/shared/slug";

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

/**
 * Create a player. Scout or admin only. Auto-generates a slug from the
 * `full_name` if not present in the database; falls back to appending the new
 * id when there's a clash.
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

  // Check for slug collision
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
