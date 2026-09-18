-- Normalize the player's current club while preserving the legacy text field
-- during the transition. Existing non-empty club names are copied verbatim;
-- no club, country, competition, or provider metadata is inferred.

create table public.clubs (
  id                 uuid primary key default gen_random_uuid(),
  slug               text unique not null,
  name               text not null,
  country_code       text references public.countries(code) on delete set null,
  competition_id     uuid references public.competitions(id) on delete set null,
  logo_url            text,
  external_provider  text,
  external_id        text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),

  constraint clubs_name_length check (char_length(btrim(name)) between 2 and 200),
  constraint clubs_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint clubs_external_identity_pair check (
    (external_provider is null) = (external_id is null)
  )
);

create unique index clubs_name_ci_uidx on public.clubs (lower(name));
create unique index clubs_external_identity_uidx
  on public.clubs (external_provider, external_id)
  where external_provider is not null and external_id is not null;
create index clubs_competition_idx on public.clubs (competition_id);
create index clubs_country_idx on public.clubs (country_code);

create trigger clubs_set_updated_at
  before update on public.clubs
  for each row execute procedure public.set_updated_at();

alter table public.clubs enable row level security;

grant select on public.clubs to anon, authenticated;
grant insert, update, delete on public.clubs to authenticated;

create policy "clubs: public read"
  on public.clubs for select
  to anon, authenticated
  using (true);

create policy "clubs: admin write"
  on public.clubs for all
  to authenticated
  using ((select public.current_app_role()) = 'admin')
  with check ((select public.current_app_role()) = 'admin');

alter table public.players
  add column current_club_id uuid references public.clubs(id) on delete set null;

create index players_current_club_idx on public.players (current_club_id);

with legacy_clubs as (
  select distinct btrim(current_club) as name
  from public.players
  where nullif(btrim(current_club), '') is not null
), normalized as (
  select
    name,
    coalesce(
      nullif(btrim(regexp_replace(lower(name), '[^a-z0-9]+', '-', 'g'), '-'), ''),
      'club'
    ) as base_slug
  from legacy_clubs
), prepared as (
  select
    name,
    case
      when count(*) over (partition by base_slug) = 1 then base_slug
      else base_slug || '-' || substr(md5(name), 1, 6)
    end as slug
  from normalized
)
insert into public.clubs (name, slug)
select name, slug
from prepared;

update public.players as player
set current_club_id = club.id
from public.clubs as club
where player.current_club_id is null
  and player.current_club is not null
  and lower(club.name) = lower(btrim(player.current_club));

comment on table public.clubs is
  'Verified club registry. Provider identifiers remain null until independently verified.';
comment on column public.clubs.external_provider is
  'Stable upstream source name, populated only alongside a verified external_id.';
comment on column public.players.current_club is
  'Legacy free-text club name retained temporarily; new writes use current_club_id.';
