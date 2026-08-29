import Link from "next/link";
import Image from "next/image";
import {
  Compass,
  Trophy,
  Users,
  Search,
  ArrowRight,
  Shield,
  Sparkles,
  Layers,
  Activity,
  Flame,
  Globe,
  SlidersHorizontal,
  Star,
  CheckCircle2,
  Lock,
  FileSpreadsheet,
  Database
} from "lucide-react";
import { PlatformDashboard } from "./platform-dashboard";
import { PricingPlans } from "./pricing-plans";

const CAF_ZONES = [
  {
    name: "WAFU Zone A & B (West Africa)",
    countries: "Nigeria, Senegal, Ghana, Côte d'Ivoire, Mali, Guinea",
    desc: "Unmatched athletic intensity, 1v1 transitional speed, and dynamic technical ball-carriers.",
    talents: "Boniface, Kudus, Lamine Camara, Jackson, Adingra",
    color: "from-[#CC5500]/20 to-[#9C3F00]/10",
  },
  {
    name: "UNAF (North Africa)",
    countries: "Morocco, Egypt, Algeria, Tunisia",
    desc: "Tactical positional discipline, press resistance, tight-space control, and continental giants.",
    talents: "Brahim Díaz, Ounahi, Marmoush, Ziyech",
    color: "from-[#8C4E2E]/20 to-[#CC5500]/10",
  },
  {
    name: "COSAFA (Southern Africa)",
    countries: "South Africa, Zambia, Angola, Zimbabwe, Mozambique",
    desc: "Technical possession fluidity, rapid attacking rotations, and tactical pressing structures.",
    talents: "Mokoena, Daka, Luvumbo, Mudau",
    color: "from-[#CC5500]/20 to-[#9C3F00]/10",
  },
  {
    name: "CECAFA (East & Central)",
    countries: "Kenya, Uganda, Tanzania, Sudan, Ethiopia",
    desc: "High physical stamina, defensive work rate, and rapidly expanding academy infrastructure.",
    talents: "Olunga, Samatta, Miya",
    color: "from-[#8C4E2E]/20 to-[#CC5500]/10",
  },
  {
    name: "UNIFFAC & Global Diaspora",
    countries: "Cameroon, DR Congo, Gabon, France, UK, Belgium",
    desc: "Dual-national elite prospects developed in top academies with multi-lingual recruitment pipelines.",
    talents: "Baleba, Mbeumo, Wissa, Anguissa",
    color: "from-[#CC5500]/20 to-[#9C3F00]/10",
  },
];

const ANALYTICAL_PILLARS = [
  {
    icon: Activity,
    num: "01",
    title: "Live Match Telemetry & xG",
    description: "Per-90 standardized data across domestic African leagues, continental cups, and European landing divisions.",
  },
  {
    icon: Shield,
    num: "02",
    title: "Verified Human Scout Dossiers",
    description: "On-ground scouting reports graded on tactical structure, decision speed, off-ball movement, and psychological resilience.",
  },
  {
    icon: SlidersHorizontal,
    num: "03",
    title: "Tactical Role & Ceiling Fit",
    description: "Advanced role matching evaluating how a prospect transitions to European high-pressing systems.",
  },
  {
    icon: Trophy,
    num: "04",
    title: "Recruitment Pipeline Tools",
    description: "Multi-tiered watchlists, scout note sharing, market valuation tracking, and direct report exporting.",
  },
];

