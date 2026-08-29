import Link from "next/link";
import { Lock, type LucideIcon, ArrowUpRight } from "lucide-react";
import { isLiveRoute, PLANNED_LABEL } from "@/lib/shared/routes";

export type HubCardProps = {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  locked?: boolean;
  accent?: "emerald" | "amber" | "cyan";
};

export function HubCard({
  href,
  icon: Icon,
  title,
  description,
  locked,
  accent = "emerald",
}: HubCardProps) {
  const baseClassName =
    "group relative flex items-start gap-4 rounded-2xl border border-white/10 bg-[#0c1218]/90 p-5 transition-all duration-300";

  // Planned feature
  if (!isLiveRoute(href)) {
    return (
      <div className={`${baseClassName} opacity-75 cursor-default select-none`} aria-disabled="true">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-white/[0.02]">
          <Icon className="h-5 w-5 text-slate-500" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-300 truncate">{title}</span>
            <span className="shrink-0 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-slate-400">
              {PLANNED_LABEL}
            </span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-slate-400">
            {description}
          </p>
        </div>
      </div>
    );
  }

  // Locked feature
  if (locked) {
    return (
      <div className={`${baseClassName} cursor-not-allowed select-none overflow-hidden`} aria-disabled="true">
        <div className="pointer-events-none flex w-full items-start gap-4 opacity-40 blur-[1px]">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
            <Icon className="h-5 w-5 text-slate-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-sm text-white truncate">{title}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">{description}</p>
          </div>
        </div>
        <div className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-[#0c1218]/70 backdrop-blur-[2px]">
          <Link
            href="/#pricing"
            className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3.5 py-1.5 text-xs font-bold text-amber-300 shadow-lg backdrop-blur-md transition-colors hover:bg-amber-500/20"
          >
            <Lock className="h-3.5 w-3.5" />
            Upgrade to Pro
          </Link>
        </div>
      </div>
    );
  }

  const accentStyles = {
    emerald: "group-hover:border-emerald-500/40 group-hover:bg-emerald-500/10 text-emerald-400",
    amber: "group-hover:border-amber-500/40 group-hover:bg-amber-500/10 text-amber-400",
    cyan: "group-hover:border-cyan-500/40 group-hover:bg-cyan-500/10 text-cyan-400",
  };

  return (
    <Link
      href={href}
      className={`${baseClassName} hover:border-white/20 hover:bg-[#111920] hover:shadow-xl hover:-translate-y-0.5`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all ${accentStyles[accent]}`}
      >
        <Icon className="h-5 w-5 transition-colors" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <p className="font-bold text-sm text-white truncate group-hover:text-emerald-300 transition-colors">
            {title}
          </p>
          <ArrowUpRight className="h-3.5 w-3.5 text-slate-500 opacity-0 group-hover:opacity-100 group-hover:text-emerald-400 transition-all" />
        </div>
        <p className="mt-1 text-xs leading-relaxed text-slate-400">
          {description}
        </p>
      </div>
    </Link>
  );
}
