-- Bootstrap an admin account.
--
-- Run this once in the Supabase dashboard → SQL Editor.
-- Change the email on the last statement to whichever account should be admin.
--
-- Why this is needed
-- ------------------
-- `prevent_role_self_escalation()` (migration 0006) rejects any role change
-- unless `current_app_role() = 'admin'`. That function resolves the caller's
-- role from their JWT / auth.uid(), and privileged connections have neither:
-- the SQL editor connects as `postgres`, and server code using
-- SUPABASE_SERVICE_ROLE_KEY connects as `service_role`. Both resolve to 'user'
-- and get rejected, which means:
--
--   * a database with no admin can never gain one, and
--   * /api/dev/seed-account always failed at its final step with
--     "User created but role update failed: only admins may change a profile role"
--
-- The first statement below is migration 0010 — it lets privileged connections
-- through the guard while still blocking ordinary signed-in users. The second
-- promotes your account.

-- === 1. migration 0010: privileged bypass for the role guard =====
create or replace function public.prevent_role_self_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.role is distinct from new.role then
    -- Dashboard/CLI (`postgres`) and server code holding the service-role key
    -- are trusted by definition and are the intended path for role changes.
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

-- === 2. promote your account ====================================
-- Change this email if you want a different account to be the admin.
update public.profiles
   set role = 'admin'
 where email = 'juniorike69@gmail.com';

-- Optional: give the dev-bypass accounts the roles they were meant to have.
-- They are currently stuck at 'user' because of the bug described above.
update public.profiles set role = 'scout' where email = 'scout@dev.local';
update public.profiles set role = 'admin' where email = 'admin@dev.local';

-- === 3. confirm =================================================
select email, role from public.profiles order by role, email;
