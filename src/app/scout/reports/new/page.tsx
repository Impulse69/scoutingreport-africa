"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/shared/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

import {
  GlassCard,
  GlassField,
  FieldLabel,
  RatingRow,
  Pills,
  StepFrame,
  ProgressRail,
} from "@/components/features/reports/forms/scout-report-ui";

import { saveScoutReport } from "@/lib/features/reports/actions";
import { searchPlayers } from "@/lib/features/players/actions";

// ─── Data Constants ───────────────────────────────────────────────
const STEPS = [
  { id: "context",   n: "01", label: "Match context",  hint: "Fixture · minutes · conditions" },
  { id: "technical", n: "02", label: "Technical",      hint: "On-ball skills" },
  { id: "tactical",  n: "03", label: "Tactical",       hint: "Positional sense & decisions" },
  { id: "physical",  n: "04", label: "Physical",       hint: "Athleticism & endurance" },
  { id: "mental",    n: "05", label: "Mentality",      hint: "Drive, focus, leadership" },
  { id: "strengths", n: "06", label: "Strengths",      hint: "What makes them stand out" },
  { id: "risks",     n: "07", label: "Risks",          hint: "Gaps, concerns, flags" },
  { id: "recommend", n: "08", label: "Recommendation", hint: "Verdict & next actions" },
] as const;

const POSITIONS = ["GK","CB","LB","RB","LWB","RWB","DM","CM","AM","LM","RM","LW","RW","SS","ST"] as const;
const TECHNICAL = ["First touch","Passing — short","Passing — long","Ball striking","Dribbling","1v1 attacking","1v1 defending","Aerial duels","Crossing","Finishing"];
const TACTICAL  = ["Positioning","Off-ball movement","Pressing triggers","Defensive shape","Build-up role","Decision-making","Game reading","Set pieces"];
const PHYSICAL  = ["Top speed","Acceleration","Stamina","Strength","Agility","Recovery","Balance"];
const MENTAL    = ["Composure","Leadership","Work rate","Coachability","Resilience","Communication"];
const STRENGTH_TAGS = ["Line-breaking passer","Elite press-resistance","Two-footed","Aerial dominance","Explosive first step","Relentless runner","Calm under pressure","Natural leader","Set-piece weapon","Clinical in the box","Reads the game","Versatile"];
const RISK_TAGS     = ["Injury history","Inconsistent minutes","Tactical discipline","Left-foot only","Needs physical dev","Temperament","Weak aerial","Slow transitions","Poor pressing","Decision-making","Limited to one role","Work permit"];
const VERDICTS = [
  { id: "sign_now",    label: "Sign now",      sub: "First-team ready" },
  { id: "monitor",     label: "Buy & develop", sub: "12–18 month project" },
  { id: "revisit",     label: "Keep watching", sub: "Revisit next window" },
  { id: "pass",        label: "Pass",          sub: "Not a fit" },
] as const;

type Ratings = Record<string, number>;
type ReportData = {
  player_id?: string;
  playerName?: string;
  fixture?: string; 
  competition?: string; 
  date?: string; 
  venue?: string;
  position?: string; 
  minutes?: number;
  weather?: string; 
  pitch?: string; 
  setting?: string;
  technical?: Ratings; 
  tactical?: Ratings; 
  physical?: Ratings; 
  mental?: Ratings;
  technical_note?: string; 
  tactical_note?: string; 
  physical_note?: string; 
  mental_note?: string;
  height?: string; 
  weight?: string;
  strengthTags?: string[]; 
  riskTags?: string[];
  strengthsNote?: string; 
  risksNote?: string;
  comparable?: string; 
  moment?: string;
  risk_development?: number; 
  risk_injury?: number; 
  risk_attitude?: number; 
  risk_logistics?: number;
  verdict?: string; 
  summary?: string; 
  confidence?: number; 
  revisit?: string; 
  fee?: string;
  agree?: boolean;
};

const INITIAL: ReportData = {
  minutes: 90, 
  confidence: 70,
  technical: {}, 
  tactical: {}, 
  physical: {}, 
  mental: {},
  strengthTags: [], 
  riskTags: [],
};

