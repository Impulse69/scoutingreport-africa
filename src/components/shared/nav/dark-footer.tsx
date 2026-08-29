import Link from "next/link";
import {
  Compass,
  Trophy,
  Users,
  Shield,
  FileText,
  Mail,
  ArrowRight,
  Globe,
  Database,
  Flame,
  Award
} from "lucide-react";

export function DarkFooter() {
  return (
    <footer className="border-t border-[rgba(224,192,178,0.12)] bg-[#090B0E] text-slate-400 font-['Inter'] text-xs">
      {/* Top Intelligence Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand & Thesis */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-[6px] bg-gradient-to-br from-[#CC5500] to-[#9C3F00] text-white font-['Public_Sans'] font-black text-sm shadow-md">
                SR
              </div>
              <div className="flex flex-col">
                <span className="font-['Public_Sans'] text-sm font-black tracking-tight text-white">
                  SCOUTING REPORT AFRICA
                </span>
                <span className="text-[10px] font-mono text-[#FFB693] uppercase tracking-wider font-bold">
                  The Kinetic Archive
                </span>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              Industrial sports intelligence and recruitment architecture for African football. Bridging grassroots academies across all 54 CAF national associations with European and global elite clubs.
            </p>

            <div className="flex items-center gap-2 pt-2 text-[11px] font-['Public_Sans'] font-bold text-slate-300">
              <span className="flex h-2 w-2 rounded-full bg-[#CC5500]" />
              <span>54 CAF Associations Covered · Live Match Telemetry Active</span>
            </div>
          </div>

          {/* Col 2: Player Intelligence */}
          <div className="space-y-3">
            <h4 className="font-['Public_Sans'] text-xs font-extrabold uppercase tracking-widest text-white">
              Talent Directory
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/players" className="hover:text-[#FFB693] transition-colors">
                  Player Catalogue
                </Link>
              </li>
              <li>
                <Link href="/players?pos=FWD" className="hover:text-[#FFB693] transition-colors">
                  Strikers & Attackers
                </Link>
              </li>
              <li>
                <Link href="/players?pos=MID" className="hover:text-[#FFB693] transition-colors">
                  Midfield Orchestrators
                </Link>
              </li>
              <li>
                <Link href="/players?pos=DEF" className="hover:text-[#FFB693] transition-colors">
                  Defensive Anchors
                </Link>
              </li>
              <li>
                <Link href="/players?pos=GK" className="hover:text-[#FFB693] transition-colors">
                  Goalkeepers (GK)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Competitions & Scout Hub */}
          <div className="space-y-3">
            <h4 className="font-['Public_Sans'] text-xs font-extrabold uppercase tracking-widest text-white">
              Recruitment Hub
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/leagues" className="hover:text-[#FFB693] transition-colors">
                  Continental Competitions
                </Link>
              </li>
              <li>
                <Link href="/scout" className="hover:text-[#FFB693] transition-colors">
                  Scout Department
                </Link>
              </li>
              <li>
                <Link href="/scouting" className="hover:text-[#FFB693] transition-colors">
                  Scouting Methodology
                </Link>
              </li>
              <li>
                <Link href="/watchlists" className="hover:text-[#FFB693] transition-colors">
                  Recruitment Pipelines
                </Link>
              </li>
              <li>
                <Link href="/fpl" className="hover:text-[#FFB693] transition-colors">
                  FPL Differentials
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Legal */}
          <div className="space-y-3">
            <h4 className="font-['Public_Sans'] text-xs font-extrabold uppercase tracking-widest text-white">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/dashboard" className="hover:text-[#FFB693] transition-colors">
                  Scout Command Hub
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#FFB693] transition-colors">
                  About the Project
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#FFB693] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#FFB693] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-[#FFB693] transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[rgba(224,192,178,0.08)] bg-[#07090C] py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
          <div>
            © {new Date().getFullYear()} ScoutingReport.Africa · Kinetic Archive Intelligence. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-slate-300 transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">
              Privacy
            </Link>
            <Link href="/scout" className="hover:text-slate-300 transition-colors text-[#CC5500]">
              Scout Access
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
