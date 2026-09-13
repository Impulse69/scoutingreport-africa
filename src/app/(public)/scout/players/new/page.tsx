import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PlayerForm } from "@/components/features/reports/player-form";

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
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3 w-3" />
        Back to scout workspace
      </Link>
      <header>
                <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Add a player
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Once published, this player appears on the public roster and any
          report you write on them surfaces on their profile.
        </p>
      </header>
      <PlayerForm mode="create" defaultName={sp.name ?? ""} />
    </div>
  );
}
