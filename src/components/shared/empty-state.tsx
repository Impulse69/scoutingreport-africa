import type { ComponentType, ReactNode } from "react";
import { cn } from "@/lib/shared/utils";

type EmptyStateProps = {
  icon?: ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border/70 bg-card/40 px-6 py-14 text-center",
        className,
      )}
    >
      {Icon ? (
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border/60 bg-background">
          <Icon className="h-5 w-5 text-orange-500" />
        </div>
      ) : null}
      <div className="space-y-1">
        <h3 className="text-base font-semibold">{title}</h3>
        {description ? (
          <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
