"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Wrench, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/core/supabase/client";

const PRESETS: { label: string; email: string; password: string; role: "scout" | "admin"; tone: string }[] = [
  {
    label: "Sign in as scout",
    email: "scout@dev.local",
    password: "devpass123",
    role: "scout",
    tone: "border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20",
  },
  {
    label: "Sign in as admin",
    email: "admin@dev.local",
    password: "devpass123",
    role: "admin",
    tone: "border-orange-500/40 bg-orange-500/10 text-orange-300 hover:bg-orange-500/20",
  },
];

/**
 * Renders only when NEXT_PUBLIC_DEV_AUTH_BYPASS=1 is set. Provides one-click
 * sign-in as a pre-confirmed scout or admin, skipping email verification.
 *
 * The button hits /api/dev/seed-account (server-side, uses SUPABASE_SERVICE_ROLE_KEY
 * to create the user with email already confirmed) then signs in via the
 * regular client. Disabled and hidden in production.
 */
export function DevQuickLogin() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") ?? "/dashboard";
  const [pending, start] = useTransition();
  const [active, setActive] = useState<string | null>(null);

  if (process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS !== "1") return null;

  const run = (preset: (typeof PRESETS)[number]) => {
    setActive(preset.label);
    start(async () => {
      // Step 1: ensure account exists with confirmed email + correct role
      const seed = await fetch("/api/dev/seed-account", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: preset.email,
          password: preset.password,
          role: preset.role,
        }),
      });
      const seedJson = await seed.json();
      if (!seed.ok) {
        toast.error(seedJson.error ?? "Seed failed");
        setActive(null);
        return;
      }

      // Step 2: sign in normally
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: preset.email,
        password: preset.password,
      });
      if (error) {
        toast.error(error.message);
        setActive(null);
        return;
      }
      toast.success(`Signed in as ${preset.role}`);
      router.replace(next);
      router.refresh();
    });
  };

  return (
    <div className="mt-8 rounded-lg border border-dashed border-orange-500/40 bg-orange-500/5 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Wrench className="h-3.5 w-3.5 text-orange-500" />
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-orange-500">
          Dev — skip email verification
        </p>
      </div>
      <p className="mb-3 font-mono text-[11px] text-stone-500 dark:text-stone-400">
        Hidden in production. One-click sign-in as a pre-confirmed scout or admin.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            disabled={pending}
            onClick={() => run(p)}
            className={`flex items-center justify-center gap-1.5 rounded-md border px-3 py-2 font-mono text-[11px] uppercase tracking-wider transition-colors disabled:opacity-50 ${p.tone}`}
          >
            {pending && active === p.label ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <ShieldCheck className="h-3 w-3" />
            )}
            {p.label}
          </button>
        ))}
      </div>
      <p className="mt-3 font-mono text-[10px] text-stone-500 dark:text-stone-500">
        Credentials: <code className="text-stone-700 dark:text-stone-300">scout@dev.local</code>{" "}
        / <code className="text-stone-700 dark:text-stone-300">admin@dev.local</code> ·{" "}
        <code className="text-stone-700 dark:text-stone-300">devpass123</code>
      </p>
    </div>
  );
}
