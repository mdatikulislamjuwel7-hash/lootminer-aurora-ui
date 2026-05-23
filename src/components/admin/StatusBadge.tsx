const map: Record<string, string> = {
  Pending: "bg-warning/15 text-warning ring-1 ring-warning/30 shadow-[0_0_18px_-4px_oklch(0.78_0.16_88/0.55)]",
  Approved: "bg-success/15 text-success ring-1 ring-success/30 shadow-[0_0_18px_-4px_oklch(0.72_0.18_152/0.55)]",
  Valid: "bg-success/15 text-success ring-1 ring-success/30 shadow-[0_0_18px_-4px_oklch(0.72_0.18_152/0.55)]",
  Rejected: "bg-destructive/15 text-destructive ring-1 ring-destructive/30 shadow-[0_0_18px_-4px_oklch(0.62_0.22_25/0.55)]",
  Failed: "bg-destructive/15 text-destructive ring-1 ring-destructive/30 shadow-[0_0_18px_-4px_oklch(0.62_0.22_25/0.55)]",
  Duplicate: "bg-orange-500/15 text-orange-300 ring-1 ring-orange-400/30 shadow-[0_0_18px_-4px_oklch(0.72_0.18_55/0.55)]",
  Reversed: "bg-purple-500/15 text-purple-300 ring-1 ring-purple-400/30 shadow-[0_0_18px_-4px_oklch(0.6_0.22_305/0.55)]",
  Credited: "bg-success/15 text-success ring-1 ring-success/30",
  Active: "bg-success/15 text-success ring-1 ring-success/30",
  Banned: "bg-destructive/15 text-destructive ring-1 ring-destructive/30",
};

export function StatusBadge({ status }: { status: string }) {
  const cls = map[status] ?? "bg-card/60 text-muted-foreground ring-1 ring-border";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${cls}`}>
      {status}
    </span>
  );
}

export function Toggle({ checked, onChange }: { checked: boolean; onChange?: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-gradient-primary shadow-glow-primary" : "bg-card/70 border border-border"}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-background shadow transition ${checked ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}
