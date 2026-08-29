"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Bookmark, Check, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addPlayerToWatchlist } from "@/lib/features/watchlists/actions";

type Option = { id: string; name: string; alreadyHas: boolean };

/**
 * Add this player to one of the viewer's watchlists. The watchlists page tells
 * users to "visit a player profile to add them", but until now no profile
 * offered a way to do it.
 */
export function AddToWatchlist({
  playerId,
  watchlists,
}: {
  playerId: string;
  watchlists: Option[];
}) {
  const selectable = watchlists.filter((w) => !w.alreadyHas);
  const [selected, setSelected] = useState<string>(selectable[0]?.id ?? "");
  const [added, setAdded] = useState<string[]>([]);
  const [pending, start] = useTransition();

  const remaining = selectable.filter((w) => !added.includes(w.id));

  const submit = () => {
    if (!selected) return;
    start(async () => {
      const res = await addPlayerToWatchlist(selected, playerId);
      if ("error" in res) {
        toast.error(res.error);
        return;
      }
      const name = watchlists.find((w) => w.id === selected)?.name ?? "watchlist";
      toast.success(`Added to ${name}`);
      setAdded((prev) => [...prev, selected]);
      setSelected(remaining.find((w) => w.id !== selected)?.id ?? "");
    });
  };

  if (watchlists.length === 0) {
    return (
      <Shell>
        <p className="font-mono text-[11px] text-zinc-500">
          You don&apos;t have a watchlist yet.
        </p>
        <Link
          href="/watchlists"
          className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 py-2 font-mono text-[11px] text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
        >
          <Plus className="h-3 w-3" />
          Create one
        </Link>
      </Shell>
    );
  }

  if (remaining.length === 0) {
    return (
      <Shell>
        <p className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-400">
          <Check className="h-3 w-3" />
          On all of your watchlists.
        </p>
        <Link
          href="/watchlists"
          className="font-mono text-[11px] text-zinc-400 underline-offset-4 transition-colors hover:text-white hover:underline"
        >
          Manage
        </Link>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="min-w-[180px] flex-1">
        <Select value={selected || undefined} onValueChange={(v) => setSelected(v ?? "")}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a watchlist" />
          </SelectTrigger>
          <SelectContent>
            {remaining.map((w) => (
              <SelectItem key={w.id} value={w.id}>
                {w.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        type="button"
        onClick={submit}
        disabled={pending || !selected}
        className="bg-orange-600 hover:bg-orange-700"
      >
        <Bookmark className="mr-1.5 h-3.5 w-3.5" />
        Add
      </Button>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-white/5 bg-[#0E0E0E] px-6 py-5">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-orange-500">
        Watchlist
      </p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </section>
  );
}
