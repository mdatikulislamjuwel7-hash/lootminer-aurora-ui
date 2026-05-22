import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

import { ProviderGrid } from "@/components/offerwall/ProviderGrid";
import { user, activity } from "@/data/mock";
import { ArrowUpRight, Coins, Flame, Sparkles, TrendingUp, Trophy, Wallet } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — LootMiner" },
      { name: "description", content: "Earn rewards from top offerwalls and cash out instantly." },
      { property: "og:title", content: "LootMiner — Earn. Cash out. Repeat." },
      { property: "og:description", content: "The premium rewards platform for gamers." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const xpPct = Math.round((user.xp / user.xpMax) * 100);
  return (
    <div className="space-y-8">
      {/* Hero / Balance */}
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 relative overflow-hidden rounded-3xl glass p-6 md:p-8 shadow-card">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-gradient-primary opacity-20 blur-3xl animate-glow-pulse" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-card/60 px-3 py-1 text-xs text-muted-foreground border border-border">
              <Flame className="h-3 w-3 text-warning" /> {user.streak}-day streak
            </span>
            <h1 className="mt-4 font-display text-sm font-medium text-muted-foreground">Welcome back, {user.name.split(" ")[0]}</h1>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-5xl md:text-6xl font-bold tabular-nums text-gradient-primary">
                {user.balance.toLocaleString()}
              </span>
              <span className="font-display text-2xl text-muted-foreground">coins</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">≈ ${(user.balance / 1000).toFixed(2)} USD</p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Link to="/cashout" className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow-primary hover:opacity-95 transition">
                <Wallet className="h-4 w-4" /> Cash out
              </Link>
              <Link to="/earn" className="inline-flex items-center gap-2 rounded-xl glass px-4 py-2.5 text-sm font-semibold hover:bg-card transition">
                <Sparkles className="h-4 w-4" /> Earn more
              </Link>
            </div>
          </div>
        </div>

        {/* Level / XP */}
        <div className="relative overflow-hidden rounded-3xl glass p-6 shadow-card">
          <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-gradient-accent opacity-20 blur-3xl" />
          <div className="relative flex h-full flex-col">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Level</span>
              <Trophy className="h-4 w-4 text-accent" />
            </div>
            <div className="mt-2 font-display text-5xl font-bold">{user.level}</div>
            <p className="mt-1 text-xs text-muted-foreground">Diamond tier</p>

            <div className="mt-auto pt-6">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{user.xp.toLocaleString()} XP</span>
                <span>{user.xpMax.toLocaleString()} XP</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-card border border-border">
                <div className="h-full bg-gradient-primary shadow-glow-primary" style={{ width: `${xpPct}%` }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: "Today", value: "+2,420", icon: TrendingUp, tone: "text-success" },
          { label: "This week", value: "+18,650", icon: Coins, tone: "text-primary" },
          { label: "Lifetime", value: "184,920", icon: Trophy, tone: "text-accent" },
          { label: "Cashed out", value: "$142.30", icon: Wallet, tone: "text-warning" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl glass p-4 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{s.label}</span>
              <s.icon className={`h-4 w-4 ${s.tone}`} />
            </div>
            <div className="mt-2 font-display text-2xl font-bold tabular-nums">{s.value}</div>
          </div>
        ))}
      </section>

      {/* Featured offerwall */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">Featured offers</h2>
            <p className="text-sm text-muted-foreground">Hand-picked, highest paying</p>
          </div>
          <Link to="/earn" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            View all <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <ProviderGrid limit={6} />
      </section>

      {/* Recent activity */}
      <section>
        <h2 className="mb-4 font-display text-2xl font-bold">Recent activity</h2>
        <div className="overflow-hidden rounded-2xl glass shadow-card divide-y divide-border">
          {activity.map(a => (
            <div key={a.id} className="flex items-center gap-3 p-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                a.type === "earn" ? "bg-success/15 text-success" :
                a.type === "cashout" ? "bg-warning/15 text-warning" :
                "bg-accent/15 text-accent"
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
      </section>
    </div>
  );
}
