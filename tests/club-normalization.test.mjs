import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("club migration preserves RLS and verified external identities", async () => {
  const migration = await read("supabase/migrations/0014_normalize_clubs.sql");

  assert.match(migration, /alter table public\.clubs enable row level security/i);
  assert.match(migration, /create policy "clubs: public read"/i);
  assert.match(migration, /create policy "clubs: admin write"/i);
  assert.match(migration, /add column current_club_id uuid references public\.clubs/i);
  assert.match(migration, /clubs_external_identity_pair/);
  assert.match(migration, /where external_provider is not null and external_id is not null/i);
});

test("player writes and team rosters use the normalized club relationship", async () => {
  const [schema, form, actions, teams] = await Promise.all([
    read("src/lib/shared/schemas/player.ts"),
    read("src/components/features/reports/player-form.tsx"),
    read("src/lib/features/players/actions.ts"),
    read("src/lib/features/teams/queries.ts"),
  ]);

  assert.match(schema, /current_club_id: z\.string\(\)\.uuid\(\)/);
  assert.doesNotMatch(schema, /current_club: z\.string/);
  assert.match(form, /current_club_id: clubId \|\| null/);
  assert.match(actions, /\.update\(\{ \.\.\.parsed\.data, current_club: null \}\)/);
  assert.match(teams, /\.eq\("current_club_id", club\.id\)/);
  assert.doesNotMatch(teams, /\.eq\("current_club", clubName\)/);
});
