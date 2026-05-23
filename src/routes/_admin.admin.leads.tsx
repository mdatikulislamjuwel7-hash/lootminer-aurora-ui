import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/common/PageHeader";
import { adminAPI } from "@/lib/api";

export const Route = createFileRoute("/_admin/admin/leads")({
  head: () => ({ meta: [{ title: "Admin · Leads" }] }),
  component: LeadsPage,
});

function LeadsPage() {
  const [provider, setProvider] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const { data } = useQuery({
    queryKey: ["admin", "leads", { provider, status, page }],
    queryFn: () => adminAPI.leads({ provider, status, page }),
  });

  const leads: any[] = data?.leads ?? [];
  const providers: string[] = data?.providers ?? [];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin" title="Leads" />
      <div className="flex flex-wrap gap-2">
        <select value={provider} onChange={(e) => { setProvider(e.target.value); setPage(1); }} className="rounded-xl glass px-3 py-2 text-sm bg-card/60">
          <option value="">All providers</option>
          {providers.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="rounded-xl glass px-3 py-2 text-sm bg-card/60">
          <option value="">All statuses</option>
          {["Approved", "Pending", "Reversed", "Rejected"].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="rounded-3xl glass shadow-card overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
            <tr>
              {["User", "UserID", "Provider", "Offer", "TxID", "USD", "XP", "Status", "IP", "Country", "Source", "Date"].map(c => <th key={c} className="text-left p-3 px-3 whitespace-nowrap">{c}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {leads.map(l => (
              <tr key={l.id} className="hover:bg-card/40">
                <td className="p-3 font-medium">{l.user ?? l.username}</td>
                <td className="p-3 font-mono text-xs text-muted-foreground">{l.userID ?? l.userId}</td>
                <td className="p-3">{l.provider ?? l.network}</td>
                <td className="p-3">{l.offer ?? l.offerName}</td>
                <td className="p-3 font-mono text-xs">{l.txId}</td>
                <td className="p-3 text-right">${l.usd}</td>
                <td className="p-3 text-right font-semibold text-gradient-xp">{Number(l.xp).toLocaleString()}</td>
                <td className="p-3"><span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${l.status === "Approved" || l.status === "Valid" ? "bg-success/15 text-success" : l.status === "Pending" ? "bg-warning/15 text-warning" : "bg-destructive/15 text-destructive"}`}>{l.status}</span></td>
                <td className="p-3 text-muted-foreground">{l.ip}</td>
                <td className="p-3">{l.country}</td>
                <td className="p-3 text-muted-foreground">{l.source}</td>
                <td className="p-3 text-muted-foreground">{l.date ?? l.createdAt}</td>
              </tr>
            ))}
            {leads.length === 0 && <tr><td colSpan={12} className="p-6 text-center text-sm text-muted-foreground">No leads yet.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end gap-1">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="rounded-lg glass px-3 py-1 text-xs disabled:opacity-40">‹ Prev</button>
        <span className="rounded-lg bg-gradient-primary text-primary-foreground px-3 py-1 text-xs">{page}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={leads.length < 50} className="rounded-lg glass px-3 py-1 text-xs disabled:opacity-40">Next ›</button>
      </div>
    </div>
  );
}
