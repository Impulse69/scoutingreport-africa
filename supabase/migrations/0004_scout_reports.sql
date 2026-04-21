-- Scout reports + normalised ratings. Mirrors §2–§10 of the PDF template.

create type public.report_status as enum ('draft', 'pending_review', 'published');
create type public.observation_type as enum ('live', 'video', 'mixed');
create type public.recruitment_decision as enum ('sign_now', 'monitor', 'pass', 'revisit');
create type public.recommended_level as enum (
  'academy',
  'reserves',
  'senior_domestic',
  'senior_continental',
  'senior_european',
  'international'
);
create type public.rating_category as enum ('technical', 'tactical', 'physical', 'mentality');

create table public.scout_reports (
  id                       uuid primary key default gen_random_uuid(),
  player_id                uuid not null references public.players(id) on delete cascade,
  author_id                uuid not null references public.profiles(id) on delete restrict,

  status                   public.report_status not null default 'draft',

  -- §2 Match Context
  match_description        text,
  match_date               date,
  competition_id           uuid references public.competitions(id) on delete set null,
  role_observed_code       text references public.positions(code),
  minutes_observed         smallint check (minutes_observed between 0 and 150),
  observation_type         public.observation_type not null default 'live',

  -- §7 Strengths: jsonb array of { text: string }
  strengths                jsonb not null default '[]'::jsonb,

  -- §8 Improvements & Risks
  improvements             jsonb not null default '[]'::jsonb,
  projection               text,
  role_fit                 text,

  -- §9 Final Recommendation
  recruitment_decision     public.recruitment_decision,
  recommended_level        public.recommended_level,
  recommendation_notes     text,

  -- §10 Free text
  scout_notes              text,

  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now(),
  published_at             timestamptz
);

create index scout_reports_player_idx    on public.scout_reports (player_id);
create index scout_reports_author_idx    on public.scout_reports (author_id);
create index scout_reports_status_idx    on public.scout_reports (status);
create index scout_reports_published_idx on public.scout_reports (published_at desc)
  where status = 'published';

create trigger scout_reports_set_updated_at
  before update on public.scout_reports
  for each row execute procedure public.set_updated_at();

-- Keep published_at in sync with status
create or replace function public.set_published_at()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'published' and (old.status is distinct from 'published') then
    new.published_at := now();
  elsif new.status <> 'published' then
    new.published_at := null;
  end if;
  return new;
end;
$$;

create trigger scout_reports_set_published_at
  before update on public.scout_reports
  for each row execute procedure public.set_published_at();

-- === Normalised per-report ratings ==============================
create table public.scout_report_ratings (
  id          uuid primary key default gen_random_uuid(),
  report_id   uuid not null references public.scout_reports(id) on delete cascade,
  category    public.rating_category not null,
  sub_area    text not null,
  rating      smallint not null check (rating between 1 and 5),
  notes       text,
  unique (report_id, category, sub_area)
);

create index scout_report_ratings_report_idx on public.scout_report_ratings (report_id);
create index scout_report_ratings_category_idx on public.scout_report_ratings (category);
