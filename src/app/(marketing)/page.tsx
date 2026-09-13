import Link from "next/link";
import Image from "next/image";
import {
  Activity,
  ArrowRight,
  Globe,
  Search,
  SlidersHorizontal,
  Trophy,
  FileCheck,
} from "lucide-react";
import { getPlatformCounts } from "@/lib/features/players/queries";
import { PlatformDashboard } from "./platform-dashboard";
import { PricingPlans } from "./pricing-plans";

const CAF_ZONES = [
  {
    name: "WAFU Zone A & B",
    tag: "West Africa",
    countries: "Nigeria, Senegal, Ghana, Côte d'Ivoire, Mali, Guinea",
    desc: "Explosive transitional athletes, direct wide players, and dominant ball-carriers shaped by high-tempo domestic and academy leagues.",
    talents: [
      { name: "Victor Boniface", nation: "🇳🇬" },
      { name: "Mohammed Kudus", nation: "🇬🇭" },
      { name: "Lamine Camara", nation: "🇸🇳" },
      { name: "Nicolas Jackson", nation: "🇸🇳" },
      { name: "Simon Adingra", nation: "🇨🇮" },
    ],
  },
  {
    name: "UNAF",
    tag: "North Africa",
    countries: "Morocco, Egypt, Algeria, Tunisia",
    desc: "Tactically disciplined profiles with strong positional habits, press resistance, and continental CAF Champions League tournament pedigree.",
    talents: [
      { name: "Brahim Díaz", nation: "🇲🇦" },
      { name: "Omar Marmoush", nation: "🇪🇬" },
      { name: "Azzedine Ounahi", nation: "🇲🇦" },
    ],
  },
  {
    name: "COSAFA",
    tag: "Southern Africa",
    countries: "South Africa, Zambia, Angola, Zimbabwe, Mozambique",
    desc: "Technical possession players, mobile attackers, and pressing structures across established South African PSL clubs.",
    talents: [
      { name: "Teboho Mokoena", nation: "🇿🇦" },
      { name: "Patson Daka", nation: "🇿🇲" },
      { name: "Zito Luvumbo", nation: "🇦🇴" },
    ],
  },
  {
    name: "CECAFA",
    tag: "East & Central Africa",
    countries: "Kenya, Uganda, Tanzania, Sudan, Ethiopia",
    desc: "High-stamina players, developing academy systems, and profiles that need careful physical and tactical context.",
    talents: [
      { name: "Michael Olunga", nation: "🇰🇪" },
      { name: "Mbwana Samatta", nation: "🇹🇿" },
    ],
  },
  {
    name: "UNIFFAC & Diaspora",
    tag: "Central Africa & Dual-Nats",
    countries: "Cameroon, DR Congo, Gabon, France, UK, Belgium",
    desc: "Central African and dual-national prospects with varied development paths across domestic and European academies.",
    talents: [
      { name: "Bryan Mbeumo", nation: "🇨🇲" },
      { name: "Carlos Baleba", nation: "🇨🇲" },
      { name: "Yoane Wissa", nation: "🇨🇩" },
    ],
  },
];

const ANALYTICAL_PILLARS = [
  {
    icon: Activity,
    num: "01",
    title: "Match observation",
    description:
      "Reports start with the fixture, role, minutes watched, and the context needed to compare players fairly.",
  },
  {
    icon: FileCheck,
    num: "02",
    title: "Scout reports",
    description:
      "Structured notes capture tactical fit, technical level, physical profile, decision speed, strengths, and risks.",
  },
  {
    icon: SlidersHorizontal,
    num: "03",
    title: "Role comparison",
    description:
      "Players can be compared by position, role, and observable traits instead of reputation alone.",
  },
  {
    icon: Trophy,
    num: "04",
    title: "Recruitment workflow",
    description:
      "Watchlists and reports help scouts move from discovery to a clear monitor, revisit, pass, or sign recommendation.",
  },
];

