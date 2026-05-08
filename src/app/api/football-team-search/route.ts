import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

type EspnSearchResponse = {
  results?: Array<{
    type?: string;
    contents?: EspnTeamContent[];
  }>;
};

type EspnTeamContent = {
  id?: string;
  uid?: string;
  sport?: string;
  displayName?: string;
  subtitle?: string;
  defaultLeagueSlug?: string;
  link?: {
    web?: string;
  };
  image?: {
    default?: string;
  };
};

type TeamSearchResult = {
  id: string;
  name: string;
  league: string;
  leagueSlug: string | null;
  logo: string | null;
  url: string | null;
};

function normalizeTeam(content: EspnTeamContent): TeamSearchResult | null {
  if (content.sport !== "soccer" || !content.displayName) return null;

  const id = content.uid ?? content.id ?? content.displayName;

  return {
    id,
    name: content.displayName,
    league: content.subtitle ?? "Football",
    leagueSlug: content.defaultLeagueSlug ?? null,
    logo: content.image?.default ?? null,
    url: content.link?.web ?? null,
  };
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (query.length < 2) {
    return Response.json({ teams: [] satisfies TeamSearchResult[] });
  }

  const upstreamUrl = new URL("https://site.web.api.espn.com/apis/search/v2");
  upstreamUrl.searchParams.set("query", query);
  upstreamUrl.searchParams.set("section", "soccer");
  upstreamUrl.searchParams.set("limit", "20");

  const response = await fetch(upstreamUrl, {
    headers: {
      accept: "application/json",
      "user-agent": "ScoutingReportAfrica/1.0",
    },
    next: { revalidate: 60 * 60 },
  });

  if (!response.ok) {
    return Response.json({ teams: [] satisfies TeamSearchResult[] }, { status: 502 });
  }

  const data = (await response.json()) as EspnSearchResponse;
  const teamGroup = data.results?.find((result) => result.type === "team");
  const teams =
    teamGroup?.contents
      ?.map(normalizeTeam)
      .filter((team): team is TeamSearchResult => team !== null) ?? [];

  return Response.json({ teams });
}
