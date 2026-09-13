import { Calendar } from "lucide-react";

export default function FixturesPage() {
  return (
    <div className="space-y-6">
      <header className="border-b border-border pb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">Fixtures</h1>
        <p className="mt-2 text-xs text-muted-foreground">Past results, upcoming matches, FDR by competition.</p>
      </header>
      <div className="rounded-lg border border-dashed border-border bg-card py-16 text-center">
        <Calendar className="mx-auto h-6 w-6 text-muted-foreground" />
        <p className="mt-3 text-sm text-foreground">Fixture list lands when the match-data ingest is wired</p>
        <p className="mt-1 text-xs text-muted-foreground">Will pull from the schedule feed and overlay difficulty labels.</p>
      </div>
    </div>
  );
}
