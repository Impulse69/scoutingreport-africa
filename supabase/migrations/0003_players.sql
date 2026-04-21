-- Players. Manually entered by scouts and admins.
-- Mirrors §1 (Player Information) of the scouting report PDF template.

create type public.preferred_foot as enum ('left', 'right', 'both', 'unknown');
create type public.player_status as enum ('draft', 'published');

create table public.players (
  id                          uuid primary key default gen_random_uuid(),
  slug                        text unique not null,

  full_name                   text not null,
  common_name                 text,

  date_of_birth               date not null,
  nationality_code            text not null references public.countries(code),

  primary_position_code       text not null references public.positions(code),
  secondary_position_codes    text[] not null default '{}',

  preferred_foot              public.preferred_foot not null default 'unknown',
  height_cm                   smallint check (height_cm between 140 and 220),
  weight_kg                   smallint check (weight_kg between 40 and 120),

  current_club                text,
  current_competition_id      uuid references public.competitions(id) on delete set null,

  photo_url                   text,
  bio                         text,

  status                      public.player_status not null default 'draft',

  created_by                  uuid references public.profiles(id) on delete set null,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

create index players_status_idx              on public.players (status);
create index players_primary_position_idx    on public.players (primary_position_code);
create index players_nationality_idx         on public.players (nationality_code);
create index players_created_by_idx          on public.players (created_by);

-- Search: GIN trigram on names for fuzzy search.
create extension if not exists pg_trgm;
create index players_full_name_trgm_idx on public.players using gin (full_name gin_trgm_ops);
create index players_common_name_trgm_idx on public.players using gin (common_name gin_trgm_ops);

create trigger players_set_updated_at
  before update on public.players
  for each row execute procedure public.set_updated_at();
