import { BookmarkPlus } from "lucide-react";
import type { RichPlayerProfile } from "@/lib/features/players/rich-mock";
import { PlayerPhoto } from "./photo";
import Link from "next/link";

export function PlayerHero({ player }: { player: RichPlayerProfile }) {
  return (
    <section className="relative overflow-hidden rounded-lg border border-border bg-card px-6 sm:px-8 py-8  ">
      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="relative shrink-0 overflow-hidden rounded-md border border-border bg-muted shadow-md">
            <PlayerPhoto src={player.photoUrl} name={player.fullName} size={96} rounded="md" />
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground ">
                {player.fullName}
              </h1>
              <span className="rounded-md border border-border bg-muted px-2.5 py-0.5 text-[10px] font-semibold  tracking-normal text-primary">
                {player.position}
              </span>
            </div>

            <p className="text-xs text-muted-foreground font-medium">
              {player.club} · <span className="text-muted-foreground">{player.league}</span> · <span className="text-primary font-bold">{player.nationality}</span>
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-muted-foreground">
              <span className="text-foreground font-bold">{player.age} yrs</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground" />
              <span>{player.heightCm} cm</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground" />
              <span className="capitalize">{player.preferredFoot} foot</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground" />
              <span className="text-primary font-bold">{player.estimatedProfile}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-stretch sm:items-end gap-4">
          <div className="flex items-center gap-2">
            <Link
              href="/watchlists"
              className="flex items-center gap-1.5 rounded-md border border-border bg-muted px-3.5 py-2 text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
            >
              <BookmarkPlus className="h-3.5 w-3.5 text-primary" />
              Track in Watchlist
            </Link>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-4 gap-4 sm:gap-6 text-center sm:text-right p-4 rounded-md bg-muted border border-border">
            {[
              { label: "Apps", value: player.appearances },
              { label: "Goals", value: player.goals },
              { label: "Assists", value: player.assists },
              { label: "Rating", value: player.rating.toFixed(1) },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-[10px] font-semibold  tracking-normal text-muted-foreground">
                  {stat.label}
                </p>
                <p className="font-mono text-base font-semibold text-foreground">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
