import type { Metadata } from "next";
import Link from "next/link";
import { Trophy, Globe2, Shield, ArrowRight, Search, Sparkles, Flame, CheckCircle2 } from "lucide-react";
import { getTeamRefBySlug } from "@/lib/features/teams/mock";

export const metadata: Metadata = {
  title: "African Football Competitions & Leagues Intelligence · ScoutingReport Africa",
  description:
    "Explore CAF continental tournaments, African domestic premier divisions, and elite European landing leagues.",
};

type LeagueGroup = {
  category: string;
  badge: string;
  description: string;
  leagues: {
    name: string;
    region: string;
    nation: string;
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
    description: "Core scouting territories for direct transfers, academy graduates, and tactical physical testing.",
    leagues: [
      {
        name: "Nigeria Premier Football League (NPFL)",
        region: "West Africa",
        nation: "Nigeria",
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
    description: "Primary European landing grounds where African prodigies adapt to continental tactical demands.",
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-7xl space-y-12 font-['Inter']">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[rgba(224,192,178,0.12)]">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-[#171B23] border border-[rgba(224,192,178,0.15)] text-[#FFB693] text-[10px] font-['Public_Sans'] font-extrabold uppercase tracking-widest">
            <Trophy className="h-3.5 w-3.5 text-[#CC5500]" />
            <span>Continental & Pathway League Telemetry</span>
          </div>
          <h1 className="font-['Public_Sans'] text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
            Competitions & Leagues
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Intelligence hubs covering CAF continental showcases, domestic premier divisions across Africa, and top European development gateways.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/players"
            className="px-4 py-2.5 rounded-[4px] bg-gradient-to-r from-[#9C3F00] to-[#CC5500] hover:opacity-95 text-white font-['Public_Sans'] font-black text-xs uppercase tracking-wider industrial-shadow transition-all"
          >
            Browse Players
          </Link>
          <Link
            href="/scout"
            className="px-4 py-2.5 rounded-[4px] bg-[#171B23] hover:bg-[#1E232D] text-white border border-[rgba(224,192,178,0.15)] font-['Public_Sans'] font-bold text-xs uppercase tracking-wider transition-all"
          >
            Scout Department
          </Link>
        </div>
      </div>

      {/* League Categories */}
      <div className="space-y-12">
        {LEAGUE_GROUPS.map((group) => (
          <section key={group.category} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[rgba(224,192,178,0.1)]">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="font-['Public_Sans'] text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
                    {group.category}
                  </h2>
                  <span className="rounded-[3px] bg-[#CC5500]/20 px-2 py-0.5 text-[10px] font-mono font-bold text-[#FFB693] border border-[#CC5500]/30">
                    {group.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{group.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.leagues.map((league) => (
                <div
                  key={league.name}
                  className="rounded-[6px] border border-[rgba(224,192,178,0.12)] bg-[#12151C] p-6 hover:border-[#CC5500]/50 hover:bg-[#171B23] transition-all flex flex-col justify-between space-y-6 shadow-xl"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{league.flag}</span>
                          <span className="text-[10px] font-['Public_Sans'] font-extrabold uppercase tracking-wider text-slate-400">
                            {league.region}
                          </span>
                        </div>
                        <h3 className="font-['Public_Sans'] text-base font-black text-white mt-1">
                          {league.name}
                        </h3>
                      </div>

                      <div className="rounded-[4px] bg-[#0C0E12] border border-[rgba(224,192,178,0.1)] px-2.5 py-1 text-center shrink-0">
                        <div className="text-[9px] font-['Public_Sans'] font-bold uppercase text-slate-400">
                          Index
                        </div>
                        <div className="font-mono text-xs font-black text-[#FFB693]">
                          {league.talentIndex}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-[rgba(224,192,178,0.06)]">
                      <div className="text-[10px] font-['Public_Sans'] font-extrabold uppercase tracking-widest text-[#FFB693]">
                        Tactical Environment
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {league.tacticalNote}
                      </p>
                    </div>

                    {/* Featured Clubs */}
                    <div className="space-y-2 pt-2 border-t border-[rgba(224,192,178,0.06)]">
                      <div className="text-[10px] font-['Public_Sans'] font-extrabold uppercase tracking-widest text-slate-400">
                        Key Monitored Clubs
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {league.featuredClubs.map((club) =>
                          // Only clubs in the team index have a page. Anything
                          // else renders as a plain chip rather than a 404.
                          getTeamRefBySlug(club.slug) ? (
                            <Link
                              key={club.slug}
                              href={`/teams/${club.slug}`}
                              className="inline-flex items-center gap-1 rounded-[3px] bg-[#0C0E12] border border-[rgba(224,192,178,0.1)] px-2.5 py-1 text-[11px] font-['Public_Sans'] font-bold text-slate-200 hover:border-[#CC5500]/40 hover:text-[#FFB693] transition-colors"
                            >
                              <span>{club.name}</span>
                              <ArrowRight className="h-2.5 w-2.5 opacity-50" />
                            </Link>
                          ) : (
                            <span
                              key={club.slug}
                              className="inline-flex items-center gap-1 rounded-[3px] bg-[#0C0E12] border border-[rgba(224,192,178,0.06)] px-2.5 py-1 text-[11px] font-['Public_Sans'] font-bold text-slate-500"
                            >
                              {club.name}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/players?q=${encodeURIComponent(league.nation)}`}
                    className="flex items-center justify-between pt-3 border-t border-[rgba(224,192,178,0.08)] text-xs font-['Public_Sans'] font-bold text-[#FFB693] hover:text-white transition-colors"
                  >
                    <span>View Players from this Region</span>
                    <ArrowRight className="h-3.5 w-3.5 text-[#CC5500]" />
                  </Link>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
