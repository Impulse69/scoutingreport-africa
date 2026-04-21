import { createClient } from "./server";
import type { ProfileRole } from "@/lib/constants";

export type AuthedUser = {
  id: string;
  email: string | null;
  role: ProfileRole;
};

/**
 * Fetch the current signed-in user and their role from `profiles`.
 * Returns `null` if not signed in or profile row missing.
 */
export async function getCurrentUser(): Promise<AuthedUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single<{ role: ProfileRole }>();

  return {
    id: user.id,
    email: user.email ?? null,
    role: profile?.role ?? "user",
  };
}

export function hasRole(
  user: AuthedUser | null,
  minimum: ProfileRole,
): boolean {
  if (!user) return false;
  const order: ProfileRole[] = ["user", "scout", "admin"];
  return order.indexOf(user.role) >= order.indexOf(minimum);
}
