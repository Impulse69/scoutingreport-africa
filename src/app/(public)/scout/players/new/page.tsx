import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PlayerCreateForm } from "@/components/features/reports/player-create-form";

export const metadata = { title: "New player" };

export default async function NewPlayerPage({
  searchParams,
}: {
  searchParams: Promise<{ name?: string }>;
}) {
  const sp = await searchParams;

  return (
    <div className="container mx-auto max-w-3xl px-6 py-10 space-y-6">
      <Link
        href="/scout"
        className="inline-flex items-center gap-1.5 font-mono text-[11px] text-zinc-500 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-3 w-3" />
        Back to scout workspace
      </Link>
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-orange-500">
          New player profile
        </p>
        <h1 className="mt-2 font-mono text-3xl font-bold tracking-tight text-white">
          Add a player
        </h1>
        <p className="mt-1.5 font-mono text-xs text-zinc-500">
          Once published, this player appears on the public roster and any
          report you write on them surfaces on their profile.
        </p>
      </header>
      <PlayerCreateForm defaultName={sp.name ?? ""} />
    </div>
  );
}
