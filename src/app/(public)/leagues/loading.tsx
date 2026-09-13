export default function LeaguesLoading() {
  return (
    <div
      className="mx-auto w-full max-w-6xl space-y-8 px-6 py-8"
      aria-label="Loading competitions"
      aria-busy="true"
    >
      <div className="space-y-3 border-b border-border pb-8">
        <div className="h-4 w-48 rounded bg-white/10" />
        <div className="h-10 w-72 rounded bg-white/10" />
        <div className="h-4 w-full max-w-2xl rounded bg-white/5" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="h-28 rounded-lg border border-border bg-card" />
        <div className="h-28 rounded-lg border border-border bg-card" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-36 rounded-lg border border-border bg-card"
          />
        ))}
      </div>
    </div>
  );
}
