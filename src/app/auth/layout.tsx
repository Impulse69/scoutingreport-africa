import Link from "next/link";
import { Eye } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Cinematic Branding Panel */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 text-stone-50 relative overflow-hidden bg-stone-950">
        {/* Hero Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2676&auto=format&fit=crop" 
            alt="Scouting Hero"
            className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-stone-950/20" />
        </div>

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 font-bold tracking-tight text-xl transition-opacity hover:opacity-80">
            <span className="flex h-8 w-8 items-center justify-center rounded-none bg-orange-600 text-[11px] font-black text-white">
              SR
            </span>
            <span>ScoutingReport Africa</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-sm">
          <span className="inline-block px-2 py-1 mb-6 text-[10px] font-bold tracking-[0.2em] uppercase bg-orange-600 text-white">
            Ground Truth
          </span>
          <h2 className="text-5xl font-bold tracking-tighter leading-[0.9] mb-6">
            Identify talent <br />
            <span className="text-stone-400">beyond the data.</span>
          </h2>
          <p className="text-stone-400 text-lg leading-relaxed font-medium">
            Authentic, human-verified reports written directly from academies and pitches across the continent.
          </p>
        </div>
        
        <div className="relative z-10 flex items-center gap-4 text-[10px] font-mono tracking-widest text-stone-500 uppercase">
          <div className="h-[1px] w-8 bg-stone-800" />
          <span>Authorized Personnel Access</span>
        </div>
      </div>

      {/* Main Authentication Area */}
      <main className="flex-1 flex flex-col bg-white dark:bg-stone-950">
        <header className="lg:hidden border-b border-stone-100 dark:border-stone-900 bg-white/80 dark:bg-stone-950/80 backdrop-blur-md sticky top-0 z-50 p-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
              <span className="flex h-6 w-6 items-center justify-center rounded-none bg-orange-600 text-[8px] font-black text-white">
                SR
              </span>
              <span className="text-sm">ScoutingReport Africa</span>
            </Link>
            <Link href="/" className="text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors">
              Exit
            </Link>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-[400px]">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
