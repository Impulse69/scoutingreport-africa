-- Only signed-in users should be able to invoke the rating replacement RPC.
-- Row-level security still determines which reports each user may modify.

revoke execute on function public.replace_scout_report_ratings(uuid, jsonb) from anon;
grant execute on function public.replace_scout_report_ratings(uuid, jsonb) to authenticated;
