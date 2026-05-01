/**
 * Re-exports the Supabase-backed auth helpers so feature code can import
 * from the stable `@/lib/core/auth-helpers` path regardless of where the
 * underlying implementation lives.
 */
export {
  getCurrentUser,
  hasRole,
  type AuthedUser,
} from "./supabase/with-role";
