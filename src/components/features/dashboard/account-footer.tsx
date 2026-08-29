"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, LogOut, Settings, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/core/supabase/client";
import type { ProfileRole } from "@/lib/shared/constants";

export function AccountFooter({
  email,
  role,
}: {
  email: string | null;
  role?: ProfileRole;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  const onSignOut = () =>
    start(async () => {
      const supabase = createClient();
      await supabase.auth.signOut();
      toast.success("Signed out");
      router.refresh();
      router.push("/");
    });

  return (
    <section className="mt-12">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
        Account
      </p>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-xs text-zinc-400">
        {email ? (
          <span className="flex items-center gap-1.5 text-zinc-500">
            <Mail className="h-3.5 w-3.5" />
            {email}
          </span>
        ) : null}
        {role ? (
          <span className="flex items-center gap-1.5 capitalize text-zinc-500">
            <ShieldCheck className="h-3.5 w-3.5" />
            {role}
          </span>
        ) : null}
        <Link
          href="/settings"
          className="flex items-center gap-1.5 transition-colors hover:text-white"
        >
          <Settings className="h-3.5 w-3.5" />
          Account settings
        </Link>
        <button
          type="button"
          disabled={pending}
          onClick={onSignOut}
          className="flex items-center gap-1.5 transition-colors hover:text-red-400 disabled:opacity-50"
        >
          <LogOut className="h-3 w-3" />
          {pending ? "Signing out…" : "Sign out"}
        </button>
        {/* The theme toggle used to live here. The app is pinned to dark until
            a real light palette exists, so the control was a no-op. */}
      </div>
    </section>
  );
}
