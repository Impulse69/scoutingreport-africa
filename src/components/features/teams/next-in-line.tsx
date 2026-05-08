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
    <section className="rounded-xl border border-white/5 bg-[#0E0E0E]">
      <header className="flex items-center justify-between border-b border-white/5 px-6 py-4">
        <div className="flex items-center gap-2">
          <ArrowLeftRight className="h-3.5 w-3.5 text-zinc-500" />
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
            Next In Line
          </p>
        </div>
        <p className="text-[11px] text-zinc-500">
          Top backups per position, ranked by minutes
        </p>
      </header>

      <div className="grid gap-px bg-white/5 md:grid-cols-4">
        {GROUPS.map((g) => {
          const players = backups[g.key];
          const starting = players.length;
          return (
            <div key={g.key} className="bg-[#0E0E0E] p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-mono text-xs font-semibold text-white">{g.label}</p>
                <p className="font-mono text-[10px] text-zinc-500">{starting} starting</p>
              </div>
              <ul className="space-y-3">
                {players.map((p) => (
                  <li key={p.id} className="flex items-center gap-3">
                    <div className="relative h-7 w-7 overflow-hidden rounded-full border border-white/10 bg-stone-200">
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
                      <p className="truncate font-mono text-xs text-white">{p.shortName}</p>
                      <p className="font-mono text-[10px] text-zinc-500">
                        #{p.shirtNumber} · {p.position} · {p.minutes.toLocaleString()}&apos;
                      </p>
                    </div>
                    <span
                      className={`rounded px-2 py-0.5 font-mono text-[10px] tabular-nums ${
                        p.goals > 10
                          ? "border border-cyan-500/40 bg-cyan-500/10 text-cyan-300"
                          : "border border-white/10 bg-black/30 text-zinc-400"
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
