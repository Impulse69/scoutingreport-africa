"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { removePlayerFromWatchlist } from "@/lib/features/watchlists/actions";

export function WatchlistRowActions({
  watchlistId,
  playerId,
}: {
  watchlistId: string;
  playerId: string;
}) {
  const [pending, start] = useTransition();
  const [removed, setRemoved] = useState(false);

  if (removed) return null;

  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      disabled={pending}
      aria-label="Remove from watchlist"
      onClick={() =>
        start(async () => {
          const res = await removePlayerFromWatchlist(watchlistId, playerId);
          if ("error" in res) {
            toast.error(res.error);
          } else {
            setRemoved(true);
            toast.success("Removed from watchlist");
          }
        })
      }
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
