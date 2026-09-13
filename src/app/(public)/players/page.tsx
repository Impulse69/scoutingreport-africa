import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  Search,
  ArrowRight,
  SlidersHorizontal,
} from "lucide-react";
import { listPublishedPlayers } from "@/lib/features/players/queries";
import { EmptyState } from "@/components/shared/empty-state";
import { POSITIONS, CAF_COUNTRIES } from "@/lib/shared/constants";

export const metadata: Metadata = {
  title: "Players Directory",
  description:
    "Search scouted African footballers by position, age, nationality, physical metrics, and verified ratings.",
};

function positionLabel(code: string | null): string {
  if (!code) return "—";
  return POSITIONS.find((p) => p.code === code)?.name ?? code;
}

function flagFor(code: string | null): string {
  if (!code) return "⚽";
  return CAF_COUNTRIES.find((c) => c.code === code)?.flagEmoji ?? "⚽";
}

function countryName(code: string | null): string {
  if (!code) return "African Talent";
  return CAF_COUNTRIES.find((c) => c.code === code)?.name ?? code;
}

function matchesPosition(playerPos: string | null, filterPos: string | undefined): boolean {
  if (!filterPos) return true;
  if (!playerPos) return false;

  const target = filterPos.trim().toUpperCase();
  const player = playerPos.trim().toUpperCase();

  if (player === target) return true;

  const parts = target.split(",").map((s) => s.trim());
  if (parts.includes(player)) return true;

  // Group alias matching
  if (target === "FW" || target === "FWD" || target === "ATT") {
    return ["ST", "SS", "LW", "RW", "FWD", "FW"].includes(player);
  }
  if (target === "MID" || target === "MF") {
    return ["DM", "CM", "AM", "LM", "RM", "MID", "MF"].includes(player);
  }
  if (target === "DEF" || target === "DF") {
    return ["CB", "LB", "RB", "LWB", "RWB", "DEF", "DF"].includes(player);
  }
  if (target === "GK") {
    return player === "GK";
  }

  const playerSpec = POSITIONS.find((p) => p.code === player);
  if (playerSpec && playerSpec.group.toUpperCase() === target) {
    return true;
  }

  return false;
}

