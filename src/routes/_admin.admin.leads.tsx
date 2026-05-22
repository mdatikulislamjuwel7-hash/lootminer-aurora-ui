import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { mockAdminLeads } from "@/data/mock";

export const Route = createFileRoute("/_admin/admin/leads")({
  head: () => ({ meta: [{ title: "Admin · Leads" }] }),
  component: () => (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin" title="Leads" />
      <div className="flex flex-wrap gap-2">
        {["All providers", "All statuses", "All dates", "All users"].map(l => (
          <select key={l} className="rounded-xl glass px-3 py-2 text-sm bg-card/60"><option>{l}</option></select>
        ))}
      </div>
      <div className="rounded-3xl glass shadow-card overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
            <tr>
              {["User", "UserID", "Provider", "Offer", "TxID", "USD", "XP", "Status", "IP", "Country", "Source", "Date"].map(c => <th key={c} className="text-left p-3 px-3 whitespace-nowrap">{c}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockAdminLeads.map(l => (
              <tr key={l.id} className="hover:bg-card/40">
                <td className="p-3 font-medium">{l.user}</td>
                <td className="p-3 font-mono text-xs text-muted-foreground">{l.userID}</td>
                <td className="p-3">{l.provider}</td>
                <td className="p-3">{l.offer}</td>
                <td className="p-3 font-mono text-xs">{l.txId}</td>
                <td className="p-3 text-right">${l.usd}</td>
                <td className="p-3 text-right font-semibold text-gradient-xp">{l.xp.toLocaleString()}</td>
                <td className="p-3"><span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${l.status === "Approved" ? "bg-success/15 text-success" : l.status === "Pending" ? "bg-warning/15 text-warning" : "bg-destructive/15 text-destructive"}`}>{l.status}</span></td>
                <td className="p-3 text-muted-foreground">{l.ip}</td>
                <td className="p-3">{l.country}</td>
                <td className="p-3 text-muted-foreground">{l.source}</td>
                <td className="p-3 text-muted-foreground">{l.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ),
});
