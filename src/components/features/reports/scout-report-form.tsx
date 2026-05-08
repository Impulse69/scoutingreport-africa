"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  Send,
  Plus,
  X,
  Star,
  ScrollText,
  AlertTriangle,
  Sparkles,
  Activity,
  CalendarDays,
  Clock,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RATING_CATEGORIES,
  RATING_CATEGORY_LABELS,
  RATING_SUB_AREAS_BY_CATEGORY,
  OBSERVATION_TYPES,
  RECRUITMENT_DECISIONS,
  RECOMMENDED_LEVELS,
  POSITION_CODES,
  type RatingCategory,
  type RecruitmentDecision,
  type RecommendedLevel,
  type ObservationType,
} from "@/lib/shared/constants";
import { saveScoutReport } from "@/lib/features/reports/actions";

// ─── Types ───────────────────────────────────────────────────────

type Bullet = { text: string };
type RatingState = {
  category: RatingCategory;
  sub_area: string;
  rating: number;
  notes: string;
};

export type FormInitialState = {
  reportId?: string;
  player_id: string;
  match_description?: string | null;
  match_date?: string | null;
  role_observed_code?: string | null;
  minutes_observed?: number | null;
  observation_type?: ObservationType;
  ratings?: RatingState[];
  strengths?: Bullet[];
  improvements?: Bullet[];
  projection?: string | null;
  role_fit?: string | null;
  recruitment_decision?: RecruitmentDecision | null;
  recommended_level?: RecommendedLevel | null;
  recommendation_notes?: string | null;
  scout_notes?: string | null;
};

type Props = {
  initial: FormInitialState;
  playerLabel: string;
};

// ─── Helpers ─────────────────────────────────────────────────────

function blankRatings(): RatingState[] {
  const out: RatingState[] = [];
  for (const cat of RATING_CATEGORIES) {
    for (const sub of RATING_SUB_AREAS_BY_CATEGORY[cat]) {
      out.push({ category: cat, sub_area: sub.key, rating: 0, notes: "" });
    }
  }
  return out;
}

function mergeRatings(initial: RatingState[] | undefined): RatingState[] {
  const blank = blankRatings();
  if (!initial?.length) return blank;
  return blank.map((b) => {
    const found = initial.find(
      (r) => r.category === b.category && r.sub_area === b.sub_area,
    );
    return found ? { ...b, rating: found.rating, notes: found.notes ?? "" } : b;
  });
}

// ─── Component ───────────────────────────────────────────────────

