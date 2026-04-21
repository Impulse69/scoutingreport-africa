-- Reference data shared across the app.
-- Applied before any table that depends on these codes / ids.

create extension if not exists "pgcrypto";
create extension if not exists "citext";

-- === countries ==================================================
create table public.countries (
  code        text primary key check (char_length(code) = 2),
  name        text not null,
  flag_emoji  text
);

comment on table public.countries is
  'ISO 3166-1 alpha-2 country codes with display metadata. Seeded with CAF member nations.';

-- === positions ==================================================
create type public.position_group as enum ('GK', 'DEF', 'MID', 'FWD');

create table public.positions (
  code  text primary key,
  name  text not null,
  "group" public.position_group not null
);

comment on table public.positions is 'Football position codes (GK, CB, CM, ST, …).';

-- === competition types + competitions ===========================
create type public.competition_type as enum (
  'continental_club',
  'national_team',
  'domestic',
  'youth',
  'academy',
  'friendly'
);

create table public.competitions (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  type          public.competition_type not null,
  country_code  text references public.countries(code),
  logo_url      text,
  created_at    timestamptz not null default now()
);

create index competitions_type_idx on public.competitions (type);
create index competitions_country_idx on public.competitions (country_code);

-- === organisations (scout orgs / clubs / federations) ============
create table public.organisations (
  id        uuid primary key default gen_random_uuid(),
  name      text not null,
  logo_url  text,
  created_at timestamptz not null default now()
);
