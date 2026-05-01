import Link from "next/link";
import { ArrowRight, Users, Target, Compass, Eye, ShieldCheck, Zap } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RemotionGlobe } from "@/components/features/players/visuals/remotion-globe";
import { getCurrentUser } from "@/lib/core/auth-helpers";

export default async function LandingPage() {
  const user = await getCurrentUser();
  const isScout = user?.role === "scout" || user?.role === "admin";

  return (
    <div className="flex flex-col bg-stone-50">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-stone-200">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,#fed7aa_0%,transparent_50%)] opacity-30" />
        <div className="container mx-auto px-4 z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
              <Badge variant="outline" className="bg-white/50 backdrop-blur-sm border-orange-200 text-orange-800 px-4 py-1">
                The Gold Standard for African Scouting
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-stone-900 leading-[1.05]">
                Discover the Next <br />
                <span className="text-orange-600">African Star</span> <br />
                Before the World.
              </h1>
              <p className="max-w-xl text-lg md:text-xl text-stone-600 leading-relaxed">
                Professional-grade scouting analytics for the African continent. 
                Combining human expertise with advanced visualizations to identify 
                top-tier talent across 54 nations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/players" className={buttonVariants({ size: "lg", className: "h-14 px-8 rounded-full bg-stone-900 text-white hover:bg-stone-800" })}>
                  Explore Database
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                {isScout ? (
                  <Link href="/scout/dashboard" className={buttonVariants({ variant: "outline", size: "lg", className: "h-14 px-8 rounded-full border-stone-200 bg-white" })}>
                    Scout Dashboard
                  </Link>
                ) : (
                  <Link href="/auth/sign-in" className={buttonVariants({ variant: "outline", size: "lg", className: "h-14 px-8 rounded-full border-stone-200 bg-white" })}>
                    Professional Access
                  </Link>
                )}
              </div>
              <div className="flex items-center gap-6 pt-8 border-t border-stone-200">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-10 w-10 rounded-full border-2 border-stone-50 bg-stone-200" />
                  ))}
                </div>
                <div className="text-sm text-stone-500">
                  <span className="font-bold text-stone-900">500+</span> Professional Scouts <br />
                  Across every African region
                </div>
              </div>
            </div>
            
            <div className="relative flex items-center justify-center animate-in fade-in zoom-in duration-1000 delay-300">
              <RemotionGlobe />
              {/* Floating Stat Cards */}
              <div className="absolute top-10 right-0 p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-stone-200 shadow-xl hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                    <Zap size={16} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">NPFL Ranking</div>
                    <div className="text-sm font-bold text-stone-900">Top 1% Talent</div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-10 left-0 p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-stone-200 shadow-xl hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">Verification</div>
                    <div className="text-sm font-bold text-stone-900">Verified On-Ground</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-stone-900">
              Built for Elite Recruitment
            </h2>
            <p className="text-lg text-stone-500">
              Why settle for automated data when you can have professional judgment 
              from the ground in Lagos, Cairo, Casablanca, and Johannesburg?
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Human Expertise",
                body: "Structured reports written by verified scouts covering technical, tactical, and mental pillars.",
              },
              {
                icon: Compass,
                title: "Total Coverage",
                body: "From CAF Champions League to grassroots academies across 54 nations.",
              },
              {
                icon: Target,
                title: "Analytics First",
                body: "1-20 attribute scaling, radar charts, and percentile rankings for precise comparison.",
              },
            ].map((item) => (
              <div key={item.title} className="p-8 rounded-3xl bg-stone-50 border border-stone-100 hover:border-orange-200 transition-colors group">
                <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-stone-900 mb-6 shadow-sm group-hover:bg-orange-600 group-hover:text-white transition-all">
                  <item.icon size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-stone-900">{item.title}</h3>
                <p className="text-stone-500 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 border-y border-stone-200 bg-stone-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-4 gap-12 text-center">
            {[
              { val: "12k+", label: "Reports" },
              { val: "54", label: "Nations" },
              { val: "200+", label: "Leagues" },
              { val: "15k", label: "Players" },
            ].map(stat => (
              <div key={stat.label} className="space-y-2">
                <div className="text-5xl font-bold text-orange-500 tabular-nums">{stat.val}</div>
                <div className="text-sm uppercase tracking-[0.2em] text-stone-500 font-bold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto rounded-[3rem] bg-orange-600 p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-orange-200">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 h-80 w-80 rounded-full bg-orange-500 opacity-50 blur-3xl" />
            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                Ready to find the next <br /> African superstar?
              </h2>
              <p className="text-xl text-orange-100 max-w-2xl mx-auto">
                Join the professional network of scouts and recruiters using the most comprehensive 
                on-ground database in African football.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/auth/sign-in" className={buttonVariants({ size: "lg", className: "h-14 px-8 rounded-full bg-white text-orange-600 hover:bg-stone-50 font-bold" })}>
                  Get Professional Access
                </Link>
                <Link href="/about" className={buttonVariants({ variant: "outline", size: "lg", className: "h-14 px-8 rounded-full border-orange-400 bg-transparent text-white hover:bg-orange-700" })}>
                  Become a Contributor
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