// ─── Main Component ───────────────────────────────────────────────

export default function NewReportPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<ReportData>(INITIAL);
  const set = (patch: Partial<ReportData>) => setData((d) => ({ ...d, ...patch }));

  // Load draft
  useEffect(() => {
    const s = localStorage.getItem("scout_wizard_step");
    if (s !== null) setStep(+s);
    const d = localStorage.getItem("scout_report_draft");
    if (d !== null) setData(JSON.parse(d));
  }, []);

  // Persist draft
  useEffect(() => {
    localStorage.setItem("scout_wizard_step", String(step));
    localStorage.setItem("scout_report_draft", JSON.stringify(data));
  }, [step, data]);

  const handleSubmit = async () => {
    if (!data.agree || !data.verdict || !data.player_id) {
      toast.error("Missing information", {
        description: "Please select a player and sign off before submitting.",
      });
      return;
    }

    if (!data.player_id) {
      toast.error("Please select a player first");
      return;
    }

    setIsSubmitting(true);
    const result = await saveScoutReport({ ...data, player_id: data.player_id });
    setIsSubmitting(false);

    if ("ok" in result && result.ok) {
      localStorage.removeItem("scout_report_draft");
      localStorage.removeItem("scout_wizard_step");
      toast.success("Report Published", { description: "The scout report is now live." });
      router.push(`/players/${data.player_id}`);
    } else {
      toast.error("Error", { description: "error" in result ? result.error : "Failed to save report" });
    }
  };

  const current = STEPS[step];

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] bg-stone-50/50">
      {/* No Decorative Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-stone-50" />

      <div className="relative z-10 mx-auto max-w-[1200px] px-4 pb-32 pt-6">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-stone-400">
          <span>Scout</span>
          <span className="opacity-40">/</span>
          <span>Reports</span>
          <span className="opacity-40">/</span>
          <span className="text-orange-700 font-medium">New</span>
        </div>

        {/* Title Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-[42px] font-bold leading-[1.02] tracking-tight text-stone-900">
              New Scout Report
            </h1>
            <div className="flex items-center gap-3 text-[13px] text-stone-500">
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-medium">
                Draft
              </span>
              <span className="h-1 w-1 rounded-full bg-stone-300" />
              <span className="font-mono text-[11px] opacity-70">AUTO-GEN-ID</span>
              <span className="h-1 w-1 rounded-full bg-stone-300" />
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-600" />
                <span className="text-[12px]">Changes saved locally</span>
              </div>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="ghost" size="sm" className="text-stone-500 hover:text-stone-900">Cancel</Button>
            <Button variant="outline" size="sm">Preview PDF</Button>
          </div>
        </div>

        {/* Navigation Rail */}
        <div className="mb-10">
          <GlassCard className="p-6">
            <ProgressRail stepIndex={step} steps={STEPS} onJump={setStep} />
          </GlassCard>
        </div>

        {/* Content Wizard */}
        <div key={step} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          {step === 0 && <StepContext data={data} set={set} />}
          {(step >= 1 && step <= 4) && (
            <RatingScreen 
              stepNum={current.n} 
              count={step + 1} 
              total={STEPS.length}
              title={current.label} 
              hint={current.hint} 
              items={
                step === 1 ? TECHNICAL : 
                step === 2 ? TACTICAL : 
                step === 3 ? PHYSICAL : MENTAL
              } 
              dataKey={step === 4 ? "mental" : current.id as any} 
              data={data} 
              set={set} 
              extra={step === 3 ? <PhysicalExtras data={data} set={set} /> : null}
            />
          )}
          {step === 5 && <StepStrengths data={data} set={set} />}
          {step === 6 && <StepRisks data={data} set={set} />}
          {step === 7 && <StepRecommend data={data} set={set} isSubmitting={isSubmitting} onSubmit={handleSubmit} />}
        </div>
      </div>

      {/* Persistent Footer Nav */}
      <footer className="fixed inset-x-0 bottom-0 z-30 border-t border-stone-200/60 bg-white/80 backdrop-blur-2xl">
        <div className="mx-auto flex h-[80px] max-w-[1200px] items-center gap-4 px-4">
          <div className="flex flex-col">
            <span className="font-mono text-[10px] uppercase tracking-wider text-orange-700 font-bold">Section {current.n}</span>
            <span className="text-[14px] font-semibold text-stone-900">{current.label}</span>
          </div>
          <div className="hidden lg:block h-8 w-px bg-stone-200 mx-4" />
          <p className="hidden flex-1 text-[13px] text-stone-500 lg:block truncate">{current.hint}</p>
          <div className="flex-1 lg:hidden" />
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="rounded-full px-6" 
              disabled={step === 0} 
              onClick={() => setStep(step - 1)}
            >
              Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button
                className="rounded-none px-8 font-bold bg-stone-900 hover:bg-stone-800 text-white"
                onClick={() => setStep(step + 1)}
              >
                Continue
              </Button>
            ) : (
              <Button
                disabled={!data.agree || !data.verdict || isSubmitting}
                onClick={handleSubmit}
                className="rounded-full px-8 bg-black hover:bg-stone-800 text-white shadow-lg shadow-black/20"
              >
                {isSubmitting ? "Publishing..." : "Submit Report"}
              </Button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Step Components ──────────────────────────────────────────────

function StepContext({ data, set }: { data: ReportData; set: (p: Partial<ReportData>) => void }) {
  const [players, setPlayers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPlayers = async () => {
      if (search.length < 2) return;
      const results = await searchPlayers(search);
      setPlayers(results || []);
    };
    const t = setTimeout(fetchPlayers, 300);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <StepFrame stepNum="01" count={1} totalSteps={STEPS.length} title="Match context" hint="Where and when did you watch the player?">
      <GlassCard className="p-7">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <div className="col-span-1 md:col-span-2 space-y-2">
            <FieldLabel hint="Search existing player database">Player Identity</FieldLabel>
            <div className="relative">
              <GlassField className="flex items-center gap-3 p-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-none border-2 border-orange-500/30 bg-orange-100 text-sm font-semibold text-orange-800">
                  {data.playerName ? data.playerName.slice(0, 2).toUpperCase() : "?"}
                </div>
                <div className="flex-1">
                  <Input
                    value={data.playerName || search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      if (data.playerName) set({ playerName: "", player_id: "" });
                    }}
                    placeholder="Search player name..."
                    className="border-0 bg-transparent text-[16px] focus-visible:ring-0 p-0 h-auto"
                  />
                  <div className="text-[11px] text-stone-400 mt-1">
                    {data.player_id ? `✓ Linked to ID: ${data.player_id.slice(0, 8)}` : "Select a player from the list below"}
                  </div>
                </div>
              </GlassField>

              {!data.player_id && search.length >= 2 && players.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 z-50 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-2xl">
                  {players.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        set({ player_id: p.id, playerName: p.full_name });
                        setSearch("");
                      }}
                      className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-stone-50 transition-colors"
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-stone-900">{p.full_name}</span>
                        <span className="font-mono text-[11px] text-stone-400 uppercase">{p.nationality_code} · {p.primary_position_code}</span>
                      </div>
                      <span className="text-orange-600 font-medium text-xs">Select</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <FieldLabel>Fixture</FieldLabel>
            <GlassField><Input value={data.fixture ?? ""} onChange={(e) => set({ fixture: e.target.value })} placeholder="Home vs Away" className="border-0 bg-transparent focus-visible:ring-0" /></GlassField>
          </div>
          <div>
            <FieldLabel>Match date</FieldLabel>
            <GlassField><Input type="date" value={data.date ?? ""} onChange={(e) => set({ date: e.target.value })} className="border-0 bg-transparent font-mono focus-visible:ring-0" /></GlassField>
          </div>
          <div>
            <FieldLabel>Position observed</FieldLabel>
            <Pills options={POSITIONS} value={data.position} onChange={(v) => set({ position: v ?? undefined })} dense />
          </div>
          <div>
            <FieldLabel>Minutes watched</FieldLabel>
            <div className="pt-2">
              <div className="mb-2 flex items-baseline justify-between text-[11px] font-mono text-stone-400 uppercase">
                <span className="text-orange-700 font-bold">{data.minutes ?? 90}'</span>
                <span>Max 120'</span>
              </div>
              <Slider value={[data.minutes ?? 90]} onValueChange={(v: any) => set({ minutes: v[0] })} min={0} max={120} step={1} />
            </div>
          </div>

          <div className="col-span-1 md:col-span-2">
            <FieldLabel optional>Match Conditions</FieldLabel>
            <div className="flex flex-wrap gap-2">
              <Pills dense options={["Dry", "Rain", "Hot", "Wind"]} value={data.weather} onChange={(v) => set({ weather: v ?? undefined })} />
              <Pills dense options={["Good", "Poor", "Artificial"]} value={data.pitch} onChange={(v) => set({ pitch: v ?? undefined })} />
              <Pills dense options={["Live", "Video", "Training"]} value={data.setting} onChange={(v) => set({ setting: v ?? undefined })} />
            </div>
          </div>
        </div>
      </GlassCard>
    </StepFrame>
  );
}

