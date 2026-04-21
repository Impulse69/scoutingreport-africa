-- Row-level security: everything locked down by default, then opened per-table.

alter table public.profiles             enable row level security;
alter table public.players              enable row level security;
alter table public.scout_reports        enable row level security;
alter table public.scout_report_ratings enable row level security;
alter table public.watchlists           enable row level security;
alter table public.watchlist_players    enable row level security;
alter table public.scout_invites        enable row level security;
alter table public.competitions         enable row level security;
alter table public.organisations        enable row level security;
alter table public.countries            enable row level security;
alter table public.positions            enable row level security;

-- === reference tables: public read, admin-only write ============
create policy "countries: public read"
  on public.countries for select using (true);
create policy "countries: admin write"
  on public.countries for all
  using (public.current_app_role() = 'admin')
  with check (public.current_app_role() = 'admin');

create policy "positions: public read"
  on public.positions for select using (true);
create policy "positions: admin write"
  on public.positions for all
  using (public.current_app_role() = 'admin')
  with check (public.current_app_role() = 'admin');

create policy "competitions: public read"
  on public.competitions for select using (true);
create policy "competitions: admin write"
  on public.competitions for all
  using (public.current_app_role() = 'admin')
  with check (public.current_app_role() = 'admin');

create policy "organisations: public read"
  on public.organisations for select using (true);
create policy "organisations: admin write"
  on public.organisations for all
  using (public.current_app_role() = 'admin')
  with check (public.current_app_role() = 'admin');

-- === profiles ===================================================
create policy "profiles: public read"
  on public.profiles for select using (true);

create policy "profiles: self update (except role)"
  on public.profiles for update
  using (id = auth.uid())
  with check (
    id = auth.uid()
    -- role can only be changed by admin; checked by a separate admin policy + a guard trigger.
  );

create policy "profiles: admin full"
  on public.profiles for all
  using (public.current_app_role() = 'admin')
  with check (public.current_app_role() = 'admin');

-- Guard: non-admin cannot change their own role.
create or replace function public.prevent_role_self_escalation()
returns trigger
language plpgsql
as $$
begin
  if old.role is distinct from new.role
     and public.current_app_role() <> 'admin' then
    raise exception 'only admins may change a profile role';
  end if;
  return new;
end;
$$;

create trigger profiles_prevent_role_escalation
  before update on public.profiles
  for each row execute procedure public.prevent_role_self_escalation();

-- === players ====================================================
create policy "players: public read (published)"
  on public.players for select
  using (status = 'published' or created_by = auth.uid() or public.current_app_role() = 'admin');

create policy "players: scout+ insert"
  on public.players for insert
  with check (
    public.current_app_role() in ('scout', 'admin')
    and created_by = auth.uid()
  );

create policy "players: owner update"
  on public.players for update
  using (
    created_by = auth.uid() or public.current_app_role() = 'admin'
  )
  with check (
    created_by = auth.uid() or public.current_app_role() = 'admin'
  );

create policy "players: admin delete"
  on public.players for delete
  using (public.current_app_role() = 'admin');

-- === scout_reports ==============================================
create policy "scout_reports: public read (published)"
  on public.scout_reports for select
  using (status = 'published' or author_id = auth.uid() or public.current_app_role() = 'admin');

create policy "scout_reports: scout+ insert"
  on public.scout_reports for insert
  with check (
    public.current_app_role() in ('scout', 'admin')
    and author_id = auth.uid()
  );

create policy "scout_reports: author/admin update"
  on public.scout_reports for update
  using (author_id = auth.uid() or public.current_app_role() = 'admin')
  with check (author_id = auth.uid() or public.current_app_role() = 'admin');

create policy "scout_reports: admin delete"
  on public.scout_reports for delete
  using (public.current_app_role() = 'admin');

-- === scout_report_ratings =======================================
-- Follows the parent report's visibility.
create policy "scout_report_ratings: read follows report"
  on public.scout_report_ratings for select
  using (
    exists (
      select 1 from public.scout_reports r
      where r.id = report_id
        and (r.status = 'published' or r.author_id = auth.uid() or public.current_app_role() = 'admin')
    )
  );

create policy "scout_report_ratings: write follows report"
  on public.scout_report_ratings for all
  using (
    exists (
      select 1 from public.scout_reports r
      where r.id = report_id
        and (r.author_id = auth.uid() or public.current_app_role() = 'admin')
    )
  )
  with check (
    exists (
      select 1 from public.scout_reports r
      where r.id = report_id
        and (r.author_id = auth.uid() or public.current_app_role() = 'admin')
    )
  );

-- === watchlists =================================================
create policy "watchlists: owner only"
  on public.watchlists for all
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "watchlist_players: owner via watchlist"
  on public.watchlist_players for all
  using (
    exists (
      select 1 from public.watchlists w
      where w.id = watchlist_id and w.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.watchlists w
      where w.id = watchlist_id and w.owner_id = auth.uid()
    )
  );

-- === scout_invites (admin only) =================================
create policy "scout_invites: admin only"
  on public.scout_invites for all
  using (public.current_app_role() = 'admin')
  with check (public.current_app_role() = 'admin');
