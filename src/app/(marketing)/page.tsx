import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  ArrowRight, Users, Target, Compass,
  Activity, FileText, HeartPulse,
  TrendingUp, FileSignature, PieChart,
  CheckCircle2, PlayCircle, LayoutDashboard
} from "lucide-react";
import { HeroOverlays } from "@/components/features/players/visuals/hero-overlays";
import { Globe } from "@/components/features/players/visuals/globe";
import { MarketingNav } from "@/components/shared/nav/marketing-nav";
import { PricingPlans } from "./pricing-plans";
import { NewsletterForm } from "./newsletter-form";
import { PlatformDashboard } from "./platform-dashboard";
import { getCurrentUser } from "@/lib/core/auth-helpers";

const scatterPoints = [
  { left: 11, bottom: 18, scale: 0.78, color: "bg-orange-500" },
  { left: 17, bottom: 44, scale: 0.91, color: "bg-blue-500" },
  { left: 23, bottom: 32, scale: 0.72, color: "bg-orange-500" },
  { left: 28, bottom: 66, scale: 1.04, color: "bg-orange-500" },
  { left: 32, bottom: 22, scale: 0.83, color: "bg-blue-500" },
  { left: 36, bottom: 54, scale: 1.12, color: "bg-orange-500" },
  { left: 41, bottom: 38, scale: 0.68, color: "bg-blue-500" },
  { left: 45, bottom: 74, scale: 0.96, color: "bg-orange-500" },
  { left: 49, bottom: 28, scale: 1.01, color: "bg-orange-500" },
  { left: 53, bottom: 61, scale: 0.74, color: "bg-blue-500" },
  { left: 58, bottom: 48, scale: 1.15, color: "bg-orange-500" },
  { left: 62, bottom: 82, scale: 0.88, color: "bg-orange-500" },
  { left: 66, bottom: 35, scale: 0.79, color: "bg-blue-500" },
  { left: 71, bottom: 57, scale: 1.07, color: "bg-orange-500" },
  { left: 75, bottom: 24, scale: 0.7, color: "bg-blue-500" },
  { left: 79, bottom: 70, scale: 0.94, color: "bg-orange-500" },
  { left: 84, bottom: 42, scale: 1.18, color: "bg-orange-500" },
  { left: 89, bottom: 64, scale: 0.82, color: "bg-blue-500" },
  { left: 14, bottom: 76, scale: 0.76, color: "bg-orange-500" },
  { left: 21, bottom: 58, scale: 1.09, color: "bg-blue-500" },
  { left: 30, bottom: 86, scale: 0.9, color: "bg-orange-500" },
  { left: 39, bottom: 16, scale: 0.66, color: "bg-blue-500" },
  { left: 47, bottom: 89, scale: 1.03, color: "bg-orange-500" },
  { left: 56, bottom: 20, scale: 0.81, color: "bg-orange-500" },
  { left: 64, bottom: 13, scale: 0.73, color: "bg-blue-500" },
  { left: 72, bottom: 89, scale: 1.1, color: "bg-orange-500" },
  { left: 87, bottom: 29, scale: 0.92, color: "bg-blue-500" },
  { left: 93, bottom: 78, scale: 0.85, color: "bg-orange-500" },
];

