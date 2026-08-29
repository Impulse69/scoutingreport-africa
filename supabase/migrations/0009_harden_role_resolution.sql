-- Make role resolution independent of the Supabase Auth "custom access token
-- hook" dashboard toggle.
--
-- Background: 0002 defined `current_app_role()` to read the `app_role` claim out
-- of the request JWT. That claim only exists if `custom_access_token_hook` is
-- enabled under Auth → Hooks in the Supabase dashboard. When it is not, every
-- caller — including admins — resolves to 'user', and every RLS policy gated on
-- `current_app_role() in ('scout','admin')` silently rejects the write. Scouts
-- could not insert players or reports and the failure looked like a bug in the
-- app rather than a missing dashboard switch.
--
-- Fix: keep the JWT claim as the fast path (no query when the hook is on), and
-- fall back to reading `profiles.role` directly. The function is SECURITY
-- DEFINER and owned by the migration role, so its read of `public.profiles`
-- does not re-enter RLS — no recursion with the profiles policies that call it.

create or replace function public.current_app_role()
returns public.profile_role
language plpgsql
stable
security definer
set search_path = public, auth
as $$
declare
  claim_role text;
  uid uuid;
  db_role public.profile_role;
begin
  -- Fast path: the JWT already carries the role (auth hook enabled).
  claim_role := nullif(
    current_setting('request.jwt.claims', true)::jsonb->>'app_role', ''
  );
  if claim_role is not null then
    return claim_role::public.profile_role;
  end if;

  -- Fallback: resolve from profiles. Anonymous callers have no uid.
  uid := auth.uid();
  if uid is null then
    return 'user'::public.profile_role;
  end if;

  select role into db_role from public.profiles where id = uid;
  return coalesce(db_role, 'user'::public.profile_role);
exception
  when others then
    -- Never let role resolution throw inside an RLS policy; degrade to the
    -- least-privileged role instead.
    return 'user'::public.profile_role;
end;
$$;

revoke execute on function public.current_app_role() from public;
grant execute on function public.current_app_role() to anon, authenticated, service_role;

-- === matview refresh: correct the exception guard ===============
-- 0007 caught `feature_not_supported` (0A000), but the error Postgres actually
-- raises when CONCURRENTLY runs against a never-populated matview is
-- `object_not_in_prerequisite_state` (55000), so the fallback never fired.

create or replace function public.refresh_player_category_ratings()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  refresh materialized view concurrently public.player_category_ratings;
exception
  when object_not_in_prerequisite_state or feature_not_supported then
    refresh materialized view public.player_category_ratings;
end;
$$;

revoke all on function public.refresh_player_category_ratings() from public;
grant execute on function public.refresh_player_category_ratings() to authenticated, service_role;
