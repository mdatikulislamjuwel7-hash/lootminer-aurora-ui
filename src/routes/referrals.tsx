import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { Copy, Gift, Users } from "lucide-react";

export const Route = createFileRoute("/referrals")({
  head: () => ({ meta: [{ title: "Referrals — LootMiner" }] }),
  component: Referrals,
});

function Referrals() {
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Invite" title="Refer friends, earn forever" subtitle="Get 10% of everything your friends earn — for life." />

      <div className="relative overflow-hidden rounded-3xl glass p-6 md:p-8 shadow-card">
        <div className="absolute -top-20 right-0 h-64 w-64 rounded-full bg-gradient-primary opacity-25 blur-3xl animate-glow-pulse" />
        <div className="relative">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Your link</span>
          <div className="mt-3 flex flex-col sm:flex-row gap-2">
            <div className="flex-1 rounded-xl bg-card/60 border border-border px-4 py-3 font-mono text-sm truncate">
              https://lootminer.gg/r/alexr
            </div>
            <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow-primary">
              <Copy className="h-4 w-4" /> Copy
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { icon: Users, label: "Referrals", value: "8" },
          { icon: Gift, label: "Total earned", value: "3,240" },
          { icon: Copy, label: "Conversion", value: "62%" },
        ].map(s => (
          <div key={s.label} className="rounded-2xl glass p-5 shadow-card">
            <s.icon className="h-5 w-5 text-primary" />
            <div className="mt-3 font-display text-3xl font-bold tabular-nums">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