export default async function MarketingPage() {
  const counts = await getPlatformCounts();
  const stats = [
    { label: "Players scouted", value: counts.publishedPlayers },
    { label: "Published reports", value: counts.publishedReports },
    { label: "CAF countries indexed", value: counts.countriesIndexed },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="border-b border-border">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-12 lg:grid-cols-12 lg:items-center">
          <div className="space-y-6 lg:col-span-7">
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                ScoutingReport Africa tracks African football talent with
                structured scout evidence.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                Search players, compare role profiles, and build watchlists from
                a consistent recruitment workspace designed for scouts and
                sporting departments.
              </p>
            </div>

            {/* Search Box */}
            <div className="max-w-xl rounded-lg border border-border bg-card p-2">
              <form action="/players" method="GET" className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    name="q"
                    placeholder="Search players, nations, positions..."
                    className="h-10 w-full rounded-md border border-input bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Search
                </button>
              </form>
              <div className="flex flex-wrap items-center gap-2 px-3 pt-2 text-xs text-muted-foreground">
                <span>Popular:</span>
                {["Boniface", "Kudus", "Lamine Camara", "Strikers"].map((item) => (
                  <Link
                    key={item}
                    href={
                      item === "Strikers"
                        ? "/players?pos=FWD"
                        : `/players?q=${encodeURIComponent(item)}`
                    }
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/players"
                className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <span>Explore players</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/scout"
                className="inline-flex h-10 items-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Scout workspace
              </Link>
            </div>
          </div>

          {/* Right Hero Live Match Action Showcase */}
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <div className="relative h-56 w-full overflow-hidden bg-slate-950">
                <Image
                  src="/images/live-football-match-action.jpg"
                  alt="Live match action on the pitch under floodlights"
                  fill
                  sizes="(max-width: 768px) 100vw, 480px"
                  className="object-cover"
                  priority
                />
              </div>

              <h3 className="border-t border-border px-4 py-3 text-sm font-semibold text-foreground">
                Live match observation and player actions
              </h3>

              <div className="grid grid-cols-3 gap-2.5 border-t border-border bg-card p-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-lg border border-border bg-muted p-3 text-center">
                    <div className="text-xl font-bold tabular-nums text-foreground">
                      {stat.value}
                    </div>
                    <div className="mt-0.5 text-[11px] text-muted-foreground leading-tight">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Evaluation Matrix */}
      <section className="border-b border-border bg-muted">
        <div className="mx-auto w-full max-w-6xl space-y-6 px-6 py-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Player evaluation
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Compare public profiles by role, verified scout grades, and observable traits.
              </p>
            </div>
            <Link
              href="/players"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              <span>View all players</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <PlatformDashboard />
        </div>
      </section>

      {/* Regional Scouting Context */}
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-6xl space-y-8 px-6 py-8">
          <div className="max-w-3xl space-y-3">
            <h2 className="text-base font-semibold text-foreground">
              Regional scouting context
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">
              Africa is not a monolith. Regional context helps scouts interpret
              player development, competition level, academy pathways, and role fit across 5 distinct geographic zones.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {CAF_ZONES.map((zone, i) => (
              <article
                key={zone.name}
                className="flex flex-col justify-between rounded-lg border border-border bg-card p-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                    <span className="font-medium">Zone {i + 1}</span>
                    <Globe className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">{zone.name}</h3>
                  <div className="rounded-md bg-muted p-2 text-xs text-muted-foreground">
                    {zone.countries}
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">{zone.desc}</p>
                </div>
                <div className="mt-4 border-t border-border pt-4 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Example players: </span>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {zone.talents.map((t) => (
                      <span
                        key={t.name}
                        className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-xs text-foreground"
                      >
                        <span>{t.nation}</span>
                        <span>{t.name}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Scouting Workflow */}
      <section className="border-b border-border bg-muted">
        <div className="mx-auto w-full max-w-6xl space-y-8 px-6 py-8">
          <div className="max-w-2xl space-y-3">
            <h2 className="text-base font-semibold text-foreground">
              Scouting workflow
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">
              The platform turns observed player evidence into reports,
              comparisons, and watchlist decisions for professional scouting departments.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {ANALYTICAL_PILLARS.map((p) => {
              const Icon = p.icon;
              return (
                <article
                  key={p.num}
                  className="rounded-lg border border-border bg-card p-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">{p.num}</span>
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-foreground">{p.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {p.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section>
        <div className="mx-auto w-full max-w-6xl px-6 py-8">
          <PricingPlans />
        </div>
      </section>
    </div>
  );
}
