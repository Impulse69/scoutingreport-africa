import Link from "next/link";
import { Lock, type LucideIcon, ArrowUpRight } from "lucide-react";
import { isLiveRoute, PLANNED_LABEL } from "@/lib/shared/routes";

export type HubCardProps = {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  locked?: boolean;
  accent?: "primary" | "secondary" | "tertiary";
};

export function HubCard({
  href,
  icon: Icon,
  title,
  description,
  locked,
  accent = "primary",
}: HubCardProps) {
  const baseClassName =
    "group relative flex items-start gap-4 rounded-[6px] border border-[rgba(224,192,178,0.12)] bg-[#12151C] p-5 transition-all duration-200";

  // Planned feature
  if (!isLiveRoute(href)) {
    return (
      <div className={`${baseClassName} opacity-75 cursor-default select-none`} aria-disabled="true">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] border border-[rgba(224,192,178,0.08)] bg-[#0C0E12]">
          <Icon className="h-5 w-5 text-slate-500" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-['Public_Sans'] font-bold text-sm text-slate-300 truncate">{title}</span>
            <span className="shrink-0 rounded-[3px] border border-[rgba(224,192,178,0.15)] bg-[#0C0E12] px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400">
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
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] border border-[rgba(224,192,178,0.1)] bg-[#0C0E12]">
            <Icon className="h-5 w-5 text-slate-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-['Public_Sans'] font-bold text-sm text-white truncate">{title}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">{description}</p>
          </div>
        </div>
        <div className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-[#0C0E12]/80 backdrop-blur-[2px]">
          <Link
            href="/#pricing"
            className="flex items-center gap-1.5 rounded-[4px] border border-[#CC5500]/40 bg-[#CC5500]/15 px-3.5 py-1.5 text-xs font-['Public_Sans'] font-bold text-[#FFB693] shadow-lg transition-colors hover:bg-[#CC5500]/25"
          >
            <Lock className="h-3.5 w-3.5" />
            Upgrade to Pro
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={`${baseClassName} hover:border-[#CC5500]/50 hover:bg-[#171B23] hover:shadow-lg`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] border border-[rgba(224,192,178,0.1)] bg-[#0C0E12] text-[#FFB693] group-hover:border-[#CC5500]/40 group-hover:text-white transition-all">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <p className="font-['Public_Sans'] font-bold text-sm text-white truncate group-hover:text-[#FFB693] transition-colors">
            {title}
          </p>
          <ArrowUpRight className="h-3.5 w-3.5 text-slate-500 opacity-0 group-hover:opacity-100 group-hover:text-[#CC5500] transition-all" />
        </div>
        <p className="mt-1 text-xs leading-relaxed text-slate-400">
          {description}
        </p>
      </div>
    </Link>
  );
}