function RatingScreen({
  stepNum, count, total, title, hint, items, dataKey, data, set, extra,
}: {
  stepNum: string; count: number; total: number; title: string; hint: string;
  items: string[]; dataKey: "technical" | "tactical" | "physical" | "mental";
  data: ReportData; set: (p: Partial<ReportData>) => void;
  extra?: React.ReactNode;
}) {
  const ratings = (data[dataKey] as Ratings | undefined) ?? {};
  const values = Object.values(ratings).filter(Boolean);
  const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  const noteKey = `${dataKey}_note` as keyof ReportData;

  return (
    <StepFrame stepNum={stepNum} count={count} totalSteps={total} title={title} hint={hint}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="col-span-1 lg:col-span-2 p-3">
          <div className="divide-y divide-stone-200/50">
            {items.map((name) => (
              <RatingRow
                key={name}
                label={name}
                value={ratings[name] ?? 10}
                onChange={(v) => set({ [dataKey]: { ...ratings, [name]: v } } as Partial<ReportData>)}
              />
            ))}
          </div>
        </GlassCard>

        <div className="space-y-6">
          <GlassCard className="p-6 bg-stone-900 border-stone-800 text-white rounded-none border-2 shadow-none">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400">Section Avg</div>
            <div className="flex items-baseline gap-2">
              <span className="text-[64px] font-bold leading-none tracking-tighter tabular-nums text-white">
                {avg ? avg.toFixed(1) : "—"}
              </span>
              <span className="font-mono text-sm font-bold text-stone-500">/ 20</span>
            </div>
            <div className="mt-6 h-1.5 overflow-hidden rounded-none bg-stone-800">
              <div
                className="h-full bg-orange-500 transition-all duration-700"
                style={{ width: `${(avg / 20) * 100}%` }}
              />
            </div>
            <p className="mt-3 text-[11px] text-stone-400 uppercase tracking-wider font-mono font-bold">
              {values.length} of {items.length} traits identified
            </p>
          </GlassCard>

          <GlassCard className="p-6">
            <FieldLabel optional>Scout's Observations</FieldLabel>
            <GlassField>
              <Textarea
                value={(data[noteKey] as string) ?? ""}
                onChange={(e) => set({ [noteKey]: e.target.value } as Partial<ReportData>)}
                placeholder={`Focus on specific ${title.toLowerCase()} moments...`}
                rows={6}
                className="resize-none border-0 bg-transparent focus-visible:ring-0 leading-relaxed text-[14px]"
              />
            </GlassField>
          </GlassCard>

          {extra}
        </div>
      </div>
    </StepFrame>
  );
}

