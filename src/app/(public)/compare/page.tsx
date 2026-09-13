import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftRight, BarChart3, ExternalLink, ShieldCheck, Users } from "lucide-react";
import {
  getPlayerProfile,
  listPublishedPlayers,
  type CategoryAverage,
  type PlayerProfile,
} from "@/lib/features/players/queries";
import {
  CAF_COUNTRIES,
  POSITIONS,
  RATING_CATEGORY_LABELS,
  RATING_CATEGORIES,
} from "@/lib/shared/constants";
import { EmptyState } from "@/components/shared/empty-state";

export const metadata: Metadata = {
  title: "Compare African Footballers · ScoutingReport Africa",
  description:
    "Compare published African football scouting dossiers and verified report ratings side by side.",
};

function first(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

function positionName(code: string | null): string {
  if (!code) return "Not recorded";
  return POSITIONS.find((position) => position.code === code)?.name ?? code;
}

function countryName(code: string | null): string {
  if (!code) return "Not recorded";
  return CAF_COUNTRIES.find((country) => country.code === code)?.name ?? code;
}

function ageOn(dateOfBirth: string | null): string {
  if (!dateOfBirth) return "Not recorded";
  const birth = new Date(`${dateOfBirth}T00:00:00Z`);
  if (Number.isNaN(birth.getTime())) return "Not recorded";

  const today = new Date();
  let age = today.getUTCFullYear() - birth.getUTCFullYear();
  const birthdayPending =
    today.getUTCMonth() < birth.getUTCMonth() ||
    (today.getUTCMonth() === birth.getUTCMonth() && today.getUTCDate() < birth.getUTCDate());
  if (birthdayPending) age -= 1;
  return `${age}`;
}

function profileValue(value: string | number | null, suffix = ""): string {
  return value === null || value === "" ? "Not recorded" : `${value}${suffix}`;
}

function ratingFor(player: PlayerProfile, category: CategoryAverage["category"]): CategoryAverage {
  return (
    player.ratings.find((rating) => rating.category === category) ?? {
      category,
      overall: null,
      subAreas: [],
    }
  );
}

function PlayerHeading({ player }: { player: PlayerProfile }) {
  const initials = player.fullName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="rounded-[6px] border border-[rgba(224,192,178,0.14)] bg-[#12151C] p-5">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#CC5500]/40 bg-[#CC5500]/15 font-['Public_Sans'] text-lg font-black text-[#FFB693]">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="truncate font-['Public_Sans'] text-lg font-black uppercase text-white">
            {player.fullName}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {positionName(player.primaryPositionCode)} · {countryName(player.nationalityCode)}
          </p>
          <Link
            href={`/players/${player.slug}`}
            className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#FFB693] hover:text-white"
          >
            Open dossier <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function ComparisonRow({
  label,
  left,
  right,
}: {
  label: string;
  left: string;
  right: string;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-[rgba(224,192,178,0.08)] px-4 py-3 last:border-b-0">
      <span className="text-sm font-semibold text-white">{left}</span>
      <span className="w-28 text-center font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
        {label}
      </span>
      <span className="text-right text-sm font-semibold text-white">{right}</span>
    </div>
  );
}

function RatingCell({
  rating,
  reportCount,
  align = "left",
}: {
  rating: CategoryAverage;
  reportCount: number;
  align?: "left" | "right";
}) {
  if (rating.overall === null) {
    return <span className="text-xs font-medium text-slate-500">Not rated</span>;
  }

  return (
    <div className={`space-y-1.5 ${align === "right" ? "text-right" : ""}`}>
      <div className={`flex items-baseline gap-1.5 ${align === "right" ? "justify-end" : ""}`}>
        <span className="font-mono text-xl font-black text-white">{rating.overall.toFixed(1)}</span>
        <span className="text-[10px] text-slate-500">/ 5</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[#0C0E12]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#9C3F00] to-[#FFB693]"
          style={{ width: `${rating.overall * 20}%` }}
        />
      </div>
      <p className="text-[10px] text-slate-500">
        {reportCount} published report{reportCount === 1 ? "" : "s"}
      </p>
    </div>
  );
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const requestedLeft = first(params.left);
  const requestedRight = first(params.right);
  const players = await listPublishedPlayers(200);
  const publishedSlugs = new Set(players.map((player) => player.slug));
  const leftSlug = publishedSlugs.has(requestedLeft) ? requestedLeft : "";
  const rightSlug = publishedSlugs.has(requestedRight) ? requestedRight : "";
  const canCompare = Boolean(leftSlug && rightSlug && leftSlug !== rightSlug);

  const [left, right] = canCompare
    ? await Promise.all([getPlayerProfile(leftSlug), getPlayerProfile(rightSlug)])
    : [null, null];

  return (
    <div className="container mx-auto max-w-6xl space-y-8 px-4 py-10 font-['Inter'] sm:px-6 lg:px-8">
      <header className="space-y-3 border-b border-[rgba(224,192,178,0.12)] pb-6">
        <div className="inline-flex items-center gap-2 rounded-[4px] border border-[#CC5500]/30 bg-[#CC5500]/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-[#FFB693]">
          <ArrowLeftRight className="h-3.5 w-3.5" />
          Dossier comparison
        </div>
        <h1 className="font-['Public_Sans'] text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
          Compare Players
        </h1>
        <p className="max-w-2xl text-sm text-slate-400">
          Review verified profile facts and averages from published scout reports. Missing evidence stays visibly unscored.
        </p>
      </header>

      <form method="GET" className="grid gap-4 rounded-[6px] border border-[rgba(224,192,178,0.12)] bg-[#12151C] p-5 md:grid-cols-[1fr_auto_1fr_auto] md:items-end">
        <label className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">First player</span>
          <select name="left" defaultValue={leftSlug} required className="h-11 w-full rounded-[4px] border border-[rgba(224,192,178,0.14)] bg-[#0C0E12] px-3 text-sm text-white focus:border-[#CC5500] focus:outline-none">
            <option value="">Choose a published dossier</option>
            {players.map((player) => <option key={player.id} value={player.slug}>{player.fullName}</option>)}
          </select>
        </label>
        <ArrowLeftRight className="mb-3 hidden h-5 w-5 text-[#CC5500] md:block" aria-hidden="true" />
        <label className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Second player</span>
          <select name="right" defaultValue={rightSlug} required className="h-11 w-full rounded-[4px] border border-[rgba(224,192,178,0.14)] bg-[#0C0E12] px-3 text-sm text-white focus:border-[#CC5500] focus:outline-none">
            <option value="">Choose a published dossier</option>
            {players.map((player) => <option key={player.id} value={player.slug}>{player.fullName}</option>)}
          </select>
        </label>
        <button type="submit" className="h-11 rounded-[4px] bg-gradient-to-r from-[#9C3F00] to-[#CC5500] px-5 font-['Public_Sans'] text-xs font-black uppercase tracking-wider text-white hover:opacity-95">
          Compare
        </button>
      </form>

      {players.length < 2 ? (
        <EmptyState icon={Users} title="Two published dossiers required" description="Comparison becomes available once scouts publish at least two player dossiers." />
      ) : leftSlug && rightSlug && leftSlug === rightSlug ? (
        <EmptyState icon={ArrowLeftRight} title="Choose two different players" description="A useful comparison needs two distinct published dossiers." />
      ) : !left || !right ? (
        <EmptyState icon={BarChart3} title="Select two players to begin" description="Only published, RLS-visible dossiers are available for comparison." />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <PlayerHeading player={left} />
            <PlayerHeading player={right} />
          </div>

          <section aria-labelledby="profile-comparison" className="overflow-hidden rounded-[6px] border border-[rgba(224,192,178,0.12)] bg-[#12151C]">
            <div className="flex items-center gap-2 border-b border-[rgba(224,192,178,0.12)] px-4 py-3">
              <ShieldCheck className="h-4 w-4 text-[#FFB693]" />
              <h2 id="profile-comparison" className="font-['Public_Sans'] text-xs font-black uppercase tracking-wider text-white">Verified profile</h2>
            </div>
            <ComparisonRow label="Club" left={profileValue(left.currentClub)} right={profileValue(right.currentClub)} />
            <ComparisonRow label="Position" left={positionName(left.primaryPositionCode)} right={positionName(right.primaryPositionCode)} />
            <ComparisonRow label="Nationality" left={countryName(left.nationalityCode)} right={countryName(right.nationalityCode)} />
            <ComparisonRow label="Age" left={ageOn(left.dateOfBirth)} right={ageOn(right.dateOfBirth)} />
            <ComparisonRow label="Preferred foot" left={profileValue(left.preferredFoot)} right={profileValue(right.preferredFoot)} />
            <ComparisonRow label="Height" left={profileValue(left.heightCm, " cm")} right={profileValue(right.heightCm, " cm")} />
            <ComparisonRow label="Weight" left={profileValue(left.weightKg, " kg")} right={profileValue(right.weightKg, " kg")} />
            <ComparisonRow label="Published reports" left={`${left.publishedReportCount}`} right={`${right.publishedReportCount}`} />
          </section>

          <section aria-labelledby="ratings-comparison" className="rounded-[6px] border border-[rgba(224,192,178,0.12)] bg-[#12151C] p-5">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 id="ratings-comparison" className="font-['Public_Sans'] text-sm font-black uppercase tracking-wider text-white">Published scout ratings</h2>
                <p className="mt-1 text-xs text-slate-500">Category averages use published reports only; no value is inferred for missing observations.</p>
              </div>
              <BarChart3 className="h-5 w-5 shrink-0 text-[#FFB693]" />
            </div>
            <div className="space-y-3">
              {RATING_CATEGORIES.map((category) => (
                <div key={category} className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-[4px] border border-[rgba(224,192,178,0.08)] bg-[#0C0E12] p-4">
                  <RatingCell rating={ratingFor(left, category)} reportCount={left.publishedReportCount} />
                  <span className="w-24 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">{RATING_CATEGORY_LABELS[category]}</span>
                  <RatingCell rating={ratingFor(right, category)} reportCount={right.publishedReportCount} align="right" />
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
