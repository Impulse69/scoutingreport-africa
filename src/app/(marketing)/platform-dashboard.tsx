"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Star, ShieldCheck, TrendingUp } from "lucide-react";

type Prospect = {
  slug: string;
  name: string;
  age: number;
  club: string;
  league: string;
  nation: string;
  flag: string;
  flagEmoji: string;
  photoUrl: string;
  position: string;
  role: string;
  rating: number;
  marketValue: string;
  attributes: {
    pace: number;
    dribbling: number;
    shooting: number;
    passing: number;
    physical: number;
    defense: number;
  };
  strengths: string[];
};

const FEATURED_PROSPECTS: Prospect[] = [
  {
    slug: "victor-boniface",
    name: "Victor Boniface",
    age: 24,
    club: "Bayer Leverkusen",
    league: "Bundesliga",
    nation: "Nigeria",
    flag: "NG",
    flagEmoji: "🇳🇬",
    photoUrl: "https://r2.thesportsdb.com/images/media/player/cutout/7e2phd1763665992.png",
    position: "Forward",
    role: "Complete forward",
    rating: 8.6,
    marketValue: "EUR 45,000,000",
    attributes: { pace: 85, dribbling: 88, shooting: 89, passing: 78, physical: 92, defense: 42 },
    strengths: ["Hold-up play", "Ball striking", "Box presence", "Physical dominance"],
  },
  {
    slug: "mohammed-kudus",
    name: "Mohammed Kudus",
    age: 24,
    club: "West Ham United",
    league: "Premier League",
    nation: "Ghana",
    flag: "GH",
    flagEmoji: "🇬🇭",
    photoUrl: "https://r2.thesportsdb.com/images/media/player/cutout/5wk6s81757016366.png",
    position: "Winger",
    role: "Inside forward",
    rating: 8.7,
    marketValue: "EUR 50,000,000",
    attributes: { pace: 90, dribbling: 94, shooting: 84, passing: 81, physical: 86, defense: 54 },
    strengths: ["Take-ons", "Ball carrying", "Transition play", "Press resistance"],
  },
  {
    slug: "lamine-camara",
    name: "Lamine Camara",
    age: 21,
    club: "AS Monaco",
    league: "Ligue 1",
    nation: "Senegal",
    flag: "SN",
    flagEmoji: "🇸🇳",
    photoUrl: "https://r2.thesportsdb.com/images/media/player/cutout/1fl2tg1766237973.png",
    position: "Midfielder",
    role: "Box-to-box midfielder",
    rating: 8.3,
    marketValue: "EUR 18,000,000",
    attributes: { pace: 79, dribbling: 82, shooting: 77, passing: 86, physical: 84, defense: 83 },
    strengths: ["Set pieces", "Pressing", "Forward passing", "Defensive coverage"],
  },
  {
    slug: "nicolas-jackson",
    name: "Nicolas Jackson",
    age: 23,
    club: "Chelsea",
    league: "Premier League",
    nation: "Senegal",
    flag: "SN",
    flagEmoji: "🇸🇳",
    photoUrl: "https://r2.thesportsdb.com/images/media/player/thumb/5bv5ob1770543405.jpg",
    position: "Forward",
    role: "Channel runner",
    rating: 8.2,
    marketValue: "EUR 40,000,000",
    attributes: { pace: 88, dribbling: 84, shooting: 81, passing: 76, physical: 83, defense: 45 },
    strengths: ["Channel runs", "Carrying under pressure", "Box entries", "Link-up play"],
  },
  {
    slug: "simon-adingra",
    name: "Simon Adingra",
    age: 23,
    club: "Brighton & Hove Albion",
    league: "Premier League",
    nation: "Cote d'Ivoire",
    flag: "CI",
    flagEmoji: "🇨🇮",
    photoUrl: "https://r2.thesportsdb.com/images/media/player/cutout/rxw49v1762198657.png",
    position: "Winger",
    role: "Direct wide player",
    rating: 8.1,
    marketValue: "EUR 30,000,000",
    attributes: { pace: 91, dribbling: 89, shooting: 78, passing: 77, physical: 72, defense: 48 },
    strengths: ["Crossing", "Change of pace", "1v1 attacks", "AFCON champion pedigree"],
  },
  {
    slug: "brahim-diaz",
    name: "Brahim Díaz",
    age: 25,
    club: "Real Madrid",
    league: "La Liga",
    nation: "Morocco",
    flag: "MA",
    flagEmoji: "🇲🇦",
    photoUrl: "https://r2.thesportsdb.com/images/media/player/cutout/civrzg1733653256.png",
    position: "Attacking Midfielder",
    role: "Playmaker",
    rating: 8.8,
    marketValue: "EUR 40,000,000",
    attributes: { pace: 84, dribbling: 93, shooting: 82, passing: 87, physical: 68, defense: 46 },
    strengths: ["Tight space agility", "Both-footed finishing", "Final third vision"],
  },
];

