import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { mockOfferwalls, mockSurveys } from "@/data/mock";
import { Pencil, Trash2, Plus } from "lucide-react";

function ProviderAdminTable({ title, items }: { title: string; items: typeof mockOfferwalls }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">{title}</h2>
        <button className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow-primary"><Plus className="h-4 w-4" /> Add Provider</button>
      </div>
      <div className="rounded-3xl glass shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
              <tr>
                <th className="text-left p-3 px-5">Provider</th>
                <th className="text-left p-3">Slug</th>
                <th className="text-center p-3">Top</th>
                <th className="text-center p-3">Enabled</th>
                <th className="text-right p-3 px-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map(p => {
                const Icon = p.icon;
                return (
                  <tr key={p.id} className="hover:bg-card/40">
                    <td className="p-3 px-5">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-card/70 border border-border"><Icon className="h-4 w-4" /></div>
                        <span className="font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-xs text-muted-foreground">{p.slug}</td>
                    <td className="p-3 text-center">{p.isTopOffer ? <span className="rounded-full bg-destructive/15 text-destructive text-[10px] font-bold px-2 py-0.5">HOT</span> : "—"}</td>
                    <td className="p-3 text-center"><span className={`inline-block h-2 w-2 rounded-full ${p.enabled ? "bg-success" : "bg-muted-foreground/40"}`} /></td>
                    <td className="p-3 px-5 text-right">
                      <div className="inline-flex gap-1">
                        <button className="rounded-lg bg-card/60 hover:bg-card p-1.5"><Pencil className="h-3.5 w-3.5" /></button>
                        <button className="rounded-lg bg-destructive/15 text-destructive p-1.5"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/_admin/admin/offerwalls")({
  head: () => ({ meta: [{ title: "Admin · Offerwalls" }] }),
  component: () => (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin" title="Offerwall Partners" />
      <ProviderAdminTable title="Offerwalls" items={mockOfferwalls} />
    </div>
  ),
});

export { ProviderAdminTable };
