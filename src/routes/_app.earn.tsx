import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { ProviderGrid } from "@/components/offerwall/ProviderGrid";
import { mockOfferwalls, mockSurveys } from "@/data/mock";
import { Search, Sparkles, ListChecks } from "lucide-react";

export const Route = createFileRoute("/_app/earn")({
  head: () => ({ meta: [{ title: "Earn — LootMiner" }] }),
  component: Earn,
});

function Earn() {
  const totalEnabled = [...mockOfferwalls, ...mockSurveys].filter(p => p.enabled).length;
  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Offerwall"
        title="Earn XP"
        subtitle={`${totalEnabled} live providers · click any card to launch`}
        action={
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Search providers…" className="w-full rounded-xl glass pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary" />
          </div>
        }
      />

      <section>
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-primary shadow-glow-primary"><Sparkles className="h-4 w-4 text-primary-foreground" /></div>
          <h2 className="font-display text-2xl font-bold">Offerwalls Partners</h2>
          <span className="ml-auto text-xs text-muted-foreground">{mockOfferwalls.length} providers</span>
        </div>
        <ProviderGrid items={mockOfferwalls} />
      </section>

      <section>
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-accent shadow-glow-accent"><ListChecks className="h-4 w-4 text-accent-foreground" /></div>
          <h2 className="font-display text-2xl font-bold">Surveys Partners</h2>
          <span className="ml-auto text-xs text-muted-foreground">{mockSurveys.length} providers</span>
        </div>
        <ProviderGrid items={mockSurveys} />
      </section>
    </div>
  );
}
