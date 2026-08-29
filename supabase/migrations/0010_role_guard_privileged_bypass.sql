-- Give the role-escalation guard an escape hatch for privileged connections.
--
-- Background: 0006 added `prevent_role_self_escalation()` to stop a signed-in
-- user from promoting themselves. It raises unless `current_app_role() =
-- 'admin'`. But `current_app_role()` resolves from the request JWT / auth.uid(),
-- and privileged connections have neither:
--
--   * the Supabase SQL editor and CLI connect as `postgres`
--   * `SUPABASE_SERVICE_ROLE_KEY` connects through PostgREST as `service_role`
--
-- Both resolve to 'user' and get rejected. Two consequences, both observed on
-- this project:
--
--   1. Bootstrap deadlock — a database with no admin can never gain one, because
--      minting the first admin requires already being an admin.
--   2. `/api/dev/seed-account` always failed at its final step with "User created
--      but role update failed: only admins may change a profile role", so the
--      dev auth bypass produced accounts stuck at role 'user'. The scout and
--      admin dev accounts on this project are both sitting at 'user' for exactly
--      this reason.
--
-- The guard is meant to constrain end users reaching the table through RLS, not
-- the service role or a superuser — those are already trusted by definition and
-- are the intended path for administrative role changes.

create or replace function public.prevent_role_self_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.role is distinct from new.role then
    -- Privileged connections (dashboard/CLI as `postgres`, server-side code
    -- holding the service-role key) may always change a role.
    if current_user in (
      'postgres', 'supabase_admin', 'service_role', 'supabase_auth_admin'
    ) then
      return new;
    end if;

    if public.current_app_role() <> 'admin' then
      raise exception 'only admins may change a profile role';
    end if;
  end if;
  return new;
end;
$$;
