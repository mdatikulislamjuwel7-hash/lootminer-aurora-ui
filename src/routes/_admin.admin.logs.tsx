import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { mockLogs } from "@/data/mock";

const filters = ["All", "Cashout", "Referral", "Promo", "Login", "Postback", "API Error", "Security"];

export const Route = createFileRoute("/_admin/admin/logs")({
  head: () => ({ meta: [{ title: "Admin · Logs" }] }),
  component: () => {
    const [f, setF] = useState("All");
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="Admin" title="System Logs" />
        <div className="flex flex-wrap gap-2">
          {filters.map(x => (
            <button key={x} onClick={() => setF(x)} className={`rounded-full px-3 py-1.5 text-xs border ${f === x ? "bg-gradient-accent text-accent-foreground border-transparent shadow-glow-accent" : "glass"}`}>{x}</button>
          ))}
        </div>
        <div className="rounded-3xl glass shadow-card overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
              <tr>{["Time", "User", "Action", "Details", "IP", "Level"].map(c => <th key={c} className="text-left p-3 px-5">{c}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockLogs.map(l => (
                <tr key={l.id} className="hover:bg-card/40">
                  <td className="p-3 px-5 font-mono text-xs text-muted-foreground">{l.time}</td>
                  <td className="p-3">{l.user}</td>
                  <td className="p-3 font-mono text-xs">{l.action}</td>
                  <td className="p-3 text-muted-foreground">{l.details}</td>
                  <td className="p-3 font-mono text-xs text-muted-foreground">{l.ip}</td>
                  <td className="p-3"><span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${l.level === "info" ? "bg-primary/15 text-primary" : l.level === "warn" ? "bg-warning/15 text-warning" : "bg-destructive/15 text-destructive"}`}>{l.level}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  },
});
