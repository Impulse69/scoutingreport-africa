import Image from "next/image";
import Link from "next/link";
import { Pencil, ScrollText, Star, Shield, BookmarkPlus, Sparkles, Trophy } from "lucide-react";
import type { PlayerProfile } from "@/lib/features/players/queries";
import { CAF_COUNTRIES, POSITIONS } from "@/lib/shared/constants";

export function positionLabel(code: string | null): string {
  if (!code) return "—";
  return POSITIONS.find((p) => p.code === code)?.name ?? code;
}

export function countryFor(code: string | null) {
  if (!code) return null;
  return CAF_COUNTRIES.find((c) => c.code === code) ?? null;
}

export function ageFrom(dateOfBirth: string | null): number | null {
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return null;
  const now = new Date();
  let age = now.getUTCFullYear() - dob.getUTCFullYear();
  const monthDelta = now.getUTCMonth() - dob.getUTCMonth();
  if (monthDelta < 0 || (monthDelta === 0 && now.getUTCDate() < dob.getUTCDate())) {
    age -= 1;
  }
  return age >= 0 && age < 120 ? age : null;
}

export function overallScore(player: PlayerProfile): number | null {
  const scored = player.ratings
    .map((r) => r.overall)
    .filter((n): n is number => n !== null);
  if (scored.length === 0) return null;
  return Math.round((scored.reduce((a, b) => a + b, 0) / scored.length) * 10) / 10;
}

export function PlayerProfileHero({
  player,
  canEdit,
}: {
  player: PlayerProfile;
  canEdit: boolean;
}) {
  const country = countryFor(player.nationalityCode);
  const age = ageFrom(player.dateOfBirth);
  const overall = overallScore(player);

  const facts: { label: string; value: string }[] = [
    { label: "Age", value: age !== null ? `${age} yrs` : "—" },
    { label: "Position", value: positionLabel(player.primaryPositionCode) },
    {
      label: "Nationality",
      value: country ? `${country.flagEmoji} ${country.name}` : "—",
    },
    { label: "Current Club", value: player.currentClub ?? "Free agent" },
    {
      label: "Preferred Foot",
      value: player.preferredFoot && player.preferredFoot !== "unknown"
        ? player.preferredFoot
        : "—",
    },
    {
      label: "Height",
      value: player.heightCm ? `${player.heightCm} cm` : "—",
    },
    {
      label: "Weight",
      value: player.weightKg ? `${player.weightKg} kg` : "—",
    },
    {
      label: "Scout Reports",
      value: `${player.publishedReportCount} filed`,
    },
  ];

  const initials = player.fullName
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0e171f] via-[#0b1116] to-[#080c10] p-6 sm:p-8 shadow-2xl relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border-2 border-emerald-500/30 bg-slate-900 shadow-xl">
            {player.photoUrl ? (
              <Image
                src={player.photoUrl}
                alt={player.fullName}
                fill
                sizes="112px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-mono text-3xl font-black text-emerald-400/80 bg-gradient-to-br from-[#121921] to-[#0c1218]">
                {initials}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xl">{country?.flagEmoji ?? "⚽"}</span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {player.commonName || player.fullName}
              </h1>
              {player.status === "draft" ? (
                <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-300">
                  Draft Dossier
                </span>
              ) : (
                <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-300 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Verified Talent
                </span>
              )}
            </div>

            {player.commonName && (
              <p className="text-xs text-slate-400 font-medium">{player.fullName}</p>
            )}

            {player.secondaryPositionCodes.length > 0 && (
              <p className="text-xs text-slate-400">
                Alternative roles:{" "}
                <span className="text-slate-200">
                  {player.secondaryPositionCodes.map((c) => positionLabel(c)).join(" · ")}
                </span>
              </p>
            )}

            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4 pt-4 border-t border-white/5">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    {fact.label}
                  </dt>
                  <dd className="mt-0.5 text-xs font-semibold capitalize text-white">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Rating & Actions */}
        <div className="flex shrink-0 flex-col items-stretch gap-3 lg:items-end">
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-4 text-center shadow-lg">
            <p className="text-[10px] uppercase font-black tracking-widest text-emerald-400">
              Scout Assessment Score
            </p>
            {overall !== null ? (
              <p className="mt-1 flex items-center justify-center gap-1.5 font-mono text-3xl font-black tabular-nums text-emerald-300">
                <Star className="h-5 w-5 fill-emerald-300" />
                {overall.toFixed(1)}
                <span className="text-sm font-bold text-emerald-500">/ 5.0</span>
              </p>
            ) : (
              <p className="mt-1 text-xs text-slate-400">Awaiting Evaluation</p>
            )}
          </div>

          <div className="flex flex-wrap gap-2 justify-end">
            <Link
              href={`/watchlists`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
            >
              <BookmarkPlus className="h-3.5 w-3.5 text-amber-400" />
              Add to Watchlist
            </Link>

            {canEdit && (
              <>
                <Link
                  href={`/scout/players/${player.id}/edit`}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Link>
                <Link
                  href={`/scout/reports/new?player=${player.id}`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-950 shadow-md shadow-emerald-500/20 transition-all"
                >
                  <ScrollText className="h-3.5 w-3.5" />
                  File Report
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
