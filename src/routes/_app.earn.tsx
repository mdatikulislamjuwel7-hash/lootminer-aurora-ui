import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { ProviderGrid } from "@/components/offerwall/ProviderGrid";
import { earnAPI } from "@/lib/api";
import type { ApiProvider } from "@/lib/types";
import { SkeletonCard, EmptyState } from "@/components/common/SkeletonCard";
import { Search, Sparkles, ListChecks } from "lucide-react";

const providersFromResponse = (data: unknown, key: "offerwalls" | "surveys", type: ApiProvider["type"]) => {
  const value = data as { items?: ApiProvider[]; offerwalls?: ApiProvider[]; surveys?: ApiProvider[] } | ApiProvider[] | undefined;
  const list = Array.isArray(value) ? value : (value?.[key] ?? value?.items ?? []);
  return Array.isArray(list) ? list.map((p) => ({ ...p, type })) : [];
};

export const Route = createFileRoute("/_app/earn")({
  head: () => ({ meta: [{ title: "Earn — LootMiner" }] }),
  component: Earn,
});

function Earn() {
  const [q, setQ] = useState("");
  const offerwallsQ = useQuery({ queryKey: ["earn-offerwalls"], queryFn: earnAPI.offerwalls });
  const surveysQ = useQuery({ queryKey: ["earn-surveys"], queryFn: earnAPI.surveys });

  const offerwalls = providersFromResponse(offerwallsQ.data, "offerwalls", "offerwall");
  const surveys = providersFromResponse(surveysQ.data, "surveys", "survey");

  const ql = q.trim().toLowerCase();
  const filter = (list: ApiProvider[]) =>
    ql ? list.filter((p) => p.name.toLowerCase().includes(ql)) : list;
  const fOff = filter(offerwalls);
  const fSur = filter(surveys);
  const totalEnabled = [...offerwalls, ...surveys].filter((p) => p.enabled).length;
  const loading = offerwallsQ.isLoading || surveysQ.isLoading;

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Offerwall"
        title="Earn XP"
        subtitle={`${totalEnabled} live providers · click any card to launch`}
        action={
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search providers…" className="w-full rounded-xl glass pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary" />
          </div>
        }
      />

      <section>
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-primary shadow-glow-primary"><Sparkles className="h-4 w-4 text-primary-foreground" /></div>
          <h2 className="font-display text-2xl font-bold">Offerwalls Partners</h2>
          <span className="ml-auto text-xs text-muted-foreground">{offerwalls.length} providers</span>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} className="h-44" />)}
          </div>
        ) : fOff.length === 0 ? (
          <EmptyState title="No offerwalls yet" hint="Check back soon." />
        ) : (
          <ProviderGrid items={fOff} />
        )}
      </section>

      <section>
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-accent shadow-glow-accent"><ListChecks className="h-4 w-4 text-accent-foreground" /></div>
          <h2 className="font-display text-2xl font-bold">Surveys Partners</h2>
          <span className="ml-auto text-xs text-muted-foreground">{surveys.length} providers</span>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} className="h-44" />)}
          </div>
        ) : fSur.length === 0 ? (
          <EmptyState title="No survey partners yet" hint="Check back soon." />
        ) : (
          <ProviderGrid items={fSur} />
        )}
      </section>
    </div>
  );
}
