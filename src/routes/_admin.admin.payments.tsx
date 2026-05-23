import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { Toggle } from "@/components/admin/StatusBadge";
import { adminAPI } from "@/lib/api";
import { Plus, Pencil, X, Wallet, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/payments")({
  head: () => ({ meta: [{ title: "Admin · Payment Methods" }] }),
  component: PaymentsPage,
});

type Draft = {
  id?: number;
  name: string; iconUrl: string; gradient: string;
  minXp: number; fee: number; time: string; enabled: boolean;
};

const emptyDraft: Draft = {
  name: "", iconUrl: "", gradient: "from-cyan-500 to-blue-600",
  minXp: 500, fee: 0, time: "Instant", enabled: true,
};

function PaymentsPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState<Draft | null>(null);

  const { data } = useQuery({ queryKey: ["admin", "payments"], queryFn: adminAPI.payments });
  const items: any[] = data?.methods ?? [];

  const toggleMut = useMutation({
    mutationFn: ({ id, enabled }: { id: number; enabled: boolean }) => adminAPI.editPayment(id, { enabled }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "payments"] }),
  });

  const saveMut = useMutation({
    mutationFn: (d: Draft) => d.id ? adminAPI.editPayment(d.id, d) : adminAPI.createPayment(d),
    onSuccess: () => { toast.success("Saved"); qc.invalidateQueries({ queryKey: ["admin", "payments"] }); setModal(null); },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? "Save failed"),
  });

  const delMut = useMutation({
    mutationFn: (id: number) => adminAPI.deletePayment(id),
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin", "payments"] }); },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="Payment methods"
        action={
          <button onClick={() => setModal({ ...emptyDraft })} className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow-primary">
            <Plus className="h-4 w-4" /> Add Method
          </button>
        }
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(p => (
          <div key={p.id} className="relative overflow-hidden rounded-3xl glass p-5 shadow-card">
            <div className={`absolute inset-0 bg-gradient-to-br ${p.gradient ?? "from-cyan-500 to-blue-600"} opacity-40 pointer-events-none`} />
            <div className="relative flex items-start justify-between">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${p.gradient ?? "from-cyan-500 to-blue-600"} border border-border shadow-card overflow-hidden`}>
                {p.iconUrl ? <img src={p.iconUrl} alt="" className="h-full w-full object-cover" /> : <Wallet className="h-6 w-6" />}
              </div>
              <Toggle checked={!!p.enabled} onChange={() => toggleMut.mutate({ id: p.id, enabled: !p.enabled })} />
            </div>
            <div className="relative mt-4">
              <div className="font-display text-lg font-bold">{p.name}</div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                <Stat label="Min XP" value={Number(p.minXp).toLocaleString()} />
                <Stat label="Fee" value={`${p.fee}%`} />
                <Stat label="Time" value={p.time} />
              </div>
              <div className="relative mt-4 flex gap-1.5">
                <button onClick={() => setModal({ ...emptyDraft, ...p })} className="inline-flex items-center gap-1.5 rounded-xl glass px-3 py-1.5 text-xs"><Pencil className="h-3 w-3" /> Edit</button>
                <button onClick={() => { if (confirm(`Delete ${p.name}?`)) delMut.mutate(p.id); }} className="inline-flex items-center gap-1.5 rounded-xl bg-destructive/15 text-destructive px-3 py-1.5 text-xs"><Trash2 className="h-3 w-3" /> Delete</button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="col-span-full p-10 text-center text-sm text-muted-foreground rounded-3xl glass">No payment methods yet.</div>}
      </div>

      {modal && <PaymentModal draft={modal} onChange={setModal} onClose={() => setModal(null)} onSave={() => saveMut.mutate(modal)} saving={saveMut.isPending} />}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-card/60 border border-border p-2">
      <div className="text-[9px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold tabular-nums truncate">{value}</div>
    </div>
  );
}

function PaymentModal({ draft, onChange, onClose, onSave, saving }: { draft: Draft; onChange: (d: Draft) => void; onClose: () => void; onSave: () => void; saving: boolean }) {
  const upd = <K extends keyof Draft>(k: K, v: Draft[K]) => onChange({ ...draft, [k]: v });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button onClick={onClose} className="absolute inset-0 bg-background/70 backdrop-blur-md" />
      <div className="relative w-full max-w-lg rounded-3xl glass shadow-card animate-page-in overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-display text-lg font-bold">{draft.id ? "Edit payment method" : "Add payment method"}</h3>
          <button onClick={onClose} className="rounded-lg bg-card/60 hover:bg-card p-1.5"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-5 grid grid-cols-2 gap-4">
          <Field label="Name" full><input value={draft.name} onChange={(e) => upd("name", e.target.value)} className="w-full rounded-xl bg-card/60 border border-border px-3 py-2 text-sm" /></Field>
          <Field label="Icon URL" full><input value={draft.iconUrl} onChange={(e) => upd("iconUrl", e.target.value)} placeholder="https://…" className="w-full rounded-xl bg-card/60 border border-border px-3 py-2 text-sm" /></Field>
          <Field label="Gradient (tailwind)" full><input value={draft.gradient} onChange={(e) => upd("gradient", e.target.value)} placeholder="from-cyan-500 to-blue-600" className="w-full rounded-xl bg-card/60 border border-border px-3 py-2 text-sm" /></Field>
          <Field label="Min XP"><input type="number" value={draft.minXp} onChange={(e) => upd("minXp", +e.target.value)} className="w-full rounded-xl bg-card/60 border border-border px-3 py-2 text-sm" /></Field>
          <Field label="Fee %"><input type="number" value={draft.fee} onChange={(e) => upd("fee", +e.target.value)} className="w-full rounded-xl bg-card/60 border border-border px-3 py-2 text-sm" /></Field>
          <Field label="Processing Time" full><input value={draft.time} onChange={(e) => upd("time", e.target.value)} placeholder="Instant / ~30 min / 1–3 days" className="w-full rounded-xl bg-card/60 border border-border px-3 py-2 text-sm" /></Field>
          <div className="col-span-2 flex items-center justify-between rounded-2xl bg-card/60 border border-border p-3">
            <span className="text-sm font-medium">Enabled</span>
            <Toggle checked={draft.enabled} onChange={() => upd("enabled", !draft.enabled)} />
          </div>
        </div>
        <div className="flex justify-end gap-2 p-5 border-t border-border">
          <button onClick={onClose} className="rounded-xl glass px-4 py-2 text-sm">Cancel</button>
          <button onClick={onSave} disabled={saving} className="rounded-xl bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow-primary disabled:opacity-60">{saving ? "Saving…" : "Save"}</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block ${full ? "col-span-2" : ""}`}>
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
