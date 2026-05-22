import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { achievements, leaderboard, user } from "@/data/mock";
import { Check, Flame, Gift, Lock, Trophy } from "lucide-react";

export const Route = createFileRoute("/rewards")({
  head: () => ({
    meta: [
      { title: "Rewards — LootMiner" },
      { name: "description", content: "Claim daily bonuses, build streaks, and unlock achievements." },
    ],
  }),
  component: Rewards,
});

function Rewards() {
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Rewards" title="Streaks, bonuses & glory" subtitle="The longer you grind, the bigger the loot." />

      <section className="grid gap-4 lg:grid-cols-2">
        {/* Daily bonus */}
        <div className="relative overflow-hidden rounded-3xl glass p-6 shadow-card">
          <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-gradient-success opacity-20 blur-3xl animate-glow-pulse" />
          <div className="relative">
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-success" />
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Daily bonus</span>
            </div>
            <h2 className="mt-3 font-display text-3xl font-bold">Claim today's loot</h2>
            <p className="mt-1 text-sm text-muted-foreground">Day {user.streak} of your streak</p>

            <div className="mt-5 grid grid-cols-7 gap-1.5">
              {Array.from({ length: 14 }).slice(0, 7).map((_, i) => {
                const day = i + 1;
                const claimed = day < 7;
                const today = day === 7;
                return (
                  <div
                    key={i}
                    className={`relative flex aspect-square flex-col items-center justify-center rounded-xl text-xs font-semibold ${
                      today ? "bg-gradient-primary text-primary-foreground shadow-glow-primary" :
                      claimed ? "bg-success/15 text-success" : "glass text-muted-foreground"
                    }`}
                  >
                    <span className="text-[9px] opacity-70">D{day}</span>
                    {claimed ? <Check className="h-3 w-3" /> : <span className="text-[10px]">+{day * 50}</span>}
                  </div>
                );
              })}
            </div>

            <button className="mt-5 w-full rounded-xl bg-gradient-primary py-3 font-semibold text-primary-foreground shadow-glow-primary hover:opacity-95 transition">
              Claim 350 coins
            </button>
          </div>
        </div>

        {/* Streak */}
        <div className="relative overflow-hidden rounded-3xl glass p-6 shadow-card">
          <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-gradient-accent opacity-25 blur-3xl" />
          <div className="relative flex h-full flex-col">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-warning" />
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Streak</span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-6xl font-bold tabular-nums">{user.streak}</span>
              <span className="font-display text-xl text-muted-foreground">days</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Next milestone: 30 days · +5,000 coins</p>

            <div className="mt-auto pt-6">
              <div className="h-2 overflow-hidden rounded-full bg-card border border-border">
                <div className="h-full bg-gradient-to-r from-warning to-destructive" style={{ width: `${(user.streak / 30) * 100}%` }} />
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>Day 0</span><span>Day 30</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section>
        <h2 className="mb-4 font-display text-2xl font-bold">Achievements</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {achievements.map(a => (
            <div key={a.id} className={`relative overflow-hidden rounded-2xl glass p-5 shadow-card ${!a.unlocked && "opacity-70"}`}>
              <div className="flex items-start gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${a.unlocked ? "bg-gradient-primary shadow-glow-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"}`}>
                  {a.unlocked ? <a.icon className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display font-semibold">{a.name}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{a.desc}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">+{a.points} XP</span>
                <span className={a.unlocked ? "text-success" : "text-muted-foreground"}>{a.unlocked ? "Unlocked" : "Locked"}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Leaderboard */}
      <section>
        <h2 className="mb-4 font-display text-2xl font-bold">Weekly leaderboard</h2>
        <div className="overflow-hidden rounded-2xl glass shadow-card divide-y divide-border">
          {leaderboard.map(r => (
            <div key={r.rank} className={`flex items-center gap-3 p-4 ${r.you && "bg-primary/10"}`}>
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl font-display font-bold ${
                r.rank === 1 ? "bg-warning text-warning-foreground" :
                r.rank === 2 ? "bg-muted text-foreground" :
                r.rank === 3 ? "bg-destructive/70 text-destructive-foreground" :
                "bg-card border border-border"
              }`}>
                {r.rank}
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-accent text-sm font-bold text-accent-foreground">
                {r.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium">{r.name} {r.you && <span className="text-xs text-primary">(you)</span>}</div>
              </div>
              <div className="flex items-center gap-1 font-display font-semibold tabular-nums">
                <Trophy className="h-4 w-4 text-warning" /> {r.earned.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
