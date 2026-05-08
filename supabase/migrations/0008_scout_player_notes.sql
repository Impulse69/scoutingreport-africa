-- Per-user private scouting notes on a player slug. Used by the player
-- profile page's Scout Notes panel — visible/editable only by the author.

create table if not exists public.scout_player_notes (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  player_slug  text not null,
  notes        text not null default '',
  updated_at   timestamptz not null default now(),
  created_at   timestamptz not null default now(),
  unique (user_id, player_slug)
);

create index if not exists scout_player_notes_user_idx
  on public.scout_player_notes (user_id);

create trigger scout_player_notes_set_updated_at
  before update on public.scout_player_notes
  for each row execute procedure public.set_updated_at();

alter table public.scout_player_notes enable row level security;

create policy "users read own notes"
  on public.scout_player_notes for select
  using (auth.uid() = user_id);

create policy "users insert own notes"
  on public.scout_player_notes for insert
  with check (auth.uid() = user_id);

create policy "users update own notes"
  on public.scout_player_notes for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users delete own notes"
  on public.scout_player_notes for delete
  using (auth.uid() = user_id);
