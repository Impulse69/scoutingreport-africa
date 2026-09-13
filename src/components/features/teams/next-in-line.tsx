import Image from "next/image";
import { ArrowLeftRight } from "lucide-react";
import type { SquadPlayer } from "@/lib/features/teams/mock";

type Props = {
  backups: { GK: SquadPlayer[]; DEF: SquadPlayer[]; MID: SquadPlayer[]; FWD: SquadPlayer[] };
};

const GROUPS: { key: "GK" | "DEF" | "MID" | "FWD"; label: string }[] = [
  { key: "GK", label: "GK" },
  { key: "DEF", label: "DEF" },
  { key: "MID", label: "MID" },
  { key: "FWD", label: "FWD" },
];

export function NextInLine({ backups }: Props) {
  return (
    <section className="rounded-lg border border-border bg-card">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-2">
          <ArrowLeftRight className="h-3.5 w-3.5 text-muted-foreground" />
          <p className="text-xs font-medium text-muted-foreground">
            Next In Line
          </p>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Top backups per position, ranked by minutes
        </p>
      </header>

      <div className="grid gap-px bg-border md:grid-cols-4">
        {GROUPS.map((g) => {
          const players = backups[g.key];
          const starting = players.length;
          return (
            <div key={g.key} className="bg-card p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-semibold">{g.label}</p>
                <p className="text-xs text-muted-foreground">{starting} starting</p>
              </div>
              <ul className="space-y-3">
                {players.map((p) => (
                  <li key={p.id} className="flex items-center gap-3">
                    <div className="relative h-7 w-7 overflow-hidden rounded-full border border-border bg-muted">
                      {p.photoUrl ? (
                        <Image
                          src={p.photoUrl}
                          alt={p.shortName}
                          fill
                          sizes="28px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center font-mono text-[9px] font-bold text-stone-700">
                          {p.shortName
                            .split(" ")
                            .map((s) => s[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm">{p.shortName}</p>
                      <p className="text-xs text-muted-foreground">
                        #{p.shirtNumber} · {p.position} · {p.minutes.toLocaleString()}&apos;
                      </p>
                    </div>
                    <span
                      className={`rounded px-2 py-0.5 text-xs tabular-nums ${
                        p.goals > 10
                          ? "border border-border bg-muted text-primary"
                          : "border border-border bg-muted text-muted-foreground"
                      }`}
                    >
                      {p.goals}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
