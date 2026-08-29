# ScoutingReport Africa

A scouting platform for African football. Scouts write structured, attributable
reports on players; the public browses player profiles and published reports.

Next.js 16 (App Router, Turbopack) · React 19 · Supabase (Postgres + Auth + RLS)
· Tailwind v4 · next-intl.

---

## Getting started

```bash
npm install
```

Copy `.env.example` to `.env.local` and fill in the Supabase values, then:

```bash
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server on http://localhost:3000 |
| `npm run build` | Production build (runs a full typecheck) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run db:types` | Regenerate `src/lib/core/supabase/types.ts` from the linked project |

### First run on a fresh database

1. Apply everything in `supabase/migrations/` in order.
2. Run `supabase/scripts/bootstrap-admin.sql` in the Supabase SQL editor to mint
   the first admin. **This is required** — see [Roles](#roles-and-rls) below.
3. Sign up through the app, then promote yourself with that script.

---

## The core loop

Everything else is scaffolding around this:

```
scout creates a player  →  writes a report  →  publishes it
                                                    ↓
                        public player profile  ←  aggregated ratings
                                    ↓
                            public report page
```

- `/scout` — the scout workspace: player picker, your players, draft and
  published reports
- `/scout/players/new`, `/scout/players/[id]/edit` — create/edit a player;
  publishing is what puts them on the public roster
- `/scout/reports/new`, `/scout/reports/[id]/edit` — the report form
- `/players`, `/players/[slug]` — public roster and profile
- `/players/[slug]/reports/[reportId]` — a published report

A player must be **published** to appear publicly. A report must be **published**
to count toward the ratings shown on the profile. Drafts stay visible to their
author (and admins) and render with a draft banner rather than a 404.

---

## Report structure

Reports follow `docs/professional-football-scouting-report-template.pdf`.

- **§2 Match context** — fixture, date, competition, role observed, minutes,
  live/video/mixed
- **§3–6 Ratings** — 1–5 across four categories (technical, tactical, physical,
  mentality), each with sub-areas plus an `overall`. The sub-area keys live in
  `src/lib/shared/constants.ts` and are the contract between the form, the
  database and the profile page.
- **§7–8** — strengths and improvements as bullet arrays, projection, role fit
- **§9** — recruitment decision (`sign_now` / `monitor` / `pass` / `revisit`) and
  recommended level
- **§10** — free-text scout notes

The profile page averages the `overall` of each category across every published
report. It reads `scout_report_ratings` directly rather than the
`player_category_ratings` materialized view, so the numbers can't go stale
between refreshes; the view is still refreshed on publish for anything else that
reads it.

---

## Roles and RLS

Three roles: `user` → `scout` → `admin`. Row-level security is on for every
table and gates writes through `public.current_app_role()`.

That function prefers the `app_role` JWT claim (populated by the
`custom_access_token_hook`, which must be enabled under **Auth → Hooks**) and
falls back to reading `profiles.role` directly, so authorization works whether or
not the dashboard hook is switched on.

**Role changes** are guarded by `prevent_role_self_escalation()`. Ordinary
signed-in users can never change a role. Privileged connections — `postgres`
(SQL editor, CLI) and `service_role` (server code using
`SUPABASE_SERVICE_ROLE_KEY`) — are allowed through, which is what makes
bootstrapping an admin possible at all.

| | user | scout | admin |
| --- | --- | --- | --- |
| Browse published players/reports | ✅ | ✅ | ✅ |
| Watchlists, private notes | ✅ | ✅ | ✅ |
| Create/edit players, publish reports | — | ✅ | ✅ |
| Edit anyone's rows, change roles | — | — | ✅ |

---

## Layout

```
src/
  app/
    (marketing)/     landing, about, legal      — no auth
    (public)/        the app; dark shell (nav + footer)
    teams/[slug]/    team pages; own sidebar shell
    auth/, api/
  components/
    features/        domain UI (players, reports, teams, dashboard)
    shared/          nav, layout primitives
    ui/              shadcn primitives
  lib/
    core/            supabase clients, auth helpers
    features/        queries + server actions, one folder per domain
    shared/          constants, zod schemas, route registry
supabase/
  migrations/        ordered SQL, 0001 → 0010
  scripts/           one-off operational SQL
```

`src/proxy.ts` is the Next 16 middleware (renamed from `middleware.ts`). It
refreshes the Supabase session and gates `PROTECTED_PREFIXES` on whole path
segments — a prefix match would make `/scout` also capture `/scouting`.

---

## What isn't built yet

The navigation and dashboard describe a wider product than exists: predictions,
FPL sub-tools, per-league pages, player compare, fixtures. Those routes have no
page, so **`src/lib/shared/routes.ts` is the single source of truth** for what's
live. `isLiveRoute()` drives the disabled "Soon" state in the nav and on
dashboard cards, so an unbuilt feature is never a 404.

When you ship one of them: add the path to `LIVE_ROUTES` and it starts linking.
Nothing else needs to change.

Some data is still mock — `src/lib/features/teams/mock.ts` (team pages) and
`src/lib/features/players/rich-mock.ts` (one demo profile). Global search hits
the live ESPN endpoint, and `espn-*` slugs render an ESPN-backed profile.

---

## Theme

Pinned to dark (`forcedTheme="dark"` in `src/app/layout.tsx`). The marketing
site, player profiles and scout workspace all paint their own dark surfaces, so
following the OS preference put light-theme tokens inside hardcoded dark shells
and made shared components unreadable. Remove the pin once a real light palette
exists.
