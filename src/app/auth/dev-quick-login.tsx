"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/core/supabase/client";

const PRESETS: { label: string; email: string; password: string; role: "scout" | "admin" }[] = [
  {
    label: "Quick Sign-In as Scout",
    email: "scout@dev.local",
    password: "devpass123",
    role: "scout",
  },
  {
    label: "Quick Sign-In as Admin",
    email: "admin@dev.local",
    password: "devpass123",
    role: "admin",
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
    <div className="mt-6 rounded-lg border border-dashed border-border bg-muted p-4">
      <p className="mb-1 text-sm font-medium">Development sign-in</p>
      <p className="mb-3 text-xs text-muted-foreground">
        Pre-seeded accounts, available only when the dev auth bypass is enabled.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            disabled={pending}
            onClick={() => run(p)}
            className="flex items-center justify-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-50"
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
