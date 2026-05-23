import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { mockPostbacks, mockPostbackStats, postbackNetworks } from "@/data/mock";
import { Eye, X } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/postback-logs")({
  head: () => ({ meta: [{ title: "Admin · Postback Logs" }] }),
  component: PostbackLogsPage,
});

type Row = (typeof mockPostbacks)[number];

function PostbackLogsPage() {
  const [network, setNetwork] = useState("All");
  const [status, setStatus] = useState("All");
  const [detail, setDetail] = useState<Row | null>(null);

  const rows = useMemo(() => mockPostbacks.filter(p => {
    if (network !== "All" && p.network !== network) return false;
    if (status !== "All" && p.status !== status) return false;
    return true;
  }), [network, status]);

  const stats = [
    { l: "Today's Total", v: mockPostbackStats.total.toLocaleString(), color: "" },
    { l: "Valid", v: mockPostbackStats.valid.toLocaleString(), color: "text-success" },
    { l: "Duplicate Blocked", v: mockPostbackStats.duplicate.toLocaleString(), color: "text-orange-300" },
    { l: "Reversed", v: mockPostbackStats.reversed.toLocaleString(), color: "text-purple-300" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin" title="Postback logs" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.l} className="rounded-2xl glass p-4 shadow-card">
            <div className="text-xs text-muted-foreground">{s.l}</div>
            <div className={`mt-1 font-display text-2xl font-bold tabular-nums ${s.color}`}>{s.v}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <select value={network} onChange={(e) => setNetwork(e.target.value)} className="rounded-xl glass px-3 py-2 text-sm bg-card/60">
          <option>All</option>
          {postbackNetworks.map(n => <option key={n.id}>{n.name}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl glass px-3 py-2 text-sm bg-card/60">
          {["All", "Valid", "Duplicate", "Reversed", "Failed"].map(s => <option key={s}>{s}</option>)}
        </select>
        <input type="date" className="rounded-xl glass px-3 py-2 text-sm bg-card/60" />
        <input type="date" className="rounded-xl glass px-3 py-2 text-sm bg-card/60" />
      </div>

      <div className="rounded-3xl glass shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
              <tr>
                {["Time", "Network", "User", "Offer", "XP", "USD", "Tx ID", "IP", "Status", "Details"].map(c => (
                  <th key={c} className="text-left p-3 px-3 whitespace-nowrap">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map(p => (
                <tr key={p.id} className="hover:bg-card/40">
                  <td className="p-3 font-mono text-[11px] text-muted-foreground whitespace-nowrap">{p.time}</td>
                  <td className="p-3"><span className="rounded-full bg-card/70 border border-border px-2 py-0.5 text-[10px] font-medium">{p.network}</span></td>
                  <td className="p-3 font-medium">{p.user}</td>
                  <td className="p-3 text-muted-foreground max-w-[160px] truncate">{p.offer}</td>
                  <td className="p-3 text-right font-semibold text-gradient-xp tabular-nums">{p.xp.toLocaleString()}</td>
                  <td className="p-3 text-right">${p.usd}</td>
                  <td className="p-3 font-mono text-xs text-muted-foreground">{p.txId}</td>
                  <td className="p-3 font-mono text-xs text-muted-foreground">{p.ip}</td>
                  <td className="p-3"><StatusBadge status={p.status} /></td>
                  <td className="p-3">
                    <button onClick={() => setDetail(p)} className="rounded-lg bg-card/60 hover:bg-card p-1.5"><Eye className="h-3.5 w-3.5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button onClick={() => setDetail(null)} className="absolute inset-0 bg-background/70 backdrop-blur-md" />
          <div className="relative w-full max-w-lg rounded-3xl glass shadow-card animate-page-in overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-display text-lg font-bold">Postback details</h3>
              <button onClick={() => setDetail(null)} className="rounded-lg bg-card/60 hover:bg-card p-1.5"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-5 space-y-3 text-sm">
              <DetailRow label="Status"><StatusBadge status={detail.status} /></DetailRow>
              <DetailRow label="Network">{detail.network}</DetailRow>
              <DetailRow label="User">{detail.user}</DetailRow>
              <DetailRow label="User credited">{detail.credited ? "Yes" : "No"}</DetailRow>
              <DetailRow label="Offer">{detail.offer}</DetailRow>
              <DetailRow label="Transaction ID"><code className="font-mono text-xs">{detail.txId}</code></DetailRow>
              <DetailRow label="XP awarded"><span className="text-gradient-xp font-semibold">{detail.xp.toLocaleString()}</span></DetailRow>
              <DetailRow label="USD value">${detail.usd}</DetailRow>
              <DetailRow label="IP"><code className="font-mono text-xs">{detail.ip}</code></DetailRow>
              <DetailRow label="Time"><code className="font-mono text-xs">{detail.time}</code></DetailRow>
              <div className="pt-3 border-t border-border">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Raw parameters</div>
                <pre className="rounded-xl bg-background/60 border border-border p-3 text-[11px] font-mono overflow-x-auto">{JSON.stringify(detail, null, 2)}</pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5 border-b border-border/60 last:border-0">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <span>{children}</span>
    </div>
  );
}
