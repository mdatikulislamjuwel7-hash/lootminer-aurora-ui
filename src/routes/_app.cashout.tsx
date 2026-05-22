import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { mockPaymentMethods, mockCashouts, mockUser, mockSettings } from "@/data/mock";

export const Route = createFileRoute("/_app/cashout")({
  head: () => ({ meta: [{ title: "Cashout — LootMiner" }] }),
  component: Cashout,
});

function Cashout() {
  const [selected, setSelected] = useState(mockPaymentMethods[0].id);
  const [xp, setXp] = useState(1000);
  const method = mockPaymentMethods.find(m => m.id === selected)!;
  const usd = (xp / mockSettings.xpPerUsd).toFixed(2);

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Withdraw" title="Cashout" subtitle="Convert XP to real money. Instant on most methods." />

      {/* Balance hero */}
      <div className="relative overflow-hidden rounded-3xl glass p-6 md:p-8 shadow-card">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-gradient-xp opacity-30 blur-3xl animate-glow-pulse" />
        <div className="relative">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Available XP</div>
          <div className="mt-2 font-display text-6xl font-bold tabular-nums text-gradient-xp">{mockUser.balanceXp.toLocaleString()}</div>
          <p className="mt-1 text-sm text-muted-foreground">≈ ${(mockUser.balanceXp / 1000).toFixed(2)} USD</p>
        </div>
      </div>

      {/* Methods */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {mockPaymentMethods.map((m) => {
          const Icon = m.icon;
          const active = selected === m.id;
          return (
            <button key={m.id} onClick={() => setSelected(m.id)} className={`relative overflow-hidden rounded-2xl glass p-4 text-left shadow-card transition ${active ? "ring-2 ring-primary shadow-glow-primary" : "hover:bg-card"}`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${m.gradient} opacity-50`} />
              <div className="relative">
                <Icon className="h-6 w-6" />
                <div className="mt-3 font-display font-semibold">{m.name}</div>
                <div className="mt-0.5 text-[10px] text-muted-foreground">Min {m.min} XP · {m.time}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Withdraw form */}
      <div className="rounded-3xl glass p-6 shadow-card">
        <h2 className="font-display text-xl font-bold">Withdraw to {method.name}</h2>
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Account / Address</span>
            <input placeholder="you@mail.com or wallet address" className="mt-1.5 w-full rounded-xl bg-card/60 border border-border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary" />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">XP Amount</span>
            <input type="number" value={xp} min={method.min} onChange={(e) => setXp(Math.max(method.min, +e.target.value || 0))} className="mt-1.5 w-full rounded-xl bg-card/60 border border-border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary" />
          </label>
          <div className="md:col-span-2">
            <input type="range" min={method.min} max={mockUser.balanceXp} step={100} value={xp} onChange={(e) => setXp(+e.target.value)} className="w-full accent-primary" />
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">USD estimate</span>
              <span className="font-display text-2xl font-bold text-gradient-primary">${usd}</span>
            </div>
          </div>
        </div>
        <button className="mt-5 w-full md:w-auto rounded-xl bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow-primary">Submit Withdrawal</button>
      </div>

      {/* History */}
      <div className="rounded-3xl glass shadow-card overflow-hidden">
        <div className="p-5 font-display text-xl font-bold">Cashout History</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground border-y border-border">
              <tr>
                <th className="text-left p-3 px-5">Method</th>
                <th className="text-right p-3">XP</th>
                <th className="text-right p-3">USD</th>
                <th className="text-center p-3">Status</th>
                <th className="text-right p-3 px-5">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockCashouts.map((c) => (
                <tr key={c.id} className="hover:bg-card/40 transition">
                  <td className="p-3 px-5 font-medium">{c.method}</td>
                  <td className="p-3 text-right tabular-nums">{c.xp.toLocaleString()}</td>
                  <td className="p-3 text-right tabular-nums">${c.usd.toFixed(2)}</td>
                  <td className="p-3 text-center">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      c.status === "Approved" ? "bg-success/15 text-success" :
                      c.status === "Pending" ? "bg-warning/15 text-warning" :
                      "bg-destructive/15 text-destructive"
                    }`}>{c.status}</span>
                  </td>
                  <td className="p-3 px-5 text-right text-muted-foreground">{c.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
