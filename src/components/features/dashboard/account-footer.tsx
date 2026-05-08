"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, Mail, LogOut } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/core/supabase/client";

export function AccountFooter({ email }: { email: string | null }) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
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
        <Link
          href="/settings"
          className="hover:text-white transition-colors"
        >
          Email preferences
        </Link>
        <button
          type="button"
          disabled={pending}
          onClick={onSignOut}
          className="flex items-center gap-1.5 hover:text-red-400 transition-colors disabled:opacity-50"
        >
          <LogOut className="h-3 w-3" />
          {pending ? "Signing out…" : "Sign out"}
        </button>
        <button
          type="button"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="flex items-center gap-1.5 hover:text-white transition-colors"
        >
          {theme === "light" ? (
            <Moon className="h-3.5 w-3.5" />
          ) : (
            <Sun className="h-3.5 w-3.5" />
          )}
          Toggle theme
        </button>
      </div>
    </section>
  );
}
