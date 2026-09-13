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
  positive: "text-green-700",
  negative: "text-destructive",
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
        "rounded-lg border border-border bg-card p-5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {label}
        </p>
        {Icon ? (
          <Icon className="h-4 w-4 text-muted-foreground" />
        ) : null}
      </div>
      <div className="mt-3 text-2xl font-semibold tabular-nums text-foreground">
        {value}
      </div>
      {delta ? (
        <p className={cn("mt-2 text-xs font-medium", deltaTones[deltaTone])}>{delta}</p>
      ) : null}
    </div>
  );
}
