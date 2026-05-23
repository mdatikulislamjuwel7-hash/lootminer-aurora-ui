import { useQuery } from "@tanstack/react-query";
import { publicAPI } from "@/lib/api";
import type { ApiLead } from "@/lib/types";
import { Sparkles, Circle } from "lucide-react";

export function LiveLeadsTicker() {
  const { data } = useQuery({
    queryKey: ["public-leads"],
    queryFn: publicAPI.leads,
    refetchInterval: 15000,
  });
  const leads: ApiLead[] = data?.leads ?? data ?? [];
  if (!leads.length) return null;
  const list = [...leads, ...leads];

  return (
    <div className="relative overflow-hidden border-y border-border bg-background/50 backdrop-blur-xl">
      <div className="absolute left-3 top-1/2 z-20 -translate-y-1/2 hidden sm:flex items-center gap-1.5 rounded-full bg-background/80 backdrop-blur px-2.5 py-1 ring-1 ring-border shadow-card">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
          <Circle className="relative h-2 w-2 fill-success text-success" />
        </span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-success">Live</span>
      </div>
      <div className="absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background via-background/80 to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background via-background/80 to-transparent pointer-events-none" />
      <div className="flex w-max animate-marquee py-3 [animation-duration:60s]">
        {list.map((l, i) => (
          <div
            key={`${l.id}-${i}`}
            className="mx-2 flex items-center gap-2.5 rounded-full glass-strong px-3 py-1.5 shadow-card hover:ring-1 hover:ring-primary/40 transition"
          >
            <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-gradient-primary text-[11px] font-bold text-primary-foreground shadow-glow-primary">
              {l.avatar ?? l.user[0]}
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-background" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-semibold">{l.user}</span>
              <span className="text-[10px] text-muted-foreground">
                {l.offer} · {l.provider} · {l.ago}
              </span>
            </div>
            <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-gradient-xp px-2 py-0.5 text-[10px] font-bold text-xp-foreground shadow-glow-xp">
              <Sparkles className="h-2.5 w-2.5" />
              +{l.xp.toLocaleString()} XP
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
