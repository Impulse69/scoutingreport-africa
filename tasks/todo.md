# Integrate current main into feature branch (2026-09-13)

## Plan

- [x] Fetch and inspect the exact branch divergence.
- [x] Simulate the merge and identify true conflict files.
- [ ] Preserve the updated repository workflow lesson and commit the plan.
- [ ] Merge `origin/main` into `feature/scouting-experience-refresh`.
- [ ] Resolve team conflicts around the newer Supabase-backed architecture.
- [ ] Resolve navigation/search conflicts while retaining both behavior sets.
- [ ] Review all automatic merges for semantic regressions.
- [ ] Run lint, typecheck, production build, and production-route smoke checks.
- [ ] Commit the resolution with the repository owner's identity and push normally.

## Review

Pending.

---

# Pre-production local-work review (2026-09-13)

## Plan

- [x] Inventory the full local diff and project instructions.
- [x] Run baseline lint, typecheck, and production build.
- [x] Review server/data/migration changes for correctness, authorization, and failure handling.
- [x] Review UI/navigation changes for behavioral regressions and accessibility issues.
- [x] Review the new football API/image pipeline for security, caching, and production safety.
- [x] Apply only evidence-backed, minimal fixes.
- [x] Re-run focused checks plus lint, typecheck, and production build.

## Review

- Real database counts now remain real at zero; mock profiles no longer enter
  published/verified listings.
- Admin report edits preserve the original author.
- Rating replacement now runs in one PostgreSQL transaction via migration 0012.
- Football diagnostics return 404 in production, upstream fetches have bounded
  timeouts, and player photos require an exact player-name match plus an allowed
  HTTPS host. Removed one wrong identity mapping.
- Restored mobile search, keyboard/touch league navigation, valid link markup,
  and the required visible focus treatment. Removed the remaining landing-page
  gradient and fixed the two React effect lint errors.
- Removed five unused untracked JPEGs (4.49 MB); retained the referenced match
  image.
- Verification: lint clean; TypeScript clean; production build clean; production
  smoke returned 200 for `/` and `/players`, and 404 for
  `/api/football-diagnostics`; `git diff --check` clean.
- Release order: apply migrations 0011 and 0012 before deploying this app code.

---

# Report form aligned to the scouting template

Source: `docs/professional-football-scouting-report-template.pdf` (an Excel sheet
printed to PDF; text extracted via its ToUnicode CMaps).

## What the template actually specifies

| § | Section | Fields |
| --- | --- | --- |
| 1 | Player Information | Name · Position(s) · DOB/Age · Preferred Foot · Nationality · Current Club · Competition/Level · Scout Name · Date of Report · Organisation |
| 2 | Match Context | Match Observed · Date · **Competition** · Minutes Observed · Role/Position · Observation Type |
| 3 | Technical Evaluation | 5 sub-areas + Overall, rated 1–5, **+ one Notes box** |
| 4 | Tactical Understanding | 5 sub-areas + Overall, 1–5, **+ Notes** |
| 5 | Physical Profile | 4 sub-areas + Overall, 1–5, **+ Notes** |
| 6 | Mentality & Character | 5 sub-areas + Overall, 1–5, **+ Notes** |
| 7 | Strengths | 2–4 bullet points |
| 8 | Areas for Improvement / Risks | bullets **+ Notes** |
| 9 | Final Recommendation | Recruitment Decision · Projection · Recommended Level · Role Fit |
| 10 | Scout Notes | free text |

The §3–§6 sub-area names in `src/lib/shared/constants.ts` already matched the
template exactly — that part was right.

## Gaps found and closed

- **Competition was never collected.** `scout_reports.competition_id` has
  existed since migration 0004 but no form field set it and no query fed a
  picker — a dead column. Added `listCompetitions()`, a select in §2, and the
  competition name now shows in the report header.
- **No section Notes.** The template gives §3–§6 and §8 one Notes box each; we
  had none. Migration `0011` adds `technical_notes`, `tactical_notes`,
  `physical_notes`, `mentality_notes`, `improvements_notes`.
- **24 note boxes instead of 4.** The form put a note input on every sub-area
  row. Replaced with one Notes box per section, per the template.
  `scout_report_ratings.notes` is retained — it is a finer-grained superset.
- **Projection and Role Fit were under §8.** The template puts both in §9 Final
  Recommendation. Moved.
- **§7 "2–4 bullets" wasn't enforced.** Publishing now requires at least 2
  strengths; drafts are unaffected.

## Not changed

§1 is not duplicated onto the report — name, positions, DOB, foot, nationality
and club live on the player record, and Scout Name / Date of Report come from
the report's author and timestamps. Organisation exists on `profiles` but is not
yet surfaced anywhere.

## Also fixed this pass

- **Navbar wrapped.** The brand had no `shrink-0`, so flex squeezed it to
  min-content and the wordmark broke across four lines. Brand and auth controls
  are now `shrink-0` + `whitespace-nowrap`; the nav links and search absorb the
  squeeze. Verified at 1600/1024/768/375 — 64px bar, one line, no overflow.
- **Dashboard "Published players" was capped at 6.** It rendered
  `spotlightPlayers.length`, the length of a display list limited to 6. Now uses
  the real count (7). Replaced the "Scout workspace: Available" tile with
  Published reports.
- **Report page typography.** It had been missed by the redesign and was still
  monospace throughout; converted to the sans scale.

## Verification

Typecheck and build clean. A temporary published report exercising every
template section rendered correctly end to end — all four section Notes, both
bullet lists, §8 notes, projection, role fit, decision, level, scout notes and
the competition name — then was removed.

## Still open

- `npm run lint`: 2 pre-existing errors (`react-hooks/set-state-in-effect`),
  ~30 unused-import warnings left by the Codex batches.
- 52 `font-mono` usages remain, mostly on numeric values, which the design spec
  permits. Worth a pass if you want them all on `tabular-nums` instead.
- Nothing is committed.
