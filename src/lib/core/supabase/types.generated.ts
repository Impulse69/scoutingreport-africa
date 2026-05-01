/**
 * Placeholder until the Supabase project is linked and real types can be generated with:
 *   pnpm db:types   (or `npm run db:types`)
 *
 * Once the migrations are applied and the project is linked via `supabase link`,
 * running `npm run db:types` will replace this file with accurate, schema-driven types.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
