import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { mockTopOffers } from "@/data/mock";
import { Pencil, Trash2, Plus } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/top-offers")({
  head: () => ({ meta: [{ title: "Admin · Top Offers" }] }),
  component: () => (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin" title="Top Offers" action={
        <button className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow-primary"><Plus className="h-4 w-4" /> Add Offer</button>
      } />
      <div className="rounded-3xl glass shadow-card overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
            <tr><th className="text-left p-3 px-5">Title</th><th className="text-left p-3">Provider</th><th className="text-right p-3">XP</th><th className="text-center p-3">Featured</th><th className="text-right p-3 px-5">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockTopOffers.map(o => (
              <tr key={o.id} className="hover:bg-card/40">
                <td className="p-3 px-5 font-medium">{o.title}</td>
                <td className="p-3 text-muted-foreground">{o.provider}</td>
                <td className="p-3 text-right font-semibold text-gradient-xp tabular-nums">{o.xp.toLocaleString()}</td>
                <td className="p-3 text-center">{o.featured ? <span className="rounded-full bg-destructive/15 text-destructive text-[10px] font-bold px-2 py-0.5">HOT</span> : "—"}</td>
                <td className="p-3 px-5 text-right">
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
