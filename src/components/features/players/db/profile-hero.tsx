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
      label: "Height / Weight",
      value: `${player.heightCm ? `${player.heightCm} cm` : "—"} · ${
        player.weightKg ? `${player.weightKg} kg` : "—"
      }`,
    },
  ];

  return (
    <div className="rounded-[6px] border border-[rgba(224,192,178,0.12)] bg-[#12151C] p-6 sm:p-8 space-y-8 shadow-xl font-['Inter']">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        {/* Left: Avatar + Title */}
        <div className="flex items-start gap-5">
          <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-[4px] border border-[rgba(224,192,178,0.15)] bg-[#0C0E12] shadow-inner">
            {player.photoUrl ? (
              <Image
                src={player.photoUrl}
                alt={player.fullName}
                fill
                sizes="112px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-['Public_Sans'] text-2xl font-black text-[#FFB693] bg-[#0C0E12]">
                {player.fullName
                  .split(" ")
                  .map((s) => s[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {country && (
                <span className="text-xs font-mono font-bold text-slate-300">
                  {country.flagEmoji} {country.name}
                </span>
              )}
              <span className="rounded-[3px] bg-[#CC5500]/20 px-2 py-0.5 text-[10px] font-['Public_Sans'] font-black uppercase tracking-wider text-[#FFB693] border border-[#CC5500]/30">
                {player.primaryPositionCode ?? "PL"}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Dossier #{player.id.slice(0, 8)}
              </span>
            </div>

            <h1 className="font-['Public_Sans'] text-2xl sm:text-4xl font-black tracking-tight text-white uppercase">
              {player.fullName}
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              {player.currentClub ?? "Free agent"} · {positionLabel(player.primaryPositionCode)}
            </p>
          </div>
        </div>

        {/* Right: Score + Edit Button */}
        <div className="flex flex-row md:flex-col items-end justify-between gap-4">
          <div className="flex items-center gap-3">
            {overall !== null ? (
              <div className="rounded-[4px] border border-[#CC5500]/40 bg-[#CC5500]/10 px-4 py-2 text-right">
                <div className="text-[10px] font-['Public_Sans'] font-extrabold uppercase tracking-widest text-[#FFB693]">
                  Scout Rating
                </div>
                <div className="font-mono text-2xl font-black text-white flex items-center gap-1.5 justify-end">
                  <Star className="h-4 w-4 fill-[#CC5500] text-[#CC5500]" />
                  <span>{overall.toFixed(1)}</span>
                </div>
              </div>
            ) : (
              <div className="rounded-[4px] border border-[rgba(224,192,178,0.1)] bg-[#0C0E12] px-3 py-2 text-right">
                <div className="text-[10px] font-['Public_Sans'] font-bold uppercase tracking-widest text-slate-500">
                  Rating
                </div>
                <div className="text-xs font-mono text-slate-400">Unassessed</div>
              </div>
            )}

            {canEdit && (
              <Link
                href={`/scout/players/${player.id}/edit`}
                className="flex items-center gap-1.5 px-3 py-2 rounded-[4px] bg-[#171B23] hover:bg-[#1E232D] text-white border border-[rgba(224,192,178,0.15)] font-['Public_Sans'] text-xs font-bold transition-all"
              >
                <Pencil className="h-3.5 w-3.5" />
                <span>Edit Profile</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Facts Metadata Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-6 border-t border-[rgba(224,192,178,0.08)]">
        {facts.map((f) => (
          <div
            key={f.label}
            className="rounded-[4px] bg-[#0C0E12] p-3 border border-[rgba(224,192,178,0.06)] space-y-1"
          >
            <div className="text-[10px] font-['Public_Sans'] font-extrabold uppercase tracking-wider text-slate-400">
              {f.label}
            </div>
            <div className="text-xs font-bold text-white capitalize truncate">{f.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
