"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
      className="flex items-center gap-2"
    >
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. CHAN 2026 prospects"
        maxLength={120}
        className="flex-1"
      />
      <Button
        type="submit"
        disabled={pending || !name.trim()}
        className="bg-orange-600 hover:bg-orange-700 shrink-0"
      >
        <Plus className="h-3.5 w-3.5 mr-1.5" />
        Create
      </Button>
    </form>
  );
}
