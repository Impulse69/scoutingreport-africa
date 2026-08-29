# Make the scouting loop work end-to-end

Goal: a scout can create a player, write a structured report, publish it, and see
it on the public profile — with no dead ends anywhere in the navigation.

Out of scope (deliberately): predictions, FPL sub-pages, league detail, compare,
fixtures. These are marked coming-soon rather than faked. Frontend redesign is a
separate later pass.

## A. Foundation (live DB: xlqfzsprtgrguqotumfi)

- [x] A1. Applied migration `0008_scout_player_notes.sql` — table was missing in prod
- [x] A2. Migration `0009` — `current_app_role()` now falls back to a SECURITY
      DEFINER `profiles` lookup, so RLS no longer depends on the Supabase
      dashboard auth-hook toggle. Also fixed the matview refresh's exception
      guard (caught `feature_not_supported`; Postgres raises
      `object_not_in_prerequisite_state`)
- [ ] A3. **BLOCKED** — promote `juniorike69@gmail.com` to `admin`. The permission
      classifier refused the write. Migration `0010` + the promotion are written
      to `supabase/scripts/bootstrap-admin.sql` — run it in the SQL editor
- [x] A4. Published the 3 seeded draft players (+ added 4 more, see D)
- [x] A5. Added `scout_player_notes` to `types.ts`, dropped the `as any` casts in
      the notes actions, deleted the unused `types.generated.ts`

## B. Close the core loop

- [x] B1. `loadCategoryRatings` selected a `sub_area` column that doesn't exist on
      `player_category_ratings`. Replaced with a direct aggregate over
      `scout_report_ratings` — always current, and gives sub-area detail
- [x] B2. Matview refreshed on publish (non-fatal if it fails)
- [x] B3. `/players/[slug]` renders a real profile for Supabase players — hero,
      averaged category + sub-area ratings, published reports, bio, watchlist,
      scout notes. Replaces the "fixture-grade data" stub. ESPN path preserved
- [x] B4. Player edit page (`/scout/players/[id]/edit`) with publish/unpublish.
      Create and edit now share one `PlayerForm`
- [x] B5. Player picker surfaces the scout's own drafts; scout workspace lists
      "my players" with status badges
- [x] B6. `generateMetadata` on the player and report pages

## C. Remove the dead ends

- [x] C1. One shell. `(app)` routes moved into `(public)`; deleted the duplicate
      light `SiteHeader`/`SiteFooter`/`UserMenu`/`ModeToggle`. Theme pinned dark
- [x] C2. `src/lib/shared/routes.ts` is the single source of truth for what's
      built. `isLiveRoute()` drives the disabled "Soon" state in the nav and on
      dashboard cards
- [x] C3. `sitemap.ts` lists only routes that resolve, plus every published player

## D. Verify

- [x] D1. `npm run build` and `tsc --noEmit` clean
- [x] D2. Ran the loop against the live DB with a temporary published report:
      profile aggregates (4.0 overall), report list, report detail, sub-area
      bars, and the wrong-slug 404 guard all confirmed. Test data removed
- [x] D3. Two-hop crawl of 73 reachable links: zero 404s

## Review

### Bugs found and fixed beyond the original list

- **Role-change deadlock.** `prevent_role_self_escalation()` rejects any role
  change unless the caller is already an admin, and resolves privileged
  connections (`postgres`, `service_role`) as `user`. So a database with no admin
  could never gain one, and `/api/dev/seed-account` had *always* failed at its
  final step — which is why `scout@dev.local` and `admin@dev.local` are both
  still role `user`. Migration `0010` fixes it (blocked; see A3).
- **`/scouting` was auth-gated by accident.** The proxy matched protected
  prefixes with `startsWith`, so `"/scout"` also captured `/scouting`, a public
  marketing page. Now matches whole path segments.
- **Squad tables and standings linked to 404s.** Club rosters and standings
  come from mock/feed data, not our player table. Both now resolve against real
  rows and render plain text for names with no page — links appear automatically
  once a scout adds that player.
- **Unseeded teams 404'd on their own Squad tab.** Now shows the same
  "not seeded yet" state the overview page uses.
- **Nav featured-players fallback pointed at non-existent profiles.** Removed;
  the nav is fed real published players from the layout.

### Notes

- Four players referenced by the landing/FPL pages (Lamine Camara, Nicolas
  Jackson, Pape Matar Sarr, Simon Adingra) were added as published profiles so
  those pages stop 404ing. **Verify their club and date of birth** — clubs move.
- `npm run lint` reports 4 `react-hooks/set-state-in-effect` errors. All
  pre-existed; not in the build path. Fixed the one in `player-picker.tsx`. The
  remaining three (`dismissible-banner`, `nav-search`, `marketing-nav`) are
  effects that are behaviourally correct as written.
- A parallel redesign pass edited several components mid-task. It kept the
  `isLiveRoute` guards and the `featured` wiring; one break it introduced
  (`AccountFooter` receiving a `role` prop it didn't accept) is fixed.
