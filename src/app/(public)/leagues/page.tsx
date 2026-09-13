import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Trophy, Globe, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Competitions & Leagues",
  description:
    "Explore CAF continental tournaments, African domestic premier divisions, and elite European landing leagues.",
};

type LeagueGroup = {
  category: string;
  badge: string;
  icon: typeof Trophy;
  description: string;
  leagues: {
    name: string;
    region: string;
    nation: string;
    natCode?: string;
    flag: string;
    featuredClubs: { name: string; slug: string }[];
    tacticalNote: string;
    talentIndex: string;
  }[];
};

const LEAGUE_GROUPS: LeagueGroup[] = [
  {
    category: "CAF Continental Showcases",
    badge: "Continental Apex",
    icon: Trophy,
    description: "The highest standard of club competition in Africa, testing players in high-pressure tactical atmospheres.",
    leagues: [
      {
        name: "CAF Champions League",
        region: "All-Africa Elite",
        nation: "Pan-African",
        flag: "🌍",
        featuredClubs: [
          { name: "Al Ahly", slug: "al-ahly" },
          { name: "Mamelodi Sundowns", slug: "mamelodi-sundowns" },
          { name: "Esperance de Tunis", slug: "esperance" },
          { name: "TP Mazembe", slug: "tp-mazembe" },
        ],
        tacticalNote: "High physical duels, sophisticated game management, senior international benchmark.",
        talentIndex: "9.4 / 10",
      },
      {
        name: "CAF Confederation Cup",
        region: "Continental Secondary",
        nation: "Pan-African",
        flag: "🏆",
        featuredClubs: [
          { name: "Zamalek", slug: "zamalek" },
          { name: "RS Berkane", slug: "rs-berkane" },
          { name: "USM Alger", slug: "usm-alger" },
        ],
        tacticalNote: "Breakout tournament for aggressive counter-attacking wingers and transitional number 8s.",
        talentIndex: "8.6 / 10",
      },
    ],
  },
  {
    category: "African Domestic Premier Divisions",
    badge: "Grassroots & Senior Pro",
    icon: Globe,
    description: "Core scouting territories for direct transfers, academy graduates, and tactical physical testing.",
    leagues: [
      {
        name: "Nigeria Premier Football League (NPFL)",
        region: "West Africa",
        nation: "Nigeria",
        natCode: "NG",
        flag: "🇳🇬",
        featuredClubs: [
          { name: "Enyimba FC", slug: "enyimba" },
          { name: "Remo Stars", slug: "remo-stars" },
          { name: "Rivers United", slug: "rivers-united" },
          { name: "Rangers International", slug: "rangers-intl" },
        ],
        tacticalNote: "High direct tempo, robust physical duels, explosive 1v1 wingers.",
        talentIndex: "8.9 / 10",
      },
      {
        name: "South African Premier Division (PSL)",
        region: "Southern Africa",
        nation: "South Africa",
        natCode: "ZA",
        flag: "🇿🇦",
        featuredClubs: [
          { name: "Mamelodi Sundowns", slug: "mamelodi-sundowns" },
          { name: "Orlando Pirates", slug: "orlando-pirates" },
          { name: "Kaizer Chiefs", slug: "kaizer-chiefs" },
          { name: "Stellenbosch FC", slug: "stellenbosch" },
        ],
        tacticalNote: "Complex possession setups, positional rotations, high technical baseline.",
        talentIndex: "8.8 / 10",
      },
      {
        name: "Botola Pro 1",
        region: "North Africa",
        nation: "Morocco",
        natCode: "MA",
        flag: "🇲🇦",
        featuredClubs: [
          { name: "Wydad AC", slug: "wydad" },
          { name: "Raja CA", slug: "raja" },
          { name: "AS FAR", slug: "as-far" },
          { name: "Fath Union Sport", slug: "fus-rabat" },
        ],
        tacticalNote: "Tactically rigid pressing, disciplined backlines, high work-rate box-to-box midfielders.",
        talentIndex: "9.1 / 10",
      },
      {
        name: "Egyptian Premier League",
        region: "North Africa",
        nation: "Egypt",
        natCode: "EG",
        flag: "🇪🇬",
        featuredClubs: [
          { name: "Al Ahly", slug: "al-ahly" },
          { name: "Zamalek SC", slug: "zamalek" },
          { name: "Pyramids FC", slug: "pyramids" },
          { name: "Future FC", slug: "future-fc" },
        ],
        tacticalNote: "High match-reading intelligence, structured central midfields, decisive set-pieces.",
        talentIndex: "9.2 / 10",
      },
      {
        name: "Ghana Premier League",
        region: "West Africa",
        nation: "Ghana",
        natCode: "GH",
        flag: "🇬🇭",
        featuredClubs: [
          { name: "Asante Kotoko", slug: "asante-kotoko" },
          { name: "Hearts of Oak", slug: "hearts-of-oak" },
          { name: "Medeama SC", slug: "medeama" },
        ],
        tacticalNote: "Elite academy feeders (Right to Dream pipeline), dynamic ball-carriers.",
        talentIndex: "8.5 / 10",
      },
    ],
  },
  {
    category: "European Landing & Pathway Leagues",
    badge: "Pathway Stepping Stones",
    icon: Shield,
    description: "Primary European landing grounds where African players most often develop before top-five moves.",
    leagues: [
      {
        name: "Belgian Pro League",
        region: "Western Europe",
        nation: "Belgium",
        flag: "🇧🇪",
        featuredClubs: [
          { name: "KRC Genk", slug: "krc-genk" },
          { name: "Club Brugge", slug: "club-brugge" },
          { name: "Royale Union SG", slug: "union-sg" },
          { name: "Gent", slug: "gent" },
        ],
        tacticalNote: "Proven track record developing African talents (Boniface, Osimhen, Ndidi, El Khannouss).",
        talentIndex: "9.5 / 10",
      },
      {
        name: "French Ligue 1 & Ligue 2",
        region: "Western Europe",
        nation: "France",
        flag: "🇫🇷",
        featuredClubs: [
          { name: "AS Monaco", slug: "as-monaco" },
          { name: "Lille OSC", slug: "lille" },
          { name: "Stade Rennais", slug: "rennes" },
          { name: "Metz (Génération Foot)", slug: "metz" },
        ],
        tacticalNote: "Deep historical partnerships with West African academies (Génération Foot, Diambars).",
        talentIndex: "9.6 / 10",
      },
      {
        name: "Liga Portugal",
        region: "Southern Europe",
        nation: "Portugal",
        flag: "🇵🇹",
        featuredClubs: [
          { name: "Sporting CP", slug: "sporting" },
          { name: "SL Benfica", slug: "benfica" },
          { name: "FC Porto", slug: "porto" },
          { name: "SC Braga", slug: "braga" },
        ],
        tacticalNote: "Strong recruitment focus across Portuguese-speaking African nations (Angola, Mozambique, Cape Verde).",
        talentIndex: "9.3 / 10",
      },
    ],
  },
];

