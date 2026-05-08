import Link from "next/link";
import { Lock, type LucideIcon } from "lucide-react";

export type HubCardProps = {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  locked?: boolean;
};

export function HubCard({ href, icon: Icon, title, description, locked }: HubCardProps) {
  const baseClassName =
    "group relative flex items-start gap-3 rounded-xl border border-white/5 bg-[#0E0E0E] p-5 transition-colors";

  if (locked) {
    // Locked state: blurred content + Pro overlay so users see the feature
    // exists but understand it's gated.
    return (
      <div
        className={`${baseClassName} cursor-not-allowed select-none overflow-hidden`}
        aria-disabled="true"
      >
        <div className="pointer-events-none flex w-full items-start gap-3 opacity-50 blur-[2px]">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5">
            <Icon className="h-4 w-4 text-zinc-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-sm font-semibold text-white truncate">
              {title}
            </p>
            <p className="mt-1 font-mono text-[11px] leading-relaxed text-zinc-500">
              {description}
            </p>
          </div>
        </div>
        <div className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-[#0E0E0E]/40 backdrop-blur-[2px]">
          <Link
            href="/#pricing"
            className="flex items-center gap-1.5 rounded-md border border-orange-500/40 bg-orange-500/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-orange-300 shadow-lg backdrop-blur-md transition-colors hover:bg-orange-500/20"
          >
            <Lock className="h-3 w-3" />
            Upgrade to unlock
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={`${baseClassName} hover:border-white/15 hover:bg-[#121212]`}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 transition-colors group-hover:border-orange-500/30 group-hover:bg-orange-500/10">
        <Icon className="h-4 w-4 text-zinc-400 transition-colors group-hover:text-orange-400" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-sm font-semibold text-white truncate">{title}</p>
        <p className="mt-1 font-mono text-[11px] leading-relaxed text-zinc-500">
          {description}
        </p>
      </div>
    </Link>
  );
}