export default async function LandingPage() {
  const tHero = await getTranslations("hero");
  const tStats = await getTranslations("stats");
  const tPricing = await getTranslations("pricing");
  const tFeatures = await getTranslations("features");
  const me = await getCurrentUser();
  const dashHref = "/dashboard";
  return (
    <div className="flex flex-col min-h-screen bg-[#0B0B0B] text-zinc-50 font-sans selection:bg-orange-500/30 overflow-x-hidden">
      
      <MarketingNav
        initialAuth={
          me
            ? {
                email: me.email ?? null,
                displayName: me.email?.split("@")[0] ?? null,
                role: me.role,
              }
            : null
        }
      />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 max-w-2xl z-10">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
                {tHero("lead")} <br />
                <span className="text-orange-500">{tHero("accent")}</span> <br />
                {tHero("tail")}
              </h1>
              <p className="text-xl text-zinc-400 leading-relaxed max-w-lg">
                {tHero("subhead")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {me ? (
                  <>
                    <Link
                      href={dashHref}
                      className="h-14 px-8 rounded-md bg-orange-600 hover:bg-orange-700 text-white font-medium flex items-center justify-center transition-colors"
                    >
                      <LayoutDashboard className="mr-2 h-5 w-5" />
                      Open dashboard
                    </Link>
                    <Link
                      href="/players"
                      className="h-14 px-8 rounded-md bg-transparent border border-white/20 hover:bg-white/5 text-white font-medium flex items-center justify-center transition-colors"
                    >
                      Browse players
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/sign-up"
                      className="h-14 px-8 rounded-md bg-orange-600 hover:bg-orange-700 text-white font-medium flex items-center justify-center transition-colors"
                    >
                      {tHero("primaryCta")}
                    </Link>
                    <a
                      href="mailto:hello@scoutingreport.africa?subject=Demo%20request"
                      className="h-14 px-8 rounded-md bg-transparent border border-white/20 hover:bg-white/5 text-white font-medium flex items-center justify-center transition-colors"
                    >
                      <PlayCircle className="mr-2 h-5 w-5" />
                      {tHero("demoCta")}
                    </a>
                  </>
                )}
              </div>
            </div>
            
            <div className="relative w-full flex items-center justify-center mt-10 lg:mt-0">
              {/* Globe stage — square, fully contained, centered */}
              <div className="relative w-full max-w-[640px] aspect-square">
                {/* atmospheric glow */}
                <div className="absolute inset-[-15%] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none" />
                {/* the rotating globe canvas */}
                <Globe />

                {/* Animated overlays — pill + cycling stat cards */}
                <HeroOverlays />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-white/10 bg-[#111]/50 relative z-10">
        <div className="container mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold">100K+</div>
              <div className="text-sm text-zinc-500 uppercase tracking-wider font-semibold">{tStats("players")}</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">50+</div>
              <div className="text-sm text-zinc-500 uppercase tracking-wider font-semibold">{tStats("leagues")}</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">10K+</div>
              <div className="text-sm text-zinc-500 uppercase tracking-wider font-semibold">{tStats("matches")}</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-orange-500">99.9%</div>
              <div className="text-sm text-zinc-500 uppercase tracking-wider font-semibold">{tStats("uptime")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive UI Showcase Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <div className="text-orange-500 font-semibold tracking-wider text-sm uppercase">Platform</div>
            <h2 className="text-3xl md:text-5xl font-bold">Real-time data for real-time decisions</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
              Access comprehensive match data, player statistics, and tactical analysis instantly with our powerful dashboard.
            </p>
          </div>
          
          <PlatformDashboard />
        </div>
      </section>

      {/* Extensive Features Grid */}
      <section id="features" className="py-24 bg-[#0B0B0B] border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">{tFeatures("title")} <span className="text-orange-500">{tFeatures("titleAccent")}</span></h2>
            <p className="text-zinc-400">{tFeatures("subtitle")}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[
              { icon: Users, title: tFeatures("cards.playerStats.title"), desc: tFeatures("cards.playerStats.desc") },
              { icon: Target, title: tFeatures("cards.tactical.title"), desc: tFeatures("cards.tactical.desc") },
              { icon: FileText, title: tFeatures("cards.matchReports.title"), desc: tFeatures("cards.matchReports.desc") },
              { icon: HeartPulse, title: tFeatures("cards.injuries.title"), desc: tFeatures("cards.injuries.desc") },
            ].map((feature) => (
              <div key={feature.title} className="bg-[#111] border border-white/5 p-6 rounded-2xl hover:border-orange-500/30 transition-colors group cursor-default">
                <feature.icon className="w-8 h-8 text-orange-500 mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-zinc-500 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {[
              { icon: TrendingUp, title: tFeatures("cards.transfer.title"), desc: tFeatures("cards.transfer.desc") },
              { icon: FileSignature, title: tFeatures("cards.contracts.title"), desc: tFeatures("cards.contracts.desc") },
              { icon: PieChart, title: tFeatures("cards.visualizations.title"), desc: tFeatures("cards.visualizations.desc") },
            ].map((feature) => (
              <div key={feature.title} className="bg-[#111] border border-white/5 p-6 rounded-2xl hover:border-orange-500/30 transition-colors group cursor-default">
                <feature.icon className="w-8 h-8 text-orange-500 mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-zinc-500 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Industry Standard */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-5xl font-bold">The Industry <span className="text-orange-500">Standard</span></h2>
              <p className="text-lg text-zinc-400">
                Trusted by top-tier clubs, leading agencies, and global media outlets to provide the most accurate and deep football data available.
              </p>
              <ul className="space-y-4 pt-2">
                {[
                  "Over 100+ data points per player",
                  "Live API endpoints with < 50ms latency",
                  "Historical data dating back to 2010",
                  "Custom export tools for Excel & Tableau"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-zinc-300">
                    <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/about" className="inline-flex items-center text-orange-500 font-medium hover:text-orange-400 pt-4 transition-colors">
                View all features <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
            
            {/* Visual Scatter Plot / Data Mock */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
               <div className="flex justify-between items-center mb-8">
                 <div className="font-medium">Expected Goals vs Assists</div>
                 <div className="flex gap-4 text-xs">
                   <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500"/> Attackers</span>
                   <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"/> Midfielders</span>
                 </div>
               </div>
               
               <div className="relative h-64 w-full border-l border-b border-white/10 mt-4">
                 {/* Fake scatter points */}
                 {scatterPoints.map((point, i) => (
                   <div 
                     key={i} 
                     className={`absolute w-3 h-3 rounded-full opacity-60 hover:opacity-100 transition-opacity cursor-pointer ${point.color}`}
                     style={{
                       left: `${point.left}%`,
                       bottom: `${point.bottom}%`,
                       transform: `scale(${point.scale})`
                     }}
                   />
                 ))}
                 
                 {/* Highlighted player point */}
                 <div className="absolute w-4 h-4 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.9)] z-10" style={{ left: '82%', bottom: '88%' }}>
                   <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-[#222] border border-white/10 rounded px-3 py-1.5 text-xs whitespace-nowrap font-medium shadow-xl">
                     Top Performer
                   </div>
                 </div>
                 
                 <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-zinc-600">Expected Goals (xG)</div>
                 <div className="absolute -left-8 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-zinc-600 whitespace-nowrap">Expected Assists (xA)</div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-[#111]/50 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-4">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">{tPricing("title")} <span className="text-orange-500">{tPricing("title2")}</span></h2>
            <p className="text-zinc-400 mb-8">{tPricing("subtitle")}</p>
          </div>
          <div className="text-center"><PricingPlans /></div>
          
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-32 text-center px-6 relative overflow-hidden border-t border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-orange-600/5 blur-[120px] rounded-[100%] pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">The data behind <span className="text-orange-500">every football</span> decision.</h2>
          <Link
            href={me ? dashHref : "/auth/sign-up"}
            className="inline-block px-10 py-5 rounded-md bg-orange-600 hover:bg-orange-700 text-white font-semibold text-lg transition-colors shadow-xl shadow-orange-600/20"
          >
            {me ? "Open dashboard" : "Get Started Now"}
          </Link>
        </div>
      </section>

      {/* Actual Footer Matching Screenshot */}
      <footer className="border-t border-white/10 bg-[#0B0B0B] pt-20 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-orange-600 rounded flex items-center justify-center font-bold text-xs">SR</div>
                <span className="font-semibold tracking-wide">ScoutingReport</span>
              </div>
              <p className="text-zinc-500 text-sm mb-8 max-w-xs leading-relaxed">
                Empowering football clubs with data-driven scouting and analytics solutions.
              </p>
              <div className="flex gap-3">
                <a
                  href="https://x.com/scoutingreportafrica"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="X / Twitter"
                  className="w-9 h-9 rounded-full bg-[#1A1A1A] hover:bg-white/10 flex items-center justify-center transition-colors text-sm"
                >
                  𝕏
                </a>
                <a
                  href="https://linkedin.com/company/scoutingreportafrica"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="w-9 h-9 rounded-full bg-[#1A1A1A] hover:bg-white/10 flex items-center justify-center transition-colors font-serif italic text-sm"
                >
                  in
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6">Product</h4>
              <ul className="space-y-4 text-sm text-zinc-500">
                <li><Link href="/#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><a href="mailto:hello@scoutingreport.africa?subject=API%20access" className="hover:text-white transition-colors">API Documentation</a></li>
                <li><Link href="/about" className="hover:text-white transition-colors">Changelog</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-zinc-500">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><a href="mailto:careers@scoutingreport.africa" className="hover:text-white transition-colors">Careers</a></li>
                <li><Link href="/about" className="hover:text-white transition-colors">Blog</Link></li>
                <li><a href="mailto:hello@scoutingreport.africa" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h4 className="font-semibold mb-6">Subscribe to our newsletter</h4>
              <p className="text-sm text-zinc-500 mb-4">Get the latest football data insights weekly.</p>
              <NewsletterForm />
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-zinc-500">
            <div>&copy; 2026 ScoutingReport Africa. All rights reserved.</div>
            <div className="flex gap-8">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
