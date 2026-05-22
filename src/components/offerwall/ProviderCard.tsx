import type { Provider } from "@/data/mock";
import { Coins } from "lucide-react";

export function ProviderCard({ p }: { p: Provider }) {
  const Icon = p.icon;
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      className="group relative block overflow-hidden rounded-2xl glass p-3 md:p-4 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${p.gradient} opacity-50 group-hover:opacity-90 transition-opacity`} />
      <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-card/30 to-transparent" />

      {p.badge && (
        <span className={`absolute top-2 right-2 z-10 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider
          ${p.badge === "HOT" ? "bg-destructive/90 text-destructive-foreground" :
            p.badge === "NEW" ? "bg-success/90 text-success-foreground" :
            "bg-warning/90 text-warning-foreground"}`}>
          {p.badge}
        </span>
      )}

      <div className="relative flex flex-col gap-3">
        <div className="relative">
          <div className="absolute inset-0 rounded-xl bg-gradient-primary blur-md opacity-0 group-hover:opacity-60 transition-opacity" />
          <div className="relative flex h-11 w-11 md:h-12 md:w-12 items-center justify-center rounded-xl bg-background/60 backdrop-blur border border-border">
            <Icon className="h-5 w-5 md:h-6 md:w-6 text-foreground" />
          </div>
        </div>

        <div className="min-w-0">
          <h3 className="truncate font-display text-sm md:text-base font-semibold">{p.name}</h3>
          <p className="mt-0.5 text-[10px] md:text-xs text-muted-foreground">{p.completions} done</p>
        </div>

        <div className="flex items-center gap-1.5 rounded-lg bg-background/40 backdrop-blur px-2 py-1.5 border border-border">
          <Coins className="h-3 w-3 text-primary" />
          <span className="text-[10px] md:text-xs font-semibold tabular-nums">
            {p.payoutFrom}–{p.payoutTo.toLocaleString()}
          </span>
        </div>
      </div>
    </a>
  );
}