export default function MarketingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0C0E12] text-slate-100 selection:bg-[#CC5500] selection:text-white font-['Inter']">
      {/* ─── 1. HERO SECTION ────────────────────────────────────────── */}
      <section className="relative pt-16 pb-20 overflow-hidden border-b border-[rgba(224,192,178,0.12)]">
        {/* Subtle Architectural Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#171b23_1px,transparent_1px),linear-gradient(to_bottom,#171b23_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Eyebrow Chip */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-[#171B23] border border-[rgba(224,192,178,0.15)] text-[#FFB693] text-[11px] font-['Public_Sans'] font-extrabold uppercase tracking-widest mb-6">
            <span className="flex h-2 w-2 rounded-full bg-[#CC5500]" />
            <span>Industrial Football Intelligence · 54 CAF Associations Covered</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Headline & Thesis */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="font-['Public_Sans'] text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.08] uppercase">
                The Kinetic Archive of{" "}
                <span className="text-[#CC5500]">
                  African Football
                </span>{" "}
                Talent
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
                Industrial precision recruitment intelligence for elite sports executives. We track, evaluate, and benchmark African prospects across grassroots academies, domestic leagues, and continental tournaments.
              </p>

              {/* Hero Search Bar */}
              <div className="rounded-[6px] border border-[rgba(224,192,178,0.15)] bg-[#12151C] p-2 max-w-xl shadow-xl">
                <form action="/players" method="GET" className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#CC5500]" />
                    <input
                      type="text"
                      name="q"
                      placeholder="Search talent (e.g. Victor Boniface, Ghana, Striker)..."
                      className="w-full h-11 pl-10 pr-4 rounded-[4px] bg-[#0C0E12] text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#CC5500]/60 font-['Inter']"
                    />
                  </div>
                  <button
                    type="submit"
                    className="h-11 px-5 rounded-[4px] bg-gradient-to-r from-[#9C3F00] to-[#CC5500] hover:opacity-95 text-white font-['Public_Sans'] font-black text-xs uppercase tracking-wider industrial-shadow transition-all shrink-0"
                  >
                    Search
                  </button>
                </form>
                <div className="flex items-center gap-2 px-3 pt-2 text-[10px] font-mono text-slate-400">
                  <span className="font-bold uppercase text-[#FFB693]">Popular:</span>
                  <Link href="/players?q=Boniface" className="hover:text-white underline decoration-slate-600">
                    Boniface
                  </Link>
                  <span>·</span>
                  <Link href="/players?q=Kudus" className="hover:text-white underline decoration-slate-600">
                    Kudus
                  </Link>
                  <span>·</span>
                  <Link href="/players?q=Lamine" className="hover:text-white underline decoration-slate-600">
                    Lamine Camara
                  </Link>
                  <span>·</span>
                  <Link href="/players?pos=FWD" className="hover:text-white underline decoration-slate-600">
                    Strikers
                  </Link>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/players"
                  className="px-6 py-3 rounded-[6px] bg-gradient-to-r from-[#9C3F00] to-[#CC5500] hover:opacity-95 text-white font-['Public_Sans'] font-black text-xs uppercase tracking-widest industrial-shadow transition-all flex items-center gap-2"
                >
                  <span>Explore Player Dossiers</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/scout"
                  className="px-6 py-3 rounded-[6px] bg-[#171B23] hover:bg-[#1E232D] text-white border border-[rgba(224,192,178,0.15)] font-['Public_Sans'] font-bold text-xs uppercase tracking-widest transition-all"
                >
                  Scout Department Portal
                </Link>
              </div>
            </div>

            {/* Right KPI Architecture Panel */}
            <div className="lg:col-span-5">
              <div className="rounded-[6px] border border-[rgba(224,192,178,0.15)] bg-[#12151C] p-6 space-y-5 shadow-2xl">
                <div className="flex items-center justify-between border-b border-[rgba(224,192,178,0.1)] pb-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-[#CC5500]" />
                    <span className="font-['Public_Sans'] text-xs font-black uppercase tracking-wider text-white">
                      Live Telemetry Cockpit
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-[#FFB693] uppercase font-bold">
                    SYNCED · 2025/26
                  </span>
                </div>

                {/* 4 Metric Blocks */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-[4px] bg-[#0C0E12] p-4 border border-[rgba(224,192,178,0.08)]">
                    <div className="font-mono text-2xl font-black text-white">2,400+</div>
                    <div className="text-[10px] font-['Public_Sans'] font-bold uppercase text-slate-400 mt-1">
                      Scouted Dossiers
                    </div>
                  </div>

                  <div className="rounded-[4px] bg-[#0C0E12] p-4 border border-[rgba(224,192,178,0.08)]">
                    <div className="font-mono text-2xl font-black text-[#FFB693]">54</div>
                    <div className="text-[10px] font-['Public_Sans'] font-bold uppercase text-slate-400 mt-1">
                      CAF Associations
                    </div>
                  </div>

                  <div className="rounded-[4px] bg-[#0C0E12] p-4 border border-[rgba(224,192,178,0.08)]">
                    <div className="font-mono text-2xl font-black text-white">100%</div>
                    <div className="text-[10px] font-['Public_Sans'] font-bold uppercase text-slate-400 mt-1">
                      Human Verified
                    </div>
                  </div>

                  <div className="rounded-[4px] bg-[#0C0E12] p-4 border border-[rgba(224,192,178,0.08)]">
                    <div className="font-mono text-2xl font-black text-[#CC5500]">€180M+</div>
                    <div className="text-[10px] font-['Public_Sans'] font-bold uppercase text-slate-400 mt-1">
                      Tracked Transfer Value
                    </div>
                  </div>
                </div>

                {/* Featured Dossier Teaser */}
                <div className="rounded-[4px] bg-[#171B23] p-4 border border-[rgba(224,192,178,0.1)] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🇳🇬</span>
                    <div>
                      <div className="font-['Public_Sans'] text-xs font-bold text-white">
                        Spotlight: Victor Boniface
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Leverkusen · 8.6 Scout Grade · 92 Physicality
                      </div>
                    </div>
                  </div>
                  <Link
                    href="/players/victor-boniface"
                    className="text-xs font-['Public_Sans'] font-bold text-[#FFB693] hover:text-white"
                  >
                    View →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. INTERACTIVE PLATFORM MATRIX ─────────────────────────── */}
      <section className="py-20 bg-[#090B0E] border-b border-[rgba(224,192,178,0.12)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[rgba(224,192,178,0.1)]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-[#171B23] border border-[rgba(224,192,178,0.15)] text-[#FFB693] text-[10px] font-['Public_Sans'] font-extrabold uppercase tracking-widest mb-2">
                <Activity className="h-3 w-3 text-[#CC5500]" />
                <span>Interactive Positional Benchmarks</span>
              </div>
              <h2 className="font-['Public_Sans'] text-3xl font-black text-white uppercase tracking-tight">
                Deep Talent Evaluation Matrix
              </h2>
            </div>
            <Link
              href="/players"
              className="text-xs font-['Public_Sans'] font-bold text-[#FFB693] hover:text-white uppercase tracking-wider flex items-center gap-1.5"
            >
              <span>View All 2,400+ Profiles in Database</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <PlatformDashboard />
        </div>
      </section>

      {/* ─── 3. 5 CAF REGIONAL SCOUTING ZONES ───────────────────────── */}
      <section className="py-20 bg-[#0C0E12] border-b border-[rgba(224,192,178,0.12)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-12">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-[#171B23] border border-[rgba(224,192,178,0.15)] text-[#FFB693] text-[10px] font-['Public_Sans'] font-extrabold uppercase tracking-widest">
              <Globe className="h-3 w-3 text-[#CC5500]" />
              <span>Continental Coverage Architecture</span>
            </div>
            <h2 className="font-['Public_Sans'] text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              5 CAF Regional Scouting Zones
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Africa is not a monolith. Our scouting methodology splits the continent into distinct developmental zones to contextualize physical profiles, tactical demands, and academy traditions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CAF_ZONES.map((zone, i) => (
              <div
                key={zone.name}
                className="rounded-[6px] border border-[rgba(224,192,178,0.12)] bg-[#12151C] p-6 space-y-4 shadow-lg hover:border-[#CC5500]/40 transition-colors flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-[#FFB693]">
                      ZONE 0{i + 1}
                    </span>
                    <span className="text-xs font-['Public_Sans'] font-bold text-slate-400 uppercase">
                      CAF REGION
                    </span>
                  </div>

                  <h3 className="font-['Public_Sans'] text-base font-extrabold text-white">
                    {zone.name}
                  </h3>

                  <div className="text-[11px] font-mono text-[#FFB693] bg-[#0C0E12] p-2 rounded-[4px] border border-[rgba(224,192,178,0.06)]">
                    {zone.countries}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {zone.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[rgba(224,192,178,0.08)] text-[11px]">
                  <span className="font-bold text-slate-300">Key Prospects: </span>
                  <span className="text-slate-400">{zone.talents}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. ANALYTICAL PILLARS ──────────────────────────────────── */}
      <section className="py-20 bg-[#090B0E] border-b border-[rgba(224,192,178,0.12)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-12">
          <div className="space-y-3 max-w-2xl">
            <h2 className="font-['Public_Sans'] text-3xl font-black text-white uppercase tracking-tight">
              Four Pillars of African Talent Intelligence
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              How we transform raw grassroots talent data into actionable recruitment intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ANALYTICAL_PILLARS.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.num}
                  className="rounded-[6px] border border-[rgba(224,192,178,0.12)] bg-[#12151C] p-6 space-y-4 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-[#CC5500]">
                      {p.num}
                    </span>
                    <Icon className="h-5 w-5 text-[#FFB693]" />
                  </div>

                  <h3 className="font-['Public_Sans'] text-sm font-extrabold text-white uppercase">
                    {p.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {p.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 5. PRICING & SUBSCRIPTION TIERS ───────────────────────── */}
      <section className="py-20 bg-[#0C0E12]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <PricingPlans />
        </div>
      </section>
    </div>
  );
}
