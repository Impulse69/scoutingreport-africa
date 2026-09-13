import { NextRequest, NextResponse } from "next/server";
import { searchPlayersTheSportsDb, searchTeamTheSportsDb } from "@/lib/core/football-api/thesportsdb";
import { searchPlayerApiFootball, checkApiFootballStatus } from "@/lib/core/football-api/api-football";
import { getStandingsFootballData } from "@/lib/core/football-api/football-data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // This endpoint reports upstream account/quota details and fans out to
  // several paid or rate-limited APIs. It is a local diagnostic, not a public
  // production feature.
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const query = (req.nextUrl.searchParams.get("q") || "Boniface")
    .trim()
    .slice(0, 100);

  const results: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    query,
  };

  // 1. Test TheSportsDB (Free API Key 3)
  try {
    const sportsDbPlayers = await searchPlayersTheSportsDb(query);
    const sportsDbTeam = await searchTeamTheSportsDb("Arsenal");
    results.theSportsDb = {
      status: "CONNECTED",
      description: "Free community tier (API key 3)",
      foundPlayers: sportsDbPlayers.length,
      samplePlayer: sportsDbPlayers[0]
        ? {
            name: sportsDbPlayers[0].strPlayer,
            nationality: sportsDbPlayers[0].strNationality,
            team: sportsDbPlayers[0].strTeam,
            cutout: sportsDbPlayers[0].strCutout,
            thumbnail: sportsDbPlayers[0].strThumb,
          }
        : null,
      sampleTeam: sportsDbTeam
        ? {
            team: sportsDbTeam.strTeam,
            badge: sportsDbTeam.strBadge,
            stadium: sportsDbTeam.strStadium,
          }
        : null,
    };
  } catch (err: unknown) {
    results.theSportsDb = {
      status: "ERROR",
      error: err instanceof Error ? err.message : String(err),
    };
  }

  // 2. Test ESPN Public Endpoint (Keyless / 100% Free)
  try {
    const espnRes = await fetch(
      `https://site.web.api.espn.com/apis/search/v2?query=${encodeURIComponent(query)}&section=soccer&limit=5&type=player`,
      {
        signal: AbortSignal.timeout(8_000),
        headers: {
          accept: "application/json",
          "user-agent": "ScoutingReportAfrica/1.0",
        },
      }
    );
    results.espnPublic = {
      status: espnRes.ok ? "CONNECTED" : "FAILED",
      statusCode: espnRes.status,
      description: "Keyless public soccer search & stats endpoint",
    };
  } catch (err: unknown) {
    results.espnPublic = {
      status: "ERROR",
      error: err instanceof Error ? err.message : String(err),
    };
  }

  // 3. Test API-Football (api-sports.io)
  const hasApiFootballKey = !!process.env.API_FOOTBALL_KEY || !!process.env.RAPIDAPI_KEY;
  if (hasApiFootballKey) {
    try {
      const [apiFootballData, accountStatus] = await Promise.all([
        searchPlayerApiFootball(query),
        checkApiFootballStatus(),
      ]);
      results.apiFootball = {
        status: "CONNECTED",
        subscription: accountStatus?.plan ?? "Free",
        quota: `${accountStatus?.requestsUsed ?? 0} / ${accountStatus?.dailyLimit ?? 100} reqs today`,
        foundPlayers: apiFootballData.length,
        sample: apiFootballData[0]
          ? {
              name: apiFootballData[0].player.name,
              nationality: apiFootballData[0].player.nationality,
              birthCountry: apiFootballData[0].player.birth.country,
              photo: apiFootballData[0].player.photo,
            }
          : null,
      };
    } catch (err: unknown) {
      results.apiFootball = {
        status: "ERROR",
        error: err instanceof Error ? err.message : String(err),
      };
    }
  } else {
    results.apiFootball = {
      status: "OPTIONAL_NOT_CONFIGURED",
      info: "Add API_FOOTBALL_KEY in .env.local to activate (100 req/day free tier for domestic leagues).",
    };
  }

  // 4. Test Football-Data.org
  const hasFootballDataKey = !!process.env.FOOTBALL_DATA_KEY;
  if (hasFootballDataKey) {
    try {
      const standings = await getStandingsFootballData("PL");
      results.footballData = {
        status: "CONNECTED",
        competition: "Premier League (PL)",
        leader: standings?.[0]?.table?.[0]?.team?.name ?? "Active",
        hasStandings: !!standings && standings.length > 0,
      };
    } catch (err: unknown) {
      results.footballData = {
        status: "ERROR",
        error: err instanceof Error ? err.message : String(err),
      };
    }
  } else {
    results.footballData = {
      status: "OPTIONAL_NOT_CONFIGURED",
      info: "Add FOOTBALL_DATA_KEY in .env.local to activate (free 10 req/min for major leagues).",
    };
  }

  return NextResponse.json(results, { status: 200 });
}
