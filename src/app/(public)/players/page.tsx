import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Users, Search } from "lucide-react";
import { listPublishedPlayers } from "@/lib/features/players/queries";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { POSITIONS, CAF_COUNTRIES } from "@/lib/shared/constants";

export const metadata: Metadata = {
  title: "Players",
  description:
    "Search scouted African footballers by position, age, nationality, and rating.",
};

function positionLabel(code: string | null): string {
  if (!code) return "—";
  return POSITIONS.find((p) => p.code === code)?.name ?? code;
}

function flagFor(code: string | null): string {
  if (!code) return "";
  return CAF_COUNTRIES.find((c) => c.code === code)?.flagEmoji ?? "";
}

export default async function PlayersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; pos?: string; nat?: string }>;
}) {
  const sp = await searchParams;
  const players = await listPublishedPlayers(200);

  const q = (sp.q ?? "").trim().toLowerCase();
  const filtered = players.filter((p) => {
    if (sp.pos && p.primaryPositionCode !== sp.pos) return false;
    if (sp.nat && p.nationalityCode !== sp.nat) return false;
    if (q && !p.fullName.toLowerCase().includes(q)) return false;
    return true;
  });

  return (
    <div className="container mx-auto px-6 py-10 max-w-6xl">
      <PageHeader
        eyebrow="Catalogue"
        title="Players"
        description={`${players.length} published profile${players.length === 1 ? "" : "s"}. Use the navbar search for live ESPN-backed players worldwide.`}
      />

      <form className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            name="q"
            defaultValue={sp.q ?? ""}
            placeholder="Search by name…"
            className="pl-10"
          />
        </div>
        <select
          name="pos"
          defaultValue={sp.pos ?? ""}
          className="h-9 rounded-md border border-white/10 bg-white/5 px-3 text-sm text-white"
        >
          <option value="">All positions</option>
          {POSITIONS.map((p) => (
            <option key={p.code} value={p.code}>
              {p.name}
            </option>
          ))}
        </select>
        <select
          name="nat"
          defaultValue={sp.nat ?? ""}
          className="h-9 rounded-md border border-white/10 bg-white/5 px-3 text-sm text-white"
        >
          <option value="">All nationalities</option>
          {CAF_COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flagEmoji} {c.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="h-9 rounded-md bg-orange-600 px-4 text-sm font-medium text-white hover:bg-orange-700 transition-colors"
        >
          Filter
        </button>
      </form>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title={q || sp.pos || sp.nat ? "No players match your filters" : "No published players yet"}
          description={
            q || sp.pos || sp.nat
              ? "Try widening your filters or clearing the search."
              : "Use the global search bar in the nav to find any active footballer worldwide."
          }
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <li key={p.id}>
              <Link
                href={`/players/${p.slug}`}
                className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-[#0E0E0E] p-5 transition-colors hover:border-orange-500/40"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-zinc-900">
                  {p.photoUrl ? (
                    <Image
                      src={p.photoUrl}
                      alt={p.fullName}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-mono text-base font-bold text-zinc-500">
                      {p.fullName
                        .split(" ")
                        .map((s) => s[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <p className="truncate font-semibold text-white group-hover:text-orange-500 transition-colors">
                    {p.fullName}
                  </p>
                  <p className="truncate text-xs text-zinc-500">
                    {p.currentClub ?? "Free agent"}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {p.primaryPositionCode ? (
                      <Badge variant="outline" className="text-[10px]">
                        {positionLabel(p.primaryPositionCode)}
                      </Badge>
                    ) : null}
                    {p.nationalityCode ? (
                      <span className="text-xs">
                        {flagFor(p.nationalityCode)}{" "}
                        <span className="font-mono text-[10px] text-zinc-500">
                          {p.nationalityCode}
                        </span>
                      </span>
                    ) : null}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