export default function LeaguesPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-6 py-10">
      {/* Clean High-Contrast Header */}
      <div className="flex flex-col justify-between gap-6 border-b border-border pb-8 md:flex-row md:items-end">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl text-foreground">
            Competitions & Leagues
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            CAF continental championships, domestic premier divisions across Africa, and primary European landing pathways.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/players"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40"
          >
            Browse Players
          </Link>
          <Link
            href="/scout"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40"
          >
            Scout Workspace
          </Link>
        </div>
      </div>

      {/* League groups */}
      <div className="space-y-12">
        {LEAGUE_GROUPS.map((group) => {
          const Icon = group.icon;
          return (
            <section key={group.category} className="space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">{group.category}</h2>
                    <p className="text-xs text-muted-foreground sm:text-sm">
                      {group.description}
                    </p>
                  </div>
                </div>
                <span className="hidden rounded-md bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground sm:inline-block">
                  {group.badge}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {group.leagues.map((league) => (
                  <div
                    key={league.name}
                    className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                            <span className="text-lg leading-none">{league.flag}</span>
                            <span>{league.region}</span>
                          </div>
                          <h3 className="mt-1.5 text-base font-bold text-foreground">{league.name}</h3>
                        </div>
                        <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                          {league.talentIndex}
                        </span>
                      </div>

                      <div className="border-t border-border/80 pt-3">
                        <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                          {league.tacticalNote}
                        </p>
                      </div>

                      {/* Featured Clubs */}
                      <div className="space-y-2 border-t border-border/80 pt-3">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                          Tracked Clubs & Academies
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {league.featuredClubs.map((club) => (
                            <Link
                              key={club.slug}
                              href={`/players?q=${encodeURIComponent(club.name)}`}
                              className="inline-flex items-center gap-1 rounded-lg border border-border bg-muted/60 px-2.5 py-1 text-xs font-medium transition-colors hover:bg-primary/10 hover:text-primary hover:border-primary/40 focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40"
                            >
                              <span>{club.name}</span>
                              <ArrowRight className="h-2.5 w-2.5 opacity-50" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Link
                      href={
                        league.natCode
                          ? `/players?nat=${league.natCode}`
                          : league.nation === "Pan-African"
                            ? "/players"
                            : `/players?q=${encodeURIComponent(league.nation)}`
                      }
                      className="mt-5 flex items-center justify-between border-t border-border pt-3 text-xs sm:text-sm font-semibold text-primary hover:underline focus:outline-none focus-visible:outline-none"
                    >
                      <span>
                        {league.nation === "Pan-African"
                          ? "Browse all continental players"
                          : `Filter players from ${league.nation}`}
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
