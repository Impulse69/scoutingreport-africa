# ScoutingReport Africa — design system (light)

Single source of truth for the frontend redesign. Every screen must follow this.
If a rule here conflicts with existing code, this document wins.

## 1. Intent

This is a **professional recruitment-intelligence tool**, in the family of
Transfermarkt, Opta, StatsBomb and Bloomberg terminals-for-the-web. It is read
by scouts and sporting directors making money decisions.

It is **not** a crypto dashboard, a gaming UI, or a hype landing page. Restraint
reads as credibility. When in doubt: fewer borders, less colour, more whitespace,
real data.

## 2. Theme

**Light only.** There is no dark mode and no theme toggle.

- `forcedTheme="dark"` must be removed from `src/app/layout.tsx`.
- `next-themes` ThemeProvider may be removed entirely, along with any
  toggle UI. Do not add a new one.
- No `dark:` variants. No `.dark` class styling.

## 3. Colour

Defined once as CSS variables on `:root` in `src/app/globals.css`, consumed
through the existing shadcn token names. **Components must use semantic Tailwind
classes** (`bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`,
`border-border`, `bg-primary`, `text-primary`) — never raw hex.

| Token | Value | Use |
| --- | --- | --- |
| `--background` | `#FFFFFF` | page |
| `--card` | `#FFFFFF` | cards, panels |
| `--muted` | `#F8FAFC` | subtle fills, table header rows, inset blocks |
| `--foreground` | `#0F172A` | primary text |
| `--muted-foreground` | `#64748B` | secondary text, labels |
| `--border` | `#E2E8F0` | all borders, dividers |
| `--input` | `#CBD5E1` | form field borders |
| `--primary` | `#1D4ED8` | primary buttons, links, active nav, focus ring |
| `--primary-foreground` | `#FFFFFF` | text on primary |
| `--secondary` | `#F1F5F9` | secondary button fill |
| `--accent` | `#F1F5F9` | hover fill |
| `--destructive` | `#B91C1C` | destructive actions, errors |
| `--ring` | `#1D4ED8` | focus ring |
| `--radius` | `0.5rem` | |

Semantic data colours (charts, ratings, deltas) — use sparingly:

- positive `#15803D` · caution `#B45309` · negative `#B91C1C` · neutral `#64748B`
- rating bars: single hue, `--primary` at 100% for the filled portion on a
  `--muted` track. Do not colour-code the four rating categories differently.

Chart categorical ramp (only where more than one series exists):
`#1D4ED8`, `#0F766E`, `#B45309`, `#7C3AED`, `#475569`.

## 4. Typography

One family: **Inter** (already wired as `--font-inter`). Remove JetBrains Mono
from UI chrome; the mono variable may stay for genuinely numeric table columns,
but prefer Inter with `tabular-nums`.

| Role | Spec |
| --- | --- |
| Page title (h1) | `text-2xl md:text-3xl font-semibold tracking-tight` |
| Section heading (h2) | `text-base font-semibold` |
| Card title (h3) | `text-sm font-semibold` |
| Body | `text-sm leading-6` |
| Secondary / caption | `text-xs text-muted-foreground` |
| Stat number | `text-2xl font-semibold tabular-nums` |
| Table cell | `text-sm`, numerics `tabular-nums text-right` |

Rules:
- **Never `font-black`.** Maximum weight is `font-semibold`, `font-bold` only
  for a stat number that must dominate.
- **No all-caps headlines.** Sentence case for headings and body.
- Uppercase is allowed *only* for a small table column header or a short badge,
  at `text-[11px] font-medium tracking-wide` — not `tracking-widest`, and not
  as a decorative label on every section.
- No gradient text.

## 5. Banned effects

These were in the previous design and must not reappear anywhere:

- Coloured glow halos — `blur-[100px]`, `shadow-emerald-500/20`, any coloured
  `shadow-*/NN`, decorative radial blobs behind sections.
- Gradient backgrounds, gradient buttons, gradient progress bars,
  `bg-gradient-to-*` of any kind.
- `backdrop-blur` used decoratively.
- `animate-pulse`, pulsing "live" dots, blinking status indicators.
- Eyebrow status pills such as
  `● INDUSTRIAL FOOTBALL INTELLIGENCE · 54 CAF ASSOCIATIONS COVERED`.
  If a section needs a label, use a plain `h2`.
- Oversized rounded corners (`rounded-3xl`). Use `rounded-lg` (cards) or
  `rounded-md` (controls).
- Heavy shadows. Cards are defined by a **1px border**, not elevation.
  `shadow-sm` on hover at most; no `shadow-2xl`.
- Emoji as UI iconography (country flags in data cells are fine).

## 6. Layout

- Page container: `mx-auto w-full max-w-6xl px-6 py-8`. Wide data tables may use
  `max-w-7xl`.
- Vertical rhythm between major sections: `space-y-8`.
- Card: `rounded-lg border border-border bg-card`. Header
  `border-b border-border px-5 py-3.5`, body `p-5`.
- Tables: header row `bg-muted text-xs font-medium text-muted-foreground`,
  rows separated by `border-t border-border`, hover `bg-muted/60`. Numeric
  columns right-aligned and `tabular-nums`.
- Forms: label `text-sm font-medium`, 40px control height, helper text
  `text-xs text-muted-foreground`, errors in `--destructive`.
- Focus: visible `ring-2 ring-ring ring-offset-2` on every interactive element.

## 7. Copy

Plain, factual, professional. Strip invented-jargon branding:

- "Kinetic Archive Intelligence", "Live Telemetry Cockpit", "Command Hub",
  "Departmental Clearance", "Dossier #", "Industrial Football Intelligence",
  "Comparable Archetypes", "Verified Talent" → replace with plain equivalents
  ("Players", "Scout workspace", "Account", "Report", "Similar players").
- Nav labels should say what the page is: Players, Leagues, Watchlists, Scout,
  FPL, Dashboard.

**No invented statistics.** The landing page currently claims "2,400+ Scouted
Dossiers", "100% Human Verified" and "€180M+ Tracked Transfer Value". The
database holds 7 players and 0 published reports. Either render real counts from
the database, or remove the stat block. Never ship a fabricated number.

## 8. Behaviour that must not regress

The redesign is visual. These are load-bearing and must survive:

- `isLiveRoute()` / `PLANNED_LABEL` from `src/lib/shared/routes.ts` — unbuilt
  features render disabled, never as a link. Applies to nav and dashboard cards.
- `filterExistingPlayerSlugs()` gating in the player profile, team squad and
  standings — names without a page render as plain text, not links.
- `getTeamRefBySlug()` gating on the leagues page club chips.
- Every server action, query, prop contract and route must keep working.
  Do not change files under `src/lib/**` except for presentational constants.
- `npm run build` and `npx tsc --noEmit` must pass.
- No route may 404 from any rendered link.

## 9. Accessibility

- Body text contrast ≥ 4.5:1 (the palette above satisfies this).
- Never convey meaning by colour alone — pair with a label or icon.
- All icon-only buttons need `aria-label`.
- Keyboard focus visible everywhere.
