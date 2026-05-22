import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { mockRewardCalendar, mockPromoHistory, mockAchievements } from "@/data/mock";
import { Check, Gift, Lock, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_app/rewards")({
  head: () => ({ meta: [{ title: "Rewards — LootMiner" }] }),
  component: Rewards,
});

function Rewards() {
  const [code, setCode] = useState("");
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Rewards" title="Bonuses, codes & glory" />

      <section>
        <h2 className="mb-4 font-display text-xl font-bold flex items-center gap-2"><Gift className="h-5 w-5 text-xp" /> 30-Day Calendar</h2>
        <div className="grid grid-cols-7 md:grid-cols-10 gap-2">
          {mockRewardCalendar.map((d) => (
            <div key={d.day} className={`relative aspect-square rounded-xl border flex flex-col items-center justify-center text-xs ${
              d.today ? "bg-gradient-primary text-primary-foreground shadow-glow-primary border-transparent" :
              d.claimed ? "bg-success/15 text-success border-success/30" : "glass border-border text-muted-foreground"
            }`}>
              <span className="text-[9px] opacity-80">D{d.day}</span>
              {d.claimed ? <Check className="h-3 w-3" /> : <span className="text-[10px] font-semibold">{d.xp}</span>}
            </div>
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <div className="rounded-3xl glass p-6 shadow-card">
          <h2 className="font-display text-xl font-bold">Promo Code</h2>
          <div className="mt-4 flex gap-2">
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="WELCOME500" className="flex-1 rounded-xl bg-card/60 border border-border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary uppercase tracking-wider" />
            <button className="rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow-primary">Claim</button>
          </div>
          <div className="mt-5 text-xs uppercase tracking-widest text-muted-foreground">Claimed history</div>
          <div className="mt-2 space-y-2">
            {mockPromoHistory.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-xl bg-card/60 border border-border px-4 py-2.5">
                <div>
                  <div className="font-mono text-sm">{p.code}</div>
                  <div className="text-[10px] text-muted-foreground">{p.claimed}</div>
                </div>
                <span className="text-sm font-semibold text-gradient-xp tabular-nums">+{p.xp} XP</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl glass p-6 shadow-card">
          <h2 className="font-display text-xl font-bold">Achievements</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {mockAchievements.map((a) => {
              const Icon = a.icon;
              return (
                <div key={a.id} className={`relative overflow-hidden rounded-2xl glass p-4 shadow-card ${!a.unlocked && "opacity-70"}`}>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${a.unlocked ? "bg-gradient-xp shadow-glow-xp text-xp-foreground" : "bg-card border border-border text-muted-foreground"}`}>
                    {a.unlocked ? <Icon className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                  </div>
                  <div className="mt-3 font-display text-sm font-bold">{a.name}</div>
                  <div className="text-[10px] text-muted-foreground">{a.desc}</div>
                  <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-xp"><Sparkles className="h-3 w-3" /> +{a.xp}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
