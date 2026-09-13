"use server";

import { searchTeams, type TeamSearchHit } from "@/lib/features/teams/mock";
import { searchPublishedPlayers } from "@/lib/features/players/queries";
import { CAF_COUNTRIES } from "@/lib/shared/constants";

export type GlobalSearchPlayer = {
  id: string;
  slug: string;
  name: string;
  position: string | null;
  team: string | null;
  league: string | null;
  photo: string | null;
};

export type GlobalSearchResult = {
  players: GlobalSearchPlayer[];
  teams: TeamSearchHit[];
};

export type OmniSearchResult = {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  type: "player" | "club" | "competition";
  flagEmoji?: string;
  badge?: string;
};

type EspnContent = {
  id?: string;
  uid?: string;
  sport?: string;
  displayName?: string;
  subtitle?: string;
  description?: string;
  image?: { default?: string };
};

type EspnSearch = {
  results?: { type?: string; contents?: EspnContent[] }[];
};

function extractEspnId(uidOrId: string | undefined): string | null {
  if (!uidOrId) return null;
  const m = uidOrId.match(/a:(\d+)/);
  if (m) return m[1];
  if (/^\d+$/.test(uidOrId)) return uidOrId;
  return null;
}

function splitSubtitle(subtitle: string | undefined) {
  if (!subtitle) return { team: null, position: null, league: null };
  const parts = subtitle.split("·").map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) return { team: null, position: null, league: null };
  if (parts.length === 1) return { team: parts[0], position: null, league: null };
  if (parts.length === 2) return { team: parts[0], position: parts[1], league: null };
  return { team: parts[0], position: parts[1], league: parts[2] };
}

async function searchEspnPlayers(query: string): Promise<GlobalSearchPlayer[]> {
  const url = new URL("https://site.web.api.espn.com/apis/search/v2");
  url.searchParams.set("query", query);
  url.searchParams.set("section", "soccer");
  url.searchParams.set("limit", "20");
  url.searchParams.set("type", "player");

  try {
    const r = await fetch(url, {
      headers: { accept: "application/json", "user-agent": "ScoutingReportAfrica/1.0" },
      next: { revalidate: 60 * 60 },
    });
    if (!r.ok) return [];
    const data = (await r.json()) as EspnSearch;

    const group =
      data.results?.find((g) => g.type === "player") ??
      data.results?.find((g) => g.contents?.some((c) => c.sport === "soccer"));

    if (!group?.contents) return [];

    return group.contents
      .filter((c) => c.sport === "soccer" && c.displayName)
      .map((c): GlobalSearchPlayer | null => {
        const espnId = extractEspnId(c.uid) ?? extractEspnId(c.id);
        const slug = espnId
          ? `espn-${espnId}`
          : c.displayName!
              .toLowerCase()
              .replace(/[^\w\s-]/g, "")
              .trim()
              .replace(/\s+/g, "-");
        const meta = splitSubtitle(c.subtitle);
        return {
          id: c.uid ?? c.id ?? c.displayName!,
          slug,
          name: c.displayName!,
          position: meta.position ?? c.description ?? null,
          team: meta.team,
          league: meta.league,
          photo: c.image?.default ?? null,
        };
      })
      .filter((p): p is GlobalSearchPlayer => p !== null)
      .slice(0, 8);
  } catch {
    return [];
  }
}

export async function globalSearch(query: string): Promise<GlobalSearchResult> {
  const q = query.trim();
  if (q.length < 2) return { players: [], teams: [] };

  const [scoutedPlayers, livePlayers, teamResults] = await Promise.all([
    searchPublishedPlayers(q, 6).catch(() => []),
    searchEspnPlayers(q),
    Promise.resolve(searchTeams(q, 6)),
  ]);

  const verified: GlobalSearchPlayer[] = scoutedPlayers.map((player) => ({
    id: player.id,
    slug: player.slug,
    name: player.fullName,
    position: player.primaryPositionCode,
    team: player.currentClub,
    league: null,
    photo: player.photoUrl,
  }));
  const verifiedNames = new Set(verified.map((player) => player.name.toLowerCase()));
  const players = [
    ...verified,
    ...livePlayers.filter((player) => !verifiedNames.has(player.name.toLowerCase())),
  ].slice(0, 8);

  return { players, teams: teamResults };
}

export async function searchGlobalOmni(query: string): Promise<OmniSearchResult[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const [matchedDb, espnRes, teams] = await Promise.all([
    searchPublishedPlayers(q, 6).catch(() => []),
    searchEspnPlayers(q).catch(() => []),
    Promise.resolve(searchTeams(q, 4)),
  ]);

  const results: OmniSearchResult[] = [];

  for (const p of matchedDb) {
    const flag = CAF_COUNTRIES.find((c) => c.code === p.nationalityCode)?.flagEmoji;
    results.push({
      id: `db-${p.id}`,
      title: p.fullName,
      subtitle: `${p.currentClub ?? "Free agent"} · ${p.primaryPositionCode ?? "Prospect"}`,
      url: `/players/${p.slug}`,
      type: "player",
      flagEmoji: flag,
      badge: "Verified Scout Dossier",
    });
  }

  // Live ESPN players
  for (const ep of espnRes) {
    if (!results.some((r) => r.title.toLowerCase() === ep.name.toLowerCase())) {
      results.push({
        id: `espn-${ep.id}`,
        title: ep.name,
        subtitle: `${ep.team ?? "Club"} · ${ep.position ?? "Player"} · ${ep.league ?? ""}`,
        url: `/players/${ep.slug}`,
        type: "player",
      });
    }
  }

  // Teams / Clubs
  for (const t of teams) {
    results.push({
      id: `team-${t.slug}`,
      title: t.name,
      subtitle: `${t.league} · ${t.country}`,
      url: `/teams/${t.slug}`,
      type: "club",
      badge: "Club Hub",
    });
  }

  return results.slice(0, 12);
}
