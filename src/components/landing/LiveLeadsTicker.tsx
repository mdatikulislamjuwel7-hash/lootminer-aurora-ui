import { mockLeads } from "@/data/mock";
import { Sparkles } from "lucide-react";

export function LiveLeadsTicker() {
  // duplicate for seamless marquee
  const list = [...mockLeads, ...mockLeads];
  return (
    <div className="relative overflow-hidden border-y border-border bg-background/40 backdrop-blur">
      <div className="absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent pointer-events-none" />
      <div className="flex w-max animate-marquee py-2.5">
        {list.map((l, i) => (
          <div key={i} className="mx-2 flex items-center gap-2.5 rounded-full glass px-3 py-1.5 shadow-card">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-primary text-[10px] font-bold text-primary-foreground">
              {l.avatar}
            </div>
            <span className="text-xs font-medium">{l.user}</span>
            <span className="text-xs text-muted-foreground">on</span>
            <span className="text-xs font-semibold">{l.provider}</span>
            <span className="text-xs text-muted-foreground">· {l.ago}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-xp px-2 py-0.5 text-[10px] font-bold text-xp-foreground shadow-glow-xp">
              <Sparkles className="h-2.5 w-2.5" />
              +{l.xp.toLocaleString()} XP
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
