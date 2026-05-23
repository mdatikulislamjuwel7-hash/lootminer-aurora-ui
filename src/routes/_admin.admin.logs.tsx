import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/common/PageHeader";
import { adminAPI } from "@/lib/api";
import { Download } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/logs")({
  head: () => ({ meta: [{ title: "Admin · Logs" }] }),
  component: LogsPage,
});

const filters = ["All", "Auth", "Cashout", "Promo", "Referral", "Admin Action", "Postback"] as const;

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
  const [page, setPage] = useState(1);
  const { data } = useQuery({
    queryKey: ["admin", "logs", { f, page }],
    queryFn: () => adminAPI.logs({ kind: f === "All" ? undefined : f, page }),
  });
  const rows: any[] = data?.logs ?? [];

  const exportCsv = () => {
    const headers = ["Time", "Type", "User", "Action", "Details", "IP"];
    const lines = [headers.join(","), ...rows.map(l => [l.time ?? l.createdAt, l.kind, l.user, l.action, JSON.stringify(l.details ?? ""), l.ip].map(v => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","))];
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `logs-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="System logs"
        action={
          <button onClick={exportCsv} className="inline-flex items-center gap-1.5 rounded-xl glass border border-border px-4 py-2 text-sm font-semibold">
            <Download className="h-4 w-4" /> Export CSV
          </button>
        }
      />

      <div className="flex flex-wrap gap-2">
        {filters.map(x => (
          <button key={x} onClick={() => { setF(x); setPage(1); }} className={`rounded-full px-3 py-1.5 text-xs border ${f === x ? "bg-gradient-accent text-accent-foreground border-transparent shadow-glow-accent" : "glass"}`}>{x}</button>
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
                <td className="p-3 px-5 font-mono text-xs text-muted-foreground whitespace-nowrap">{l.time ?? l.createdAt}</td>
                <td className="p-3"><span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${tagColor(l.kind)}`}>{l.kind}</span></td>
                <td className="p-3 font-medium">{l.user ?? l.username ?? "—"}</td>
                <td className="p-3 font-mono text-xs">{l.action}</td>
                <td className="p-3 text-muted-foreground max-w-md truncate">{typeof l.details === "string" ? l.details : JSON.stringify(l.details ?? "")}</td>
                <td className="p-3 font-mono text-xs text-muted-foreground">{l.ip}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-sm text-muted-foreground">No logs.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-1">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="rounded-lg glass px-3 py-1 text-xs disabled:opacity-40">‹ Prev</button>
        <span className="rounded-lg bg-gradient-primary text-primary-foreground px-3 py-1 text-xs">{page}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={rows.length < 50} className="rounded-lg glass px-3 py-1 text-xs disabled:opacity-40">Next ›</button>
      </div>
    </div>
  );
}
