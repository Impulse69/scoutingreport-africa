"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  LayoutDashboard,
  Bookmark,
  Settings,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/core/supabase/client";

export type DarkUserMenuProps = {
  email: string | null;
  displayName: string | null;
  role: "user" | "scout" | "admin";
};

export function DarkUserMenu({ email, displayName, role }: DarkUserMenuProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const initials = (displayName ?? email ?? "?")
    .split(/[\s@.]+/)
    .filter(Boolean)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");

  const onSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.refresh();
    router.push("/");
  };

  const dashHref = "/dashboard";

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-border bg-background py-1 pl-1 pr-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
          {initials || "?"}
        </span>
        <span className="hidden font-mono uppercase tracking-wider text-[10px] sm:inline">
          {role}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open ? (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-lg border border-border bg-popover shadow-sm">
          <div className="border-b border-border px-4 py-3">
            <p className="truncate text-sm font-medium">
              {displayName ?? email ?? "Signed in"}
            </p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{email}</p>
            <span className="mt-2 inline-flex items-center gap-1 rounded border border-border bg-muted px-1.5 py-0.5 text-[11px] font-medium capitalize text-muted-foreground">
              {role}
            </span>
          </div>

          <ul className="py-1.5">
            <MenuItem
              href={dashHref}
              icon={<LayoutDashboard className="h-3.5 w-3.5" />}
              label="Dashboard"
              onClick={() => setOpen(false)}
            />
            <MenuItem
              href="/watchlists"
              icon={<Bookmark className="h-3.5 w-3.5" />}
              label="My watchlists"
              onClick={() => setOpen(false)}
            />
            <MenuItem
              href="/settings"
              icon={<Settings className="h-3.5 w-3.5" />}
              label="Settings"
              onClick={() => setOpen(false)}
            />
          </ul>

          <div className="border-t border-border py-1.5">
            <button
              type="button"
              onClick={onSignOut}
              className="flex w-full items-center gap-2.5 px-4 py-2 text-left font-mono text-[11px] text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MenuItem({
  href,
  icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className="flex items-center gap-2.5 px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      >
        <span className="text-muted-foreground">{icon}</span>
        {label}
      </Link>
    </li>
  );
}