function PhysicalExtras({ data, set }: { data: ReportData; set: any }) {
  return (
    <GlassCard className="p-6 space-y-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500">Physical Profile</div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className="block mb-1 font-mono text-[9px] uppercase text-stone-400">Height</span>
          <GlassField><Input value={data.height || ""} onChange={e => set({ height: e.target.value })} placeholder="185 cm" className="border-0 bg-transparent font-mono focus-visible:ring-0" /></GlassField>
        </div>
        <div>
          <span className="block mb-1 font-mono text-[9px] uppercase text-stone-400">Weight</span>
          <GlassField><Input value={data.weight || ""} onChange={e => set({ weight: e.target.value })} placeholder="78 kg" className="border-0 bg-transparent font-mono focus-visible:ring-0" /></GlassField>
        </div>
      </div>
    </GlassCard>
  );
}

function StepStrengths({ data, set }: { data: ReportData; set: any }) {
  return (
    <StepFrame stepNum="06" count={6} totalSteps={STEPS.length} title="Core Strengths" hint="What will get them signed? Highlight the elite attributes.">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="col-span-1 lg:col-span-2 p-7">
          <div className="space-y-8">
            <div>
              <FieldLabel hint={`${data.strengthTags?.length || 0} selected`}>Signature Qualities</FieldLabel>
              <Pills multi options={STRENGTH_TAGS} value={data.strengthTags || []} onChange={v => set({ strengthTags: v })} />
            </div>
            <div>
              <FieldLabel>Detailed narrative of strengths</FieldLabel>
              <GlassField>
                <Textarea
                  value={data.strengthsNote || ""}
                  onChange={e => set({ strengthsNote: e.target.value })}
                  placeholder="Describe the player's superpower. What separates them?"
                  rows={8}
                  className="resize-none border-0 bg-transparent leading-relaxed focus-visible:ring-0"
                />
              </GlassField>
            </div>
          </div>
        </GlassCard>
        <div className="space-y-6">
          <GlassCard className="p-6">
            <span className="block mb-3 font-mono text-[10px] uppercase tracking-widest text-stone-400">Best Comparable</span>
            <GlassField><Input value={data.comparable || ""} onChange={e => set({ comparable: e.target.value })} placeholder="e.g. Victor Osimhen" className="border-0 bg-transparent focus-visible:ring-0" /></GlassField>
          </GlassCard>
          <GlassCard className="p-6">
            <span className="block mb-3 font-mono text-[10px] uppercase tracking-widest text-stone-400">Standout Moment</span>
            <GlassField><Input value={data.moment || ""} onChange={e => set({ moment: e.target.value })} placeholder="67' sprint to clear..." className="border-0 bg-transparent focus-visible:ring-0" /></GlassField>
          </GlassCard>
        </div>
      </div>
    </StepFrame>
  );
}