export function PlatformDashboard() {
  const [selectedProspect, setSelectedProspect] = useState<Prospect>(FEATURED_PROSPECTS[0]);
  const [filterPos, setFilterPos] = useState<"ALL" | "ATT" | "MID">("ALL");

  const filtered = FEATURED_PROSPECTS.filter((p) => {
    if (filterPos === "ATT") return p.position === "Forward" || p.position === "Winger";
    if (filterPos === "MID") return p.position === "Midfielder" || p.position.includes("Midfielder");
    return true;
  });

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-card px-5 py-3.5">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Evaluation matrix</h3>
          <p className="text-xs text-muted-foreground">
            Positional benchmark and technical profile comparison.
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-lg border border-border bg-muted p-1 text-xs font-medium">
          {[
            ["ALL", "All Talents"],
            ["ATT", "Attackers"],
            ["MID", "Midfielders"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilterPos(value as "ALL" | "ATT" | "MID")}
              className={`rounded-md px-3 py-1.5 transition-colors focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40 ${
                filterPos === value
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:bg-background hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left player list */}
        <div className="space-y-2 border-b border-border bg-muted/40 p-4 lg:col-span-5 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between px-2 py-1 text-xs font-medium text-muted-foreground">
            <span>Verified Dossiers</span>
            <span className="text-[11px] text-primary font-semibold">{filtered.length} Active</span>
          </div>

          <div className="max-h-[500px] space-y-2 overflow-y-auto pr-1">
            {filtered.map((p) => {
              const active = selectedProspect.slug === p.slug;
              return (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => setSelectedProspect(p)}
                  className={`w-full rounded-xl border p-3 text-left transition-all focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40 ${
                    active
                      ? "border-primary bg-background shadow-xs ring-1 ring-primary/20"
                      : "border-border/60 bg-card/80 hover:border-border hover:bg-background"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                        <Image
                          src={p.photoUrl}
                          alt={p.name}
                          fill
                          sizes="44px"
                          className="object-cover object-top"
                          unoptimized
                        />
                        <span className="absolute bottom-0 right-0 text-xs leading-none bg-background/90 rounded-tl px-1 py-0.5">
                          {p.flagEmoji}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-foreground">{p.name}</div>
                        <div className="truncate text-xs text-muted-foreground">
                          {p.club} · {p.position}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="flex items-center justify-end gap-1 text-xs font-semibold tabular-nums text-primary">
                        <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                        <span>{p.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-[11px] tabular-nums font-medium text-muted-foreground">
                        {p.marketValue.replace("EUR ", "€")}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right prospect overview */}
        <div className="flex flex-col justify-between space-y-6 bg-card p-6 sm:p-7 lg:col-span-7">
          <div className="space-y-4 border-b border-border pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-primary/20 bg-muted shadow-sm">
                  <Image
                    src={selectedProspect.photoUrl}
                    alt={selectedProspect.name}
                    fill
                    sizes="80px"
                    className="object-cover object-top"
                    unoptimized
                  />
                  <div className="absolute top-1 left-1 rounded-md bg-background/90 px-1.5 py-0.5 text-xs font-bold shadow-xs">
                    {selectedProspect.flagEmoji}
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                      {selectedProspect.nation}
                    </span>
                    <span className="rounded-md border border-border bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
                      {selectedProspect.position}
                    </span>
                    <span className="text-xs text-muted-foreground">Age {selectedProspect.age}</span>
                  </div>
                  <h4 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                    {selectedProspect.name}
                  </h4>
                  <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {selectedProspect.role} · <span className="font-medium text-foreground">{selectedProspect.club}</span> ({selectedProspect.league})
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col items-center justify-between gap-1 rounded-xl border border-border bg-muted/60 px-4 py-2.5 text-center">
                <div className="text-[11px] font-medium text-muted-foreground">Scout Grade</div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                  <span className="text-2xl font-bold tabular-nums text-foreground">
                    {selectedProspect.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Positional Percentiles */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-primary" />
                Positional Percentile vs African / European Benchmark
              </span>
              <span className="font-mono text-[11px] text-muted-foreground">Season 2025/26</span>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              {[
                { label: "Pace & Acceleration", val: selectedProspect.attributes.pace },
                { label: "Dribbling & Ball Carry", val: selectedProspect.attributes.dribbling },
                { label: "Finishing & Ball Striking", val: selectedProspect.attributes.shooting },
                { label: "Key Passes & Creation", val: selectedProspect.attributes.passing },
                { label: "Physical Duels & Stamina", val: selectedProspect.attributes.physical },
                { label: "Defensive Engagement", val: selectedProspect.attributes.defense },
              ].map((attr) => (
                <div key={attr.label} className="space-y-1 rounded-lg border border-border/50 bg-muted/30 p-2.5">
                  <div className="flex justify-between gap-3 text-xs">
                    <span className="font-medium text-foreground">{attr.label}</span>
                    <span className="font-bold tabular-nums text-primary">{attr.val}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-blue-600 to-indigo-500 transition-all duration-500"
                      style={{ width: `${attr.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths */}
          <div className="space-y-2 border-t border-border pt-4">
            <div className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Verified Scout Observations & Strengths
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedProspect.strengths.map((str) => (
                <span
                  key={str}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/70 px-3 py-1 text-xs font-medium text-foreground shadow-2xs"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{str}</span>
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="pt-2">
            <Link
              href={`/players/${selectedProspect.slug}`}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40"
            >
              <span>Access Full Scouting Dossier & Match Logs</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
