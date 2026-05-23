import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { mockAdminStats, mockChartData, mockAdminCashouts, mockAdminUsers, mockPostbacks } from "@/data/mock";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { Users, Sparkles, Wallet, TrendingUp, Check, X, Radio } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/")({
  head: () => ({ meta: [{ title: "Admin Dashboard — LootMiner" }] }),
  component: AdminDash,
});

function AdminDash() {
  const s = mockAdminStats;
  const stats = [
    { l: "Total Users", v: s.totalUsers.toLocaleString(), icon: Users, tint: "from-cyan-500/30 to-blue-600/20" },
    { l: "Today Signups", v: s.todaySignups.toLocaleString(), icon: TrendingUp, tint: "from-emerald-500/30 to-teal-600/20" },
    { l: "XP Paid Out", v: s.xpPaid.toLocaleString(), icon: Sparkles, tint: "from-violet-500/30 to-fuchsia-600/20", xp: true },
    { l: "Pending Cashouts", v: s.pendingCashouts.toString(), icon: Wallet, tint: "from-amber-500/30 to-orange-600/20" },
  ];
  const earnings = [
    { l: "Users — Today Earnings", v: s.userTodayEarnings.toLocaleString() + " XP", tint: "from-cyan-500/25 to-sky-600/15" },
    { l: "Users — Monthly Earnings", v: s.userMonthlyEarnings.toLocaleString() + " XP", tint: "from-violet-500/25 to-indigo-600/15" },
    { l: "My Revenue — Today", v: "$" + s.myTodayRevenue.toLocaleString(), tint: "from-emerald-500/25 to-green-600/15" },
    { l: "My Revenue — This Month", v: "$" + s.myMonthlyRevenue.toLocaleString(), tint: "from-amber-500/25 to-orange-600/15" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Admin" title="Operations dashboard" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((c) => (
          <div key={c.l} className={`relative overflow-hidden rounded-2xl glass p-4 shadow-card`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${c.tint} opacity-50 pointer-events-none`} />
            <div className="relative flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{c.l}</span>
              <c.icon className="h-4 w-4 text-primary" />
            </div>
            <div className={`relative mt-2 font-display text-2xl font-bold tabular-nums ${c.xp ? "text-gradient-xp" : ""}`}>{c.v}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {earnings.map((c) => (
          <div key={c.l} className="relative overflow-hidden rounded-2xl glass p-4 shadow-card">
            <div className={`absolute inset-0 bg-gradient-to-br ${c.tint} opacity-60 pointer-events-none`} />
            <div className="relative text-[11px] uppercase tracking-widest text-muted-foreground">{c.l}</div>
            <div className="relative mt-2 font-display text-xl font-bold tabular-nums">{c.v}</div>
          </div>
        ))}
      </div>


      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-3xl glass p-5 shadow-card">
          <h3 className="font-display text-lg font-bold">7-day new signups</h3>
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockChartData.signups}>
                <CartesianGrid stroke="oklch(1 0 0 / 0.06)" />
                <XAxis dataKey="day" stroke="oklch(0.72 0.02 240)" fontSize={11} />
                <YAxis stroke="oklch(0.72 0.02 240)" fontSize={11} />
                <Tooltip contentStyle={{ background: "oklch(0.18 0.025 260)", border: "1px solid oklch(1 0 0 / 0.08)", borderRadius: 12 }} />
                <Line type="monotone" dataKey="v" stroke="oklch(0.82 0.15 200)" strokeWidth={3} dot={{ fill: "oklch(0.82 0.15 200)", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-3xl glass p-5 shadow-card">
          <h3 className="font-display text-lg font-bold">7-day XP distributed</h3>
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockChartData.xpDist}>
                <CartesianGrid stroke="oklch(1 0 0 / 0.06)" />
                <XAxis dataKey="day" stroke="oklch(0.72 0.02 240)" fontSize={11} />
                <YAxis stroke="oklch(0.72 0.02 240)" fontSize={11} />
                <Tooltip contentStyle={{ background: "oklch(0.18 0.025 260)", border: "1px solid oklch(1 0 0 / 0.08)", borderRadius: 12 }} />
                <Bar dataKey="v" fill="oklch(0.62 0.24 305)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-3xl glass p-5 shadow-card">
        <div className="flex items-center gap-2 mb-3">
          <Radio className="h-4 w-4 text-primary animate-pulse" />
          <h3 className="font-display text-lg font-bold">Live postback feed</h3>
          <span className="ml-auto text-[10px] uppercase tracking-widest text-muted-foreground">Last 10</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
              <tr>
                {["Network", "User", "Offer", "XP", "Time", "Status"].map(c => <th key={c} className="text-left p-2 whitespace-nowrap">{c}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {mockPostbacks.slice(0, 10).map(p => (
                <tr key={p.id} className="hover:bg-card/40">
                  <td className="p-2"><span className="rounded-full bg-card/70 border border-border px-2 py-0.5 text-[10px] font-medium">{p.network}</span></td>
                  <td className="p-2 font-medium">{p.user}</td>
                  <td className="p-2 text-muted-foreground truncate max-w-[180px]">{p.offer}</td>
                  <td className="p-2 text-right font-semibold text-gradient-xp tabular-nums">{p.xp.toLocaleString()}</td>
                  <td className="p-2 font-mono text-[11px] text-muted-foreground">{p.time}</td>
                  <td className="p-2"><StatusBadge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-3xl glass shadow-card overflow-hidden">
          <div className="flex items-center justify-between p-5">
            <h3 className="font-display text-lg font-bold">Recent cashout requests</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-muted-foreground border-y border-border">
                <tr>{["User", "Method", "XP", "USD", "Status", "Actions"].map(c => <th key={c} className="text-left p-3 px-5">{c}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mockAdminCashouts.slice(0, 5).map(c => (
                  <tr key={c.id} className="hover:bg-card/40">
                    <td className="p-3 px-5 font-medium">{c.user}</td>
                    <td className="p-3">{c.method}</td>
                    <td className="p-3 text-right font-semibold text-gradient-xp tabular-nums">{c.xp.toLocaleString()}</td>
                    <td className="p-3 text-right">${c.usd.toFixed(2)}</td>
                    <td className="p-3"><StatusBadge status={c.status} /></td>
                    <td className="p-3 px-5">
                      <div className="inline-flex gap-1">
                        <button className="rounded-lg bg-success/15 text-success hover:bg-success/25 p-1.5"><Check className="h-3.5 w-3.5" /></button>
                        <button className="rounded-lg bg-destructive/15 text-destructive hover:bg-destructive/25 p-1.5"><X className="h-3.5 w-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-3xl glass shadow-card overflow-hidden">
          <div className="flex items-center justify-between p-5">
            <h3 className="font-display text-lg font-bold">Recent new users</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-muted-foreground border-y border-border">
                <tr>{["User", "Email", "Joined", "Level"].map(c => <th key={c} className="text-left p-3 px-5">{c}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mockAdminUsers.slice(0, 5).map(u => (
                  <tr key={u.id} className="hover:bg-card/40">
                    <td className="p-3 px-5">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-primary text-xs font-bold text-primary-foreground">{u.avatar}</div>
                        <span className="font-medium">{u.username}</span>
                      </div>
                    </td>
                    <td className="p-3 text-muted-foreground">{u.email}</td>
                    <td className="p-3 text-muted-foreground">{u.joined}</td>
                    <td className="p-3 px-5"><span className="rounded-full bg-gradient-accent text-accent-foreground px-2 py-0.5 text-[10px] font-bold">Lv {u.level}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
