import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { userAPI } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Flame, Sparkles, TrendingUp, Trophy, Wallet, Coins, Gift, Copy, Users, LifeBuoy, Check } from "lucide-react";
import { XpBadge } from "@/components/common/XpBadge";
import { SkeletonCard, EmptyState } from "@/components/common/SkeletonCard";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — LootMiner" }] }),
  component: Dashboard,
});

type Activity = { id: number | string; provider: string; offer: string; xp: number; time: string; status: string };

function Dashboard() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({ queryKey: ["user-dashboard"], queryFn: userAPI.dashboard });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} className="h-28" />)}
      </div>
    );
  }
  if (!data) return <EmptyState title="No dashboard data" hint="Try again in a moment." />;

  const d = data;
  const balanceXp = d.balanceXp ?? user?.balanceXp ?? 0;
  const totalEarned = d.totalEarned ?? 0;
  const todayEarned = d.todayEarned ?? 0;
  const pendingXp = d.pendingXp ?? 0;
  const level = d.level ?? user?.level ?? 1;
  const xpToNext = d.xpToNext ?? 0;
  const xpForNext = d.xpForNext ?? 1;
  const streak = d.streak ?? 0;
  const referralCode = d.referralCode ?? user?.referralCode ?? "";
  const activities: Activity[] = d.recentActivity ?? d.activities ?? [];
  const dailyBonusClaimed = !!d.dailyBonusClaimed;
  const dailyBonusXp = d.dailyBonusXp ?? 350;
  const pct = Math.min(100, Math.round((xpToNext / Math.max(1, xpForNext)) * 100));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold">Welcome back, {user?.username ?? "miner"}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            {user?.joinDate && (
              <span className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1 text-xs text-muted-foreground">
                <Users className="h-3 w-3" /> Member since {new Date(user.joinDate).toLocaleDateString(undefined, { month: "short", year: "numeric" })}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/15 text-warning px-3 py-1 text-xs font-medium border border-warning/30">
              <Flame className="h-3 w-3" /> {streak}-day streak
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: "Total Earned", value: totalEarned, icon: Trophy, tone: "from-cyan-500/30 to-blue-500/20" },
          { label: "Available XP", value: balanceXp, icon: Sparkles, tone: "from-amber-500/30 to-yellow-500/20", xp: true },
          { label: "Today's Earnings", value: todayEarned, icon: TrendingUp, tone: "from-emerald-500/30 to-teal-500/20" },
          { label: "Pending XP", value: pendingXp, icon: Coins, tone: "from-violet-500/30 to-fuchsia-500/20" },
        ].map((s) => (
          <div key={s.label} className="relative overflow-hidden rounded-2xl glass p-4 md:p-5 shadow-card">
            <div className={`absolute inset-0 bg-gradient-to-br ${s.tone} opacity-50`} />
            <div className="relative">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{s.label}</span>
                <s.icon className="h-4 w-4 text-foreground/70" />
              </div>
              <div className={`mt-2 font-display text-2xl md:text-3xl font-bold tabular-nums ${s.xp ? "text-gradient-xp" : ""}`}>
                {Number(s.value).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="relative overflow-hidden rounded-3xl glass p-6 shadow-card">
            <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-gradient-primary opacity-20 blur-3xl animate-glow-pulse" />
            <div className="relative flex flex-wrap items-center gap-5">
              <div className="relative">
                <div className="absolute -inset-2 rounded-full bg-gradient-primary opacity-40 blur" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-primary shadow-glow-primary font-display text-3xl font-bold text-primary-foreground">
                  {level}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Level Progress</div>
                <div className="mt-1 font-display text-xl font-bold">{d.levelName ?? `Level ${level}`}</div>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-card border border-border">
                  <div className="h-full bg-gradient-primary shadow-glow-primary" style={{ width: `${pct}%` }} />
                </div>
                <div className="mt-1.5 flex justify-between text-xs text-muted-foreground">
                  <span>{xpToNext.toLocaleString()} XP</span>
                  <span>{xpForNext.toLocaleString()} XP to next</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl glass shadow-card overflow-hidden">
            <div className="flex items-center justify-between p-5">
              <h2 className="font-display text-xl font-bold">Recent Activity</h2>
              <Link to="/earn" className="text-xs text-primary hover:underline">View all</Link>
            </div>
            {activities.length === 0 ? (
              <div className="px-5 pb-5 text-sm text-muted-foreground">No activity yet — complete an offer to get started.</div>
            ) : (
              <div className="divide-y divide-border">
                {activities.map((a) => (
                  <div key={a.id} className="flex items-center gap-3 px-5 py-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${a.xp > 0 ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}`}>
                      {a.xp > 0 ? <Sparkles className="h-4 w-4" /> : <Wallet className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{a.offer}</div>
                      <div className="truncate text-xs text-muted-foreground">{a.provider} · {a.time}</div>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${a.status === "Credited" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}`}>
                      {a.status}
                    </span>
                    <div className={`font-display text-sm font-semibold tabular-nums ${a.xp > 0 ? "text-gradient-xp" : "text-warning"}`}>
                      {a.xp > 0 ? "+" : ""}{a.xp.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-3xl glass p-5 shadow-card">
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-xp opacity-30 blur-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-xp" />
                  <span className="font-display font-semibold">Daily Bonus</span>
                </div>
                <XpBadge value={dailyBonusXp} size="sm" />
              </div>
              <div className="mt-4 grid grid-cols-7 gap-1.5">
                {Array.from({ length: 7 }).map((_, i) => {
                  const claimed = i < streak;
                  const today = i === streak;
                  return (
                    <div key={i} className={`flex aspect-square flex-col items-center justify-center rounded-lg text-[10px] font-semibold ${
                      today ? "bg-gradient-primary text-primary-foreground shadow-glow-primary" :
                      claimed ? "bg-success/15 text-success" : "glass text-muted-foreground"
                    }`}>
                      <span>D{i + 1}</span>
                      {claimed && <Check className="h-2.5 w-2.5" />}
                    </div>
                  );
                })}
              </div>
              <Link to="/rewards" className="mt-4 block w-full rounded-xl bg-gradient-primary py-2.5 text-center text-sm font-semibold text-primary-foreground shadow-glow-primary">
                {dailyBonusClaimed ? "Claimed today" : "Claim Today"}
              </Link>
            </div>
          </div>

          <div className="rounded-3xl glass p-5 shadow-card">
            <div className="font-display font-semibold">Quick Actions</div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {[
                { to: "/earn", icon: Sparkles, label: "Earn" },
                { to: "/referrals", icon: Users, label: "Invite" },
                { to: "/cashout", icon: Wallet, label: "Cashout" },
                { to: "/support", icon: LifeBuoy, label: "Support" },
              ].map((q) => (
                <Link key={q.to} to={q.to} className="group rounded-xl bg-card/60 hover:bg-card border border-border p-3 flex flex-col items-center gap-1.5 transition">
                  <q.icon className="h-4 w-4 text-primary" />
                  <span className="text-xs">{q.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {referralCode && (
            <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-5 text-primary-foreground shadow-glow-primary">
              <div className="font-display font-bold">Invite friends</div>
              <p className="mt-1 text-xs opacity-90">Earn 10% of every friend's XP — forever.</p>
              <div className="mt-3 flex gap-2 rounded-xl bg-background/20 backdrop-blur p-1.5">
                <code className="flex-1 truncate text-xs font-mono px-2 py-1.5">{referralCode}</code>
                <button onClick={() => navigator.clipboard?.writeText(referralCode)}
                  className="rounded-lg bg-background/30 hover:bg-background/40 px-2.5 py-1.5 transition">
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
