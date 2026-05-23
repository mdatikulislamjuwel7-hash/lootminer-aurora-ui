import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { earnAPI } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { ApiTopOffer } from "@/lib/types";
import { PageHeader } from "@/components/common/PageHeader";
import { XpBadge } from "@/components/common/XpBadge";
import { SkeletonCard, EmptyState } from "@/components/common/SkeletonCard";
import { Flame, Rocket } from "lucide-react";

export const Route = createFileRoute("/_app/top-offers")({
  head: () => ({ meta: [{ title: "Top Offers — LootMiner" }] }),
  component: TopOffersPage,
});

function fillUrl(template: string, userId: string | number, username: string) {
  return template
    .replaceAll("{USER_ID}", String(userId))
    .replaceAll("{USERNAME}", encodeURIComponent(username));
}

function TopOffersPage() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({ queryKey: ["top-offers"], queryFn: earnAPI.topOffers });
  const offers: ApiTopOffer[] = data?.offers ?? data ?? [];

  const open = (o: ApiTopOffer) => {
    const url = fillUrl(o.url, user?.id ?? "", user?.username ?? "");
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Direct" title="Top Offers" subtitle="Hand-picked high-paying offers — direct from advertisers." />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} className="h-52" />)}
        </div>
      ) : offers.length === 0 ? (
        <EmptyState title="No top offers right now" hint="Premium offers will appear here as soon as they're live." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {offers.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => open(o)}
              className="group relative overflow-hidden text-left rounded-3xl glass p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-glow-primary ring-gradient"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${o.gradient ?? "from-cyan-500/30 to-blue-600/30"} opacity-60 group-hover:opacity-90 transition`} />
              <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
              {o.featured && (
                <span className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 rounded-full bg-destructive px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-destructive-foreground shadow-glow-accent">
                  <Flame className="h-3 w-3" /> HOT
                </span>
              )}
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-background/60 backdrop-blur border border-border overflow-hidden">
                  {o.imageUrl ? <img src={o.imageUrl} alt={o.title} className="h-12 w-12 object-contain" /> : <Rocket className="h-7 w-7" />}
                </div>
                <h3 className="mt-4 font-display text-lg font-bold">{o.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">via {o.provider}</p>
                {o.description && <p className="mt-2 text-sm text-foreground/80 line-clamp-2">{o.description}</p>}
                <div className="mt-4 flex items-center justify-between">
                  <XpBadge value={o.xp} size="md" />
                  <span className="text-xs text-primary group-hover:underline">Open offer →</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
