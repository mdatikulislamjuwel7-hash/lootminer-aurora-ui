import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { adminAPI } from "@/lib/api";
import { Plus, Save, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/levels")({
  head: () => ({ meta: [{ title: "Admin · Levels" }] }),
  component: LevelsPage,
});

type Row = { id?: number; level: number; requiredXp: number; bonusXp: number; badge: string; color: string };

function LevelsPage() {
  const qc = useQueryClient();
  const colors = ["#22d3ee", "#a855f7", "#f59e0b", "#10b981", "#ef4444", "#6366f1", "#ec4899"];
  const { data } = useQuery({ queryKey: ["admin", "levels"], queryFn: adminAPI.levels });
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    const lv: any[] = data?.levels ?? [];
    setRows(lv.map((l, i) => ({ ...l, color: l.color ?? colors[i % colors.length] })));
  }, [data]);

  const update = (i: number, k: keyof Row, v: string | number) => {
    setRows(r => r.map((row, idx) => idx === i ? { ...row, [k]: v } : row));
  };

  const addLevel = () => {
    const next = rows.length + 1;
    setRows([...rows, { level: next, requiredXp: next * 1500, bonusXp: 100 + next * 50, badge: "Starter", color: colors[next % colors.length] }]);
  };

  const saveMut = useMutation({
    mutationFn: (r: Row) => r.id ? adminAPI.editLevel(r.id, r) : adminAPI.editLevel(r.level, r),
    onSuccess: () => { toast.success("Level saved"); qc.invalidateQueries({ queryKey: ["admin", "levels"] }); },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? "Save failed"),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="Levels & progression"
        action={
          <button onClick={addLevel} className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow-primary">
            <Plus className="h-4 w-4" /> Add Level
          </button>
        }
      />

      <div className="rounded-3xl glass shadow-card overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
            <tr>{["Level #", "Tier", "Name", "XP Required", "Bonus XP", "Color", "Actions"].map(c => <th key={c} className="text-left p-3 px-4 whitespace-nowrap">{c}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r, i) => (
              <tr key={r.level} className="hover:bg-card/40">
                <td className="p-3 px-4 font-display text-lg font-bold tabular-nums">{r.level}</td>
                <td className="p-3">
                  <span className="rounded-full text-[10px] font-bold uppercase tracking-wider px-3 py-1" style={{ background: `${r.color}25`, color: r.color, border: `1px solid ${r.color}40` }}>
                    {r.badge}
                  </span>
                </td>
                <td className="p-3">
                  <input value={r.badge} onChange={(e) => update(i, "badge", e.target.value)} className="rounded-lg bg-card/60 border border-border px-2 py-1 text-sm w-32" />
                </td>
                <td className="p-3">
                  <input type="number" value={r.requiredXp} onChange={(e) => update(i, "requiredXp", +e.target.value)} className="rounded-lg bg-card/60 border border-border px-2 py-1 text-sm w-28 tabular-nums" />
                </td>
                <td className="p-3">
                  <input type="number" value={r.bonusXp} onChange={(e) => update(i, "bonusXp", +e.target.value)} className="rounded-lg bg-card/60 border border-border px-2 py-1 text-sm w-24 tabular-nums" />
                </td>
                <td className="p-3">
                  <input type="color" value={r.color} onChange={(e) => update(i, "color", e.target.value)} className="h-8 w-12 rounded-lg bg-card/60 border border-border cursor-pointer" />
                </td>
                <td className="p-3 px-4">
                  <div className="inline-flex gap-1">
                    <button onClick={() => saveMut.mutate(r)} disabled={saveMut.isPending} className="rounded-lg bg-success/15 text-success hover:bg-success/25 p-1.5 disabled:opacity-60"><Save className="h-3.5 w-3.5" /></button>
                    <button onClick={() => setRows(rows.filter((_, idx) => idx !== i))} className="rounded-lg bg-destructive/15 text-destructive hover:bg-destructive/25 p-1.5"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={7} className="p-6 text-center text-sm text-muted-foreground">No levels yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
