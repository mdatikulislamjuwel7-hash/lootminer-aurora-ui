import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { IframeOverlay } from "@/components/common/IframeOverlay";
import { mockTopOffers, mockUser } from "@/data/mock";
import { XpBadge } from "@/components/common/XpBadge";
import { Flame } from "lucide-react";

export const Route = createFileRoute("/_app/top-offers")({
  head: () => ({ meta: [{ title: "Top Offers — LootMiner" }] }),
  component: TopOffersPage,
});

function buildUrl(base: string) {
  const u = new URL(base);
  u.searchParams.set("userID", mockUser.userID);
  u.searchParams.set("subId", "ui_demo");
  u.searchParams.set("username", mockUser.username);
  u.searchParams.set("source", "top_offers");
  return u.toString();
}

function TopOffersPage() {
  const [open, setOpen] = useState<{ url: string; title: string } | null>(null);
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Direct" title="Top Offers" subtitle="Hand-picked high-paying offers — direct from advertisers." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockTopOffers.map((o) => {
          const Icon = o.icon;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => setOpen({ url: buildUrl(o.url), title: o.title })}
              className="group relative overflow-hidden text-left rounded-3xl glass p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-glow-primary ring-gradient"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${o.gradient} opacity-60 group-hover:opacity-90 transition`} />
              <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
              {o.featured && (
                <span className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 rounded-full bg-destructive px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-destructive-foreground shadow-glow-accent">
                  <Flame className="h-3 w-3" /> HOT
                </span>
              )}
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-background/60 backdrop-blur border border-border">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold">{o.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">via {o.provider}</p>
                <p className="mt-2 text-sm text-foreground/80 line-clamp-2">{o.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <XpBadge value={o.xp} size="md" />
                  <span className="text-xs text-primary group-hover:underline">Open offer →</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <IframeOverlay
        open={!!open}
        url={open?.url ?? ""}
        title={open?.title ?? ""}
        onClose={() => setOpen(null)}
      />
    </div>
  );
}
