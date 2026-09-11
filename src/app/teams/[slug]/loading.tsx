export default function TeamLoading() {
  return (
    <div className="animate-pulse space-y-6" aria-label="Loading team dossiers">
      <div className="h-20 rounded-xl bg-white/5" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="h-24 rounded-xl bg-white/5" />
        ))}
      </div>
      <div className="h-72 rounded-xl bg-white/5" />
    </div>
  );
}
