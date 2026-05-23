import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { Toggle } from "@/components/admin/StatusBadge";
import { adminAPI } from "@/lib/api";
import { Plus, Pencil, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/promos")({
  head: () => ({ meta: [{ title: "Admin · Promo Codes" }] }),
  component: PromosPage,
});

function PromosPage() {
  const qc = useQueryClient();
  const [code, setCode] = useState("");
  const [xp, setXp] = useState<number>(500);
  const [maxUses, setMaxUses] = useState<number>(0);
  const [expiry, setExpiry] = useState("");
  const [active, setActive] = useState(true);

  const { data } = useQuery({ queryKey: ["admin", "promos"], queryFn: adminAPI.promos });
  const promos: any[] = data?.promos ?? [];

  const createMut = useMutation({
    mutationFn: () => adminAPI.createPromo({ code, xp, maxUses, expiry: expiry || null, active }),
    onSuccess: () => {
      toast.success("Promo created");
      qc.invalidateQueries({ queryKey: ["admin", "promos"] });
      setCode(""); setXp(500); setMaxUses(0); setExpiry("");
    },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? "Create failed"),
  });

  const toggleActive = useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) => adminAPI.editPromo(id, { active }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "promos"] }),
  });

  const delMut = useMutation({
    mutationFn: (id: number) => adminAPI.deletePromo(id),
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin", "promos"] }); },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? "Delete failed"),
  });

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin" title="Promo codes" />

      <section className="rounded-3xl glass p-5 shadow-card">
        <h2 className="font-display text-lg font-bold mb-4">Create promo code</h2>
        <div className="grid md:grid-cols-6 gap-3">
          <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="CODE" className="md:col-span-2 rounded-xl bg-card/60 border border-border px-3 py-2 text-sm uppercase tracking-wider font-mono" />
          <input type="number" value={xp} onChange={(e) => setXp(+e.target.value)} placeholder="XP Reward" className="rounded-xl bg-card/60 border border-border px-3 py-2 text-sm" />
          <input type="number" value={maxUses} onChange={(e) => setMaxUses(+e.target.value)} placeholder="Max uses (0=∞)" className="rounded-xl bg-card/60 border border-border px-3 py-2 text-sm" />
          <input type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} className="rounded-xl bg-card/60 border border-border px-3 py-2 text-sm" />
          <button onClick={() => code.trim() && createMut.mutate()} disabled={createMut.isPending} className="rounded-xl bg-gradient-primary text-primary-foreground px-4 py-2 text-sm font-semibold shadow-glow-primary inline-flex items-center justify-center gap-1.5 disabled:opacity-60">
            <Plus className="h-4 w-4" /> {createMut.isPending ? "…" : "Create"}
          </button>
          <div className="md:col-span-6 flex items-center justify-between rounded-2xl bg-card/60 border border-border p-3">
            <span className="text-sm font-medium">Active</span>
            <Toggle checked={active} onChange={() => setActive(v => !v)} />
          </div>
        </div>
      </section>

      <div className="rounded-3xl glass shadow-card overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
            <tr>{["Code", "XP Reward", "Uses / Max", "Active", "Expiry", "Created", "Actions"].map(c => <th key={c} className="text-left p-3 px-5 whitespace-nowrap">{c}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-border">
            {promos.map(p => (
              <tr key={p.id} className="hover:bg-card/40">
                <td className="p-3 px-5 font-mono font-semibold">{p.code}</td>
                <td className="p-3 font-semibold text-gradient-xp tabular-nums">{Number(p.xp).toLocaleString()}</td>
                <td className="p-3 tabular-nums">{p.uses ?? 0} / {p.maxUses || "∞"}</td>
                <td className="p-3"><Toggle checked={!!p.active} onChange={() => toggleActive.mutate({ id: p.id, active: !p.active })} /></td>
                <td className="p-3 text-muted-foreground">{p.expiry ?? "—"}</td>
                <td className="p-3 text-muted-foreground">{p.createdAt ?? p.claimed}</td>
                <td className="p-3 px-5">
                  <div className="inline-flex gap-1">
                    <button onClick={() => { const xp = prompt("New XP reward", String(p.xp)); if (xp) adminAPI.editPromo(p.id, { xp: +xp }).then(() => qc.invalidateQueries({ queryKey: ["admin", "promos"] })); }} className="rounded-lg bg-card/60 hover:bg-card p-1.5"><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={() => { if (confirm(`Delete ${p.code}?`)) delMut.mutate(p.id); }} className="rounded-lg bg-destructive/15 text-destructive hover:bg-destructive/25 p-1.5"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {promos.length === 0 && <tr><td colSpan={7} className="p-6 text-center text-sm text-muted-foreground">No promo codes yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