export function ScoutReportForm({ initial, playerLabel }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();

  // Flat state for the whole form.
  const [matchDesc, setMatchDesc] = useState(initial.match_description ?? "");
  const [matchDate, setMatchDate] = useState(initial.match_date ?? "");
  const [role, setRole] = useState<string>(initial.role_observed_code ?? "");
  const [minutes, setMinutes] = useState<string>(
    initial.minutes_observed != null ? String(initial.minutes_observed) : "",
  );
  const [obsType, setObsType] = useState<ObservationType>(
    initial.observation_type ?? "live",
  );

  const [ratings, setRatings] = useState<RatingState[]>(
    mergeRatings(initial.ratings),
  );
  const [strengths, setStrengths] = useState<Bullet[]>(
    initial.strengths?.length ? initial.strengths : [],
  );
  const [improvements, setImprovements] = useState<Bullet[]>(
    initial.improvements?.length ? initial.improvements : [],
  );
  const [projection, setProjection] = useState(initial.projection ?? "");
  const [roleFit, setRoleFit] = useState(initial.role_fit ?? "");

  const [decision, setDecision] = useState<string>(
    initial.recruitment_decision ?? "",
  );
  const [level, setLevel] = useState<string>(initial.recommended_level ?? "");
  const [decisionNotes, setDecisionNotes] = useState(
    initial.recommendation_notes ?? "",
  );

  const [scoutNotes, setScoutNotes] = useState(initial.scout_notes ?? "");

  // ─── Mutations ───────────────────────────────────────────────

  const setRating = (idx: number, rating: number) =>
    setRatings((prev) => prev.map((r, i) => (i === idx ? { ...r, rating } : r)));

  const setRatingNotes = (idx: number, notes: string) =>
    setRatings((prev) => prev.map((r, i) => (i === idx ? { ...r, notes } : r)));

  const addBullet = (which: "s" | "i") =>
    (which === "s" ? setStrengths : setImprovements)((prev) =>
      prev.length >= 6 ? prev : [...prev, { text: "" }],
    );

  const updateBullet = (
    which: "s" | "i",
    idx: number,
    text: string,
  ): void => {
    const setter = which === "s" ? setStrengths : setImprovements;
    setter((prev) => prev.map((b, i) => (i === idx ? { text } : b)));
  };

  const removeBullet = (which: "s" | "i", idx: number) =>
    (which === "s" ? setStrengths : setImprovements)((prev) =>
      prev.filter((_, i) => i !== idx),
    );

  // ─── Submit ──────────────────────────────────────────────────

  const submit = (status: "draft" | "published") =>
    start(async () => {
      // Filter out blank ratings (rating === 0) — they're not required.
      const cleanedRatings = ratings
        .filter((r) => r.rating > 0)
        .map((r) => ({
          category: r.category,
          sub_area: r.sub_area,
          rating: r.rating,
          notes: r.notes.trim() || null,
        }));

      const payload = {
        player_id: initial.player_id,
        status,
        match_description: matchDesc.trim() || null,
        match_date: matchDate || null,
        competition_id: null,
        role_observed_code: role || null,
        minutes_observed: minutes ? Number.parseInt(minutes, 10) : null,
        observation_type: obsType,
        ratings: cleanedRatings,
        strengths: strengths
          .map((b) => ({ text: b.text.trim() }))
          .filter((b) => b.text.length > 0),
        improvements: improvements
          .map((b) => ({ text: b.text.trim() }))
          .filter((b) => b.text.length > 0),
        projection: projection.trim() || null,
        role_fit: roleFit.trim() || null,
        recruitment_decision: (decision || null) as RecruitmentDecision | null,
        recommended_level: (level || null) as RecommendedLevel | null,
        recommendation_notes: decisionNotes.trim() || null,
        scout_notes: scoutNotes.trim() || null,
      };

      const res = await saveScoutReport(payload, initial.reportId);
      if ("error" in res) {
        toast.error(res.error);
        return;
      }
      toast.success(status === "published" ? "Report published" : "Draft saved");
      // Redirect to edit page so subsequent saves update the same report.
      if (!initial.reportId) {
        router.replace(`/scout/reports/${res.id}/edit`);
      }
      router.refresh();
    });

  // ─── Render ──────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="rounded-xl border border-white/5 bg-[#0E0E0E] px-6 py-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-orange-500">
          Subject
        </p>
        <p className="mt-1 font-mono text-lg font-bold text-white">{playerLabel}</p>
      </header>

      {/* §2 Match Context */}
      <Section
        icon={CalendarDays}
        title="Match context"
        subtitle="Where did you watch the player?"
      >
        <Field label="Match description" full>
          <Input
            value={matchDesc}
            onChange={(e) => setMatchDesc(e.target.value)}
            placeholder="e.g. CHAN qualifier vs Tunisia"
          />
        </Field>
        <Field label="Match date">
          <Input
            type="date"
            value={matchDate}
            onChange={(e) => setMatchDate(e.target.value)}
          />
        </Field>
        <Field label="Minutes observed">
          <Input
            type="number"
            min={0}
            max={150}
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            placeholder="90"
          />
        </Field>
        <Field label="Role observed">
          <Select value={role || undefined} onValueChange={(v) => setRole(v ?? "")}>
            <SelectTrigger>
              <SelectValue placeholder="Position" />
            </SelectTrigger>
            <SelectContent>
              {POSITION_CODES.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Observation type">
          <Select
            value={obsType}
            onValueChange={(v) => setObsType((v ?? "live") as ObservationType)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {OBSERVATION_TYPES.map((o) => (
                <SelectItem key={o} value={o} className="capitalize">
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </Section>

      {/* §3-§6 Ratings */}
      {RATING_CATEGORIES.map((cat) => (
        <Section
          key={cat}
          icon={Activity}
          title={RATING_CATEGORY_LABELS[cat]}
          subtitle="Rate each area 1–5. Skip what you didn't observe."
        >
          <div className="md:col-span-2 space-y-4">
            {RATING_SUB_AREAS_BY_CATEGORY[cat].map((sub) => {
              const idx = ratings.findIndex(
                (r) => r.category === cat && r.sub_area === sub.key,
              );
              const r = ratings[idx];
              const isOverall = sub.key === "overall";
              return (
                <div
                  key={sub.key}
                  className={`rounded-lg border ${
                    isOverall
                      ? "border-orange-500/30 bg-orange-500/5"
                      : "border-white/5 bg-[#0B0B0B]"
                  } p-3`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-mono text-xs font-medium text-white">
                      {sub.label}
                      {isOverall ? (
                        <span className="ml-1.5 rounded border border-orange-500/40 bg-orange-500/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-orange-300">
                          required
                        </span>
                      ) : null}
                    </p>
                    <StarPicker
                      value={r?.rating ?? 0}
                      onChange={(v) => setRating(idx, v)}
                    />
                  </div>
                  <Textarea
                    rows={2}
                    value={r?.notes ?? ""}
                    onChange={(e) => setRatingNotes(idx, e.target.value)}
                    placeholder="Notes (optional) — what stood out?"
                    className="mt-2 text-xs"
                  />
                </div>
              );
            })}
          </div>
        </Section>
      ))}

      {/* §7 Strengths */}
      <Section
        icon={Sparkles}
        title="Key strengths"
        subtitle="2–4 bullets — what does the player do well?"
      >
        <BulletEditor
          items={strengths}
          onAdd={() => addBullet("s")}
          onRemove={(i) => removeBullet("s", i)}
          onChange={(i, t) => updateBullet("s", i, t)}
          placeholder="e.g. Reads transitions early — anticipates loose balls"
        />
      </Section>

      {/* §8 Improvements & Risks */}
      <Section
        icon={AlertTriangle}
        title="Improvements & risks"
        subtitle="Where they need to grow + flagged concerns."
      >
        <BulletEditor
          items={improvements}
          onAdd={() => addBullet("i")}
          onRemove={(i) => removeBullet("i", i)}
          onChange={(i, t) => updateBullet("i", i, t)}
          placeholder="e.g. Tendency to over-commit on the front foot"
        />
        <Field label="Projection (12–24 months)" full>
          <Textarea
            rows={3}
            value={projection}
            onChange={(e) => setProjection(e.target.value)}
            placeholder="Realistic ceiling and the path to get there."
          />
        </Field>
        <Field label="Role fit" full>
          <Textarea
            rows={2}
            value={roleFit}
            onChange={(e) => setRoleFit(e.target.value)}
            placeholder="Best system / role / club archetype."
          />
        </Field>
      </Section>

      {/* §9 Final Recommendation */}
      <Section
        icon={ScrollText}
        title="Final recommendation"
        subtitle="Decision the front office can act on."
      >
        <Field label="Recruitment decision">
          <Select
            value={decision || undefined}
            onValueChange={(v) => setDecision(v ?? "")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select…" />
            </SelectTrigger>
            <SelectContent>
              {RECRUITMENT_DECISIONS.map((d) => (
                <SelectItem key={d} value={d} className="capitalize">
                  {d.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Recommended level">
          <Select
            value={level || undefined}
            onValueChange={(v) => setLevel(v ?? "")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select…" />
            </SelectTrigger>
            <SelectContent>
              {RECOMMENDED_LEVELS.map((l) => (
                <SelectItem key={l} value={l} className="capitalize">
                  {l.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Recommendation notes" full>
          <Textarea
            rows={4}
            value={decisionNotes}
            onChange={(e) => setDecisionNotes(e.target.value)}
            placeholder="Reasoning behind the verdict."
          />
        </Field>
      </Section>

      {/* §10 Scout Notes */}
      <Section
        icon={MapPin}
        title="Scout notes"
        subtitle="Free-form observations for the public report."
      >
        <Field label="Notes" full>
          <Textarea
            rows={6}
            value={scoutNotes}
            onChange={(e) => setScoutNotes(e.target.value)}
            placeholder="Anything else worth noting — context, comparisons, follow-ups…"
          />
        </Field>
      </Section>

      {/* Action bar */}
      <div className="sticky bottom-4 z-30 flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-[#0E0E0E]/95 px-4 py-3 shadow-2xl backdrop-blur">
        <p className="font-mono text-[11px] text-zinc-500">
          {initial.reportId ? "Editing existing report" : "New report"}
        </p>
        <div className="flex-1" />
        <Button
          type="button"
          variant="outline"
          disabled={pending}
          onClick={() => submit("draft")}
        >
          <Save className="mr-1.5 h-3.5 w-3.5" />
          Save draft
        </Button>
        <Button
          type="button"
          disabled={pending}
          onClick={() => submit("published")}
          className="bg-orange-600 hover:bg-orange-700"
        >
          <Send className="mr-1.5 h-3.5 w-3.5" />
          Publish
        </Button>
      </div>
    </div>
  );
}

// ─── Subcomponents ───────────────────────────────────────────────

function Section({
  title,
  subtitle,
  children,
  icon: Icon,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <section className="rounded-xl border border-white/5 bg-[#0E0E0E]">
      <header className="border-b border-white/5 px-6 py-4">
        <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-orange-500">
          {Icon ? <Icon className="h-3 w-3" /> : null}
          {title}
        </p>
        {subtitle ? (
          <p className="mt-1 font-mono text-[11px] text-zinc-500">{subtitle}</p>
        ) : null}
      </header>
      <div className="grid gap-4 px-6 py-5 md:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-zinc-500">
        {label}
      </label>
      {children}
    </div>
  );
}

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(value === n ? 0 : n)}
          className="rounded p-1 transition-colors hover:bg-white/5"
          aria-label={`Rate ${n}`}
        >
          <Star
            className={`h-4 w-4 transition-colors ${
              n <= value
                ? "fill-orange-500 text-orange-500"
                : "fill-transparent text-zinc-700 hover:text-zinc-500"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function BulletEditor({
  items,
  onAdd,
  onRemove,
  onChange,
  placeholder,
}: {
  items: Bullet[];
  onAdd: () => void;
  onRemove: (i: number) => void;
  onChange: (i: number, t: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="md:col-span-2 space-y-2">
      {items.length === 0 ? (
        <p className="rounded-md border border-dashed border-white/10 bg-[#0B0B0B] p-3 text-center font-mono text-[11px] text-zinc-500">
          No bullets yet — add up to 6.
        </p>
      ) : null}
      {items.map((b, i) => (
        <div key={i} className="flex items-start gap-2">
          <span className="mt-2.5 font-mono text-[10px] tabular-nums text-zinc-500">
            {i + 1}.
          </span>
          <Textarea
            rows={1}
            value={b.text}
            onChange={(e) => onChange(i, e.target.value)}
            placeholder={placeholder}
            className="min-h-9 flex-1 text-xs"
          />
          <button
            type="button"
            onClick={() => onRemove(i)}
            className="mt-1.5 rounded p-1 text-zinc-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
            aria-label="Remove"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onAdd}
        disabled={items.length >= 6}
      >
        <Plus className="mr-1 h-3 w-3" />
        Add bullet
      </Button>
    </div>
  );
}
