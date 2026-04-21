-- Per-user profile + role.
-- Mirrors auth.users 1:1 via a trigger so that application data can reference `profiles.id` as a foreign key without touching the auth schema.

create type public.profile_role as enum ('user', 'scout', 'admin');

create table public.profiles (
  id                uuid primary key references auth.users(id) on delete cascade,
  email             citext unique,
  display_name      text,
  avatar_url        text,
  role              public.profile_role not null default 'user',
  organisation_id   uuid references public.organisations(id) on delete set null,
  bio               text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index profiles_role_idx on public.profiles (role);

-- Keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- Auto-create a profile row when a new auth.users row is inserted.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Custom JWT claim: expose profiles.role in the user's JWT as `app_role`
-- so RLS policies can check the role without an extra round trip.
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  claims jsonb;
  user_role public.profile_role;
begin
  select role into user_role
  from public.profiles
  where id = (event->>'user_id')::uuid;

  claims := coalesce(event->'claims', '{}'::jsonb);
  if user_role is not null then
    claims := jsonb_set(claims, '{app_role}', to_jsonb(user_role::text));
  end if;

  event := jsonb_set(event, '{claims}', claims);
  return event;
end;
$$;

-- Allow Supabase auth to invoke the hook.
grant execute on function public.custom_access_token_hook(jsonb)
  to supabase_auth_admin;
revoke execute on function public.custom_access_token_hook(jsonb) from authenticated, anon, public;

-- Helper: read the current caller's role out of the JWT.
create or replace function public.current_app_role()
returns public.profile_role
language sql
stable
as $$
  select coalesce(
    nullif(current_setting('request.jwt.claims', true)::jsonb->>'app_role', ''),
    'user'
  )::public.profile_role;
$$;
