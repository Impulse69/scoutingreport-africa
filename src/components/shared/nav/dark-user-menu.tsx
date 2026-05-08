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
        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pl-1 pr-2.5 text-xs text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-700 font-mono text-[10px] font-bold text-white">
          {initials || "?"}
        </span>
        <span className="hidden font-mono uppercase tracking-wider text-[10px] sm:inline">
          {role}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-zinc-500 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open ? (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-white/10 bg-[#111]/97 shadow-2xl backdrop-blur-md">
          <div className="border-b border-white/5 px-4 py-3">
            <p className="font-mono text-xs font-semibold text-white truncate">
              {displayName ?? email ?? "Signed in"}
            </p>
            <p className="mt-0.5 font-mono text-[10px] text-zinc-500 truncate">{email}</p>
            <span className="mt-2 inline-flex items-center gap-1 rounded border border-orange-500/40 bg-orange-500/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-orange-400">
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

          <div className="border-t border-white/5 py-1.5">
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
        className="flex items-center gap-2.5 px-4 py-2 font-mono text-[11px] text-zinc-300 hover:bg-white/5 hover:text-white transition-colors"
      >
        <span className="text-zinc-500">{icon}</span>
        {label}
      </Link>
    </li>
  );
}
