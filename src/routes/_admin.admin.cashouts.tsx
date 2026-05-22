import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { mockAdminCashouts } from "@/data/mock";
import { Check, X } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/cashouts")({
  head: () => ({ meta: [{ title: "Admin · Cashout" }] }),
  component: () => {
    const [tab, setTab] = useState<"All" | "Pending" | "Approved" | "Rejected">("All");
    const list = mockAdminCashouts.filter(c => tab === "All" ? true : c.status === tab);
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="Admin" title="Cashout requests" />
        <div className="flex gap-2">
          {(["All", "Pending", "Approved", "Rejected"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`rounded-full px-3 py-1.5 text-sm border ${tab === t ? "bg-gradient-primary text-primary-foreground border-transparent shadow-glow-primary" : "glass"}`}>{t}</button>
          ))}
        </div>
        <div className="rounded-3xl glass shadow-card overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
              <tr>{["User", "Method", "XP", "USD", "Account", "Date", "Status", "Actions"].map(c => <th key={c} className="text-left p-3 px-3 whitespace-nowrap">{c}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-border">
              {list.map(c => (
                <tr key={c.id} className="hover:bg-card/40">
                  <td className="p-3 font-medium">{c.user}</td>
                  <td className="p-3">{c.method}</td>
                  <td className="p-3 text-right font-semibold text-gradient-xp tabular-nums">{c.xp.toLocaleString()}</td>
                  <td className="p-3 text-right">${c.usd.toFixed(2)}</td>
                  <td className="p-3 font-mono text-xs text-muted-foreground">{c.account}</td>
                  <td className="p-3 text-muted-foreground">{c.date}</td>
                  <td className="p-3"><span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${c.status === "Approved" ? "bg-success/15 text-success" : c.status === "Pending" ? "bg-warning/15 text-warning" : "bg-destructive/15 text-destructive"}`}>{c.status}</span></td>
                  <td className="p-3">
                    <div className="inline-flex gap-1">
                      <button className="rounded-lg bg-success/15 text-success p-1.5"><Check className="h-3.5 w-3.5" /></button>
                      <button className="rounded-lg bg-destructive/15 text-destructive p-1.5"><X className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  },
});
