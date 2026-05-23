import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { mockAdminCashouts } from "@/data/mock";
import { Check, X } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/cashouts")({
  head: () => ({ meta: [{ title: "Admin · Cashouts" }] }),
  component: CashoutsPage,
});

function CashoutsPage() {
  const [tab, setTab] = useState<"All" | "Pending" | "Approved" | "Rejected">("All");
  const [selected, setSelected] = useState<number[]>([]);
  const [reject, setReject] = useState<number | null>(null);
  const [reason, setReason] = useState("");

  const list = mockAdminCashouts.filter(c => tab === "All" || c.status === tab);
  const allSelected = list.length > 0 && selected.length === list.length;

  const summary = [
    { l: "Pending", v: mockAdminCashouts.filter(c => c.status === "Pending").length, color: "text-warning" },
    { l: "Approved Today", v: 12, color: "text-success" },
    { l: "Rejected Today", v: 3, color: "text-destructive" },
    { l: "Total Paid USD", v: "$8,420.50", color: "text-gradient-xp" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin" title="Cashout requests" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {summary.map(s => (
          <div key={s.l} className="rounded-2xl glass p-4 shadow-card">
            <div className="text-xs text-muted-foreground">{s.l}</div>
            <div className={`mt-1 font-display text-2xl font-bold tabular-nums ${s.color}`}>{s.v}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-2">
          {(["All", "Pending", "Approved", "Rejected"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`rounded-full px-3 py-1.5 text-sm border ${tab === t ? "bg-gradient-primary text-primary-foreground border-transparent shadow-glow-primary" : "glass"}`}>{t}</button>
          ))}
        </div>
        <input type="date" className="ml-auto rounded-xl glass px-3 py-2 text-sm bg-card/60" />
        <input type="date" className="rounded-xl glass px-3 py-2 text-sm bg-card/60" />
        {selected.length > 0 && (
          <button className="rounded-xl bg-success/20 text-success border border-success/30 px-3 py-2 text-sm font-semibold">
            Bulk Approve ({selected.length})
          </button>
        )}
      </div>

      <div className="rounded-3xl glass shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
              <tr>
                <th className="p-3 px-4 w-10">
                  <input type="checkbox" checked={allSelected} onChange={() => setSelected(allSelected ? [] : list.map(c => c.id))} className="h-4 w-4 rounded accent-primary" />
                </th>
                {["User", "Method", "XP", "USD", "Account", "Submitted", "Status", "Actions"].map(c => (
                  <th key={c} className="text-left p-3 px-3 whitespace-nowrap">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {list.map(c => (
                <tr key={c.id} className="hover:bg-card/40">
                  <td className="p-3 px-4">
                    <input type="checkbox" checked={selected.includes(c.id)} onChange={() => setSelected(s => s.includes(c.id) ? s.filter(i => i !== c.id) : [...s, c.id])} className="h-4 w-4 rounded accent-primary" />
                  </td>
                  <td className="p-3 font-medium">{c.user}</td>
                  <td className="p-3">{c.method}</td>
                  <td className="p-3 text-right font-semibold text-gradient-xp tabular-nums">{c.xp.toLocaleString()}</td>
                  <td className="p-3 text-right">${c.usd.toFixed(2)}</td>
                  <td className="p-3 font-mono text-xs text-muted-foreground">{c.account}</td>
                  <td className="p-3 text-muted-foreground">{c.date}</td>
                  <td className="p-3"><StatusBadge status={c.status} /></td>
                  <td className="p-3">
                    <div className="inline-flex gap-1">
                      <button className="rounded-lg bg-success/15 text-success hover:bg-success/25 p-1.5"><Check className="h-3.5 w-3.5" /></button>
                      <button onClick={() => setReject(c.id)} className="rounded-lg bg-destructive/15 text-destructive hover:bg-destructive/25 p-1.5"><X className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {reject !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button onClick={() => setReject(null)} className="absolute inset-0 bg-background/70 backdrop-blur-md" />
          <div className="relative w-full max-w-md rounded-3xl glass shadow-card p-6 animate-page-in">
            <h3 className="font-display text-lg font-bold">Reject cashout</h3>
            <p className="mt-1 text-sm text-muted-foreground">Provide a reason to send to the user.</p>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={4} className="mt-4 w-full rounded-xl bg-card/60 border border-border px-3 py-2 text-sm" placeholder="e.g. invalid PayPal email" />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setReject(null)} className="rounded-xl glass px-4 py-2 text-sm">Cancel</button>
              <button onClick={() => { setReject(null); setReason(""); }} className="rounded-xl bg-destructive text-destructive-foreground px-4 py-2 text-sm font-semibold">Confirm Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
