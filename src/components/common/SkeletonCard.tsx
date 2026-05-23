export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-2xl glass shadow-card ${className}`}>
      <div className="h-full w-full rounded-2xl bg-card/40" />
    </div>
  );
}

export function SkeletonRow({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-card/40 ${className}`} />;
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="rounded-2xl glass p-8 text-center shadow-card">
      <div className="font-display text-lg font-semibold">{title}</div>
      {hint && <p className="mt-1 text-sm text-muted-foreground">{hint}</p>}
    </div>
  );
}
