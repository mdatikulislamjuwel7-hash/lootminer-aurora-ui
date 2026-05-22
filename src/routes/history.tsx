import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { activity } from "@/data/mock";
import { Coins, Trophy, Wallet } from "lucide-react";

export const Route = createFileRoute("/history")({
  head: () => ({ meta: [{ title: "History — LootMiner" }] }),
  component: History,
});

function History() {
  const all = [...activity, ...activity].map((a, i) => ({ ...a, id: i }));
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Transactions" title="Activity history" />
      <div className="overflow-hidden rounded-2xl glass shadow-card divide-y divide-border">
        {all.map(a => (
          <div key={a.id} className="flex items-center gap-3 p-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              a.type === "earn" ? "bg-success/15 text-success" :
              a.type === "cashout" ? "bg-warning/15 text-warning" : "bg-accent/15 text-accent"
            }`}>
              {a.type === "earn" ? <Coins className="h-5 w-5" /> : a.type === "cashout" ? <Wallet className="h-5 w-5" /> : <Trophy className="h-5 w-5" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{a.task}</div>
              <div className="truncate text-xs text-muted-foreground">{a.provider} · {a.time}</div>
            </div>
            <div className={`font-display text-sm font-semibold tabular-nums ${a.amount > 0 ? "text-success" : "text-warning"}`}>
              {a.amount > 0 ? "+" : ""}{a.amount.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
