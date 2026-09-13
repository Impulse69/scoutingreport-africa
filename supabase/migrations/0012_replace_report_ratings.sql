-- Replace a report's complete rating set in one transaction.
--
-- The application previously issued a DELETE followed by a separate INSERT.
-- If the INSERT failed, the report permanently lost its existing ratings.

create or replace function public.replace_scout_report_ratings(
  p_report_id uuid,
  p_ratings jsonb
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if jsonb_typeof(p_ratings) is distinct from 'array' then
    raise exception 'p_ratings must be a JSON array';
  end if;

  delete from public.scout_report_ratings
  where report_id = p_report_id;

  insert into public.scout_report_ratings (
    report_id,
    category,
    sub_area,
    rating,
    notes
  )
  select
    p_report_id,
    (rating_item ->> 'category')::public.rating_category,
    rating_item ->> 'sub_area',
    (rating_item ->> 'rating')::smallint,
    nullif(rating_item ->> 'notes', '')
  from jsonb_array_elements(p_ratings) as rating_item;
end;
$$;

revoke all on function public.replace_scout_report_ratings(uuid, jsonb) from public;
grant execute on function public.replace_scout_report_ratings(uuid, jsonb) to authenticated;