export default async function PlayersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; pos?: string; nat?: string; sort?: string }>;
}) {
  const sp = await searchParams;
  const rawPlayers = await listPublishedPlayers(200);

  const q = (sp.q ?? "").trim().toLowerCase();
  const isPanAfrican =
    q === "pan-african" ||
    q === "pan african" ||
    q === "caf" ||
    q === "all" ||
    q === "all-africa" ||
    q === "africa" ||
    q === "continental";

  let players = rawPlayers;

  // If searching for a specific player not in the local mock DB list, query global search
  if (q && !isPanAfrican && !rawPlayers.some((p) => p.fullName.toLowerCase().includes(q))) {
    try {
      const { searchGlobalOmni } = await import("@/lib/features/search/actions");
      const hits = await searchGlobalOmni(q);
      const playerHits = hits.filter((h) => h.type === "player");
      if (playerHits.length > 0) {
        const extraPlayers = playerHits.map((h) => ({
          id: h.id,
          slug: h.url.replace(/^\/players\//, ""),
          fullName: h.title,
          primaryPositionCode: h.subtitle.split("·")[0]?.trim() ?? "FWD",
          nationalityCode: null,
          currentClub: h.subtitle.split("·")[1]?.trim() ?? null,
          photoUrl: h.badge ?? null,
        }));
        players = [...rawPlayers, ...extraPlayers];
      }
    } catch {}
  }

  const filtered = players.filter((p) => {
    // 1. Position filtering
    if (sp.pos && !matchesPosition(p.primaryPositionCode, sp.pos)) return false;

    // 2. Nationality code filtering
    if (sp.nat && p.nationalityCode !== sp.nat) return false;

    // 3. Query string filtering
    if (q && !isPanAfrican) {
      const matchName = p.fullName.toLowerCase().includes(q);
      const cName = countryName(p.nationalityCode).toLowerCase();
      const natCode = (p.nationalityCode ?? "").toLowerCase();
      const matchNat = cName.includes(q) || natCode === q;
      const matchClub = (p.currentClub ?? "").toLowerCase().includes(q);
      const posCode = (p.primaryPositionCode ?? "").toLowerCase();
      const posName = positionLabel(p.primaryPositionCode).toLowerCase();
      const matchPos = posCode.includes(q) || posName.includes(q);

      // Regional aliases (only when searching broad zone terms like "WAFU" or "West Africa")
      const isWestAfrica = q === "wafu" || q === "west africa" || q === "west-africa";
      const isNorthAfrica = q === "unaf" || q === "north africa" || q === "north-africa";
      const isSouthernAfrica = q === "cosafa" || q === "southern africa" || q === "southern-africa";
      const isEastAfrica = q === "cecafa" || q === "east africa" || q === "east-africa";

      const matchRegion =
        (isWestAfrica && ["nigeria", "ghana", "senegal", "côte d'ivoire", "ivory coast", "mali", "guinea"].includes(cName)) ||
        (isNorthAfrica && ["morocco", "egypt", "algeria", "tunisia"].includes(cName)) ||
        (isSouthernAfrica && ["south africa", "zambia", "angola", "zimbabwe"].includes(cName)) ||
        (isEastAfrica && ["kenya", "uganda", "tanzania", "sudan", "ethiopia"].includes(cName));

      if (!matchName && !matchNat && !matchClub && !matchPos && !matchRegion) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-7xl space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-semibold text-foreground tracking-tight">
            African players
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Standardized player evaluations across all 54 CAF national associations, domestic top flights, and European landing divisions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/compare"
            className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-card px-4 text-xs font-semibold text-foreground shadow-xs transition-colors hover:bg-muted focus:outline-none focus-visible:ring-1 focus-visible:ring-ring/40"
          >
            Compare Players
          </Link>
          <Link
            href="/scout/reports/new"
            className="inline-flex h-10 items-center justify-center px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-xs shadow-xs transition-colors hover:bg-primary/90 focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40"
          >
            Submit Report
          </Link>
          <Link
            href="/watchlists"
            className="inline-flex h-10 items-center justify-center px-4 rounded-xl bg-card text-foreground border border-border font-semibold text-xs transition-colors hover:bg-muted focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40"
          >
            My Watchlists
          </Link>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-sm">
        <form method="GET" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Text Input */}
          <div className="lg:col-span-5 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              name="q"
              defaultValue={sp.q ?? ""}
              placeholder="Search by player name, club, or nationality..."
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-muted/50 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40"
            />
          </div>

          {/* Position Selector */}
          <div className="lg:col-span-3">
            <select
              name="pos"
              defaultValue={sp.pos ?? ""}
              className="w-full h-11 px-3.5 rounded-xl border border-input bg-muted/50 text-xs text-foreground focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40 font-medium"
            >
              <option value="">All positions</option>
              <optgroup label="Broad Groups">
                <option value="FWD">All Attackers (FWD)</option>
                <option value="MID">All Midfielders (MID)</option>
                <option value="DEF">All Defenders (DEF)</option>
                <option value="GK">Goalkeepers (GK)</option>
              </optgroup>
              <optgroup label="Specific Roles">
                {POSITIONS.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name} ({p.code})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Nationality Selector */}
          <div className="lg:col-span-3">
            <select
              name="nat"
              defaultValue={sp.nat ?? ""}
              className="w-full h-11 px-3.5 rounded-xl border border-input bg-muted/50 text-xs text-foreground focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40 font-medium"
            >
              <option value="">All CAF Nationalities (54)</option>
              {CAF_COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flagEmoji} {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>

          {/* Submit Action */}
          <div className="lg:col-span-1 flex items-center gap-2">
            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-xs shadow-xs transition-colors hover:bg-primary/90 focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40 flex items-center justify-center gap-1.5"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Filter</span>
            </button>
          </div>
        </form>

        {/* Quick Position Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border">
          <span className="text-[11px] font-bold text-muted-foreground mr-1">
            Quick Filters:
          </span>
          {[
            { label: "All", pos: "" },
            { label: "Attackers (FWD)", pos: "FWD" },
            { label: "Strikers (ST)", pos: "ST" },
            { label: "Wingers (LW/RW)", pos: "LW,RW" },
            { label: "Midfielders (MID)", pos: "MID" },
            { label: "Central Mids (CM)", pos: "CM" },
            { label: "Defenders (DEF)", pos: "DEF" },
            { label: "Center Backs (CB)", pos: "CB" },
            { label: "Full Backs (LB/RB)", pos: "LB,RB,LWB,RWB" },
            { label: "Goalkeepers (GK)", pos: "GK" },
          ].map((item) => {
            const isActive = (sp.pos ?? "") === item.pos;
            const queryParams = new URLSearchParams();
            if (sp.q) queryParams.set("q", sp.q);
            if (item.pos) queryParams.set("pos", item.pos);
            if (sp.nat) queryParams.set("nat", sp.nat);

            return (
              <Link
                key={item.label}
                href={`/players?${queryParams.toString()}`}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "bg-muted text-muted-foreground hover:bg-background hover:text-foreground border border-border/60"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Grid of Players */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title={q || sp.pos || sp.nat ? "No players match your filters" : "No published players yet"}
          description={
            q || sp.pos || sp.nat
              ? "Try broadening your nationality or position filters, or search for another player name."
              : "No players have been published yet."
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => {
            const flag = flagFor(p.nationalityCode);
            const country = countryName(p.nationalityCode);
            const pos = positionLabel(p.primaryPositionCode);

            return (
              <Link
                key={p.id}
                href={`/players/${p.slug}`}
                className="group rounded-2xl border border-border bg-card p-5 shadow-xs transition-all hover:border-primary/50 hover:shadow-md flex flex-col justify-between relative overflow-hidden focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40"
              >
                <div className="flex items-start gap-4">
                  {/* Photo / Avatar */}
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                    {p.photoUrl ? (
                      <Image
                        src={p.photoUrl}
                        alt={p.fullName}
                        fill
                        sizes="64px"
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm font-bold text-primary bg-primary/10">
                        {p.fullName
                          .split(" ")
                          .map((s) => s[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Player Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm">{flag}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                        {p.primaryPositionCode ?? "PL"}
                      </span>
                    </div>

                    <h2 className="font-bold text-base text-foreground group-hover:text-primary transition-colors truncate">
                      {p.fullName}
                    </h2>

                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {p.currentClub ?? "Free agent"}
                    </p>
                  </div>
                </div>

                {/* Bottom Meta */}
                <div className="mt-5 pt-3.5 border-t border-border/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="truncate font-medium">{country}</span>
                    <span>·</span>
                    <span className="text-[11px] text-muted-foreground">{pos}</span>
                  </div>

                  <span className="text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View dossier <ArrowRight className="h-3.5 w-3.5 text-primary" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
