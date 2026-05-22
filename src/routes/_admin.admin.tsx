import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { mockAdminStats, mockChartData, mockAdminCashouts, mockAdminUsers } from "@/data/mock";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { Users, Sparkles, Wallet, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/_admin/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard — LootMiner" }] }),
  component: AdminDash,
});

function AdminDash() {
  const s = mockAdminStats;
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Admin" title="Operations dashboard" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {[
          { l: "Total Users", v: s.totalUsers.toLocaleString(), icon: Users },
          { l: "Today Signups", v: s.todaySignups.toLocaleString(), icon: TrendingUp },
          { l: "XP Paid", v: s.xpPaid.toLocaleString(), icon: Sparkles, xp: true },
          { l: "Pending Cashouts", v: s.pendingCashouts, icon: Wallet },
        ].map((c) => (
          <div key={c.l} className="rounded-2xl glass p-4 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{c.l}</span>
              <c.icon className="h-4 w-4 text-primary" />
            </div>
            <div className={`mt-2 font-display text-2xl font-bold tabular-nums ${c.xp ? "text-gradient-xp" : ""}`}>{c.v}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-3 md:gap-4">
        {[
          { l: "User today earnings", v: s.userTodayEarnings },
          { l: "User monthly earnings", v: s.userMonthlyEarnings },
          { l: "My today revenue", v: `$${s.myTodayRevenue.toLocaleString()}` },
          { l: "My monthly revenue", v: `$${s.myMonthlyRevenue.toLocaleString()}` },
        ].map((c) => (
          <div key={c.l} className="rounded-2xl glass p-4 shadow-card">
            <div className="text-xs text-muted-foreground">{c.l}</div>
            <div className="mt-1 font-display text-xl font-bold tabular-nums">{typeof c.v === "number" ? c.v.toLocaleString() : c.v}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-3xl glass p-5 shadow-card">
          <h3 className="font-display text-lg font-bold">7-day signups</h3>
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

      <div className="grid lg:grid-cols-2 gap-4">
        <SimpleTable title="Recent Cashouts" cols={["User", "Method", "XP", "Status"]} rows={mockAdminCashouts.slice(0, 5).map(c => [c.user, c.method, c.xp.toLocaleString(), c.status])} />
        <SimpleTable title="Recent Signups" cols={["User", "Email", "Level", "Joined"]} rows={mockAdminUsers.slice(0, 5).map(u => [u.username, u.email, u.level.toString(), u.joined])} />
      </div>
    </div>
  );
}

function SimpleTable({ title, cols, rows }: { title: string; cols: string[]; rows: string[][] }) {
  return (
    <div className="rounded-3xl glass shadow-card overflow-hidden">
      <div className="p-5 font-display text-lg font-bold">{title}</div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground border-y border-border">
            <tr>{cols.map((c) => <th key={c} className="text-left p-3 px-5">{c}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r, i) => (
              <tr key={i} className="hover:bg-card/40 transition">
                {r.map((c, j) => <td key={j} className="p-3 px-5">{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
