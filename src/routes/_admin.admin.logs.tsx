import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { mockLogs } from "@/data/mock";
import { Download } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/logs")({
  head: () => ({ meta: [{ title: "Admin · Logs" }] }),
  component: LogsPage,
});

const filters = ["All", "Auth", "Cashout", "Promo", "Referral", "Admin Action", "Postback"] as const;

const typeMap: Record<string, string> = {
  LOGIN: "Auth",
  CASHOUT_REQ: "Cashout",
  PROMO_USED: "Promo",
  POSTBACK: "Postback",
  VPN_BLOCK: "Admin Action",
  API_ERROR: "Admin Action",
};

function tagColor(t: string) {
  switch (t) {
    case "Auth": return "bg-primary/15 text-primary ring-1 ring-primary/30";
    case "Cashout": return "bg-success/15 text-success ring-1 ring-success/30";
    case "Promo": return "bg-orange-500/15 text-orange-300 ring-1 ring-orange-400/30";
    case "Referral": return "bg-violet-500/15 text-violet-300 ring-1 ring-violet-400/30";
    case "Admin Action": return "bg-destructive/15 text-destructive ring-1 ring-destructive/30";
    case "Postback": return "bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-400/30";
    default: return "bg-card/60 text-muted-foreground ring-1 ring-border";
  }
}

function LogsPage() {
  const [f, setF] = useState<(typeof filters)[number]>("All");
  const rows = useMemo(() => mockLogs.map(l => ({ ...l, kind: typeMap[l.action] ?? "Admin Action" })).filter(l => f === "All" || l.kind === f), [f]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="System logs"
        action={
          <button className="inline-flex items-center gap-1.5 rounded-xl glass border border-border px-4 py-2 text-sm font-semibold">
            <Download className="h-4 w-4" /> Export CSV
          </button>
        }
      />

      <div className="flex flex-wrap gap-2">
        {filters.map(x => (
          <button key={x} onClick={() => setF(x)} className={`rounded-full px-3 py-1.5 text-xs border ${f === x ? "bg-gradient-accent text-accent-foreground border-transparent shadow-glow-accent" : "glass"}`}>{x}</button>
        ))}
      </div>

      <div className="rounded-3xl glass shadow-card overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
            <tr>{["Time", "Type", "User", "Action", "Details", "IP"].map(c => <th key={c} className="text-left p-3 px-5 whitespace-nowrap">{c}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map(l => (
              <tr key={l.id} className="hover:bg-card/40">
                <td className="p-3 px-5 font-mono text-xs text-muted-foreground whitespace-nowrap">{l.time}</td>
                <td className="p-3"><span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${tagColor(l.kind)}`}>{l.kind}</span></td>
                <td className="p-3 font-medium">{l.user}</td>
                <td className="p-3 font-mono text-xs">{l.action}</td>
                <td className="p-3 text-muted-foreground">{l.details}</td>
                <td className="p-3 font-mono text-xs text-muted-foreground">{l.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
