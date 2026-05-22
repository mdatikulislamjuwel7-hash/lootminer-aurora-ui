import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { mockLevels } from "@/data/mock";
import { Plus, Pencil, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/levels")({
  head: () => ({ meta: [{ title: "Admin · Levels" }] }),
  component: () => (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin" title="Levels & Progression" action={
        <button className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow-primary"><Plus className="h-4 w-4" /> Add Level</button>
      } />
      <div className="rounded-3xl glass shadow-card overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
            <tr>{["Level", "Required XP", "Bonus XP", "Badge", "Actions"].map(c => <th key={c} className="text-left p-3 px-5">{c}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockLevels.map(l => (
              <tr key={l.level} className="hover:bg-card/40">
                <td className="p-3 px-5 font-display text-lg font-bold">{l.level}</td>
                <td className="p-3 tabular-nums">{l.requiredXp.toLocaleString()}</td>
                <td className="p-3 tabular-nums text-gradient-xp font-semibold">+{l.bonusXp}</td>
                <td className="p-3"><span className="rounded-full bg-gradient-accent text-accent-foreground px-3 py-0.5 text-[10px] font-bold uppercase">{l.badge}</span></td>
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
