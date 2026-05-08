import type { ComponentType, ReactNode } from "react";
import { cn } from "@/lib/shared/utils";

type StatCardProps = {
  label: string;
  value: ReactNode;
  delta?: string;
  deltaTone?: "positive" | "negative" | "neutral";
  icon?: ComponentType<{ className?: string }>;
  className?: string;
};

const deltaTones: Record<NonNullable<StatCardProps["deltaTone"]>, string> = {
  positive: "text-emerald-500",
  negative: "text-red-500",
  neutral: "text-muted-foreground",
};

export function StatCard({
  label,
  value,
  delta,
  deltaTone = "neutral",
  icon: Icon,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border/60 bg-card p-5 transition-colors hover:border-orange-500/40",
        className,
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </p>
        {Icon ? (
          <Icon className="h-4 w-4 text-orange-500/80" />
        ) : null}
      </div>
      <div className="mt-3 font-mono text-3xl font-black tabular-nums tracking-tight text-foreground">
        {value}
      </div>
      {delta ? (
        <p className={cn("mt-2 text-xs font-medium", deltaTones[deltaTone])}>{delta}</p>
      ) : null}
    </div>
  );
}
