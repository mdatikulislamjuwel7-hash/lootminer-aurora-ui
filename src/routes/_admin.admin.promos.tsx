import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Toggle } from "@/components/admin/StatusBadge";
import { mockPromoHistory } from "@/data/mock";
import { Plus, Pencil, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/promos")({
  head: () => ({ meta: [{ title: "Admin · Promo Codes" }] }),
  component: PromosPage,
});

function PromosPage() {
  const [code, setCode] = useState("");
  const [active, setActive] = useState(true);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin" title="Promo codes" />

      <section className="rounded-3xl glass p-5 shadow-card">
        <h2 className="font-display text-lg font-bold mb-4">Create promo code</h2>
        <div className="grid md:grid-cols-6 gap-3">
          <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="CODE" className="md:col-span-2 rounded-xl bg-card/60 border border-border px-3 py-2 text-sm uppercase tracking-wider font-mono" />
          <input type="number" placeholder="XP Reward" className="rounded-xl bg-card/60 border border-border px-3 py-2 text-sm" />
          <input type="number" placeholder="Max uses (0=∞)" className="rounded-xl bg-card/60 border border-border px-3 py-2 text-sm" />
          <input type="date" className="rounded-xl bg-card/60 border border-border px-3 py-2 text-sm" />
          <button className="rounded-xl bg-gradient-primary text-primary-foreground px-4 py-2 text-sm font-semibold shadow-glow-primary inline-flex items-center justify-center gap-1.5">
            <Plus className="h-4 w-4" /> Create
          </button>
          <div className="md:col-span-6 flex items-center justify-between rounded-2xl bg-card/60 border border-border p-3">
            <span className="text-sm font-medium">Active</span>
            <Toggle checked={active} onChange={() => setActive(v => !v)} />
          </div>
        </div>
      </section>

      <div className="rounded-3xl glass shadow-card overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
            <tr>{["Code", "XP Reward", "Uses / Max", "Active", "Expiry", "Created", "Actions"].map(c => <th key={c} className="text-left p-3 px-5 whitespace-nowrap">{c}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockPromoHistory.map(p => (
              <tr key={p.id} className="hover:bg-card/40">
                <td className="p-3 px-5 font-mono font-semibold">{p.code}</td>
                <td className="p-3 font-semibold text-gradient-xp tabular-nums">{p.xp.toLocaleString()}</td>
                <td className="p-3 tabular-nums">12 / 1000</td>
                <td className="p-3"><Toggle checked /></td>
                <td className="p-3 text-muted-foreground">—</td>
                <td className="p-3 text-muted-foreground">{p.claimed}</td>
                <td className="p-3 px-5">
                  <div className="inline-flex gap-1">
                    <button className="rounded-lg bg-card/60 hover:bg-card p-1.5"><Pencil className="h-3.5 w-3.5" /></button>
                    <button className="rounded-lg bg-destructive/15 text-destructive hover:bg-destructive/25 p-1.5"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