function StepRisks({ data, set }: { data: ReportData; set: any }) {
  const risks = [
    { k: "risk_development", label: "Development Gap" },
    { k: "risk_injury",      label: "Injury History" },
    { k: "risk_attitude",    label: "Professionalism" },
    { k: "risk_logistics",   label: "Admin/Work Permit" },
  ] as const;

  return (
    <StepFrame stepNum="07" count={7} totalSteps={STEPS.length} title="Gaps & Concerns" hint="Transparent evaluation of weaknesses and risks.">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="col-span-1 lg:col-span-2 p-7">
          <div className="space-y-8">
            <div>
              <FieldLabel>Risk Indicators</FieldLabel>
              <Pills multi options={RISK_TAGS} value={data.riskTags || []} onChange={v => set({ riskTags: v })} />
            </div>
            <div>
              <FieldLabel>Justification of concerns</FieldLabel>
              <GlassField>
                <Textarea
                  value={data.risksNote || ""}
                  onChange={e => set({ risksNote: e.target.value })}
                  placeholder="Where do they struggle? What are the red flags?"
                  rows={8}
                  className="resize-none border-0 bg-transparent leading-relaxed focus-visible:ring-0"
                />
              </GlassField>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-6">
          <span className="block mb-4 font-mono text-[10px] uppercase tracking-widest text-stone-400">Severity Levels</span>
          <div className="space-y-6">
            {risks.map((r) => (
              <div key={r.k}>
                <div className="mb-2 flex items-baseline justify-between">
                  <span className="text-[13px] text-stone-700">{r.label}</span>
                  <span className="font-mono text-[11px] font-bold text-orange-700">{data[r.k] || 0}</span>
                </div>
                <Slider
                  value={[(data[r.k] as number) || 0]}
                  onValueChange={(v: any) => set({ [r.k]: v[0] } as any)}
                  min={0} max={5} step={1}
                />
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </StepFrame>
  );
}

function StepRecommend({ data, set, isSubmitting, onSubmit }: { data: ReportData; set: any; isSubmitting: boolean; onSubmit: () => void }) {
  return (
    <StepFrame stepNum="08" count={8} totalSteps={STEPS.length} title="Final Verdict" hint="Commit to a recommendation. What is the next step for this player?">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="col-span-1 lg:col-span-2 p-7">
          <div className="space-y-8">
            <div>
              <FieldLabel>Recruitment Verdict</FieldLabel>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {VERDICTS.map((v) => {
                  const sel = data.verdict === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => set({ verdict: v.id })}
                      className={cn(
                        "rounded-xl border p-4 text-left transition-all",
                        sel
                          ? "border-stone-900 bg-stone-900 text-white ring-2 ring-stone-900 ring-offset-2"
                          : "border-stone-200 text-stone-700 hover:border-orange-500 bg-white"
                      )}
                    >
                      <div className="mb-2 font-mono text-[9px] uppercase tracking-widest opacity-60">
                        {sel ? "✓ Selected" : "Select"}
                      </div>
                      <div className="text-[14px] font-bold">{v.label}</div>
                      <div className={cn("mt-1 text-[10px] leading-tight", sel ? "text-stone-300 opacity-80" : "text-stone-400")}>{v.sub}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <FieldLabel>Confidence Score</FieldLabel>
                <div className="pt-2 max-w-sm">
                  <div className="mb-2 font-mono text-[13px] font-bold text-orange-700">{data.confidence ?? 70}%</div>
                  <Slider value={[data.confidence ?? 70]} onValueChange={(v: any) => set({ confidence: v[0] })} min={0} max={100} step={5} />
                </div>
              </div>
              <div>
                <FieldLabel>Executive Summary</FieldLabel>
                <GlassField>
                  <Textarea
                    value={data.summary || ""}
                    onChange={e => set({ summary: e.target.value })}
                    placeholder="Provide a final summary for the sporting director..."
                    rows={8}
                    className="resize-none border-0 bg-transparent leading-relaxed focus-visible:ring-0 text-[15px]"
                  />
                </GlassField>
              </div>
            </div>
          </div>
        </GlassCard>

        <div className="space-y-6">
          <GlassCard className="p-6 bg-stone-900 text-white border-0 shadow-2xl">
            <span className="block mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-stone-500">Legal & Sign-off</span>
            <div className="text-[13px] leading-relaxed text-stone-300">
              By submitting this report, you confirm that the data provided is accurate according to your professional observation. Reports are timestamped and linked to your profile.
            </div>
            <label className="mt-6 flex cursor-pointer items-start gap-3 group">
              <Checkbox
                checked={data.agree ?? false}
                onCheckedChange={(v) => set({ agree: !!v })}
                className="mt-0.5 border-stone-700 data-[state=checked]:bg-stone-50"
              />
              <span className="text-[13px] text-stone-400 group-hover:text-white transition-colors">I stand by this independent assessment.</span>
            </label>
            <Button 
              className="w-full mt-6 rounded-none bg-stone-50 hover:bg-white text-stone-900 border-2 border-stone-50 h-12 font-bold disabled:opacity-30"
              disabled={!data.agree || !data.verdict || isSubmitting}
              onClick={onSubmit}
            >
              {isSubmitting ? "Publishing..." : "Publish Report"}
            </Button>
          </GlassCard>
        </div>
      </div>
    </StepFrame>
  );
}
