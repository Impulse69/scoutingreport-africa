export default function CompetitionLoading() {
  return (
    <div role="status" aria-label="Loading competition coverage" className="mx-auto max-w-6xl space-y-8 px-6 py-8">
      <p className="text-sm text-muted-foreground">Loading competition coverage…</p>
      <div aria-hidden="true" className="h-24 rounded-lg bg-muted" />
      <div aria-hidden="true" className="grid gap-4 sm:grid-cols-2">
        <div className="h-48 rounded-lg border border-border bg-muted" />
        <div className="h-48 rounded-lg border border-border bg-muted" />
      </div>
    </div>
  );
}
