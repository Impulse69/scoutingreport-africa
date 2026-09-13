import Link from "next/link";
import { Lock, type LucideIcon, ArrowUpRight } from "lucide-react";
import { isLiveRoute, PLANNED_LABEL } from "@/lib/shared/routes";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

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
  void accent;
  const baseClassName =
    "group relative flex items-start gap-4 rounded-lg border border-border bg-card p-5 transition-colors";

  if (!isLiveRoute(href)) {
    return (
      <div className={`${baseClassName} cursor-default select-none bg-muted`} aria-disabled="true">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold text-muted-foreground">{title}</span>
            <Badge variant="outline">{PLANNED_LABEL}</Badge>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    );
  }

  if (locked) {
    return (
      <div className={`${baseClassName} select-none bg-muted`} aria-disabled="true">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-muted-foreground">{title}</p>
            <Badge variant="secondary" className="gap-1">
              <Lock className="h-3 w-3" />
              Locked
            </Badge>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
          <Link
            href="/#pricing"
            className={buttonVariants({ variant: "outline", size: "sm", className: "mt-3" })}
          >
            Upgrade
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={`${baseClassName} hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-primary transition-colors group-hover:bg-background">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <p className="truncate text-sm font-semibold text-foreground">
            {title}
          </p>
          <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </Link>
  );
}
