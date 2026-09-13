/**
 * Football-Data.org API Client
 * Free tier offers 12 major competitions, team rosters, standings, fixtures with 10 req/min.
 * Docs: https://www.football-data.org/documentation/quickstart
 */

const FOOTBALL_DATA_KEY = process.env.FOOTBALL_DATA_KEY || "";
const BASE_URL = "https://api.football-data.org/v4";
const FETCH_TIMEOUT_MS = 8_000;

export type FootballDataStanding = {
  stage: string;
  type: string;
  group: string | null;
  table: Array<{
    position: number;
    team: {
      id: number;
      name: string;
      shortName: string;
      tla: string;
      crest: string;
    };
    playedGames: number;
    won: number;
    draw: number;
    lost: number;
    points: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
  }>;
};

export async function getStandingsFootballData(competitionCode: string): Promise<FootballDataStanding[] | null> {
  if (!FOOTBALL_DATA_KEY || !competitionCode) return null;
  try {
    const res = await fetch(`${BASE_URL}/competitions/${competitionCode}/standings`, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: {
        "X-Auth-Token": FOOTBALL_DATA_KEY,
      },
      next: { revalidate: 60 * 60 * 12 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { standings?: FootballDataStanding[] };
    return data.standings ?? null;
  } catch {
    return null;
  }
}
