"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";
import { createWatchlist } from "@/lib/features/watchlists/actions";

export function CreateWatchlistForm() {
  const [name, setName] = useState("");
  const [pending, start] = useTransition();
  const router = useRouter();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim()) return;
        start(async () => {
          const res = await createWatchlist(name.trim());
          if ("error" in res) {
            toast.error(res.error);
          } else {
            toast.success("Watchlist pipeline created");
            setName("");
            router.refresh();
          }
        });
      }}
      className="flex flex-col sm:flex-row items-center gap-3"
    >
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. U20 AFCON 2026 Breakouts, Summer WAFU Targets…"
        maxLength={120}
        className="w-full h-11 px-4 rounded-xl border border-white/10 bg-[#121921] text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
      />
      <button
        type="submit"
        disabled={pending || !name.trim()}
        className="w-full sm:w-auto h-11 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-md shadow-emerald-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 shrink-0"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        <span>Create Watchlist</span>
      </button>
    </form>
  );
}
