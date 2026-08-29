"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/core/supabase/server";
import { getCurrentUser } from "@/lib/core/auth-helpers";

export type MyProfile = {
  id: string;
  email: string | null;
  displayName: string | null;
  bio: string | null;
  role: "user" | "scout" | "admin";
  createdAt: string | null;
};

export async function getMyProfile(): Promise<MyProfile | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, email, display_name, bio, role, created_at")
    .eq("id", user.id)
    .maybeSingle();

  if (!data) {
    return {
      id: user.id,
      email: user.email,
      displayName: null,
      bio: null,
      role: user.role,
      createdAt: null,
    };
  }

  return {
    id: data.id as string,
    email: (data.email as string) ?? user.email,
    displayName: (data.display_name as string) ?? null,
    bio: (data.bio as string) ?? null,
    role: data.role as MyProfile["role"],
    createdAt: (data.created_at as string) ?? null,
  };
}

/**
 * Update the caller's own display name and bio. `role` is deliberately not
 * accepted here — it is admin-controlled and guarded by a database trigger.
 */
export async function updateMyProfile(input: {
  displayName: string;
  bio: string;
}): Promise<{ ok: true } | { error: string }> {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const displayName = input.displayName.trim();
  const bio = input.bio.trim();

  if (displayName.length > 80) return { error: "Display name is too long (max 80)" };
  if (bio.length > 500) return { error: "Bio is too long (max 500)" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: displayName || null,
      bio: bio || null,
    })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/settings");
  return { ok: true };
}
