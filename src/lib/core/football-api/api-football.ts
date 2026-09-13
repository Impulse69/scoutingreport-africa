/**
 * API-Football (API-Sports) Client
 * Free tier offers 100 requests/day for African leagues, squads, player statistics, transfers, injuries.
 * Docs: https://www.api-football.com/documentation-v3
 */

const API_FOOTBALL_KEY = process.env.API_FOOTBALL_KEY || process.env.RAPIDAPI_KEY || "";
const BASE_URL = "https://v3.football.api-sports.io";
const FETCH_TIMEOUT_MS = 8_000;

export type ApiFootballPlayer = {
  player: {
    id: number;
    name: string;
    firstname: string;
    lastname: string;
    age: number;
    birth: {
      date: string;
      place: string | null;
      country: string;
    };
    nationality: string;
    height: string | null;
    weight: string | null;
    injured: boolean;
    photo: string;
  };
  statistics: Array<{
    team: {
      id: number;
      name: string;
      logo: string;
    };
    league: {
      id: number;
      name: string;
      country: string;
      logo: string;
      flag: string | null;
      season: number;
    };
    games: {
      appearences: number;
      lineups: number;
      minutes: number;
      number: number | null;
      position: string;
      rating: string | null;
      captain: boolean;
    };
    goals: {
      total: number | null;
      conceded: number | null;
      assists: number | null;
      saves: number | null;
    };
    passes: {
      total: number | null;
      key: number | null;
      accuracy: string | null;
    };
    tackles: {
      total: number | null;
      blocks: number | null;
      interceptions: number | null;
    };
    duels: {
      total: number | null;
      won: number | null;
    };
    dribbles: {
      attempts: number | null;
      success: number | null;
      past: number | null;
    };
    fouls: {
      drawn: number | null;
      committed: number | null;
    };
    cards: {
      yellow: number;
      yellowred: number;
      red: number;
    };
  }>;
};

export async function checkApiFootballStatus(): Promise<{
  active: boolean;
  plan: string;
  requestsUsed: number;
  dailyLimit: number;
} | null> {
  if (!API_FOOTBALL_KEY) return null;
  try {
    const res = await fetch(`${BASE_URL}/status`, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: {
        "x-apisports-key": API_FOOTBALL_KEY,
      },
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const resp = data.response;
    return {
      active: resp?.subscription?.active ?? false,
      plan: resp?.subscription?.plan ?? "Free",
      requestsUsed: resp?.requests?.current ?? 0,
      dailyLimit: resp?.requests?.limit_day ?? 100,
    };
  } catch {
    return null;
  }
}

export async function searchPlayerApiFootball(search: string): Promise<ApiFootballPlayer[]> {
  if (!API_FOOTBALL_KEY || !search || search.trim().length < 3) return [];
  try {
    const res = await fetch(`${BASE_URL}/players/profiles?search=${encodeURIComponent(search.trim())}`, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: {
        "x-apisports-key": API_FOOTBALL_KEY,
        "x-rapidapi-key": API_FOOTBALL_KEY,
      },
      next: { revalidate: 60 * 60 * 24 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { response?: ApiFootballPlayer[] };
    return data.response ?? [];
  } catch {
    return [];
  }
}
