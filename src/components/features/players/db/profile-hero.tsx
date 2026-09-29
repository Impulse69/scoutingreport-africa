import Image from "next/image";
import Link from "next/link";
import { Pencil, Star } from "lucide-react";
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
      label: "Competition",
      value: player.currentCompetition?.name ?? "Not assigned",
    },
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
    <div className="space-y-8 rounded-lg border border-border bg-card p-6 sm:p-8">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex items-start gap-5">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border border-border bg-muted sm:h-28 sm:w-28">
            {player.photoUrl ? (
              <Image
                src={player.photoUrl}
                alt={player.fullName}
                fill
                sizes="112px"
                className="object-cover object-top"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted text-2xl font-semibold text-primary">
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
                <span className="text-xs font-mono font-bold text-muted-foreground">
                  {country.flagEmoji} {country.name}
                </span>
              )}
              <span className="rounded-md border border-border bg-muted px-2 py-0.5 text-[11px] font-medium tracking-wide text-primary">
                {player.primaryPositionCode ?? "PL"}
              </span>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              {player.fullName}
            </h1>

            <p className="text-xs sm:text-sm text-muted-foreground font-medium">
              {player.currentClub ?? "Free agent"} · {positionLabel(player.primaryPositionCode)}
            </p>
          </div>
        </div>

        <div className="flex flex-row md:flex-col items-end justify-between gap-4">
          <div className="flex items-center gap-3">
            {overall !== null ? (
              <div className="rounded-md border border-border bg-muted px-4 py-2 text-right">
                <div className="text-xs font-medium text-muted-foreground">
                  Scout Rating
                </div>
                <div className="font-mono text-2xl font-semibold text-foreground flex items-center gap-1.5 justify-end">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span>{overall.toFixed(1)}</span>
                </div>
              </div>
            ) : (
              <div className="rounded-md border border-border bg-muted px-3 py-2 text-right">
                <div className="text-xs font-medium text-muted-foreground">
                  Rating
                </div>
                <div className="text-xs font-mono text-muted-foreground">Unassessed</div>
              </div>
            )}

            {canEdit && (
              <Link
                href={`/scout/players/${player.id}/edit`}
                className="flex items-center gap-1.5 rounded-md border border-border bg-secondary px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-accent"
              >
                <Pencil className="h-3.5 w-3.5" />
                <span>Edit Profile</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-6 sm:grid-cols-3 lg:grid-cols-4">
        {facts.map((f) => (
          <div key={f.label} className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground">
              {f.label}
            </div>
            <div className="truncate text-sm font-semibold text-foreground">{f.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
