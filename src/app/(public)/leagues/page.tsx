import type { Metadata } from "next";
import Link from "next/link";
import { Trophy, Globe2, Shield, ArrowRight, Search, Sparkles, Flame, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "African Football Competitions & Leagues Intelligence",
  description:
    "Explore CAF continental tournaments, African domestic premier divisions, and elite European landing leagues.",
};

type LeagueGroup = {
  category: string;
  badge: string;
  badgeColor: string;
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
    badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
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
    badge: "Domestic Pipelines",
    badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    description: "Ground zero for emerging wunderkinds and direct academy graduates across key footballing nations.",
    leagues: [
      {
        name: "NPFL (Nigeria Premier Football League)",
        region: "West Africa (WAFU)",
        nation: "Nigeria",
        flag: "🇳🇬",
        featuredClubs: [
          { name: "Enyimba FC", slug: "enyimba" },
          { name: "Remo Stars", slug: "remo-stars" },
          { name: "Rivers United", slug: "rivers-united" },
        ],
        tacticalNote: "Rapid transitional tempo, exceptional raw athletic physical power, 1v1 dribbling volume.",
        talentIndex: "9.1 / 10",
      },
      {
        name: "PSL Premiership (Betway Premiership)",
        region: "Southern Africa (COSAFA)",
        nation: "South Africa",
        flag: "🇿🇦",
        featuredClubs: [
          { name: "Mamelodi Sundowns", slug: "mamelodi-sundowns" },
          { name: "Orlando Pirates", slug: "orlando-pirates" },
          { name: "Kaizer Chiefs", slug: "kaizer-chiefs" },
        ],
        tacticalNote: "High technical precision, positional possession play, modern tactical infrastructure.",
        talentIndex: "8.9 / 10",
      },
      {
        name: "Botola Pro Inwi",
        region: "North Africa (UNAF)",
        nation: "Morocco",
        flag: "🇲🇦",
        featuredClubs: [
          { name: "Wydad AC", slug: "wydad" },
          { name: "Raja Casablanca", slug: "raja" },
          { name: "FAR Rabat", slug: "far-rabat" },
        ],
        tacticalNote: "Exceptional academy technical baseline, tactical discipline, high pressing resistance.",
        talentIndex: "9.0 / 10",
      },
      {
        name: "Egyptian Premier League",
        region: "North Africa (UNAF)",
        nation: "Egypt",
        flag: "🇪🇬",
        featuredClubs: [
          { name: "Al Ahly", slug: "al-ahly" },
          { name: "Pyramids FC", slug: "pyramids" },
          { name: "Zamalek", slug: "zamalek" },
        ],
        tacticalNote: "Tactically rigid defensive blocks, high game-tempo under pressure, senior composure.",
        talentIndex: "8.8 / 10",
      },
      {
        name: "Ghana Premier League",
        region: "West Africa (WAFU)",
        nation: "Ghana",
        flag: "🇬🇭",
        featuredClubs: [
          { name: "Asante Kotoko", slug: "asante-kotoko" },
          { name: "Hearts of Oak", slug: "hearts-of-oak" },
          { name: "Medeama SC", slug: "medeama" },
        ],
        tacticalNote: "Dynamic midfield engines, direct line-breaking passes, agile forward movement.",
        talentIndex: "8.5 / 10",
      },
    ],
  },
  {
    category: "Elite Landing Leagues in Europe",
    badge: "Diaspora & Step-Up",
    badgeColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
    description: "The primary European launchpads where scouted African players transition to UEFA competition.",
    leagues: [
      {
        name: "Belgian Pro League",
        region: "Western Europe",
        nation: "Belgium",
        flag: "🇧🇪",
        featuredClubs: [
          { name: "Club Brugge", slug: "club-brugge" },
          { name: "Genk", slug: "genk" },
          { name: "Union Saint-Gilloise", slug: "usg" },
        ],
        tacticalNote: "The #1 European springboard for African strikers and wingers (Osimhen, Boniface, Doku lineage).",
        talentIndex: "9.6 / 10",
      },
      {
        name: "French Ligue 1 & Ligue 2",
        region: "Western Europe",
        nation: "France",
        flag: "🇫🇷",
        featuredClubs: [
          { name: "AS Monaco", slug: "monaco" },
          { name: "Olympique Marseille", slug: "marseille" },
          { name: "Lille OSC", slug: "lille" },
        ],
        tacticalNote: "High-intensity athletic transition, seamless cultural integration for Francophone talents.",
        talentIndex: "9.5 / 10",
      },
      {
        name: "Liga Portugal",
        region: "Southern Europe",
        nation: "Portugal",
        flag: "🇵🇹",
        featuredClubs: [
          { name: "Sporting CP", slug: "sporting" },
          { name: "FC Porto", slug: "porto" },
          { name: "Benfica", slug: "benfica" },
        ],
        tacticalNote: "Supreme technical coaching, tactical shape development, stepping stone to Premier League.",
        talentIndex: "9.2 / 10",
      },
    ],
  },
];

export default function LeaguesPage() {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-10 max-w-7xl space-y-12">
      {/* Header */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#0c161d] via-[#0e1921] to-[#0a1116] p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-wider">
            <Trophy className="h-3.5 w-3.5" /> Continental Competitions Hub
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Leagues & Recruitment Pathways
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Understanding league context, tempo demands, and tactical environments is critical when projecting how an African talent will step up to elite international competition.
          </p>
        </div>
      </div>

      {/* League Categories */}
      <div className="space-y-14">
        {LEAGUE_GROUPS.map((group) => (
          <div key={group.category} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${group.badgeColor}`}>
                    {group.badge}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white">{group.category}</h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">{group.description}</p>
              </div>

              <Link
                href="/players"
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 shrink-0"
              >
                Scan Players in Division →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.leagues.map((league) => (
                <div
                  key={league.name}
                  className="rounded-3xl border border-white/10 bg-[#0c1218] p-6 hover:border-emerald-500/30 hover:bg-[#101820] transition-all flex flex-col justify-between space-y-5 shadow-lg"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{league.flag}</span>
                        <div>
                          <h3 className="font-black text-base text-white">{league.name}</h3>
                          <p className="text-[11px] text-slate-400">{league.region}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">Talent Index</span>
                        <span className="font-mono text-xs font-black text-emerald-400">{league.talentIndex}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#131d25] border border-white/5 space-y-1">
                      <p className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
                        <Sparkles className="h-3 w-3" /> Scout Tactical Profile
                      </p>
                      <p className="text-xs text-slate-300 leading-relaxed">{league.tacticalNote}</p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 mb-1.5">Top Clubs:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {league.featuredClubs.map((club) => (
                          <Link
                            key={club.name}
                            href={`/players?q=${encodeURIComponent(club.name)}`}
                            className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-300 text-slate-300 border border-white/5 transition-colors"
                          >
                            {club.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <Link
                      href={`/players?q=${encodeURIComponent(league.nation)}`}
                      className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                    >
                      Browse {league.nation} Talents <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
