-- User-owned watchlists + scout invites.

create table public.watchlists (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references public.profiles(id) on delete cascade,
  name        text not null,
  created_at  timestamptz not null default now()
);

create index watchlists_owner_idx on public.watchlists (owner_id);

create table public.watchlist_players (
  watchlist_id uuid not null references public.watchlists(id) on delete cascade,
  player_id    uuid not null references public.players(id) on delete cascade,
  note         text,
  added_at     timestamptz not null default now(),
  primary key (watchlist_id, player_id)
);

create index watchlist_players_player_idx on public.watchlist_players (player_id);

-- === Scout invites (admin invites scouts by email) ==============
create table public.scout_invites (
  id          uuid primary key default gen_random_uuid(),
  email       citext not null,
  invited_by  uuid references public.profiles(id) on delete set null,
  token       text unique not null,
  accepted_at timestamptz,
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null default now() + interval '14 days'
);

create index scout_invites_email_idx on public.scout_invites (email);
create index scout_invites_token_idx on public.scout_invites (token);
