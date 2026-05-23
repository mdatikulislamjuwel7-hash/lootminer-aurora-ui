import type { ApiProvider } from "@/lib/types";
import { Star, Diamond } from "lucide-react";

const FALLBACK_GRADIENT = "from-cyan-500/40 to-blue-600/30";

export function ProviderCard({
  p, onOpen,
}: { p: ApiProvider; onOpen: (p: ApiProvider) => void }) {
  const initials = p.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  const disabled = !p.enabled;
  const rating = p.rating ?? 0;
  const gradient = p.gradient ?? FALLBACK_GRADIENT;
  return (
    <button
      type="button"
      onClick={() => !disabled && onOpen(p)}
      disabled={disabled}
      className={`group relative block w-full overflow-hidden rounded-2xl glass p-3 md:p-4 text-left shine shadow-card transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
        disabled ? "opacity-60 cursor-not-allowed" : "hover:-translate-y-1 hover:shadow-glow-primary cursor-pointer ring-gradient"
      }`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-50 group-hover:opacity-90 transition-opacity`} />
      <div className="absolute inset-0 bg-gradient-to-t from-card/85 via-card/30 to-transparent" />

      {(p.isTopOffer || p.badge) && !disabled && (
        <span className="absolute top-2 right-2 z-10 rounded-full bg-destructive px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-destructive-foreground shadow-glow-accent">
          {p.badge ?? "HOT"}
        </span>
      )}
      <span className="absolute top-2 left-2 z-10 rounded-full bg-background/70 backdrop-blur px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground border border-border">
        {p.type === "offerwall" ? "Offerwall" : "Survey"}
      </span>

      {disabled && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/60 backdrop-blur-sm">
          <span className="rounded-full bg-warning/90 text-warning-foreground px-3 py-1 text-[10px] font-bold uppercase tracking-wider">Maintenance</span>
        </div>
      )}

      <div className="relative flex flex-col items-center text-center gap-2 pt-4">
        <div className="relative">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-primary opacity-0 blur-md group-hover:opacity-70 transition-opacity" />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-background/60 backdrop-blur border border-border overflow-hidden">
            {p.logoUrl ? (
              <img src={p.logoUrl} alt={p.name} className="h-12 w-12 object-contain" />
            ) : (
              <Diamond className="h-6 w-6 text-foreground" />
            )}
            <span className="absolute -bottom-1 -right-1 rounded-md bg-gradient-primary text-[8px] font-bold px-1 py-0.5 text-primary-foreground shadow-glow-primary">
              {initials}
            </span>
          </div>
        </div>
        <div className="mt-1 font-display text-sm md:text-base font-semibold truncate w-full">{p.name}</div>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`h-3 w-3 ${i < Math.round(rating) ? "text-xp fill-xp" : "text-muted-foreground/30"}`} />
          ))}
        </div>
        <div className="text-[10px] text-muted-foreground tabular-nums">{rating.toFixed(1)} / 5</div>
      </div>
    </button>
  );
}
