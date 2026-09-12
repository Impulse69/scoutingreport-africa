export default function CompareLoading() {
  return (
    <div className="container mx-auto max-w-6xl animate-pulse space-y-8 px-4 py-10 sm:px-6 lg:px-8" aria-label="Loading player comparison">
      <div className="space-y-3 border-b border-white/10 pb-6">
        <div className="h-6 w-40 rounded bg-white/10" />
        <div className="h-10 w-72 rounded bg-white/10" />
        <div className="h-4 w-full max-w-xl rounded bg-white/5" />
      </div>
      <div className="h-28 rounded-[6px] border border-white/10 bg-white/5" />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-32 rounded-[6px] border border-white/10 bg-white/5" />
        <div className="h-32 rounded-[6px] border border-white/10 bg-white/5" />
      </div>
    </div>
  );
}
