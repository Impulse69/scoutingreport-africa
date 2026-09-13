-- Section-level notes, to match the scouting report template.
--
-- `docs/professional-football-scouting-report-template.pdf` gives each
-- evaluation section (§3 Technical, §4 Tactical, §5 Physical, §6 Mentality) a
-- table of sub-area ratings PLUS a single free-text "Notes" box for the section
-- as a whole, and does the same for §8 Areas for Improvement / Risks.
--
-- We stored ratings faithfully (scout_report_ratings, one row per sub-area) but
-- had nowhere to put the section notes. The form compensated by putting a note
-- input on every individual sub-area row — 24 boxes where the template asks for
-- four — which is both heavier to fill in and not what the template specifies.
--
-- `scout_report_ratings.notes` is kept: it is a finer-grained superset and
-- costs nothing to leave in place.

alter table public.scout_reports
  add column if not exists technical_notes    text,
  add column if not exists tactical_notes     text,
  add column if not exists physical_notes     text,
  add column if not exists mentality_notes    text,
  add column if not exists improvements_notes text;

comment on column public.scout_reports.technical_notes is
  'Template §3 Technical Evaluation — section Notes box.';
comment on column public.scout_reports.tactical_notes is
  'Template §4 Tactical Understanding — section Notes box.';
comment on column public.scout_reports.physical_notes is
  'Template §5 Physical Profile — section Notes box.';
comment on column public.scout_reports.mentality_notes is
  'Template §6 Mentality & Character — section Notes box.';
comment on column public.scout_reports.improvements_notes is
  'Template §8 Areas for Improvement / Risks — section Notes box.';
