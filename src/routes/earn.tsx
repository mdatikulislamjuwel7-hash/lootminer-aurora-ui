import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { ProviderGrid } from "@/components/offerwall/ProviderGrid";
import { Filter, Search, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/earn")({
  head: () => ({
    meta: [
      { title: "Earn — LootMiner" },
      { name: "description", content: "Browse top offerwalls and start earning rewards." },
    ],
  }),
  component: Earn,
});

const filters = ["All", "Surveys", "Apps", "Games", "Tasks", "Sign-ups"];

function Earn() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Offerwall"
        title="Earn rewards"
        subtitle="Pick a partner and complete offers to earn coins. The whole card is clickable."
        action={
          <div className="hidden md:flex items-center gap-2 rounded-2xl glass px-3 py-2 shadow-card">
            <TrendingUp className="h-4 w-4 text-success" />
            <span className="text-sm">Avg payout <span className="font-semibold tabular-nums">+1,240</span></span>
          </div>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search providers, offers…"
            className="w-full rounded-2xl glass pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary shadow-card"
          />
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded-2xl glass px-4 py-3 text-sm font-medium shadow-card hover:bg-card transition">
          <Filter className="h-4 w-4" /> Filters
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-3 px-3 md:mx-0 md:px-0">
        {filters.map((f, i) => (
          <button
            key={f}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition border ${
              i === 0
                ? "bg-gradient-primary text-primary-foreground border-transparent shadow-glow-primary"
                : "glass text-foreground/80 hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <ProviderGrid />
    </div>
  );
}
