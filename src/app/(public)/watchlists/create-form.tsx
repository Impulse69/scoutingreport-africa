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
            toast.success("Watchlist created");
            setName("");
            router.refresh();
          }
        });
      }}
      className="flex flex-col items-center gap-3 sm:flex-row"
    >
      <label htmlFor="watchlist-name" className="sr-only">
        Watchlist name
      </label>
      <input
        id="watchlist-name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. U20 AFCON targets"
        maxLength={120}
        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
      />
      <button
        type="submit"
        disabled={pending || !name.trim()}
        className="flex h-10 w-full shrink-0 items-center justify-center gap-1.5 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-50 sm:w-auto"
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
        <span>Create</span>
      </button>
    </form>
  );
}
