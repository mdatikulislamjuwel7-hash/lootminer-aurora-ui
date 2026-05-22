import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { mockAdminUsers } from "@/data/mock";
import { Pencil, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/users")({
  head: () => ({ meta: [{ title: "Admin · Users — LootMiner" }] }),
  component: () => {
    const [tab, setTab] = useState<"All" | "Active" | "Banned">("All");
    const list = mockAdminUsers.filter(u =>
      tab === "All" ? true : tab === "Banned" ? u.banned : !u.banned
    );
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="Admin" title="Users" />
        <div className="flex items-center gap-2">
          {(["All", "Active", "Banned"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`rounded-full px-3 py-1.5 text-sm border ${tab === t ? "bg-gradient-primary text-primary-foreground border-transparent shadow-glow-primary" : "glass"}`}>{t}</button>
          ))}
          <input placeholder="Search…" className="ml-auto rounded-xl glass px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div className="rounded-3xl glass shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                <tr>
                  <th className="text-left p-3 px-5">User</th>
                  <th className="text-left p-3">User ID</th>
                  <th className="text-left p-3 hidden md:table-cell">Email</th>
                  <th className="text-right p-3">Level</th>
                  <th className="text-right p-3">XP</th>
                  <th className="text-center p-3">Role</th>
                  <th className="text-right p-3 px-5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {list.map(u => (
                  <tr key={u.id} className="hover:bg-card/40">
                    <td className="p-3 px-5">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-primary text-xs font-bold text-primary-foreground">{u.avatar}</div>
                        <span className="font-medium">{u.username}</span>
                        {u.banned && <span className="rounded-full bg-destructive/15 text-destructive text-[9px] font-semibold px-2 py-0.5">BANNED</span>}
                      </div>
                    </td>
                    <td className="p-3 font-mono text-xs text-muted-foreground">{u.userID}</td>
                    <td className="p-3 hidden md:table-cell text-muted-foreground">{u.email}</td>
                    <td className="p-3 text-right">{u.level}</td>
                    <td className="p-3 text-right tabular-nums text-gradient-xp font-semibold">{u.balance.toLocaleString()}</td>
                    <td className="p-3 text-center"><span className="rounded-full bg-card/60 px-2 py-0.5 text-[10px] border border-border">{u.role}</span></td>
                    <td className="p-3 px-5 text-right">
                      <div className="inline-flex gap-1">
                        <button className="rounded-lg bg-card/60 hover:bg-card p-1.5"><Pencil className="h-3.5 w-3.5" /></button>
                        <button className="rounded-lg bg-destructive/15 text-destructive hover:bg-destructive/25 p-1.5"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  },
});
