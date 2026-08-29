import Link from "next/link";
import {
  ArrowRight,
  Users,
  Target,
  Compass,
  Activity,
  ScrollText,
  TrendingUp,
  Sparkles,
  Shield,
  Search,
  CheckCircle2,
  LayoutDashboard,
  Flame,
  Globe2,
  Layers,
  BarChart3,
  Award
} from "lucide-react";
import { MarketingNav } from "@/components/shared/nav/marketing-nav";
import { DarkFooter } from "@/components/shared/nav/dark-footer";
import { PricingPlans } from "./pricing-plans";
import { NewsletterForm } from "./newsletter-form";
import { PlatformDashboard } from "./platform-dashboard";
import { getCurrentUser } from "@/lib/core/auth-helpers";
import { listPublishedPlayers } from "@/lib/features/players/queries";
import { listTopTeams } from "@/lib/features/teams/mock";
import { POSITIONS } from "@/lib/shared/constants";

export default async function LandingPage() {
  const [me, players] = await Promise.all([
    getCurrentUser(),
    listPublishedPlayers(6),
  ]);

  const featured = {
    players: players.map((p) => ({
      slug: p.slug,
      name: p.fullName,
      tail:
        POSITIONS.find((pos) => pos.code === p.primaryPositionCode)?.code ??
        undefined,
    })),
    teams: listTopTeams(6).map((t) => ({
      slug: t.slug,
      name: t.name,
      tail: t.country,
    })),
  };

  const initialAuth = me
    ? {
        email: me.email ?? null,
        displayName: me.email?.split("@")[0] ?? null,
        role: me.role,
      }
    : null;

  return (
    <div className="flex flex-col min-h-screen bg-[#080B0E] text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 overflow-x-hidden">
      <MarketingNav initialAuth={initialAuth} featured={featured} />

      {/* Hero Section */}
      <section className="relative pt-16 md:pt-24 pb-20 overflow-hidden border-b border-white/5">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider shadow-inner">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Next-Gen African Football Intelligence</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.08]">
              Unearth Africa’s <br className="hidden sm:inline" />
              <span className="gradient-text-emerald">Generational Talents</span> & Prodigies.
            </h1>

            {/* Subhead */}
            <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Bespoke scouting dossiers, tactical radar profiling, and real-time database tracking across 54 CAF associations and global landing leagues.
            </p>

            {/* Hero Quick Search Bar */}
            <div className="pt-2 max-w-xl mx-auto">
              <form action="/players" method="GET" className="relative flex items-center group">
                <Search className="absolute left-4 h-5 w-5 text-emerald-400 pointer-events-none" />
                <input
                  type="text"
                  name="q"
                  placeholder="Search player, position, or CAF nation (e.g. Boniface, Striker, Senegal)…"
                  className="w-full h-14 pl-12 pr-32 rounded-2xl bg-[#0e161c]/90 border border-emerald-500/30 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 shadow-xl transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 h-10 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-md transition-all flex items-center gap-1.5"
                >
                  <span>Explore</span> <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>

              {/* Quick Filter Tags */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-slate-400">
                <span className="text-[11px] uppercase font-bold text-slate-400">Trending:</span>
                {[
                  { label: "Victor Boniface", href: "/players/victor-boniface" },
                  { label: "Mohammed Kudus", href: "/players/mohammed-kudus" },
                  { label: "Lamine Camara", href: "/players/lamine-camara" },
                  { label: "Attacking Prodigies", href: "/players?pos=FW" },
                ].map((tag) => (
                  <Link
                    key={tag.label}
                    href={tag.href}
                    className="px-2.5 py-0.5 rounded-lg bg-white/5 hover:bg-emerald-500/15 hover:text-emerald-300 border border-white/5 transition-all text-[11px]"
                  >
                    {tag.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              {me ? (
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto h-12 px-8 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all"
                >
                  <LayoutDashboard className="h-4 w-4" /> Open Command Hub
                </Link>
              ) : (
                <Link
                  href="/auth/sign-up"
                  className="w-full sm:w-auto h-12 px-8 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all"
                >
                  <Sparkles className="h-4 w-4" /> Get Free Scout Access
                </Link>
              )}
              <Link
                href="/players"
                className="w-full sm:w-auto h-12 px-8 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider border border-white/10 flex items-center justify-center gap-2 transition-all"
              >
                <Users className="h-4 w-4 text-emerald-400" /> Browse 200+ Players
              </Link>
            </div>
          </div>
        </div>

        {/* Live Scout Ticker */}
        <div className="mt-14 border-y border-white/5 bg-[#0b1015]/80 py-3 overflow-hidden backdrop-blur-md">
          <div className="container mx-auto px-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 shrink-0 pr-6 border-r border-white/10">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono uppercase font-bold text-[10px] tracking-widest text-emerald-400">
                LIVE SCOUT DOSSIERS
              </span>
            </div>
            <div className="flex items-center gap-8 overflow-x-auto no-scrollbar py-1 text-slate-300 font-medium text-xs">
              <Link href="/players/victor-boniface" className="flex items-center gap-2 hover:text-emerald-400 transition-colors shrink-0">
                <span>🇳🇬 Victor Boniface</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">8.6</span>
              </Link>
              <span className="text-slate-700">•</span>
              <Link href="/players/mohammed-kudus" className="flex items-center gap-2 hover:text-emerald-400 transition-colors shrink-0">
                <span>🇬🇭 Mohammed Kudus</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">8.7</span>
              </Link>
              <span className="text-slate-700">•</span>
              <Link href="/players/lamine-camara" className="flex items-center gap-2 hover:text-emerald-400 transition-colors shrink-0">
                <span>🇸🇳 Lamine Camara</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">8.3</span>
              </Link>
              <span className="text-slate-700">•</span>
              <Link href="/players/nicolas-jackson" className="flex items-center gap-2 hover:text-emerald-400 transition-colors shrink-0">
                <span>🇸🇳 Nicolas Jackson</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">8.2</span>
              </Link>
              <span className="text-slate-700">•</span>
              <Link href="/players/simon-adingra" className="flex items-center gap-2 hover:text-emerald-400 transition-colors shrink-0">
                <span>🇨🇮 Simon Adingra</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">8.1</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Platform Showcase */}
      <section className="py-20 bg-[#080B0E] relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold uppercase tracking-wider">
              <Flame className="h-3.5 w-3.5 text-amber-400" /> Interactive Intelligence Engine
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Deep Talent Evaluation Matrix
            </h2>
            <p className="text-sm text-slate-400">
              Explore tactical percentile ranks, statistical radars, and human-scouted evaluation notes for top African stars and emerging wunderkinds.
            </p>
          </div>

          <PlatformDashboard />
        </div>
      </section>

      {/* CAF Regional Scouting Zones */}
      <section className="py-20 border-t border-white/5 bg-[#0b1015] relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-14 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-bold uppercase tracking-wider">
              <Globe2 className="h-3.5 w-3.5" /> Continental Coverage
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Scouting Across All 5 CAF Zones
            </h2>
            <p className="text-sm text-slate-400">
              Direct intelligence from local domestic academies, regional tournaments, and European landing pipelines.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                zone: "WAFU Zone A & B",
                region: "West Africa",
                countries: ["Nigeria 🇳🇬", "Ghana 🇬🇭", "Senegal 🇸🇳", "Ivory Coast 🇨🇮", "Mali 🇲🇱"],
                prospectCount: "85+ Scouted",
                accent: "border-emerald-500/30 bg-emerald-500/5",
                tagColor: "text-emerald-400 bg-emerald-500/10",
              },
              {
                zone: "UNAF",
                region: "North Africa",
                countries: ["Morocco 🇲🇦", "Egypt 🇪🇬", "Algeria 🇩🇿", "Tunisia 🇹🇳"],
                prospectCount: "48+ Scouted",
                accent: "border-amber-500/30 bg-amber-500/5",
                tagColor: "text-amber-400 bg-amber-500/10",
              },
              {
                zone: "COSAFA",
                region: "Southern Africa",
                countries: ["South Africa 🇿🇦", "Zambia 🇿🇲", "Angola 🇦🇴", "Zimbabwe 🇿🇼"],
                prospectCount: "36+ Scouted",
                accent: "border-cyan-500/30 bg-cyan-500/5",
                tagColor: "text-cyan-400 bg-cyan-500/10",
              },
              {
                zone: "CECAFA",
                region: "East & Central Africa",
                countries: ["Kenya 🇰🇪", "Uganda 🇺🇬", "Tanzania 🇹🇿", "Ethiopia 🇪🇹"],
                prospectCount: "24+ Scouted",
                accent: "border-indigo-500/30 bg-indigo-500/5",
                tagColor: "text-indigo-400 bg-indigo-500/10",
              },
              {
                zone: "UNIFFAC",
                region: "Central Africa",
                countries: ["Cameroon 🇨🇲", "DR Congo 🇨🇩", "Gabon 🇬🇦", "Congo 🇨🇬"],
                prospectCount: "32+ Scouted",
                accent: "border-rose-500/30 bg-rose-500/5",
                tagColor: "text-rose-400 bg-rose-500/10",
              },
              {
                zone: "Global Diaspora",
                region: "European Landing Leagues",
                countries: ["Belgium 🇧🇪", "France 🇫🇷", "Portugal 🇵🇹", "Turkey 🇹🇷"],
                prospectCount: "110+ Tracked",
                accent: "border-purple-500/30 bg-purple-500/5",
                tagColor: "text-purple-400 bg-purple-500/10",
              },
            ].map((z) => (
              <div
                key={z.zone}
                className={`p-6 rounded-3xl border ${z.accent} backdrop-blur-xl flex flex-col justify-between space-y-4 hover:scale-[1.02] transition-transform`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${z.tagColor}`}>
                      {z.region}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-300">
                      {z.prospectCount}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{z.zone}</h3>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {z.countries.map((c) => (
                      <span
                        key={c}
                        className="text-xs px-2.5 py-1 rounded-lg bg-white/5 text-slate-300 border border-white/5"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  href="/players"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 pt-2"
                >
                  Explore Zone Prospects →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scouting Methodology & Feature Pillars */}
      <section className="py-20 bg-[#080B0E] border-t border-white/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold uppercase tracking-wider">
              <Award className="h-3.5 w-3.5" /> Analytical Rigor
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Four Pillars of Talent Verification
            </h2>
            <p className="text-sm text-slate-400">
              How our on-ground scouting network and data scientists evaluate high-potential players.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: BarChart3,
                title: "Quantitative Metrics",
                desc: "Granular per-90 metrics, expected goals (xG), progressive actions, and physical recovery load.",
              },
              {
                icon: ScrollText,
                title: "Human Scout Reports",
                desc: "Verified on-site evaluations analyzing mental composure, tactical intelligence, and coachability.",
              },
              {
                icon: Target,
                title: "Tactical Role Fit",
                desc: "Percentile pizzas and role classification (e.g. Sweeper Keeper, Inverted Winger, Press-Resistant 6).",
              },
              {
                icon: TrendingUp,
                title: "Career & Value Index",
                desc: "Projected market ceilings, contract status, transfer interest, and step-up readiness.",
              },
            ].map((pillar) => (
              <div
                key={pillar.title}
                className="p-6 rounded-3xl bg-[#0e141a] border border-white/10 hover:border-emerald-500/30 transition-all space-y-3"
              >
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                  <pillar.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white">{pillar.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing / Tiers Section */}
      <section className="py-20 bg-[#0b1015] border-t border-white/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold uppercase tracking-wider">
              <Shield className="h-3.5 w-3.5" /> Scout Access
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Flexible Intelligence Tiers
            </h2>
            <p className="text-sm text-slate-400">
              From independent scouts and analysts to top-tier club recruitment departments.
            </p>
          </div>

          <PricingPlans />
        </div>
      </section>

      {/* Newsletter Dispatch */}
      <section className="py-20 bg-[#080B0E] border-t border-white/5">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-[#0e171d] to-[#0a1014] p-8 md:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 mx-auto">
              <ScrollText className="h-6 w-6" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Weekly African Scouting Dispatch
            </h2>
            <p className="text-sm text-slate-400 max-w-lg mx-auto">
              Receive curated dossiers on breakout U21 talents, transfer rumblings across CAF leagues, and advanced statistical breakdowns directly in your inbox.
            </p>
            <div className="max-w-md mx-auto">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>

      <DarkFooter />
    </div>
  );
}
