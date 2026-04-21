-- Aggregated per-player category ratings. Used by radar chart + scatter plot.

create materialized view public.player_category_ratings as
  select
    r.player_id,
    rat.category,
    round(avg(rat.rating)::numeric, 2) as avg_rating,
    count(distinct r.id) as report_count
  from public.scout_reports r
  join public.scout_report_ratings rat on rat.report_id = r.id
  where r.status = 'published'
    and rat.sub_area = 'overall'
  group by r.player_id, rat.category;

create unique index player_category_ratings_uidx
  on public.player_category_ratings (player_id, category);

-- Refresh helper — callable from a server action when a report is published.
create or replace function public.refresh_player_category_ratings()
returns void
language plpgsql
security definer
as $$
begin
  refresh materialized view concurrently public.player_category_ratings;
exception
  when feature_not_supported then
    -- First refresh can't be CONCURRENT; fall back.
    refresh materialized view public.player_category_ratings;
end;
$$;

revoke all on function public.refresh_player_category_ratings() from public;
grant execute on function public.refresh_player_category_ratings() to authenticated;

-- Convenient view: players with their latest published scout report summary.
create or replace view public.players_public as
  select
    p.*,
    (
      select count(*) from public.scout_reports sr
      where sr.player_id = p.id and sr.status = 'published'
    ) as published_report_count,
    (
      select max(sr.published_at) from public.scout_reports sr
      where sr.player_id = p.id and sr.status = 'published'
    ) as last_report_at
  from public.players p
  where p.status = 'published';

grant select on public.players_public to anon, authenticated;
grant select on public.player_category_ratings to anon, authenticated;
