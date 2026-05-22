import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { mockPromoHistory } from "@/data/mock";
import { Plus, Pencil, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/promos")({
  head: () => ({ meta: [{ title: "Admin · Promo Codes" }] }),
  component: () => (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin" title="Promo Codes" />
      <div className="rounded-3xl glass p-5 shadow-card grid md:grid-cols-5 gap-3">
        <input placeholder="CODE" className="rounded-xl bg-card/60 border border-border px-3 py-2 text-sm uppercase tracking-wider" />
        <input placeholder="XP reward" type="number" className="rounded-xl bg-card/60 border border-border px-3 py-2 text-sm" />
        <input placeholder="Max uses" type="number" className="rounded-xl bg-card/60 border border-border px-3 py-2 text-sm" />
        <label className="flex items-center gap-2 text-sm rounded-xl bg-card/60 border border-border px-3 py-2"><input type="checkbox" defaultChecked /> Active</label>
        <button className="rounded-xl bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow-primary inline-flex items-center gap-1.5 justify-center"><Plus className="h-4 w-4" /> Add</button>
      </div>
      <div className="rounded-3xl glass shadow-card overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
            <tr>{["Code", "XP", "Uses / Max", "Active", "Created", "Actions"].map(c => <th key={c} className="text-left p-3 px-5">{c}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockPromoHistory.map(p => (
              <tr key={p.id} className="hover:bg-card/40">
                <td className="p-3 px-5 font-mono">{p.code}</td>
                <td className="p-3 font-semibold text-gradient-xp">{p.xp}</td>
                <td className="p-3">12 / 1000</td>
                <td className="p-3"><span className="inline-block h-2 w-2 rounded-full bg-success" /></td>
                <td className="p-3 text-muted-foreground">{p.claimed}</td>
                <td className="p-3 px-5">
                  <div className="inline-flex gap-1">
                    <button className="rounded-lg bg-card/60 p-1.5"><Pencil className="h-3.5 w-3.5" /></button>
                    <button className="rounded-lg bg-destructive/15 text-destructive p-1.5"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ),
});
