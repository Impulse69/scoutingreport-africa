"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Wrench, ShieldCheck, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/core/supabase/client";

const PRESETS: { label: string; email: string; password: string; role: "scout" | "admin"; tone: string }[] = [
  {
    label: "Quick Sign-In as Scout",
    email: "scout@dev.local",
    password: "devpass123",
    role: "scout",
    tone: "border-emerald-500/40 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25",
  },
  {
    label: "Quick Sign-In as Admin",
    email: "admin@dev.local",
    password: "devpass123",
    role: "admin",
    tone: "border-amber-500/40 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25",
  },
];

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
    <div className="mt-6 rounded-2xl border border-dashed border-emerald-500/40 bg-[#0c161d] p-4">
      <div className="mb-2.5 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-emerald-400" />
        <p className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
          Dev Environment Instant Access
        </p>
      </div>
      <p className="mb-3 text-[11px] text-slate-400">
        One-click testing bypass with pre-seeded credentials.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            disabled={pending}
            onClick={() => run(p)}
            className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-all disabled:opacity-50 ${p.tone}`}
          >
            {pending && active === p.label ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ShieldCheck className="h-3.5 w-3.5" />
            )}
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
