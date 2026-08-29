"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/core/supabase/server";
import { getCurrentUser } from "@/lib/core/auth-helpers";

export type NoteResult =
  | { ok: true; notes: string; updatedAt: string }
  | { error: string };

export async function getMyNoteForPlayer(
  playerSlug: string,
): Promise<{ notes: string; updatedAt: string } | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("scout_player_notes")
    .select("notes, updated_at")
    .eq("user_id", user.id)
    .eq("player_slug", playerSlug)
    .maybeSingle();

  if (!data) return { notes: "", updatedAt: "" };
  return { notes: data.notes ?? "", updatedAt: data.updated_at ?? "" };
}

export async function saveMyNoteForPlayer(
  playerSlug: string,
  notes: string,
): Promise<NoteResult> {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };
  if (notes.length > 2000) return { error: "Note too long (max 2000)" };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("scout_player_notes")
    .upsert(
      {
        user_id: user.id,
        player_slug: playerSlug,
        notes,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,player_slug" },
    )
    .select("notes, updated_at")
    .single();

  if (error || !data) return { error: error?.message ?? "Save failed" };

  revalidatePath(`/players/${playerSlug}`);
  return {
    ok: true,
    notes: data.notes ?? "",
    updatedAt: data.updated_at ?? "",
  };
}

export async function deleteMyNoteForPlayer(
  playerSlug: string,
): Promise<{ ok: true } | { error: string }> {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("scout_player_notes")
    .delete()
    .eq("user_id", user.id)
    .eq("player_slug", playerSlug);

  if (error) return { error: error.message };

  revalidatePath(`/players/${playerSlug}`);
  return { ok: true };
}
