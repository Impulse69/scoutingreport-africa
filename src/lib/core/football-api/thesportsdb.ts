/**
 * TheSportsDB API Client
 * Free tier uses API key "3" for community queries (search players, teams, leagues, badges, cutouts, stadium photos).
 */

const THESPORTSDB_KEY = process.env.THESPORTSDB_API_KEY || "3";
const BASE_URL = `https://www.thesportsdb.com/api/v1/json/${THESPORTSDB_KEY}`;
const FETCH_TIMEOUT_MS = 8_000;

export type SportsDbPlayer = {
  idPlayer: string;
  strPlayer: string;
  strNationality: string;
  strTeam: string;
  strSport: string;
  dateBorn?: string;
  strNumber?: string;
  strPosition?: string;
  strHeight?: string;
  strWeight?: string;
  strThumb?: string | null;
  strCutout?: string | null;
  strRender?: string | null;
  strBanner?: string | null;
  strDescriptionEN?: string;
  strWage?: string;
  strSigning?: string;
  strGender?: string;
  strFacebook?: string;
  strTwitter?: string;
  strInstagram?: string;
};

export type SportsDbTeam = {
  idTeam: string;
  strTeam: string;
  strTeamShort?: string;
  strAlternate?: string;
  intFormedYear?: string;
  strSport: string;
  strLeague?: string;
  strStadium?: string;
  strKeywords?: string;
  strStadiumThumb?: string | null;
  strStadiumLocation?: string;
  intStadiumCapacity?: string;
  strBadge?: string | null;
  strLogo?: string | null;
  strBanner?: string | null;
  strJersey?: string | null;
  strDescriptionEN?: string;
};

export async function searchPlayersTheSportsDb(name: string): Promise<SportsDbPlayer[]> {
  if (!name || name.trim().length < 2) return [];
  try {
    const res = await fetch(`${BASE_URL}/searchplayers.php?p=${encodeURIComponent(name.trim())}`, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      next: { revalidate: 60 * 60 * 24 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { player: SportsDbPlayer[] | null };
    return (data.player ?? []).filter((p) => p.strSport === "Soccer");
  } catch {
    return [];
  }
}

export async function getPlayerDetailTheSportsDb(id: string): Promise<SportsDbPlayer | null> {
  if (!id) return null;
  try {
    const res = await fetch(`${BASE_URL}/lookupplayer.php?id=${encodeURIComponent(id)}`, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      next: { revalidate: 60 * 60 * 24 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { players: SportsDbPlayer[] | null };
    return data.players?.[0] ?? null;
  } catch {
    return null;
  }
}

export async function searchTeamTheSportsDb(teamName: string): Promise<SportsDbTeam | null> {
  if (!teamName || teamName.trim().length < 2) return null;
  try {
    const res = await fetch(`${BASE_URL}/searchteams.php?t=${encodeURIComponent(teamName.trim())}`, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      next: { revalidate: 60 * 60 * 24 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { teams: SportsDbTeam[] | null };
    return data.teams?.find((t) => t.strSport === "Soccer") ?? data.teams?.[0] ?? null;
  } catch {
    return null;
  }
}
